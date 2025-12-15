import { createStackNavigator } from "@react-navigation/stack";
import { Image } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import FormScreen from "../screens/FormScreen";

const Stack = createStackNavigator();

export default function ScreenNav() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="FormScreen" component={FormScreen} />



            {/* <Stack.Screen options={{
                // headerLeft: ()=>{ },
                headerStyle: { backgroundColor: "#FFFFFF00" },
                headerShown: true,
                headerTitle: "Hi",
            }} name="FormScreen" component={FormScreen} /> */}

        </Stack.Navigator>
    );
}
