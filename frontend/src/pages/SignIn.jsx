import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { login, reset } from "../features/auth/authSlice";
import Spinner from "../components/Spinner";
import SMLogo from "../images/single-maximizer-logo-white-text-1024x717.png.webp";
import signinImage from "../images/signinImage.png";
import styles from "../css/sign_in_style.module.css";

function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (user) {
      navigate("/profile");
    }

    return () => {
      dispatch(reset());
      toast.clearWaitingQueue();
    };
  }, [user, isError, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    dispatch(login(userData))
      .unwrap()
      .then(() => navigate("/profile"))
      .catch((error) => toast.error((error = "Invalid Credentials")));
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
            style={{ backgroundImage: `url(${signinImage})` }}
          ></div>

          <div id={styles.block_right}>
            <img
              src={SMLogo}
              alt="Home"
              id={styles.logo}
            />
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
                <label htmlFor="pword">PASSWORD</label>
                <input
                  type="password"
                  className={styles.signin_input}
                  id="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                />
                <Link
                  to={"/home/forgotpass"}
                  className={styles.signin_link}
                >
                  Forgot Password?
                </Link>
                <div className={styles.submit_div}>
                  <input
                    type="submit"
                    id={styles.signin_submit}
                    value="SUBMIT"
                  />
                </div>
              </div>
            </form>
          </div>
        </section>
      </section>
    </>
  );
}

export default SignIn;
