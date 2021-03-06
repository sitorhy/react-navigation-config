import React from "react";
import { StyleSheet, View, TextInput, Text, Button } from "react-native";
import router from "../react-navigation-config/router";

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
  static navigationOptions = ({ navigation }) => {
    const onPress = () => {
      const channel = router.getChannel();
      channel.handleHeaderRight();
    };
    const ChannelProvider = router.channelProvider(navigation);

    return {
      headerRight: (
        <ChannelProvider>
          {props => {
            const { showSaveBtn } = props;

            return showSaveBtn ? (
              <Button title={"Save"} onPress={onPress} />
            ) : null;
          }}
        </ChannelProvider>
      )
    };
  };

  // constructor(props) {
  //   super(props);
  //   router.updateChannel(null, {
  //     handleHeaderRight: () => {
  //       console.log(this.state);
  //     }
  //   });
  // }

  state = {
    username: "",
    password: "",
    confirm: ""
  };

  onUserTextChange = username => {
    this.setState({ username });
  };

  onPasswordTextChange = password => {
    this.setState({ password });
  };

  onConfirmPasswordTextChange = confirm => {
    this.setState({ confirm });
  };

  toggleHeaderButton = () => {
    const channel = router.getChannel();
    router.updateChannel(null, {
      handleHeaderRight: () => {
        console.log(this.state);
      },
      showSaveBtn: !channel.showSaveBtn
    });
  };

  toLogin = () => {
    const { navigation } = this.props;
    navigation.navigate("login");
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

        <View style={styles.cell}>
          <View style={styles.label}>
            <Text>Confirm:</Text>
          </View>
          <View style={styles.input}>
            <TextInput
              style={styles.inputText}
              onChangeText={this.onConfirmPasswordTextChange}
              value={this.state.confirm}
            />
          </View>
        </View>

        <View style={styles.action}>
          <View style={styles.actionBtn}>
            <Button title="Register" onPress={this.toLogin} />
          </View>
          <View style={styles.actionBtn}>
            <Button
              title="Toggle Header Button"
              onPress={this.toggleHeaderButton}
            />
          </View>
        </View>
      </View>
    );
  }
}
