import axios from 'axios';
import { useState, useContext } from 'react';
import { UserContext } from './UserContext';
import { USER_API_URL } from '../routes';

export default function useAuth() {
  const { setUser } = useContext(UserContext);
  const [error, setError] = useState();

  //set user in context and nagivate to home
  const setUserContext = async () => {
    return await axios
      .get(USER_API_URL + 'auth', { withCredentials: true })
      .then((res) => {
        if (setUser == null) {
          setError(['Please try again later!']);
          return;
        }
        setUser(res.data.currentUser);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.data) {
          setError(err.response.data.msgs);
        } else {
          setError(['Please try again later!']);
        }
      });
  };

  const registerUser = async (user) => {
    await axios
      .post(USER_API_URL + 'register', user, { withCredentials: true })
      .then(async (res) => {
        if (res && res.status === 201) {
          await setUserContext();
        } else {
          setError(['Please try again later!']);
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response.data) {
          setError(err.response.data.msgs);
        } else {
          setError(['Please try again later!']);
        }
      });
  };

  //login user
  const loginUser = async (user) => {
    return await axios
      .post(USER_API_URL + 'login', user, { withCredentials: true })
      .then(async () => {
        await setUserContext();
      })
      .catch((err) => {
        console.log(err);
        if (err.response.data) {
          setError(err.response.data.msgs);
        } else {
          setError(['Please try again later!']);
        }
      });
  };

  const logoutUser = async () => {
    await axios
      .get(USER_API_URL + 'logout')
      .then((res) => {
        console.log(res);
        setUser && setUser(null);
      })
      .catch((err) => console.log(err));
  };

  return {
    registerUser,
    loginUser,
    logoutUser,
    error,
  };
}
