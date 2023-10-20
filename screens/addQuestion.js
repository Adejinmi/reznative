import React, { useContext, useState } from "react";
import { StyleSheet, Text, SafeAreaView, StatusBar, View, ScrollView, FlatList, TouchableHighlight, TouchableOpacity, TextInput, Alert } from "react-native";
import CheckBox from '@react-native-community/checkbox';
import FeatIcons from 'react-native-vector-icons/Feather'
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
      },
      sectionElevation:{
        elevation:50,
        shadowColor:'black'
      },
      sup: {
        fontFamily:'futura_medium', fontSize:13,
        marginTop:10,
        
      },
      main:{
        fontFamily:'futura_medium', fontSize:16,
        color: 'black',
        fontWeight:"bold",
        borderBottomColor:"grey",
        borderBottomWidth:.3,
        padding:5,
        marginBottom:20
      },
      options:{
        flexDirection:"row",
        gap:10,
        alignItems:"center",
      },
      optionInput:{
        borderBottomColor:"grey",
        borderBottomWidth:.3,
        fontFamily:"futura_medium",
        padding:5
      },
      
}) 

export default AddQuestion = ({ navigation }) =>{
    const { className } = useContext (AppContext)
    const [question, setQuestion] = useState('')
    const [options, setOptions] = useState({'A':"",'B':"",'C':"",'D':""})
    const [correctOpt, setCorrectopt] = useState('')
    const [editing, setEditing] = useState(true)
    const setOption= (value,option)=>{
      
      options[`${option}`]= value
      setOptions({...options})
    }

    const saveQuestion = async()=>{
        if (question.length<5 || correctOpt.length<1 || options['A']=="" || options['B']=="" || options['C']=="" || options['D']=="" ) {
            Alert.alert("Oops!", "All fields are required")
        } else {
            await db.transaction(async(tx)=>{
              let query = `${className}questionbank`
              let opt = JSON.stringify(options)
              tx.executeSql(`INSERT INTO ${query} (Question, Options, CorrectOption)  Values(?,?,?)`,
              [question,opt,correctOpt],
              (tx, results)=>{
                  console.log(results)
                  setEditing(false)
            })
            })
            
        }
    }
    
    
    return(
        <ScrollView contentInsetAdjustmentBehavior="automatic"  >  
        <SafeAreaView style={styles.mainone}>
            <StatusBar
                animated={true}
                backgroundColor="rgb(80,80,225)"
            />
        
         <View style={[styles.section, styles.sectionElevation, {minHeight:100, padding:10}]}>
            <Text style={styles.sup}>Question:</Text>
            <TextInput value={question} multiline={true} editable={editing} style={styles.main} onChangeText={(value)=>{setQuestion(value)}}  />

            <Text style={styles.sup}>Options</Text>
            <View style={styles.options}> 
              <Text>A:</Text>
              <TextInput value={options['A']} style={styles.optionInput} editable={editing} onChangeText={(value)=>{setOption(value,'A')}} />
            </View>

            <View style={styles.options}>
              <Text>B:</Text>
              <TextInput value={options['B']} style={styles.optionInput} editable={editing} onChangeText={(value)=>{setOption(value,'B')}}/>
            </View>

            <View style={styles.options}>
              <Text>C:</Text>
              <TextInput value={options['C']} style={styles.optionInput} editable={editing} onChangeText={(value)=>{setOption(value,'C')}} />
            </View>

            <View style={styles.options}>
              <Text>D:</Text>
              <TextInput value={options['D']} style={styles.optionInput} editable={editing} onChangeText={(value)=>{setOption(value,'D')}}/>
            </View>

            <View style={[styles.options, {marginTop:20, gap:5}]}>
            <Text style={{paddingVertical:10, fontFamily:"futura_medium", fontWeight:"bold", color:"green", }}>Correct Answer: </Text>
            <TextInput value={correctOpt} style={{fontFamily:"futura_medium", color:"green", fontWeight:"bold", borderBottomColor:"grey", borderBottomWidth:.3, padding:0}} editable={editing} onChangeText={(value)=>{setCorrectopt(value)}} />

            </View>
            { editing ?
                <>
                <TouchableOpacity onPress={()=>saveQuestion()} style={{backgroundColor:"green", width:80, padding:7, borderRadius:5, marginTop:5}}>
                <Text style={{fontFamily:"futura_medium", color:"white", textAlign:"center"}}>Save</Text>
                </TouchableOpacity>

                </>

                :

                <>
                <TouchableOpacity onPress={()=>setEditing(true)} style={{backgroundColor:"red", width:80, padding:7, borderRadius:5, marginTop:5}}>
                <Text style={{fontFamily:"futura_medium", color:"white", textAlign:"center"}}>Edit</Text>
                </TouchableOpacity>  

                <TouchableOpacity onPress={()=>navigation.navigate('Question Bank')} style={{backgroundColor:"rgb(80,80,225)", width:80, padding:7, borderRadius:5, marginTop:5, alignSelf:"flex-end"}}>
                <Text style={{fontFamily:"futura_medium", color:"white", textAlign:"center", }}>Done</Text>
                </TouchableOpacity>               
                </>

            }
        </View>       
                    
        </SafeAreaView>
    </ScrollView>
    )
}