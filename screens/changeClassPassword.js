import React, { useContext, useState } from "react";
import { StyleSheet, Text, SafeAreaView, StatusBar, View, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native"
import { db } from "../components/createDBandTable";
import { AppContext } from "../components/appContext";
import DropDownPicker from "react-native-dropdown-picker";

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
      labelText:{
        fontSize:14, 
        letterSpacing:0.5,
        fontFamily:"futura_book",
        color:"black",
        marginLeft:5,
    }
      
}) 

export default ChangeClassPassword = ({ navigation}) =>{
    const { className, instrument, instructor, level, token, api, setToken } = useContext (AppContext)
    const [Instrument, setInstrument] = useState(instrument)
    const [Instructors, setInstructors] = useState(instructor)
    const [Level, setLevel] = useState(level)
    const [editing, setEditing] = useState(true)
    const [lopen, setlOpen] = useState(false);
    const [password, setPassword] = useState("")
    const [cpassword, setCpassword] = useState("")
    const [content, setContent] = useState("Change Password")
    const [enabled, setEnabled] = useState(true) 

    const [litems, setlItems] = useState([
        {label: '100 Level', value: '100l'},
        {label: '200 Level', value: '200l'},
        {label: '300 Level', value: '300l'},
        {label: '400 Level', value: '400l'},
        {label: '500 Level', value: '500l'}
    ]);

    const saveDetails = async()=>{
      if (password!="" && cpassword!="") {
        if (password === cpassword) {
          setEnabled(false)
          setContent("Changing...")
          setEditing(false)
          try {
            const response = await fetch(
              `${api}/changePassword`,
            {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                password:token,
                newPassword:password
              })
          });
          const json = await response.json();
          if (json.token){
            await db.transaction(async(tx)=>{
              await tx.executeSql(`UPDATE ClassesCreated SET Password = '${json.token}' WHERE Name = '${className}'`,
                      [],
                      (tx,results)=>{
                          console.log(results)
                      })
          })
          console.log(json.token)
          setToken(json.token)
          Alert.alert("Success!", "Password has been Changed",[
              {
                  text: "OK",
                  onPress:()=> navigation.navigate('Home')
              }
          ]) 
          }
          } catch (error) {
            setEnabled(true)
            setContent("Change Password")
            Alert.alert(
              'Alert!',
              'Something went wrong!',
          [
          {
           text: 'OK',
           onPress:()=> navigation.navigate('settings')
          },
          ],
      );
          }
          
        } else {
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
        }

      } else {
        Alert.alert(
            'Alert!',
            'All Fields are required',
        [
        {
         text: 'OK',
         style: 'cancel',
        },
        ],
    );
      }
     
    }
    
    
    return(
        <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{flexGrow:1}}  >  
        <SafeAreaView style={styles.mainone}>
            <StatusBar
                animated={true}
                backgroundColor="rgb(80,80,225)"
            />
        
         <View style={[styles.section, styles.sectionElevation, {minHeight:100, padding:10}]}>
            <Text style={styles.sup}>Instrument:</Text>
            <TextInput value={Instrument} editable={false} style={styles.main} onChangeText={(value)=>{setInstrument(value)}}  />

            <Text style={styles.sup}>Instructors:</Text>
            <TextInput value={Instructors ? Instructors.join(',') : ""} editable={false} style={styles.main} onChangeText={(value)=>{setInstructors(value)}}  />

            <Text style={styles.sup}>Level:</Text>
            <DropDownPicker
                open={lopen}
                value ={Level}
                items={litems}
                setOpen={setlOpen}
                setValue={setLevel}
                setItems={setlItems}
                textStyle={styles.labelText}
                style={[styles.labelInput, styles.elevation, {marginBottom:20}]}
                dropDownDirection="TOP"
                disabled={true}                
            />

            <Text style={styles.sup}>New Password:</Text>
            <TextInput value={password} editable={editing} style={styles.main} onChangeText={(value)=>{setPassword(value)}}  />

            <Text style={styles.sup}>Confirm New Password:</Text>
            <TextInput value={cpassword} editable={editing} style={styles.main} onChangeText={(value)=>{setCpassword(value)}}  />
            

                <TouchableOpacity onPress={()=>saveDetails()} style={{backgroundColor: enabled? "green":"lightgrey", width:80, padding:7, borderRadius:5, marginTop:5}} disabled={!enabled}>
                <Text style={{fontFamily:"futura_medium", color:"white", textAlign:"center"}}>{content}</Text>
                </TouchableOpacity>
        </View>       
                    
        </SafeAreaView>
    </ScrollView>
    )
}