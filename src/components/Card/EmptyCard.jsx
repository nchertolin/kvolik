import React from 'react'
import { Link } from 'react-router-dom';
import styles from './Card.module.scss';
import placeholder from '../../assets/icons/placeholder.svg';

export default function EmptyCard({ shortName }) {
  return (
    <div className={styles.card}>
      <Link to={`/${shortName}`}>
        <div className={styles.pictureWrapper}>
          <img className={styles.picture}
            src={placeholder} alt="" />
        </div>
        <div className={styles.info}>
          <h3>Add new anime</h3>
          <h2>Добавить новое аниме</h2>
          <h3>Фильм / 12 серий / год выпуска</h3>
        </div>
      </Link>
    </div>
  )
}
