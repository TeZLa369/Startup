import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import TabNav from './navigation/TabNav';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (

    <NavigationContainer>
      <StatusBar style='light' />
      <TabNav />
    </NavigationContainer>

  );
}

