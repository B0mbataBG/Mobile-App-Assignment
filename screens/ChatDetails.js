import React from 'react';
import { View, Text, Button, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Message from '../Components/Message';
import { Ionicons } from '@expo/vector-icons';

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  chatDetails: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    flex: 1,
    marginRight: 8,
  },
  icon: {
    marginLeft: 10,
  },
  chatName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  
});

class ChatDetails extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      chat: {},
      messages: [],
      newMessage: '',
      updateChat: '',
      isEditingChatName: false,
    };

    this.handleSendMessage = this.handleSendMessage.bind(this);
  }
      

  componentDidMount() {
    console.log(this.props.route.params.chatId); 
    this.fetchChatDetails(this.props.route.params.chatId);

  }

  fetchChatDetails = async () => {
    try {
      const { chatId } = this.props.route.params;
      const token = await AsyncStorage.getItem('sessionId');
      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        this.setState({ 
            chat: data, 
            messages: data.messages 
          });
      } else {
        console.log('Error fetching chat details:', response.status);
      }
    } catch (error) {
      console.log('Error fetching chat details:', error);
    }
  };

  handleUpdateChat = async () => {
    try {
      const { chatId } = this.props.route.params;
      const token = await AsyncStorage.getItem('sessionId');
      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token,
        },
        body: JSON.stringify({
          name: this.state.updateChat,
        }),
      });

      if (response.ok) {
        console.log('Chat updated successfully');
        this.fetchChatDetails();
        this.setState({ isEditingChatName: false });

      } else {
        console.log('Error updating chat:', response.status);
      }
    } catch (error) {
      console.log('Error updating chat:', error);
    }
  };

  handleSendMessage = async () => {

    if (!this.state.newMessage.trim()) {
        return;
      }
    console.log(this.state.newMessage); 
    
    try {
      const { chatId } = this.props.route.params;
      const token = await AsyncStorage.getItem('sessionId');
      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token,
        },
        body: JSON.stringify({
          message: this.state.newMessage,
        }),
      });
  
      if (response.ok) {
        console.log('Message sent successfully');
        this.setState({ newMessage: '' }); 
        this.fetchChatDetails();
      } else {
        console.log('Error sending message:', response.status);
      }
    } catch (error) {
      console.log('Error sending message:', error);
    }
  };

  handleDeleteMessage = async (messageId) => {
    try {
      const { chatId } = this.props.route.params;
      const token = await AsyncStorage.getItem('sessionId');
      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/message/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token,
        },
      });
  
      if (response.ok) {
        console.log('Message deleted successfully');
        this.fetchChatDetails();
      } else {
        console.log('Error deleting message:', response.status);
      }
    } catch (error) {
      console.log('Error deleting message:', error);
    }
  };
  
  handleUpdateMessage = async (messageId, updatedMessage) => {
    try {
      const { chatId } = this.props.route.params;
      const token = await AsyncStorage.getItem('sessionId');
      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/message/${messageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token,
        },
        body: JSON.stringify({
          message: updatedMessage,
        }),
      });
  
      if (response.ok) {
        console.log('Message updated successfully');
        this.fetchChatDetails();
      } else {
        console.log('Error updating message:', response.status);
      }
    } catch (error) {
      console.log('Error updating message:', error);
    }
  };  

  handleNavigateToChatUpdate = () => {
    const { chatId } = this.props.route.params;
    this.props.navigation.navigate('ChatUpdate', { chatId });
  }


  render() {
    const { chat, messages, newMessage } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.chatDetails}>
          {this.state.isEditingChatName ? (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                onChangeText={(text) => this.setState({ updateChat: text })}
                value={this.state.updateChat}
                placeholder="Update chat name"
              />
              <TouchableOpacity onPress={this.handleUpdateChat}>
                <Ionicons name="checkmark-circle" size={20} color="black" style={styles.icon} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.inputContainer}>
              <Text>{chat.name}</Text>
              <TouchableOpacity onPress={() => this.setState({ isEditingChatName: true })}>
                <Ionicons name="create-outline" size={18} color="black" style={styles.icon} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.container}>
        <TouchableOpacity onPress={this.handleNavigateToChatUpdate}>
          <Ionicons name="person-add-outline" size={32} color="black" />
        </TouchableOpacity>
        </View>

        {this.state.chat.messages &&
          this.state.chat.messages.map((message) => (
            <Message key={message.message_id} message={message} onDelete={this.handleDeleteMessage} onUpdate={this.handleUpdateMessage} />
          ))}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={(text) => this.setState({ newMessage: text })}
            value={this.state.newMessage}
            placeholder="Type a message"
          />
          <Button title="Send" onPress={this.handleSendMessage} />
        </View>
      </View>
    );
  }
  
}

export default ChatDetails;
