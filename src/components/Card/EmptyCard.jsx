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
        <div className={styles.emptyInfo}>
          <div className={styles.emptyNameEng}></div>
          <div className={styles.emptyName}></div>
          <div className={styles.emptyAbout}></div>
        </div>
      </Link>
    </div>
  )
}
