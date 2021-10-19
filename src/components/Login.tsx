import { signInWithPopup, signInWithEmailAndPassword } from "@firebase/auth";
import { Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useHistory } from "react-router";
import { auth, authProviders } from "../api/firebase";
import GoogleIcon from '@mui/icons-material/Google';
import { Link } from "react-router-dom";
import { addUser, getUserById } from "../api/service";
import { setCurrent } from "../store/actions/user";
import { useDispatch } from "react-redux";

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErros] = useState<{ [key: string]: boolean }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const history = useHistory();
  const dispatch = useDispatch();

  const onLoginWithGoogle = () => {
    signInWithPopup(auth, authProviders.google)
      .then((result) => {
        const user = result.user;

        getUserById(user.uid)
          .then((foundUser: any) => {
            if (!foundUser) {
              return addUser(user.uid, {
                name: user.displayName,
                email: user.email,
                imageUrl: user.photoURL
              });
            }

            return foundUser;
          })
          .then(foundUser => {
            dispatch(setCurrent(foundUser));
            history.push('/');
          });
      });
  };

  const isValid = () => email.trim() && password.trim();

  const onLogin = () => {
    if (!isValid()) {
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((response) => {
        history.push('/');
      })
      .catch(err => {
        console.error(err);
      });
  };

  return (
    <div style={{
      width: 400,
      margin: 'auto',
      paddingTop: 15
    }}>
      <Typography variant="h3" gutterBottom component="div">
        Sign in
      </Typography>
      <div style={{
        marginTop: 10
      }}>
        <TextField
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            const hasError = !e.target.value?.trim();

            setErros({
              ...errors,
              email: hasError
            });
          }}
          onFocus={() => setTouched({ ...touched, email: true })}
          style={{ width: '100%' }}
          helperText={(touched['email'] && errors['email']) ? 'Title is required.' : ''}
          error={touched['email'] && errors['email']}
        />
      </div>
      <div style={{
        marginTop: 10
      }}>
        <TextField
          type="password"
          label="Password"
          variant="outlined"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            const hasError = !e.target.value?.trim();

            setErros({
              ...errors,
              password: hasError
            });
          }}
          onFocus={() => setTouched({ ...touched, password: true })}
          style={{ width: '100%' }}
          helperText={(touched['password'] && errors['password']) ? 'Title is required.' : ''}
          error={touched['password'] && errors['password']}
        />
      </div>
      <div style={{
        marginTop: 10
      }}>
        <Button onClick={() => onLogin()} style={{ width: '100%' }} disabled={!isValid()}>login</Button>
      </div>
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center'
        }}>
          Login with <div style={{
            display: 'flex',
            cursor: 'pointer',
            alignItems: 'center',
            marginLeft: 5
          }} onClick={() => onLoginWithGoogle()}><GoogleIcon></GoogleIcon> Google</div>
        </div>
        <div style={{ textAlign: 'center', margin: '10px 0' }}>or</div>
        <div>If you don't have an account then <Link to="/sign-up">sign up here</Link>.</div>
      </div>
    </div>
  );
}
