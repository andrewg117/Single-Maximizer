import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { makePurchase, getPurchase, reset as resetPurchase } from '../features/purchace/purchaseSlice'
import { toast } from 'react-toastify'
// import styles from '../css/new_release_style.module.css'

const ProductDisplay = () => {
  const dispatch = useDispatch()

  const onSubmit = (e) => {
    e.preventDefault()
    dispatch(makePurchase())
      .unwrap()
      .then((data) => {
        window.location.href = data
      })
  }

  return (
    <section>
      <div className="product">
        <img
          src="https://trackstarz.com/wp-content/uploads/2021/06/single-maximizer-logo-white-text-1024x717.png.webp"
          alt="Single Maximizer"
        />
        <div className="description">
          <h1>Create New Single</h1>
          <h5>$50.00</h5>
        </div>
      </div>
      <form onSubmit={onSubmit}>
        <button type="submit">
          Purchase
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
  const dispatch = useDispatch()

  const [message, setMessage] = useState("")

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search)

    if (query.get("success")) {
      dispatch(getPurchase())
      setMessage("Order placed! You will receive an email confirmation.")
    }

    if (query.get("canceled")) {
      toast.info("Order canceled")
    }
    return () => {
      toast.clearWaitingQueue()
      dispatch(resetPurchase())
    }
  }, [dispatch])

  return message ? (
    <Message message={message} />
  ) : (
    <ProductDisplay />
  )
}

export default CheckoutPage