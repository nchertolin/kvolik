import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Card from '../Card/Card';
import styles from './AnimesList.module.scss';
import { v4 } from 'uuid';
import search from '../../assets/icons/search.svg';
import Loading from '../Loading/Loading';
import { testAnimes } from './animes.js';
import { URL } from '../../App';
import { isMobile } from 'react-device-detect';


export default function AnimesList({ title, isSoon, isFavorites }) {
  const [animes, setAnimes] = useState([]);
  const [isLoading, setLoading] = useState();
  const [isEmpty, setEmpty] = useState();

  function searchAnimes(query) {
    setLoading(true);
    fetch(`${URL}/api/anime${isSoon ? '/soon' : ''}?search=${query}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else return response.json().then(text => { throw new Error(text.message) })
      })
      .then(data => {
        setEmpty(data.length === 0);
        setAnimes(data);
      })
      .catch((err) => console.log(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    setLoading(true);
    fetch(`${URL}/api/${isFavorites ? 'favorites' : `anime${isSoon ? '/soon' : ''}`}`, {
      headers: isFavorites ? {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      } : {}
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else return response.json().then(text => { throw new Error(text.message) })
      })
      .then(data => setAnimes(data))
      .catch(() => setAnimes(testAnimes))
      .finally(() => setLoading(false))
  }, [isSoon, isFavorites]);

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div className='content'>
        <h1>{title}</h1>
        {!isFavorites &&
          <div className={styles.buttonsWrapper}>
            <div className='buttons'>
              <button>Фильтр</button>
              <button className='primary-button'>Дате добавления</button>
            </div>
            {!isMobile && <div className={styles.searchWrapper} onChange={(evt) => searchAnimes(evt.target.value)}>
              <input className={styles.search} type="text" placeholder='Поиск аниме' />
              <img src={search} alt="" />
            </div>}
          </div>}
        {isLoading
          ? <Loading />
          : <ul className={styles.ul}>
            {animes.map(({ name, nameEng, type, releaseFrom, episodesAmount, shortName, imageUrl, averageRating }) =>
              <li key={v4()}>
                <Card name={name} nameEng={nameEng} shortName={shortName} picture={imageUrl} type={type}
                  releaseFrom={releaseFrom} episodesAmount={episodesAmount} averageRating={averageRating} />
              </li>)}
          </ul>}
        {isEmpty && <p>Не удалось найти аниме по вашему запросу.</p>}
      </div>
    </>
  )
} 
