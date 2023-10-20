import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, SafeAreaView, StatusBar, View, ScrollView, FlatList, TouchableHighlight, TouchableOpacity } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { AppContext } from "../components/appContext";

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
      sup: {
        fontFamily:'futura_medium', fontSize:12,
        marginTop:10,
        
      },
      main:{
        fontFamily:'futura_medium', fontSize:16,
        color: 'black',
        fontWeight:"bold",
        textTransform:"uppercase"
      },
      listHead:{
        flexDirection: "row",
        justifyContent: "space-between",
      },
      headText:{
        fontFamily:'futura_medium', fontSize:15, color:'black', fontWeight:"bold"
      },
      listText:{
        fontFamily:'futura_medium', fontSize:15, color:'black',
      }
}) 

export default QuestionBank = ({ navigation }) =>{
      const focused = useIsFocused()
       const [data, setData] = useState([])
      const { className } = useContext (AppContext)
      
    return(
        <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{flexGrow:1}} >  
        <SafeAreaView style={styles.mainone}>
            <StatusBar
                animated={true}
                backgroundColor="rgb(80,80,225)"
            />

            <View style={{flex:1, justifyContent:"center", alignItems:"center"}}> 
              <Text style={{fontFamily:"futura_book", fontSize:18, textAlign:"center"}}> Feature Not Avaialble Yet </Text> 

            </View>
         
                    
        </SafeAreaView>
    </ScrollView>
    )
}