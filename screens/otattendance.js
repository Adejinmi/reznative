import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, Text, SafeAreaView, StatusBar, View, ScrollView, FlatList, TouchableHighlight, TouchableOpacity, Alert } from "react-native";
import CheckBox from '@react-native-community/checkbox';
import { useIsFocused } from "@react-navigation/native";
import { GenContext } from "../components/genContext";

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

export default OTAttendance = ({ route, navigation }) =>{
    const { api } = useContext(GenContext)
    const { studs, token } = route.params
    const [nominalRoll, setNominalRoll] = useState(studs)
    const [content, setContent] = useState('Submit')
    const [enabled, setEnabled] = useState(true)
    const [editing, setEditing] = useState(true)
    const focus = useIsFocused()


    const date = new Date()
    let currentDay= String(date.getDate()).padStart(2, '0');
    let currentMonth = String(date.getMonth()+1).padStart(2,"0");
    let currentYear = date.getFullYear();
    let currentDate = `${currentDay}-${currentMonth}-${currentYear}`; 

    const setStatus = (value,matric) =>{
        const updatedAttendance=nominalRoll.map((student)=>{
            if (student.matric==matric){
                return {...student, status:value}
            }
            else{return student}
        })

        setNominalRoll(updatedAttendance)
    }

    const submitAttendance = async ()=>{
        let Date = currentDate
        setEnabled(false)
        setContent('Submitting...')
        let pres = 0
        let abs = 0
        let payload=[]
        let details={}
        
        nominalRoll.map((person)=>{
            if (person.status) {
                pres+=1
            }
            else{
                abs+=1
            }
            const name = person.name; const matric = person.matric;
            let attendance = {}
            attendance[`${Date}`]=person.status ? "P" : "A"
            payload.push({name, matric, attendance})
        })
        details.date=Date
        details.present=pres
        details.absent=abs
    try {
        const response = await fetch(
            `${api}/ota/saveAttendance`,
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              token,
              payload,
              details
            })
        });
        const json = await response.json();
        if(json.msg==="Submitted"){
            Alert.alert("Success","Submitted",[{
                text: "OK",
                onPress:()=>navigation.navigate('Home')
            }])
        }
        
    } catch (error) {
        setEnabled(true)
        setContent('Submit')
        return Alert.alert("Oops!","Check your internet connection and Try again!")
    }
    }

    

    return(
        <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{flexGrow:1}} >
        <SafeAreaView style={styles.mainone}>
            <StatusBar
                animated={true}
                backgroundColor="rgb(80,80,225)"
            />

          

          <View style={[styles.section, styles.sectionElevation, {minHeight:280, width:'auto',  padding: 10, marginBottom:10,flex:1}]} >

            <Text style={{color:"black"}}>
                Today's Date:
            </Text>  
            <Text style={{fontFamily:"futura_medium", fontSize:15, fontWeight:"bold", color: "black"}}>
                {currentDate}
            </Text>
                <View style={{flexDirection:"row", marginBottom:5, marginTop:10, borderBottomColor:"grey", borderBottomWidth:1, justifyContent:"space-between"}}>
                    <Text style={styles.headText}>MATRIC NO</Text>
                    <Text style={styles.headText}>NAME</Text> 
                    <Text style={styles.headText}>STATUS</Text>
                </View>
            
            
             <ScrollView contentInsetAdjustmentBehavior="automatic" style={{marginBottom:10}}>
 
                     {nominalRoll.map((person)=>{
 
                 return (
                 <View key={person.matric} style={{flexDirection:"row", borderBottomWidth:.3, borderBottomColor:"lightgrey", justifyContent:"space-between", marginBottom:2, alignItems:"center"}}>
                     <View style={{flexDirection:"row", gap:30}}> 
                         <Text style={styles.listText}>{person.matric}</Text> 
                         <Text style={styles.listText}>{person.name}</Text>
                     </View>
                     <CheckBox
                             disabled={!enabled}
                             value={person.status}
                             onValueChange={(value)=>setStatus(value,person.matric)}
                         /> 
                 </View>
                 )
             })}
 
             </ScrollView>
 
                 <View style={{alignSelf:"flex-end", flexDirection:"row", alignItems:"center", gap:15}}>
                     <TouchableOpacity style={{backgroundColor:enabled?"green":'lightgrey', width:80, padding:7, borderRadius:5, marginTop:5}} onPress={()=>submitAttendance()} disabled={!enabled}>
                     <Text style={{fontFamily:"futura_medium", color:"white", textAlign:"center"}}>{content}</Text>
                     </TouchableOpacity>
 
                     <TouchableOpacity style={{backgroundColor:"rgb(80,80,225)", width:80, padding:7, borderRadius:5, marginTop:5}} onPress={()=>navigation.navigate('Home')}>
                     <Text style={{fontFamily:"futura_medium", color:"white", textAlign:"center"}}>Done</Text>
                     </TouchableOpacity>
                 </View>     
        
          </View>
              
        </SafeAreaView>
        </ScrollView>
    )
}