import React, { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet';
import { IMAGE_TYPES, SERVER_URL, VIDEO_TYPES } from '../../util.js';
import Loading from '../Loading/Loading';
import { testAnime } from './anime';
import styles from './AnimeDesktop.module.scss';
import placeholder from '../../assets/icons/placeholder.svg'
import { v4 } from 'uuid';
import muted from '../../assets/icons/muted.svg';
import unmuted from '../../assets/icons/unmuted.svg';

export default function AnimeEdit({ shortName }) {
  const [flag, setFlag] = useState(true);
  const [anime, setAnime] = useState(testAnime);
  const [isLoading, setLoading] = useState();
  const [imageUrl, setImageUrl] = useState(anime.imageUrl);
  const [imageUri, setImageUri] = useState(null);
  const [name, setName] = useState(anime.name);
  const [nameEng, setNameEng] = useState(anime.nameEng);
  const [animeShortName, setShortName] = useState(shortName);
  const [type, setType] = useState(anime.type);
  const [episodesAmount, setEpisodesAmount] = useState(anime.episodesAmount);
  const [exitStatus, setExitStatus] = useState(anime.exitStatus);
  const [genres, setGenres] = useState(anime.genres.join(','));
  const [primarySource, setPrimarySource] = useState(anime.primarySource);
  const [releaseFrom, setReleaseFrom] = useState(anime.releaseFrom.substring(0, 10));
  const [releaseBy, setReleaseBy] = useState(anime.releaseBy.substring(0, 10));
  const [ageLimit, setAgeLimit] = useState(anime.ageLimit);
  const [duration, setDuration] = useState(anime.duration);
  const [description, setDescription] = useState(anime.description);
  const [isMonophonic, setMonophonic] = useState(anime.isMonophonic);
  const [voiceoverStatus, setVoiceoverStatus] = useState(anime.voiceoverStatus);
  const [trailerUrl, setTrailerUrl] = useState(anime.trailerUrl);
  const [playerLink, setPlayerLink] = useState(anime.playerLink);
  const [frames, setFrames] = useState(anime.frames.length
    ? [...anime.frames]
    : [placeholder, placeholder, placeholder, placeholder, placeholder]);
  const [previewVideoUrl, setPreviewVideoUrl] = useState(anime.previewVideoUrl);
  const [videoFile, setVideoFile] = useState(null);
  const [isVideoChanging, setVideoChanging] = useState();
  const [isMuted, setMuted] = useState(true);
  const [framesFiles, setFramesFiles] = useState([])
  const error = useRef();
  const submit = useRef();

  function previewHandler(evt) {
    const file = evt.target.files[0];
    const fileName = file.name.toLowerCase();
    const matches = IMAGE_TYPES.some((it) => fileName.endsWith(it));

    if (matches) {
      setImageUrl(URL.createObjectURL(file));
      setImageUri(evt.target.files[0]);
    }
  }

  function framesHandler(evt, index) {
    const file = evt.target.files[0];
    const fileName = file.name.toLowerCase();
    const matches = IMAGE_TYPES.some(it => fileName.endsWith(it));

    if (matches) {
      const newFrames = [...frames];
      if (flag) {
        newFrames.forEach((image, index) => newFrames[index] = placeholder);
        setFlag(false);
      } else {
        newFrames.forEach((image, index) => {
          if (image === placeholder) {
            newFrames[index] = placeholder;
          }
        });
      }
      newFrames[index] = URL.createObjectURL(file);
      const newFramesFiles = [...framesFiles];
      newFramesFiles[index] = file;
      setFrames(newFrames);
      setFramesFiles(newFramesFiles.filter(file => file !== null));
    }
  }

  function showError(isShow, message) {
    if (isShow) {
      error.current.textContent = message;
    }
    error.current.style.display = isShow ? 'block' : 'none';
  }

  function videoHandler(evt) {
    const file = evt.target.files[0];
    const fileName = file.name.toLowerCase();
    const matches = VIDEO_TYPES.some((it) => fileName.endsWith(it));

    if (matches) {
      setVideoChanging(true);
      setPreviewVideoUrl(URL.createObjectURL(file));
      setVideoFile(file);
    }
  }

  function setAnimeData(data) {
    setImageUrl(data.imageUrl);
    setName(data.name);
    setNameEng(data.nameEng)
    setType(data.type);
    setEpisodesAmount(data.episodesAmount);
    setExitStatus(data.exitStatus);
    setGenres(data.genres.join(','));
    setPrimarySource(data.primarySource)
    setReleaseFrom(data.releaseFrom.substring(0, 10))
    setReleaseBy(data.releaseBy.substring(0, 10))
    setAgeLimit(data.ageLimit)
    setDuration(data.duration)
    setDescription(data.description)
    setMonophonic(data.isMonophonic)
    setVoiceoverStatus(data.voiceoverStatus)
    setTrailerUrl(data.trailerUrl)
    setPlayerLink(data.playerLink);
    setFrames(data.frames.length
      ? [...data.frames]
      : [placeholder, placeholder, placeholder, placeholder, placeholder]);
    setPreviewVideoUrl(data.previewVideoUrl);
  }

  const disableButton = isDisable => submit.current.disabled = isDisable;

  function edit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('imageUri', imageUri)
    formData.append('name', name);
    formData.append('shortName', animeShortName);
    formData.append('nameEng', nameEng);
    formData.append('type', type);
    formData.append('episodesAmount', episodesAmount);
    formData.append('exitStatus', exitStatus);
    genres.split(',').forEach(genre => formData.append('genres', genre));
    formData.append('primarySource', primarySource);
    formData.append('releaseFrom', new Date(releaseFrom).toISOString());
    formData.append('releaseBy', new Date(releaseBy).toISOString());
    formData.append('ageLimit', ageLimit);
    formData.append('duration', duration);
    formData.append('description', description);
    formData.append('isMonophonic', isMonophonic);
    formData.append('voiceoverStatus', voiceoverStatus);
    formData.append('trailerUrl', trailerUrl);
    formData.append('playerLink', playerLink);
    framesFiles.forEach(file => formData.append('frames', file));
    formData.append('duration', duration);
    formData.append('previewVideoUri', videoFile);

    fetch(`${SERVER_URL}/api/admin/anime/${anime.id}`, {
      body: formData,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        if (response.ok) {
          window.location.href = '..';
          alert(`Аниме ${anime.name} успешно изменено.`);
        } else return response.json().then(text => { throw new Error(text.message) })
      })
      .then(() => window.location.href = '../')
      .catch(err => showError(true, err.message))
      .finally(() => disableButton(false));
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
        setAnimeData(data);
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
          <form onSubmit={edit}>
            <div className={styles.row}>
              <label className={styles.pictureWrapper}>
                <img className={styles.picture} src={`${SERVER_URL}/${imageUrl}`} alt="" />
                <input type="file" name='frame-6'
                  onChange={previewHandler} />
              </label>
              <div className={styles.infoWrapper}>
                <label>
                  Название
                  <input type="text" value={name} onChange={evt => setName(evt.target.value)} required />
                </label>
                <label>
                  Английское название
                  <input type="text" value={nameEng} onChange={evt => setNameEng(evt.target.value)} required />
                </label>
                <label>
                  Короткое имя
                  <input type="text" value={animeShortName} onChange={evt => setShortName(evt.target.value)} required />
                </label>
                <div className={styles.info}>
                  <div className={styles.infoRow}>
                    <p>Тип</p>
                    <input type="text" value={type} onChange={evt => setType(evt.target.value)} required />
                  </div>
                  <div className={styles.infoRow}>
                    <p>Эпизоды</p>
                    <input type="number" value={episodesAmount} onChange={evt => setEpisodesAmount(evt.target.value)} required />
                  </div>
                  <div className={styles.infoRow}>
                    <p>Статус аниме</p>
                    <select required value={exitStatus === 'Онгоинг' ? 0 : 1}
                      onChange={evt => setExitStatus(evt.target.value)}>
                      <option value='0'>Онгоинг</option>
                      <option value='1'>Вышел</option>
                    </select>
                  </div>
                  <div className={styles.infoRow}>
                    <p>Жанры</p>
                    <input type="text" value={genres} onChange={evt => setGenres(evt.target.value)} required />
                  </div>
                  <div className={styles.infoRow}>
                    <p>Первоисточник</p>
                    <select value={primarySource} required
                      onChange={evt => setPrimarySource(evt.target.value)}>
                      <option value='Манга'>Манга</option>
                      <option value='Оригинал'>Оригинал</option>
                      <option value='Ранобе'>Ранобе</option>
                      <option value='Манхва'>Манхва</option>
                    </select>
                  </div>
                  <div className={styles.infoRow}>
                    <p>Выпуск</p>
                    <input type="date" value={releaseFrom} onChange={evt => setReleaseFrom(evt.target.value)} required />
                  </div>
                  <div className={styles.infoRow}>
                    <p>Конец</p>
                    <input type="date" value={releaseBy} onChange={evt => setReleaseBy(evt.target.value)} required />
                  </div>
                  <div className={styles.infoRow}>
                    <p>Возрастные ограничения</p>
                    <input type="number" value={ageLimit} onChange={evt => setAgeLimit(evt.target.value)} required />
                  </div>
                  <div className={styles.infoRow}>
                    <p>Длительность</p>
                    <input type="number" value={duration} onChange={evt => setDuration(evt.target.value)} required />
                  </div>
                  <div className={styles.infoRow}>
                    <p>Статус озвучки</p>
                    <select value={voiceoverStatus === 'Озвучено' ? 0 : 1} required
                      onChange={evt => setVoiceoverStatus(evt.target.value)}>
                      <option value='0'>Озвучено</option>
                      <option value='1'>Неозвучено</option>
                    </select>
                  </div>
                  <div className={styles.infoRow}>
                    <p>Тип озвучки</p>
                    <select value={isMonophonic} required
                      onChange={evt => setMonophonic(evt.target.value)}>
                      <option value={false}>Многоголосая</option>
                      <option value={true}>Одноголосая</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <label>
              Описание
              <textarea value={description} onChange={evt => setDescription(evt.target.value)} required />
            </label>
            <div className={styles.links}>
              <label>
                Ссылка на трейлер
                <input type="url" value={trailerUrl} onChange={evt => setTrailerUrl(evt.target.value)} required />
                <i>Пример: https://youtu.be/v-AGjx0N24U      ------>      https://www.youtube-nocookie.com/embed/v-AGjx0N24U</i>
              </label>
              <label>
                Ссылка на плеер
                <input type="text" value={playerLink} onChange={evt => setPlayerLink(evt.target.value)} required />
              </label>
            </div>
            <div className={styles.frames}>
              {frames.map((frame, index) =>
                <label key={v4()} className={styles.frameInput}>
                  <img src={
                    flag
                      ? `${SERVER_URL}/${frames[index]}`
                      : frames[index]
                  } alt="" />
                  <input type="file"
                    onChange={evt => framesHandler(evt, index)} />
                </label>)}
            </div>
            <label htmlFor='video' className={styles.videoLabel}>
              <div className={styles.videoWrapper}>
                <video src={isVideoChanging ? previewVideoUrl : `${SERVER_URL}/${previewVideoUrl}`} autoPlay loop muted={isMuted}></video>
                <div className={styles.mute}>
                  <button type='button' onClick={() => setMuted(!isMuted)}>
                    <img src={isMuted ? muted : unmuted} alt="" />
                  </button>
                </div>
              </div>
              <input id='video' type="file" onChange={videoHandler} />
            </label>
            <label className={styles.submit}>
              <button ref={submit} className='primary-button'
              >Сохранить</button>
              <p ref={error} className='error-submit'>Возникла ошибка при добавлении.</p>
            </label>
          </form>
        </div>}
    </div>
  )
}
