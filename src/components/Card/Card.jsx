import React from 'react'
import { Link } from 'react-router-dom';
import styles from './Card.module.scss';

export default function Card({ name, shortName, picture, genre }) {
  return (
    <div className={styles.card}>
      <Link to={`/${shortName}`}>
        <img src={picture} alt="картинка" />
        <h2>{name}</h2>
      </Link>
      <h3>{genre}</h3>
    </div>
  )
}
