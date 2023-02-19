
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import styles from './SignUp.module.scss';
import { SERVER_URL } from '../../util.js'

export default function SignUp() {
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

  function signUpUser({ username, name, password, cpassword }) {
    disableButton(true);
    fetch(`${SERVER_URL}/api/account/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email: username, name: name, password: password, confirmPassword: cpassword })
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
    <div className={styles.login}>
      <form className={styles.wrapper} onSubmit={handleSubmit(signUpUser)}>
        <h1>Регистрация</h1>
        <label>
          <input type="email" placeholder='Эл. почта' className={errors?.username ? 'invalid' : ''}
            {...register('username', { required: 'Обязательноe поле.' })} />
          {errors?.username && <p className='error'>{errors?.username.message}</p>}
        </label>
        <label>
          <input type="text" placeholder='Имя пользователя' className={errors?.username ? 'invalid' : ''}
            {...register('name', { required: 'Обязательноe поле.' })} />
          {errors?.name && <p className='error'>{errors?.name.message}</p>}
        </label>
        <label>
          <input type="password" placeholder='Пароль' className={errors?.username ? 'invalid' : ''}
            {...register('password', { required: 'Обязательноe поле.' })} />
          {errors?.password && <p className='error'>{errors?.password.message}</p>}
        </label>
        <label>
          <input type="password" placeholder='Повторите пароль' className={errors?.username ? 'invalid' : ''}
            {...register('cpassword', {
              required: 'Обязательноe поле.',
              validate: (value) => {
                return watch('password') === value || "Пароли не совпадают.";
              }
            })} />
          {errors?.cpassword && <p className='error'>{errors?.cpassword.message}</p>}
        </label>

        <button ref={submit} className={`${styles.submit} primary-button`}>Зарегистрироваться</button>
        <p ref={error} className='error-submit'>Возникла ошибка при отправке, попробуйте позже.</p>
      </form>
    </div>
  )
}
