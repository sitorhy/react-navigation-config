import React from "react";
import { StyleSheet, View, TextInput, Text, Button } from "react-native";
import navigator from "../react-navigation-config/router";

const styles = StyleSheet.create({
  login: {
    padding: 10,
    flexDirection: "column",
    height: "100%",
    justifyContent: "center"
  },
  cell: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 5
  },
  label: {
    width: 90
  },
  input: {
    flexGrow: 1
  },
  inputText: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1
  },
  action: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center"
  },
  actionBtn: {
    marginLeft: 10,
    marginRight: 10
  }
});

export default class extends React.Component {
  state = {
    username: "",
    password: ""
  };

  onUserTextChange = () => {};

  onPasswordTextChange = () => {};

  toMain = () => {
    // react-navigation 3.x bug, redirect to home , but params store in 'main'
    //  navigator.navigateTo("main", { xyz: 100 });

    navigator.navigateTo("home", { xyz: 100 });
  };

  toCount = () => {
    navigator.navigateTo("count").then(() => {});
  };

  toRegister = () => {
    const { navigation } = this.props;
    navigation.navigate("register");
  };

  render() {
    return (
      <View style={styles.login}>
        <View style={styles.cell}>
          <View style={styles.label}>
            <Text>User:</Text>
          </View>
          <View style={styles.input}>
            <TextInput
              style={styles.inputText}
              onChangeText={this.onUserTextChange}
              value={this.state.username}
            />
          </View>
        </View>

        <View style={styles.cell}>
          <View style={styles.label}>
            <Text>Password:</Text>
          </View>
          <View style={styles.input}>
            <TextInput
              style={styles.inputText}
              onChangeText={this.onPasswordTextChange}
              value={this.state.password}
            />
          </View>
        </View>

        <View style={styles.action}>
          <View style={styles.actionBtn}>
            <Button title="Login" onPress={this.toMain} />
          </View>

          <View style={styles.actionBtn}>
            <Button title="Register" onPress={this.toRegister} />
          </View>

          <View style={styles.actionBtn}>
            <Button title="To Count" onPress={this.toCount} />
          </View>
        </View>
      </View>
    );
  }
}
