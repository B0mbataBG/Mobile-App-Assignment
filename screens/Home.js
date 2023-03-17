import * as React from 'react';
import { View, Text, Button } from 'react-native';

class HomeScreen extends React.Component {
  render() {
    return (
      <View>
        <Text>THIS IS THE HomeScreen</Text>

        <Button
          title="Sign Up"
          onPress={() => this.props.navigation.navigate('SignUp')}
        />
        <Button
          title="Sign In"
          onPress={() => this.props.navigation.navigate('SignIn')}
        />

      </View>
    );
  }
}

export default HomeScreen;