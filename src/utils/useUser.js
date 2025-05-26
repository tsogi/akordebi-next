import React, { useEffect, useState, createContext, useContext } from 'react';
import { useSessionContext, useUser as useSupaUser } from '@supabase/auth-helpers-react';

// Context creation
export const UserContext = createContext();

// Provider component
export const MyUserContextProvider = ({ children }) => {
  const { session, isLoading: isLoadingUser, supabaseClient: supabase } = useSessionContext();
  const user = useSupaUser();
  const accessToken = session?.access_token ?? null;
  const [isLoadingData, setIsloadingData] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [authOpenedFrom, setAuthOpenedFrom] = useState(null);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const initializeUserDetails = async () => {
      if (user && !isLoadingData && !userDetails) {
        setIsloadingData(true);

        const response = await fetch(`/api/auth/getUser`,
          { method: "GET", headers: { 'Content-Type': 'application/json', }}
        );

        const {user: foundUserDetails} = await response.json();

        if (foundUserDetails) {
          setUserDetails(foundUserDetails);
          // Set premium status based on paid_until date
          const isPaidUntilValid = foundUserDetails.paid_until && new Date(foundUserDetails.paid_until) > new Date();
          setIsPremium(isPaidUntilValid);
        }

        setIsloadingData(false);
      } else if (!user && !isLoadingUser && !isLoadingData) {
        setUserDetails(null);
        setIsPremium(false);
      }
    };

    initializeUserDetails();

    // close auth slide over if user is logged in
    if(user && !!authOpenedFrom) {
      setAuthOpenedFrom(null);
    }

  }, [user, isLoadingUser, userDetails]);

  const contextValue = {
    accessToken,
    user,
    userDetails,
    isLoading: isLoadingUser || isLoadingData,
    authOpenedFrom,
    setAuthOpenedFrom,
    isPremium,
  };

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

// Custom hook to use context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a MyUserContextProvider');
  }
  return context;
};
