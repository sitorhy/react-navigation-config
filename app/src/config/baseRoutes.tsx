import React from 'react';
import {View, Text} from 'react-native';

function Home() {
  return (
    <View>
      <Text>Home</Text>
    </View>
  );
}

function Setting() {
  return (
    <View>
      <Text>Setting</Text>
    </View>
  );
}

function About() {
  return (
    <View>
      <Text>About</Text>
    </View>
  );
}

export default {
  app: true,
  children: [
    {
      name: 'Home',
      component: Home,
    },
    {
      name: 'Setting',
      component: Setting,
    },
    {
      name: 'About',
      component: About,
    },
  ],
};
