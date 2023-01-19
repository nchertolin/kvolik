import React from 'react'
import Card from '../Card/Card';
import styles from './AnimesList.module.scss';
import { v4 } from 'uuid';

export default function AnimesList({ title, animes }) {
  return (
    <div className='content'>
      <h1>{title}</h1>
      <div className='buttons'>
        <button>Фильтр</button>
        <button className='primary-button'>Дате добавления</button>
      </div>
      <ul className={styles.ul}>
        {
          animes.map(({ title, url, id, albumId }) =>
            <li key={v4()}><Card name={title} shortName={id} picture={url} genre={albumId} /></li>)
        }
      </ul>
    </div>
  )
}
