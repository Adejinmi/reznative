import React, { useState, createContext, useReducer, useEffect } from "react";
import SQLite from 'react-native-sqlite-storage'
import { db } from "./createDBandTable";
import { useIsFocused } from "@react-navigation/native";



export const checkTable = () =>{
    db.transaction((tx)=>{
        tx.executeSql(`CREATE TABLE`)
    })
}

export const AppContext = createContext()

const AppContextProvider =(props)=>{
    const api = 'https://rezupapi.onrender.com/api'
    const [firstRun, setFirstrun]=useState(true)
    const [className, setClassName]=useState()
    const [instrument, setInstrument] = useState()
    const [level, setLevel] = useState()
    const [total, setTotal] = useState()
    const [instructor, setInstructor] = useState()
    const [token, setToken] = useState()
    const [focused, setFocused] = useState(true)
 
    useEffect(()=>{
        const getProps = async ()=>{
                await db.transaction(async(tx)=>{
                    await tx.executeSql(`SELECT * FROM ClassesCreated ORDER BY ID DESC LIMIT 1`,[],
                     (tx, results)=>{
                        setInstrument(results.rows.item(0).Instrument)
                        setClassName(results.rows.item(0).Name)
                        setLevel(results.rows.item(0).Level)
                        setInstructor(results.rows.item(0).Instructors.split(","))
                        setToken(results.rows.item(0).Password)
                        let nname=`${results.rows.item(0).Name}nominalroll`
                        tx.executeSql(`SELECT DISTINCT Matric FROM ${nname}`,[],
                        (tx, results)=>{
                            setTotal(results.rows.length)
                        })
                    })
                 })  
            }
            const getClassProps = async ()=>{
                await db.transaction(async(tx)=>{
                    let query = `${className}`
                    await tx.executeSql(`SELECT * FROM ClassesCreated WHERE Name = '${query}'`,[],
                     (tx, results)=>{
                        setInstrument(results.rows.item(0).Instrument)
                        setLevel(results.rows.item(0).Level)
                        setInstructor(results.rows.item(0).Instructors.split(","))
                        setToken(results.rows.item(0).Password)
                        let nname=`${results.rows.item(0).Name}nominalroll`
                        tx.executeSql(`SELECT DISTINCT Matric FROM ${nname}`,[],
                        (tx, results)=>{
                            setTotal(results.rows.length)
                        })
                    })
                 })  
            }
        if (className) {
            getClassProps()
        } else {
            getProps()
        }
    },[focused, className])


    return(
        <AppContext.Provider value={{ instrument, className, level, total, instructor, firstRun, setFirstrun, token, focused, setFocused, setClassName, api, setToken }}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider