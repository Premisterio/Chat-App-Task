import { createContext, useState, useEffect, useContext } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const { user: clerkUser, isSignedIn, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const registerOrFetchUser = async () => {
      try {
        if (isLoaded && isSignedIn && clerkUser) {
          const userData = {
            clerkId: clerkUser.id,
            firstName: clerkUser.firstName || '',
            lastName: clerkUser.lastName || '',
            email: clerkUser.primaryEmailAddress?.emailAddress || '',
            profileImage: clerkUser.imageUrl || ''
          };

          const data = await authService.handleAuthentication(userData);
          if (data && data.user) {
            setUser(data.user);
          } else {
            setUser(null);
            authService.logout();
          }
        } else if (isLoaded && !isSignedIn) {
          setUser(null);
          authService.logout();
        }
      } catch (error) {
        console.error('Error registering user:', error);
        setUser(null);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded) {
      registerOrFetchUser();
    }
  }, [isSignedIn, isLoaded, clerkUser]);

  const logout = async () => {
    try {
      setUser(null);
      authService.logout();
      
      await signOut();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;