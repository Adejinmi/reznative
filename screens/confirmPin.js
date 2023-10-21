import React, { useContext, useState } from "react";
import { SafeAreaView, StyleSheet, View, TextInput, Image, Text, Pressable, TouchableOpacity, Alert } from "react-native";
import SQLite  from "react-native-sqlite-storage";
import * as Keychain from 'react-native-keychain'
import Icon from 'react-native-vector-icons/FontAwesome';
import { db, createTable } from "../components/createDBandTable";
import SmoothPinCodeInput from "@zfloc/react-native-smooth-pincode-input"
import  { StartContext } from "../components/startContext";
import SInfo from 'react-native-sensitive-info';
import { GenContext } from "../components/genContext";

const styles = StyleSheet.create({
    main:{
        flex:1,
        alignItems:"center"
    },
    view:{
        flex:1,
        width:"90%",
        alignItems:"center",
        flexDirection:"column",
        justifyContent:"space-between"
    },
    elevation: {
        elevation: 10,
        shadowColor: 'black',
      },
    
})

export default function ConfirmPin({ route, navigation }){
    const { unit, instrument, pin, setPin, cpin, setCPin, pass, level, instructor, api  } = useContext(StartContext)
    const { setFirstrun } = useContext(GenContext)
    const [enabled, setEnabled] = useState(true)
    const [content, setContent] = useState("Create Class")
    const  createPin = async ()=>{
        if(cpin === pin){
            setEnabled(false)
            setContent("Creating Class...")

            try {
                const response = await fetch(
                    `${api}/createClass`,
                  {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      unit:unit.trim(),
                      level:level.trim(),
                      instructor:instructor.trim(),
                      instrument: instrument.trim(),
                      pass:pass.trim()
                    })
                });
                const json = await response.json();
                if (json.payload) {
                    const { className, instrument, instructor, password, level, unit } = json.payload
                    await db.transaction(async (tx)=>{
                        await tx.executeSql(`CREATE TABLE IF NOT EXISTS BasicInfo (ID INTEGER PRIMARY KEY AUTOINCREMENT, Property TEXT, Description TEXT)`,
                        (tx, results)=>{
                            console.log(results)
                        }
                        )})
                    
                    await db.transaction(async (tx)=>{
                        await tx.executeSql(`CREATE TABLE IF NOT EXISTS ClassesCreated (ID INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, Password TEXT, Instructors TEXT, Instrument TEXT, Unit TEXT, Level TEXT)`,
                        (tx, results)=>{
                            console.log(results)
                        }
                        )})
                    
                    await db.transaction(async (tx)=>{
                        let query= `${className}nominalroll`
                        await tx.executeSql(`CREATE TABLE IF NOT EXISTS ${query} (ID INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, Matric TEXT)`,
                        (tx, results)=>{
                            console.log(results)
                        }
                        )})
                                
                    await db.transaction(async (tx)=>{
                        let query = `${className}attendance`
                        await tx.executeSql(`CREATE TABLE IF NOT EXISTS ${query} (ID INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, Matric TEXT, Attendance TEXT)`,
                        (tx, results)=>{
                            console.log(results)
                        }
                        )})
                                    
                    await db.transaction(async (tx)=>{
                        let query=`${className}attendancetaken`
                        await tx.executeSql(`CREATE TABLE IF NOT EXISTS ${query} (ID INTEGER PRIMARY KEY AUTOINCREMENT, Date TEXT, Status TEXT, Present INTEGER, Absent INTEGER)`,
                        (tx, results)=>{
                            console.log(results)
                        }
                        )})
                                   
                    await db.transaction(async (tx)=>{
                        let query= `${className}assessment`
                        await tx.executeSql(`CREATE TABLE IF NOT EXISTS ${query} (ID INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, Matric TEXT, Score TEXT)`,
                        (tx, results)=>{
                            console.log(results)
                        }
                        )})
                       
                    await db.transaction(async (tx)=>{
                        let query= `${className}exam`
                        await tx.executeSql(`CREATE TABLE IF NOT EXISTS ${query} (ID INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, Matric TEXT, Score INTEGER)`,
                        (tx, results)=>{
                            console.log(results)
                        }
                        )})
                                   
                    await db.transaction(async (tx)=>{
                        let query = `${className}assessmenttaken`
                        await tx.executeSql(`CREATE TABLE IF NOT EXISTS ${query} (ID INTEGER PRIMARY KEY AUTOINCREMENT, Date TEXT, Status TEXT, Total INTEGER)`,
                        (tx, results)=>{
                            console.log(results)
                        }
                        )})
             
                    await db.transaction(async (tx)=>{
                        let query = `${className}questionbank`
                        await tx.executeSql(`CREATE TABLE IF NOT EXISTS ${query} (ID INTEGER PRIMARY KEY AUTOINCREMENT, Question TEXT, Options TEXT, CorrectOption TEXT)`,
                        (tx, results)=>{
                            console.log(results)
                        }
                        )})
          
                
                    await db.transaction( async (tx)=>{
                        await tx.executeSql(`INSERT INTO BasicInfo (Property,Description) VALUES (?,?)`,
                        ['FirstRun','isNot'],
                        ()=>{},
                        error=>{console.log(error)}
                        )})
                
                    await db.transaction(async (tx)=>{
                        await tx.executeSql(`INSERT INTO ClassesCreated (Name,Password,Instructors,Instrument,Unit,Level) VALUES (?,?,?,?,?,?)`,
                        [className,password,instructor,instrument,unit,level],
                        ()=>{},
                        error=>{console.log(error)}
                        )
                    })
                } else if(json.msg==="Class Exists"){
                    setEnabled(true)
                    setContent("Create Class")
                    return Alert.alert("Oops!","This Class Exists Already")
                }
                    else {
                    setEnabled(true)
                    setContent("Create Class")
                    return Alert.alert("Oops!","Something went wrong, Try again")
                }
              } catch (error) {
                setEnabled(true)
                setContent("Create Class")
                return Alert.alert("Oops!","Check your Internet Connection and try again")
              }
            

            try {
                await SInfo.setItem('esmsuite', `${pin}`, {
                    sharedPreferencesName: 'esmSuitePrefs',
                    keychainService: 'esmSuiteKeychain',
                    touchId: true, //add this key
                    showModal: true, //add this key
                    kSecAccessControl: 'kSecAccessControlBiometryAny' // optional - Add support for FaceID
                });
                setFirstrun(false)
                setContent("Done")

            } catch (error) {
                setEnabled(true)
                setContent("Create Class")
                return Alert.alert("Oops!","Something went wrong, Try again")
            } 
        }
        else{
            Alert.alert('Alert!', 'Not a match')
        }
    }
    return (
       
        <SafeAreaView style={styles.main}>
            <View style={styles.view}>
            <View>
            <View style={{marginTop:50, alignItems:"center"}}>
                <Icon name="lock" size={100} color="rgb(80,80,255)" />
                <Text style={{fontFamily:"futura_medium", fontSize:20, color:"rgb(80,80,225)", marginBottom
            :10}}>Confirm Pin</Text>
            </View>
            <SmoothPinCodeInput
                cellStyle={{borderColor:"rgb(80,80,225)", borderWidth:1, borderRadius:5,}}
                cellStyleFocused={{borderColor:"orange"}}
                value={cpin}
                cellSpacing={14}
                cellSize={48}
                onTextChange={code => setCPin(code)}
                restrictToNumbers={true}
            />
            </View>
            <TouchableOpacity disabled={!enabled} onPress={createPin} style={[{backgroundColor: enabled ? "rgb(80,80,225)" : "lightgrey", width:"50%", borderRadius:5, marginBottom:50},styles.elevation]}>
                <Text style={{fontFamily:"futura_book", color:"white", textAlign:"center", paddingVertical:15, fontSize:17}}>
                   {content} 
                </Text>
            </TouchableOpacity> 

            </View>     
        </SafeAreaView>
        
       
      
    )
}

