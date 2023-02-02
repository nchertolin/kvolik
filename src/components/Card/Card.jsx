import React from 'react'
import { Link } from 'react-router-dom';
import styles from './Card.module.scss';
import star from '../../assets/icons/star.svg';
import starFill from '../../assets/icons/star-fill.svg';

export default function Card({ name, shortName, picture, nameEng, type, releaseFrom, episodesAmount, averageRating }) {
  return (
    <div className={styles.card}>
      <Link to={`/${shortName}`}>
        <div className={styles.pictureWrapper}>
          <img className={styles.picture} src={picture} alt="" />
          <div className={styles.absolute}>
            <p>{averageRating}</p>
            {/* <button className={styles.favorite}><img src={star} alt="В избранное" /></button> */}
          </div>
        </div>
        <h3>{nameEng}</h3>
        <h2>{name}</h2>
      </Link>
      <h3>{type} / {episodesAmount} / {releaseFrom.substring(0, 4)}</h3>
    </div>
  )
}
