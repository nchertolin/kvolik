import React, { useState } from 'react';
import styles from './Rating.module.scss';
import star from '../../assets/icons/star.svg';
import starFill from '../../assets/icons/star-fill.svg';
import close from '../../assets/icons/close.svg';
import { v4 } from 'uuid';
import { URL } from '../../App';
import { useRef } from 'react';
import { showRating } from '../AnimeDesktop/AnimeDesktop';

export default function Rating({ reference, shortName }) {
  const [isSubmited, setSubmited] = useState();
  const [score, setScore] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const submit = useRef();
  const submited = useRef();
  const error = useRef();

  function fillStars(index) {
    const newRating = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    while (index >= 0) {
      newRating.unshift(1);
      index--;
    }
    setScore(newRating.slice(0, 10));
  }

  function showError() {
    error.current.style.display = 'block';
    setTimeout(() => {
      error.current.style.display = 'none';
    }, 5000);
  }

  function disableButton(isDisable) {
    setSubmited(isDisable ? true : false);
    submit.current.style.display = isDisable ? 'none' : 'block';
    submited.current.style.display = isDisable ? 'block' : 'none';
  }

  function rate() {
    disableButton(true);
    const grade = score.filter(rate => rate === 1).length;
    fetch(`${URL}/api/anime/${shortName}/rating`, {
      method: 'POST', body: JSON.stringify({ grade: grade })
    })
      .then(response => {
        if (response.ok) {
          showRating(reference, false);
        } else throw new Error();
      })
      .catch(showError)
      .finally(() => disableButton(false));
  }

  return (
    <div ref={reference} className={styles.rating}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h1>Ваша оценка</h1>
          <button onClick={() => showRating(reference, false)}><img className={styles.close} src={close} alt="" /></button>
        </div>
        <ul className={styles.stars}>
          {score.map((element, index) => <li key={v4()}><button disabled={isSubmited}
            onClick={() => fillStars(index)}><img src={score[index] === 0 ? star : starFill} alt="" /></button></li>)}
        </ul>
        <button ref={submit} className={styles.submit} onClick={rate}
          disabled={!score.filter(rate => rate === 1).length}>Оценить</button>
        <button ref={submited} className={styles.submited} disabled>Отправка...</button>
        <p ref={error} className={styles.error}>
          Возникла ошибка при отправке, попробуйте позже. Возможно вы не вошли вошли в аккаунт.
        </p>
      </div>
    </div>
  )
}
