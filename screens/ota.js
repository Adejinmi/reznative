import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, Text, SafeAreaView, StatusBar, View, FlatList, TouchableOpacity, TextInput, Alert } from "react-native";
import { AppContext } from "../components/appContext";
import { useIsFocused } from "@react-navigation/native";
import Prompt from 'react-native-prompt-crossplatform';
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
      listText:{
        fontFamily:'futura_book', fontSize:15, color:'black'
      }
}) 

export default OTA = ({ navigation })=>{
    const { api } = useContext(GenContext) 
    const [allClasses, setAllClasses] = useState([])
    const focused = useIsFocused()
    const [className, setClassName] = useState()
    const [password, setPassword] = useState()
    const [visible, setVisible] = useState(false)
    const [refresh, setRefresh] = useState(true)
    const [token, setToken] = useState()
    const [studs, setStuds] = useState()
    const[content, setContent]=useState("Submit")

  useEffect(()=>{
    const getAllClass = async()=> {
        const response = await fetch(`${api}/ota/getClasses`)
        const json = await response.json()
        if (json.allClasses) {
            setAllClasses(json.allClasses)
        } else {
            setAllClasses([])
        }
    }
    if (focused) {
        getAllClass()
    }
  },[focused, refresh])

  const authenthicate = async()=>{
    try {
        const response = await fetch(
            `${api}/ota/takeAttendance`,
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              className,
              password
            })
        });
        const json = await response.json();
        if (json && json.studs && json.token) {
            let tok = (json.token)
            setToken(tok)
            let nom=[]
            json.studs.forEach(element => {
                element.status=false
                nom.push(element)
            });
            setStuds(nom)
            navigation.navigate('Take Attendance',{studs:nom,token:tok})
        } else {
            setPassword()
            setContent("Submit")
            Alert.alert("Oops!","Wrong Password!")
        }
        
        
    } catch (error) {
        
            setContent("Submit")
            Alert.alert("Oops!","Try Again!")
        
    }
  }


    return(
        <SafeAreaView>
            <StatusBar
                animated={true}
                backgroundColor="rgb(80,80,225)"
            />
            <Prompt
                                title={className}
                                placeholder="Enter Class Password"
                                isVisible={visible}
                                onChangeText={(text) => {
                                setPassword(text)}}
                                onCancel={() => {
                                    setVisible(false)
                                    setPassword()
                                }}
                                onSubmit={() => {
                                    setContent("...")
                                 authenthicate()
                                }}
                                primaryColor='rgb(80,80,225)'
                                headingStyle={{fontFamily:"futura_book", fontSize:14}}
                                btnStyle={{backgroundColor:"green", width: 140, margin: 8, textAlign:"center", borderRadius:10}}
                                promptBoxStyle={{flexDirection: "column", justifyContent:"center", alignItems:"center"}}
                                inputStyle={{fontFamily:"futura_book", fontSize:15, margin:0, marginBottom:-20}}
                                btnTextStyle={{fontFamily:"futura_book", fontSize:15, color:'white'}}
                                submitButtonText={content}
                            />
             <FlatList style={{backgroundColor:'rgba(255,255,253,1)', paddingHorizontal:10 }}
                ItemSeparatorComponent={
                    <View
                        style={{backgroundColor:'rgb(80,80,225)'}}
                    />
                    }
                    ListHeaderComponent={
                    <View style={{marginTop: 50, marginBottom:20}}>
                        <Text style={[styles.listText, {textAlign:"center", fontWeight:"bold"}]}>Select Class </Text>

                    </View>
                    }
                    ListEmptyComponent={<View style={{justifyContent:"center", alignItems:"center"}}>
                            <Text>Check your Internet connection and Try Again!</Text>
                            <TouchableOpacity style={{backgroundColor:"green", padding:10, borderRadius:10, marginVertical:15}} onPress={()=>setRefresh(!refresh)}>
                                <Text style={{fontFamily:"futura_book", color:"white"}}>Try Again</Text>
                            </TouchableOpacity>
                        </View>
                        }

                data={allClasses}
                renderItem={({item, index, separators}) => (
                    <TouchableOpacity style={{borderBottomColor:"grey", backgroundColor:"white", borderBottomWidth:.3, paddingVertical:15, paddingHorizontal:5}}
                        key={item}
                        onPress={() => {setClassName(item); setVisible(true)}} >
                        <View style={{flexDirection:"row", gap:10, alignItems:"center"}}>
                        <Text style={[styles.listText]}>-{item}</Text>
                        </View>
                </TouchableOpacity>
  )}
/>
        </SafeAreaView>
    )
}  