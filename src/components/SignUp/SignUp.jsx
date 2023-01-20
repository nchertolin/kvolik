
import styles from './SignUp.module.scss';
export default function SignUp() {

  return (
    <div className={styles.login}>
      <div className={styles.wrapper}>
        <h1>Регистрация</h1>
        <input type="text" name="login" placeholder='Имя пользователя' />
        <input type="email" name="login" placeholder='Эл. почта' />
        <input type="password" name="password" placeholder='Пароль' />
        <input type="password" name="password" placeholder='Повторите пароль' />

        <button className={`${styles.submit} primary-button`}>Зарегистрироваться</button>
      </div>
    </div>
  )
}
