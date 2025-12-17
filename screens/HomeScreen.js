import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useCallback, useEffect, useState } from 'react'
import { Dimensions } from 'react-native'
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useToast } from 'react-native-toast-notifications';




const startupIdeas = [
    {
        id: '1',
        name: 'AetherAI',
        description: 'Generative design for sustainable cities.',
        aiRating: 94,
        upvotes: 1200,
        tagline: 'Design tomorrow’s cities, today.'
    },
    {
        id: '2',
        name: 'NeuroFlow',
        description: 'Personalized cognitive enhancement platform.',
        aiRating: 4.1,
        upvotes: 980,
        tagline: 'Unlock your mind’s full potential.'
    },
    {
        id: '3',
        name: 'BioSynth Foods',
        description: 'Lab-grown meat, accessible to all.',
        aiRating: 51,
        upvotes: 750,
        tagline: 'Future protein, made for everyone.'
    },
    {
        id: '4',
        name: 'EcoCharge',
        description: 'Portable solar chargers for urban commuters.',
        aiRating: 85,
        upvotes: 620,
        tagline: 'Power your journey with the sun.'
    },
    {
        id: '5',
        name: 'MindMesh',
        description: 'AI-powered mental health journaling assistant.',
        aiRating: 2.3,
        upvotes: 540,
        tagline: 'Your thoughts, guided by AI.'
    },
    {
        id: '6',
        name: 'SkillForge',
        description: 'Microlearning platform for emerging tech skills.',
        aiRating: 8.0,
        upvotes: 490,
        tagline: 'Forge skills, fast and future-ready.'
    },
];


const empty = [];


const { height, width } = Dimensions.get("window");


