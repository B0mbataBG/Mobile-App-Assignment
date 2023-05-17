import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  chatItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  chatTitle: {
    fontSize: 18,
  },
});

class ChatList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chats: [],
    };
  }

  componentDidMount() {
    this.fetchChats();
  }

  fetchChats = async () => {
    try {
      const token = await AsyncStorage.getItem('sessionId');
      const response = await fetch('http://localhost:3333/api/1.0.0/chat', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);  
        this.setState({ chats: data });
      } else {
        console.log('Error fetching chats:', response.status);
      }
    } catch (error) {
      console.log('Error fetching chats:', error);
    }
  };

  createChat = async (chatTitle) => {
    try {
      const token = await AsyncStorage.getItem('sessionId');
      const response = await fetch('http://localhost:3333/api/1.0.0/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token,
        },
        body: JSON.stringify({
          name: chatTitle,
        }),
      });

      if (response.status === 201) {
        const data = await response.json();
        console.log('Chat created successfully:', data);
        this.fetchChats();

      } else {
        console.log('Error creating chat:', response.status);
      }
    } catch (error) {
      console.log('Error creating chat:', error);
    }
  };


  handleChatPress = (chatId) => {
    this.props.navigation.navigate('ChatDetails', { chatId: chatId });
  };
  
  renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => this.handleChatPress(item.chat_id)}>
      <View style={styles.chatItem}>
        <Text style={styles.chatTitle}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  )
  

  render() {
    return (
      <FlatList
        data={this.state.chats}
        renderItem={this.renderItem}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}

      />
    );
  }

  
}

export default ChatList;



