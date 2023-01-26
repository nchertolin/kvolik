import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Account.module.scss';

export default function Account({ user }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.userInfo}>
        <img src={user.imageUrl} alt="" />
        <h2>{user.name}</h2>
        <h3>@{user.login}</h3>
      </div>
      <div className={styles.buttons}>
        <Link to='edit' className={`primary-button ${styles.edit}`}>Редактировать</Link>
        <Link to='favorites' className={styles.favorites}>Избранное</Link>
      </div>
    </div>
  )
}
