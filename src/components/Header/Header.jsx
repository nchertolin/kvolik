import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Header.module.scss';

export default function Header() {
  const setActiveLink = ({ isActive }) => isActive ? styles.active : '';

  return (
    <header className={styles.header}>
      <div className={styles.wrapper}>
        <p className={styles.logo}>KVOLIKDUB</p>
        <nav>
          <ul className={styles.pcNav}>
            <li><NavLink className={setActiveLink} to='/'>Аниме</NavLink></li>
            <li><NavLink className={setActiveLink} to='/soon'>Скоро</NavLink></li>
            <li><NavLink className={setActiveLink} to='/contacts'>Заказать озвучку</NavLink></li>
          </ul>
        </nav>
        <NavLink className='primary-button' to='login'>Войти</NavLink>
      </div>
    </header>
  )
}
