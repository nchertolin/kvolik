import React, { useRef, useState } from 'react'
import { Helmet } from 'react-helmet';
import { Controller, useForm } from 'react-hook-form';
import styles from './Add.module.scss';
import { SERVER_URL } from '../../App';
import placeholder from '../../assets/icons/placeholder.svg';
import { FILE_TYPES } from '../../App.js'

export default function Add() {
  const { register, formState: { errors }, handleSubmit, reset, control } = useForm({ mode: 'all' });
  const [preview, setPreview] = useState(placeholder);
  const [frames, setFrames] = useState([placeholder, placeholder, placeholder,
    placeholder, placeholder, placeholder]);
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
    data.imageUrl = 'https://cs.pikabu.ru/images/big_size_comm/2013-12_4/13873875745011.jpg';
    data.genres = data.genres.split(',');
    data.frames = frames;
    fetch(`${SERVER_URL}/api/admin/anime`, {
      body: JSON.stringify(data),
      method: 'POST',
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
        reset();
        setPreview(placeholder);
      });
  }

  function previewHandler(evt) {
    const file = evt.target.files[0];
    const fileName = file.name.toLowerCase();
    const matches = FILE_TYPES.some((it) => fileName.endsWith(it));

    if (matches) {
      setPreview(URL.createObjectURL(file));
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
              <Controller
                control={control}
                name='imageUri'
                rules={{ required: 'Обязательноe поле.', }}
                render={({ field }) => (
                  <input type="file"
                    value={field.value}
                    className={errors?.imageUrl ? `${styles.bannerInput} invalid` : styles.bannerInput}
                    onChange={evt => {
                      previewHandler(evt);
                      field.onChange(evt)
                    }} />
                )}
              />
              {errors?.imageUrl && <p className='error'>{errors?.imageUrl.message}</p>}
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
                <option value="" disabled selected hidden>Тип</option>
                <option value='ТВ-Сериал'>ТВ-Сериал</option>
                <option value='Фильм'>Фильм</option>
                <option value='OVA'>OVA</option>
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
                <option value="" disabled selected hidden>Статус аниме</option>
                <option value='0'>Онгоинг</option>
                <option value='1'>Вышел</option>
                Статус
              </select>
              {errors?.exitStatus && <p className='error'>{errors?.exitStatus.message}</p>}
            </label>
            <label>
              <select
                onFocus={evt => evt.target.style.color = 'white'}
                className={errors?.voiceoverStatus ? 'invalid' : ''}
                {...register('voiceoverStatus', { required: 'Обязательноe поле.' })}>
                <option value="" disabled selected hidden>Статус озвучки</option>
                <option value='0'>Озвучено</option>
                <option value='1'>Неозвучено</option>
                Статус
              </select>
              {errors?.voiceoverStatus && <p className='error'>{errors?.voiceoverStatus.message}</p>}
            </label>
            <label>
              <select
                onFocus={evt => evt.target.style.color = 'white'}
                className={errors?.isMonophonic ? 'invalid' : ''}
                {...register('isMonophonic', { required: 'Обязательноe поле.' })}>
                <option value="" disabled selected hidden>Тип озвучки</option>
                <option value={false}>Многоголосая</option>
                <option value={true}>Одноголосая</option>
                Статус
              </select>
              {errors?.isMonophonic && <p className='error'>{errors?.isMonophonic.message}</p>}
            </label>
            <label>
              <input type="text" placeholder='Жанры (через запятую)'
                className={errors?.genres ? 'invalid' : ''}
                {...register('genres', { required: 'Обязательноe поле.' })} />
              {errors?.genres && <p className='error'>{errors?.genres.message}</p>}
            </label>
            <label>
              <select
                onFocus={evt => evt.target.style.color = 'white'}
                className={errors?.primarySource ? 'invalid' : ''}
                {...register('primarySource', { required: 'Обязательноe поле.' })}>
                <option value="" disabled selected hidden>Первоисточник</option>
                <option value='0'>Манга</option>
                <option value='1'>Оригинал</option>
                <option value='2'>Ранобе</option>
                <option value='3'>Манхва</option>
              </select>
              {errors?.primarySource && <p className='error'>{errors?.primarySource.message}</p>}
            </label>
            <label>
              <input type="text" placeholder='Выпуск'
                onFocus={evt => evt.target.type = 'date'}
                className={errors?.releaseFrom ? 'invalid' : ''}
                {...register('releaseBy', { required: 'Обязательноe поле.' })} />
              {errors?.releaseBy && <p className='error'>{errors?.releaseBy.message}</p>}
            </label>
            <label>
              <input type="text" placeholder='Конец'
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
                <input type="file" name='frame-2' className={styles.bannerInput}
                  {...register('frame2', { required: 'Обязательноe поле.' })}
                  onChange={evt => framesHandler(evt, 1)} />
                {errors?.frame2 && <p className='error'>{errors?.frame2.message}</p>}
              </label>
              <label className={styles.frameInput}>
                <img className={styles.frame} src={frames[2]} alt="" />
                <input type="file" name='frame-3' className={styles.bannerInput}
                  {...register('frame3', { required: 'Обязательноe поле.' })}
                  onChange={evt => framesHandler(evt, 2)} />
                {errors?.frame3 && <p className='error'>{errors?.frame3.message}</p>}
              </label>
              <label className={styles.frameInput}>
                <img className={styles.frame} src={frames[3]} alt="" />
                <input type="file" name='frame-4'
                  className={styles.bannerInput}
                  onChange={evt => framesHandler(evt, 3)} />
              </label>
              <label className={styles.frameInput}>
                <img className={styles.frame} src={frames[4]} alt="" />
                <input type="file" name='frame-5'
                  className={styles.bannerInput}
                  onChange={evt => framesHandler(evt, 4)} />
              </label>
              <label className={styles.frameInput}>
                <img className={styles.frame} src={frames[5]} alt="" />
                <input type="file" name='frame-6'
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
