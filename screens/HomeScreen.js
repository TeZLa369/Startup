import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useState } from 'react'
import { Dimensions } from 'react-native'
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from "@expo/vector-icons"



const startupIdeas = [
    {
        id: '1',
        name: 'AetherAI',
        description: 'Generative design for sustainable cities.',
        aiRating: 94,
        upvotes: 1200,
    },
    {
        id: '2',
        name: 'NeuroFlow',
        description: 'Personalized cognitive enhancement platform.',
        aiRating: 4.1,
        upvotes: 980,
    },
    {
        id: '3',
        name: 'BioSynth Foods',
        description: 'Lab-grown meat, accessible to all.',
        aiRating: 51,
        upvotes: 750,
    },
    {
        id: '4',
        name: 'EcoCharge',
        description: 'Portable solar chargers for urban commuters.',
        aiRating: 85,
        upvotes: 620,
    },
    {
        id: '5',
        name: 'MindMesh',
        description: 'AI-powered mental health journaling assistant.',
        aiRating: 2.3,
        upvotes: 540,
    },
    {
        id: '6',
        name: 'SkillForge',
        description: 'Microlearning platform for emerging tech skills.',
        aiRating: 8.0,
        upvotes: 490,
    },
];
const empty = [];

const { height, width } = Dimensions.get("window");
const HomeScreen = ({ navigation }) => {
    const [sort, setsort] = useState("vote");


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
                data={startupIdeas}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.cardContainer}>

                        <View style={styles.cardSubContainer}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.description}>{item.description}</Text>
                            <View style={styles.upvotesContainer}>
                                <Ionicons style={styles.iconStyle} name='thumbs-up-outline' color={"#A69999FF"} size={20} />
                                <Text style={styles.upvotes}>{item.upvotes} Upvotes</Text></View>
                        </View>

                        <View style={styles.ratingContainer}>
                            <Text style={styles.ratingTxt}>AI Rating</Text>
                            <Text style={[styles.ratingVal,
                            { backgroundColor: item.aiRating >= 50 ? "#32AE40FF" : "#AE3232FF" }]}>{item.aiRating}/100</Text></View>

                    </View>
                )}
                refreshing={false}
                onRefresh={() => { }}
                ListEmptyComponent={() => (
                    <View style={styles.emptyList} >
                        <Text style={styles.emptyTxt} >Submit an idea</Text>
                    </View>

                )}

            />
            <LinearGradient style={styles.floatingBtn} colors={["#4D6BFF", "#3AA0FF"]}>
                <TouchableOpacity onPress={() => { navigation.navigate("FormScreen") }}>
                    <Ionicons name='add' color={"#ffffff"} size={30} />
                </TouchableOpacity>
            </LinearGradient>
        </View>
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