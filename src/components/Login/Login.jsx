import React, { useState } from 'react'
import show from '../../assets/icons/show.svg';
import unShow from '../../assets/icons/show-off.svg';
import styles from './Login.module.scss';
import { Link } from 'react-router-dom';
import { URL } from '../../App';

export default function Login() {
  const [isShown, setShown] = useState();
  const [login, setLogin] = useState();
  const [password, setPassword] = useState();
  const showPassword = () => setShown(!isShown);

  function loginUser() {
    console.log(login, password);
    fetch(`${URL}/api/account/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: login, password: password })
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else return response.json().then(text => { throw new Error(text.message) })
      })
      .then(data => {
        localStorage.setItem('token', `${data['token']}`);
        window.location.href = '..';
      })
      .catch((err) => console.log(err.message))
  }

  return (
    <div className={styles.login}>
      <div className={styles.wrapper}>
        <h1>Вход</h1>
        <input type="text" name="login" placeholder='Логин' value={login}
          onChange={(evt) => setLogin(evt.target.value)} required />
        <div className={styles.visibility}>
          <input type={isShown ? "text" : "password"} name="password" placeholder='Пароль' value={password}
            onChange={(evt) => setPassword(evt.target.value)} required />
          <button className={styles.show} onClick={showPassword}><img src={isShown ? unShow : show} alt="показать" /></button>
        </div>
        <Link className={styles.forgot} to=''>Забыли пароль?</Link>
        <button className={`${styles.submit} primary-button`} onClick={loginUser}>Войти</button>
        <div className={styles.signup}>
          <p>Нет аккаунта?</p>
          <Link to='/signup'>Зарегистрироватся</Link>
        </div>
      </div>
    </div>
  )
}
