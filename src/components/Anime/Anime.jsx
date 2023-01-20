import React, { useRef } from 'react'
import styles from './Anime.module.scss';
import Comment from '../Comment/Comment';
import { v4 } from 'uuid';
import Slider from '../Slider/Slider';
import Rating from '../Rating/Rating';

const comments = [
  {
    name: 'uzumaki',
    text: 'Я стану хогаге',
    likes: 99
  },
  {
    name: 'kanekiken',
    text: 'Я не вернусь в антейку',
    likes: 7
  }
]

export default function Anime({ name, picture, genre }) {
  const ratingRef = useRef();
  return (
    <div>
      <div className='content'>
        <h1 className={styles.title}>{name}</h1>
        <h2 className={styles.second}>{name}</h2>
        <img className={styles.picture} src={picture} alt="" />
        <div className={styles.buttons}>
          <a href='#watch'>Смотреть онлайн</a>
          <button onClick={() => {
            ratingRef.current.style.opacity = 1;
            ratingRef.current.style.pointerEvents = 'all';
          }} className={styles.rate}>Оценить аниме</button>
        </div>
        <Rating reference={ratingRef} />
        <div className={styles.info}>
          <div className={styles.infoRow}>
            <p>Тип</p>
            <span>ТВ-Сериал</span>
          </div>
          <div className={styles.infoRow}>
            <p>Эпизоды</p>
            <span>25</span>
          </div>
          <div className={styles.infoRow}>
            <p>Статус</p>
            <span>Вышел</span>
          </div>
          <div className={styles.infoRow}>
            <p>Жанр</p>
            <span>Меха, Фантастика, Экшен, Романтика</span>
          </div>
          <div className={styles.infoRow}>
            <p>Первоисточник</p>
            <span>Оригинал</span>
          </div>
          <div className={styles.infoRow}>
            <p>Сезон</p>
            <span>Осень 2006</span>
          </div>
          <div className={styles.infoRow}>
            <p>Выпуск</p>
            <span>с 6 октября 2006 по 29 июля 2007</span>
          </div>
          <div className={styles.infoRow}>
            <p>Возрастные ограничения</p>
            <span>18+</span>
          </div>
          <div className={styles.infoRow}>
            <p>Длительность</p>
            <span>24 мин</span>
          </div>
        </div>
        <p className={styles.description}>
          Данное аниме расскажет историю про молодого Лелуша, который является наследником престола императора.
          Из-за тяжелой войны, он потерял всю свою семью, став сиротой. Повествование берёт начало,
          когда Британия захватывает треть часть мира, родина Лелуша – Япония, становится маленькой страной,
          которую прозвали «Зоной 13». Мальчик, на могиле родителей, дает обещание, что будет мстить за их смерть.
        </p>
        <div className={styles.extra}>
          <h2 className={styles.head}>Кадры из аниме</h2>
          <Slider pictures={[picture, picture]} />
          <h2 className={styles.head}>Трейлер аниме</h2>
          <iframe id='watch' title='Trailer' src="https://www.youtube.com/embed/tgbNymZ7vqY"></iframe>
          <h2 className={styles.head}>Смотреть аниме {name}</h2>
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
            {comments.map(({ name, text, likes }) => <Comment key={v4()} name={name}
              text={text} likes={likes} />)}
          </ul>
        </div>
      </div>
      <Rating reference={ratingRef} />
    </div>
  )
}
