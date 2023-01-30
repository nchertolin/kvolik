import React from 'react';
import { Link } from 'react-router-dom';
import ErrorPage from '../ErrorPage/ErrorPage';
import styles from './Account.module.scss';

export default function Account({ user, setUser }) {

  function logoutUser() {
    localStorage.removeItem('token');
    setUser({});
  }

  return (
    !user.name ? <ErrorPage />
      : <div className={styles.wrapper}>
        <div className={styles.userInfo}>
          <img src={user.imageUrl} alt="" />
          <h2>{user.name}</h2>
        </div>
        <div className={styles.buttons}>
          <Link to='edit' className={`primary-button ${styles.edit}`}>Редактировать</Link>
          <Link to='/' className={styles.logout} onClick={logoutUser}>Выйти</Link>
        </div>
      </div >
  )
}
