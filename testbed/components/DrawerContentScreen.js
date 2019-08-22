import React from "react";
import { Button, View } from "react-native";
import navigator from "../react-navigation-config/router";

export default class extends React.Component {
  componentDidUpdate() {
    const channel = navigator.getChannel();
    if (channel) {
      const { setText } = channel;
      if (setText) {
        setText("力拔山兮气盖世");
      }
    }
  }

  closeDrawer = () => {
    navigator.closeDrawer({
      channel: {}
    });
  };

  render() {
    return (
      <View>
        <View style={{ margin: 10 }}>
          <Button title="Close" onPress={this.closeDrawer} />
        </View>
      </View>
    );
  }
}
