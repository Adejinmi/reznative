import React, { useState, createContext, useEffect } from "react";
import SQLite from 'react-native-sqlite-storage'
import { db } from "./createDBandTable";

export const GenContext = createContext()

const GenContextProvider = (props)=>{
    const [firstRun, setFirstrun]=useState()
    const api = 'https://rezupapi.onrender.com/api'

useEffect(()=>{
    const checkTable = async () =>{
        await db.transaction(async (tx)=>{
          await tx.executeSql(`SELECT * FROM sqlite_master WHERE type='table' AND name='ClassesCreated'`,[],
          (tx, results)=>{
            //console.log(results.rows.item(0).name)
            if (results.rows.length>0){
              setFirstrun(false)
              
             }else {setFirstrun(true)}
          }
          )})
      }
    checkTable()
},[])
    return(
        <GenContext.Provider value={{ firstRun, setFirstrun, api }}>
            {props.children}
        </GenContext.Provider>
    )
}

export default GenContextProvider