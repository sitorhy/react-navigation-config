import React from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity
} from "react-native";

import imgTask from "../images/task.png";
import toDoList from "./todo.json";
import navigator from "../react-navigation-config/router";
import { SafeAreaView } from "react-navigation";

const styles = StyleSheet.create({
  todo: {},
  listItem: {
    flexDirection: "row",
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "white"
  },
  itemLeft: {
    width: 48,
    alignItems: "center",
    justifyContent: "space-between"
  },
  itemRight: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row"
  },
  iconTask: {
    width: 32,
    height: 32
  }
});

export default class extends React.Component {
  state = {
    data: toDoList
  };

  test = () => {
    // console.log(this);
    console.log(navigator.getStore().getState());
  };

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={this.test}>
        <View key={item.key} style={styles.listItem}>
          <View style={styles.itemLeft}>
            <Image style={styles.iconTask} source={imgTask} />
          </View>
          <View style={styles.itemRight}>
            <Text>{item.title}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "86%",
          borderBottomWidth: 1,
          borderBottomColor: "lightgrey",
          marginLeft: "14%",
          backgroundColor: "white"
        }}
      />
    );
  };

  componentDidMount() {
    console.log(navigator.getParams());
    console.log(navigator.getChannel());
    console.log(this.props);
  }

  render() {
    const { data } = this.state;

    return (
      <View style={{ backgroundColor: "white", flex: 1 }}>
        <SafeAreaView>
          <View style={styles.todo}>
            <FlatList
              data={data}
              renderItem={this.renderItem}
              ItemSeparatorComponent={this.renderSeparator}
            />
          </View>
        </SafeAreaView>
      </View>
    );
  }
}
