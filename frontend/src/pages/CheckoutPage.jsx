import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { makePurchase, getPurchase, reset as resetPurchase } from '../features/purchace/purchaseSlice'
import { toast } from 'react-toastify'
import SMLogo from '../images/single-maximizer-logo-white-text-1024x717.png.webp'
import styles from '../css/checkout.module.css'

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
    <section id={styles.profile_content_right}>
      <div id={styles.product}>
        <img src={SMLogo} alt="Single Maximizer" id={styles.logo} />
      </div>
      <form onSubmit={onSubmit}>
        <div id={styles.description}>
          <h1>Purchase New Single</h1>
          <h5>$50.00</h5>
        </div>
        <button type="submit" id={styles.submit}>
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
      // toast.clearWaitingQueue()
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