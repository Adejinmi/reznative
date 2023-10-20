import React, { useContext, useState } from "react";
import { SafeAreaView, StyleSheet, View, TextInput, Image, Text, Pressable, TouchableOpacity, Alert } from "react-native";
import SQLite  from "react-native-sqlite-storage";
import * as Keychain from 'react-native-keychain'
import Icon from 'react-native-vector-icons/FontAwesome';
import { db, createTable } from "../components/createDBandTable";
import SmoothPinCodeInput from "@zfloc/react-native-smooth-pincode-input"
import  { StartContext } from "../components/startContext";
import SInfo from 'react-native-sensitive-info';

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

export default function Login({ setLogin }){
    const [pin, setPin] = useState()
    const [enabled, setEnabled] = useState(true)
    const [content, setContent] = useState("Login")
   
    const login = async()=>{
        setContent("Logging in...")
        setEnabled(false)
        const ppin = await SInfo.getItem('esmsuite', {
                    sharedPreferencesName: 'esmSuitePrefs',
                    keychainService: 'esmSuiteKeychain',
                });
            
            if (pin && pin.length==4) {
                if (ppin===pin) {
                    setLogin(true)
                } else {
                    setEnabled(true)
                    setContent("Login")
                    setPin()
                    Alert.alert('Alert!', 'Wrong Pin')
                }
            } else {
                setEnabled(true)
                setContent("Login")
                setPin()
                Alert.alert('Alert!', 'Incomplete Pin')
            }
            
        

    }
    
    return (
       
        <SafeAreaView style={styles.main}>
            <View style={styles.view}>
            <View>
            <View style={{marginTop:50, alignItems:"center"}}>
                <Icon name="lock" size={100} color="rgb(80,80,255)" />
                <Text style={{fontFamily:"futura_medium", fontSize:20, color:"rgb(80,80,225)", marginBottom
            :10}}>Enter Your Pin</Text>
            </View>
            <SmoothPinCodeInput
                cellStyle={{borderColor:"rgb(80,80,225)", borderWidth:1, borderRadius:5,}}
                cellStyleFocused={{borderColor:"orange"}}
                value={pin}
                password={true}
                cellSpacing={14}
                cellSize={48}
                maskDelay={100}
                onTextChange={code => setPin(code)}
                restrictToNumbers={true}
            />
            </View>
            <TouchableOpacity disabled={!enabled} onPress={()=>login()} style={[{backgroundColor: enabled ? "rgb(80,80,225)" : "lightgrey", width:"50%", borderRadius:5, marginBottom:50},styles.elevation]}>
                <Text style={{fontFamily:"futura_book", color:"white", textAlign:"center", paddingVertical:15, fontSize:17}}>
                   {content}
                </Text>
            </TouchableOpacity> 

            </View>     
        </SafeAreaView>
        
       
      
    )
}

