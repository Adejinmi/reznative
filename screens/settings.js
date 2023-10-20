import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, Text, SafeAreaView, StatusBar, View, FlatList, TouchableOpacity, TextInput, Alert } from "react-native";
import CheckBox from '@react-native-community/checkbox';
import FeatIcons from 'react-native-vector-icons/Ionicons'
import { AppContext } from "../components/appContext";
import { db } from "../components/createDBandTable";

const styles = StyleSheet.create({
    mainone:{
        flex:1,
        backgroundColor:'rgba(255,255,253,1)', 
        paddingVertical:10,    
        overflow:'scroll',
        letterSpacing:0.5,
        paddingHorizontal:15 
    },
    section:{
        backgroundColor:"white",
        borderRadius:10,
      },
      sectionElevation:{
        elevation:50,
        shadowColor:'black'
      },
      listText:{
        fontFamily:'futura_book', fontSize:15, color:'black'
      }
}) 

export default Settings = ({ navigation })=>{
  const { className } = useContext(AppContext)
    return(
        <SafeAreaView>
            <StatusBar
                animated={true}
                backgroundColor="rgb(80,80,225)"
            />
             <FlatList style={{backgroundColor:'rgba(255,255,253,1)', paddingHorizontal:10 }}
                ItemSeparatorComponent={
                    <View
                        style={{backgroundColor:'rgb(80,80,225)'}}
                    />
                    }


                data={[{title: 'Switch Class', icon: 'repeat', navigate:'Switch Class'}, {title: 'Add New Class', icon: 'add', navigate:'New Class'}, {title:'One Time Attendance', icon: 'create-outline', navigate:'One Time Attendance'},{title:'Retrieve Class', icon:'download', navigate:'Retrieve Class'},{title:'Change Class Password', icon:'eye-off-outline', navigate:'Change Class Password'},{title:'Change Pin', icon:'lock-open-outline', navigate:'Change Pin'},]}
                renderItem={({item, index, separators}) => (
                    <TouchableOpacity style={{borderBottomColor:"grey", backgroundColor:"white", borderBottomWidth:.3, paddingVertical:15, paddingHorizontal:5}}
                        key={item.title}
                        onPress={() => navigation.navigate(item.navigate)} >
                    <View style={{flexDirection:"row", gap:10, alignItems:"center"}}>
                        <FeatIcons name={item.icon} size={25} color={"rgb(80,80,225)"}/>
                        <Text style={[styles.listText]}>{item.title}</Text>
                        </View>
                </TouchableOpacity>
  )}
/>
        </SafeAreaView>
    )
}  