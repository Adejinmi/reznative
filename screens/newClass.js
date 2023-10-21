import React, { useState, useContext } from "react";
import { SafeAreaView, StyleSheet, View, TextInput, Image, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import Ico  from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/Feather'
import DropDownPicker from "react-native-dropdown-picker";
import { AppContext } from "../components/appContext";
import { db } from "../components/createDBandTable";

const styles = StyleSheet.create({
    main:{
        flex: 1,
        alignItems:"center",  
        justifyContent:"center",
        backgroundColor:"white"
    },
    view:{
        width:"100%",
        paddingHorizontal:15,
        height:"100%",
        justifyContent:"center",
    },
    icon:{
        width:18,
        resizeMode:'contain' 
    },
    label:{
        flexDirection:"row",
        width:"100%",
    },
    elevation: {
        elevation: 50,
        shadowColor: 'black',
      },
    header:{
        fontSize:20,
        color:"black",
        textAlign:"center",
        letterSpacing:0.3,
        marginVertical:10,
        fontFamily:"futura_medium",
    },
    labelInput:{
        borderWidth:1,
        borderColor: "lightgrey",
        borderRadius:5,
        paddingVertical: 8,
        paddingHorizontal:10,
        letterSpacing:0.5,
        marginBottom:10,
        marginTop:3,
        backgroundColor:"white"
    },
    labelText:{
        fontSize:16, 
        letterSpacing:0.5,
        fontFamily:"futura_light",
        color:"black",
        marginLeft:5,
    },
    sub:{
        fontSize:12,
        color: "orange",
        marginTop:0,  
    },
    submit:{
        backgroundColor:"rgb(80,80,255)",
        padding:20,
        borderRadius:10,
        width:"50%",
        textAlign:"center",
        alignSelf:"center",
        marginVertical:15,
    },
    cont:{
        flexDirection:"row",
        width:"100%",
        borderWidth:1,
        borderColor: "lightgrey",
        borderRadius:5,
        paddingHorizontal:10,
        letterSpacing:0.5,
        marginBottom:10,
        marginTop:3,
        backgroundColor:"white"
    }

})

export default function NewClass({ navigation }){
    const { setClassName, api } = useContext(AppContext)
    const [content, setContent] = useState('Create Class')
    const [enabled, setEnabled] = useState(true)
    const [poutline,setpOutline] = useState('rgba(225,225,225,1)')
    const [src,setSource] = useState(require('../images/eye.png'))
    const [password,setPassword] = useState('')
    const [cpoutline,setcpOutline] = useState('rgba(225,225,225,1)')
    const [csrc,setcSource] = useState(require('../images/eye.png'))
    const [open, setOpen] = useState(true)
    const [copen, setcOpen] = useState(true)
    const [lopen, setlOpen] = useState(false);
    const [lvalue, setlValue] = useState(null);
    const [litems, setlItems] = useState([
        {label: '100 Level', value: '100l'},
        {label: '200 Level', value: '200l'},
        {label: '300 Level', value: '300l'},
        {label: '400 Level', value: '400l'},
        {label: '500 Level', value: '500l'}
    ]);
    const [uopen, setuOpen] = useState(false);
    const [uvalue, setuValue] = useState(null);
    const [uitems, setuItems] = useState([
        {label: 'Guitar', value: 'guitar'},
        {label: 'Orchestra', value: 'orchestra'},
        {label: 'Piano', value: 'piano'},
        {label: 'Saxophone', value: 'saxophone'},
    ]);
    const [instrument, setInstrument] = useState('')
    const [instructors, setInstructors] = useState('')
    const [passwordMatch, setPMatch] = useState(false)


    const lockChange=()=>{
        setOpen(open ? false : true);
        setSource (open ? require('../images/openeye.png') : require('../images/eye.png'))  
    }
    const clockChange=()=>{
        setcOpen(copen ? false : true);
        setcSource (copen ? require('../images/openeye.png') : require('../images/eye.png'))  
    }
    const showAlert = () =>
        Alert.alert(
            'Alert!',
            'All Input Fields are Required',
        [
        {
         text: 'OK',
         style: 'cancel',
        },
        ],
    );

    const showPAlert = () =>
        Alert.alert(
            'Alert!',
            'Password does not match',
        [
        {
         text: 'OK',
         style: 'cancel',
        },
        ],
    );
    const confirmPassword = (e) =>{
        setPMatch((password===e ? true : false))
    }

    const classCreate = async ()=>{
            setEnabled(false)
            setContent('Creating Class...')
            if (instrument==="" || instructors==="" || lvalue===null || uvalue===null) {
                showAlert();
            } 
            else{
                if (password===""|| !passwordMatch) {
                    showPAlert()
                }
                else{
                    try {
                        const response = await fetch(
                            `${api}/createClass`,
                          {
                            method: 'POST',
                            headers: {
                              Accept: 'application/json',
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              unit:uvalue.trim(),
                              level:lvalue.trim(),
                              instructor:instructors.trim(),
                              instrument: instrument.trim(),
                              pass:password.trim()
                            })
                        });
                        const json = await response.json();
                        if (json.payload) {
                            const { className, instrument, instructor, password, level, unit } = json.payload
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

                            await db.transaction(async (tx)=>{
                                await tx.executeSql(`INSERT INTO ClassesCreated (Name,Password,Instructors,Instrument,Unit,Level) VALUES (?,?,?,?,?,?)`,
                                [className,password,instructor,instrument,unit,level],
                                ()=>{},
                                error=>{console.log(error)}
                                )
                            })
                            setClassName(className)
                            Alert.alert('Success','Class Created',[{
                                text: "OK",
                                onPress:()=>navigation.navigate('Home')
                            }])
                        }
                        else if(json.msg==="Class Exists"){
                            setEnabled(true)
                            setContent("Create Class")
                            return Alert.alert("Oops!","This Class Exists Already")
                        }
                        else {
                            setEnabled(true)
                            setContent("Create Class")
                            return Alert.alert("Oops!","Something went wrong, Try again")
                        }
                      } catch (error) {
                        setEnabled(true)
                        setContent("Create Class")
                        return Alert.alert("Oops!","Check your Internet Connection and try again")
                      }                   
                }
            }   
        }

    return(
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{flexGrow:1}} >
    <SafeAreaView style={styles.main}>
        <View style={[styles.view]}>
           <View style={{textAlign:"center", alignItems:"center"}}>
               <Text style={styles.header}> New Class</Text>
            </View> 
            
            
            <View style={[styles.label]}>
            <Ico name="note" size={18} color="rgb(80,80,255)"/>
                <Text style={styles.labelText}>Instrument</Text>
            </View>
            <TextInput style={[styles.labelInput, styles.elevation]} value={instrument} onChangeText={(e)=>{setInstrument(e)}} />

            <View style={styles.label}>
                <Icon2 name="users" size={18} color="rgb(80,80,255)"/>
                <Text style={styles.labelText} >Instructor(s)</Text>
            </View>
            <Text style={styles.sub}>(Separated by a comma)</Text>
            <TextInput style={[styles.labelInput, styles.elevation]} value={instructors} onChangeText={(e)=>{setInstructors(e)}} />

            <View style={{flexDirection:"row"}}>
            <View style={{width:"47%"}}>
            <View style={styles.label}>
                <Ico name="graduation-cap" size={18} color="rgb(80,80,255)"/>
                <Text style={styles.labelText}>Level</Text>
            </View>
            <DropDownPicker
                open={lopen}
                value ={lvalue}
                 items={litems}
                setOpen={setlOpen}
                setValue={setlValue}
                setItems={setlItems}
                textStyle={styles.labelText}
                style={[styles.labelInput, styles.elevation, {marginBottom:20}]}
                dropDownDirection="TOP"
                
            />
            </View>
            <View style={{width:"47%", marginLeft:"6%"}}>
            <View style={styles.label}>
                <Icon name="chain" size={18} color="rgb(80,80,255)"/>
                <Text style={styles.labelText}>Unit</Text>
            </View>
            <DropDownPicker
                open={uopen}
                value ={uvalue}
                 items={uitems}
                setOpen={setuOpen}
                setValue={setuValue}
                setItems={setuItems}
                textStyle={styles.labelText}
                style={[styles.labelInput, styles.elevation]}
                dropDownDirection="TOP"
            />
            </View>
            </View>
            <View style={styles.label}>
                <Ico name="key" size={18} color="rgb(80,80,255)"/>
                <Text style={[styles.labelText, styles.elevation]}>Password</Text>
            </View>
            
            <View style={[styles.cont, {borderColor:poutline}]}>
                <TextInput style={{flex:3}} secureTextEntry={open} autoComplete='off' value={password} onChangeText={(e)=>{setpOutline('rgba(225,225,225,1)'); setPassword(e); setPMatch(false)}} ></TextInput>
                <TouchableOpacity onPress={()=> {lockChange()}} style={{alignSelf:"center"}}>
                    <Image source={src} style={{marginRight:0,}} />
                </TouchableOpacity>
            </View>

            <View style={styles.label}>
                <Ico name="key" size={18} color="rgb(80,80,255)"/>
                <Text style={[styles.labelText, styles.elevation]}>Confirm Password</Text>
            </View>

            <View style={[styles.cont, {borderColor:cpoutline}]}>
                <TextInput style={{flex:3}} secureTextEntry={copen} autoComplete='off' onChangeText={(e)=>{setcpOutline('rgba(225,225,225,1)'); confirmPassword(e)}} ></TextInput>
                <TouchableOpacity onPress={()=> {clockChange()}} style={{alignSelf:"center"}}>
                    <Image source={csrc} style={{marginRight:0,}} />
                </TouchableOpacity>
            </View>

        <TouchableOpacity style={[styles.submit, styles.elevation]} onPress={()=>classCreate()} disabled={!enabled}>
            <Text style={{textAlign:"center", fontSize:17, color:"white",fontFamily:"futura_light"}}>{content}</Text>
        </TouchableOpacity>
        </View>

        
    </SafeAreaView>
    </ ScrollView>
    )
}