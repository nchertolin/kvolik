import React from 'react'
import { Link } from 'react-router-dom';
import styles from './Card.module.scss';

export default function Card({ name, shortName, picture, nameEng, type, releaseFrom, episodesAmount }) {
  return (
    <div className={styles.card}>
      <Link to={`/${shortName}`}>
        <img src={picture} alt="картинка" />
        <h3>{nameEng}</h3>
        <h2>{name}</h2>
      </Link>
      <h3>{type} / {episodesAmount} / {releaseFrom}</h3>
    </div>
  )
}
