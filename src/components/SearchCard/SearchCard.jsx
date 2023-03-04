import React from 'react'
import { Link } from 'react-router-dom';
import styles from './SearchCard.module.scss';

export default function SearchCard({ shortName, picture, name, nameEng, releaseFrom, type }) {
  return (
    <Link to={shortName} className={styles.card}>
      <img className={styles.picture} src={picture} alt="" />
      <div className={styles.info}>
        <h1>{name}</h1>
        <h2>{nameEng}</h2>
        <p>{releaseFrom.substring(0, 4)} / {type}</p>
      </div>
    </Link>
  )
}
