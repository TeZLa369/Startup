import {
    Alert,
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
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { height, width } = Dimensions.get("window");

export default function FormScreen({ navigation }) {
    const [startupName, setStartupName] = useState("");
    const [tagline, setTagline] = useState("");
    const [description, setDescription] = useState("");




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
            Alert.alert("Saved", "Your idea is submitted", [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Ok",
                    onPress: () => { navigation.goBack() }
                },
            ])
        } catch (error) {
            console.error("Unable to save data: ", error);
        }
    }


    return (
        <LinearGradient
            colors={["#7B61FF", "#6A6CFF", "#3AA0FF"]}
            style={styles.container}
        >
            {/* //! HEADER */}
            <View style={styles.headingContainer}>
                <Text style={styles.headingTxt}>Submit your Startup Idea</Text>
                <Text style={styles.subHeading}>
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
                    <View style={styles.formContainer}>

                        <Text style={styles.formLabel}>Startup Name</Text>
                        <TextInput
                            onChangeText={(txt) => { setStartupName(txt) }}
                            value={startupName}
                            placeholder="name here..."
                            placeholderTextColor="#B8B8B8"
                            style={styles.input}
                        />

                        <Text style={styles.formLabel}>Tagline</Text>
                        <TextInput
                            onChangeText={(txt) => { setTagline(txt) }}
                            value={tagline}
                            placeholder="tagline here..."
                            placeholderTextColor="#B8B8B8"
                            style={styles.input}
                        />

                        <Text style={styles.formLabel}>Description</Text>
                        <TextInput
                            onChangeText={(txt) => { setDescription(txt) }}
                            value={description}
                            placeholder="write about your idea..."
                            placeholderTextColor="#B8B8B8"
                            multiline
                            textAlignVertical="top"
                            style={[styles.input, { height: 150 }]}
                        />

                        <View style={styles.btnContainer}>
                            {/* //!BACK BTN */}
                            <TouchableOpacity
                                activeOpacity={0.85} style={styles.backWrapper} onPress={() => { navigation.goBack() }}>
                                <LinearGradient
                                    colors={["#FF0F0FFF", "#FF5E5EFF"]}
                                    style={styles.btn}
                                >
                                    <Text style={styles.btnText}>Cancel</Text>
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


                                activeOpacity={0.85} style={styles.submitWrapper}>
                                <LinearGradient
                                    colors={["#7B61FF", "#3AA0FF"]}
                                    style={styles.btn}>

                                    <Text style={styles.btnText}>Submit</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient >
    );
}

const styles = StyleSheet.create({
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
