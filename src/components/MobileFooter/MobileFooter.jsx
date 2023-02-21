import React from 'react';
import { Link } from 'react-router-dom';
import styles from './MobileFooter.module.scss';
import yt from '../../assets/icons/yt.svg';
import vk from '../../assets/icons/vk.svg';
import tg from '../../assets/icons/tg.svg';

export default function MobileFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.wrapper}>
        <div className={styles.logo}>
          <Link to=''>KVOLIKDUB</Link>
          <p>Озвучка по КД</p>
        </div>
        <p className={styles.text}>Весь материал на сайте представлен исключительно для домашнего ознакомительного просмотра.</p>
        <p className={styles.text}>Обратная связь и жалобы от правообладателей <a href="mailto:info@kvolikdub.ru">info@kvolikdub.ru</a></p>
        <ul>
          <li>
            <a href="http://www.youtube.com/channel/UC5FVxYZp9z59LqWz6w6H3pw" target="_blank" rel="noopener noreferrer">
              <img src={yt} alt="" />
            </a>
          </li>
          <li>
            <a href="http://vk.com/public210885392" target="_blank" rel="noopener noreferrer">
              <img src={vk} alt="" />
            </a>
          </li>
          <li>
            <a href="http://t.me/kvolikdub" target="_blank" rel="noopener noreferrer">
              <img src={tg} alt="" />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  )
}
