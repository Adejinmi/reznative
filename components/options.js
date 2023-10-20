import React from "react"

export const yearOptions=[
    {key:'year', value:'Year'},
    {key:'201617', value:'2016/17'},
    {key:'201718', value:'2017/18'},
    {key:'201819', value:'2018/19'},
    {key:'201920', value:'2019/20'},
    {key:'202021', value:'2020/21'},
    {key:'202122', value:'2021/22'}
  ]
  export const semOptions=[
    {key:'semester', value:'Semester'},
    {key:'first', value:'First Semester'},
    {key:'second', value:'Second Semester'},
  ]
  
  export const levelOptions=[
    {key:'level', value:'Level'},
    {key:'100l', value:'100 Level'},
    {key:'200l', value:'200 Level'},
    {key:'300l', value:'300 Level'},
    {key:'400l', value:'400 Level'},
    {key:'500l', value:'500 Level'},
  ]

  export const deptOptions=[{key:'department', value:'Department'}]

 const dept = async()=> await fetch(`https://rezup.onrender.com/api/fetchdepartment`,{
    method:"POST"
  }).then(response=>{
        return response.json()
  }).then(data=>{
    return data.row.forEach(element => {
        deptOptions.push({key:element.prefix, value:element.dname})
      }); 
  }) 
  dept()
 
/* export const GetDepartment = async()=> {
  await fetch(`https://rezup.onrender.com/api/fetchdepartment`,{
    method:"POST"
  }).then(response=>{
        return response.json()
  }).then(data=>{
    return data.row.forEach(element => {
        deptOptions.push({key:element.prefix, value:element.dname})
      }); 
  }) 

  React.useEffect(GetDepartment(),  [])
} */

/* 
  export const deptOptions=[
    {key:'department', value:'Level'},
    {key:'100l', value:'100 Level'},
    {key:'200l', value:'200 Level'},
    {key:'300l', value:'300 Level'},
    {key:'400l', value:'400 Level'},
    {key:'500l', value:'500 Level'},
  ]  */
 
  