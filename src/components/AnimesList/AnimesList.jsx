import React from 'react'
import Card from '../Card/Card';
import styles from './AnimesList.module.scss';
import { v4 } from 'uuid';
import search from '../../assets/icons/search.svg';

export default function AnimesList({ title, animes }) {
  return (
    <div className='content'>
      <h1>{title}</h1>
      <div className={styles.buttonsWrapper}>
        <div className='buttons'>
          <button>Фильтр</button>
          <button className='primary-button'>Дате добавления</button>
        </div>
        <div className={styles.searchWrapper}>
          <input className={styles.search} type="text" placeholder='Поиск аниме' />
          <img src={search} alt="" />
        </div>
      </div>
      <ul className={styles.ul}>
        {
          animes.map((name, nameEng, type, releaseFrom, episodesAmount, shortName, imageUrl) =>
            <li key={v4()}><Card name={name} nameEng={nameEng} shortName={shortName} picture={imageUrl}
              type={type} releaseFrom={releaseFrom} episodesAmount={episodesAmount} /></li>)
        }
      </ul>
    </div>
  )
}
