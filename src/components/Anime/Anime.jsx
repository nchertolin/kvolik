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
import { convertToMonth, setLastPage } from '../../util.js';
import star from '../../assets/icons/star.svg';
import starFill from '../../assets/icons/star-fill.svg';
import { useForm } from 'react-hook-form';
import { autoResize } from '../AnimeDesktop/AnimeDesktop';
import { IS_AUTH, SERVER_URL } from '../../util.js';

export default function Anime({ shortName, user, setUser }) {
  const { register, formState: { errors }, handleSubmit, reset } = useForm({ mode: 'all' });
  const reviewRef = useRef();
  const error = useRef();
  const ratingRef = useRef();
  const favoriteRef = useRef();
  const descriptionRef = useRef();
  const [isDesctiptionShown, setDescriptionShown] = useState(false);
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
    fetch(`${SERVER_URL}/api/favorites/`, {
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
      .then(animes => setFavorite(animes.some(({ id }) => id === animeId)))
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
      .catch(err => console.log(err.message))
      .finally(() => {
        checkFavorite(anime.id);
        disableFavoriteButton(false);
      });
  }

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
      .then(() => {
        setNewReview(!newReview);
        reset();
      })
      .catch(err => showError(true, err.message))
      .finally(() => {
        disableReviewButton(false);
        reset();
      });
  }

  function showDescription(evt) {
    descriptionRef.current.classList.toggle(styles.opened);
    setDescriptionShown(!isDesctiptionShown);
    evt.target.textContent = isDesctiptionShown ? '???????????????? ??????' : '????????????'
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
      .catch(err => alert(err.message))
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
    isLoading ? <Loading /> :
      <>
        <Helmet>
          <title>{anime.name}</title>
          <meta name="description" content={`???????????????? ?????????? ${anime.name} ?? ?????????????? KvolikDub.`} />
          <meta name="keywords"
            content={`${anime.name}, ????????????????????????, ?? ?????????????? ????????????????`} />
        </Helmet>
        {isLoading ? <Loading /> :
          <>
            <div className='content'>
              <h1 className={styles.title}>{anime.name}</h1>
              <h2 className={styles.second}>{anime.nameEng}</h2>
              <div className={styles.pictureWrapper}>
                <img className={styles.picture} src={`${SERVER_URL}/${anime.imageUrl}`} alt="" />
                <div className={styles.absolute}>
                  {anime.averageRating &&
                    <p>{+anime.averageRating.toFixed(2)}</p>}
                  {IS_AUTH &&
                    <button className={styles.favorite} ref={favoriteRef}
                      onClick={addToFavorite}>
                      <img src={isFavorite ? starFill : star} alt="?? ??????????????????" />
                    </button>}
                </div>
              </div>
              <div className={styles.buttons}>
                <a href='#watch'>???????????????? ????????????</a>
                {IS_AUTH ? <button className={styles.rate} onClick={() => showRating(ratingRef, true)}>?????????????????? ????????????</button>
                  : <Link to='/login' onClick={setLastPage} className={styles.rate}>?????????????????? ????????????</Link>}
              </div>
              <Rating reference={ratingRef} />
              <div className={styles.info}>
                <div className={styles.infoRow}>
                  <p>??????</p>
                  <span>{anime.type}</span>
                </div>
                <div className={styles.infoRow}>
                  <p>??????????????</p>
                  <span>{anime.episodesAmount}</span>
                </div>
                <div className={styles.infoRow}>
                  <p>????????????</p>
                  <span>{anime.exitStatus}</span>
                </div>
                <div className={styles.infoRow}>
                  <p>??????????</p>
                  <span>{anime.genres.join(', ')}</span>
                </div>
                <div className={styles.infoRow}>
                  <p>??????????????????????????</p>
                  <span>{anime.primarySource}</span>
                </div>
                <div className={styles.infoRow}>
                  <p>??????????</p>
                  <span>{anime.releaseFrom.slice(0, 4)}</span>
                </div>
                <div className={styles.infoRow}>
                  <p>????????????</p>
                  <span>
                    ?? {parseInt(anime.releaseFrom.slice(8, 10))} {convertToMonth(anime.releaseFrom.slice(5, 7))} {anime.releaseFrom.slice(0, 4)} ???? {parseInt(anime.releaseBy.slice(8, 10))} {convertToMonth(anime.releaseBy.slice(5, 7))} {anime.releaseBy.slice(0, 4)}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <p>???????????????????? ??????????????????????</p>
                  <span>{anime.ageLimit}+</span>
                </div>
                <div className={styles.infoRow}>
                  <p>????????????????????????</p>
                  <span>{anime.duration} ??????</span>
                </div>
                <div className={styles.infoRow}>
                  <p>???????????? ??????????????</p>
                  <span>{anime.voiceoverStatus}</span>
                </div>
                <div className={styles.infoRow}>
                  <p>?????? ??????????????</p>
                  <span>{anime.isMonophonic ? '??????????????????????' : '????????????????????????'}</span>
                </div>
              </div>
              <div>
                <p ref={descriptionRef}
                  className={styles.description}>
                  {anime.description}
                </p>
                <button className={styles.readMore}
                  onClick={showDescription}>
                  ???????????????? ??????
                </button>
              </div>
              <div className={styles.extra}>
                <h2 className={styles.head}>?????????? ???? ??????????</h2>
                <div style={{ marginBottom: '5vh' }}>
                  <Slider pictures={anime.frames.map(frameUrl => `${SERVER_URL}/${frameUrl}`)} />
                </div>
                <h2 className={styles.head}>?????????????? ??????????</h2>
                <iframe title='Trailer' src={anime.trailerUrl}></iframe>
                <div id='watch' className={styles.player}>
                  <h2 className={styles.head}>???????????????? ?????????? {anime.name}</h2>
                  <div className={styles.kodik}>
                    <iframe
                      title='Anime'
                      src={`${anime.playerLink}?only_translations=2399&min_age=${anime.ageLimit}&min_age_confirmation=true`}
                      allow="autoplay *; fullscreen *">
                    </iframe>
                  </div>
                </div>
              </div>
              <div className={styles.comments}>
                <h3>??????????????????????</h3>
                <ul className={styles.userComments}>
                  {reviews.map(review =>
                    <Comment key={v4()} review={review} animeId={anime.id}
                      isUsers={user.email === review.email || user.isAdmin}
                      setNewReview={setNewReview} newReview={newReview}
                      Liked={review.likedUsersEmails.some(email => email === user.email)} />)}
                </ul>
                {IS_AUTH ?
                  <form className={styles.write} onSubmit={handleSubmit(sendReview)}>
                    <textarea disabled={!IS_AUTH} placeholder='?????? ??????????????????????' onInput={autoResize}
                      {...register('message', {
                        required: '??????????????????????e ????????.',
                        maxLength: { value: 200, message: '???????????????????????? ?????????? ?????????????????????? 200 ????????????????.' }
                      })} />
                    {errors?.message && <p className='error'>{errors?.message.message}</p>}
                    <button ref={reviewRef} className='primary-button' disabled={!IS_AUTH}>??????????????????</button>
                    <p ref={error} className='error-submit'>???????????????? ???????????? ?????? ????????????????.</p>
                  </form>
                  : <h3>?????????????????????? ?????????? ???????????? ???????????? ???????????????????????????? ????????????????????????</h3>}
              </div>
            </div>
            <Rating reference={ratingRef} id={anime.id} shortName={shortName} user={user} setUser={setUser} />
          </>}
      </>
  )
}
