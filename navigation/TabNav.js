import HomeScreen from '../screens/HomeScreen';
import Leaderboard from '../screens/Leaderboard';
import { Ionicons } from '@expo/vector-icons';
import ScreenNav from './ScreenNav';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

const TabNav = () => {
    return (
        <Tab.Navigator
            tabBarPosition="bottom"
            initialRouteName="Home"
            screenOptions={({ route }) => ({
                swipeEnabled: true,
                headerShown: false,
                tabBarShowLabel: true,
                tabBarShowIcon: true,
                tabBarStyle: {
                    backgroundColor: "#222",
                    height: 70,
                },
                tabBarLabelStyle: {
                    color: "white",
                    fontSize: 12
                },
                tabBarIndicatorStyle: {
                    backgroundColor: "transparent",
                },

                tabBarIcon: ({ focused }) => {
                    let iconName;

                    if (route.name === "Home") {
                        iconName = "home";
                    } else if (route.name === "Leaderboard") {
                        iconName = "trophy";
                    }

                    return (
                        <Ionicons
                            name={iconName}
                            size={26}
                            color={focused ? "#ffffff" : "#aaaaaa"}
                        />
                    );
                },
            })}
        >
            <Tab.Screen name="Home" component={ScreenNav} />
            <Tab.Screen name="Leaderboard" component={Leaderboard} />
        </Tab.Navigator>
    );
};

export default TabNav;
