import React, { useRef, useState } from 'react'
import styles from './Comment.module.scss';
import like from '../../assets/icons/like.svg';
import liked from '../../assets/icons/like-fill.svg';
import { URL } from '../../App';

export default function Comment({ id, name, reviewText, likes, avatarImageUrl, animeId, publishTime,
  isUser, setNewReview, newReview }) {
  const [isLiked, setLiked] = useState();
  const likeRef = useRef();
  const likesCount = useRef();

  const disableLikeButton = isDisable => likeRef.current.disabled = isDisable;

  function likeIt() {
    disableLikeButton(true);
    fetch(`${URL}/api/anime/${animeId}/review/${id}/like`, {
      method: isLiked ? 'DELETE' : 'POST',
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
      .then(() => setLiked(!isLiked))
      .catch(err => console.log(err.message))
      .finally(() => disableLikeButton(false));
  }

  function deleteIt() {
    fetch(`${URL}/api/anime/${animeId}/review/${id}`, {
      method: 'DELETE',
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
      .then(() => setNewReview(!newReview))
      .catch(err => console.log(err.message));
  }

  return (
    <li className={styles.comment}>
      <div className={styles.wrapper}>
        <img className={styles.avatar} src={avatarImageUrl} alt="" />
        <div className={styles.content}>
          <h2 className={styles.name}>{name}</h2>
          <p className={styles.message}>{reviewText}</p>
          <div className={styles.actions}>
            <div className={styles.item}>
              <p className={styles.time}>{publishTime.substring(8, 10)}.{publishTime.substring(5, 7)}</p>
              {!isUser && <button className={styles.delete} disabled={isUser}
                onClick={deleteIt}>Удалить</button>}
            </div>
            <div className={styles.likes}>
              <button className={styles.like} onClick={likeIt}>
                <img ref={likeRef} src={isLiked ? liked : like} alt="нравится" /></button>
              <span ref={likesCount}>{likes}</span>
            </div>
          </div>
        </div>
      </div>
    </li >
  )
}
