import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import styles from './Login.module.scss';
import { SERVER_URL } from '../../util.js';

export default function Forgot() {
  const { register, formState: { errors }, handleSubmit, reset } = useForm({ mode: 'all' });
  const submit = useRef();
  const error = useRef();
  const [isEmailDisabled, setEmailDisabled] = useState(false);
  const [isSubmited, setSubmited] = useState();

  const disableButton = isDisable => submit.current.disabled = isDisable;

  function showError(isShow, message) {
    if (isShow) {
      error.current.textContent = message;
    }
    error.current.style.display = isShow ? 'block' : 'none';
  }

  function sendCode({ email, code }) {
    disableButton(true);
    if (!isSubmited) {
      fetch(`${SERVER_URL}/api/email/send/${email}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
      })
        .then(response => {
          if (!response.ok) {
            return response.json().then(text => { throw new Error(text.message) })
          }
        })
        .then(() => {
          setSubmited(true);
          setEmailDisabled(true);
          showError(false, 'Возникла ошибка при отправке.');
        })
        .catch(err => showError(true, err.message))
        .finally(() => disableButton(false));
    } else {
      fetch(`${SERVER_URL}/api/email/confirm`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: code, email: email })
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else return response.json().then(text => { throw new Error(text.message) })
        })
        .then(({ token }) => {
          localStorage.setItem('token', token);
          showError(false, 'Возникла ошибка при отправке.');
          setSubmited(false);
          setEmailDisabled(false);
          window.location.href = '../../account/edit'
          reset();
        })
        .catch(err => showError(true, err.message))
        .finally(() => {
          disableButton(false);
        });
    }
  }

  return (
    <div className={styles.login}>
      <form className={styles.wrapper} onSubmit={handleSubmit(sendCode)}>
        <h1>Восстановление доступа</h1>
        <h2>Введите адрес электронной почты, связанный с вашей учетной записью
          и мы вышлем вам код для сброса пароля.</h2>
        <label>
          <input type="email" placeholder='Эл. почта' disabled={isEmailDisabled}
            className={errors?.email ? 'invalid' : ''}
            {...register('email', { required: 'Обязательноe поле.' })} />
          {errors?.email && <p className='error'>{errors?.email.message}</p>}
        </label>
        {isSubmited && <label className={styles.code}>
          <input type="tel" placeholder='Код из письма' autoComplete='off'
            className={errors?.code ? 'invalid' : ''}
            {...register('code', {
              required: 'Обязательноe поле.',
              pattern: { value: /[0-9]{4,4}/, message: 'Код должен содержать 4 цифры' }
            })} />
          {errors?.code && <p className='error'>{errors?.code.message}</p>}
        </label>}
        <button ref={submit} className={`${styles.submit} primary-button`}>Продолжить</button>
        <p ref={error} className='error-submit'>Возникла ошибка при отправке.</p>
      </form>
    </div>
  )
}
