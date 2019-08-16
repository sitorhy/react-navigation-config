import React from "react";
import { View, Text } from "react-native";
import navigator from "../router/navigator";

export default class extends React.Component {
  componentDidMount() {
    console.log(navigator.getParams());
  }

  render() {
    return (
      <View>
        <Text>Setting</Text>
      </View>
    );
  }
}
