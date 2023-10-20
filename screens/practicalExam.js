import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, Text, SafeAreaView, StatusBar, View, ScrollView, FlatList, TouchableHighlight, TouchableOpacity, TextInput, Alert } from "react-native";
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

export default PracticalExam = ({ navigation }) =>{
    const { instrument, className, level, total, instructor, token, api } = useContext(AppContext)
    const [attendance, setAttendance] = useState([])
    const [editing, setEditing] = useState(true)
    const [maxScore, setMaxScore] = useState('')
    const [content, setContent] = useState('Submit')
    const [enabled, setEnabled] = useState(true)
    const [avail, setAvail] = useState(true)
    const focusedd = useIsFocused()
    
    useEffect(()=>{
        let att = []
        const getPracticalExam = async()=>{
            await db.transaction(async(tx)=>{
                let query=`${className}nominalroll`
                tx.executeSql(`SELECT * from ${query}`,[],
                async(tx,results)=>{
                             for (let index = 0; index < results.rows.length; index++) {
                                let student = results.rows.item(index);
                                await tx.executeSql(`SELECT * from ${className}exam WHERE Matric='${student.Matric}'`,[],(tx,results)=>{
                                    if (results.rows.length==1) {
                                        student['status']=results.rows.item(0).Score
                                        att.push(student)
                                    }
                                    else{
                                        student['status']=''
                                        att.push(student)  
                                    }

                                })
                            }
                            
                            
                        })
                    })
                    setAttendance(att)
                    
                    await db.transaction(async(tx)=>{
                        tx.executeSql(`SELECT Description FROM BasicInfo WHERE Property = 'Exam'`,[],
                        (tx, results)=>{
                            if (results.rows.length==1) {
                                let prop = JSON.parse(results.rows.item(0).Description)
                                let stat = prop[`${className}`]
                                let avail = stat==="Submitted" ? false : true
                                setAvail(avail)
                            }
                            else setAvail(true)
                        })
                    })
        
                    await db.transaction(async(tx)=>{
                        tx.executeSql(`SELECT Description FROM BasicInfo WHERE Property = 'ExamScore'`,[],
                        (tx, results)=>{
                            if (results.rows.length==1) {
                                let prop = JSON.parse(results.rows.item(0).Description)
                                let stat = prop[`${className}`]
                                if (parseInt(stat)>0) {
                                    setEditing(false)
                                }
                                setMaxScore(stat ? stat : 0)
                            }
                            else setMaxScore(0)
                        })
                    })
                }
        
        

        if (className && focusedd ) {
            getPracticalExam()
        }
    },[className, focusedd])

    const date = new Date()
    let currentDay= String(date.getDate()).padStart(2, '0');
    let currentMonth = String(date.getMonth()+1).padStart(2,"0");
    let currentYear = date.getFullYear();
    let currentDate = `${currentDay}-${currentMonth}-${currentYear}`; 


    const setStatus = (value,matric) =>{
        const updatedAttendance=attendance.map((student)=>{
            if (student.Matric==matric){
                if (parseInt(value)>parseInt(maxScore)) {
                    Alert.alert("Oops!","Maximum Score Exceded",)
                    return {...student, status:''}
                } else {
                    return {...student, status:value}
                }
            }
            else{return student}
        })

        setAttendance(updatedAttendance)
    }

    const saveExam = async ()=>{

        attendance.map((person)=>{
            
         db.transaction(async(tx)=>{
                let query = `${className}exam`
                await tx.executeSql(`SELECT Score from ${query} WHERE Matric='${person.Matric}'`,[],
                (tx, results)=>{
                    if (results.rows.length==1) {
                        let exam
                        if (person.status) {
                            exam = isNaN(parseInt(person.status)) ? 0 : parseInt(person.status)
                        }
                        else{ exam =0 }
                        
                        tx.executeSql(`UPDATE ${query} SET Score = ${exam} WHERE Matric='${person.Matric}'`,[],
                        (tx,results)=>{
                            //console.log(results)
                        })
                        
                    } 
                    else {
                        let exam = isNaN(parseInt(person.status)) ? 0 : parseInt(person.status)
                        tx.executeSql(`INSERT INTO ${query} (Name,Matric,Score) Values (?,?,?)`,
                        [person.Name,person.Matric,exam],
                        (tx,results)=>{
                            //console.log(results)
                        })
                    }
                })
            })
        })

        await db.transaction(async(tx)=>{

            await tx.executeSql(`SELECT * FROM BasicInfo WHERE Property = 'Exam'`,[],
            (tx,results)=>{
                if (results.rows.length==0) {
                    let desc={}
                    desc[`${className}`]="Saved"
                    let description = JSON.stringify(desc)
                    tx.executeSql(`INSERT INTO BasicInfo (Property, Description) Values (?,?)`,
                        ['Exam', description],
                        (tx,results)=>{
                        })
                }else{
                    let desc=JSON.parse(results.rows.item(0).Description)
                    desc[`${className}`]="Saved"
                    let description = JSON.stringify(desc)
                    tx.executeSql(`UPDATE BasicInfo SET Description = '${description}' WHERE Property = 'Exam'`,
                        [],
                        (tx,results)=>{
                        })
                }
            })
        })

        await db.transaction(async(tx)=>{

            await tx.executeSql(`SELECT * FROM BasicInfo WHERE Property = 'ExamScore'`,[],
            (tx,results)=>{
                if (results.rows.length==0) {
                    let desc={}
                    desc[`${className}`]=maxScore
                    let description = JSON.stringify(desc)
                    tx.executeSql(`INSERT INTO BasicInfo (Property, Description) Values (?,?)`,
                        ['ExamScore', description],
                        (tx,results)=>{
                        })
                }else{
                    let desc=JSON.parse(results.rows.item(0).Description)
                    desc[`${className}`]=maxScore
                    let description = JSON.stringify(desc)
                    tx.executeSql(`UPDATE BasicInfo SET Description = '${description}' WHERE Property = 'ExamScore'`,
                        [],
                        (tx,results)=>{
                        })
                }
            })
        })
        setEditing(false)

    }

    const submitExam = async ()=>{
        let Date = `${currentDate}`
        setContent('Submitting...')
        setEnabled(false)
        let payload=[]
        let max = parseInt(maxScore)
        let maxx={}
        maxx[Date]=max
        attendance.map((person)=>{
        const name = person.Name; const matric = person.Matric;
        let exam = {}
        exam[`${Date}`]=isNaN(parseInt(person.status)) ? 0 : parseInt(person.status)
        payload.push({name, matric, exam})
    })
    try {
        const response = await fetch(
            `${api}/saveExam`,
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

                await tx.executeSql(`SELECT * FROM BasicInfo WHERE Property = 'Exam'`,[],
                (tx,results)=>{
                    if (results.rows.length==0) {
                        let desc={}
                        desc[`${className}`]="Submitted"
                        let description = JSON.stringify(desc)
                        tx.executeSql(`INSERT INTO BasicInfo (Property, Description) Values (?,?)`,
                            ['Exam', description],
                            (tx,results)=>{
                            })
                    }else{
                        let desc=JSON.parse(results.rows.item(0).Description)
                        desc[`${className}`]="Submitted"
                        let description = JSON.stringify(desc)
                        tx.executeSql(`UPDATE BasicInfo SET Description = '${description}' WHERE Property = 'Exam'`,
                            [],
                            (tx,results)=>{
                            })
                    }
                })
            })
            Alert.alert("Sucess!","Submitted",[
                {
                    text: "OK",
                    onPress:()=>navigation.navigate('Home')
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
                            value={`${maxScore}`}
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

                    {attendance.map((person)=>{
                        
                return (
                <View key={person.Matric} style={{flexDirection:"row", borderBottomWidth:.3, borderBottomColor:"lightgrey", justifyContent:"space-between", marginBottom:6, paddingBottom:5, alignItems:"center"}}>
                    <View style={{flexDirection:"row", gap:30}}> 
                        <Text style={styles.listText}>{person.Matric}</Text> 
                        <Text style={styles.listText}>{person.Name}</Text>
                    </View>
                    <TextInput style={{borderColor:"dimgrey", borderWidth:1, height:25, width:40, padding:5, textAlign:"center", fontFamily:"futura_medium" }}
                            keyboardType="numeric"
                            maxLength={2}
                            value={`${person.status}`}
                            editable={editing && parseInt(maxScore)>0}
                            onChangeText={(value)=>setStatus(value,person.Matric)}
                        /> 
                </View>
                )
            })}

            </ScrollView>
            { !avail ?
                    <>
                        <TouchableOpacity style={{backgroundColor:"red", width:80, padding:7, borderRadius:5, marginTop:5}} disabled={true}>
                            <Text style={{fontFamily:"futura_medium", color:"white", textAlign:"center"}}>Already Submitted</Text>
                        </TouchableOpacity>
                    </>
                    :
                    <>
                        { editing ?
                    <>
                    <TouchableOpacity onPress={()=>saveExam()} style={{backgroundColor:"green", width:80, padding:7, borderRadius:5, marginTop:5}} disabled={!(editing && maxScore>0)}>
                    <Text style={{fontFamily:"futura_medium", color:"white", textAlign:"center"}}>Save</Text>
                    </TouchableOpacity>
                    </>

                    :

                    <>
                    <TouchableOpacity onPress={()=>setEditing(true)} style={{backgroundColor:"red", width:80, padding:7, borderRadius:5, marginTop:5}}>
                    <Text style={{fontFamily:"futura_medium", color:"white", textAlign:"center"}}>Edit</Text>
                    </TouchableOpacity>

                    <View style={{alignSelf:"flex-end", flexDirection:"row", alignItems:"center", gap:15}}>
                        <TouchableOpacity style={{backgroundColor: enabled ? "green" : 'lightgrey', width:80, padding:7, borderRadius:5, marginTop:5}} disabled={!enabled} onPress={()=> submitExam()}>
                        <Text style={{fontFamily:"futura_medium", color:"white", textAlign:"center"}}>{content}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{backgroundColor:"rgb(80,80,225)", width:80, padding:7, borderRadius:5, marginTop:5}} onPress={()=>navigation.navigate('Homepage')}>
                        <Text style={{fontFamily:"futura_medium", color:"white", textAlign:"center"}}>Done</Text>
                        </TouchableOpacity>
                    </View>

                    
                    </>

                }
                    </>
                }
          </View>

         
                    
        </SafeAreaView>
        </ScrollView>
    )
}