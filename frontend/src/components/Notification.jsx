import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { sendEmail } from '../features/email/emailSlice';
import { toast } from 'react-toastify'

function Notification({ trackTitle, artist, deliveryDate, style }) {
  const dispatch = useDispatch()

  const { isError, message } = useSelector((state) => state.email)

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }
  }, [isError, message])

  const recipient = process.env.REACT_APP_RECEMAIL
  const subject = `Track ${trackTitle} is scheduled.`
  const emailMessage = `Track ${trackTitle} will be sent by ${deliveryDate}.`


  const onClick = (e) => {
    e.preventDefault()

    if (trackTitle !== '' || artist !== '' || deliveryDate !== '') {
      dispatch(sendEmail({ recipient, subject, emailMessage }))
    }
  }

  return (
    <>
      <input
        type="submit"
        className={style}
        value="SAVE"
        onClick={onClick}
      />
    </>
  )
}

export default Notification