const e = require('express')
const asyncHandler = require('express-async-handler')
const stripe = require('stripe')(process.env.SK_TEST)

const YOUR_DOMAIN = 'http://localhost:3000/'

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.SK_ENDPOINT

const postPayment = asyncHandler(async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: 'price_1NNh7rFOk6NyPVsVGSoBA4pY',
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}profile/singles?success=true`,
    cancel_url: `${YOUR_DOMAIN}profile/checkoutpage?canceled=true`,
    client_reference_id: req.user.id.toString(),
  })
  
  res.json(session.url)

})


const fulfillOrder = (lineItems) => {
  // TODO: fill me in
  console.log("Fulfilling order", lineItems)
}

// @desc    Post endpoint
// @route   POST /api/webhook
// @access  Private
// Card 4242 4242 4242 4242
const postEndpoint = asyncHandler(async (req, res) => {
  const payload = req.body
  const sig = req.headers['stripe-signature']

  let event

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret)
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    // Retrieve the session. If you require line items in the res, you may include them by expanding line_items.
    const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
      event.data.object.id,
      {
        expand: ['line_items'],
      }
    )
    const lineItems = sessionWithLineItems.line_items

    // Fulfill the purchase...
    // fulfillOrder(lineItems)
    // console.log(sessionWithLineItems)
  }

  res.status(200).end()
})

module.exports = {
  postPayment,
  postEndpoint
}