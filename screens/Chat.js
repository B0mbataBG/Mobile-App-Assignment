import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  chatTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
});

class ChatScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chat: null,
    };
  }

  componentDidMount() {
    this.fetchChatDetails();
  }

  fetchChatDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('sessionId');
      const chat_id = this.props.route.params.chat_id;
      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chat_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        this.setState({ chat: data });
      } else {
        console.log('Error fetching chat details:', response.status);
      }
    } catch (error) {
      console.log('Error fetching chat details:', error);
    }
  };

  render() {
    const { chat } = this.state;

    if (!chat) {
      return <Text>Loading...</Text>;
    }

    return (
      <View style={styles.container}>
        <Text style={styles.chatTitle}>{chat.name}</Text>
      </View>
    );
  }
}

export default ChatScreen;

 