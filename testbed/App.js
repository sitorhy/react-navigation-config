import React from "react";
import Router from "./router";
import { Platform } from "react-native";

import router from "./react-navigation-config/router";

router.beforeBackward((action, to, from)=>{
  console.log(action,to,from);
});

const prefix = Platform.OS == "android" ? "mychat://" : "mychat://";

export default () => {
  return <Router uriPrefix={prefix} />;
};
