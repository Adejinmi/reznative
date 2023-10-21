import React, { useState, createContext, useReducer } from "react";
import SQLite from 'react-native-sqlite-storage'
export const db = SQLite.openDatabase(
    {
        name:"esmsuite",
        location:"default"
    },
    ()=>{},
    error => {console.log(error)}
);



export const checkTable = () =>{
    db.transaction((tx)=>{
        tx.executeSql(`CREATE TABLE`)
    })
}

export const StartContext = createContext()

const StartContextProvider =(props)=>{
    const api = 'https://rezupapi.onrender.com/api'
    const [unit, setUnit] = useState()
    const [instrument, setcInstrument] = useState()
    const [pin, setPin] = useState()
    const [cpin, setCPin] = useState()
    const [pass, setPass] = useState()
    const [level, setLevel] = useState()
    const [instructor, setInstructor] = useState()
 

    return(
        <StartContext.Provider value={{ unit, setUnit, instrument, setcInstrument, pin, setPin, cpin, setCPin, pass, setPass, instructor, setInstructor, level, setLevel, api }}>
            {props.children}
        </StartContext.Provider>
    )
}

export default StartContextProvider