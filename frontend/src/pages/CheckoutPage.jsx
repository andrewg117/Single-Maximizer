import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { makePurchase } from '../features/purchace/purchaseSlice' 

const ProductDisplay = () => {
  const dispatch = useDispatch()

  const onSubmit = (e) => {
    e.preventDefault()
    dispatch(makePurchase())
  }

  return (
    <section>
      <div className="product">
        <img
          src="https://trackstarz.com/wp-content/uploads/2021/06/single-maximizer-logo-white-text-1024x717.png.webp"
          alt="The cover of Stubborn Attachments"
        />
        <div className="description">
        <h3>Stubborn Attachments</h3>
        <h5>$20.00</h5>
        </div>
      </div>
      <form onSubmit={onSubmit}>
        <button type="submit">
          Checkout
        </button>
      </form>
    </section>
  )
}

const Message = ({ message }) => (
  <section>
    <p>{message}</p>
  </section>
)

function CheckoutPage() {
  const [message, setMessage] = useState("")

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search)

    if (query.get("success")) {
      setMessage("Order placed! You will receive an email confirmation.")
    }

    if (query.get("canceled")) {
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      )
    }
  }, [])

  return message ? (
    <Message message={message} />
  ) : (
    <ProductDisplay />
  )
}

export default CheckoutPage