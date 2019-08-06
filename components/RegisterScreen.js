import React from "react";
import { Text, View, Button } from "react-native";

export default class extends React.Component {
  toLogin = () => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>登录</Text>
        <Text>手机号：XXX</Text>
        <Text>密码：YYY</Text>
        <Text>确认密码：YYY</Text>
        <Button onPress={this.toLogin} title="返回登录" />
      </View>
    );
  }
}
