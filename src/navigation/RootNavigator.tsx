import {
  Text,
} from 'react-native';

import {
  NavigationContainer,
} from '@react-navigation/native';

import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import DashboardScreen from '../screens/DashboardScreen';
import DevicesScreen from '../screens/DevicesScreen';
import InferenceScreen from '../screens/InferenceScreen';
import PerformanceScreen from '../screens/PerformanceScreen';
import SettingsScreen from '../screens/SettingsScreen';

import ECGStackNavigator from './ECGStackNavigator';

import {
  fs,
  s,
} from '../utils/responsive';

import type {
  RootTabParamList,
} from '../types/navigation';

const Tab =
  createBottomTabNavigator<RootTabParamList>();

function TabLabel({
  children,
  color,
}: {
  children: string;
  color: string;
}) {
  return (
    <Text
      numberOfLines={1}
      adjustsFontSizeToFit
      minimumFontScale={0.65}
      style={{
        color,
        fontSize: fs(11),
        fontWeight: '600',
        textAlign: 'center',
      }}
    >
      {children}
    </Text>
  );
}

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
          tabBarLabel: ({
            children,
            color,
          }) => (
            <TabLabel color={color}>
              {String(children)}
            </TabLabel>
          ),
          tabBarStyle: {
            minHeight: s(52),
            paddingTop: s(4),
          },
          headerTitleStyle: {
            fontSize: fs(17),
          },
          headerTitleAllowFontScaling: true,
        }}
      >
        <Tab.Screen
          name="Dashboard"
          component={
            DashboardScreen
          }
        />

        <Tab.Screen
          name="ECG"
          component={
            ECGStackNavigator
          }
          options={{
            headerShown: false,
          }}
        />

        <Tab.Screen
          name="Inference"
          component={
            InferenceScreen
          }
        />

        <Tab.Screen
          name="Performance"
          component={
            PerformanceScreen
          }
        />

        <Tab.Screen
          name="Devices"
          component={
            DevicesScreen
          }
          options={{
            title: 'Devices',
          }}
        />

        <Tab.Screen
          name="Settings"
          component={
            SettingsScreen
          }
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
