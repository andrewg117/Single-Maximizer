const asyncHandler = require('express-async-handler')
const stripe = require('stripe')(process.env.SK_TEST)

const YOUR_DOMAIN = 'http://localhost:' + process.env.PORT

const payment = asyncHandler(async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: '{{PRICE_ID}}',
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}?success=true`,
    cancel_url: `${YOUR_DOMAIN}?canceled=true`,
  });

  res.redirect(303, session.url);

  // res.json()
})

module.exports = {
  payment,
}