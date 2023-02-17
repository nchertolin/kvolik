import React, { useRef, useState } from 'react'
import styles from './Comment.module.scss';
import like from '../../assets/icons/like.svg';
import liked from '../../assets/icons/like-fill.svg';
import { SERVER_URL } from '../../App';
import { convertToMonth } from '../../util';

export default function Comment({ review, animeId, setNewReview, newReview, isUsers, Liked }) {
  const [isLiked, setLiked] = useState(Liked);
  const likeRef = useRef();
  const likesCount = useRef();

  const disableLikeButton = isDisable => likeRef.current.disabled = isDisable;

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
        <img className={styles.avatar} src={review.avatarImageUrl} alt="" />
        <div className={styles.content}>
          <h2 className={styles.name}>{review.name}</h2>
          <p className={styles.message}>{review.reviewText}</p>
          <div className={styles.actions}>
            <div className={styles.item}>
              <p className={styles.time}>{review.publishTime.substring(8, 10)} {convertToMonth(review.publishTime.substring(5, 7))} в {new Date(review.publishTime).getHours()}
                :{new Date(review.publishTime).getMinutes()}</p>
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
    </li>
  )
}
