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
  const [anime, setAnime] = useState(testAnime);
  const [isLoading, setLoading] = useState();

  useEffect(() => {
    setLoading(true);
    fetch(`${URL}/anime/${id}`)
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
              <img className={styles.picture} src={anime.imageUrl} alt="" />
              <a href='#watch'>Смотреть онлайн</a>
              <button className={styles.rate} onClick={() => {
                ratingRef.current.style.opacity = 1;
                ratingRef.current.style.pointerEvents = 'all';
              }}>Оценить аниме</button>
            </div>
            <div className={styles.infoWrapper}>
              <h1 className={styles.title}>{anime.name}</h1>
              <h2 className={styles.second}>{anime.nameEng}</h2>
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
                  <span>{anime.genres[0]}</span>
                </div>
                <div className={styles.infoRow}>
                  <p>Первоисточник</p>
                  <span>{anime.primarySource}</span>
                </div>
                <div className={styles.infoRow}>
                  <p>Сезон</p>
                  <span>{anime.releaseFrom.substring(0, 4)}</span>
                </div>
                <div className={styles.infoRow}>
                  <p>Выпуск</p>
                  <span>
                    с 6 октября {anime.releaseFrom.substring(0, 4)} по 29 июля {anime.releaseBy.substring(0, 4)}
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
            </div>
          </div>
          <p className={styles.description}>{anime.description}</p>

          <div className={styles.extraHeaders}>
            <h2 className={styles.head}>Кадры из аниме</h2>
            <h2 className={styles.head}>Трейлер из аниме</h2>
          </div>
          <div className={styles.extra}>
            <div className={styles.extraItem}>
              <Slider pictures={anime.frames} />
            </div>
            <div className={styles.extraItem}>
              <iframe title='Trailer' src={anime.trailerUrl}></iframe>
            </div>
          </div>
          <div className={styles.player}>
            <h2 id='watch' className={styles.head}>Смотреть аниме {anime.name}</h2>
            <iframe title='Anime' src="//aniqit.com/serial/44055/59f71c4fb69d61db71942f5e8d608042/720p"
              allowFullScreen allow="autoplay *; fullscreen *"></iframe>
          </div>
          <div className={styles.comments}>
            <h3>Комментарии</h3>
            <div className={styles.write}>
              <textarea placeholder='Ваш комментарий'
                onChange={(evt) => {
                  evt.target.style.height = 'auto';
                  evt.target.style.height = `${evt.target.scrollHeight}px`;
                }} />

              <button className='primary-button'>Отправить</button>
            </div>
            <ul className={styles.userComments}>
              {anime.reviews.map(({ username, message, likes }) => <Comment key={v4()} username={username}
                message={message} likes={likes} />)}
            </ul>
            <div className={styles.more}>
              <button className='primary-button'>Загрузить еще</button>
            </div>
          </div>
        </div>
        <Rating reference={ratingRef} />
      </div>
  )
}
