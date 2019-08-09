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
    backgroundColor: "#a6cdff"
  },
  section: {
    flex: 1,
    padding: 16,
    alignItems: "flex-start",
    textAlign: "left",
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1
  },
  mine: {
    backgroundColor: "#eeeeee"
  }
});

export default class extends React.Component {
  state = {
    sections: [
      {
        key: "session",
        data: [
          {
            key: "login",
            title: "Login"
          },
          {
            key: "setting",
            title: "Setting"
          }
        ]
      }
    ]
  };

  onCellAction = item => {
    switch (item.key) {
      case "login":
        {
          const { navigation } = this.props;
          navigation.navigate("start");
        }
        break;
      case "setting": {
        const { navigation } = this.props;
        navigation.navigate("setting");
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
      <View style={styles.mine}>
        <View style={styles.header}>
          <Image style={{ width: 128, height: 128 }} source={imgAvatar} />
        </View>
        <SectionList renderItem={this.renderItem} sections={sections} />
      </View>
    );
  }
}