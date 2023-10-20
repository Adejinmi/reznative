import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, Text, SafeAreaView, StatusBar, View, FlatList, TouchableOpacity, TextInput, Alert } from "react-native";
import CheckBox from '@react-native-community/checkbox';
import FeatIcons from 'react-native-vector-icons/Ionicons'
import { AppContext } from "../components/appContext";
import { db } from "../components/createDBandTable";
import { useIsFocused } from "@react-navigation/native";

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
      },
      sup: {
        fontFamily:'futura_medium', fontSize:12,
        marginTop:10,
        
      },
      main:{
        fontFamily:'futura_medium', fontSize:16,
        color: 'black',
        fontWeight:"bold",
        textTransform:"uppercase"
      }
}) 

export default SwitchClass = ({ route, navigation })=>{
  const { className, setClassName } = useContext(AppContext)
  const { ID, Name, Instrument, Instructors, Unit, Level} = route.params

const switchClass = async ()=>{
   setClassName(Name)
   navigation.navigate('Home')
}
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
                    ListHeaderComponentStyle={[styles.section, styles.sectionElevation, {minHeight:100, width:'auto',  padding: 10, marginTop:15}]}
                    ListHeaderComponent={
                <View>
                <Text style={{fontFamily:'futura_medium', fontSize:16, color:'black'}}>
                        CLASS DETAILS 
                </Text>
                <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                    <View>
                    <Text style={styles.sup}>
                        Instrument: 
                    </Text>
                    <Text style={styles.main}>
                        {Instrument ? Instrument.trim() : "--"}
                    </Text>
                    </View>

                    
                    <View>
                    <Text style={styles.sup}>
                        Level: 
                    </Text>
                    <Text style={styles.main}>
                        {Level ? Level.trim() : "--"}
                    </Text>
                    </View>

                    <View>
                    <Text style={styles.sup}>
                        Unit: 
                    </Text>
                    <Text style={styles.main}>
                        {Unit ? Unit.trim() : "--"}
                    </Text>
                    </View>
                </View>  

                <Text style={styles.sup}>
                        Instructor(s): 
                    </Text>

                        {Instructors ? Instructors.split(",").map((instructor)=>{
                        return(
                            <Text key={instructor} style={styles.main}>
                                {instructor.trim()}
                            </Text>      
                        )
                        }) : <Text>--</Text>}
                <View style={{marginTop:20}}>

                    <TouchableOpacity onPress={()=>switchClass()} style={{backgroundColor:"green", width:80, padding:7, borderRadius:5, marginTop:15, alignSelf:"flex-end"}}>
                    <Text style={{fontFamily:"futura_medium", color:"white", textAlign:"center"}}>Switch Class</Text>
                </TouchableOpacity>
                </View>
                </View>
                    }
                data={[]}
                renderItem={({item, index, separators}) => (
                    <>
                    </>
  )}
/>
        </SafeAreaView>
    )
}  