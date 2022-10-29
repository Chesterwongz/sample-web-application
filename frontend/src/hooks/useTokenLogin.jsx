import axios from 'axios';
import { useState, useEffect } from 'react';
import { USER_API_URL } from '../routes';

export default function useTokenLogin() {
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function findUser() {
      await axios
        .get(USER_API_URL + 'auth', { withCredentials: true })
        .then((res) => {
          setUser(res.data.currentUser);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
    findUser();
  }, []);

  return {
    user,
    setUser,
    isLoading,
  };
}
