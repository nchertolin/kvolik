import React from 'react';
import { Link } from 'react-router-dom';
import ErrorPage from '../ErrorPage/ErrorPage';
import styles from './Account.module.scss';

export default function Account({ user, setUser }) {
  function logoutUser() {
    setUser({});
    fetch(`${URL}/api/account/logout`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
      .then((response) => {
        if (response.ok) {
          localStorage.removeItem('token');
          window.location.href = '..';
        } else throw new Error();
      });
  }

  return (
    !user.name ? <ErrorPage />
      : <div className={styles.wrapper}>
        <div className={styles.userInfo}>
          <img src={user.avatarImageUrl} alt="" />
          <h2>{user.name}</h2>
        </div>
        <div className={styles.buttons}>
          <Link to='edit' className={`primary-button ${styles.edit}`}>Редактировать</Link>
          <button to='/' className={styles.logout} onClick={logoutUser}>Выйти</button>
        </div>
      </div >
  )
}
