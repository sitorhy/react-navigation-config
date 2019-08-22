import React from "react";
import { Button, View, Text } from "react-native";
import navigator from "../react-navigation-config/router";

export default class extends React.Component {
  openDrawer = () => {
    navigator.openDrawer({
      channel: {
        setText: (text = "") => {
          this.setState({
            text
          });
        }
      }
    });
  };

  toggleDrawer = () => {
    navigator.toggleDrawer({
      channel: {
        setText: (text = "") => {
          this.setState({
            text
          });
        }
      }
    });
  };

  state = {
    text: ""
  };

  render() {
    const { text } = this.state;

    return (
      <View>
        <View style={{ margin: 10 }}>
          <Button title="Open" onPress={this.openDrawer} />
          <Button title="Toggle" onPress={this.toggleDrawer} />
          <Text>{text}</Text>
        </View>
      </View>
    );
  }
}
