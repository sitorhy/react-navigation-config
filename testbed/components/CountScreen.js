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
        <View style={{ marginTop: 10, marginBottom: 10 }}>
          <Text
            style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}
          >
            {count}
          </Text>
        </View>
        <Button title="control" onPress={this.toCountControl} />
      </View>
    );
  }
}
