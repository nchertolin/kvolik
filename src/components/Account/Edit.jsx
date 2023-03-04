import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import styles from './Account.module.scss';
import { IS_AUTH, SERVER_URL } from '../../util.js';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import ErrorPage from '../ErrorPage/ErrorPage';
import Loading from '../Loading/Loading';


export default function Edit({ user }) {
  const { register, watch, formState: { errors, }, handleSubmit, reset } =
    useForm({
      mode: "onBlur",
      defaultValues: {
        email: user.email,
        name: user.name,
        password: '',
        cpassword: ''
      }
    });
  const submit = useRef()
  const error = useRef();

  function disableButton(isDisable) {
    submit.current.disabled = isDisable;
  }

  function showError(message) {
    error.current.textContent = message;
    error.current.style.display = 'block';
  }

  function editUser({ email, name, password }) {
    disableButton(true);
    fetch(`${SERVER_URL}/api/account`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ email: email, name: name, password: password })
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else return response.json().then(text => { throw new Error(text.message) })
      })
      .then(({ token }) => {
        window.location.href = '..';
        localStorage.setItem('token', token);
      })
      .catch(err => showError(err.message))
      .finally(() => disableButton(false));
    reset();
  };


  return (
    <>
      <Helmet>
        <title>Редактировать профиль</title>
      </Helmet>
      {!IS_AUTH ? <ErrorPage />
        :
        <div className='content'>
          <div className={styles.wrapper}>
            <img src={`${SERVER_URL}/${user.avatarImageUrl}`} alt="" />
            <form autoComplete='off' className={styles.editList} onSubmit={handleSubmit(editUser)}>
              <label>
                <h3>Эл. почта</h3>
                <input type="email"
                  className={errors?.name ? 'invalid' : ''}
                  placeholder={user.email}
                  {...register('email', { required: 'Обязательноe поле.' })}
                />
                {errors?.email && <p className='error'>{errors?.email.message}</p>}
              </label>
              <label>
                <h3>Имя пользователя</h3>
                <input type="text" className={errors?.name ? 'invalid' : ''} placeholder={user.name}
                  {...register('name', { required: 'Обязательноe поле.' })} />
                {errors?.name && <p className='error'>{errors?.name.message}</p>}
              </label>
              <label>
                <h3>Пароль</h3>
                <input type="password" className={errors?.password ? styles.invalid : ''}
                  {...register('password', {
                    required: 'Обязательноe поле.',
                    minLength: { value: 6, message: 'Длина пароля должна быть в диапазоне от 6 до 30.' },
                    maxLength: { value: 30, message: 'Длина пароля должна быть в диапазоне от 6 до 30.' }
                  })} />
                {errors?.password && <p className='error'>{errors?.password.message}</p>}
              </label>
              <label>
                <h3>Подтвердите пароль</h3>
                <input type="password" className={errors?.cpassword ? styles.invalid : ''}
                  {...register('cpassword', {
                    required: 'Обязательноe поле.',
                    minLength: { value: 6, message: 'Длина пароля должна быть в диапазоне от 6 до 30.' },
                    maxLength: { value: 30, message: 'Длина пароля должна быть в диапазоне от 6 до 30.' },
                    validate: (value) => {
                      return watch('password') === value || "Пароли не совпадают.";
                    }
                  })} />
                {errors?.cpassword && <p className='error'>{errors?.cpassword.message}</p>}
              </label>
              <button ref={submit} className={`${styles.submit} primary-button`}>Сохранить</button>
              <p ref={error} className='error-submit'>Возникла ошибка при отправке, возможно такой логин занят.</p>
            </form>
          </div>
        </div>}
    </>
  )
}
