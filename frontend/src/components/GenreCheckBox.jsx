import { useEffect } from 'react'
import styles from '../css/new_release_style.module.css'

function GenreCheckBox({ changeList, list }) {
  const genreList = ['CHH', 'Hip Hop', 'Gospel', 'R&B', 'Pop', 'Rock', 'CCM']

  const onChange = (e) => {
    // console.log(e.target.checked)
    // console.log(genreList.indexOf(e.target.value))
    if (e.target.checked && !list.includes(e.target.value)) {
      changeList((prevState) => ({
        ...prevState,
        genres: [
          ...list,
          e.target.value
        ]
      }))
    } else if (!e.target.checked && list.includes(e.target.value)) {
      changeList((prevState) => ({
        ...prevState,
        genres: list.filter(item => item !== e.target.value)
      }))
    }
  }

  useEffect(() => {
    console.log(list)
  }, [list])

  return (
    <fieldset id={styles.checkboxlist}>
      {genreList.map((item, i) => {
        return (
          <>
            <input
              name={item}
              type='checkbox'
              key={i}
              value={item}
              defaultChecked={list.includes(item)}
              onChange={onChange}
            />
            <label htmlFor={item}>{item}</label>
          </>
        )
      })}
      {/* {console.log(list.includes(item))} */}
    </fieldset>
  )
}

export default GenreCheckBox