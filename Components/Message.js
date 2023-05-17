import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const styles = StyleSheet.create({
  messageContainer: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  messageText: {
    fontSize: 16,
  },
  icon: {
    marginRight: 10,
  },
  timestamp: {
    fontSize: 12,
    color: 'gray',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  author: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

const Message = ({ message, onDelete, onUpdate }) => {
  const [isEditing, setEditing] = useState(false);
  const [updatedMessage, setUpdatedMessage] = useState('');

  const handleUpdate = () => {
    if (isEditing) {
      onUpdate(message.message_id, updatedMessage);
    } else {
      setUpdatedMessage(message.message);
    }
    setEditing(!isEditing);
  };

  return (
    <View style={styles.messageContainer}>
      <Text style={styles.timestamp}>{new Date(message.timestamp).toLocaleString()}</Text>
      <Text style={styles.author}>{message.author.first_name + ' ' + message.author.last_name}</Text>
      {isEditing ? (
        <TextInput
          value={updatedMessage}
          onChangeText={setUpdatedMessage}
        />
      ) : (
        <Text style={styles.messageText}>{message.message}</Text>
      )}
      <View style={styles.actions}>
        <TouchableOpacity onPress={handleUpdate}>
          <Ionicons name={isEditing ? "checkmark-circle" : "create-outline"} size={20} color="black" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(message.message_id)}>
          <Ionicons name="trash-bin-outline" size={20} color="red" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Message;
