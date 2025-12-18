import {
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToast } from 'react-native-toast-notifications';
import { ThemeContext } from '../context/ThemeContext';


const { height, width } = Dimensions.get("window");

export default function FormScreen({ navigation }) {
    const toast = useToast();
    const [startupName, setStartupName] = useState("");
    const [tagline, setTagline] = useState("");
    const [description, setDescription] = useState("");


    const { theme, themeToggle } = useContext(ThemeContext);

    const details = {
        rating: Math.floor(Math.random() * 101),
        submitedName: "",
        submittedTagline: "",
        submittedDesc: "",
        upVote: 0
    };


    function objData() {
        details.submitedName = startupName,
            details.submittedTagline = tagline,
            details.submittedDesc = description
    }

    // ! SAVE
    async function saveData() {
        objData();

        try {
            await AsyncStorage.setItem(startupName, JSON.stringify(details));

            toast.show("Your idea is submitted!", {
                type: "success"
            })

            navigation.goBack()
        } catch (error) {
            console.error("Unable to save data: ", error);
        }
    }


    const ST = theme === "light" ? stylesLight : stylesDark;

    return (
        <LinearGradient
            colors={theme === "light" ? ["#7B61FF", "#6A6CFF", "#3AA0FF"] :
                ["#4A3B9EFF", "#2E338CFF", "#1B1F4DFF"]

            }
            style={ST.container}
        >
            {/* //! HEADER */}
            <View style={ST.headingContainer}>
                <Text style={ST.headingTxt}>Submit your Startup Idea</Text>
                <Text style={ST.subHeading}>
                    Share your idea and let others evaluate it.
                </Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={{ paddingBottom: 60 }}
                    showsVerticalScrollIndicator={false}
                >
                    {/*//! FORM CARD */}
                    <View style={ST.formContainer}>

                        <Text style={ST.formLabel}>Startup Name</Text>
                        <TextInput
                            onChangeText={(txt) => { setStartupName(txt) }}
                            value={startupName}
                            placeholder="name here..."
                            placeholderTextColor="#B8B8B8"
                            style={ST.input}
                        />

                        <Text style={ST.formLabel}>Tagline</Text>
                        <TextInput
                            onChangeText={(txt) => { setTagline(txt) }}
                            value={tagline}
                            placeholder="tagline here..."
                            placeholderTextColor="#B8B8B8"
                            style={ST.input}
                        />

                        <Text style={ST.formLabel}>Description</Text>
                        <TextInput
                            onChangeText={(txt) => { setDescription(txt) }}
                            value={description}
                            placeholder="write about your idea..."
                            placeholderTextColor="#B8B8B8"
                            multiline
                            textAlignVertical="top"
                            style={[ST.input, { height: 150 }]}
                        />

                        <View style={ST.btnContainer}>
                            {/* //!BACK BTN */}
                            <TouchableOpacity
                                activeOpacity={0.85} style={ST.backWrapper} onPress={() => {
                                    navigation.goBack();
                                    toast.show("Idea submission cancelled!", {
                                        type: "warning"
                                    })
                                }}>
                                <LinearGradient
                                    colors={["#FF0F0FFF", "#FF5E5EFF"]}
                                    style={ST.btn}
                                >
                                    <Text style={ST.btnText}>Cancel</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            {/*//! SUBMIT BTN */}
                            <TouchableOpacity
                                onPress={() => {
                                    if (tagline === "" && startupName === "" && description === "") {
                                        alert("Please enter the details!");
                                    }
                                    else if (tagline === "") {
                                        alert("Please enter the tagline!");
                                    } else if (startupName === "") {
                                        alert("Please enter the startup name!");
                                    }
                                    else if (description === "") {
                                        alert("Please enter the description!");
                                    } else {
                                        // objData();
                                        saveData();
                                    }
                                }}


                                activeOpacity={0.85} style={ST.submitWrapper}>
                                <LinearGradient
                                    colors={["#7B61FF", "#3AA0FF"]}
                                    style={ST.btn}>

                                    <Text style={ST.btnText}>Submit</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient >
    );
}



const stylesDark = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: "#0E0F12",
    },

    headingContainer: {
        marginTop: height * 0.07,
        alignItems: "center",
        paddingHorizontal: 10,
    },

    headingTxt: {
        fontSize: 30,
        fontWeight: "700",
        color: "#FFFFFF",
        textAlign: "center",
        marginBottom: 6,
        width: width * 0.85,
    },

    subHeading: {
        fontSize: 14,
        color: "#CCCCCC",
        textAlign: "center",
        width: width * 0.8,
    },

    //! FORM CARD
    formContainer: {
        backgroundColor: "#1A1B21",
        borderRadius: 26,
        padding: 20,
        marginTop: 30,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
        borderWidth: 1,
        borderColor: "#2A2B31",
    },

    formLabel: {
        fontSize: 18,
        fontWeight: "600",
        color: "#FFFFFF",
        marginBottom: 6,
    },

    input: {
        backgroundColor: "#202229",
        fontSize: 16,
        padding: 14,
        borderRadius: 12,
        marginBottom: 18,
        borderWidth: 1,
        borderColor: "#2E2F36",
        color: "#FFFFFF",
    },

    //! BUTTONS
    btnContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
    },

    submitWrapper: {
        alignItems: "center",
        marginTop: 10,
        gap: 6,
    },

    backWrapper: {
        alignItems: "center",
        marginTop: 10,
    },

    btn: {
        width: 120,
        paddingVertical: 14,
        borderRadius: 18,
        alignItems: "center",
        shadowColor: "#3AA0FF",
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 6,
    },

    btnText: {
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: "700",
    },
});


const stylesLight = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },

    headingContainer: {
        marginTop: height * 0.07,
        alignItems: "center",
        paddingHorizontal: 10,
    },

    headingTxt: {
        fontSize: 30,
        fontWeight: "700",
        color: "#FFFFFF",
        textAlign: "center",
        marginBottom: 6,
        width: width * 0.85,
    },

    subHeading: {
        fontSize: 14,
        color: "#F0EFFFCC",
        textAlign: "center",
        width: width * 0.8,
    },

    formContainer: {
        backgroundColor: "#FFFFFF",
        borderRadius: 26,
        padding: 20,
        marginTop: 30,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 5,
    },

    formLabel: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1C1F26",
        marginBottom: 6,
    },

    input: {
        backgroundColor: "#F6F7FB",
        fontSize: 16,
        padding: 14,
        borderRadius: 12,
        marginBottom: 18,
        borderWidth: 1,
        borderColor: "#ECECEC",
    },
    btnContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",


    },
    submitWrapper: {
        alignItems: "center",
        marginTop: 10,
        gap: 6
    },
    backWrapper: {
        alignItems: "center",
        marginTop: 10,
    },

    btn: {
        width: 120,
        paddingVertical: 14,
        borderRadius: 18,
        alignItems: "center",
        shadowColor: "#3AA0FF",
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 6,
    },

    btnText: {
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: "700",
    },
});
