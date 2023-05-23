import React from 'react';
import {View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

interface ReactNavigationRouteConfig {
  app?: boolean;
  name?: string;
  path?: string;
  routerConfig?: Record<any, any>;
  component?: () => React.JSX.Element;
  children?: ReactNavigationRouteConfig[];
}

function renderRouteNavigation(route: ReactNavigationRouteConfig) {
  if (Array.isArray(route.children)) {
    const Stack = createStackNavigator();
    return (
      <Stack.Navigator>
        {route.children
          .map(i => {
            if (!i.component) {
              return null;
            } else {
              return (
                <Stack.Screen
                  name={i.name || `anonymous-${Date.now()}`}
                  component={i.component}
                />
              );
            }
          })
          .filter(i => !!i)}
      </Stack.Navigator>
    );
  }
  return null;
}

export function renderNavigation(
  route: ReactNavigationRouteConfig,
): React.JSX.Element {
  const container = renderRouteNavigation(route);
  if (route.app) {
    return <NavigationContainer>{container}</NavigationContainer>;
  } else {
    return container ? container : <View>{container}</View>;
  }
}
