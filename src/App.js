import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Anime from "./components/Anime/Anime";
import AnimesList from "./components/AnimesList/AnimesList";
import Contacts from "./components/Contacts/Contacts";
import Layout from "./components/Layout";
import { v4 } from 'uuid';
import Login from "./components/Login/Login";
import SignUp from "./components/SignUp/SignUp";
import { isMobile } from "react-device-detect";
import AnimeDesktop from "./components/AnimeDesktop/AnimeDesktop";


const URL = 'http://188.19.14.239:44349';

function App() {
  const [animes, setAnimes] = useState([]);
  const [isLoading, setLoading] = useState();

  useEffect(() => {
    setLoading(true);
    fetch(`${URL}/api/anime`)
      .then(response => response.json())
      .then(data => {
        setAnimes(data)
        setLoading(false);
      })
  }, []);

  return isLoading ? 'Loading' : (
    <div className="App">
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/' element={<Layout />}>
          <Route index element={<AnimesList title='Список аниме' animes={animes} />} />
          {animes.map(({ title, url, shortName, albumId }) => <Route key={v4()} path={`/${shortName}`}
            element={isMobile ? <Anime name={title} picture={url} genre={albumId} />
              : <AnimeDesktop name={title} picture={url} genre={albumId} />} />)}
          <Route path='soon' element={<AnimesList title='Озвучка ожидается' animes={animes.slice(0, 2)} />} />
          <Route path='contacts' element={<Contacts />} />
          <Route path='/*' element={<div className='content'>Ой, страница не найдена</div>} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
