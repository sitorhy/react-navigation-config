import React from "react";
import {
  StyleSheet,
  View,
  Text,
  SectionList,
  Image,
  TouchableOpacity
} from "react-native";
import navigator from "../router/navigator";

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
          },
          {
            key: "navigate",
            title: "Navigate Test"
          },
          {
            key: "toHome",
            title: "Switch To Home"
          },
          {
            key: "native",
            title: "Native Test"
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
      case "setting":
        {
          navigator.navigateTo("setting", { acb: 200 });
        }
        break;
      case "navigate":
        {
          navigator.navigateTo("count");
        }
        break;
      case "native":
        {
          navigator.navigateTo("native");
        }
        break;
      case "toHome":
        {
          navigator.navigateTo("start");
        }
        break;
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
