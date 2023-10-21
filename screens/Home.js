import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, SafeAreaView, StatusBar, View, Text, TouchableOpacity, ScrollView} from "react-native";
import FeatIcons from 'react-native-vector-icons/Feather'
import {Calendar, LocaleConfig} from 'react-native-calendars';
import { AppContext } from "../components/appContext";
import { db } from "../components/createDBandTable";
import { useIsFocused } from '@react-navigation/native'

const styles = StyleSheet.create({
    mainone:{
        flex:1,
        backgroundColor:'rgba(255,255,253,1)',
        alignItems:'center',  
        paddingVertical:10,    
        overflow:'scroll',
        letterSpacing:0.5, 
    },
    header: {
      position:"absolute",
      width:"100%",
      backgroundColor:'rgb(80,80,225)',
      height:80,
      justifyContent:"center",
      paddingLeft:20
    },
    elevation:{
      elevation:50,
      shadowColor:'black'
    },
    body:{
      marginTop: 50,
      minHeight:500,
      paddingHorizontal:10,
      width:'100%',
    },
    section:{
      backgroundColor:"white",
      borderRadius:10,
    },
    sectionElevation:{
      elevation:20,
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
      }
    
})

export default function Home ({ navigation }){
  const [lastAttendance, setLastAttendance]=useState({})
  const focusedd = useIsFocused()
  const { instrument, className, level, total, instructor } = useContext(AppContext)

  useEffect(()=>{

      const getLastAttendance = async() => {
        let query = `${className}attendancetaken`
        console.log(query)
        
          await db.transaction (async(tx)=>{
            await tx.executeSql(`SELECT * FROM ${query} ORDER BY ID DESC LIMIT 1`,[],
            (tx,results)=>{
              if (results.rows.length===1) {
                setLastAttendance(results.rows.item(0));
              }
              else{
                setLastAttendance({})
              }
            })
          })
      }
      if (className) {
        getLastAttendance()
      }
  },[className, focusedd])

    const takeAttendance = ()=>{
      navigation.navigate("New Attendance")
    }

    const addStudent = ()=>{
      navigation.navigate('Assessment')
    }
   
    return(
      <ScrollView contentInsetAdjustmentBehavior="automatic"  >

        <SafeAreaView style={styles.mainone} >
          <StatusBar
          animated={true}
          backgroundColor="rgb(80,80,225)"
        />

        <View style={[styles.header, styles.elevation]}>
          <View style={{flexDirection:"row", alignItems:"center", justifyContent:'center', paddingBottom:20}}>
            <Text style={{fontFamily:"futura_medium", color:'white', textAlign:'center', fontSize:18,
          }}>Dashboard</Text>
          </View>
        </View>
        
        <View style={styles.body}>

          <View style={[styles.section, styles.sectionElevation, {minHeight:80, width:'auto', flexDirection:"row", alignSelf:"center"}]}> 
        
           <TouchableOpacity onPress={takeAttendance} style={{justifyContent:"center", alignItems:"center", paddingHorizontal:20}}>
                  <FeatIcons name="user-check" size={30} color={"black"} />
              <Text style={{textAlign:"center"}}>Take {"\n"} Attendance</Text>
           </TouchableOpacity>

           <TouchableOpacity onPress={addStudent} style={{justifyContent:"center", alignItems:"center", paddingHorizontal:20}}>
                  <FeatIcons name="user-plus" size={30} color={"black"} />
              <Text style={{textAlign:"center"}}>Take {"\n"} Assessment</Text>
           </TouchableOpacity>

           

          </View>
          
          <View style={[styles.section, styles.sectionElevation, {minHeight:100, width:'auto',  padding: 10, marginTop:15}]}>
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
                Level: 
              </Text>
              <Text style={styles.main}>
                {level ? level.trim() : "--"}
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
          </View>  

          <Text style={styles.sup}>
                Instructor(s): 
              </Text>

                {instructor ? instructor.map((instructor)=>{
                  return(
                    <Text key={instructor} style={styles.main}>
                        {instructor.trim()}
                    </Text>      
                  )
                }) : <Text>--</Text>}
              
          </View>

          <View style={[styles.section, styles.sectionElevation, {minHeight:100, width:'auto', padding: 10, marginTop:15}]}>
          <Text style={{fontFamily:'futura_medium', fontSize:16, color:'black'}}>
                Last Attendance Taken 
          </Text>
              <Text style={styles.sup}>
                Date: 
              </Text>
              <Text style={styles.main}>
                { lastAttendance.Date ? lastAttendance.Date : "--" }
              </Text>
              
              <View style={{flexDirection:"row", justifyContent:"space-around", marginTop:10}}>
              <View style={{backgroundColor:"orange", borderRadius:10, width:150, height:150, padding:15}}>
                  <Text style={{color:"white", fontWeight:'bold'}}>
                    Total Absent
                  </Text>
                  <Text style={{fontSize: 50, color:"white", alignSelf:"flex-end" }}>
                  { lastAttendance.Absent ? lastAttendance.Absent : "--" }
                  </Text>
                </View>
                
                <View style={{backgroundColor:"rgb(80,80,225)", borderRadius:10, width:150, height:150, padding:15}}>
                  <Text style={{color:"white", fontWeight:'bold'}}>
                    Total Present
                  </Text>

                  <Text style={{fontSize: 50, color:"white", alignSelf:"flex-end" }}>
                  { lastAttendance.Present ? lastAttendance.Present : "--" }
                  </Text>
                </View>
              </View>

              <Text style={[styles.sub, {marginTop:10}]}>Attendance Status</Text>
              <Text style={[styles.main, {color: lastAttendance.Status==="submitted" ? "green" : "red"}]}>{ lastAttendance.Status? lastAttendance.Status : "--" }</Text>

              <TouchableOpacity style={{marginTop:10, padding:5}} onPress={()=>navigation.navigate("All Attendance")}>
                <View style={{flexDirection:"row", alignItems:"center", justifyContent:"flex-end"}}>
                <Text style={{textAlign:"right", fontFamily:"futura_medium", color:"green"}}>All Attendance Sheets
                </Text> 
                <FeatIcons name="arrow-right" size={20} color={"green"} />
                </View>
              </TouchableOpacity>
          </View>
          
    

        </View>
          
          

        </SafeAreaView>

      </ScrollView>
    )
}