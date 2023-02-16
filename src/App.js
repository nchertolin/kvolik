import { useEffect, useState, lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { isMobile } from "react-device-detect";
import { v4 } from "uuid";
import Loading from "./components/Loading/Loading";
import Layout from "./components/Layout";
import AdminLayout from "./components/Admin/AdminLayout";
const Anime = lazy(() => import('./components/Anime/Anime.jsx'));
const AnimeDesktop = lazy(() => import('./components/AnimeDesktop/AnimeDesktop'));
const AnimesList = lazy(() => import('./components/AnimesList/AnimesList'));
const Contacts = lazy(() => import('./components/Contacts/Contacts'));
const Login = lazy(() => import('./components/Login/Login'));
const SignUp = lazy(() => import('./components/SignUp/SignUp'));
const Forgot = lazy(() => import('./components/Login/Forgot'))
const Account = lazy(() => import('./components/Account/Account'));
const Edit = lazy(() => import('./components/Account/Edit'));
const ErrorPage = lazy(() => import('./components/ErrorPage/ErrorPage'));
const Panel = lazy(() => import('./components/Admin/Panel'));
const Add = lazy(() => import('./components/Admin/Add'));
export const isAuth = localStorage.getItem('token') !== null;
export const URL = 'https://localhost:44349';

const testUser = {
  name: 'Канеки Кен',
  username: 'kanekiken',
  avatarImageUrl: 'https://kartinkof.club/uploads/posts/2022-03/1648286079_5-kartinkof-club-p-ken-kaneki-mem-5.jpg',
  isAdmin: true
};

function App() {
  const [user, setUser] = useState({});
  const [names, setNames] = useState([]);
  const [isLoading, setLoading] = useState();

  useEffect(() => {
    setLoading(true);
    fetch(`${URL}/api/anime/names`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else return response.json().then(text => { throw new Error(text.message) })
      })
      .then(data => setNames(data))
      .catch(() => setNames(['code-geas', 'spy-x-family-2', 'spy-x-family']))
      .finally(() => setLoading(false));

    if (localStorage.getItem('token')) {
      fetch(`${URL}/api/account/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else return response.json().then(text => { throw new Error(text.message) })
        })
        .then(data => setUser(data))
        .catch(() => {
          setUser(testUser);
          localStorage.setItem('token', '123');
        })
        //.catch(err => console.err(err.message))
        .finally(() => setLoading(false));
    }
  }, []);

  return (
    <div className="App">
      {isLoading ? <Loading /> :
        <>
          <Routes>
            <Route path='/admin' element={<AdminLayout />}>
              <Route index element={
                <Suspense fallback={<Loading />}>
                  <Add />
                </Suspense>
              } />
              <Route path='users' element={
                <Suspense fallback={<Loading />}>
                  <Panel title='Пользователи' />
                </Suspense>
              } />
            </Route>

            <Route path='/login' element={
              <Suspense fallback={<Loading />}>
                <Login />
              </Suspense>
            } />

            <Route path='/login/forgot' element={
              <Suspense fallback={<Loading />}>
                <Forgot />
              </Suspense>
            } />
            <Route path='/signup' element={
              <Suspense fallback={<Loading />}>
                <SignUp />
              </Suspense>
            } />

            <Route path='/' element={<Layout user={user} />}>
              <Route index element={
                <Suspense fallback={<Loading />}>
                  <AnimesList title='Список аниме' />
                </Suspense>
              } />

              {names.map(shortName => <Route key={v4()} path={`${shortName}`}
                element={
                  <Suspense fallback={<Loading />}>
                    {isMobile
                      ? <Anime shortName={shortName} userEmail={user.email} />
                      : <AnimeDesktop shortName={shortName} userEmail={user.email} />}
                  </Suspense>
                } />)}

              <Route path='soon' element={
                <Suspense fallback={<Loading />}>
                  <AnimesList title='Озвучка ожидается' isSoon={true} />
                </Suspense>
              } />

              <Route path='contacts' element={
                <Suspense fallback={<Loading />}>
                  <Contacts />
                </Suspense>
              } />

              <Route path='account' element={
                <Suspense fallback={<Loading />}>
                  <Account user={user} setUser={setUser} />
                </Suspense>
              } />

              <Route path='account/edit' element={
                <Suspense fallback={<Loading />}>
                  <Edit user={user} />
                </Suspense>
              } />

              <Route path='favorites' element={
                <Suspense fallback={<Loading />}>
                  {isAuth
                    ? <AnimesList title='Избранное' isFavorites={true} />
                    : <ErrorPage />}
                </Suspense>
              } />

              <Route path='*' element={
                <Suspense fallback={<Loading />}>
                  <ErrorPage />
                </Suspense>
              } />
            </Route>
          </Routes>
        </>}
    </div>
  );
}

export default App;
