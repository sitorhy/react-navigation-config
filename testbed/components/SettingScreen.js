import React from "react";
import { View, Text, Button } from "react-native";
import navigator from "../react-navigation-config/router";

export default class extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const Provider = navigator.channelProvider(navigation);
    return {
      headerRight: (
        <Provider>
          {props => {
            const { text } = props;
            return (
              <Text>
                {text ||
                  (navigator.hasPreviousNavigation(null, 1) ? "" : "LAST")}
              </Text>
            );
          }}
        </Provider>
      )
    };
  };

  componentDidMount() {
    console.log(this.props);
    console.log(navigator.getChannel());
    console.log(navigator.mergeChannels());
    console.log(navigator.getParams());
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
    //   this.props.navigation.setParams({ headerTitle: "力微任重久神疲" });
    navigator.setParams(null, { headerTitle: "力微任重久神疲" });
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

  updateChannel = () => {
    navigator.updateChannel(null, {
      text: new Date().toISOString()
    });
  };

  removeChannel = () => {
    navigator.removeChannel();
  };

  getParams = () => {
    console.log(navigator.hasPreviousNavigation());
    console.log(navigator.mergeChannels());
    console.log(navigator.getChannel());
  };

  render() {
    return (
      <View>
        <Text>Setting</Text>
        <Button title="Get Params" onPress={this.getParams} />
        <Button title="Push Test" onPress={this.pushTest} />
        <Button title="Change Title" onPress={this.changeTitle} />
        <Button title="ReLaunch Test" onPress={this.reLaunch} />
        <Button title="Pop Test" onPress={this.pop} />
        <Button title="PopToTop Test" onPress={this.toTop} />
        <Button title="Update Channel Test" onPress={this.updateChannel} />
        <Button title="Remove Channel Test" onPress={this.removeChannel} />
      </View>
    );
  }
}
