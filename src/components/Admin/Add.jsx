import React, { useRef, useState } from 'react'
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import styles from './Add.module.scss';
import placeholder from '../../assets/icons/placeholder.svg';
import { SERVER_URL, FILE_TYPES } from '../../util.js';

export default function Add() {
  const { register, formState: { errors }, handleSubmit, reset } = useForm({ mode: 'all' });
  const [preview, setPreview] = useState(placeholder);
  const [frames, setFrames] = useState([placeholder, placeholder, placeholder,
    placeholder, placeholder, placeholder]);
  const [framesFiles, setFramesFiles] = useState([]);
  const [file, setFile] = useState();
  const error = useRef();
  const submit = useRef();

  function showError(isShow, message) {
    if (isShow) {
      error.current.textContent = message;
    }
    error.current.style.display = isShow ? 'block' : 'none';
  }

  const disableButton = isDisable => submit.current.disabled = isDisable;

  function add(data) {
    const formData = new FormData();
    formData.append('genres', data.genres);
    data.genres.forEach(genre => formData.append('genres', genre));
    framesFiles.forEach(file => formData.append('frames', file));
    // formData.append('frames', framesFiles[0]);
    formData.append('imageUri', file);
    formData.append('name', data.name);
    formData.append('shortName', data.shortName);
    formData.append('nameEng', data.nameEng);
    formData.append('type', data.type);
    formData.append('episodesAmount', data.episodesAmount);
    formData.append('primarySource', data.primarySource);
    formData.append('releaseFrom', new Date(data.releaseFrom).toISOString());
    formData.append('releaseBy', new Date(data.releaseBy).toISOString());
    formData.append('ageLimit', data.ageLimit);
    formData.append('duration', data.duration);
    formData.append('description', data.description);
    formData.append('exitStatus', data.exitStatus);
    formData.append('trailerUrl', data.trailerUrl);
    formData.append('playerLink', data.playerLink);
    formData.append('isMonophonic', data.isMonophonic);
    formData.append('voiceoverStatus', data.voiceoverStatus);
    console.log(formData.get('frames'));

    fetch(`${SERVER_URL}/api/admin/anime`, {
      body: formData,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(text => { throw new Error(text.message) })
        }
      })
      .then(() => {
        reset();
        window.location.href = '..';
        setPreview(placeholder);
      })
      .catch(err => showError(true, err.message))
      .finally(() => {
        disableButton(false);
      });
  }

  function previewHandler(evt) {
    const file = evt.target.files[0];
    const fileName = file.name.toLowerCase();
    const matches = FILE_TYPES.some((it) => fileName.endsWith(it));

    if (matches) {
      setPreview(URL.createObjectURL(file));
      setFile(evt.target.files[0]);
    }
  }

  function framesHandler(evt, index) {
    const file = evt.target.files[0];
    const fileName = file.name.toLowerCase();
    const matches = FILE_TYPES.some(it => fileName.endsWith(it));

    if (matches) {
      const newFrames = [...frames];
      const newFramesFiles = [...framesFiles];
      newFrames[index] = URL.createObjectURL(file);
      newFramesFiles[index] = file;
      setFrames(newFrames);
      setFramesFiles(newFramesFiles);
    }
  }

  return (
    <>
      <Helmet>
        <title>Admin - Добавить аниме</title>
      </Helmet>
      <div className={styles.add}>
        <div className={styles.addWrapper}>
          <h1>Добавить новое аниме</h1>
          <form autoComplete='off' encType="multipart/form-data" onSubmit={handleSubmit(add)}>
            <label className={styles.file}>
              Обложка
              <img src={preview} alt="" />
              <input type="file"
                {...register('imageUri', { required: 'Обязательноe поле.' })}
                className={styles.bannerInput}
                onChange={previewHandler}
              />
              {errors?.imageUri && <p className='error'>{errors?.imageUri.message}</p>}
            </label>
            <label>
              <input type="text" placeholder='Название' className={errors?.name ? 'invalid' : ''}
                {...register('name', { required: 'Обязательноe поле.' })} />
              {errors?.name && <p className='error'>{errors?.name.message}</p>}
            </label>
            <label>
              <input type="text" placeholder='Английское название'
                className={errors?.username ? 'invalid' : ''}
                {...register('nameEng', { required: 'Обязательноe поле.' })} />
              {errors?.nameEng && <p className='error'>{errors?.nameEng.message}</p>}
            </label>
            <label>
              <input type="text" placeholder='Короткое название(для ссылки)'
                className={errors?.shortName ? 'invalid' : ''}
                {...register('shortName', { required: 'Обязательноe поле.' })} />
              {errors?.shortName && <p className='error'>{errors?.shortName.message}</p>}
            </label>
            <label>
              <select
                onFocus={evt => evt.target.style.color = 'white'}
                className={errors?.type ? 'invalid' : ''}
                {...register('type', { required: 'Обязательноe поле.' })}>
                <option value='' disabled selected>Тип</option>
                <option value='ТВ Сериал'>ТВ Сериал</option>
                <option value='Фильм'>Фильм</option>
                <option value='ONA'>ONA</option>
                <option value='OVA'>OVA</option>
                <option value='Спешл'>Спешл</option>
              </select>
              {errors?.type && <p className='error'>{errors?.type.message}</p>}
            </label>
            <label>
              <input type="number" placeholder='Эпизоды'
                className={errors?.episodesAmount ? 'invalid' : ''}
                {...register('episodesAmount', { required: 'Обязательноe поле.' })} />
              {errors?.episodesAmount && <p className='error'>{errors?.episodesAmount.message}</p>}
            </label>
            <label>
              <select
                onFocus={evt => evt.target.style.color = 'white'}
                className={errors?.exitStatus ? 'invalid' : ''}
                {...register('exitStatus', { required: 'Обязательноe поле.' })}>
                <option value='' disabled selected>Статус анимe</option>
                <option value='0'>Онгоинг</option>
                <option value='1'>Вышел</option>
              </select>
              {errors?.exitStatus && <p className='error'>{errors?.exitStatus.message}</p>}
            </label>
            <label>
              <select
                onFocus={evt => evt.target.style.color = 'white'}
                className={errors?.voiceoverStatus ? 'invalid' : ''}
                {...register('voiceoverStatus', { required: 'Обязательноe поле.' })}>
                <option value='' disabled selected>Статус озвучки</option>
                <option value={false}>Озвучено</option>
                <option value={true}>Неозвучено</option>
              </select>
              {errors?.voiceoverStatus && <p className='error'>{errors?.voiceoverStatus.message}</p>}
            </label>
            <label>
              <select
                onFocus={evt => evt.target.style.color = 'white'}
                className={errors?.isMonophonic ? 'invalid' : ''}
                {...register('isMonophonic', { required: 'Обязательноe поле.' })}>
                <option value='' disabled selected>Тип озвучки</option>
                <option value={false}>Многоголосая</option>
                <option value={true}>Одноголосая</option>
              </select>
              {errors?.isMonophonic && <p className='error'>{errors?.isMonophonic.message}</p>}
            </label>
            <label id={styles.genres}>
              <span>Жанры</span>
              <select multiple
                onFocus={evt => evt.target.style.color = 'white'}
                className={errors?.genres ? 'invalid' : ''}
                {...register('genres', { required: 'Обязательноe поле.' })}>
                <option value='Безумие'>Безумие</option>
                <option value='Боевые искусства'>Боевые искусства</option>
                <option value='Вампиры'>Вампиры</option>
                <option value='Военное'>Военное</option>
                <option value='Гарем'>Гарем</option>
                <option value='Демоны'>Демоны</option>
                <option value='Детектив'>Детектив</option>
                <option value='Детское'>Детское</option>
                <option value='Дзёсэй'>Дзёсэй</option>
                <option value='Драма'>Драма</option>
                <option value='Игры'>Игры</option>
                <option value='Исторический'>Исторический</option>
                <option value='Комедия'>Комедия</option>
                <option value='Космос'>Космос</option>
                <option value='Магия'>Магия</option>
                <option value='Машины'>Машины</option>
                <option value='Меха'>Меха</option>
                <option value='Музыка'>Музыка</option>
                <option value='Пародия'>Пародия</option>
                <option value='Повседневность'>Повседневность</option>
                <option value='Полиция'>Полиция</option>
                <option value='Приключения'>Приключения</option>
                <option value='Психологическое'>Психологическое</option>
                <option value='Романтика'>Романтика</option>
                <option value='Самураи'>Самураи</option>
                <option value='Сверхъестественное'>Сверхъестественное</option>
                <option value='Сёдзё'>Сёдзё</option>
                <option value='Сёдзё-Ай'>Сёдзё-Ай</option>
                <option value='Сёнэн'>Сёнэн</option>
                <option value='Сёнэн-Aй'>Сёнэн-Aй</option>
                <option value='Спорт'>Спорт</option>
                <option value='Супер сила'>Супер сила</option>
                <option value='Сэйнэн'>Сэйнэн</option>
                <option value='Триллер'>Триллер</option>
                <option value='Ужасы'>Ужасы</option>
                <option value='Фантастика'>Фантастика</option>
                <option value='Фэнтези'>Фэнтези</option>
                <option value='Школа'>Школа</option>
                <option value='Экшен'>Экшен</option>
                <option value='Этти'>Этти</option>
              </select>
              {errors?.genres && <p className='error'>{errors?.genres.message}</p>}
            </label>
            <label>
              <select
                onFocus={evt => evt.target.style.color = 'white'}
                className={errors?.primarySource ? 'invalid' : ''}
                {...register('primarySource', { required: 'Обязательноe поле.' })}>
                <option value='' disabled selected>Первоисточник</option>
                <option value='0'>Манга</option>
                <option value='1'>Оригинал</option>
                <option value='2'>Ранобе</option>
                <option value='3'>Манхва</option>
              </select>
              {errors?.primarySource && <p className='error'>{errors?.primarySource.message}</p>}
            </label>
            <label>
              <input type="text" placeholder='Дата выпуска'
                onFocus={evt => evt.target.type = 'date'}
                className={errors?.releaseFrom ? 'invalid' : ''}
                {...register('releaseBy', { required: 'Обязательноe поле.' })} />
              {errors?.releaseBy && <p className='error'>{errors?.releaseBy.message}</p>}
            </label>
            <label>
              <input type="text" placeholder='Дата окончания'
                onFocus={evt => evt.target.type = 'date'}
                className={errors?.releaseFrom ? 'invalid' : ''}
                {...register('releaseFrom', { required: 'Обязательноe поле.' })} />
              {errors?.releaseFrom && <p className='error'>{errors?.releaseFrom.message}</p>}
            </label>
            <label>
              <input type="number" placeholder='Возрастные ограничения'
                className={errors?.ageLimit ? 'invalid' : ''}
                {...register('ageLimit', { required: 'Обязательноe поле.' })} />
              {errors?.ageLimit && <p className='error'>{errors?.ageLimit.message}</p>}
            </label>
            <label>
              <input type="number" placeholder='Длительность серии'
                className={errors?.duration ? 'invalid' : ''}
                {...register('duration', { required: 'Обязательноe поле.' })} />
              {errors?.duration && <p className='error'>{errors?.duration.message}</p>}
            </label>
            <label>
              <textarea placeholder='Описание'
                className={errors?.description ? 'invalid' : ''}
                {...register('description', { required: 'Обязательноe поле.' })} />
              {errors?.description && <p className='error'>{errors?.description.message}</p>}
            </label>
            <label>
              <input type="url" placeholder='Ссылка на трейлер'
                className={errors?.trailerUrl ? 'invalid' : ''}
                {...register('trailerUrl', { required: 'Обязательноe поле.' })} />
              <i>Пример: https://youtu.be/v-AGjx0N24U     ------>    https://www.youtube-nocookie.com/embed/v-AGjx0N24U</i>
              {errors?.trailerUrl && <p className='error'>{errors?.trailerUrl.message}</p>}
            </label>
            <label>
              <input type="url" placeholder='Ссылка на аниме в плеере'
                className={errors?.playerLink ? 'invalid' : ''}
                {...register('playerLink', { required: 'Обязательноe поле.' })} />
              {errors?.playerLink && <p className='error'>{errors?.playerLink.message}</p>}
            </label>
            <p>Кадры из аниме</p>
            <div className={styles.frames}>
              <label className={styles.frameInput}>
                <img className={styles.frame} src={frames[0]} alt="" />
                <input type="file" className={styles.bannerInput}
                  {...register('frame1', { required: 'Обязательноe поле.' })}
                  onChange={evt => framesHandler(evt, 0)} />
                {errors?.frame1 && <p className='error'>{errors?.frame1.message}</p>}
              </label>
              <label className={styles.frameInput}>
                <img className={styles.frame} src={frames[1]} alt="" />
                <input type="file" className={styles.bannerInput}
                  {...register('frame2', { required: 'Обязательноe поле.' })}
                  onChange={evt => framesHandler(evt, 1)} />
                {errors?.frame2 && <p className='error'>{errors?.frame2.message}</p>}
              </label>
              <label className={styles.frameInput}>
                <img className={styles.frame} src={frames[2]} alt="" />
                <input type="file" className={styles.bannerInput}
                  {...register('frame3', { required: 'Обязательноe поле.' })}
                  onChange={evt => framesHandler(evt, 2)} />
                {errors?.frame3 && <p className='error'>{errors?.frame3.message}</p>}
              </label>
              <label className={styles.frameInput}>
                <img className={styles.frame} src={frames[3]} alt="" />
                <input type="file"
                  className={styles.bannerInput}
                  onChange={evt => framesHandler(evt, 3)} />
              </label>
              <label className={styles.frameInput}>
                <img className={styles.frame} src={frames[4]} alt="" />
                <input type="file"
                  className={styles.bannerInput}
                  onChange={evt => framesHandler(evt, 4)} />
              </label>
              <label className={styles.frameInput}>
                <img className={styles.frame} src={frames[5]} alt="" />
                <input type="file"
                  className={styles.bannerInput}
                  onChange={evt => framesHandler(evt, 5)} />
              </label>
            </div>
            <label>
              <button ref={submit} className='primary-button'>Добавить на сайт</button>
              <p ref={error} className='error-submit'>Возникла ошибка при добавлении.</p>
            </label>
          </form>
        </div>
      </div>
    </>
  )
}
