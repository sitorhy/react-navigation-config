import React from "react";
import { Button, View } from "react-native";
import navigator from "../router/navigator";

export default class extends React.Component {
  startCount = () => {};

  endCount = () => {};

  chainNavigate = () => {
    navigator.navigateTo("home").then(() => {
      navigator.navigateTo("register");
    });
  };

  render() {
    return (
      <View>
        <View style={{ marginTop: 10, marginBottom: 10 }}>
          <Button
            title="Start Count"
            style={{ marginTop: 10, marginBottom: 10 }}
            onPress={this.startCount}
          />
        </View>
        <View style={{ marginTop: 10, marginBottom: 10 }}>
          <Button
            title="Stop Count"
            style={{ marginTop: 10, marginBottom: 10 }}
            onPress={this.endCount}
          />
        </View>
        <View style={{ marginTop: 10, marginBottom: 10 }}>
          <Button
            title="Chain Navigate To Register"
            onPress={this.chainNavigate}
          />
        </View>
      </View>
    );
  }
}
