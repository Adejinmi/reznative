import React, { useContext, useState } from "react";
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import SmoothPinCodeInput from "@zfloc/react-native-smooth-pincode-input"
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

export default function FinishUp({ route, navigation }){
    const  pin = route.params
    const [cpin, setCPin] = useState()
    const { setFirstrun } = useContext(GenContext)
    const [enabled, setEnabled] = useState(true)
    const [content, setContent] = useState("Confirm Pin")
    const  createPin = async ()=>{
        if(cpin === pin){
            setEnabled(false)
            setContent("Please wait...")

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
                setContent("Confirm Pin")
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

