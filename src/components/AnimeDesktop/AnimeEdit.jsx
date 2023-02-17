import React, { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet';
import { FILE_TYPES, SERVER_URL } from '../../App';
import Loading from '../Loading/Loading';
import { testAnime } from './anime';
import styles from './AnimeDesktop.module.scss';

export default function AnimeEdit({ shortName }) {
  const [anime, setAnime] = useState(testAnime);
  const [isLoading, setLoading] = useState();
  const [imageUrl, setImageUrl] = useState(anime.imageUrl);
  const [name, setName] = useState(anime.name);
  const [nameEng, setNameEng] = useState(anime.nameEng);
  const [type, setType] = useState(anime.type);
  const [episodesAmount, setEpisodesAmount] = useState(anime.episodesAmount);
  const [exitStatus, setExitStatus] = useState(anime.exitStatus);
  const [genres, setGenres] = useState(anime.genres.join(', '));
  const [primarySource, setPrimarySource] = useState(anime.primarySource);
  const [releaseFrom, setReleaseFrom] = useState(anime.releaseFrom);
  const [releaseBy, setReleaseBy] = useState(anime.releaseBy);
  const [ageLimit, setAgeLimit] = useState(anime.ageLimit);
  const [duration, setDuration] = useState(anime.duration);
  const [description, setDescription] = useState(anime.description);
  const [isMonophonic, setMonophonic] = useState(anime.isMonophonic);
  const [voiceoverStatus, setVoiceoverStatus] = useState(anime.voiceoverStatus);
  const [trailerUrl, setTrailerUrl] = useState(anime.trailerUrl);
  const [playerLink, setPlayerLink] = useState(anime.playerLink);
  const [frames, setFrames] = useState(anime.frames);
  const error = useRef();
  const submit = useRef();

  function previewHandler(evt) {
    const file = evt.target.files[0];
    const fileName = file.name.toLowerCase();
    const matches = FILE_TYPES.some((it) => fileName.endsWith(it));

    if (matches) {
      setImageUrl(URL.createObjectURL(file));
      console.log(file);
    }
  }

  function framesHandler(evt, index) {
    const file = evt.target.files[0];
    const fileName = file.name.toLowerCase();
    const matches = FILE_TYPES.some(it => fileName.endsWith(it));

    if (matches) {
      const newFrames = [...frames];
      newFrames[index] = URL.createObjectURL(file)
      setFrames(newFrames);
    }
  }

  function showError(isShow, message) {
    if (isShow) {
      error.current.textContent = message;
    }
    error.current.style.display = isShow ? 'block' : 'none';
  }

  const disableButton = isDisable => submit.current.disabled = isDisable;

  function edit() {
    const data = {
      imageUrl: imageUrl,
      name: name,
      nameEng: nameEng,
      type: type,
      episodesAmount: episodesAmount,
      exitStatus: exitStatus,
      genres: genres,
      primarySource: primarySource,
      releaseFrom: releaseFrom,
      releaseBy: releaseBy,
      ageLimit: ageLimit,
      duration: duration,
      description: description,
      isMonophonic: isMonophonic,
      voiceoverStatus: voiceoverStatus,
      trailerUrl: trailerUrl,
      playerLink: playerLink,
      frames: frames
    };

    fetch(`${SERVER_URL}/api/admin/anime`, {
      body: JSON.stringify(data),
      method: 'PUT',
      headers: {
        //'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else return response.json().then(text => { throw new Error(text.message) })
      })
      .then(() => window.location = '../')
      .catch(err => showError(true, err.message))
      .finally(() => {
        disableButton(false);
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
        return data.id;
      })
      .catch(err => console.error(err.message))
      .finally(() => setLoading(false));
  }, [shortName]);

  return (
    <div className={styles.editor}>
      <Helmet>
        <title>Редактирование - {anime.name}</title>
      </Helmet>
      {isLoading ? <Loading /> :
        <div className={styles.content}>
          <div className={styles.row}>
            <label className={styles.pictureWrapper}>
              <img className={styles.picture} src={imageUrl} alt="" />
              <input type="file" name='frame-6'
                onChange={previewHandler} />
            </label>
            <div className={styles.infoWrapper}>
              <label>
                Название
                <input type="text" value={name} onChange={evt => setName(evt.target.value)} />
              </label>
              <label>
                Английское название
                <input type="text" value={nameEng} onChange={evt => setNameEng(evt.target.value)} />
              </label>
              <div className={styles.info}>
                <div className={styles.infoRow}>
                  <p>Тип</p>
                  <input type="text" value={type} onChange={evt => setType(evt.target.value)} />
                </div>
                <div className={styles.infoRow}>
                  <p>Эпизоды</p>
                  <input type="text" value={episodesAmount} onChange={evt => setEpisodesAmount(evt.target.value)} />
                </div>
                <div className={styles.infoRow}>
                  <p>Статус</p>
                  <input type="text" value={exitStatus} onChange={evt => setExitStatus(evt.target.value)} />
                </div>
                <div className={styles.infoRow}>
                  <p>Жанры</p>
                  <input type="text" value={genres} onChange={evt => setGenres(evt.target.value)} />
                </div>
                <div className={styles.infoRow}>
                  <p>Первоисточник</p>
                  <input type="text" value={primarySource} onChange={evt => setPrimarySource(evt.target.value)} />
                </div>
                <div className={styles.infoRow}>
                  <p>Выпуск</p>
                  <input type="text" value={releaseFrom} onChange={evt => setReleaseFrom(evt.target.value)} />
                </div>
                <div className={styles.infoRow}>
                  <p>Конец</p>
                  <input type="text" value={releaseBy} onChange={evt => setReleaseBy(evt.target.value)} />
                </div>
                <div className={styles.infoRow}>
                  <p>Возрастные ограничения</p>
                  <input type="text" value={ageLimit} onChange={evt => setAgeLimit(evt.target.value)} />
                </div>
                <div className={styles.infoRow}>
                  <p>Длительность</p>
                  <input type="text" value={duration} onChange={evt => setDuration(evt.target.value)} />
                </div>
                <div className={styles.infoRow}>
                  <p>Статус озвучки</p>
                  <input type="text" value={voiceoverStatus} onChange={evt => setVoiceoverStatus(evt.target.value)} />
                </div>
                <div className={styles.infoRow}>
                  <p>Тип озвучки</p>
                  <input type="text" value={isMonophonic} onChange={evt => setMonophonic(evt.target.value)} />
                </div>
              </div>
            </div>
          </div>
          <label>
            Описание
            <textarea value={description} onChange={evt => setDescription(evt.target.value)} />
          </label>
          <div className={styles.links}>
            <label>
              Ссылка на трейлер
              <input type="text" value={trailerUrl} onChange={evt => setTrailerUrl(evt.target.value)} />
              <i>Пример: https://youtu.be/v-AGjx0N24U  ------  https://www.youtube-nocookie.com/embed/v-AGjx0N24U</i>
            </label>
            <label>
              Ссылка на плеер
              <input type="text" value={playerLink} onChange={evt => setPlayerLink(evt.target.value)} />
            </label>
          </div>
          <div className={styles.frames}>
            {frames.map((frame, index) =>
              <label className={styles.frameInput}>
                <img src={frames[index]} alt="" />
                <input type="file"
                  onChange={evt => framesHandler(evt, index)} />
              </label>)}
          </div>
          <label className={styles.submit}>
            <button ref={submit} className='primary-button'
              onClick={edit}
            >Сохранить</button>
            <p ref={error} className='error-submit'>Возникла ошибка при добавлении.</p>
          </label>
        </div>}
    </div>
  )
}
