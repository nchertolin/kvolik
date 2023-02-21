import React from 'react';
import { Helmet } from 'react-helmet';
import logo from '../../assets/pictures/avatar.svg';
import yt from '../../assets/icons/yt.svg';
import vk from '../../assets/icons/vk.svg';
import tg from '../../assets/icons/tg.svg';
import styles from './Contacts.module.scss';

export default function Contacts() {
  return (
    <>
      <Helmet>
        <title>KvolikDub - Заказать озвучку</title>
      </Helmet>
      <div className='content'>
        <h1>Заказать озвучку</h1>
        <div className={styles.contacts}>
          <img className={styles.avatar} src={logo} alt="" />
          <div className={styles.info}>
            <h4>Дорогие друзья, добро пожаловать на наш сайт!</h4>
            <p>
              Для заказа озвучки свяжитесь с нами любым удобным для вас способом.
            </p>
          </div>
        </div>
        <p className={styles.description}>
          Мы, Kvolik Dub, готовим для вас множество интересных озвучек.
          Вы можете познакомиться с нами ближе, присоединившись к нашим сообществам в соц. сетях!
        </p>

        <ul className={styles.social}>
          <li><a target='_blank' rel="noreferrer" href="https://www.youtube.com/channel/UC5FVxYZp9z59LqWz6w6H3pw"><img src={yt} alt="" /></a></li>
          <li><a target='_blank' rel="noreferrer" href="https://vk.com/kvolikdub"><img src={vk} alt="" /></a></li>
          <li><a target='_blank' rel="noreferrer" href="https://t.me/kvolikdub"><img src={tg} alt="" /></a></li>
        </ul>
      </div>
    </>
  )
}
