import React from 'react';
import { Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function HomeButton() {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('Home');
  };

  return (
    <Button title="Home" onPress={handlePress} />
  );
}

export default HomeButton;