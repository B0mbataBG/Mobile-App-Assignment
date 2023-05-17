import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';


import SignUpScreen from './screens/SignUp';
import HomeScreen from './screens/Home';
import SignInScreen from './screens/SignIn';
import IndexScreen from './screens';
import ChatScreen from './screens/Chat';
import ContactsScreen from './screens/Contacts';
import SettingsScreen from './screens/Settings';
import SearchScreen from './screens/Search';
import ChatDetails from './screens/ChatDetails';
import ChatUpdate from './screens/ChatUpdate';


const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Contacts" component={ContactsScreen}/>
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
    </Tab.Navigator>
  );
}

export default function App(){
  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Index'>
        <Stack.Screen name="Index" component={IndexScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="ChatDetails" component={ChatDetails} />
        <Stack.Screen name="ChatUpdate" component={ChatUpdate} />
        <Stack.Screen name="Home" component={MyTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}