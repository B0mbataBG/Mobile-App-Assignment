import React from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
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
  user: {
    fontSize: 18,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 18,
  },
});

class SearchScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      users: [],
    };
  }

  searchUsers = async () => {
    const sessionId = await AsyncStorage.getItem('sessionId');
  
    fetch('http://localhost:3333/api/1.0.0/search?q=' + this.state.query, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': sessionId,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('Response:', responseJson);
        this.setState({ users: responseJson });
      })
      .catch((error) => {
        console.log('Error during fetch', error);
      });
  };

  addToContacts = async (user) => {
    console.log(user); 
    try {
        const token = await AsyncStorage.getItem('sessionId');
        const response = await fetch(`http://localhost:3333/api/1.0.0/user/${user.user_id}/contact`, {
          method: 'POST',
          headers: {
            'X-Authorization': token,
            'Content-Type': 'application/json',
          },
        });
    
        if (response.ok) {
          console.log('Contact added successfully');
        } else {
          console.error('Failed to add contact');
        }
    } catch (error) {
        console.error('Failed to add contact:', error);
    }
};


renderUser = ({ item }) => {
  return (
    <View style={styles.userContainer}>
      <Text style={styles.user}>
        {item.first_name} {item.last_name} ({item.email})
      </Text>
      <Button title="Add to Contacts" onPress={() => this.addToContacts(item)} />
    </View>
  );
};

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Search Users</Text>
        <TextInput
          style={styles.input}
          onChangeText={(query) => this.setState({ query })}
          value={this.state.query}
          placeholder="Search"
        />
        <Button title="Search" onPress={this.searchUsers} />
        <FlatList data={this.state.users} renderItem={this.renderUser} keyExtractor={(item) => item.email} />
      </View>
    );
  }
}

export default SearchScreen;
