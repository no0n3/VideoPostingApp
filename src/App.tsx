import { useEffect } from 'react';
import { auth } from './api/firebase';
import Videos from './components/Videos/Videos';
import { Switch, Route } from 'react-router-dom';
import Video from './components/Video';
import Layout from './components/Layout';
import Upload from './components/Upload';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrent, setCurrent } from './store/actions/user';
import { getUserById } from './api/service';
import Login from './components/Login';
import User from './components/User/User';
import SignUp from './components/SignUp';

function App() {
  const dispatch = useDispatch();
  const isLogged = useSelector(({ user }: any) => user.isLogged);

  useEffect(() => {
    dispatch(fetchCurrent());
    auth.onAuthStateChanged(user => {
      if (!user) {
        dispatch(setCurrent(user));

        return;
      }

      getUserById(user.uid)
        .then((foundUser: any) => {
          dispatch(setCurrent(foundUser));
        });
    });
  }, []);

  return (
    <div className="App">
      <Switch>
        <Route path="/watch/:id">
          <Layout>
            <Video></Video>
          </Layout>
        </Route>
        <Route path="/user/:id">
          <Layout>
            <User></User>
          </Layout>
        </Route>
        {isLogged && (
        <Route path="/upload">
          <Layout>
            <Upload></Upload>
          </Layout>
        </Route>)}
        {!isLogged && (
          <Route path="/sign-up">
            <Layout>
              <SignUp></SignUp>
            </Layout>
          </Route>
        )}
        {!isLogged && (
          <Route path="/login">
            <Layout>
              <Login></Login>
            </Layout>
          </Route>)}
        <Route path="/">
          <Layout>
            <Videos></Videos>
          </Layout>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
