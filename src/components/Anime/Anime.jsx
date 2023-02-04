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
import { isAuth, URL } from '../../App';
import star from '../../assets/icons/star.svg';
import starFill from '../../assets/icons/star-fill.svg';

export default function Anime({ shortName }) {
  const ratingRef = useRef();
  const favoriteRef = useRef();
  const [anime, setAnime] = useState(testAnime);
  const [isLoading, setLoading] = useState();
  const [isFavorite, setFavorite] = useState();
  const [rating, setRating] = useState(false);


  function disableButton(isDisable) {
    ratingRef.current.disabled = isDisable;
  }

  function checkFavorite() {
    fetch(`${URL}/api/favorites`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else return response.json().then(text => { throw new Error(text.message) })
      })
      .then((animes) => setFavorite(animes.some(({ id }) => id === anime.id)))
  }

  function addToFavorite() {
    disableButton(true);
    fetch(`${URL}/api/favorites/${shortName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else return response.json().then(text => { throw new Error(text.message) })
      })
      .then(checkFavorite)
      .catch((err) => console.log(err.message))
      .finally(() => disableButton(false));
  }

  useEffect(() => {
    setLoading(true);
    fetch(`${URL}/api/anime/${shortName}`)
      .then(response => response.json())
      .then(data => setAnime(data))
      .catch((err) => console.log(err.message))
      .finally(() => setLoading(false))
  }, [shortName, rating]);

  return (
    isLoading ? <Loading /> :
      <>
        <Helmet>
          <title>{anime.name}</title>
        </Helmet>
        <div className='content'>
          <h1 className={styles.title}>{anime.name}</h1>
          <h2 className={styles.second}>{anime.nameEng}</h2>
          <div className={styles.pictureWrapper}>
            <img className={styles.picture} src={anime.imageUrl} alt="" />
            <div className={styles.absolute}>
              <p>{+anime.averageRating.toFixed(2)}</p>
              {isAuth &&
                <button className={styles.favorite} ref={favoriteRef}
                  onClick={addToFavorite}>
                  <img src={isFavorite ? starFill : star} alt="В избранное" />
                </button>}
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
              <span>{anime.type}</span>
            </div>
            <div className={styles.infoRow}>
              <p>Эпизоды</p>
              <span>{anime.episodesAmount}</span>
            </div>
            <div className={styles.infoRow}>
              <p>Статус</p>
              <span>{anime.exitStatus}</span>
            </div>
            <div className={styles.infoRow}>
              <p>Жанр</p>
              <span>
                {anime.genres.map((genre, index) => index === anime.genres.length - 1 ? genre : `${genre}, `)}
              </span>
            </div>
            <div className={styles.infoRow}>
              <p>Первоисточник</p>
              <span>{anime.primarySource}</span>
            </div>
            <div className={styles.infoRow}>
              <p>Сезон</p>
              <span>{anime.releaseFrom.slice(0, 4)}</span>
            </div>
            <div className={styles.infoRow}>
              <p>Выпуск</p>
              <span>
                с января {anime.releaseFrom.slice(0, 4)} по февраль {anime.releaseBy.slice(0, 4)}
              </span>
            </div>
            <div className={styles.infoRow}>
              <p>Возрастные ограничения</p>
              <span>{anime.ageLimit}</span>
            </div>
            <div className={styles.infoRow}>
              <p>Длительность</p>
              <span>{anime.duration} мин</span>
            </div>
          </div>
          <p className={styles.description}>{anime.description}</p>
          <div className={styles.extra}>
            <h2 className={styles.head}>Кадры из аниме</h2>
            <div style={{ marginBottom: '5vh' }}>
              <Slider pictures={anime.frames} />
            </div>
            <h2 className={styles.head}>Трейлер аниме</h2>
            <iframe id='watch' title='Trailer' src={anime.trailerUrl}></iframe>
            <h2 className={styles.head}>Смотреть аниме {anime.name}</h2>
            <iframe title='Anime' src="//aniqit.com/serial/44055/59f71c4fb69d61db71942f5e8d608042/720p"
              allowFullScreen allow="autoplay *; fullscreen *"></iframe>
          </div>

          <div className={styles.comments}>
            <h3>Комментарии</h3>
            <ul className={styles.userComments}>
              {anime.reviews.map(({ name, reviewText, likes, avatarImageUrl }) => <Comment key={v4()} name={name}
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
        <Rating reference={ratingRef} shortName={shortName} rating={rating} setRating={setRating} />
      </>
  )
}
