import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, Text, SafeAreaView, StatusBar, View, ScrollView, FlatList, TouchableHighlight, TouchableOpacity } from "react-native";
import CheckBox from '@react-native-community/checkbox';
import { AppContext } from "../components/appContext";
import { db } from "../components/createDBandTable";
import { useIsFocused } from "@react-navigation/native";


const styles = StyleSheet.create({
    mainone:{
        flex:1,
        backgroundColor:'rgb(255,255,253)', 
        paddingVertical:10,    
        overflow:'scroll',
        letterSpacing:0.5,
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
        justifyContent:"space-between",
        alignItems: "flex-start",
        padding:10,
        top:5,
        backgroundColor:"white",
        borderTopLeftRadius:10,
        borderTopRightRadius:10
      },
      
      headtext:{
        fontFamily:"futura_medium",
        fontWeight:"bold",
        fontSize:16,
        color:"black"
      },
      listText:{
        fontFamily:"futura_medium",
        fontSize:16,
        color:"black",
        padding:0,
        margin:0
      },
      statusText:{
        fontFamily:"futura_medium",
        fontSize:14,
        color: "white",
        padding:3,
        paddingHorizontal:10,
        borderRadius:5
        
      }
}) 

export default TakeAttendance = ({ navigation }) =>{
  const { instrument, className, level, total, instructor } = useContext(AppContext)
  const [prevAtt, setPrevAtt] = useState([])
  const focused = useIsFocused()
  useEffect(()=>{
    const getAllAtt = async()=>{
      let query= `${className}attendancetaken`
      let allAtt=[]
      await db.transaction(async(tx)=>{
          await tx.executeSql(`SELECT * FROM ${query}`,[],
          (tx,results)=>{
            for (let index = 0; index < results.rows.length; index++) {
              const stud = results.rows.item(index)
              allAtt.push(stud)  
            }
            setPrevAtt(allAtt)
          })
      })
    }
    getAllAtt()
  },[focused])

    return(

        <SafeAreaView style={styles.mainone}>
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

                ListHeaderComponent={
                  <>
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
                    
                    <View style={[styles.listHead, styles.elevation]}>
                        <Text style={styles.headtext}>DATE</Text>
                        <Text style={styles.headtext}>STATUS</Text>
                        
                    </View>
                    </>
                }

                ListEmptyComponent={<Text style={[styles.listText, {textAlign:"center"}]}>No Previous Attendance</Text>}

                data={prevAtt}
                renderItem={({item, index, separators}) => (
                    <TouchableOpacity style={{borderBottomColor:"grey", backgroundColor:"white", borderBottomWidth:.3, paddingVertical:10, paddingHorizontal:5}}
                        key={item.Date}
                        onPress={() => navigation.navigate("View Attendance", item)} >
                    <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                        <Text style={styles.listText}> {item.Date}</Text>
                        <Text style={[styles.statusText, {backgroundColor: item.Status=="Submitted" ? "green" : "rgb(80,80,225)"}]}>{item.Status}</Text>
                        </View>
                </TouchableOpacity>
  )}
/>

                    
        </SafeAreaView>
    )
}