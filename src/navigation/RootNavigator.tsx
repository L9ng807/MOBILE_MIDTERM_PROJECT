import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ECGMonitorScreen from '../screens/ECGMonitorScreen';
import InferenceScreen from '../screens/InferenceScreen';
import PerformanceScreen from '../screens/PerformanceScreen';
import SettingsScreen from '../screens/SettingsScreen';
import DeviceStackNavigator from './DeviceStackNavigator';

const Tab = createBottomTabNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Monitor" component={ECGMonitorScreen} />
        <Tab.Screen name="Inference" component={InferenceScreen} />
        <Tab.Screen name="Performance" component={PerformanceScreen} />
        <Tab.Screen name="Devices" component={DeviceStackNavigator} options={{ headerShown: false }} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}