import React, { useRef } from 'react'
import styles from './Comment.module.scss';
import user from '../../assets/icons/user.svg';
import like from '../../assets/icons/like.svg';
import liked from '../../assets/icons/like-fill.svg';

export default function Comment({ name, shortName, text, likes }) {
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
      <div className={styles.userCommentContent}>
        <p className={styles.time}>Вчера</p>
        <div className={styles.userCommentInfo}>
          <img src={user} alt="" />
          <div>
            <p className={styles.userName}>{name}</p>
            <p className={styles.userShortName}>@{shortName}</p>
          </div>
        </div>
        <p className={styles.userCommentText}>{text}</p>
        <div className={styles.about}>
          <div className={styles.likes}>
            <button className={styles.like} onClick={likeIt}><img ref={likeRef} src={like} alt="" /></button>
            <span ref={likesCount}>{likes}</span>
          </div>
          <div className={styles.editor}>
            <button>Редактировать</button>
            <button>Удалить</button>
          </div>
        </div>
      </div>
    </li>
  )
}
