import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useCallback, useContext, useState } from 'react';
import { Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useToast } from 'react-native-toast-notifications';
import { ThemeContext } from '../App';


const { height, width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
    const toast = useToast();
    const { theme, toggleTheme } = useContext(ThemeContext);

    const [sort, setsort] = useState('vote');
    const [userData, setUserData] = useState([]);
    const [refreshing, setrefreshing] = useState(false);
    const [expandedIndex, setExpandedIndex] = useState(null);


    async function updateDetails(rating, name, tag, desc, vote) {
        const details = {
            rating,
            submitedName: name,
            submittedTagline: tag,
            submittedDesc: desc,
            upVote: vote
        };

        try {
            await AsyncStorage.setItem(name, JSON.stringify(details));
        } catch (error) {
            console.error('Unable to save data: ', error);
        }

        await loadData();
    }

    // ! LOAD 
    async function loadData() {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const filteredKeys = keys.filter(k => k !== 'appTheme');

            if (filteredKeys.length === 0) {
                setUserData([]);
                return;
            }

            if (filteredKeys.length > 0) {
                const data = await AsyncStorage.multiGet(filteredKeys);
                let parsed = parseData(data);

                if (sort === 'rating') {
                    parsed = parsed.sort((a, b) => b.rating - a.rating);
                } else {
                    parsed = parsed.sort((a, b) => (b.upVote || 0) - (a.upVote || 0));
                }

                setUserData(parsed);
            }
        } catch (error) {
            console.error('Error loading data', error);
        }
    }

    function parseData(data) {
        try {
            return data.map(([key, value]) => JSON.parse(value));
        } catch (error) {
            console.error('Invalid JSON:', error);
            return [];
        }
    }

    // ! DELETE
    async function deleteData(key) {
        try {
            await AsyncStorage.removeItem(key);
            toast.show("Idea has been deleted!", { type: "warning" });

            await loadData();
        } catch (error) {
            console.error("Unable to delete: ", error);
        }

    }


    useFocusEffect(
        useCallback(() => {
            setrefreshing(true);
            loadData().then(() => setrefreshing(false));
        }, [sort])
    );

    async function handleRefresh() {
        setrefreshing(true);
        await loadData();
        setrefreshing(false);
    }

    const ST = theme === 'light' ? stylesLight : stylesDark;

    return (
        <View style={ST.container}>

            <LinearGradient
                colors={['#7B61FF', '#6A6CFF', '#3AA0FF']}
                style={ST.headerContainer}
            >
                <View style={ST.headRow}>
                    <Text style={ST.headingTxt}>The Startup Idea Evaluator</Text>

                    <TouchableOpacity style={ST.themeBtn} onPress={toggleTheme}>
                        <Ionicons
                            name={theme === 'light' ? 'moon' : 'sunny'}
                            size={28}
                            color={theme === 'light' ? 'black' : 'white'}
                        />
                    </TouchableOpacity>
                </View>

                {/* //! SORT */}
                <LinearGradient
                    style={ST.sortBtnContainer}
                    colors={theme === "light" ? ["#5F8BFF", "#78B2E7FF"]
                        : ["#3A3F66", "#2A2D4F"]
                    }
                >
                    <Text style={ST.sortTxt}>Sort by:</Text>

                    <Picker
                        style={ST.pickerStyle}
                        selectedValue={sort}
                        onValueChange={value => setsort(value)}
                        dropdownIconColor={'#ffffff'}
                        mode="dropdown"
                    >
                        <Picker.Item label="Rating" value="rating" />
                        <Picker.Item label="Votes" value="vote" />
                    </Picker>
                </LinearGradient>
            </LinearGradient>

            {/* //! LIST */}
            <FlatList
                style={ST.flatlistStyle}
                data={userData}
                keyExtractor={item => item.submitedName}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                ListEmptyComponent={() => (
                    <View style={ST.emptyList}>
                        <Text style={ST.emptyTxt}>Submit an idea</Text>
                    </View>
                )}
                renderItem={({ item, index }) => (
                    <LinearGradient style={ST.cardContainer} colors={theme === "light" ? ["rgba(255, 255, 255, 0.85)", "rgba(233, 236, 255, 0.85)"]
                        : ["rgba(30, 22, 40, 0.85)", "rgba(50, 36, 69, 0.85)"]}>
                        {/* <View style={ST.cardContainer}> */}


                        <View style={ST.cardSubContainer}>
                            <Text style={ST.name}>{item.submitedName}</Text>
                            <Text style={ST.tagline}>{item.submittedTagline}</Text>

                            <Text style={ST.description}>
                                {expandedIndex === index ? item.submittedDesc :
                                    item.submittedDesc.slice(0, 50)} </Text>

                            {item.submittedDesc.length > 50 ?
                                <Text style={[ST.description, { color: "#0000EE" }]}
                                    onPress={() => {
                                        setExpandedIndex(expandedIndex === index ? null : index)
                                    }}> {expandedIndex === index ? "Read less..." : "Read more..."}
                                </Text> : null}


                            {/* //! UPVOTE */}
                            <View style={ST.upvotesContainer}>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (item.upVote === 0) {
                                            toast.show('Upvoted!');
                                            updateDetails(
                                                item.rating,
                                                item.submitedName,
                                                item.submittedTagline,
                                                item.submittedDesc,
                                                1
                                            );
                                        } else {
                                            toast.show('Already Upvoted!');
                                        }
                                    }}
                                >
                                    <Ionicons
                                        name={
                                            item.upVote === 0
                                                ? 'thumbs-up-outline'
                                                : 'thumbs-up'
                                        }
                                        size={22}
                                        color={item.upVote === 0
                                            ? '#A69999FF' : theme === "light" ? "#F4B400" : '#FFEA4D'
                                        }
                                        style={ST.iconStyle}
                                    />
                                </TouchableOpacity>

                                <Text style={ST.upvotes}>
                                    {item.upVote}
                                    {item.upVote <= 1 ? ' Upvote' : ' Upvotes'}
                                </Text>
                            </View>
                        </View>

                        <View style={ST.ratingContainer}>
                            <Text style={ST.ratingTxt}>AI Rating</Text>

                            <Text
                                style={[
                                    ST.ratingVal,
                                    {
                                        backgroundColor:
                                            item.rating >= 50
                                                ? '#32AE40FF'
                                                : '#AE3232FF'
                                    }
                                ]}
                            >
                                {item.rating}/100
                            </Text>
                            <TouchableOpacity onPress={() => {
                                deleteData(item.submitedName)
                                // console.log(item.submitedName)
                            }}>
                                <Ionicons style={{ marginTop: 6 }} name='trash' size={28} color={theme === "light" ? "#8A8A8AFF" : "#ffffff"} />
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>

                )
                }
            />

            {/* //! FLOATING BTN */}
            <LinearGradient
                style={ST.floatingBtn}
                colors={['#4D6BFF', '#3AA0FF']}
            >
                <TouchableOpacity
                    onPress={() => navigation.navigate('FormScreen')}
                >
                    <Ionicons name="add" color={'#ffffff'} size={30} />
                </TouchableOpacity>
            </LinearGradient>
        </View >
    );
};

