import React from 'react';
import styles from './Account.module.scss';
export default function Edit({ user }) {
  return (
    <div className={styles.wrapper}>
      <img src={user.imageUrl} alt="" />
      <ul className={styles.editList}>
        <li>
          <h3>Логин</h3>
          <input type="text" placeholder={user.login} />
        </li>
        <li>
          <h3>Имя пользователя</h3>
          <input type="text" placeholder={user.name} />
        </li>
        <li>
          <h3>Пароль</h3>
          <input type="password" />
        </li>
        <li>
          <h3>Подтвердите пароль</h3>
          <input type="password" />
        </li>
      </ul>
      <div className={styles.buttons}>
        <button className='primary-button'>Сохранить</button>
      </div>
    </div >
  )
}
