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
import { useForm } from 'react-hook-form';
import { autoResize } from '../AnimeDesktop/AnimeDesktop';

export default function Anime({ shortName, userEmail }) {
  const { register, formState: { errors }, handleSubmit, reset } = useForm({ mode: 'all' });
  const reviewRef = useRef();
  const error = useRef();
  const ratingRef = useRef();
  const favoriteRef = useRef();
  const [anime, setAnime] = useState(testAnime);
  const [isLoading, setLoading] = useState();
  const [isFavorite, setFavorite] = useState();
  const [newReview, setNewReview] = useState();
  const [reviews, setReviews] = useState(testAnime.reviews);


  const disableReviewButton = isDisable => reviewRef.current.disabled = isDisable;
  const disableFavoriteButton = isDisable => ratingRef.current.disabled = isDisable;

  function showError(isShow, message) {
    if (isShow) {
      error.current.textContent = message;
    }
    error.current.style.display = isShow ? 'block' : 'none';
  }

  function checkFavorite(animeId) {
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
      .then((animes) => setFavorite(animes.some(({ id }) => id === animeId)))
  }

  function addToFavorite() {
    disableFavoriteButton(true);
    fetch(`${URL}/api/favorites/${shortName}`, {
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

  function sendReview({ message }) {
    disableReviewButton(true);
    fetch(`${URL}/api/anime/${anime.id}/review`, {
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

  useEffect(() => {
    setLoading(true);
    fetch(`${URL}/api/anime/${shortName}`)
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

  //When adding a new comment, data loading
  useEffect(() => {
    fetch(`${URL}/api/anime/${shortName}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else return response.json().then(text => { throw new Error(text.message) })
      })
      .then(data => setReviews(data.reviews))
      .catch(err => console.error(err.message))
  }, [shortName, newReview]);


  return (
    isLoading ? <Loading /> :
      <>
        <Helmet>
          <title>{anime.name}</title>
        </Helmet>
        {isLoading ? <Loading /> :
          <>
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
                <iframe
                  title='Anime'
                  src="//aniqit.com/serial/44055/59f71c4fb69d61db71942f5e8d608042/720p"
                  allowFullScreen allow="autoplay *; fullscreen *">
                </iframe>
              </div>
              <div className={styles.comments}>
                <h3>Комментарии</h3>
                <ul className={styles.userComments}>
                  {reviews.map(review =>
                    <Comment key={v4()} review={review} animeId={anime.id}
                      isUsers={userEmail === review.email}
                      setNewReview={setNewReview} newReview={newReview}
                      Liked={review.likedUsersEmails.some(email => email === userEmail)} />)}
                  {/* <li className={styles.more}><button className='primary-button'>Загрузить еще</button></li> */}
                </ul>
                {isAuth ?
                  <form className={styles.write} onSubmit={handleSubmit(sendReview)}>
                    <textarea disabled={!isAuth} placeholder='Ваш комментарий' onChange={autoResize}
                      {...register('message', {
                        required: 'Обязательноe поле.',
                        maxLength: { value: 200, message: 'Максимальная длина комментария 200 символов.' }
                      })} />
                    {errors?.message && <p className='error'>{errors?.message.message}</p>}
                    <button ref={reviewRef} className='primary-button' disabled={!isAuth}>Отправить</button>
                    <p ref={error} className='error-submit'>Возникла ошибка при отправке.</p>
                  </form>
                  : <h3>Комментарии могут писать только авторизованные пользователи</h3>}
              </div>
            </div>
            <Rating reference={ratingRef} shortName={shortName} />
          </>}
      </>
  )
}
