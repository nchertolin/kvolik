import React from 'react';
import styles from './Account.module.scss';
import { URL } from '../../App.js'
import { useState } from 'react';
export default function Edit({ user }) {
  const [login, setLogin] = useState();
  const [name, setName] = useState();
  const [password, setPassword] = useState();
  function editUser() {
    fetch(`${URL}/api/account`, {
      method: 'PUT', body: JSON.stringify({ username: login, name: name, password: password })
    })
      .then(response => {
        if (response.ok) {
          window.location.href = '..';
        } else throw new Error();
      })
      .catch(err => console.log(err.message));
  }

  return (
    <div className={styles.wrapper}>
      <img src={user.avatarImageUrl} alt="" />
      <ul className={styles.editList}>
        <li>
          <h3>Логин</h3>
          <input type="text" value={user.login}
            onChange={(evt) => setLogin(evt.target.value)} required />
        </li>
        <li>
          <h3>Имя пользователя</h3>
          <input type="text" value={user.name}
            onChange={(evt) => setName(evt.target.value)} required />
        </li>
        <li>
          <h3>Пароль</h3>
          <input type="password"
            onChange={(evt) => setPassword(evt.target.value)} required />
        </li>
        <li>
          <h3>Подтвердите пароль</h3>
          <input type="password"
            onChange={(evt) => setPassword(evt.target.value)} required />
        </li>
      </ul>
      <div className={styles.buttons}>
        <button className='primary-button' onClick={editUser}>Сохранить</button>
      </div>
    </div>
  )
}
