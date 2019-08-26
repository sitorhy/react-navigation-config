import React from "react";
import Router from "./router";
import { Platform } from "react-native";

const prefix = Platform.OS == "android" ? "mychat://" : "mychat://";

export default () => {
  return <Router uriPrefix={prefix} />;
};
