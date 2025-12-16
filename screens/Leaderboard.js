import { Dimensions, FlatList, StyleSheet, Text, View, Image } from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'

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
const emptyNote = [];
const Leaderboard = () => {
 


  return (
    <LinearGradient
      colors={["#7B61FF", "#6A6CFF", "#3AA0FF"]}
      style={styles.container}>

      <Text style={styles.headingTxt}>Leaderboard</Text>

      {/* //! LIST */}
      <FlatList showsVerticalScrollIndicator={false}
        data={leaderboardData}
        renderItem={({ item }) => (
          <LinearGradient style={styles.cardContainer}
            colors={["#ffffff", "#C1C1FFFF"]}>
            {/* <View > */}
            <Image source={require("../assets/1st.png")} style={styles.medalImg} />
            <View style={styles.listTxtContainer}>
              <Text style={styles.cardNameTxt}>{item.name}</Text>
              <Text style={styles.cardDescTxt}>{item.description}</Text></View>
            <Text style={[styles.ratingVal,
            { backgroundColor: item.aiRating >= 50 ? "#32AE40FF" : "#AE3232FF" }]}>{item.
              score}/100</Text>
            {/* </View> */}
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
  cardContainer: {
    flexDirection: "row",
    // backgroundColor: "#ffffff",
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
    marginRight:12
  },
  cardNameTxt: {
    fontSize: 18,
    fontWeight: 700
  },
  cardDescTxt: {

  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTxt: {
    textAlign: "center",
    color: "#FFFFFF72",
    fontStyle: "italic",
    fontSize: 30
  },
})