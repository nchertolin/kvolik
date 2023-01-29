import React, { useRef } from 'react'
import styles from './Comment.module.scss';
import user from '../../assets/icons/user.svg';
import like from '../../assets/icons/like.svg';
import liked from '../../assets/icons/like-fill.svg';

export default function Comment({ name, message, likes, imageUrl }) {
  const likeRef = useRef();
  const likesCount = useRef();
  function likeIt() {
    likeRef.current.classList.toggle('liked');
    if (likeRef.current.classList.contains('liked')) {
      likeRef.current.src = liked;
      likesCount.current.textContent = Number(likesCount.current.textContent) + 1;
    } else {
      likeRef.current.src = like;
      likesCount.current.textContent = Number(likesCount.current.textContent) - 1;
    }
  }

  return (
    <li className={styles.comment}>
      <div className={styles.wrapper}>
        <img className={styles.avatar} src={imageUrl} alt="" />
        <div className={styles.content}>
          <div className={styles.info}>
            <h2 className={styles.name}>{name}</h2>
            <span>•</span>
            <h2 className={styles.time}>Вчера</h2>
          </div>
          <p className={styles.message}>{message}</p>
          <div className={styles.actions}>
            <button className={styles.delete}>Удалить</button>
            <div className={styles.likes}>
              <button className={styles.like} onClick={likeIt}><img ref={likeRef} src={like} alt="" /></button>
              <span ref={likesCount}>{likes}</span>
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}
