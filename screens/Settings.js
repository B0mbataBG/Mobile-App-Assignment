import React from 'react';
import { View, Text, Alert, StyleSheet, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
  },
  userInfo: {
    fontSize: 18,
  },
  formContainer: {
    width: '80%',
    marginTop: 20,
  },
  formInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
});

class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: null,
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    };
  }

  async componentDidMount() {
    // Fetch user data as before, then update form inputs with fetched data.
    const userId = await AsyncStorage.getItem('userId');
    const token = await AsyncStorage.getItem('sessionId');

    fetch(`http://localhost:3333/api/1.0.0/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          userData: data,
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
        });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  handleInputChange = (name, value) => {
    this.setState({
      [name]: value,
    });
  };

  handleSubmit = async () => {
    const { firstName, lastName, email, password } = this.state;
    const userId = await AsyncStorage.getItem('userId');
    const token = await AsyncStorage.getItem('sessionId');
  
    fetch(`http://localhost:3333/api/1.0.0/user/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then((data) => {
        console.log('Success:', data);
        Alert.alert('Success!', 'Your information has been updated.');
        this.componentDidMount();
      })
      .catch((error) => {
        console.error('Error:', error);
        Alert.alert('Oops!', 'Something went wrong. Please try again.');
      });
  };
  

  render() {
    const { userData, firstName, lastName, email, password } = this.state; 

    return (
      <View style={styles.container}>
        <Text style={styles.title}>User Information</Text>
        {userData ? (
          <>
            <Text style={styles.userInfo}>First Name: {userData.first_name}</Text>
            <Text style={styles.userInfo}>Last Name: {userData.last_name}</Text>
            <Text style={styles.userInfo}>Email: {userData.email}</Text>
          </>
        ) : (
          <Text>Loading...</Text>)}
          <View style={styles.formContainer}>
            <TextInput
              style={styles.formInput}
              value={firstName}
              onChangeText={(text) => this.handleInputChange('firstName', text)}
              placeholder="First Name"
            />
            <TextInput
              style={styles.formInput}
              value={lastName}
              onChangeText={(text) => this.handleInputChange('lastName', text)}
              placeholder="Last Name"
            />
            <TextInput
              style={styles.formInput}
              value={email}
              onChangeText={(text) => this.handleInputChange('email', text)}
              placeholder="Email"
            />
            <TextInput
              style={styles.formInput}
              value={password}
              onChangeText={(text) => this.handleInputChange('password', text)}
              placeholder="Password"
            />
            <Button title="Update Information" onPress={this.handleSubmit} />
          </View>
        </View>
      );
    }
  }
  
  export default SettingsScreen;
  
