import React from "react";
import { Button, View } from "react-native";
import navigator from "../react-navigation-config/router";

export default class extends React.Component {
  closeDrawer = () => {
    navigator.closeDrawer();
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
