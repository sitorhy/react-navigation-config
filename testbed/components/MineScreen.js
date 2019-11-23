import React from "react";
import {
  StyleSheet,
  View,
  Text,
  SectionList,
  Image,
  TouchableOpacity
} from "react-native";

import navigator from "../react-navigation-config/router";

import imgAvatar from "../images/avatar.png";
import { SafeAreaView } from "react-navigation";

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
    backgroundColor: "#eeeeee",
    height: "100%"
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
          },
          {
            key: "params",
            title: "Get Current Params"
          },
          {
            key: "back",
            title: "Go Back Test"
          },
          {
            key: "drawer",
            title: "DrawerContainer Test"
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
          navigator.navigateTo("setting", {
            params: { acb: 200 }
          });
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
      case "params":
        {
          console.log(navigator.hasPreviousNavigation());
          console.log(this.props);
          console.log(this.props.navigation);
          console.log(navigator.getActiveKey());
          console.log(navigator.getParams());
        }
        break;
      case "back":
        {
          navigator.navigateBack().then(() => {
            console.log(this.props.navigation);
          });
        }
        break;
      case "drawer":
        {
          this.props.navigation.navigate({
            routeName: "drawer"
          });
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
      <View style={{ backgroundColor: "#a6cdff", flex: 1 }}>
        <SafeAreaView>
          <View style={styles.mine}>
            <View style={styles.header}>
              <Image style={{ width: 128, height: 128 }} source={imgAvatar} />
            </View>
            <SectionList renderItem={this.renderItem} sections={sections} />
          </View>
        </SafeAreaView>
      </View>
    );
  }
}
