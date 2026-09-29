import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DeviceProfileScreen from '../screens/device/DeviceProfileScreen';
import FPGAMonitorScreen from '../screens/device/FPGAMonitorScreen';
import FPGAProfileScreen from '../screens/device/FPGAProfileScreen';
import ResourceMonitorScreen from '../screens/device/ResourceMonitorScreen';
import DeviceConnectionScreen from '../screens/device/DeviceConnectionScreen';
import { colors } from '../theme';

const Stack = createNativeStackNavigator();

export default function DeviceStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerTitleAlign: 'center', headerStyle: { backgroundColor: colors.surface }, headerTintColor: colors.text, headerTitleStyle: { fontWeight: '700' }, contentStyle: { backgroundColor: colors.background } }}>
      <Stack.Screen name="DeviceProfileHome" component={FPGAMonitorScreen} options={{ title: 'FPGA Monitor' }} />
      <Stack.Screen name="FPGAProfile" component={FPGAProfileScreen} options={{ title: 'Deployment Status' }} />
      <Stack.Screen name="ResourceMonitor" component={ResourceMonitorScreen} options={{ title: 'Resource Monitor' }} />
      <Stack.Screen name="DeviceConnection" component={DeviceConnectionScreen} options={{ title: 'Device Connection' }} />
    </Stack.Navigator>
  );
}
