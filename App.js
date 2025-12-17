import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import TabNav from './navigation/TabNav';
import { NavigationContainer } from '@react-navigation/native';
import { ToastProvider } from 'react-native-toast-notifications';

export default function App() {
  return (
    <ToastProvider>
      <NavigationContainer>
        <StatusBar style='light' />
        <TabNav />
      </NavigationContainer>
    </ToastProvider>
  );
}