export default HomeScreen;

const stylesLight = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F8FA'
    },

    headerContainer: {
        height: height * 0.40,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        paddingLeft: 16,
        paddingRight: 16
    },

    headRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    themeBtn: {
        marginTop: 30
    },

    headingTxt: {
        color: '#FFFFFF',
        fontSize: 30,
        fontWeight: '700',
        width: 220,
        marginTop: 70
    },

    sortBtnContainer: {
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        width: 230,
        borderRadius: 30,
        marginTop: 12,
        elevation: 6
    },

    sortTxt: {
        color: '#FFFFFF',
        fontSize: 16
    },

    pickerStyle: {
        width: 130,
        color: '#FFFFFF'
    },

    flatlistStyle: {
        position: 'absolute',
        top: height * 0.30,
        width: width,
        height: height * 0.60
    },

    emptyList: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
        height: height * .6
    },

    emptyTxt: {
        color: '#77777776',
        textAlign: 'center',
        fontSize: 28,
        fontStyle: 'italic'
    },

    cardContainer: {
        flexDirection: 'row',
        margin: 12,
        padding: 12,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#E6E6E6',
        elevation: 5
    },

    cardSubContainer: {
        flex: 1
    },

    name: {
        color: '#111111',
        fontSize: 18,
        fontWeight: '700'
    },

    tagline: {
        color: '#444444',
        fontWeight: '600'
    },

    description: {
        color: '#555',
        marginTop: 6,
        maxWidth: 220
    },

    upvotesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6
    },

    upvotes: {
        color: '#666'
    },

    iconStyle: {
        marginRight: 6
    },

    ratingContainer: {
        alignItems: 'center',
        gap: 6
    },

    ratingTxt: {
        color: '#222'
    },

    ratingVal: {
        color: '#FFFFFF',
        padding: 6,
        borderRadius: 20,
        minWidth: 60,
        textAlign: 'center'
    },

    floatingBtn: {
        width: 60,
        height: 60,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 12,
        right: 12,
        elevation: 8
    }
});


const stylesDark = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0E0F12'
    },

    headerContainer: {
        height: height * 0.40,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        paddingLeft: 16,
        paddingRight: 16
    },

    headRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    themeBtn: {
        marginTop: 30
    },

    headingTxt: {
        color: '#FFFFFF',
        fontSize: 30,
        fontWeight: '700',
        width: 220,
        marginTop: 70
    },

    sortBtnContainer: {
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        width: 230,
        borderRadius: 30,
        marginTop: 12,
        backgroundColor: '#ffffff33',
        elevation: 12
    },

    sortTxt: {
        color: '#FFFFFF',
        fontSize: 16
    },

    pickerStyle: {
        width: 130,
        color: '#FFFFFF'
    },

    flatlistStyle: {
        position: 'absolute',
        top: height * 0.30,
        width: width,
        height: height * 0.60
    },

    emptyList: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
        height: height * .6
    },

    emptyTxt: {
        color: '#555',
        textAlign: 'center',
        fontSize: 28,
        fontStyle: 'italic'
    },

    cardContainer: {
        flexDirection: 'row',
        margin: 12,
        padding: 12,
        // minHeight: 120,
        borderRadius: 18
    },

    cardSubContainer: {
        flex: 1
    },

    name: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700'
    },

    tagline: {
        color: '#cccccc',
        fontWeight: '600'
    },

    description: {
        color: '#BBBBBB',
        marginTop: 6,
        maxWidth: 220
    },

    upvotesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6
    },

    upvotes: {
        color: '#CCCCCC'
    },

    iconStyle: {
        marginRight: 6
    },

    ratingContainer: {
        alignItems: 'center',
        gap: 6
    },

    ratingTxt: {
        color: '#FFFFFF'
    },

    ratingVal: {
        color: '#FFFFFF',
        padding: 6,
        borderRadius: 20,
        minWidth: 60,
        textAlign: 'center'
    },

    floatingBtn: {
        width: 60,
        height: 60,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 12,
        right: 12,
        elevation: 8
    }
});
