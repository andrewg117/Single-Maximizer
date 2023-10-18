import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sendEmail } from "../features/email/emailSlice";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";

function Email() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { isLoading, isError, message } = useSelector((state) => state.email);

  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [emailMessage, setMessage] = useState("");

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (!user) {
      navigate("/home");
    }
  }, [user, navigate, isError, message]);

  const onSubmit = (e) => {
    e.preventDefault();

    dispatch(sendEmail({ recipient, subject, emailMessage }));
    setRecipient("");
    setSubject("");
    setMessage("");
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <label>
          Recipient:
          <input
            name="recipient"
            type="email"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </label>
        <label>
          Subject:
          <input
            name="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </label>
        <label>
          Message:
          <textarea
            name="emailMessage"
            value={emailMessage}
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>
        <button type="submit">Send</button>
      </form>
    </>
  );
}

export default Email;
