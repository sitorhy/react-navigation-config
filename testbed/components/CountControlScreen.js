import React from "react";
import { Button, View, Text } from "react-native";
import { getRouter } from "../router";

export default class extends React.Component {
  startCount = () => {
    getRouter().reLaunch("home");
  };

  endCount = () => {};

  render() {
    return (
      <View>
        <Button title="Start" onPress={this.startCount} />
        <Button title="Stop" onPress={this.endCount} />
      </View>
    );
  }
}
