import React from "react";
import { Text, View, Button } from "react-native";

export default class extends React.Component {
  toRegister = () => {
    const { navigation } = this.props;
    navigation.navigate("Register");
  };

  toMain = () => {
    const { navigation } = this.props;
    navigation.navigate("App");
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>登录</Text>
        <Text>用户名：XXX</Text>
        <Text>密码：YYY</Text>
        <Button onPress={this.toRegister} title="没有账号？注册" />
        <Button onPress={this.toMain} title="去主页" />
      </View>
    );
  }
}
