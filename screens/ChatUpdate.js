import React from 'react';
import { View, Text, StyleSheet, FlatList, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeButton from '../Components/HomeButton';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  listItemText: {
    fontSize: 18,
  },
  button: {
    padding: 10,
    borderRadius: 5,
  },
});

class ChatUpdate extends React.Component {
  state = {
    contacts: [],
    chatUsers: [],
  };

  componentDidMount() {
    this.getUserId();
    this.fetchContacts();
    this.fetchChatDetails();
  }

  getUserId = async () => {
    const userIdString = await AsyncStorage.getItem('userId');
    const userId = parseInt(userIdString, 10);
    this.setState({ loggedInUserId: userId });
  };
  

  fetchContacts = async () => {
    const token = await AsyncStorage.getItem('sessionId');
  
    const responseContacts = await fetch('http://localhost:3333/api/1.0.0/contacts', {
      headers: {
        'X-Authorization': token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  
    if (responseContacts.ok) {
      const dataContacts = await responseContacts.json();
      this.setState({ contacts: dataContacts });
    } else {
      console.error('Failed to fetch contacts');
    }
  };
  
  fetchChatDetails = async () => {
    const token = await AsyncStorage.getItem('sessionId');
    const chatId = this.props.route.params.chatId;
  
    const responseChatDetails = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}`, {
      headers: {
        'X-Authorization': token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  
    if (responseChatDetails.ok) {
      const dataChatDetails = await responseChatDetails.json();
      this.setState({ chatUsers: dataChatDetails.members });
    } else {
      console.error('Failed to fetch chat details');
    }
  };
  

  handleAddUser = async (userId) => {
    const token = await AsyncStorage.getItem('sessionId');
    const chatId = this.props.route.params.chatId;

    const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/user/${userId}`, {
      method: 'POST',
      headers: {
        'X-Authorization': token,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      console.log('User added to chat successfully');
      this.fetchContacts(); 
      this.fetchChatDetails(); // refresh the contacts and chat users list
    } else {
      console.error('Failed to add user to chat');
    }
  };

  handleRemoveUser = async (userId) => {
    const token = await AsyncStorage.getItem('sessionId');
    const chatId = this.props.route.params.chatId;

    const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/user/${userId}`, {
      method: 'DELETE',
      headers: {
        'X-Authorization': token,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      console.log('User removed from chat successfully');
      this.fetchContacts();
      this.fetchChatDetails(); // refresh the contacts and chat users list
    } else {
      console.error('Failed to remove user from chat');
    }
  };

  renderContact = ({ item }) => (
    <View style={styles.listItem}>
      <Text style={styles.listItemText}>{`User ID: ${item.user_id}`}</Text>
      <Text style={styles.listItemText}>{`Name: ${item.first_name} ${item.last_name}`}</Text>
      <Button title="Add to Chat" onPress={() => this.handleAddUser(item.user_id)} />
    </View>
  );

  renderChatUser = ({ item }) => (
    <View style={styles.listItem}>
      <Text style={styles.listItemText}>{`User ID: ${item.user_id}`}</Text>
      <Text style={styles.listItemText}>{`Name: ${item.first_name} ${item.last_name}`}</Text>
      <Button title="Remove from Chat" onPress={() => this.handleRemoveUser(item.user_id)} />
    </View>
  );

  render() {
    // Filter out contacts that are already in the chat and the logged-in user
    const filteredContacts = this.state.contacts.filter(contact =>
      !this.state.chatUsers.find(user => user.user_id === contact.user_id) &&
      contact.user_id !== this.state.loggedInUserId
    );

    // Filter out the logged-in user from the chat users
    const filteredChatUsers = this.state.chatUsers.filter(
      user => user.user_id !== this.state.loggedInUserId
    );

    return (
      <View style={styles.container}>
        <HomeButton />

        <Text style={styles.title}>Chat Users</Text>
        
        <FlatList
          data={filteredChatUsers}
          keyExtractor={(item, index) => item && item.user_id ? item.user_id.toString() : index.toString()}
          renderItem={this.renderChatUser}
        />
        
        <Text style={styles.title}>Contacts</Text>

        <FlatList
          data={filteredContacts} 
          keyExtractor={(item, index) => item && item.user_id ? item.user_id.toString() : index.toString()}
          renderItem={this.renderContact}
        />
      </View>
    );
  }


}

export default ChatUpdate;
