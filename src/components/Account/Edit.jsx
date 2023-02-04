import React from 'react';
import { Helmet } from 'react-helmet';
import styles from './Account.module.scss';
import { isAuth, URL } from '../../App.js'
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import ErrorPage from '../ErrorPage/ErrorPage';


export default function Edit({ user }) {
  const { register, watch, formState: { errors }, handleSubmit, reset } = useForm({ mode: "all" });
  const submit = useRef()
  const error = useRef();

  function disableButton(isDisable) {
    submit.current.disabled = isDisable;
  }

  function showError(message) {
    error.current.textContent = message;
    error.current.style.display = 'block';
  }

  function editUser({ username, name, password }) {
    disableButton(true);
    fetch(`${URL}/api/account`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ username: username, name: name, password: password })
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else return response.json().then(text => { throw new Error(text.message) })
      })
      .then(data => {
        window.location.href = '..';
        localStorage.setItem('token', `${data['token']}`)
      })
      .catch(err => showError(err.message))
      .finally(() => disableButton(false));
    reset();
  };

  return (
    <>
      <Helmet>
        <title>{isAuth ? user.name : 'Редактировать профиля'}</title>
      </Helmet>
      {!isAuth ? <ErrorPage />
        : <div className={styles.wrapper}>
          <img src={user.avatarImageUrl} alt="" />
          <form autoComplete='off' className={styles.editList} onSubmit={handleSubmit(editUser)}>
            <label>
              <h3>Логин</h3>
              <input type="text" className={errors?.username ? 'invalid' : ''} placeholder={user.username}
                {...register('username', { required: 'Обязательноe поле.' })} />
              {errors?.username && <p className='error'>{errors?.username.message}</p>}
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
                {...register('password', { required: 'Обязательноe поле.' })} />
              {errors?.password && <p className='error'>{errors?.password.message}</p>}
            </label>
            <label>
              <h3>Подтвердите пароль</h3>
              <input type="password" className={errors?.cpassword ? styles.invalid : ''}
                {...register('cpassword', {
                  required: 'Обязательноe поле.',
                  validate: (value) => {
                    return watch('password') === value || "Пароли не совпадают.";
                  }
                })} />
              {errors?.cpassword && <p className='error'>{errors?.cpassword.message}</p>}
            </label>
            <button ref={submit} className={`${styles.submit} primary-button`}>Сохранить</button>
            <p ref={error} className='error-submit'>Возникла ошибка при отправке, возможно такой логин занят.</p>
          </form>
        </div>}
    </>
  )
}
