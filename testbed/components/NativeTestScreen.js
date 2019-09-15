import React from "react";
import { View, Button, Text } from "react-native";
import { MessageBox, NativeToJS } from "../plugins";
import { NativeEventEmitter } from "react-native";

const nativeToJSEmitter = new NativeEventEmitter(NativeToJS);

export default class extends React.Component {
  state = {
    title: "",
    author: "",
    content: ""
  };

  showMessage = () => {
    MessageBox.doModal("苟利国家生死以", "岂因祸福避趋之", "MB_OK");
  };

  receiveMessage = () => {
    NativeToJS.receiveNotification();
  };

  componentDidMount() {
    this.subscription = nativeToJSEmitter.addListener("recite", (e) => {
      this.setState({ ...e });
    });
  }

  componentWillUnmount() {
    // When you want to stop listening to new events, simply call .remove() on the subscription
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }
  }

  render() {
    const { title, author, content } = this.state;

    return (
      <View>
        <View style={{ marginTop: 10, marginBottom: 10 }}>
          <Button title="MessageBox" onPress={this.showMessage} />
        </View>
        <View style={{ marginTop: 10, marginBottom: 10 }}>
          <Button
            title="Receive Native Message"
            onPress={this.receiveMessage}
          />
        </View>
        <View style={{ marginTop: 10, marginBottom: 10 }}>
          <Text>{title}</Text>
          <Text>{author}</Text>
          <Text>{content}</Text>
        </View>
      </View>
    );
  }
}
