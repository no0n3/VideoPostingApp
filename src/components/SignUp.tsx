import { signInWithPopup, createUserWithEmailAndPassword } from "@firebase/auth";
import { Button, TextField, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { useHistory } from "react-router";
import { auth, authProviders } from "../api/firebase";
import GoogleIcon from '@mui/icons-material/Google';
import { Link } from "react-router-dom";
import { addUser } from "../api/service";
import { useDispatch } from "react-redux";
import { setCurrent } from "../store/actions/user";

export default function SignUp() {
  const fields = useMemo(() => ['email', 'name', 'password', 'confirmPassword'], []);
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errors, setErros] = useState<{ [key: string]: boolean }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [generalError, setGeneralError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const history = useHistory();
  const dispatch = useDispatch();

  const setFieldError = (field: string, hasError: boolean) => {
    setErros({
      ...errors,
      [field]: hasError
    })
  };

  const onLoginWithGoogle = () => {
    signInWithPopup(auth, authProviders.google)
      .then(() => history.push('/'));
  };

  const hasErrors = () => Object.keys(errors).some(field => errors[field]);

  const onLogin = () => {
    if (hasErrors()) {
      const t: { [key: string]: boolean } = {};
      fields.forEach(field => {
        t[field] = true;
      });

      setTouched(t);

      return;
    }

    setLoading(true);

    createUserWithEmailAndPassword(auth, email, password)
      .then((response) => {
        const user = response.user;

        addUser(user.uid, {
          name: name,
          email: email,
          imageUrl: null
        })
          .then(() => {
            dispatch(setCurrent({
              id: user.uid,
              name: name,
              email: email,
            }));
          });
      })
      .catch(err => {
        console.error(err);
        setGeneralError(err.message);
      });
  };

  return (
    <div style={{
      width: 400,
      margin: 'auto',
      paddingTop: 15
    }}>
      <Typography variant="h3" gutterBottom component="div">
        Sign up
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
            setFieldError('email', !e.target.value?.trim());
          }}
          onFocus={() => setTouched({ ...touched, email: true })}
          style={{ width: '100%' }}
          helperText={(touched['email'] && errors['email']) ? 'Email is required.' : ''}
          error={touched['email'] && errors['email']}
        />
      </div>
      <div style={{
        marginTop: 10
      }}>
        <TextField
          label="Name"
          variant="outlined"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setFieldError('name', !e.target.value?.trim());
          }}
          onFocus={() => setTouched({ ...touched, name: true })}
          style={{ width: '100%' }}
          helperText={(touched['name'] && errors['name']) ? 'Name is required.' : ''}
          error={touched['name'] && errors['name']}
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
            setFieldError('password', e.target.value?.length < 6);
            setFieldError('confirmPassword', e.target.value !== confirmPassword);
          }}
          onFocus={() => setTouched({ ...touched, password: true })}
          style={{ width: '100%' }}
          helperText={(touched['password'] && errors['password']) ? 'Password is required.' : ''}
          error={touched['password'] && errors['password']}
        />
      </div>
      <div style={{
        marginTop: 10
      }}>
        <TextField
          type="password"
          label="Confirm password"
          variant="outlined"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setFieldError('confirmPassword', password !== e.target.value);
          }}
          onFocus={() => setTouched({ ...touched, confirmPassword: true })}
          style={{ width: '100%' }}
          helperText={(touched['confirmPassword'] && errors['confirmPassword']) ? 'Passwords do not match.' : ''}
          error={touched['confirmPassword'] && errors['confirmPassword']}
        />
      </div>
      {generalError && <div style={{ marginTop: 10, color: 'red' }}>{generalError}</div>}
      <div style={{
        marginTop: 10
      }}>
        <Button onClick={() => onLogin()} style={{ width: '100%' }} disabled={hasErrors() || loading}>sign up</Button>
      </div>
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center'
        }}>
          Sign up with <div style={{
            display: 'flex',
            cursor: 'pointer',
            alignItems: 'center',
            marginLeft: 5
          }} onClick={() => onLoginWithGoogle()}><GoogleIcon></GoogleIcon> Google</div>
        </div>
        <div style={{ textAlign: 'center', margin: '10px 0' }}>or</div>
        <div>If you already have an account then <Link to="/login">login here</Link>.</div>
      </div>
    </div>
  );
}
