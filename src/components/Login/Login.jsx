import React, { useRef, useState } from 'react'
import show from '../../assets/icons/show.svg';
import unShow from '../../assets/icons/show-off.svg';
import styles from './Login.module.scss';
import { Link } from 'react-router-dom';
import { URL } from '../../App';
import { useForm } from 'react-hook-form';

export default function Login() {
  const { register, formState: { errors }, handleSubmit, reset } = useForm({ mode: 'all' });
  const [isShown, setShown] = useState();
  const showPassword = () => setShown(!isShown);
  const submit = useRef()
  const error = useRef();

  function disableButton(isDisable) {
    submit.current.disabled = isDisable;
  }

  function showError(isShow, message) {
    if (isShow) {
      error.current.textContent = message;
    }
    error.current.style.display = isShow ? 'block' : 'none';
  }

  function loginUser({ username, password }) {
    disableButton(true);
    fetch(`${URL}/api/account/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: username, password: password })
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
      .catch((err) => showError(true, err.message))
      .finally(() => disableButton(false));
    reset()
  }

  return (
    <div className={styles.login}>
      <form className={styles.wrapper} onSubmit={handleSubmit(loginUser)}>
        <h1>Вход</h1>
        <label>
          <input type="email" placeholder='Эл. почта' className={errors?.username ? 'invalid' : ''}
            {...register('username', { required: 'Обязательноe поле.' })} />
          {errors?.username && <p className='error'>{errors?.username.message}</p>}
        </label>
        <div>
          <label className={styles.visibility}>
            <input type={isShown ? 'text' : 'password'} placeholder='Пароль'
              className={errors?.password ? 'invalid' : ''}
              {...register('password', { required: 'Обязательноe поле.' })} />
            <button type='button' className={styles.show} onClick={showPassword}>
              <img src={isShown ? unShow : show} alt="Показать" />
            </button>
          </label>
          {errors?.password && <p className='error'>{errors?.password.message}</p>}
        </div>

        <Link className={styles.forgot} to='forgot'>Забыли пароль?</Link>
        <button ref={submit} className={`${styles.submit} primary-button`}>Войти</button>
        <div className={styles.signup}>
          <p>Нет аккаунта?</p>
          <Link to='/signup'>Зарегистрироватся</Link>
        </div>
        <p ref={error} className='error-submit'>Неверный логин или пароль.</p>
      </form>
    </div>
  )
}
