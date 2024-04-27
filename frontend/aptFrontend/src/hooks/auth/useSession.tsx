import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Providers/AuthProvider';
import { decodeToken, useJwt } from 'react-jwt';


export const saveToken = (token) => {
  // Store token in local storage
  localStorage.setItem('token', token);
};

export const removeToken = () => {
  // Remove token from local storage
  localStorage.removeItem('token');
};

function useSession() {
  console.log('useSession', AuthContext);
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useToken must be used within an AuthProvider');
  }

  const { decodedToken, isExpired } = useJwt(context.token || '');
  const [session, setSession] = useState({
    status: 'loading',
    user: null,
  });

  // exp: 1712281498, iat: 1712277898, username: "llllllllll"

  useEffect(() => {
    const token = decodeToken(context.token || '');
    if (token) {
      setSession({
        status: 'authenticated',
        user: token,
        // expiresAt: token.exp as number,
      });
    }
  }, [context.token]);

  if (!context.token) return { status: 'unauthenticated', user: null };
  if (isExpired) {
    removeToken();
    return { status: 'unauthenticated', user: null };
  }

  console.log('decodedToken', decodedToken);

  session.user = decodedToken;
  session.status = 'authenticated';

  return session;
}

export default useSession;
