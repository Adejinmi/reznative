import React, { useState, useContext, useEffect, useCallback } from "react";
import { StyleSheet, Text, SafeAreaView, StatusBar, View, ScrollView, FlatList, TouchableHighlight, TouchableOpacity } from "react-native";
import CheckBox from '@react-native-community/checkbox';
import FeatIcons from 'react-native-vector-icons/Feather';
import { AppContext } from "../components/appContext";
import { db } from "../components/createDBandTable";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";

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
        fontFamily:'futura_medium', fontSize:15, color:'black'
      }
}) 

export default TakeAttendance = ({ navigation }) =>{
    const [nominalRoll, setNominalRoll] = useState([])
    const [test, setTest] = useState()
    const focus = useIsFocused()

    const { instrument, className, level, total, instructor } = useContext(AppContext)

    useEffect(()=>{
        const getNominalRoll = async() => {
                if (className && focus){
                    let nom = []
                    await db.transaction(async(tx)=>{
                         let query = `${className}nominalroll`
                         await tx.executeSql(`SELECT * FROM ${query}`,[],
                         (tx,results)=>{
                            for (let index = 0; index < results.rows.length; index++) { 
                                  nom.push(results.rows.item(index))  
                            }
                            setNominalRoll(nom)
                         })
                    })  
                }
           }
        getNominalRoll()
    },[className, focus])


    return(
        <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{flexGrow:1}}>
        <SafeAreaView style={styles.mainone}>
            <StatusBar
                animated={true}
                backgroundColor="rgb(80,80,225)"
            />
        

        <View style={[styles.section, styles.sectionElevation, {minHeight:100, width:'auto',  padding: 10, marginBottom:10}]}>
          <Text style={{fontFamily:'futura_medium', fontSize:16, color:'black'}}>
                CLASS DETAILS 
            </Text>
            <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                <View>
                    <Text style={styles.sup}>
                        Instrument: 
                    </Text>
                    <Text style={styles.main}>
                        {instrument ? instrument.trim() : "--"}
                    </Text>
                </View>

                <View>
                    <Text style={styles.sup}>
                        Total No of Students: 
                    </Text>
                    <Text style={styles.main}>
                        {total ? total : "--"}
                    </Text>
                </View>
                    
                <View>
                    <Text style={styles.sup}>
                        Level: 
                    </Text>
                    <Text style={styles.main}>
                        {level ? level.trim() : "--"}
                    </Text>
                </View>
            </View>
              
              
              <Text style={styles.sup}>
                Instructors: 
              </Text>
              {instructor ? instructor.map((instructor)=>{
                          return(
                            <Text key={instructor} style={styles.main}>
                                {instructor.trim()}
                            </Text>      
                          )
                        }) : <Text>--</Text>}
          </View>

          <View style={[styles.section, styles.sectionElevation, {minHeight:280, width:'auto',  padding: 10, marginBottom:10,flex:1}]} >
            
                <View style={{flexDirection:"row", marginBottom:5, borderBottomColor:"grey", borderBottomWidth:1, justifyContent:"space-between"}}>
                    <Text style={styles.headText}>MATRIC NO</Text>
                    <Text style={styles.headText}>NAME</Text> 

                </View>

            <ScrollView  style={{marginBottom:10}}>

                    {nominalRoll.map((person)=>{

                return (
                <TouchableOpacity key={person.ID} style={{flexDirection:"row", borderBottomWidth:.3, borderBottomColor:"lightgrey", justifyContent:"space-between", marginBottom:2, alignItems:"center", paddingVertical:6}} onPress={()=>{navigation.navigate("Edit Student Details", person)}}>
                        <Text style={styles.listText}>{person.Matric}</Text> 
                        <Text style={styles.listText}>{person.Name}</Text>                 
                </TouchableOpacity>
                )
            })}

            </ScrollView>

            <TouchableOpacity style={{backgroundColor:"green", padding:10, borderRadius:5,     marginTop:5, flexDirection:"column", alignItems:"center", justifyContent:"center", alignSelf:"flex-end"}} onPress={()=>{navigation.navigate('Add Students')}}>
                <FeatIcons name="user-plus" size={15} color={"white"} />
                    <Text style={{fontFamily:"futura_medium", color:"white", textAlign:"center"}}>Add {"\n"} Student(s)</Text>
                    </TouchableOpacity>
            
          </View>

         
                    
        </SafeAreaView>
        </ScrollView>
    )
}