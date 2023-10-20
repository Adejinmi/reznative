import React, { useState } from "react";
import { SafeAreaView, StyleSheet, View, TextInput, Image, Text, Pressable, TouchableOpacity, Alert, ScrollView } from "react-native";
import FeatIcons from 'react-native-vector-icons/Feather'

const styles= StyleSheet.create({
    button:{
        justifyContent:"center",
        alignItems:"center",
        width:250,
        height:200,
        borderRadius:5,
        marginVertical:10,
        backgroundColor:"white"
    },
    smallbutton:{
        justifyContent:"center",
        alignItems:"center",
        width:120,
        height:120,
        borderRadius:5,
        marginVertical:10,
        backgroundColor:"white"
    },
    text:{
        fontFamily:"futura_medium",
        fontSize:17,
        marginTop:5,
        color:"black"
    },

    smalltext:{
        fontFamily:"futura_medium",
        fontSize:14,
        marginTop:5,
        color:"black"
    },
    elevation:{
        elevation:50,
        shadowColor:"black",

    }
})

export default function Welcome({ navigation }){

    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ flexGrow:1}}>
        <SafeAreaView style={{flex:1}}>
            <View style={{justifyContent:"center", alignItems:"center", flex:1}}>
            <TouchableOpacity style={[styles.button, styles.elevation]} onPress={()=>{navigation.navigate('New Class')}}>
                <FeatIcons name="plus" size={40} color={"black"} />
                <Text style={styles.text}>
                    New Class
                </Text>
            </TouchableOpacity>

            <View style={{flexDirection:"row", gap:10}}>
                <TouchableOpacity style={[styles.smallbutton, styles.elevation]} onPress={()=>navigation.navigate('Retrieve Class')}>
                    <FeatIcons name="arrow-down" size={30} color={"black"} />
                    <Text style={styles.smalltext}>
                        Retrieve Class {"\n"} Information
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.smallbutton, styles.elevation]} onPress={()=>navigation.navigate("One Time Attendance")}>
                    <FeatIcons name="check" size={30} color={"black"} />
                    <Text style={styles.smalltext}>
                        One Time {"\n"} Attendance
                    </Text>
                </TouchableOpacity>

            </View>
            </View>
        </SafeAreaView>
        </ScrollView>
    )
}