import React from "react";
import { View, Button } from "react-native";
import { MessageBox } from "../plugins";

export default class extends React.Component {
  showMessage = () => {
    MessageBox.doModal("苟利国家生死以", "岂因祸福避趋之", "MB_OK");
  };

  render() {
    return (
      <View>
        <View style={{ marginTop: 10, marginBottom: 10 }}>
          <Button title="MessageBox" onPress={this.showMessage} />
        </View>
      </View>
    );
  }
}
