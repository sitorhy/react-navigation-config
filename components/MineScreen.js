import React from "react";
import { Text, View, Button } from "react-native";

export default class extends React.Component {
  toHome = () => {
    const { navigation } = this.props;
    navigation.navigate("Home");
  };

  toAuth = () => {
    const { navigation } = this.props;
    navigation.navigate("Login");
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>富强民主文明和谐</Text>
        <Button onPress={this.toHome} title="←切换到左边" />
        <Button onPress={this.toAuth} title="注册流程" />
      </View>
    );
  }
}
