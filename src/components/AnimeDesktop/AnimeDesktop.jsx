import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { v4 } from 'uuid';
import Comment from '../Comment/Comment';
import Rating from '../Rating/Rating';
import styles from './AnimeDesktop.module.scss';
import { IS_AUTH, SERVER_URL } from '../../util.js';
import { testAnime } from './anime.js';
import Loading from '../Loading/Loading';
import { Link } from 'react-router-dom';
import star from '../../assets/icons/star.svg';
import starFill from '../../assets/icons/star-fill.svg';
import { useForm } from 'react-hook-form';
import { convertToMonth, setLastPage } from '../../util.js';
import edit from '../../assets/icons/edit.svg';
import delet from '../../assets/icons/delete.svg';
import muted from '../../assets/icons/muted.svg';
import unmuted from '../../assets/icons/unmuted.svg';
import send from '../../assets/icons/send.svg';

export function showRating(ref, isOpen) {
  ref.current.style.opacity = isOpen ? 1 : 0;
  ref.current.style.pointerEvents = isOpen ? 'all' : 'none';
}

export function autoResize(evt) {
  evt.target.style.height = '0';
  evt.target.style.height = `${evt.target.scrollHeight}px`;
}

export default function AnimeDesktop({ shortName, user, setUser }) {
  const { register, formState: { errors }, handleSubmit, reset } = useForm({ mode: 'all' });
  const [isMuted, setMuted] = useState(true);
  const ratingRef = useRef();
  const favoriteRef = useRef();
  const reviewRef = useRef();
  const error = useRef();
  const deleteRef = useRef();
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
        if (!response.ok) {
          return response.json().then(text => { throw new Error(text.message) })
        }
      })
      .then(() => {
        setNewReview(!newReview);
        reset();
      })
      .catch(err => showError(true, err.message))
      .finally(() => {
        disableReviewButton(false);
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
  const disableDeleteButton = isDisable => deleteRef.current.disabled = isDisable;

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
        if (!response.ok) {
          return response.json().then(text => { throw new Error(text.message) })
        }
      })
      .then(() => checkFavorite(anime.id))
      .catch(err => console.log(err.message))
      .finally(() => {
        disableFavoriteButton(false);
      });
  }

  function deleteAnime() {
    disableDeleteButton(true);
    let isDelete = window.confirm(`Вы действительно хотите удалить аниме ${anime.name}?`);
    if (isDelete) {
      fetch(`${SERVER_URL}/api/admin/anime/${anime.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(response => {
          if (response.ok) {
            window.location.href = '..';
            alert(`Аниме ${anime.name} успешно удалено.`);
          } else throw new Error();
        })
        .catch(alert(`Не удалось удалить аниме ${anime.name}.`))
        .finally(() => disableDeleteButton(false))
    }
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
      .then(id => {
        if (IS_AUTH) {
          checkFavorite(id);
        }
      })
      .catch(err => alert('Не удалось получить информацию об аниме.'))
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
  }, [shortName, newReview]);


  return (
    <>
      <Helmet>
        <title>{anime.name}</title>
      </Helmet>
      {isLoading ? <Loading /> :
        <div className={styles.content}>
          <div className={styles.banner}>
            <div className={styles.videoEffect}>
              <video className={styles.trailerVideo} autoPlay loop playsInline
                muted={isMuted}
                src={`${SERVER_URL}/${anime.previewVideoUrl}`}></video>
            </div>
            <div className={styles.mute}>
              <button onClick={() => setMuted(!isMuted)}>
                <img src={isMuted ? muted : unmuted} alt="" />
              </button>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.buttons}>
              <div className={styles.pictureWrapper}>
                <img className={styles.picture} src={`${SERVER_URL}/${anime.imageUrl}`} alt="" />
                <div className={styles.absolute}>
                  {anime.averageRating &&
                    <p>{+anime.averageRating.toFixed(2)}</p>
                  }
                  {IS_AUTH &&
                    <button className={styles.favorite} ref={favoriteRef}
                      onClick={addToFavorite}>
                      <img src={isFavorite ? starFill : star} alt='' />
                    </button>}
                </div>
              </div>
              <a href='#watch'>Смотреть онлайн</a>
              {IS_AUTH ? <button className={styles.rate} onClick={() => showRating(ratingRef, true)}>Поставить оценку</button>
                : <Link to='/login' onClick={setLastPage} className={styles.rate}>Поставить оценку</Link>}
            </div>
            <div className={styles.infoWrapper}>
              <div className={styles.nameWrapper}>
                <h1 className={styles.title}>{anime.name}</h1>
                {user.isAdmin &&
                  <div className={styles.actions}>
                    <Link to='edit' className={styles.edit}>
                      <img src={edit} alt="" />
                    </Link>
                    <button ref={deleteRef} className={styles.edit}
                      onClick={deleteAnime}>
                      <img src={delet} alt="" />
                    </button>
                  </div>}
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
                  <span>{anime.ageLimit}+</span>
                </div>
                <div className={styles.infoRow}>
                  <p>Длительность</p>
                  <span>{anime.duration} мин</span>
                </div>
                <div className={styles.infoRow}>
                  <p>Статус озвучки</p>
                  <span>{anime.voiceoverStatus}</span>
                </div>
                <div className={styles.infoRow}>
                  <p>Тип озвучки</p>
                  <span>{anime.isMonophonic ? 'Одноголосая' : 'Многоголосая'}</span>
                </div>
              </div>
              <div className={styles.descriptionWrapper}>
                <p>Описание</p>
                <span className={styles.description}>{anime.description}</span>
              </div>
            </div>
          </div>
          <div className={styles.player} id='watch'>
            <h2 className={styles.head}>Смотреть аниме {anime.name}</h2>
            <div className={styles.kodik}>
              <iframe
                title='Anime'
                src={`${anime.playerLink}?only_translations=2399&min_age=${anime.ageLimit}&min_age_confirmation=true`}
                allow="autoplay *; fullscreen *">
              </iframe>
            </div>
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
            {IS_AUTH ?
              <form className={styles.write} onSubmit={handleSubmit(sendReview)}>
                <div className={styles.writeWrapper}>
                  <textarea disabled={!IS_AUTH} placeholder='Напишите свое мнение'
                    onInput={autoResize}
                    {...register('message', {
                      required: 'Обязательноe поле.',
                      maxLength: {
                        value: 200,
                        message: 'Максимальная длина комментария 200 символов.'
                      }
                    })} />
                  <button ref={reviewRef} disabled={!IS_AUTH}>
                    <img src={send} alt="" />
                  </button>
                </div>
                {errors?.message && <p className='error'>{errors?.message.message}</p>}
                <p ref={error} className='error-submit'>Возникла ошибка при отправке.</p>
              </form>
              : <h3>Комментарии могут писать только авторизованные пользователи</h3>}
          </div>
          <Rating reference={ratingRef} id={anime.id} shortName={shortName} user={user} setUser={setUser} />
        </div>}

    </>
  )
}