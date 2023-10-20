import React, { useState,useContext } from "react";
import { StyleSheet, Text, SafeAreaView, StatusBar, View, ScrollView, TouchableOpacity, Alert, TextInput } from "react-native";
import { db } from "../components/createDBandTable";
import { AppContext } from "../components/appContext";

const styles = StyleSheet.create({
    mainone:{
        flex:1,
        backgroundColor:'rgba(255,255,253,1)', 
        paddingVertical:10,    
        letterSpacing:0.5,
        paddingHorizontal:15,
        justifyContent:"center",
        alignItems:"center"
    },
    section:{
        backgroundColor:"white",
        borderRadius:10,
        padding:10
      },
      sectionElevation:{
        elevation:50,
        shadowColor:'black'
      },
      input:{
        borderColor:"lightgrey",
        borderWidth:1,
        borderRadius:5,
        paddingVertical:10,
        marginVertical:8,
        fontFamily:"futura_book"
      },
      text:{
        fontFamily:"futura_book",
        color: "black"
      },
      button:{
        padding:10,
     }
}) 

export default SingleStudent = ({ route, navigation }) =>{
    const { ID, Name, Matric } = route.params
    const [name, setName] = useState(Name)
    const [matric, setMatric] = useState(Matric)
    const { className, focused, setFocused } = useContext(AppContext)
    
    const editStudent = async()=>{
        await db.transaction(async(tx)=>{
            let query = `${className}nominalroll`
            
               await tx.executeSql(`UPDATE ${query} SET Name = '${name}', Matric = '${matric}' WHERE ID=${ID}`,[],
                (tx,results)=>{
                    if (results.rowsAffected===1) {
                        Alert.alert('Alert!', 'Student Details Updated',[
                            {
                                text:'Okay',
                                onPress: () => setFocused(!focused)
                            }
                        ])
                    }
                })  
            })
           
        
    } 
    
    const deleteStudent = ()=>{
        const deleteStud = async()=>{
            await db.transaction(async(tx)=>{
                let query = `${className}nominalroll`
                   await tx.executeSql(`DELETE FROM ${query} WHERE ID=${ID}`,[],
                    (tx,results)=>{
                        if (results.rowsAffected===1) {
                            Alert.alert('Alert!', 'Student Deleted',[
                                {
                                    text:'Okay',
                                    onPress: () => setFocused(!focused)
                                }
                            ])
                        }
                    })  
                })
        } 
           
        Alert.alert('Alert!', 'Are you sure you want to Delete?',[
            {
                text:'Yes',
                onPress: () => deleteStud()
            }
        ])
    } 
        

    return(
        <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{flexGrow:1}}>
        <SafeAreaView style={styles.mainone}>
            <StatusBar
                animated={true}
                backgroundColor="rgb(80,80,225)"
            />

        <View style={[styles.section, styles.sectionElevation, {minHeight:200, minWidth:300}]}>
            <Text style={[styles.text, {fontWeight:"bold"}]}>Name:</Text>
            <TextInput style={styles.input} value={name} onChangeText={(e)=>{setName(e)}} />

            <Text style={[styles.text, {marginTop:10, fontWeight:"bold"}]}>Matric Number:</Text>
            <TextInput style={styles.input} value={matric} onChangeText={(e)=>{setMatric(e)}} />

        <View style={{flexDirection:"row", justifyContent:"space-between"}}>
            <TouchableOpacity style={[styles.button, {backgroundColor:'red'}]} onPress={deleteStudent}>
                <Text style={[styles.text, {color:'white'}]}>Delete</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, {backgroundColor:'green'}]} onPress={editStudent}>
                <Text style={[styles.text, {color:'white'}]}>Save</Text>
            </TouchableOpacity>
        </View>
        </View>

                           
        </SafeAreaView>
    </ScrollView>
    )
}