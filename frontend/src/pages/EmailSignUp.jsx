import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { emailUser } from "../features/auth/authSlice";
import Spinner from "../components/Spinner";
import SMLogo from "../images/single-maximizer-logo-white-text-1024x717.png.webp";
import signupImage from "../images/signupImage.png";
import styles from "../css/sign_in_style.module.css";

function EmailSignUp() {
  const [formData, setFormData] = useState({
    email: "",
  });

  const { email } = formData;

  const [emailSent, setEmailSent] = useState(false);

  const dispatch = useDispatch();

  const { isLoading, isError, message } = useSelector((state) => state.auth);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (isError) {
      toast.error(message, { id: message });
    } else if (email === "") {
      toast.error("Add Email");
    } else {
      dispatch(emailUser({ email, type: "register" }))
        .unwrap()
        .then(() => {
          setEmailSent(true);
        })
        .catch((error) =>
          toast.error((error = "User exists, use a different email or login"))
        );
    }
  };

  const resendEmail = (e) => {
    e.preventDefault();

    dispatch(emailUser({ email, type: "register" }))
      .unwrap()
      .then(() => {
        setEmailSent(true);
      })
      .catch((error) => console.error(error));
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <section id={styles.sign_in_wrapper}>
        <section id={styles.sign_in_content}>
          <div
            id={styles.block_left}
            style={{ backgroundImage: `url(${signupImage})` }}
          ></div>

          <div id={styles.block_right}>
            <img
              src={SMLogo}
              alt="Home"
              id={styles.logo}
            />
            {/* <h1>Sign In</h1> */}
            {emailSent === false ? (
              <form
                id={styles.signin_form}
                onSubmit={onSubmit}
              >
                <div className={styles.signin_form_div}>
                  <label htmlFor="email">EMAIL</label>
                  <input
                    type="email"
                    className={styles.signin_input}
                    id="email"
                    name="email"
                    value={email}
                    onChange={onChange}
                  />
                  <div className={styles.submit_div}>
                    <input
                      type="submit"
                      id={styles.signin_submit}
                      value="SUBMIT"
                    />
                  </div>
                </div>
              </form>
            ) : (
              <form
                id={styles.signin_form}
                onSubmit={resendEmail}
              >
                <div className={styles.signin_form_div}>
                  <h1>Check your email to register your account</h1>
                  <h3>{email}</h3>
                  <div className={styles.submit_div}>
                    <input
                      type="submit"
                      id={styles.signin_submit}
                      value="RESEND EMAIL"
                    />
                  </div>
                </div>
              </form>
            )}
          </div>
        </section>
      </section>
    </>
  );
}

export default EmailSignUp;
