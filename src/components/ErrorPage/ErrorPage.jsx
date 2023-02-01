import React from 'react'
import { Link } from 'react-router-dom';
import styles from './ErrorPage.module.scss';

export default function ErrorPage() {
  return (
    <div className={styles.errorPage}>
      <div className={styles.wrapper}>
        <span className={styles.code}>404</span>
        <div>
          <h1>Cтраница не найдена</h1>
          <p>Сайт, настроенный по этому адресу, не содержит запрашиваемую страницу.</p>
        </div>
        <Link className={`${styles.button} primary-button`} to='/'>На главную</Link>
      </div>
    </div>
  )
}
