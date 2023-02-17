import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Card from '../Card/Card';
import styles from './AnimesList.module.scss';
import { v4 } from 'uuid';
import search from '../../assets/icons/search.svg';
import Loading from '../Loading/Loading';
import { testAnimes } from './animes.js';
import { SERVER_URL } from '../../App';
import { isMobile } from 'react-device-detect';
import EmptyCard from '../Card/EmptyCard';


export default function AnimesList({ title, isSoon, isFavorites, user }) {
  const [animes, setAnimes] = useState([]);
  const [isLoading, setLoading] = useState();
  const [isEmpty, setEmpty] = useState();
  const [selectedSort, setSelectedSort] = useState('DateDesc');
  const [query, setQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch(`${SERVER_URL}/api/${isFavorites ? 'favorites' : `anime${isSoon ? '/soon' : ''}?sort=${selectedSort}&search=${query}`}`, {
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
      .then(data => {
        setEmpty(data.length === 0);
        setAnimes(data);
      })
      .catch(() => setAnimes(testAnimes))
      // .catch(err => console.error(err.message))
      .finally(() => setLoading(false))
  }, [isSoon, isFavorites, selectedSort, query]);

  return (
    <>
      <Helmet>
        <title>KvolikDub - {title}</title>
      </Helmet>
      <div className='content'>
        <h1>{title}</h1>
        {!isFavorites &&
          <div className={styles.buttons}>
            <div className={styles.actions}>
              <button className={styles.filter}>Фильтр</button>
              <div className={`primary-button ${styles.selectWrapper}`}>
                <select className={styles.select} value={selectedSort} onChange={evt => setSelectedSort(evt.target.value)}>
                  <option value="DateDesc">По дате добавления</option>
                  <option value="RatingDesc">По рейтингу</option>
                </select>
              </div>
            </div>
            {!isMobile && <div className={styles.searchWrapper} onChange={evt => setQuery(evt.target.value)}>
              <input className={styles.search} type="text" placeholder='Поиск аниме' />
              <img src={search} alt="" />
            </div>}
          </div>}
        {isLoading
          ? <Loading />
          : <ul className={styles.ul}>
            {user.isAdmin &&
              <li>
                <EmptyCard shortName='admin' />
              </li>}
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
