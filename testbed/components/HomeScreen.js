import React from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  Button,
  TouchableOpacity
} from "react-native";

import imgTask from "../images/task.png";
import toDoList from "./todo.json";
import navigator from "../react-navigation-config/router";

const styles = StyleSheet.create({
  todo: {},
  listItem: {
    flexDirection: "row",
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 10,
    paddingRight: 10
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

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity>
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
          marginLeft: "14%"
        }}
      />
    );
  };

  getParamsTest = () => {
    console.log(this.props.navigation);
    console.log(navigator.getCurrentParams());
  };

  componentDidMount() {
    console.log(navigator.getParams());
    console.log(navigator.getCurrentParams());
  }

  render() {
    const { data } = this.state;

    return (
      <View style={styles.todo}>
        <Button title="Get Current Params" onPress={this.getParamsTest} />
        <FlatList
          data={data}
          renderItem={this.renderItem}
          ItemSeparatorComponent={this.renderSeparator}
        />
      </View>
    );
  }
}
