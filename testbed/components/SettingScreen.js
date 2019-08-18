import React from "react";
import { View, Text } from "react-native";
import navigator from "../react-navigation-config/router";

export default class extends React.Component {
  componentDidMount() {
    console.log(navigator.getCurrentParams());
  }

  render() {
    return (
      <View>
        <Text>Setting</Text>
      </View>
    );
  }
}
