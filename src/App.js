import { Route, Routes } from "react-router-dom";
import Anime from "./components/Anime/Anime.jsx";
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
import ErrorPage from "./components/ErrorPage/ErrorPage.jsx";
export const URL = 'https://localhost:44349';
const testUser = {
  name: 'Канеки Кен',
  username: 'kanekiken',
  avatarImageUrl: 'https://kartinkof.club/uploads/posts/2022-03/1648286079_5-kartinkof-club-p-ken-kaneki-mem-5.jpg'
};

function App() {
  const [user, setUser] = useState({});
  const [names, setNames] = useState([]);
  const [isLoading, setLoading] = useState();
  useEffect(() => {
    setLoading(true);
    fetch(`${URL}/api/anime/names`)
      .then(response => response.json())
      .then(data => setNames(data))
      .catch(() => setNames(['code-geas', 'spy-x-family-2', 'spy-x-family']))
      .finally(() => setLoading(false));

    fetch(`${URL}/api/account/`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(() => setUser(testUser))
      .finally(() => setLoading(false));
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
              {names.map(shortName => <Route key={v4()} path={`${shortName}`}
                element={isMobile ? <Anime shortName={shortName} /> : <AnimeDesktop shortName={shortName} />} />)}
              <Route path='soon' element={<AnimesList title='Озвучка ожидается' isSoon={true} />} />
              <Route path='contacts' element={<Contacts />} />
              <Route path='account' element={<Account user={user} setUser={setUser} />} />
              <Route path='account/edit' element={<Edit user={user} />} />
              {/* <Route path='favorites' element={<Edit user={user} />} /> */}
              <Route path='*' element={<ErrorPage />} />
            </Route>
          </Routes>
        </>}
    </div>
  );
}

export default App;
