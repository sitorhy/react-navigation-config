import React from "react";
import { View, Text, Button } from "react-native";
import navigator from "../react-navigation-config/router";

export default class extends React.Component {
  componentDidMount() {
    console.log(this.props);
    console.log(navigator.getCurrentParams());
  }

  pushTest = () => {
    navigator.push("setting", {
      params: {
        randomSeed: parseInt(Math.random() * 100)
      },
      channel: {
        randomNum: parseInt(Math.random() * 100)
      }
    });
  };

  changeTitle = () => {
    this.props.navigation.setParams({ headerTitle: "力微任重久神疲" });
  };

  reLaunch = () => {
    navigator.reLaunch("main").then(() => {});
  };

  pop = () => {
    navigator.pop(1);
  };

  toTop = () => {
    navigator.popToTop();
  };

  render() {
    return (
      <View>
        <Text>Setting</Text>
        <Button title="Push Test" onPress={this.pushTest} />
        <Button title="Change Title" onPress={this.changeTitle} />
        <Button title="ReLaunch Test" onPress={this.reLaunch} />
        <Button title="Pop Test" onPress={this.pop} />
        <Button title="PopToTop Test" onPress={this.toTop} />
      </View>
    );
  }
}
