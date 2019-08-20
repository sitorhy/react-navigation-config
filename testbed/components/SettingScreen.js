import React from "react";
import { View, Text, Button } from "react-native";
import navigator from "../react-navigation-config/router";

export default class extends React.Component {
  componentDidMount() {
    console.log(this.props);
    console.log(navigator.getCurrentParams());
  }

  pushTest = () => {
    navigator.push("setting", {
      params: {
        randomSeed: parseInt(Math.random() * 100)
      },
      channel: {
        randomNum: parseInt(Math.random() * 100)
      }
    });
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
