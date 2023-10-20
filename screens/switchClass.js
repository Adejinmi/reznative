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
      }
}) 

export default SwitchClass = ({ navigation })=>{
  const { className } = useContext(AppContext)
  const [allClasses, setAllClasses] = useState([])
const focused = useIsFocused()

  useEffect(()=>{
    const getAllClass = async()=> {
        let cl = []
        await db.transaction(async(tx)=>{
            tx.executeSql(`SELECT * from ClassesCreated`,[],
            (tx, results)=>{
                if (results.rows.length>0) {
                    for (let index = 0; index < results.rows.length; index++) {
                        const element = results.rows.item(index)
                        cl.push(element)
                    }
                    setAllClasses(cl)
                }
            })
        })
    }
    if (focused) {
        getAllClass()
    }
  },[focused])
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
                    ListHeaderComponent={
                    <View style={{marginTop: 50, marginBottom:20}}>
                        <Text style={[styles.listText, {textAlign:"center"}]}>Registered Classes on This Device</Text>

                    </View>
                    }
                    ListEmptyComponent={<Text>No Registered Class on this Device</Text>}

                data={allClasses}
                renderItem={({item, index, separators}) => (
                    <TouchableOpacity style={{borderBottomColor:"grey", backgroundColor:"white", borderBottomWidth:.3, paddingVertical:15, paddingHorizontal:5}}
                        key={item.ID}
                        onPress={() => navigation.navigate("Single Class",item)} >
                    <View style={{flexDirection:"row", gap:10, alignItems:"center"}}>
                        <Text style={[styles.listText]}>-{item.Name}</Text>
                        </View>
                </TouchableOpacity>
  )}
/>
        </SafeAreaView>
    )
}  