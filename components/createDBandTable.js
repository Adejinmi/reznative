import SQLite from 'react-native-sqlite-storage'

    export const db = SQLite.openDatabase(
            {
                name:"esmsuite",
                location:"default"
            },
            ()=>{},
            error => {console.log(error)}
        );
  


export const createTable = (tablename, columns) =>{
    db.transaction((tx)=>{
        tx.executeSql(`CREATE TABLE  ${tablename} ${columns}`)
    })
}