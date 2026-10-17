import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUser } from "../features/auth/authSlice";
import {
  makePurchase,
  reset as resetPurchase,
} from "../features/purchace/purchaseSlice";
import { toast } from "react-toastify";
import { MAX_TRACKS } from "../config/limits";
import SMLogo from "../images/Single-Maximizer-Package-Mockup-1024x616.png.webp";
import styles from "../css/checkout.module.css";

const ProductDisplay = ({ atLimit }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(makePurchase())
      .unwrap()
      .then(() => {
        toast.success("Purchase Successful");
        navigate("/profile/newrelease");
      })
      // The server's message, e.g. the track limit
      .catch((err) => toast.error(err));
  };

  return (
    <section id={styles.profile_content_right}>
      <div className={styles.div_item}>
        <img
          src={SMLogo}
          alt="Single Maximizer"
          id={styles.logo}
        />
      </div>
      <div className={styles.div_item}>
        <form
          id={styles.checkout_form}
          onSubmit={onSubmit}
        >
          <div id={styles.description}>
            <h1>Purchase New Single</h1>
            <h5>
              {
                "The Single Maximizer is $50. This is a demo, so no payment is taken: clicking ‘Purchase’ adds a single credit to your account right away."
              }
            </h5>
          </div>
          {atLimit ? (
            <p>
              You've reached the {MAX_TRACKS}-single limit for the demo. Delete
              a single to make room.
            </p>
          ) : (
            <button
              type="submit"
              id={styles.submit}
            >
              Purchase
            </button>
          )}
        </form>
      </div>
    </section>
  );
};

function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getUser())
      .unwrap()
      .then((data) => {
        if (data.trackAllowance > 0) {
          navigate("/profile/newrelease");
        }
      })
      .catch((err) => console.error(err));

    return () => {
      dispatch(resetPurchase());
    };
  }, [dispatch, navigate, user?.trackAllowance]);

  // Tracks the user has plus unspent credits; the server enforces the same cap
  const atLimit =
    (user?.trackCount ?? 0) + (user?.trackAllowance ?? 0) >= MAX_TRACKS;

  return <ProductDisplay atLimit={atLimit} />;
}

export default CheckoutPage;
