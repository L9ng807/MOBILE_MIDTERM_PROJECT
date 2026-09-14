import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DeviceProfileScreen from '../screens/device/DeviceProfileScreen';
import SmartphoneProfileScreen from '../screens/device/SmartphoneProfileScreen';
import MCUProfileScreen from '../screens/device/MCUProfileScreen';
import FPGAProfileScreen from '../screens/device/FPGAProfileScreen';
import ResourceMonitorScreen from '../screens/device/ResourceMonitorScreen';
import DeviceConnectionScreen from '../screens/device/DeviceConnectionScreen';

const Stack = createNativeStackNavigator();

export default function DeviceStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
      <Stack.Screen name="DeviceProfileHome" component={DeviceProfileScreen} options={{ title: 'Device Profile' }} />
      <Stack.Screen name="SmartphoneProfile" component={SmartphoneProfileScreen} options={{ title: 'Smartphone Profile' }} />
      <Stack.Screen name="MCUProfile" component={MCUProfileScreen} options={{ title: 'MCU Profile' }} />
      <Stack.Screen name="FPGAProfile" component={FPGAProfileScreen} options={{ title: 'FPGA Profile' }} />
      <Stack.Screen name="ResourceMonitor" component={ResourceMonitorScreen} options={{ title: 'Resource Monitor' }} />
      <Stack.Screen name="DeviceConnection" component={DeviceConnectionScreen} options={{ title: 'Device Connection' }} />
    </Stack.Navigator>
  );
}
