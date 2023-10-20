import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, Text, SafeAreaView, StatusBar, View, FlatList, TouchableOpacity, TextInput, Alert } from "react-native";
import { AppContext } from "../components/appContext";
import { useIsFocused } from "@react-navigation/native";
import Prompt from 'react-native-prompt-crossplatform';
import { GenContext } from "../components/genContext";
import { db } from "../components/createDBandTable";

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

export default RetrieveClass = ({ navigation })=>{
    const { api } = useContext(GenContext) 
    const [allClasses, setAllClasses] = useState([])
    const focused = useIsFocused()
    const [className, setClassName] = useState()
    const [password, setPassword] = useState()
    const [visible, setVisible] = useState(false)
    const [refresh, setRefresh] = useState(true)
    const [token, setToken] = useState()
    const [studs, setStuds] = useState()
    const [content, setContent] = useState("Submit")

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
    setPassword()
    try {
        const response = await fetch(
            `${api}/retrieveClass`,
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
        console.log(json.allEx)
        if (json.details && json.nominalroll && json.allAtt && json.allAttTak && json.allAss && json.assTak && json.allEx && json.exTak) {
            const {className, instrument, instructor, level, unit, token} = json.details
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
                [className,token,instructor,instrument,unit,level],
                ()=>{},
                error=>{console.log(error)}
                )
            })

            json.nominalroll.forEach(async(element) => {
                let query = `${className}nominalroll`
                const { name, matric} = element
                await db.transaction(async(tx)=>{
                    await tx.executeSql(`INSERT INTO ${query} (Name,Matric) VALUES (?,?)`,
                    [name,matric],
                    ()=>{},
                    error=>{console.log(error)}
                    )
                })
                
            });

            json.allAtt.forEach(async(element) => {
                let query = `${className}attendance`
                const { name, matric} = element
                const attendance = element.att
                await db.transaction(async(tx)=>{
                    await tx.executeSql(`INSERT INTO ${query} (Name,Matric,Attendance) VALUES (?,?,?)`,
                    [name,matric,attendance],
                    ()=>{},
                    error=>{console.log(error)}
                    )
                })
            });

            json.allAttTak.forEach(async(element) => {
                let query = `${className}attendancetaken`
                const { date, present, absent} = JSON.parse(element)
                const status = "Submitted"
                await db.transaction(async(tx)=>{
                    await tx.executeSql(`INSERT INTO ${query} (Date,Present,Absent,Status) VALUES (?,?,?,?)`,
                    [date,present,absent,status],
                    ()=>{},
                    error=>{console.log(error)}
                    )
                })
            });

            json.allAss.forEach(async(element) => {
                let query = `${className}assessment`
                const { name, matric} = element
                const assessment = (element.ass)
                await db.transaction(async(tx)=>{
                    await tx.executeSql(`INSERT INTO ${query} (Name,Matric,Score) VALUES (?,?,?)`,
                    [name,matric,assessment],
                    ()=>{},
                    error=>{console.log(error)}
                    )
                })
            });

            json.assTak.forEach(async(element) => {
                let query = `${className}assessmenttaken`
                let resp = JSON.parse(element)
                for (let index = 0; index < Object.keys(resp).length; index++) {
                    const date = (Object.keys(resp)[index])
                    const total = parseInt(Object.values(resp)[index])
                    const status = "Submitted"
                    await db.transaction(async(tx)=>{
                        await tx.executeSql(`INSERT INTO ${query} (Date,Total,Status) VALUES (?,?,?)`,
                        [date,total,status],
                        ()=>{},
                        error=>{console.log(error)}
                        )
                    })                
                }
                
            });

            json.allEx.forEach(async(element) => {
                let query = `${className}exam`
                const { name, matric, ex} = element
                const exa = JSON.parse(ex)
                const exam = parseInt(Object.values(exa)[0])
                await db.transaction(async(tx)=>{
                    await tx.executeSql(`INSERT INTO ${query} (Name,Matric,Score) VALUES (?,?,?)`,
                    [name,matric,exam],
                    ()=>{},
                    error=>{console.log(error)}
                    )
                })
            });

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

            await db.transaction(async(tx)=>{

                await tx.executeSql(`SELECT * FROM BasicInfo WHERE Property = 'ExamScore'`,[],
                (tx,results)=>{
                    if (results.rows.length==0) {
                        let desc={}
                        desc[`${className}`]= json.exTak[Object.keys(json.exTak)[0]]
                        let description = JSON.stringify(desc)
                        tx.executeSql(`INSERT INTO BasicInfo (Property, Description) Values (?,?)`,
                            ['ExamScore', description],
                            (tx,results)=>{
                            })
                    }else{
                        let desc=JSON.parse(results.rows.item(0).Description)
                        desc[`${className}`]=json.exTak[Object.keys(json.exTak)[0]]
                        let description = JSON.stringify(desc)
                        tx.executeSql(`UPDATE BasicInfo SET Description = '${description}' WHERE Property = 'ExamScore'`,
                            [],
                            (tx,results)=>{
                            })
                    }
                })
            })
        
        navigation.navigate("Set Pin")
            
        } else {
            setPassword()
            setContent('Submit')
            return Alert.alert("Oops!","Wrong Password!")
        }
        
        
    } catch (error) {
            setContent('Submit')
            Alert.alert("Oops!","Check your Internet Connection and Try Again!")
        
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
                                    setContent('...')
                                 authenthicate()
                                }}
                                primaryColor='rgb(80,80,225)'
                                headingStyle={{fontFamily:"futura_book", fontSize:14}}
                                btnStyle={{backgroundColor:"green", width: 140, margin: 8, textAlign:"center", borderRadius:10}}
                                promptBoxStyle={{flexDirection: "column", justifyContent:"center", alignItems:"center", }}
                                inputStyle={{fontFamily:"futura_book", fontSize:15,margin:0, marginBottom:-20}}
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