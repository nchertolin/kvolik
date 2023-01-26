import React, { useRef, useState } from 'react';
import menu from '../../assets/icons/menu.svg';
import close from '../../assets/icons/close.svg';
import search from '../../assets/icons/search.svg';
import user from '../../assets/icons/user.svg';
import { NavLink } from 'react-router-dom';
import styles from './MobileHeader.module.scss';

export default function MobileHeader() {

  function showMenu() {
    menuModal.current.classList.toggle('hidden');
    setMenuActive(!isMenuActive);
  }

  function showSearch() {
    searchModal.current.classList.toggle('hidden');
  }

  function clearSearchInput() {
    searchInput.current.value = '';
  }

  const menuModal = useRef();
  const searchModal = useRef();
  const searchInput = useRef();
  const [isMenuActive, setMenuActive] = useState();
  const setActiveLink = ({ isActive }) => isActive ? 'link active' : 'link';

  return (
    <header className={styles.header}>

      <div ref={menuModal} className="menu-modal hidden">
        <div className='menu-modal__wrapper'>
          <div className='user-wrapper'>
            <img src={user} alt="" />
            <NavLink onClick={showMenu} className='primary-button' to='/login'>Войти</NavLink>
          </div>
          <p>Навигация</p>
          <ul>
            <li><NavLink to='/' className={setActiveLink} onClick={showMenu}>Аниме</NavLink></li>
            <li><NavLink to='/soon' className={setActiveLink} onClick={showMenu}>Скоро</NavLink></li>
            <li><NavLink to='/contacts' className={setActiveLink} onClick={showMenu}>Заказать озвучку</NavLink></li>
          </ul>
        </div>
      </div>

      <div className={styles.headerWrapper}>
        <button className={styles.button}
          onClick={showMenu}>
          <img src={isMenuActive ? close : menu} alt="Меню" />
        </button>
        <p>KVOLIK DUB</p>
        <button className={styles.button}
          onClick={showSearch}>
          <img src={search} alt="Поиск" />
        </button>
      </div>

      <div ref={searchModal} className='search hidden'>
        <div className='search__wrapper'>
          <div className='input__wrapper'>
            <input ref={searchInput} type="text" placeholder='Название аниме' />
            <button className={styles.button}
              onClick={() => {
                showSearch();
                clearSearchInput();
              }}><img src={close} alt="X" /></button>
          </div>
        </div>
      </div>
    </header>
  )
}
