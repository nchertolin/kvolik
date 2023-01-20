import React, { useState } from 'react';
import styles from './Rating.module.scss';
import star from '../../assets/icons/star.svg';
import starFill from '../../assets/icons/star-fill.svg';
import close from '../../assets/icons/close.svg';
import { v4 } from 'uuid';

export default function Rating({ reference }) {
  const [score, setScore] = useState([0, 0, 0, 0, 0]);

  function fillStars(index) {
    const newRating = [0, 0, 0, 0, 0];
    while (index >= 0) {
      newRating.unshift(1);
      index--;
    }
    setScore(newRating.slice(0, 5));
  }

  return (
    <div ref={reference} className={styles.rating}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h1>Ваша оценка</h1>
          <button onClick={() => {
            reference.current.style.opacity = 0;
            reference.current.style.pointerEvents = 'none';
          }}><img className={styles.close} src={close} alt="" /></button>
        </div>
        <ul className={styles.stars}>
          {score.map((element, index) => <li key={v4()}><button
            onClick={() => fillStars(index)}><img src={score[index] === 0 ? star : starFill} alt="" /></button></li>)}
        </ul>
        <button className={styles.submit}>Оценить</button>
      </div>
    </div>
  )
}
