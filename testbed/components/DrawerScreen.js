import React from "react";
import { Button, View } from "react-native";
import navigator from "../react-navigation-config/router";

export default class extends React.Component {
  openDrawer = () => {
    navigator.openDrawer();
  };

  render() {
    return (
      <View>
        <View style={{ margin: 10 }}>
          <Button title="Open" onPress={this.openDrawer} />
        </View>
      </View>
    );
  }
}
