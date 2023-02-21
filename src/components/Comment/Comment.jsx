import React, { useEffect, useRef, useState } from 'react'
import styles from './Comment.module.scss';
import like from '../../assets/icons/like.svg';
import liked from '../../assets/icons/like-fill.svg';
import checked from '../../assets/icons/checked.svg';
import { SERVER_URL } from '../../util.js';
import { convertToMonth } from '../../util';

export default function Comment({ review, animeId, setNewReview, newReview, isUsers, Liked }) {
  const [isLiked, setLiked] = useState(Liked);
  const [time, setTime] = useState(review.publishTime);
  const likeRef = useRef();
  const likesCount = useRef();

  const disableLikeButton = isDisable => likeRef.current.disabled = isDisable;

  function getTime() {
    const date = new Date(review.publishTime);
    const month = convertToMonth(review.publishTime.substring(5, 7));
    const day = date.getDay();
    const hours = date.getHours()
    const minutes = date.getMinutes();
    return `${day} ${month} в ${hours}:${minutes}`;
  }

  useEffect(() => {
    const date = new Date(review.publishTime);
    const month = convertToMonth(review.publishTime.substring(5, 7));
    const day = review.publishTime.substring(8, 10);
    const hours = date.getHours();
    const minutes = date.getMinutes();

    setTime(`${day} ${month} в ${hours}:${minutes > 9 ? minutes : `0${minutes}`}`);
  }, [review.publishTime]);

  function likeIt() {
    disableLikeButton(true);
    fetch(`${SERVER_URL}/api/anime/${animeId}/review/${review.id}/like`, {
      method: isLiked ? 'DELETE' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        if (!response.ok) return response.json().then(text => { throw new Error(text.message) })
      })
      .then(() => {
        setLiked(!isLiked);
        setNewReview(!newReview);
      })
      .catch(err => console.error(err.message))
      .finally(() => disableLikeButton(false));
  }

  function deleteIt() {
    fetch(`${SERVER_URL}/api/anime/${animeId}/review/${review.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        if (!response.ok) return response.json().then(text => { throw new Error(text.message) })
      })
      .then(() => setNewReview(!newReview))
      .catch(err => console.error(err.message));
  }

  return (
    <li className={styles.comment}>
      <div className={styles.wrapper}>
        <img className={`${styles.avatar} ${review.isAdmin ? styles.admin : ''}`} src={`${SERVER_URL}/${review.avatarImageUrl}`} alt="" />
        <div className={styles.content}>
          <div className={styles.nameWrapper}>
            <h2 className={`${styles.name} ${review.isAdmin ? styles.checked : ''}`}>{review.name}</h2>
          </div>
          <p className={styles.message}>{review.reviewText}</p>
          <div className={styles.actions}>
            <div className={styles.item}>
              <time dateTime={review.publishTime}
                className={styles.time}>{time}</time>
              {isUsers && <button className={styles.delete} onClick={deleteIt}>Удалить</button>}
            </div>
            <div className={styles.likes}>
              <button className={styles.like} onClick={likeIt}>
                <img ref={likeRef} src={isLiked ? liked : like} alt="нравится" /></button>
              <span ref={likesCount}>{review.likes}</span>
            </div>
          </div>
        </div>
      </div>
    </li >
  )
}
