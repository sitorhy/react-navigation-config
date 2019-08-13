import React from "react";
import { Button, View, Text } from "react-native";
import { getRouter } from "../router";

export default class extends React.Component {
  state = {
    count: 0
  };

  toCountControl = () => {
    getRouter().navigateTo("count-control");
  };

  render() {
    const { count } = this.state;

    return (
      <View>
        <Text>{count}</Text>
        <Button title="control" onPress={this.toCountControl} />
      </View>
    );
  }
}
