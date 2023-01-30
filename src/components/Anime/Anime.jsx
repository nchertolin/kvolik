import React, { useEffect, useRef, useState } from 'react'
import styles from './Anime.module.scss';
import Comment from '../Comment/Comment';
import { v4 } from 'uuid';
import Slider from '../Slider/Slider';
import Rating from '../Rating/Rating';
import { testAnime } from '../AnimeDesktop/anime.js';
import Loading from '../Loading/Loading';

export default function Anime({ id }) {
  const ratingRef = useRef();
  const [{ name, nameEng, type, episodesAmount, genres, primarySource, releaseFrom, releaseBy,
    ageLimit, duration, description, exitStatus, frames, imageUrl, trailerUrl, rating, reviews }, setAnime] = useState(testAnime);
  const [isLoading, setLoading] = useState();

  useEffect(() => {
    setLoading(true);
    fetch(`${URL}/api/anime/${id}`)
      .then(response => response.json())
      .then(data => setAnime(data))
      .catch(() => setAnime(testAnime))
      .finally(() => setLoading(false))
  }, [id]);
  return (
    isLoading ? <Loading /> :
      <>
        <div className='content'>
          <h1 className={styles.title}>{name}</h1>
          <h2 className={styles.second}>{nameEng}</h2>
          <div className={styles.pictureWrapper}>
            <img className={styles.picture} src={imageUrl} alt="" />
            <div className={styles.ratingWrapper}>
              <p>{rating}</p>
            </div>
          </div>
          <div className={styles.buttons}>
            <a href='#watch'>Смотреть онлайн</a>
            <button onClick={() => {
              ratingRef.current.style.opacity = 1;
              ratingRef.current.style.pointerEvents = 'all';
            }} className={styles.rate}>Оценить аниме</button>
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
              <span>{genres[0]}</span>
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
              <span>с {releaseFrom.slice(0, 4)} по {releaseBy.slice(0, 4)}</span>
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
              {reviews.map(({ name, message, likes, imageUrl }) => <Comment key={v4()} name={name}
                message={message} likes={likes} imageUrl={imageUrl} />)}
              <li className={styles.more}><button className='primary-button'>Загрузить еще</button></li>
            </ul>
            <div className={styles.write}>
              <textarea placeholder='Ваш комментарий'
                onChange={(evt) => {
                  evt.target.style.height = 'auto';
                  evt.target.style.height = `${evt.target.scrollHeight}px`;
                }} />

              <button className='primary-button'>Отправить</button>
            </div>
          </div>
        </div>
        <Rating reference={ratingRef} />
      </>
  )
}
