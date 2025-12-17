import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import Listing from '../screens/Listing';
import Leaderboard from '../screens/Leaderboard';
import { Ionicons } from '@expo/vector-icons';
import ScreenNav from './ScreenNav';

const Tab = createBottomTabNavigator();

const TabNav = () => {
    return (
        <Tab.Navigator
            initialRouteName="ScreenNav"
            screenOptions={({ route }) => ({
                tabBarIcon: () => {

                    let iconSource;
                    if (route.name === "ScreenNav") {
                        iconSource = "home"
                    }

                    else if (route.name === "Listing") {
                        iconSource = "document-text"
                    }

                    else if (route.name === "Leaderboard") {
                        iconSource = "trophy"
                    }
                    return (
                        <Ionicons color={"#ffffff"} name={iconSource} size={28} />
                    )
                },
                tabBarShowLabel: true,
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: "#222",
                },
                animation: 'shift'
            })}
        >

            <Tab.Screen name="ScreenNav" component={ScreenNav} />
            {/* <Tab.Screen name="Listing" component={Listing} /> */}
            <Tab.Screen name="Leaderboard" component={Leaderboard} />
        </Tab.Navigator>
    )
}

export default TabNav;