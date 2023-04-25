import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LogoutButton from '../Components/LogoutButton';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  button: {
    marginTop: 10,
  },
});



class IndexScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
    };
  }

  // Check if the user is logged in when the component mounts
  componentDidMount() {
    AsyncStorage.getItem('sessionId')
      .then((token) => {
        if (token) {
          this.setState({ isLoggedIn: true });
        }
      })
      .catch((error) => {
        console.log('Failed to get token:', error);
      });
  }

  // Callback function to update the authentication status when the user logs out
  handleLogout = () => {
    this.setState({ isLoggedIn: false });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 24 }}>What's That</Text>

        {this.state.isLoggedIn ? (
          <LogoutButton onLogout={this.handleLogout} />
        ) : (
          <>
            <View style={styles.button}>
              <Button
                title="Sign Up"
                onPress={() => this.props.navigation.navigate('SignUp')}
              />
            </View>

            <View style={styles.button}>
              <Button
                title="Sign In"
                onPress={() => this.props.navigation.navigate('SignIn')}
              />
            </View>
          </>
        )}
      </View>
    );
  }
}


export default IndexScreen;
