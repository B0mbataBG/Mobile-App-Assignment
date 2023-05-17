import React, { Component } from 'react';
import { TextInput } from 'react-native';
import { FlatList, ActivityIndicator, Text, View } from 'react-native';
import { Button, ScrollView } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

class SignInScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      error: ""
    }
  }

  signIn = () => {
    // Validation checks
    let error = "";
    if (!this.state.email) {
      error = 'Please enter your email';
    } else if (!this.state.password) {
      error = 'Please enter your password';
    } else if (!this.validateEmail(this.state.email)) {
      error = 'Invalid email address';
    }

    if (error) {
      this.setState({ error });
      return;
    }

    // Make the API request
    fetch("http://localhost:3333/api/1.0.0/login", {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "email": this.state.email,
        "password": this.state.password
      })
    })
    .then((response) => {
      if (response.status === 200) {
        return response.json()
      } else if (response.status === 400) {
        throw 'Invalid email/password supplied';
      } else if (response.status === 500) {
        throw 'Server Error';
      } else {
        throw 'Something went wrong';
      }
    })
    .then((responseJson) => {
      console.log("Id and token", responseJson);
      // Store the token in AsyncStorage
      AsyncStorage.setItem('sessionId', responseJson.token)
        .then(() => {
          console.log('Token stored successfully');
          AsyncStorage.setItem('userId', responseJson.id.toString())
                .then(() => {
                    console.log('UserId stored successfully');
                    this.props.navigation.navigate("Home");
                })
                .catch((error) => {
                    console.log('Failed to store userId:', error);
                });
        })
        .catch((error) => {
          console.log('Failed to store token:', error);
        });
    })
    .catch((error) => {
      this.setState({ error: error.toString() });
    })
  }

  validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  render() {
    return (
      <ScrollView>
        <TextInput
          placeholder='Enter your email'
          onChangeText={(email) => this.setState({ email })}
          value={this.state.email}
          style={{ padding: 5, borderWidth: 1, margin: 5 }}
        />
        <TextInput
          placeholder='Enter your password'
          onChangeText={(password) => this.setState({ password })}
          value={this.state.password}
          style={{ padding: 5, borderWidth: 1, margin: 5 }}
          secureTextEntry
        />
        <Button
          title="Sign In"
          onPress={() => this.signIn()}
        />
        {this.state.error ? (
          <Text style={{ color: 'red', margin: 10 }}>{this.state.error}</Text>
        ) : null}
      </ScrollView>
    )
  }
}

export default SignInScreen;
