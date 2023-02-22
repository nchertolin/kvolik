import React, { useRef, useState, lazy, Suspense } from 'react';
import menu from '../../assets/icons/menu.svg';
import close from '../../assets/icons/close.svg';
import search from '../../assets/icons/search.svg';
import { NavLink } from 'react-router-dom';
import styles from './MobileHeader.module.scss';
import { IS_AUTH, SERVER_URL } from '../../util.js';
import Loading from '../Loading/Loading';

const Search = lazy(() => import('../Search/Search'))

export default function MobileHeader({ user }) {

  function showMenu() {
    menuModal.current.classList.toggle('hidden');
    setMenuActive(!isMenuActive);
  }

  function showSearch() {
    searchModal.current.classList.toggle('hidden');
    document.body.classList.toggle('fixed')
  }

  const menuModal = useRef();
  const searchModal = useRef();
  const [isMenuActive, setMenuActive] = useState();
  const setActiveLink = ({ isActive }) => isActive ? 'link active' : 'link';

  return (
    <header className={styles.header}>
      <div ref={menuModal} className="menu-modal hidden">
        <div className='menu-modal__wrapper'>
          {IS_AUTH
            ?
            <NavLink className='user-wrapper' to='/account' onClick={showMenu}>
              <img className={styles.user} src={`${SERVER_URL}/${user.avatarImageUrl}`} alt={user.name} />
              <h2>{user.name}</h2>
            </NavLink>
            : <div className='user-wrapper'>
              <NavLink onClick={showMenu} className='primary-button' to='/login'>Войти</NavLink>
            </div>}
          <ul>
            <li><NavLink to='/' className={setActiveLink} onClick={showMenu}>Аниме</NavLink></li>
            <li><NavLink to='/soon' className={setActiveLink} onClick={showMenu}>Скоро</NavLink></li>
            {IS_AUTH && <li><NavLink to='/favorites' className={setActiveLink} onClick={showMenu}>Избранное</NavLink></li>}
            <li><NavLink to='/contacts' className={setActiveLink} onClick={showMenu}>Заказать озвучку</NavLink></li>
          </ul>
        </div>
      </div>

      <div className={styles.headerWrapper}>
        <button className={styles.button}
          onClick={showMenu}>
          <img src={isMenuActive ? close : menu} alt="Меню" />
        </button>
        <NavLink className={styles.logo} to='/'>KVOLIK DUB</NavLink>
        <button className={styles.button}
          onClick={showSearch}>
          <img src={search} alt="Поиск" />
        </button>
      </div>
      <Suspense fallback={<Loading />}>
        <Search reference={searchModal} />
      </Suspense>
    </header >
  )
}
