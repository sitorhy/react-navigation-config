import React from "react";
import { View, Text, Button } from "react-native";
import { StackActions } from "react-navigation";
import navigator from "../react-navigation-config/router";

export default class extends React.Component {
  componentDidMount() {
    console.log(this.props);
    console.log(navigator.getCurrentParams());
  }

  pushTest = () => {
    const { navigation } = this.props;
    navigation.dispatch(
      StackActions.push({
        routeName: "setting",
        params: {
          myUserId: 9,
        },
      })
    );
  };

  render() {
    return (
      <View>
        <Text>Setting</Text>
        <Button title="Push Test" onPress={this.pushTest} />
      </View>
    );
  }
}
