import { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { ToastProvider } from 'react-native-toast-notifications';
import TabNav from './navigation/TabNav';
import { SafeAreaView } from 'react-native-safe-area-context';

export const ThemeContext = createContext();

export default function App() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    async function loadTheme() {
      const savedTheme = await AsyncStorage.getItem("appTheme");
      if (savedTheme) setTheme(savedTheme);
    }
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    await AsyncStorage.setItem("appTheme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>

      <ToastProvider>
        <NavigationContainer>
          <StatusBar style={theme === "dark" ? "light" : "dark"} />
          <TabNav />
        </NavigationContainer>
      </ToastProvider>

    </ThemeContext.Provider>
  );
}
