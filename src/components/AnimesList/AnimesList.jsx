import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import Card from '../Card/Card';
import styles from './AnimesList.module.scss';
import { v4 } from 'uuid';
import search from '../../assets/icons/search.svg';
import Loading from '../Loading/Loading';
import { testPreview, testAnimes } from './animes.js';
import { SERVER_URL } from '../../util.js';
import { isMobile } from 'react-device-detect';
import EmptyCard from '../Card/EmptyCard';
import video from '../../assets/videos/hero.mp4';
import { Link } from 'react-router-dom';
import edit from '../../assets/icons/edit.svg';


export default function AnimesList({ title, isSoon, isFavorites, user }) {
  const videoRef = useRef();
  const [preview, setPreview] = useState(testPreview);
  const [animes, setAnimes] = useState([]);
  const [isLoading, setLoading] = useState();
  const [isEmpty, setEmpty] = useState();
  const [selectedSort, setSelectedSort] = useState('DateDesc');
  const [query, setQuery] = useState('');


  function changePreview() {
    let newShortName = prompt('Введите shortName аниме на которое хотите сменить:');
    if (newShortName !== null && newShortName !== '') {
      fetch(`${SERVER_URL}/api/admin/preview/${newShortName}`)
        .then(response => {
          if (!response.ok) {
            return response.json().then(text => { throw new Error(text.message) })
          }
        })
        .then(data => alert('Превью успешно изменено'))
        .catch(err => alert(err.message))
        .finally(() => setLoading(false))
    }
  }

  useEffect(() => {
    setLoading(true);
    fetch(`${SERVER_URL}/api/anime/preview/`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else return response.json().then(text => { throw new Error(text.message) })
      })
      .then(data => setPreview(data))
      .catch(err => console.error(err.message))
      .finally(() => setLoading(false))
  }, [])

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
        setEmpty(data.length === 0 && !user.isAdmin);
        setAnimes(data);
      })
      //.catch(() => setAnimes(testAnimes))
      .finally(() => setLoading(false))
  }, [isSoon, isFavorites, selectedSort, query, user.isAdmin]);

  return (
    <>
      <Helmet>
        <title>KvolikDub - {title}</title>
      </Helmet>
      {!isMobile && !isFavorites &&
        <div className={styles.hero}>
          <div className={styles.videoEffect}>
            <video ref={videoRef} className={styles.video}
              src={video}
              autoPlay loop muted playsInline></video>
          </div>
          <div className={styles.videoTextWrapper}>
            <div className={styles.heroInfo}>
              <p>{preview.type}</p>
              <span>{preview.releaseFrom.slice(0, 4)}</span>
              <span>{preview.ageLimit}+</span>
            </div>
            <div className={styles.previewEdit}>
              <Link to={preview.shortName}>{preview.name}</Link>
              {user.isAdmin &&
                <button to='edit' className={styles.edit}
                  onClick={changePreview}>
                  <img src={edit} alt="" />
                </button>}
            </div>
            <h3>{preview.description}</h3>
          </div>
        </div>}
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
            {user.isAdmin && !isFavorites &&
              <li>
                <EmptyCard shortName='admin' />
              </li>}
            {animes.map(({ name, nameEng, type, releaseFrom, episodesAmount, shortName, imageUrl, averageRating }) =>
              <li key={v4()}>
                <Card name={name} nameEng={nameEng} shortName={shortName} picture={`${SERVER_URL}/${imageUrl}`} type={type}
                  releaseFrom={releaseFrom} episodesAmount={episodesAmount} averageRating={averageRating} />
              </li>)}
          </ul>}
        {isEmpty && <p>Не удалось найти аниме по вашему запросу.</p>}
      </div>
    </>
  )
} 
