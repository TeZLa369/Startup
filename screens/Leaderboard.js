import { Dimensions, FlatList, StyleSheet, Text, View, Image } from 'react-native'
import React, { useCallback, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

const { height, width } = Dimensions.get("window");
const leaderboardData = [
  {
    id: "1",
    rank: 1,
    name: "NeuroSphere",
    description: "AI-driven cognitive enhancement platform",
    score: 9.8,
  },
  {
    id: "2",
    rank: 2,
    name: "EcoBuild",
    description: "Sustainable materials for future construction",
    score: 9.5,
  },
  {
    id: "3",
    rank: 3,
    name: "QuantFund",
    description: "Democratizing algorithmic trading",
    score: 9.2,
  },
  {
    id: "4",
    rank: 4,
    name: "HealthHive",
    description: "Smart healthcare monitoring ecosystem",
    score: 8.9,
  },
  {
    id: "5",
    rank: 5,
    name: "AgroSense",
    description: "AI-powered precision farming solutions",
    score: 8.7,
  },
  {
    id: "6",
    rank: 6,
    name: "EduSpark",
    description: "Personalized learning for students using AI",
    score: 8.5,
  },
  {
    id: "7",
    rank: 7,
    name: "FinTrackr",
    description: "Expense and investment tracking platform",
    score: 8.2,
  },
  {
    id: "8",
    rank: 8,
    name: "GreenGrid",
    description: "Decentralized renewable energy management",
    score: 8.0,
  },
  {
    id: "9",
    rank: 9,
    name: "MediLink",
    description: "Connecting patients with verified doctors instantly",
    score: 7.8,
  },
  {
    id: "10",
    rank: 10,
    name: "UrbanFlow",
    description: "Smart traffic and city mobility optimization",
    score: 7.5,
  },
];

const Leaderboard = () => {

  const [sort, setsort] = useState("vote");
  const [refreshing, setrefreshing] = useState(false);
  const [userData, setUserData] = useState([]);
  const [keys, setKeys] = useState([]);


  // ! LOAD Data
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

        const topFive = parsed.length > 5 ? parsed.slice(0, 5) : parsed;

        setUserData(topFive);

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


  async function handleRefresh() {
    setrefreshing(true);
    await loadData();
    // await clearAll();
    setrefreshing(false);
  }


  useFocusEffect(
    useCallback(() => {
      setrefreshing(true);
      loadData().then(() =>
        setrefreshing(false));
    }, [sort])
  );


  function imagePicker(index) {
    if (index === 0) {
      return require("../assets/1st.png")
    }
    else if (index === 1) {
      return require("../assets/2nd.png")
    }
    else if (index === 2) {
      return require("../assets/3rd.png")
    }
    else if (index === 3) {
      return require("../assets/4th.png")
    }
    else if (index === 4) {
      return require("../assets/5th.png")
    }
  }


  return (
    <LinearGradient
      colors={["#7B61FF", "#6A6CFF", "#3AA0FF"]}
      style={styles.container}>


      <Text style={styles.headingTxt}>Leaderboard</Text>
      <Text style={styles.subHeadingTxt}>Top 5 Ideas</Text>

      {/* //! SORT */}
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
        </Picker> </LinearGradient>


      {/* //! LIST */}
      <FlatList showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        data={userData}
        renderItem={({ item, index }) => (
          <LinearGradient style={styles.cardContainer}
            colors={["#ffffff", "#C1C1FFFF"]}>

            <Image source=
              {imagePicker(index)}
              style={styles.medalImg} />

            <View style={styles.listTxtContainer}>
              <Text style={styles.cardNameTxt}>{item.submitedName}</Text>
              <Text style={styles.cardtagline}>{item.submittedTagline}</Text>
              <Text style={styles.cardDescTxt}>{item.submittedDesc}</Text></View>
            <Text style={[styles.ratingVal,
            { backgroundColor: item.rating >= 50 ? "#32AE40FF" : "#AE3232FF" }]}>{item.
              rating}/100</Text>

          </LinearGradient>
        )}

        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTxt}>Nothing to display</Text>
          </View>
        )}
      />
    </LinearGradient>
  )
}

export default Leaderboard

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headingTxt: {
    marginTop: height * 0.06,
    textAlign: "center",
    fontSize: 34,
    color: "#ffffff",
    fontWeight: 700,
    marginBottom: 12
  },
  subHeadingTxt: {
    textAlign: "center",
    color: "#ffffff",
    fontSize: 18,
    fontWeight: 500
  },
  sortBtnContainer: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    width: 230,
    borderRadius: 30,
    marginTop: 12,
    borderColor: "#FFFFFF33",
    elevation: 10,
    marginBottom: 12
  },
  pickerStyle: {
    width: 130,
    color: "white",
  },
  sortTxt: {
    color: "#FFFFFFD9",
    fontSize: 16
  },

  cardContainer: {
    flexDirection: "row",
    marginBottom: 12,
    justifyContent: "space-evenly",
    height: 150,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 12,
    elevation: 8
  },
  medalImg: {
    height: 70,
    width: 70
  },
  listTxtContainer: {
    width: 180
  },
  ratingVal: {
    color: "#FFFFFF",
    textAlign: "center",
    padding: 9,
    borderRadius: 20,
    marginRight: 12
  },
  cardNameTxt: {
    fontSize: 18,
    fontWeight: 700
  },
  cardtagline: {
    fontWeight: 600
  },
  cardDescTxt: {
    marginTop: 12,
  },
  emptyContainer: {
    justifyContent: "center",
    marginTop: 12,
    height: height * .6,

  },
  emptyTxt: {
    textAlign: "center",
    color: "#FFFFFF72",
    fontStyle: "italic",
    fontSize: 30
  },
})