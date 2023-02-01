import React, { useEffect, useRef, useState } from 'react'
import styles from './Anime.module.scss';
import Comment from '../Comment/Comment';
import { v4 } from 'uuid';
import Slider from '../Slider/Slider';
import Rating from '../Rating/Rating';
import { testAnime } from '../AnimeDesktop/anime.js';
import Loading from '../Loading/Loading';
import { showRating } from '../AnimeDesktop/AnimeDesktop';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

export default function Anime({ shortName }) {
  const isAuth = localStorage.getItem('token') !== null;
  const ratingRef = useRef();
  const [{ name, nameEng, type, episodesAmount, genres, primarySource, releaseFrom, releaseBy,
    ageLimit, duration, description, exitStatus, frames, imageUrl, trailerUrl,
    averageRating, reviews }, setAnime] = useState(testAnime);
  const [isLoading, setLoading] = useState();

  useEffect(() => {
    setLoading(true);
    fetch(`${URL}/api/anime/${shortName}`)
      .then(response => response.json())
      .then(data => setAnime(data))
      .catch((err) => console.log(err.message))
      .finally(() => setLoading(false))
  }, [shortName]);
  return (
    isLoading ? <Loading /> :
      <>
        <Helmet>
          <title>{name}</title>
        </Helmet>
        <div className='content'>
          <h1 className={styles.title}>{name}</h1>
          <h2 className={styles.second}>{nameEng}</h2>
          <div className={styles.pictureWrapper}>
            <img className={styles.picture} src={imageUrl} alt="" />
            <div className={styles.ratingWrapper}>
              <p>{averageRating}</p>
            </div>
          </div>
          <div className={styles.buttons}>
            <a href='#watch'>Смотреть онлайн</a>
            {isAuth ? <button className={styles.rate} onClick={() => showRating(ratingRef, true)}>Оценить аниме</button>
              : <Link to='../login' className={styles.rate}>Оценить аниме</Link>}
          </div>
          <Rating reference={ratingRef} />
          <div className={styles.info}>
            <div className={styles.infoRow}>
              <p>Тип</p>
              <span>{type}</span>
            </div>
            <div className={styles.infoRow}>
              <p>Эпизоды</p>
              <span>{episodesAmount}</span>
            </div>
            <div className={styles.infoRow}>
              <p>Статус</p>
              <span>{exitStatus}</span>
            </div>
            <div className={styles.infoRow}>
              <p>Жанр</p>
              <span>
                {genres.map((genre, index) => index === genres.length - 1 ? genre : `${genre}, `)}
              </span>
            </div>
            <div className={styles.infoRow}>
              <p>Первоисточник</p>
              <span>{primarySource}</span>
            </div>
            <div className={styles.infoRow}>
              <p>Сезон</p>
              <span>{releaseFrom.slice(0, 4)}</span>
            </div>
            <div className={styles.infoRow}>
              <p>Выпуск</p>
              <span>
                с января {releaseFrom.slice(0, 4)} по февраль {releaseBy.slice(0, 4)}
              </span>
            </div>
            <div className={styles.infoRow}>
              <p>Возрастные ограничения</p>
              <span>{ageLimit}</span>
            </div>
            <div className={styles.infoRow}>
              <p>Длительность</p>
              <span>{duration} мин</span>
            </div>
          </div>
          <p className={styles.description}>{description}</p>
          <div className={styles.extra}>
            <h2 className={styles.head}>Кадры из аниме</h2>
            <div style={{ marginBottom: '5vh' }}>
              <Slider pictures={frames} />
            </div>
            <h2 className={styles.head}>Трейлер аниме</h2>
            <iframe id='watch' title='Trailer' src={trailerUrl}></iframe>
            <h2 className={styles.head}>Смотреть аниме {name}</h2>
            <iframe title='Anime' src="//aniqit.com/serial/44055/59f71c4fb69d61db71942f5e8d608042/720p"
              allowFullScreen allow="autoplay *; fullscreen *"></iframe>
          </div>

          <div className={styles.comments}>
            <h3>Комментарии</h3>
            <ul className={styles.userComments}>
              {reviews.map(({ name, reviewText, likes, avatarImageUrl }) => <Comment key={v4()} name={name}
                reviewText={reviewText} likes={likes} avatarImageUrl={avatarImageUrl} />)}
              <li className={styles.more}><button className='primary-button'>Загрузить еще</button></li>
            </ul>
            {isAuth ? <div className={styles.write}>
              <textarea disabled={!isAuth} placeholder='Ваш комментарий'
                onChange={(evt) => {
                  evt.target.style.height = 'auto';
                  evt.target.style.height = `${evt.target.scrollHeight}px`;
                }} />
              <button className='primary-button' disabled={!isAuth}>Отправить</button>
            </div>
              : <h3>Комментарии могут писать только авторизованные пользователи</h3>}
          </div>
        </div>
        <Rating reference={ratingRef} shortName={shortName} />
      </>
  )
}
