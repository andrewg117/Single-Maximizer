import styles from '../css/new_release_style.module.css'

const CheckBox = (props) => {
  return (
    <>
      <input
        name={props.item}
        type='checkbox'
        value={props.item}
        checked={props.list.includes(props.item)}
        onChange={props.onChange}
      />
      <label htmlFor={props.item}>{props.item}</label>
    </>
  )
}

function GenreCheckBox({ changeList, list }) {
  const genreList = ['CHH', 'Hip Hop', 'Gospel', 'R&B', 'Pop', 'Rock', 'CCM']

  const onChange = (e) => {
    // Add to list if checked
    if (e.target.checked && !list.includes(e.target.value)) {
      changeList((prevState) => ({
        ...prevState,
        genres: [
          ...list,
          e.target.value
        ]
      }))
    } 
    // Remove from list if unchecked
    if (!e.target.checked) {
      changeList((prevState) => ({
        ...prevState,
        genres: list.filter(item => item !== e.target.value)
      }))
    }
  }

  return (
    <fieldset id={styles.checkboxlist}>
      {genreList.map((item, i) => {
        return (
            <CheckBox
              key={i}
              item={item}
              list={list}
              onChange={onChange}
            />
        )
      })}
    </fieldset>
  )
}

export default GenreCheckBox