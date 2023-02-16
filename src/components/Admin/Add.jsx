import React, { useState } from 'react'
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import styles from './Admin.module.scss';
import image from '../../assets/icons/imgPlaceholder.svg';
const FILE_TYPES = ['jpg', 'jpeg', 'png'];

export default function Add() {
  const { register, formState: { errors }, handleSubmit, reset } = useForm({ mode: 'all' });
  const [preview, setPreview] = useState(image);


  function add(data) {
    data.genres = [data.genres];
    data.frames = ['https://images.unsplash.com/photo-1526547541286-73a7aaa08f2a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8Mnx8fGVufDB8fHx8&w=1000&q=80']
    fetch('/api/admin/anime', {
      body: JSON.stringify(data)
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else return response.json().then(text => { throw new Error(text.message) })
      })
      .catch(err => console.error(err.message))
    //.catch((err) => showError(true, err.message))
    //.finally(() => disableButton(false));
    reset();
  }

  function set(evt) {
    const file = evt.target.files[0];
    const fileName = file.name.toLowerCase();
    const matches = FILE_TYPES.some((it) => fileName.endsWith(it));

    if (matches) {
      setPreview(URL.createObjectURL(file));
    }
    console.log(file);
  }

  return (
    <>
      <Helmet>
        <title>Admin - Добавить аниме</title>
      </Helmet>
      <div className={styles.add}>
        <form autoComplete='off' encType="multipart/form-data" onSubmit={handleSubmit(add)}>
          <label className={styles.file}>
            <p>Загрузите обложку аниме</p>
            <img src={preview} alt="" />
            <input className={styles.bannerInput} type="file"
              onChange={set} />
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
            <input type="text" placeholder='Тип'
              className={errors?.type ? 'invalid' : ''}
              {...register('type', { required: 'Обязательноe поле.' })} />
            {errors?.type && <p className='error'>{errors?.type.message}</p>}
          </label>
          <label>
            <input type="number" placeholder='Эпизоды'
              className={errors?.episodesAmount ? 'invalid' : ''}
              {...register('episodesAmount', { required: 'Обязательноe поле.' })} />
            {errors?.episodesAmount && <p className='error'>{errors?.episodesAmount.message}</p>}
          </label>
          <label>
            <input type="text" placeholder='Статус'
              className={errors?.exitStatus ? 'invalid' : ''}
              {...register('exitStatus', { required: 'Обязательноe поле.' })} />
            {errors?.exitStatus && <p className='error'>{errors?.exitStatus.message}</p>}
          </label>
          <label>
            <input type="text" placeholder='Жанры (через запятую)'
              className={errors?.genres ? 'invalid' : ''}
              {...register('genres', { required: 'Обязательноe поле.' })} />
            {errors?.genres && <p className='error'>{errors?.genres.message}</p>}
          </label>
          <label>
            <input type="text" placeholder='Первоисточник'
              className={errors?.primarySource ? 'invalid' : ''}
              {...register('primarySource', { required: 'Обязательноe поле.' })} />
            {errors?.primarySource && <p className='error'>{errors?.primarySource.message}</p>}
          </label>
          {/* <label>
            <input type="text" placeholder='Сезон'
              className={errors?.releaseFrom ? 'invalid' : ''}
              {...register('username', { required: 'Обязательноe поле.' })} />
            {errors?.releaseFrom && <p className='error'>{errors?.releaseFrom.message}</p>}
          </label>
           <label>
            <input type="text" placeholder='Выпуск'
              className={errors?.releaseFrom ? 'invalid' : ''}
              {...register('releaseFrom', { required: 'Обязательноe поле.' })} />
            {errors?.releaseFrom && <p className='error'>{errors?.releaseFrom.message}</p>}
          </label> */}
          <label>
            <input type="number" placeholder='Возрастные ограничения'
              className={errors?.ageLimit ? 'invalid' : ''}
              {...register('ageLimit', { required: 'Обязательноe поле.' })} />
            {errors?.ageLimit && <p className='error'>{errors?.ageLimit.message}</p>}
          </label>
          <label>
            <input type="number" placeholder='Длительность'
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
            <input type="text" placeholder='Ссылка на трейлер'
              className={errors?.trailerUrl ? 'invalid' : ''}
              {...register('trailerUrl', { required: 'Обязательноe поле.' })} />
            {errors?.trailerUrl && <p className='error'>{errors?.trailerUrl.message}</p>}
          </label>
          <label>
            <input type="text" placeholder='Ссылка на аниме в плеере'
              className={errors?.playerLink ? 'invalid' : ''}
              {...register('playerLink', { required: 'Обязательноe поле.' })} />
            {errors?.playerLink && <p className='error'>{errors?.playerLink.message}</p>}
          </label>
          <label>
            <button className='primary-button'>Добавить на сайт</button>
          </label>
        </form>
      </div>
    </>
  )
}
