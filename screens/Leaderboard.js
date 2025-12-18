import { Dimensions, FlatList, StyleSheet, Text, View, Image } from 'react-native'
import React, { useCallback, useContext, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { ThemeContext } from '../context/ThemeContext';

const { height, width } = Dimensions.get("window");


const Leaderboard = () => {

  const [sort, setsort] = useState("vote");
  const [refreshing, setrefreshing] = useState(false);
  const [userData, setUserData] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);



  const { theme, toggleTheme } = useContext(ThemeContext);

  const ST = theme === "light" ? stylesLight : stylesDark;

  // ! LOAD Data
  async function loadData() {
    try {
      const keys = await AsyncStorage.getAllKeys();

      const filtedKeys = keys.filter(key => key !== "appTheme");
      userData.sort()

      if (keys.length > 0) {
        const data = await AsyncStorage.multiGet(filtedKeys);

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
      colors={theme === "light" ? ["#9A8BFFFF", "#9CB1FF", "#7FCCFF"]
        : ["#5A3EEB", "#4A50E0", "#2C7FE8"]
      }
      style={ST.container}>


      <Text style={ST.headingTxt}>Leaderboard</Text>
      <Text style={ST.subHeadingTxt}>Top 5 Ideas</Text>

      {/* //! SORT */}
      <LinearGradient style={ST.sortBtnContainer} colors={theme === "light" ? ["#5F8BFF", "#78B2E7FF"]
        : ["#3A3F66", "#2A2D4F"]


      }>
        <Text style={ST.sortTxt}>Sort by: </Text>
        <Picker style={ST.pickerStyle}
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
          <LinearGradient style={ST.cardContainer}
            colors={theme === "light" ? ["rgba(255, 255, 255, 0.85)", "rgba(233, 236, 255, 0.85)"]
              : ["rgba(30, 22, 40, 0.85)", "rgba(50, 36, 69, 0.85)"]
            }>

            <Image source=
              {imagePicker(index)}
              style={ST.medalImg} />

            <View style={ST.listTxtContainer}>
              <Text style={ST.cardNameTxt}>{item.submitedName}</Text>
              <Text style={ST.cardtagline}>{item.submittedTagline}</Text>

              <Text style={ST.cardDescTxt}>
                {expandedIndex === index ? item.submittedDesc :
                  item.submittedDesc.slice(0, 50)} </Text>

              {item.submittedDesc.length > 50 ?
                <Text style={[ST.cardDescTxt, { color: "#0000EE" }]}
                  onPress={() => {
                    setExpandedIndex(expandedIndex === index ? null : index)
                  }}> {expandedIndex === index ? "Read less..." : "Read more..."}</Text> : null}

            </View>
            <Text style={[ST.ratingVal,
            { backgroundColor: item.rating >= 50 ? "#32AE40FF" : "#AE3232FF" }]}>{item.
              rating}/100</Text>
          </LinearGradient>
        )}

        ListEmptyComponent={() => (
          <View style={ST.emptyContainer}>
            <Text style={ST.emptyTxt}>Nothing to display</Text>
          </View>
        )}
      />
    </LinearGradient >
  )
}

export default Leaderboard;

const stylesLight = StyleSheet.create({
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
    minHeight: 150,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 12,
    elevation: 8,
    paddingBottom: 12
  },
  medalImg: {
    height: 70,
    width: 70
  },
  listTxtContainer: {
    width: 180,
  },
  ratingVal: {
    color: "#FFFFFF",
    textAlign: "center",
    padding: 9,
    borderRadius: 20,
    marginRight: 12
  },
  cardNameTxt: {
    marginTop: 12,
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
});

const stylesDark = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#0E0F12",
  },

  headingTxt: {
    marginTop: height * 0.06,
    textAlign: "center",
    fontSize: 34,
    color: "#FFFFFF",
    fontWeight: "700",
    marginBottom: 6,
  },

  subHeadingTxt: {
    textAlign: "center",
    color: "#D1D1D1",
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
  },

  sortBtnContainer: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    width: 230,
    borderRadius: 30,
    marginTop: 12,
    borderColor: "#FFFFFF22",
    elevation: 6,
    marginBottom: 12,
  },

  sortTxt: {
    color: "#FFFFFFCC",
    fontSize: 16,
  },

  pickerStyle: {
    width: 130,
    color: "#FFFFFF",
  },

  cardContainer: {
    flexDirection: "row",
    marginBottom: 12,
    justifyContent: "space-evenly",
    minHeight: 150,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 12,
    elevation: 8,
    paddingBottom: 12

  },

  medalImg: {
    height: 70,
    width: 70,
  },

  listTxtContainer: {
    width: 180,
  },

  cardNameTxt: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 12,
  },

  cardtagline: {
    marginTop: 3,
    fontWeight: "600",
    color: "#D1D1D1",
  },

  cardDescTxt: {
    marginTop: 12,
    color: "#B8B8B8",

  },

  ratingVal: {
    color: "#FFFFFF",
    textAlign: "center",
    padding: 9,
    borderRadius: 22,
    marginRight: 12,
    minWidth: 70,
  },


  emptyContainer: {
    justifyContent: "center",
    marginTop: 12,
    height: height * 0.6,
  },

  emptyTxt: {
    textAlign: "center",
    color: "#FFFFFF72",
    fontStyle: "italic",
    fontSize: 30,
  },
});
