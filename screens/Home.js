import React from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LogoutButton from '../Components/LogoutButton';
import ChatList from '../components/ChatList';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  chatList: {
    flex: 1,
  },
  chatItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  chatTitle: {
    fontSize: 18,
  },
  button: {
    marginTop: 10,
  },
  createChatContainer: {
    padding: 16,
  },
  createChatInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
});

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      chatTitle: '',
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('sessionId')
      .then((token) => {
        if (token) {
          this.setState({ isLoggedIn: true });
        }
      })
      .catch((error) => {
        console.log('Failed to get token:', error);
      });
  }

  handleLogout = () => {
    this.setState({ isLoggedIn: false });
  };

  handleCreateChat = (chatTitle) => {
    this.chatListRef.createChat(chatTitle);
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 24 }}>What's That</Text>

        {this.state.isLoggedIn ? (
          <>
            <ChatList
              ref={(ref) => {
                this.chatListRef = ref;
              }}
            />
            <View style={styles.createChatContainer}>
              <TextInput
                style={styles.createChatInput}
                onChangeText={(text) => this.setState({ chatTitle: text })}
                value={this.state.chatTitle}
                placeholder="Enter chat title"
              />
              <Button
                title="Create Chat"
                onPress={() => this.handleCreateChat(this.state.chatTitle)}
              />
            </View>
            <LogoutButton onLogout={this.handleLogout} />
          </>
        ) : (
          <>
            <View style={styles.button}>
              <Button
                title="Sign Up"
                onPress={() => this.props.navigation.navigate('SignUp')}
              />
            </View>

            <View style={styles.button}>
              <Button
                title="Sign In"
                onPress={() => this.props.navigation.navigate('SignIn')}
              />
            </View>
          </>
        )}
      </View>
    );
  }
}

export default HomeScreen;
