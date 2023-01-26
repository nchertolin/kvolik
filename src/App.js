import { Route, Routes } from "react-router-dom";
import Anime from "./components/Anime/Anime";
import AnimeDesktop from "./components/AnimeDesktop/AnimeDesktop";
import AnimesList from "./components/AnimesList/AnimesList";
import Contacts from "./components/Contacts/Contacts";
import Layout from "./components/Layout";
import Login from "./components/Login/Login";
import SignUp from "./components/SignUp/SignUp";
import { isMobile } from "react-device-detect";
import { useEffect, useState } from "react";
import { v4 } from "uuid";
import Loading from "./components/Loading/Loading";
import Account from "./components/Account/Account";
import Edit from "./components/Account/Edit";
export const URL = 'http://localhost:44349';
const user = {
  name: 'Канеки Кен',
  login: 'kanekiken',
  imageUrl: 'https://kartinkof.club/uploads/posts/2022-03/1648286079_5-kartinkof-club-p-ken-kaneki-mem-5.jpg'
};

function App() {
  const [ids, setIds] = useState([]);
  const [isLoading, setLoading] = useState();
  useEffect(() => {
    setLoading(true);
    fetch(`${URL}/api/ids`)
      .then(response => response.json())
      .then(data => setIds(data))
      .catch(() => setIds([
        { id: 1, shortName: 'code-geas' },
        { id: 2, shortName: 'spy-x-family-2' },
        { id: 3, shortName: 'spy-x-family' }]))
      .finally(() => setLoading(false))
  }, []);

  return (
    <div className="App">
      {isLoading ? <Loading /> :
        <>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='/' element={<Layout user={user} />}>
              <Route index element={<AnimesList title='Список аниме' />} />
              {ids.map(({ id, shortName }) =>
                <Route key={v4()} path={`${shortName}`}
                  element={isMobile ? <Anime id={id} /> : <AnimeDesktop id={id} />} />)}
              {/* <Route path='soon' element={<AnimesList title='Озвучка ожидается' animes={animes.slice(0, 2)} />} /> */}
              <Route path='contacts' element={<Contacts />} />
              <Route path='account' element={<Account user={user} />} />
              <Route path='account/edit' element={<Edit user={user} />} />
              {/* <Route path='favorites' element={<Edit user={user} />} /> */}
              <Route path='*' element={<div className='content'>Ой, кажется страница не существует</div>} />
            </Route>
          </Routes>
        </>}
    </div>
  );
}

export default App;
