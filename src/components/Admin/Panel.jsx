import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { URL } from '../../App';
import Loading from '../Loading/Loading';
import styles from './Admin.module.scss';
import { testAnimes } from '../AnimesList/animes';
import { v4 } from 'uuid';

export default function Panel({ title }) {
  const [isLoading, setLoading] = useState();

  // useEffect(() => {
  //   setLoading(true);
  //   fetch(`${URL}/api/anime`)
  //     .then(response => {
  //       if (response.ok) {
  //         return response.json();
  //       } else return response.json().then(text => { throw new Error(text.message) })
  //     })
  //     .then(data => setAnimes(data))
  //     .catch(() => setAnimes(testAnimes))
  //     // .catch(err => console.error(err.message))
  //     .finally(() => setLoading(false))
  // }, []);

  return (
    <>
      <Helmet>
        <title>Admin - {title}</title>
      </Helmet>
      {isLoading
        ? <Loading />
        : <div className={styles.panel}>
        </div>}
    </>
  )
}