const HomeScreen = ({ navigation }) => {
    const toast = useToast();

    const [sort, setsort] = useState("vote");
    const [keys, setKeys] = useState([]);
    const [userData, setUserData] = useState([]);
    const [refreshing, setrefreshing] = useState(false);



    async function updateDetails(rating, name, tag, desc, vote) {
        const details = {
            rating: rating,
            submitedName: name,
            submittedTagline: tag,
            submittedDesc: desc,
            upVote: vote
        }

        try {
            await AsyncStorage.setItem(name, JSON.stringify(details));


        } catch (error) {
            console.error("Unable to save data: ", error);
        }


        await loadData();

    };


    // ! Load Data
    async function loadData() {
        try {
            const keys = await AsyncStorage.getAllKeys();
            setKeys(keys);
            userData.sort()

            if (keys.length > 0) {
                const data = await AsyncStorage.multiGet(keys);

                let parsed = parseData(data);

                if (sort === "rating") {
                    parsed = parsed.sort((a, b) => b.rating - a.rating);
                } else if (sort === "vote") {
                    parsed = parsed.sort((a, b) => (b.upVotes || 0) - (a.upVotes || 0));
                }
                setUserData(parsed);
            }
        } catch (error) {
            console.error("Error loading data", error);
        }
    }


    // ! PARSE Data
    function parseData(data) {
        try {
            const parsedIdeas = data.map(([key, value]) => {
                return JSON.parse(value);
            });
            return parsedIdeas;

        } catch (error) {
            console.error("Invalid JSON:", error);
            return null;
        }
    }


    // ! Clear all data
    async function clearAll() {
        try {
            AsyncStorage.clear();
        } catch (error) {
            console.error("Error in deleting data: ", error);
        }
    }

    useFocusEffect(
        useCallback(() => {
            setrefreshing(true);
            loadData().then(() =>
                setrefreshing(false));
        }, [sort])
    );


    async function handleRefresh() {
        setrefreshing(true);
        await loadData();
        // await clearAll();
        setrefreshing(false);
    }


    return (
        <View style={styles.container}>
            {/* //! HEADER */}
            <LinearGradient
                colors={["#7B61FF", "#6A6CFF", "#3AA0FF"]}
                style={styles.headerContainer}>

                {/* <View > */}
                <Text style={styles.headingTxt}>The Startup Idea Evaluator</Text>

                {/* //!SORT */}
                {/* <View style={styles.sortBtnContainer}> */}
                <LinearGradient style={styles.sortBtnContainer} colors={["#5F8BFF", "#78B2E7FF"]}>
                    <Text style={styles.sortTxt}>Sort by: </Text>
                    <Picker style={styles.pickerStyle}
                        selectedValue={sort}
                        onValueChange={(itemVal) => { setsort(itemVal) }}
                        dropdownIconColor={"#ffffff"}
                        mode='dropdown'
                        dropdownIconRippleColor={"#FFFFFF55"}
                    >
                        <Picker.Item label='Rating' value={"rating"} />
                        <Picker.Item label='Votes' value={"vote"} />
                    </Picker>
                </LinearGradient>
            </LinearGradient>


            <FlatList style={styles.flatlistStyle}
                data={userData}
                keyExtractor={(item) => item.submitedName}
                renderItem={({ item }) => (
                    <View style={styles.cardContainer}>

                        <View style={styles.cardSubContainer}>
                            <Text style={styles.name}>{item.submitedName}</Text>
                            <Text style={styles.name}>{item.submittedTagline}</Text>
                            <Text style={styles.description}>{item.submittedDesc}</Text>

                            {/* //! UPVOTE */}
                            <View style={styles.upvotesContainer}>
                                <TouchableOpacity
                                    onPress={async () => {
                                        if (item.upVote === 0) {
                                            toast.show("Upvoted!");
                                            updateDetails(item.rating, item.submitedName, item.submittedTagline, item.submittedDesc, 1)
                                        }
                                        else { toast.show("Already Upvoted!") }

                                    }}>
                                    <Ionicons style={styles.iconStyle} name={item.upVote === 0 ? 'thumbs-up-outline' : "thumbs-up"}
                                        color={item.upVote === 0 ? "#A69999FF" : "#EEFF00F0"} size={20} /></TouchableOpacity>
                                <Text style={styles.upvotes}>{item.upVote}{item.upVote <= 1 ? " Upvote" : " Upvotes"}</Text></View>
                        </View>

                        <View style={styles.ratingContainer}>
                            <Text style={styles.ratingTxt}>AI Rating</Text>
                            <Text style={[styles.ratingVal,
                            { backgroundColor: item.rating >= 50 ? "#32AE40FF" : "#AE3232FF" }]}>{item.rating}/100</Text></View>
                    </View>
                )
                }
                refreshing={refreshing}
                onRefresh={() => { handleRefresh() }}
                ListEmptyComponent={() => (
                    <View style={styles.emptyList} >
                        <Text style={styles.emptyTxt} >Submit an idea</Text>
                    </View>

                )}

            />
            < LinearGradient style={styles.floatingBtn} colors={["#4D6BFF", "#3AA0FF"]} >
                <TouchableOpacity onPress={() => { navigation.navigate("FormScreen") }}>
                    <Ionicons name='add' color={"#ffffff"} size={30} />
                </TouchableOpacity>
            </LinearGradient >
        </View >
    )
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0E0F12"
    },
    headerContainer: {
        height: .40 * height,
        borderBottomRightRadius: 50,
        borderBottomLeftRadius: 50,
        paddingLeft: 16
    },
    headingTxt: {
        color: "#FFFFFFFF",
        fontSize: 30,
        fontWeight: 700,
        flexWrap: "wrap",
        width: 200,
        marginTop: 70,
    },
    sortBtnContainer: {
        justifyContent: "center",
        flexDirection: "row",
        alignItems: "center",
        width: 230,
        borderRadius: 30,
        marginTop: 12,
        borderColor: "#FFFFFF33",
        elevation: 10
    },
    pickerStyle: {
        width: 130,
        color: "white",
    },
    sortTxt: {
        color: "#FFFFFFD9",
        fontSize: 16
    },
    flatlistStyle: {
        position: "absolute",
        top: height * .30,
        width: width,
        height: height * .60
    },
    emptyList: {
        flex: 1,
        height: height * .60,
        justifyContent: "center",

    },
    emptyTxt: {
        textAlign: "center",
        color: "#4C4C4CFF",
        fontStyle: "italic",
        fontSize: 30
    },
    cardContainer: {
        flexDirection: "row",
        margin: 12,
        padding: 12,
        backgroundColor: "#222",
        minHeight: 120,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
    },
    cardSubContainer: {
        flex: 1,
        flexDirection: "column"
    },
    ratingContainer: {
        flexDirection: "column",
        gap: 6
    },
    upvotesContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8
    },
    iconStyle: {
        marginTop: 12
    },
    name: {
        color: "#ffffff",
        fontWeight: 800,
        fontSize: 18
    },
    description: {
        color: "#FFFFFFB6",
        maxWidth: 150,
    },
    ratingTxt: {
        color: "#ffffff",

    },
    ratingVal: {
        color: "#FFFFFF",
        textAlign: "center",
        padding: 5,
        borderRadius: 20
    },
    upvotes: {
        color: "#FFFFFFB6",
        marginTop: 12
    },

    floatingBtn: {
        // backgroundColor: "red",
        width: 60,
        height: 60,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        bottom: 12,
        right: 12,
        elevation: 8
    },
})