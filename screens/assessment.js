import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, SafeAreaView, StatusBar, View, ScrollView, FlatList, TouchableHighlight, TouchableOpacity, TextInput, Alert, } from "react-native";
import CheckBox from '@react-native-community/checkbox';
import FeatIcons from 'react-native-vector-icons/Feather'
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

export default Assessment = ({ navigation }) =>{
    const [nominalRoll, setNominalRoll] = useState([])
    const { instrument, className, level, total, instructor, token, api } = useContext(AppContext)
    const [editing, setEditing] = useState(true)
    const [enabled, setEnabled] = useState(true)
    const [content, setContent] = useState('Submit')
    const max = 10
    const [maxScore, setMaxScore] = useState()
    const [prevAss, setPrevAss] = useState()
    const [avail, setAvail] = useState(true)
    const focused = useIsFocused()


    useEffect(()=>{
        const getAssTot = async ()=>{
            let query = `${className}assessmenttaken`
            await db.transaction(async(tx)=>{
                tx.executeSql(`SELECT * FROM ${query}`,[],
                (tx, results)=>{
                    setPrevAss(results.rows.length)
                })
            })
        }

        const getNominalRoll = async ()=>{
            let query = `${className}nominalroll`
            let nom = []
            await db.transaction(async(tx)=>{
                tx.executeSql(`SELECT * FROM ${query}`,[],
                (tx, results)=>{
                    for (let index = 0; index < results.rows.length; index++) {
                        const stud = results.rows.item(index)
                        stud.status='' 
                      nom.push(stud)  
                }
                setNominalRoll(nom)
                })
            })
        }
        const checkAss = async()=>{
            if (className && focused){
                await db.transaction(async(tx)=>{
                     let query = `${className}assessmenttaken`
                     await tx.executeSql(`SELECT * FROM ${query} WHERE Date='${currentDate}'`,[],
                     (tx,results)=>{
                        if(results.rows.length>0)
                        setAvail(false)
                     })
                })
            }
        }
        if (className && focused) {
            getAssTot()
            getNominalRoll()
            checkAss()
        }
    },[className, focused])


    const date = new Date()
    let currentDay= String(date.getDate()).padStart(2, '0');
    let currentMonth = String(date.getMonth()+1).padStart(2,"0");
    let currentYear = date.getFullYear();
    let currentDate = `${currentDay}-${currentMonth}-${currentYear}`; 


    const setStatus = (value,matric) =>{
        const updatedAttendance=nominalRoll.map((student)=>{
            if (student.Matric==matric){
                if (parseInt(value) > parseInt(maxScore)) {
                    Alert.alert("Oops!","Maximum score exceeded")
                    return {...student, status:''}
                } else {
                    return {...student, status:value}
                }
            }
            else{return student}
        })

        setNominalRoll(updatedAttendance)
    }

    const saveAssessment = async ()=>{
       
        nominalRoll.map((person)=>{
            
         db.transaction(async(tx)=>{
                let query = `${className}assessment`
                await tx.executeSql(`SELECT Score from ${query} WHERE Matric='${person.Matric}'`,[],
                (tx, results)=>{
                    if (results.rows.length==1) {
                        let prevScore = JSON.parse(results.rows.item(0).Score)
                        prevScore[`${currentDate}`]=isNaN(parseInt(person.status)) ? 0 : parseInt(person.status)
                        tx.executeSql(`UPDATE ${query} SET Score = '${score}' WHERE Matric='${person.Matric}'`,[],
                        (tx,results)=>{
                            //console.log(results)
                        })
                        
                    } 
                    else {
                        let att = {}
                        att[`${currentDate}`] = isNaN(parseInt(person.status)) ? 0 : parseInt(person.status)
                        let satt= JSON.stringify(att)
                        tx.executeSql(`INSERT INTO ${query} (Name,Matric,Score) Values (?,?,?)`,
                        [person.Name,person.Matric,satt],
                        (tx,results)=>{
                            //console.log(results)
                        })
                    }
                })
            })
        })

        await db.transaction(async(tx)=>{
            let query = `${className}assessmenttaken`
            let date = `${currentDate}`
            await tx.executeSql(`SELECT * FROM ${query} WHERE Date = '${date}'`,[],
            (tx,results)=>{
                if (results.rows.length==0) {
                    tx.executeSql(`INSERT INTO ${query} (Date, Status, Total) Values (?,?,?)`,
                        [date,'Saved',maxScore],
                        (tx,results)=>{
                        })
                }else{
                    tx.executeSql(`UPDATE ${query} SET Total = ${maxScore} WHERE Date = '${date}'`,
                        [],
                        (tx,results)=>{
                        })
                }
            })
        })
        setEditing(false)

    }

    const submitAssessment = async ()=>{
        let Date = `${currentDate}`
        setContent('Submitting...')
        setEnabled(false)
        let payload=[]
        let max = parseInt(maxScore)
        let maxx = {}
        maxx[Date]=max
        nominalRoll.map((person)=>{
        const name = person.Name; const matric = person.Matric;
        let assessment = {}
        assessment[`${Date}`]=isNaN(parseInt(person.status)) ? 0 : parseInt(person.status)
        payload.push({name, matric, assessment})
    })
    try {
        const response = await fetch(
            `${api}/saveAssessment`,
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              password:token,
              payload,
              maxScore:maxx
            })
        });
        const json = await response.json();
        if(json.msg==="Submitted"){
            await db.transaction(async(tx)=>{
                let query = `${className}assessmenttaken`
                await tx.executeSql(`UPDATE ${query} SET Status = 'Submitted' WHERE Date = '${Date}'`,
                        [],
                        (tx,results)=>{
                            console.log(results)
                        })
            })
            Alert.alert("Sucess!","Submitted",[
                {
                    text: "OK",
                    onPress:()=>navigation.navigate('Homepage')
                }
            ])
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

        <View style={[styles.section, styles.sectionElevation, {minHeight:100, width:'auto',  padding: 10, marginBottom:10}]}>
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
                        Total No of Students: 
                    </Text>
                    <Text style={styles.main}>
                        {total ? total : "--"}
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
            </View>

            <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                <View>
                    <Text style={styles.sup}>
                        Max No of Assessment {"\n"}Allowed: 
                    </Text>
                    <Text style={styles.main}>
                        {max}
                    </Text>
                </View>

                   
                <View>
                    <Text style={styles.sup}>
                        No of Assessment {"\n"}Taken 
                    </Text>
                    <Text style={styles.main}>
                        {prevAss ? prevAss : "--"}
                    </Text>
                </View>
            </View>
              
              
              <Text style={styles.sup}>
                Instructors: 
              </Text>
              {instructor ? instructor.map((instructor)=>{
                  return(
                    <Text key={instructor} style={styles.main}>
                        {instructor.trim()}
                    </Text>      
                  )
                }) : <Text>--</Text>}
          </View>

          <View style={[styles.section, styles.sectionElevation, {minHeight:280, width:'auto',  padding: 10, marginBottom:10,flex:1}]} >
            {prevAss < max && avail ? 

            <>
                
            <View style={{flexDirection:"row", justifyContent:"space-between"}}>
               <View>
                    <Text style={{color:"black"}}>
                        Today's Date:
                    </Text>  
                    <Text style={{fontFamily:"futura_medium", fontSize:15, fontWeight:"bold", color: "black"}}>
                        {currentDate}
                    </Text>
                </View> 

                <View style={{alignItems:"flex-end"}}>
                    <Text style={{color:"black", fontFamily:"futura_medium"}}>
                        Max Score:
                    </Text>
                    <TextInput style={{borderColor:"dimgrey", borderWidth:1, height:25, width:40, padding:5, textAlign:"center", fontFamily:"futura_medium" }}
                            keyboardType="numeric"
                            maxLength={2}
                            value={maxScore}
                            editable={editing}
                            onChangeText={(value)=>setMaxScore(value)} />
                </View>
            </View>
                <View style={{flexDirection:"row", marginBottom:5, marginTop:10, borderBottomColor:"grey", borderBottomWidth:1, justifyContent:"space-between"}}>
                    <Text style={styles.headText}>MATRIC NO</Text>
                    <Text style={styles.headText}>NAME</Text> 
                    <Text style={styles.headText}>SCORE</Text>
                </View>
            
            <ScrollView contentInsetAdjustmentBehavior="automatic" style={{marginBottom:10}}>

                    {nominalRoll.map((person)=>{

                return (
                <View key={person.Matric} style={{flexDirection:"row", borderBottomWidth:.3, borderBottomColor:"lightgrey", justifyContent:"space-between", marginBottom:6, paddingBottom:5, alignItems:"center"}}>
                    <View style={{flexDirection:"row", gap:30}}> 
                        <Text style={styles.listText}>{person.Matric}</Text> 
                        <Text style={styles.listText}>{person.Name}</Text>
                    </View>
                    <TextInput style={{borderColor:"dimgrey", borderWidth:1, height:25, width:40, padding:5, textAlign:"center", fontFamily:"futura_medium" }}
                            keyboardType="numeric"
                            maxLength={2}
                            value={person.status}
                            editable={editing && maxScore>0}
                            onChangeText={(value)=>setStatus(value,person.Matric)}
                        /> 
                </View>
                )
            })}

            </ScrollView>
            { editing ?
                <>
                <TouchableOpacity onPress={()=>saveAssessment()} style={{backgroundColor:"green", width:80, padding:7, borderRadius:5, marginTop:5}} disabled={!(editing && maxScore>0)}>
                <Text style={{fontFamily:"futura_medium", color:"white", textAlign:"center"}}>Save</Text>
                </TouchableOpacity>
                </>

                :

                <>
                <TouchableOpacity onPress={()=>setEditing(true)} style={{backgroundColor:"red", width:80, padding:7, borderRadius:5, marginTop:5}}>
                <Text style={{fontFamily:"futura_medium", color:"white", textAlign:"center"}}>Edit</Text>
                </TouchableOpacity>

                <View style={{alignSelf:"flex-end", flexDirection:"row", alignItems:"center", gap:15}}>
                    <TouchableOpacity style={{backgroundColor: enabled ? "green" : 'lightgrey', width:80, padding:7, borderRadius:5, marginTop:5}} onPress={()=>submitAssessment()} disabled={!enabled}> 
                    <Text style={{fontFamily:"futura_medium", color:"white", textAlign:"center"}}>{content}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{backgroundColor:"rgb(80,80,225)", width:80, padding:7, borderRadius:5, marginTop:5}} onPress={()=>navigation.navigate('Homepage')}>
                    <Text style={{fontFamily:"futura_medium", color:"white", textAlign:"center"}}>Done</Text>
                    </TouchableOpacity>
                </View>

                
                </>

            }

                <TouchableOpacity style={{marginTop:8, alignSelf:"flex-end", gap:5, flexDirection:"row", alignItems:'center', padding:5}} onPress={()=>{navigation.navigate("All Assessments")}}>
                <Text style={{fontFamily:"futura_medium", color:"black"}}>All Assessment Taken</Text>
                <FeatIcons name="arrow-right" size={15} color={"black"} />
                </TouchableOpacity>
            </>
            :
            <>
                <Text style={{fontFamily:'futura_book', fontSize:16, textAlign:"center"}}>No More Assessment Allowed</Text>
                <TouchableOpacity style={{marginTop:8, alignSelf:"flex-end", gap:5, flexDirection:"row", alignItems:'center', padding:5}} onPress={()=>{navigation.navigate("All Assessments")}}>
                <Text style={{fontFamily:"futura_medium", color:"black"}}>All Assessment Taken</Text>
                <FeatIcons name="arrow-right" size={15} color={"black"} />
                </TouchableOpacity>
            </>
            }
          </View>

         
                    
        </SafeAreaView>
        </ScrollView>
    )
}