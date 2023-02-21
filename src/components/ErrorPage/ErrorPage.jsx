import React from 'react'
import { Link } from 'react-router-dom';
import styles from './ErrorPage.module.scss';
import rabbit from '../../assets/pictures/rabbit.svg';

export default function ErrorPage() {
  return (
    <div className={styles.errorPage}>
      <div className={styles.imageWrapper}>
        <img src={rabbit} alt="" />
        <div className={styles.wrapper}>
          <span className={styles.code}>Cтраница не найдена</span>
          <div>
            <p>Наш кролик снова перегрыз кабель.</p>
          </div>
          <Link className={`${styles.button} primary-button`} to='/'>На главную</Link>
        </div>
      </div>
    </div>
  )
}
