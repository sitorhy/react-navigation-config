import React from "react";
import {
  StyleSheet,
  View,
  Text,
  SectionList,
  Image,
  TouchableOpacity
} from "react-native";

import imgAvatar from "../images/avatar.png";

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "grey"
  },
  section: {
    flex: 1,
    padding: 16,
    alignItems: "flex-start",
    textAlign: "left",
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1
  }
});

export default class extends React.Component {
  state = {
    sections: [
      {
        key: "session",
        data: [
          {
            title: "Login",
            action: "login"
          }
        ]
      }
    ]
  };

  onCellAction = item => {
    switch (item.action) {
      case "login": {
      }
    }
  };

  renderItem = item => {
    const {
      index,
      section: { data }
    } = item;
    return (
      <TouchableOpacity onPress={() => this.onCellAction(data[index])}>
        <View style={styles.section}>
          <Text>{data[index].title}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { sections } = this.state;

    return (
      <View>
        <View style={styles.header}>
          <Image style={{ width: 128, height: 128 }} source={imgAvatar} />
        </View>
        <SectionList renderItem={this.renderItem} sections={sections} />
      </View>
    );
  }
}
