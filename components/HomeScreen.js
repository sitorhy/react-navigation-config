import React from "react";
import { Text, View, Button } from "react-native";

export default class extends React.Component {
  toMine = () => {
    const { navigation } = this.props;
    navigation.navigate("Mine");
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>自由平等公正法治</Text>
        <Button onPress={this.toMine} title="切换到右边→" />
      </View>
    );
  }
}
