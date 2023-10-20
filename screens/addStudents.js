import React, { useState,useContext } from "react";
import { StyleSheet, Text, SafeAreaView, StatusBar, View, ScrollView, TouchableOpacity, Alert, TextInput } from "react-native";
import { db } from "../components/createDBandTable";
import { AppContext } from "../components/appContext";

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
        minHeight:80,
        marginVertical:8
      },
      text:{
        fontFamily:"futura_book",
        color: "black"
      },
      button:{
        padding:10,
        alignSelf:"flex-end"
      }
}) 

export default AddStudents = ({ navigation }) =>{
    const [details, setDetails] = useState('')
    const [students, setStudents] = useState([])
    const [isPreview, setPreview] = useState(false)
    const { className, focused, setFocused } = useContext(AppContext)
    
    const addStudents = async()=>{
        await db.transaction(async(tx)=>{
            let query = `${className}nominalroll`
            students.forEach(async element => {
                let found = false
                await tx.executeSql(`SELECT * from ${query} WHERE Matric='${element.matric}'`,[],
                (tx,results)=>{
                    if(results.rows.length>0){
                        Alert.alert('Alert!', `${element.name} with Matric number ${element.matric} was not added because ${results.rows.item(0).Name} has the same Matric number`,[
                            {
                                text:'Okay',
                                onPress: () => navigation.navigate('Nominal Roll')
                            }
                        ])
                    }
                    else{
                        tx.executeSql(`INSERT into ${query} (Matric, Name) VALUES (?,?)`,[element.matric, element.name],
                            (tx,results)=>{
                                console.log(results.rows)
                    })
                    }

                })  
            })
        }) 
        Alert.alert('Alert!', 'Students Added',[
            {
                text:'Okay',
                onPress: () => {setFocused(!focused); navigation.navigate('Nominal Roll')}
            }
        ])
    }

    const preview = ()=>{
        let students=[]
            if(details.length!=0){
                const stud=details.trim().split(".")
                stud.forEach(element => {
                    if (element.length!=0) {
                        const student=element.split(",")
                        students.push({name:student[0].trim(), matric:student[1].trim()})                 
                    }
                });

                setStudents(students)
                setPreview(true)
            }
            
        
    }

    return(
        <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{flexGrow:1}}>
        <SafeAreaView style={styles.mainone}>
            <StatusBar
                animated={true}
                backgroundColor="rgb(80,80,225)"
            />

        <View style={[styles.section, styles.sectionElevation, {minHeight:200}]}>
            <Text style={[styles.text, {fontSize:16, paddingVertical:2, fontWeight:"bold"}]}>Enter Students' Details </Text>
            <Text style={[styles.text, {fontSize:12, paddingVertical:1}]}>Students' details are Separated by a comma (,)</Text>
            <Text style={[styles.text, {fontSize:12, paddingVertical:1}]}>Students are seperated by a full stop (.)</Text>
            <TextInput multiline={true} style={styles.input} value={details} onChangeText={(e)=>{setDetails(e); setPreview(false)}} />

            <TouchableOpacity style={[styles.button, {backgroundColor:'green'}]} onPress={preview}>
                <Text style={[styles.text, {color:'white'}]}>Preview</Text>
            </TouchableOpacity>
        </View>

        {isPreview ? 
                
            <ScrollView style={[styles.section, styles.sectionElevation, {marginTop:10}]}>
                <Text style={[styles.text, {fontSize:15, fontWeight:"bold"}]}>Preview before Saving</Text>
                <View style={{flexDirection:"row", gap:50}}>
                    <Text style={[styles.text, {fontSize:14, }]}>Matric Number</Text>
                    <Text style={[styles.text, {fontSize:14, }]}>Name</Text>
                </View>
                {
                    students.map((student)=>{
                        return(
                            <View key={student.matric} style={{flexDirection:"row", gap:50, paddingVertical:6, paddingHorizontal:0}}>
                                <Text style={[styles.text, {fontSize:15}]}>{student.matric}</Text>
                                <Text style={[styles.text, {fontSize:15}]}>{student.name}</Text>
                            </View>
                        )
                    })
                }

            <TouchableOpacity style={[styles.button, {backgroundColor:'green'}]} onPress={addStudents}>
                <Text style={[styles.text, {color:'white'}]}>Add Students</Text>
            </TouchableOpacity>
            </ScrollView>
            :
            <></>
        }
                    
        </SafeAreaView>
    </ScrollView>
    )
}