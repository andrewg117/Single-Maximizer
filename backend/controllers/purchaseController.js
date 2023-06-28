const asyncHandler = require('express-async-handler')
const stripe = require('stripe')(process.env.SK_TEST)

const YOUR_DOMAIN = 'http://localhost:3000/'

const payment = asyncHandler(async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: 'price_1NNh7rFOk6NyPVsVGSoBA4pY',
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}profile/checkoutpage?success=true`,
    cancel_url: `${YOUR_DOMAIN}profile/checkoutpage?canceled=true`,
  })
  
  res.json(session.url)

})

const getPayment = asyncHandler(async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(process.env.SK_RETRIEVE)
  console.log(session)
  
  res.json(session)
})

module.exports = {
  payment,
  getPayment
}