import React from "react";
import { SafeAreaView, StyleSheet, Pressable, Text } from "react-native";

const styles = StyleSheet.create({
    main:{
        flex: 1,
        alignItems:"center",
        justifyContent:"center"
    },

    button:{
        paddingVertical: 15,
        marginVertical: 10,
        width: 200,
        borderRadius: 5
    },
    text:{
        color: "white",
        textAlign:"center"
    }
})

export default function Start({ navigation }){
    return(
        <SafeAreaView style={styles.main}>
            <Pressable style={[styles.button, {backgroundColor:"orange"}]} onPress={()=>navigation.navigate('CreateClass')}>
                <Text style={styles.text}>
                    New Class
                </Text>
            </Pressable>

            <Pressable style={[styles.button, {backgroundColor:"rgb(80,80,255)"}]} onPress={()=>navigation.navigate('Login')}>
                <Text style={styles.text}>
                    Existing Class
                </Text>
            </Pressable>
        </SafeAreaView>
    )
}