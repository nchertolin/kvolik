import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Header.module.scss';

export default function Header({ user }) {
  const [color, setColor] = useState(false);
  const setActiveLink = ({ isActive }) => isActive ? styles.active : '';

  useEffect(() => {
    window.addEventListener('scroll', () => {
      setColor(window.pageYOffset > 60);
    })
  }, []);

  return (
    <header className={styles.header} style={{ backgroundColor: color ? '#2E3031' : 'transparent' }}>
      <div className={styles.wrapper}>
        <NavLink to='/' className={styles.logo}>KVOLIKDUB</NavLink>
        <ul className={styles.pcNav}>
          <li><NavLink className={setActiveLink} to='/'>Аниме</NavLink></li>
          <li><NavLink className={setActiveLink} to='/soon'>Скоро</NavLink></li>
          <li><NavLink className={setActiveLink} to='/contacts'>Заказать озвучку</NavLink></li>
          {user.name && <li><NavLink className={setActiveLink} to='/favorites'>Избранное</NavLink></li>}
        </ul>
        {user.name ? <NavLink to='/account'><img className={styles.user} src={user.avatarImageUrl} alt={user.name} /></NavLink>
          : <NavLink className='primary-button' to='login'>Войти</NavLink>}
      </div>
    </ header>
  )
}
