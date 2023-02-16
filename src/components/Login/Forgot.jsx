import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import styles from './Login.module.scss';

export default function Forgot() {
  const { register, formState: { errors }, handleSubmit, reset } = useForm({ mode: 'all' });
  const submit = useRef();
  const error = useRef();
  const [isSubmited, setSubmited] = useState();

  function sendCode() {
    setSubmited(true);
  }

  return (
    <div className={styles.login}>
      <form className={styles.wrapper} onSubmit={handleSubmit(sendCode)}>
        <h1>Восстановление доступа</h1>
        <h2>Введите адрес электронной почты, связанный с вашей учетной записью
          и мы вышлем вам код для сброса пароля.</h2>
        <label>
          <input type="email" placeholder='Эл. почта' className={errors?.email ? 'invalid' : ''}
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
        <p ref={error} className='error-submit'>Неверный логин или пароль.</p>
      </form>
    </div>
  )
}
