import styles from '../css/style.module.css'

// TODO: Change loading to Logo

function Spinner() {
  return (
    <div className={styles.loadingSpinnerContainer}>
      <div className={styles.loadingSpinner}></div>
    </div>
  )
}

export default Spinner