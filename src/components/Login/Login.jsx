import React, { useState } from 'react'
import show from '../../assets/icons/show.svg';
import unShow from '../../assets/icons/show-off.svg';
import styles from './Login.module.scss';
import { Link } from 'react-router-dom';

export default function Login() {
  const [isShown, setShown] = useState();
  const showPassword = () => setShown(!isShown);

  return (
    <div className={styles.login}>
      <div className={styles.wrapper}>
        <h1>Вход</h1>
        <input type="text" name="login" placeholder='Логин' />
        <div className={styles.visibility}>
          <input type={isShown ? "text" : "password"} name="password" placeholder='Пароль' />
          <button className={styles.show} onClick={showPassword}><img src={isShown ? unShow : show} alt="показать" /></button>
        </div>
        <Link className={styles.forgot} to=''>Забыли пароль?</Link>
        <button className={`${styles.submit} primary-button`}>Войти</button>
        <div className={styles.signup}>
          <p>Нет аккаунта?</p>
          <Link to='/signup'>Зарегистрироватся</Link>
        </div>
      </div>
    </div>
  )
}
