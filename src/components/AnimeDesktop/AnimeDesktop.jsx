import React, { useEffect, useRef, useState } from 'react';
import { v4 } from 'uuid';
import Comment from '../Comment/Comment';
import Rating from '../Rating/Rating';
import Slider from '../Slider/Slider';
import styles from './AnimeDesktop.module.scss';
import { URL } from '../../App';
import { testAnime } from './anime.js';
import Loading from '../Loading/Loading';

export default function AnimeDesktop({ id }) {
  const ratingRef = useRef();
  const [{ name, nameEng, type, episodesAmount, genres, primarySource, releaseFrom, releaseBy,
    ageLimit, duration, description, exitStatus, frames, imageUrl, trailerUrl,
    rating, reviews }, setAnime] = useState(testAnime);
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
      <div>
        <div className={styles.content}>
          <div className={styles.row}>
            <div className={styles.buttons}>
              <div className={styles.pictureWrapper}>
                <img className={styles.picture} src={imageUrl} alt="" />
                <div className={styles.ratingWrapper}>
                  <p>{rating}</p>
                </div>
              </div>
              <a href='#watch'>Смотреть онлайн</a>
              <button className={styles.rate} onClick={() => {
                ratingRef.current.style.opacity = 1;
                ratingRef.current.style.pointerEvents = 'all';
              }}>Оценить аниме</button>
            </div>
            <div className={styles.infoWrapper}>
              <h1 className={styles.title}>{name}</h1>
              <h2 className={styles.second}>{nameEng}</h2>
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
                  <span>{releaseFrom.substring(0, 4)}</span>
                </div>
                <div className={styles.infoRow}>
                  <p>Выпуск</p>
                  <span>
                    с {releaseFrom.substring(0, 4)} по {releaseBy.substring(0, 4)}
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
            </div>
          </div>
          <p className={styles.description}>{description}</p>

          <div className={styles.extraHeaders}>
            <h2 className={styles.head}>Кадры из аниме</h2>
            <h2 className={styles.head}>Трейлер из аниме</h2>
          </div>
          <div className={styles.extra}>
            <div className={styles.extraItem}>
              <Slider pictures={frames} />
            </div>
            <div className={styles.extraItem}>
              <iframe title='Trailer' src={trailerUrl}></iframe>
            </div>
          </div>
          <div className={styles.player}>
            <h2 id='watch' className={styles.head}>Смотреть аниме {name}</h2>
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
      </div >
  )
}
