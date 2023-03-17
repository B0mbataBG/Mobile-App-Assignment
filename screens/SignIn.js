import React, { Component } from 'react';
import { Alert } from 'react-native';
import { TextInput } from 'react-native';
import { FlatList, ActivityIndicator, Text, View } from 'react-native';
import { Button, ScrollView } from 'react-native-web';



class SignInScreen extends Component{


  constructor(props){
    super (props);
    this.state ={
      email: "",
      password:"",
      signIn: ""
    }
}

    
    signIn = () =>{
            //Validation here
        
        return fetch ("http://localhost:3333/api/1.0.0/login", {
            method: 'post',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        })
        .then((response) => {
            if(response.status === 200){
            return response.json()
            }
            else if(response.status === 400){
            throw ' Invalid email/password supplied';
            }
            else if(response.status === 500){
            throw 'Server Error';
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
                  placeholder='Enter your email'
                  onChangeText={(email) => this.setState({email})}
                  value={this.state.email}
                  style={{padding:5, borderWidth:1, margin:5}}
                />
                <TextInput
                  placeholder='Enter your password'
                  onChangeText={(password) => this.setState({password})}
                  value={this.state.password}
                  style={{padding:5, borderWidth:1, margin:5}}
                />
                <Button 
                  title="Sign In"
                  onPress={() => this.signIn()}
                />
            </ScrollView>
        )
          
    }
}
export default SignInScreen;