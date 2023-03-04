import React, { useRef, useState } from 'react';
import { v4 } from 'uuid';
import close from '../../assets/icons/close.svg';
import SearchCard from '../SearchCard/SearchCard';
import Loading from '../Loading/Loading';
import styles from './Search.module.scss';
import { SERVER_URL } from '../../util.js';

export default function Search({ reference, }) {
  const searchInput = useRef();
  const [animes, setAnimes] = useState([]);
  const [isLoading, setLoading] = useState();
  const [isEmpty, setEmpty] = useState();

  function closeSearch() {
    reference.current.classList.toggle('hidden');
    document.body.classList.toggle('fixed');
    searchInput.current.value = '';
  }

  function searchAnimes(query) {
    setLoading(true);
    fetch(`${SERVER_URL}/api/anime?search=${query}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else return response.json().then(text => { throw new Error(text.message) })
      })
      .then(data => {
        setEmpty(data.length === 0);
        setAnimes(data);
      })
      .catch(err => console.log(err.message))
      .finally(() => setLoading(false))
  }

  return (
    <div ref={reference} className='search hidden'>
      <div className='search__wrapper'>
        <div className='input__wrapper'>
          <input ref={searchInput} type="text" placeholder='Название аниме' autoComplete='off'
            onChange={(evt) => searchAnimes(evt.target.value)} />
          <button onClick={closeSearch}>
            <img src={close} alt="X" />
          </button>
        </div>
      </div>
      {isLoading ? <Loading />
        : <ul className={styles.list}>
          {animes.map(({ shortName, imageUrl, name, nameEng, releaseFrom, type }) =>
            <li key={v4()} onClick={closeSearch}>
              <SearchCard shortName={shortName} picture={`${SERVER_URL}/${imageUrl}`} name={name} nameEng={nameEng} releaseFrom={releaseFrom} type={type} />
            </li>)}
          {isEmpty && <li className={styles.empty}><p>Не удалось найти аниме по вашему запросу.</p></li>}
        </ul>}
    </div>
  )
}
