import React, { useContext, useState } from "react";
import { StyleSheet, Text, SafeAreaView, StatusBar, View, ScrollView, FlatList, TouchableHighlight, TouchableOpacity, TextInput } from "react-native"
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

export default EditClass = ({ navigation}) =>{
    const { className, instrument, instructor, level } = useContext (AppContext)
    const [Instrument, setInstrument] = useState(instrument)
    const [Instructors, setInstructors] = useState(instructor)
    const [Level, setLevel] = useState(level)
    const [editing, setEditing] = useState(true)
    const [lopen, setlOpen] = useState(false);

    const [litems, setlItems] = useState([
        {label: '100 Level', value: '100l'},
        {label: '200 Level', value: '200l'},
        {label: '300 Level', value: '300l'},
        {label: '400 Level', value: '400l'},
        {label: '500 Level', value: '500l'}
    ]);

    const saveDetails = async()=>{
     
      setEditing(false)
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
            <TextInput value={Instrument} editable={editing} style={styles.main} onChangeText={(value)=>{setInstrument(value)}}  />

            <Text style={styles.sup}>Instructors:</Text>
            <TextInput value={Instructors ? Instructors.join(',') : ""} editable={editing} style={styles.main} onChangeText={(value)=>{setInstructors(value)}}  />

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
                disabled={!editing}                
            />

            

            { editing ?
                <>
                <TouchableOpacity onPress={()=>saveDetails()} style={{backgroundColor:"green", width:80, padding:7, borderRadius:5, marginTop:5}}>
                <Text style={{fontFamily:"futura_medium", color:"white", textAlign:"center"}}>Save</Text>
                </TouchableOpacity>

                </>

                :

                <>
                <TouchableOpacity onPress={()=>setEditing(true)} style={{backgroundColor:"red", width:80, padding:7, borderRadius:5, marginTop:5}}>
                <Text style={{fontFamily:"futura_medium", color:"white", textAlign:"center"}}>Edit</Text>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={()=>navigation.navigate("settings")} style={{backgroundColor:"rgb(80,80,225)", width:80, padding:7, borderRadius:5, marginTop:5, alignSelf:"flex-end"}}>
                <Text style={{fontFamily:"futura_medium", color:"white", textAlign:"center"}}>Done</Text>
                </TouchableOpacity>                 
                </>

            }
        </View>       
                    
        </SafeAreaView>
    </ScrollView>
    )
}