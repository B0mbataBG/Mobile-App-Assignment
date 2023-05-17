import React from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
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
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
});

class ContactsScreen extends React.Component {
  state = {
    contacts: [],
    newContactUserId: '',
    newContactName: '',
    blockedUsers: [],

  };
  

  componentDidMount() {
    this.fetchContacts();
    this.fetchBlockedUsers();

  }

  fetchContacts = async () => {
    try {
      const token = await AsyncStorage.getItem('sessionId');
      const response = await fetch('http://localhost:3333/api/1.0.0/contacts', {
        method: 'GET',
        headers: {
          'X-Authorization': token,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Contacts fetched:', data);  
        this.setState({ contacts: data });
      } else {
        console.error('Failed to fetch contacts');
      }
    } catch (error) {
      console.error('Failed to fetch token or contacts:', error);
    }
  };
  
  fetchBlockedUsers = async () => {
    try {
      const token = await AsyncStorage.getItem('sessionId');
      const response = await fetch('http://localhost:3333/api/1.0.0/blocked', {
        method: 'GET',
        headers: {
          'X-Authorization': token,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Blocked users fetched:', data);
        this.setState({ blockedUsers: data });
      } else {
        console.error('Failed to fetch blocked users');
      }
    } catch (error) {
      console.error('Failed to fetch token or blocked users:', error);
    }
  };
  

  addContact = async () => {
    try {
      const token = await AsyncStorage.getItem('sessionId');
      const response = await fetch(`http://localhost:3333/api/1.0.0/user/${this.state.newContactUserId}/contact`, {
        method: 'POST',
        headers: {
          'X-Authorization': token,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        console.log('Contact added successfully');
        this.setState({ newContactUserId: '' });
        this.fetchContacts();  // refresh the contacts list
      } else {
        console.error('Failed to add contact');
      }
    } catch (error) {
      console.error('Failed to add contact:', error);
    }
  };

  removeContact = async (userId) => {
    try {
      const token = await AsyncStorage.getItem('sessionId');
      const response = await fetch(`http://localhost:3333/api/1.0.0/user/${userId}/contact`, {
        method: 'DELETE',
        headers: {
          'X-Authorization': token,
          'Content-Type': 'application/json',
        },
      });
    
      if (response.ok) {
        console.log('Contact removed successfully');
        this.fetchContacts();  // refresh the contacts list
      } else {
        console.error('Failed to remove contact');
      }
    } catch (error) {
      console.error('Failed to remove contact:', error);
    }
  };
  
  blockUser = async (userId) => {
    try {
      const token = await AsyncStorage.getItem('sessionId');
      const response = await fetch(`http://localhost:3333/api/1.0.0/user/${userId}/block`, {
        method: 'POST',
        headers: {
          'X-Authorization': token,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        console.log('User blocked successfully');
        this.fetchBlockedUsers();  // refresh the blocked users list
        this.fetchContacts();  // refresh the contacts list

      } else {
        console.error('Failed to block user');
      }
    } catch (error) {
      console.error('Failed to block user:', error);
    }
  };
  
  unblockUser = async (userId) => {
    try {
      const token = await AsyncStorage.getItem('sessionId');
      const response = await fetch(`http://localhost:3333/api/1.0.0/user/${userId}/block`, {
        method: 'DELETE',
        headers: {
          'X-Authorization': token,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        console.log('User unblocked successfully');
        this.fetchBlockedUsers();  // refresh the blocked users list
        this.fetchContacts();  // refresh the contacts list

      } else {
        console.error('Failed to unblock user');
      }
    } catch (error) {
      console.error('Failed to unblock user:', error);
    }
  };

  
  renderContact = ({ item }) => (
    <View style={styles.listItem}>
      <Text style={styles.listItemText}>{`User ID: ${item.user_id}`}</Text>
      <Text style={styles.listItemText}>{`Name: ${item.first_name} ${item.last_name}`}</Text>
      <Text style={styles.listItemText}>{`Email: ${item.email}`}</Text>
      <Button title="Remove" onPress={() => this.removeContact(item.user_id)} />
      <Button title="Block" onPress={() => this.blockUser(item.user_id)} />
      {/* Render other contact details here */}
    </View>
  );
  
  renderBlockedUser = ({ item }) => (
    <View style={styles.listItem}>
      <Text style={styles.listItemText}>{`User ID: ${item.user_id}`}</Text>
      <Text style={styles.listItemText}>{`Name: ${item.first_name} ${item.last_name}`}</Text>
      <Text style={styles.listItemText}>{`Email: ${item.email}`}</Text>
      <Button title="Unblock" onPress={() => this.unblockUser(item.user_id)} />
      {/* Render other blocked user details here */}
    </View>
  );
  

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Contacts</Text>
        
        <FlatList
          data={this.state.contacts} 
          keyExtractor={(item, index) => item && item.user_id ? item.user_id.toString() : index.toString()}
          renderItem={this.renderContact}
        />

        <Text style={styles.title}>Blocked Contacts</Text>

        <FlatList
          data={this.state.blockedUsers}
          keyExtractor={(item, index) => item && item.id ? item.id.toString() : index.toString()}
          renderItem={this.renderBlockedUser}
        />

        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={(text) => this.setState({ newContactUserId: text })}
          value={this.state.newContactUserId}
          placeholder="UserID of new contact"
        />
        <View style={styles.button}>
          <Button onPress={this.addContact} title="Add Contact" />
        </View>
      </View>
    );
  }
  
  
}

export default ContactsScreen;
