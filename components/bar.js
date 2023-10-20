import React, { useState } from "react";
import { View, TextInput, StyleSheet, Switch, Pressable, Text } from "react-native";
import { levelOptions, semOptions, yearOptions, deptOptions,} from "./options";
import { SelectList } from "react-native-dropdown-select-list";


const styles = StyleSheet.create({
    main:{
        flex:1,
        backgroundColor:'rgba(229 231 235,1)',
        alignItems:'center',  
        paddingVertical:10,     
    },
    input:{
        paddingHorizontal:10,
        paddingVertical:5,
        borderTopLeftRadius:8,
        borderBottomLeftRadius:8,      
        flex:3,
        backgroundColor:'white'
    },
    section:{
        width: '100%',
        padding:5,
        elevation:5
    },
    drop:{
        backgroundColor:'white', width:'70%', borderRadius:3, marginBottom:3, marginTop:0, borderColor:'white',
    },
    box:{
        borderRadius:3, width:'70%', backgroundColor:'white', borderColor:'white', marginVertical:2,
        zIndex:-1000        
    },
    item:{
        backgroundColor:'white',
    }
})

export default Bar = ({ setRecord, setDetails}) =>{
    
    const [level, setLevel] = useState(levelOptions[0]);
    const [dept, setDept] = useState(deptOptions[0]);
    const [sem, setSem] = useState(semOptions[0]);
    const [year, setYear] = useState(yearOptions[0]);
    const [checked, setCheck]= useState(false)
    const [query, setQuery] = useState('')

    const clearFilter = ()=>{
        
        console.log();
            setRecord()
            setYear(yearOptions[0])
            setLevel(levelOptions[0])
            setSem(semOptions[0])
            setDept(deptOptions[0]) 
      }

    return(
  
    <View style={[styles.section]}>
                <View style={{flexDirection:'row', alignItems:'center',
                justifyContent:'flex-start',
                marginBottom:10}}>
                <Switch value={checked} onValueChange={(e)=>setCheck(e)}/>
                <Text style={{letterSpacing:0.5, fontWeight:'400'}}>Search By Name</Text>
                </View>
              <View style={{flexDirection:'row'}}>
                <View style={styles.input}>            
                    <TextInput style={{width:'100%', fontSize:16, letterSpacing:0.5}}placeholder={(checked ? 'Name' : 'Matric Number')} value={query} onChangeText={(e)=>setQuery
                    (e)}/>
              </View>
              <Pressable style={{backgroundColor:'#7dcfb6', borderTopRightRadius:8, borderBottomRightRadius:8}}>
                <Text style={{color:'white',
                paddingHorizontal:20,
                paddingVertical:20, 
                 fontWeight:'400',}}>Search</Text>
              </Pressable>
              </View>

              <View style={{flexDirection:'row', marginTop:15}}>
                <Text style={{flex:3}}>Filters - <Text style={{fontSize:12, fontWeight:'400', color:'#7dcfb6'}}>You must select at least Year, Semester and Level</Text></Text>
                <Pressable styles={{}} onPress={clearFilter}>
                    <Text style={{padding:10, 
                    backgroundColor:'#7dcfb6',
                    color:'white', fontSize:13}}>
                        Clear Filters
                    </Text>
                </Pressable>
              </View>

              <View>
                <SelectList data={yearOptions} defaultOption={year} style={styles.drop} setSelected={(e)=>setYear(e)} boxStyles={styles.box} dropdownStyles={styles.drop} dropdownItemStyles={styles.item} search={false}/>

                <SelectList data={semOptions}  defaultOption={sem} style={styles.drop} setSelected={(e)=>setYear(e)} boxStyles={styles.box} dropdownStyles={styles.drop} search={false}/>
                
                <SelectList data={levelOptions} defaultOption={level} style={styles.drop} setSelected={(e)=>setYear(e)} boxStyles={styles.box} dropdownStyles={styles.drop} search={false}/>
                
                <SelectList data={deptOptions} defaultOption={dept} style={styles.drop} setSelected={(e)=>setYear(e)} boxStyles={styles.box} dropdownStyles={styles.drop} search={false}/>
                
              </View>
              

                
            </View>
    )
}