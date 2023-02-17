import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { v4 } from 'uuid';
import Comment from '../Comment/Comment';
import Rating from '../Rating/Rating';
import Slider from '../Slider/Slider';
import styles from './AnimeDesktop.module.scss';
import { isAuth, SERVER_URL } from '../../App';
import { testAnime } from './anime.js';
import Loading from '../Loading/Loading';
import { Link } from 'react-router-dom';
import star from '../../assets/icons/star.svg';
import starFill from '../../assets/icons/star-fill.svg';
import { useForm } from 'react-hook-form';
import { convertToMonth } from '../../util.js';
import edit from '../../assets/icons/edit.svg'

export function showRating(ref, isOpen) {
  ref.current.style.opacity = isOpen ? 1 : 0;
  ref.current.style.pointerEvents = isOpen ? 'all' : 'none';
}

export function autoResize(evt) {
  evt.target.style.height = 'auto';
  evt.target.style.height = `${evt.target.scrollHeight}px`;
}

export default function AnimeDesktop({ shortName, user }) {
  const { register, formState: { errors }, handleSubmit, reset } = useForm({ mode: 'all' });
  const ratingRef = useRef();
  const favoriteRef = useRef();
  const reviewRef = useRef();
  const error = useRef();
  const [anime, setAnime] = useState(testAnime);
  const [isFavorite, setFavorite] = useState();
  const [isLoading, setLoading] = useState();
  const [newReview, setNewReview] = useState();
  const [reviews, setReviews] = useState(testAnime.reviews);

  function sendReview({ message }) {
    disableReviewButton(true);
    fetch(`${SERVER_URL}/api/anime/${anime.id}/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ reviewText: message })
    })
      .then(response => {
        if (!response.ok)
          return response.json().then(text => { throw new Error(text.message) })
      })
      .then(() => setNewReview(!newReview))
      .catch(err => showError(true, err.message))
      .finally(() => {
        disableReviewButton(false);
        reset();
      });
  }

  function showError(isShow, message) {
    if (isShow) {
      error.current.textContent = message;
    }
    error.current.style.display = isShow ? 'block' : 'none';
  }

  const disableReviewButton = isDisable => reviewRef.current.disabled = isDisable;

  const disableFavoriteButton = isDisable => ratingRef.current.disabled = isDisable;

  function checkFavorite(animeId) {
    fetch(`${SERVER_URL}/api/favorites`, {
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
      .then((animes) => setFavorite(animes.some(({ id }) => id === animeId)))
  }

  function addToFavorite() {
    disableFavoriteButton(true);
    fetch(`${SERVER_URL}/api/favorites/${anime.id}`, {
      method: isFavorite ? 'DELETE' : 'POST',
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
      .catch((err) => console.log(err.message))
      .finally(() => {
        checkFavorite(anime.id);
        disableFavoriteButton(false);
      });
  }

  useEffect(() => {
    setLoading(true);
    fetch(`${SERVER_URL}/api/anime/${shortName}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else return response.json().then(text => { throw new Error(text.message) })
      })
      .then(data => {
        setAnime(data);
        setReviews(data.reviews);
        return data.id;
      })
      .then(id => checkFavorite(id))
      .catch(err => console.error(err.message))
      .finally(() => setLoading(false));
  }, [shortName]);

  useEffect(() => {
    fetch(`${SERVER_URL}/api/anime/${shortName}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else return response.json().then(text => { throw new Error(text.message) })
      })
      .then(data => setReviews(data.reviews))
      .catch(err => console.error(err.message))
  }, [shortName, newReview]);


  return (
    <>
      <Helmet>
        <title>{anime.name}</title>
      </Helmet>
      {isLoading ? <Loading /> :
        <div className={styles.content}>
          <div className={styles.row}>
            <div className={styles.buttons}>
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
              <a href='#watch'>Смотреть онлайн</a>
              {isAuth ? <button className={styles.rate} onClick={() => showRating(ratingRef, true)}>Оценить аниме</button>
                : <Link to='../login' className={styles.rate}>Оценить аниме</Link>}
            </div>
            <div className={styles.infoWrapper}>
              <div className={styles.nameWrapper}>
                <h1 className={styles.title}>{anime.name}</h1>
                {user.isAdmin &&
                  <Link to='edit' className={styles.edit}>
                    <img src={edit} alt="" />
                  </Link>}
              </div>
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
                  <p>Жанры</p>
                  <span>{anime.genres.join(', ')}</span>
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
                    с {parseInt(anime.releaseFrom.slice(8, 10))} {convertToMonth(anime.releaseFrom.slice(5, 7))} {anime.releaseFrom.slice(0, 4)} по {parseInt(anime.releaseBy.slice(8, 10))} {convertToMonth(anime.releaseBy.slice(5, 7))} {anime.releaseBy.slice(0, 4)}
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
                <div className={styles.infoRow}>
                  <p>Статус озвучки</p>
                  <span>{anime.voiceoverStatus}</span>
                </div>
                {anime.voiceoverStatus === 'Озвучено' &&
                  <div className={styles.infoRow}>
                    <p>Тип озвучки</p>
                    <span>{anime.isMonophonic ? 'Одноголосая' : 'Многоголосая'}</span>
                  </div>}
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
            <iframe
              title='Anime'
              src={anime.playerLink}
              allow="autoplay *; fullscreen *"></iframe>
          </div>
          <div className={styles.comments}>
            <h3>Комментарии</h3>
            <ul className={styles.userComments}>
              {reviews.map(review =>
                <Comment key={v4()} review={review} animeId={anime.id}
                  isUsers={user.email === review.email || user.isAdmin}
                  setNewReview={setNewReview} newReview={newReview}
                  Liked={review.likedUsersEmails.some(email => email === user.email)} />)}
            </ul>
            {isAuth ?
              <form className={styles.write} onSubmit={handleSubmit(sendReview)}>
                <textarea disabled={!isAuth} placeholder='Ваш комментарий'
                  onChange={autoResize}
                  {...register('message', {
                    required: 'Обязательноe поле.',
                    maxLength: {
                      value: 200,
                      message: 'Максимальная длина комментария 200 символов.'
                    }
                  })} />
                {errors?.message && <p className='error'>{errors?.message.message}</p>}
                <button ref={reviewRef} className='primary-button' disabled={!isAuth}>
                  Отправить
                </button>
                <p ref={error} className='error-submit'>Возникла ошибка при отправке.</p>
              </form>
              : <h3>Комментарии могут писать только авторизованные пользователи</h3>}
          </div>
          <Rating reference={ratingRef} id={anime.id} />
        </div>}
    </>
  )
}