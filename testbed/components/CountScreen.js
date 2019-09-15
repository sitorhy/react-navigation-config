import React from "react";
import { Button, View, Text } from "react-native";
import navigator from "../react-navigation-config/router";

export default class extends React.Component {
  state = {
    count: 0
  };

  timer = null;

  toCountControl = () => {
    navigator.navigateTo("count-control", {
      channel: {
        startCount: this.startCount,
        stopCount: this.stopCount
      }
    });
  };

  startCount = () => {
    if (!this.timer) {
      this.timer = setInterval(() => {
        this.setState({
          count: (this.state.count || 0) + 1
        });
      }, 1000);
    }
  };

  stopCount = () => {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  };

  componentWillUnmount() {
    this.stopCount();
  }

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
