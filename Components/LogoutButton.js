import React from 'react';
import { Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LogoutButton = ({ onLogout }) => {
  const handleLogout = async () => {
    // Remove the token from AsyncStorage
    await AsyncStorage.removeItem('sessionId');
    // Call the onLogout prop to update the authentication status in the parent component
    onLogout();
  };

  return <Button title="Logout" onPress={handleLogout} />;
};

export default LogoutButton;
