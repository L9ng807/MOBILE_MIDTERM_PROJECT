import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import DashboardScreen from '../screens/DashboardScreen';
import ECGMonitorScreen from '../screens/ECGMonitorScreen';
import InferenceScreen from '../screens/InferenceScreen';
import PerformanceScreen from '../screens/PerformanceScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Dashboard">
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Monitor" component={ECGMonitorScreen} />
        <Tab.Screen name="Inference" component={InferenceScreen} />
        <Tab.Screen name="Performance" component={PerformanceScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}