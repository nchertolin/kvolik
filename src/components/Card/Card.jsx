import React from 'react'
import { Link } from 'react-router-dom';
import styles from './Card.module.scss';

export default function Card({ name, shortName, picture, nameEng, type, releaseFrom, episodesAmount, averageRating }) {
  return (
    <div className={styles.card}>
      <Link to={`/${shortName}`}>
        <div className={styles.pictureWrapper}>
          <img src={picture} alt="" />
          <div className={styles.ratingWrapper}>
            <p>{averageRating}</p>
          </div>
        </div>
        <h3>{nameEng}</h3>
        <h2>{name}</h2>
      </Link>
      <h3>{type} / {episodesAmount} / {releaseFrom.substring(0, 4)}</h3>
    </div>
  )
}
