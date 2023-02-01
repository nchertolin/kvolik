import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Card from '../Card/Card';
import styles from './AnimesList.module.scss';
import { v4 } from 'uuid';
import search from '../../assets/icons/search.svg';
import Loading from '../Loading/Loading';
import { testAnimes } from './animes.js';
import { URL } from '../../App';


export default function AnimesList({ title, isSoon }) {
  const [animes, setAnimes] = useState([]);
  const [isLoading, setLoading] = useState();
  useEffect(() => {
    setLoading(true);
    fetch(`${URL}/api/anime${isSoon ? '/soon' : ''}`)
      .then(response => response.json())
      .then(data => setAnimes(data))
      .catch(() => setAnimes(testAnimes))
      .finally(() => setLoading(false))
  }, [isSoon]);

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div className='content'>
        {isLoading ? <Loading /> :
          <>
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
                animes.map(({ name, nameEng, type, releaseFrom, episodesAmount, shortName, imageUrl, averageRating }) =>
                  <li key={v4()}><Card name={name} nameEng={nameEng} shortName={shortName} picture={imageUrl}
                    type={type} releaseFrom={releaseFrom} episodesAmount={episodesAmount} averageRating={averageRating} /></li>)
              }
            </ul>
          </>}
      </div>
    </>
  )
} 
