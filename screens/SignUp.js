import React, { Component } from 'react';
import { Alert } from 'react-native';
import { TextInput } from 'react-native';
import { FlatList, ActivityIndicator, Text, View } from 'react-native';
import { Button, ScrollView } from 'react-native-web';



class SignUpScreen extends Component{


  constructor(props){
    super (props);
    this.state ={
      firstName: "",
      lastName: "",
      email: "",
      password:"",
      signUp: ""
    }
  }

    signUp = () =>{
    //Validation here


      return fetch ("http://localhost:3333/api/1.0.0/user", {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state)
      })
      .then((response) => {
        if(response.status === 201){
          return response.json()
        }
        else if(response.status === 400){
          throw 'Failed validation';
        }
        else {
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        console.log("User created ID:", responseJson);
        this.props.navigation.navigate("Login");
      })
      .catch((error) => {
        console.log(error);
      })

    }

      render(){
        return(
          <ScrollView>
            <TextInput
              placeholder='Enter your first name'
              onChangeText={(firstName) => this.setState({firstName})}
              value={this.state.firstName}
              style={{padding:5, borderWidth:1, margin:5}}
            />
            <TextInput
              placeholder='Enter your last name'
              onChangeText={(lastName) => this.setState({lastName})}
              value={this.state.lastName}
              style={{padding:5, borderWidth:1, margin:5}}
            />
            <TextInput
              placeholder='Enter your first email'
              onChangeText={(email) => this.setState({email})}
              value={this.state.email}
              style={{padding:5, borderWidth:1, margin:5}}
            />
            <TextInput
              placeholder='Enter your first password'
              onChangeText={(password) => this.setState({password})}
              value={this.state.password}
              style={{padding:5, borderWidth:1, margin:5}}
            />
            <Button 
              title="Create an account"
              onPress={() => this.signUp()}
            />
          </ScrollView>
        )
      }
    }

export default SignUpScreen;