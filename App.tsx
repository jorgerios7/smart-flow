import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/screens/auth/Login';
import Register from './src/screens/auth/Register';
import ForgotPassword from './src/screens/auth/ForgotPassword';
import Home from './src/screens/home';
import JoinWallet from './src/screens/wallet-access/JoinWallet';
import CreateWallet from './src/screens/wallet-access/CreateWallet';
import { useThemeMode } from './src/hooks/useThemeMode';
import { CustomToast } from './src/components/CustomToast';

const Stack = createNativeStackNavigator();

export default function App() {
  const { mode } = useThemeMode();

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
            animation: 'fade'
          }}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="JoinWallet" component={JoinWallet} />
          <Stack.Screen name="CreateWallet" component={CreateWallet} />
        </Stack.Navigator>
        <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
        <CustomToast />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
