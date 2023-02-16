import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './Admin.module.scss';

export default function Navbar() {
  const { pathname } = useLocation();
  const setActive = path => pathname === `/${path}` ? styles.active : '';

  return (
    <div className={styles.bar}>
      <div className={styles.barWrapper}>
        <h2>Admin.</h2>
        <ul>
          <li>
            <NavLink
              to=''
              className={() => setActive('admin')}>
              Добавить аниме
            </NavLink>
          </li>
        </ul>
      </div>
    </ div>
  )
}
