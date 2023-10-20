import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from './screens/login'
import Home from './screens/Home';
import CreateClass from './screens/createClass';
import CreatePin from './screens/createPin';
import UnlockScreen from './screens/unlock';
import StartContextProvider from './components/startContext';
import AppContextProvider from './components/appContext'; 
import Icon from 'react-native-vector-icons/Entypo'
import FeatherIcons from 'react-native-vector-icons/Feather'
import FA from 'react-native-vector-icons/FontAwesome'
import TakeAttendance from './screens/takeAttendance';
import AllAttendance from './screens/allAttendance';
import NorminalRoll from './screens/norminalRoll';
import Assessment from './screens/assessment';
import AllAssessment from './screens/allAssessment';
import QuestionBank from './screens/questionBank';
import SingleQuestion from './screens/singleQuestion';
import Welcome from './screens/welcome';
import ConfirmPin from './screens/confirmPin';
import singleAttendance from './screens/singleAttendance';
import practicalExam from './screens/practicalExam';
import settings from './screens/settings';
import addStudents from './screens/addStudents';
import singleStudent from './screens/singleStudent';
import singleAssessment from './screens/singleAssessment';
import addQuestion from './screens/addQuestion';
import switchClass from './screens/switchClass';
import singleClass from './screens/singleClass';
import NewClass from './screens/newClass';
import changeClassPassword from './screens/changeClassPassword';
import { SafeAreaView, StatusBar, StyleSheet, Text, View, Animated } from 'react-native';
import ChangePin from './screens/changePin';
import Confirm from './screens/confirm'
import { GenContext } from './components/genContext';
import ota from './screens/ota';
import otattendance from './screens/otattendance';
import retrieveClass from './screens/retrieveClass';
import SetPin from './screens/setPin';
import FinishUp from './screens/finish';
import retrieveSetClass from './screens/retrieveSetClass';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator()

function App() {
  const [isLoading, setIsLoading] = React.useState(true)

  const styles = StyleSheet.create({
    main:{
      flex:1,
      backgroundColor:"rgb(80,80,225)",
      alignItems:"center",
      justifyContent:"center",
    },
    mainText:{
      fontFamily:"futura_book",
      fontWeight:"bold",
      fontSize:83,
      color: "white",
      textAlign:"center",
      margin:0,
      padding:0,
    },
    subText:{
      fontFamily:"futura_book",
      fontWeight:"100",
      fontSize:16,
      color: "white",
      textAlign:"center",
      marginTop:-15,
      padding:0,
      letterSpacing:1.5
    }
  })
  
  const HomeStack = () =>{
    return(
      <Stack.Navigator initialRouteName='Homepage'>
        <Stack.Screen name="Homepage" component={Home} options={{headerShown:false}}/>
        <Stack.Screen name="New Attendance" component={TakeAttendance} options={{ headerTitleAlign:"center",  headerStyle: {backgroundColor: 'rgb(80,80,225)', borderBottomWidth: 0, shadowColor: "black", elevation: 50,}, headerTitleStyle: {color: "white", textAlign:"center" }, headerTintColor: "white",}}/>
        
        <Stack.Screen name="View Attendance" component={singleAttendance} options={{ headerTitleAlign:"center",  headerStyle: {backgroundColor: 'rgb(80,80,225)', borderBottomWidth: 0, shadowColor: "black", elevation: 50,}, headerTitleStyle: {color: "white", textAlign:"center" }, headerTintColor: "white",}}/>   

        <Stack.Screen name="View Assessment" component={singleAssessment} options={{ headerTitleAlign:"center",  headerStyle: {backgroundColor: 'rgb(80,80,225)', borderBottomWidth: 0, shadowColor: "black", elevation: 50,}, headerTitleStyle: {color: "white", textAlign:"center" }, headerTintColor: "white",}}/>   

        <Stack.Screen name="All Attendance" component={AllAttendance} options={{ headerTitleAlign:"center",  headerStyle: {backgroundColor: 'rgb(80,80,225)', borderBottomWidth: 0, shadowColor: "black", elevation: 50,}, headerTitleStyle: {color: "white", textAlign:"center" }, headerTintColor: "white",}}/>
        <Stack.Screen name="SetPin" component={CreatePin} options={{headerShown:false}}/>
        <Stack.Screen name="CreateClass" component={CreateClass} options={{headerShown:false}}/>
        <Stack.Screen name="Unlock" component={UnlockScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Assessment" component={Assessment
        } options={{ headerTitleAlign:"center",  headerStyle: {backgroundColor: 'rgb(80,80,225)', borderBottomWidth: 0, shadowColor: "black", elevation: 50,}, headerTitleStyle: {color: "white", textAlign:"center" }, headerTintColor: "white",}}/>
        
        <Stack.Screen name="All Assessments" component={AllAssessment} options={{ headerTitleAlign:"center",  headerStyle: {backgroundColor: 'rgb(80,80,225)', borderBottomWidth: 0, shadowColor: "black", elevation: 50,}, headerTitleStyle: {color: "white", textAlign:"center" }, headerTintColor: "white",}}/>
      </Stack.Navigator> 
    )
  }

  const SettingsStack = () =>{
    return(
      <Stack.Navigator initialRouteName='settings' detachInactiveScreens={true}>
        <Stack.Screen name="settings" component={settings
        } options={{ headerTitleAlign:"center",  headerStyle: {backgroundColor: 'rgb(80,80,225)', borderBottomWidth: 0, shadowColor: "black", elevation: 50,}, headerTitleStyle: {color: "white", textAlign:"center", fontFamily:"futura_book" }, headerTintColor: "white",}}/>

      <Stack.Screen name="Switch Class" component={switchClass
        } options={{ headerTitleAlign:"center",  headerStyle: {backgroundColor: 'rgb(80,80,225)', borderBottomWidth: 0, shadowColor: "black", elevation: 50,}, headerTitleStyle: {color: "white", textAlign:"center",fontFamily:"futura_book" }, headerTintColor: "white",}}/>

      <Stack.Screen name="Single Class" component={singleClass
        } options={{ headerTitleAlign:"center",  headerStyle: {backgroundColor: 'rgb(80,80,225)', borderBottomWidth: 0, shadowColor: "black", elevation: 50,}, headerTitleStyle: {color: "white", textAlign:"center", fontFamily:"futura_book" }, headerTintColor: "white",}}/>  

        <Stack.Screen name="New Class" component={NewClass
        } options={{ headerTitleAlign:"center",  headerStyle: {backgroundColor: 'rgb(80,80,225)', borderBottomWidth: 0, shadowColor: "black", elevation: 50,}, headerTitleStyle: {color: "white", textAlign:"center", fontFamily:"futura_book" }, headerTintColor: "white",}}/>

        <Stack.Screen name="One Time Attendance" component={ota
        } options={{ headerTitleAlign:"center",  headerStyle: {backgroundColor: 'rgb(80,80,225)', borderBottomWidth: 0, shadowColor: "black", elevation: 50,}, headerTitleStyle: {color: "white", textAlign:"center", fontFamily:"futura_book" }, headerTintColor: "white",}}/>   

        <Stack.Screen name="Take Attendance" component={otattendance
        } options={{ headerTitleAlign:"center",  headerStyle: {backgroundColor: 'rgb(80,80,225)', borderBottomWidth: 0, shadowColor: "black", elevation: 50,}, headerTitleStyle: {color: "white", textAlign:"center", fontFamily:"futura_book" }, headerTintColor: "white",}}/>     

        <Stack.Screen name="Change Class Password" component={changeClassPassword
        } options={{ headerTitleAlign:"center",  headerStyle: {backgroundColor: 'rgb(80,80,225)', borderBottomWidth: 0, shadowColor: "black", elevation: 50,}, headerTitleStyle: {color: "white", textAlign:"center", fontFamily:"futura_book" }, headerTintColor: "white",}}/> 

        <Stack.Screen name="Change Pin" component={ChangePin
        } options={{ headerTitleAlign:"center",  headerStyle: {backgroundColor: 'rgb(80,80,225)', borderBottomWidth: 0, shadowColor: "black", elevation: 50,}, headerTitleStyle: {color: "white", textAlign:"center", fontFamily:"futura_book" }, headerTintColor: "white",}}/> 

        <Stack.Screen name="Confirm Pin" component={Confirm
        } options={{ headerTitleAlign:"center",  headerStyle: {backgroundColor: 'rgb(80,80,225)', borderBottomWidth: 0, shadowColor: "black", elevation: 50,}, headerTitleStyle: {color: "white", textAlign:"center", fontFamily:"futura_book" }, headerTintColor: "white",}}/> 

        <Stack.Screen name="Retrieve Class" component={retrieveSetClass
        } options={{ headerTitleAlign:"center",  headerStyle: {backgroundColor: 'rgb(80,80,225)', borderBottomWidth: 0, shadowColor: "black", elevation: 50,}, headerTitleStyle: {color: "white", textAlign:"center", fontFamily:"futura_book" }, headerTintColor: "white",}}/>     
   
      </Stack.Navigator> 
    )
  }

  const QuestionBankStack = () =>{
    return(
      <Stack.Navigator initialRouteName='Question Bank'>
        <Stack.Screen name="Question Bank" component={QuestionBank
        } options={{ headerTitleAlign:"center",  headerStyle: {backgroundColor: 'rgb(80,80,225)', borderBottomWidth: 0, shadowColor: "black", elevation: 50,}, headerTitleStyle: {color: "white", textAlign:"center" }, headerTintColor: "white",}}/>

        <Stack.Screen name="Add to Local Bank" component={addQuestion
        } options={{ headerTitleAlign:"center",  headerStyle: {backgroundColor: 'rgb(80,80,225)', borderBottomWidth: 0, shadowColor: "black", elevation: 50,}, headerTitleStyle: {color: "white", textAlign:"center" }, headerTintColor: "white",}}/>

        <Stack.Screen name="Local Bank" component={SingleQuestion
        } options={{ headerTitleAlign:"center",  headerStyle: {backgroundColor: 'rgb(80,80,225)', borderBottomWidth: 0, shadowColor: "black", elevation: 50,}, headerTitleStyle: {color: "white", textAlign:"center" }, headerTintColor: "white",}}/>
        
        <Stack.Screen name="General Bank" component={AllAssessment} options={{ headerTitleAlign:"center",  headerStyle: {backgroundColor: 'rgb(80,80,225)', borderBottomWidth: 0, shadowColor: "black", elevation: 50,}, headerTitleStyle: {color: "white", textAlign:"center" }, headerTintColor: "white",}}/>        
      </Stack.Navigator> 
    )
  }

  const NominalRollStack = () =>{
    return(
      <Stack.Navigator initialRouteName='Nominal Roll'>
        <Stack.Screen name="Nominal Roll" component={NorminalRoll
        } options={{ headerTitleAlign:"center",  headerStyle: {backgroundColor: 'rgb(80,80,225)', borderBottomWidth: 0, shadowColor: "black", elevation: 50,}, headerTitleStyle: {color: "white", textAlign:"center" }, headerTintColor: "white",}}/>    

        <Stack.Screen name="Add Students" component={addStudents
        } options={{ headerTitleAlign:"center",  headerStyle: {backgroundColor: 'rgb(80,80,225)', borderBottomWidth: 0, shadowColor: "black", elevation: 50,}, headerTitleStyle: {color: "white", textAlign:"center" }, headerTintColor: "white",}}/>

        <Stack.Screen name="Edit Student Details" component={singleStudent
        } options={{ headerTitleAlign:"center",  headerStyle: {backgroundColor: 'rgb(80,80,225)', borderBottomWidth: 0, shadowColor: "black", elevation: 50,}, headerTitleStyle: {color: "white", textAlign:"center" }, headerTintColor: "white", }}/>    

      </Stack.Navigator> 
    )
  }

  const opacity = React.useState(new Animated.Value(0))[0]
  const sopacity = React.useState(new Animated.Value(0))[0]

  React.useEffect(()=>{
    const fadeIn = ()=>{
      Animated.timing(opacity,{
        toValue: 1,
        duration: 1000,
        useNativeDriver:true
      }).start(()=>{
        Animated.timing(sopacity,{
          toValue: 1,
          duration: 1000,
          useNativeDriver:true
        }).start(()=>{setTimeout(()=>setIsLoading(false),2000)})
      })
    } 
    fadeIn()
  
  },[])

  const { firstRun, setFirstrun } = React.useContext(GenContext)
  const [login, setLogin] = React.useState(false)

  const WelcomeStack= ()=>{
    return(
        <StartContextProvider>
          <Stack.Navigator initialRouteName='Home'>
            <Stack.Screen name="Home" component={Welcome} options={{headerShown:false}}/>
            <Stack.Screen name="New Class" component={CreateClass} options={{ headerShown:false}}/>
            
            <Stack.Screen name="create pin" component={CreatePin} options={{headerShown:false}}/>        
            <Stack.Screen name="confirm pin" component={ConfirmPin} options={{ headerShown:false}}/>
            <Stack.Screen name="SetPin" component={CreatePin} options={{headerShown:false}}/>
            <Stack.Screen name="CreateClass" component={CreateClass} options={{headerShown:false}}/>
            <Stack.Screen name="Unlock" component={UnlockScreen}  options={{headerShown:false}}/>
            <Stack.Screen name="One Time Attendance" component={ota
            } options={{ headerTitleAlign:"center",  headerStyle: {backgroundColor: 'rgb(80,80,225)', borderBottomWidth: 0, shadowColor: "black", elevation: 50,}, headerTitleStyle: {color: "white", textAlign:"center", fontFamily:"futura_book" }, headerTintColor: "white",}}/>   

          <Stack.Screen name="Take Attendance" component={otattendance
            } options={{ headerTitleAlign:"center",  headerStyle: {backgroundColor: 'rgb(80,80,225)', borderBottomWidth: 0, shadowColor: "black", elevation: 50,}, headerTitleStyle: {color: "white", textAlign:"center", fontFamily:"futura_book" }, headerTintColor: "white",}}/>
          
          <Stack.Screen name="Retrieve Class" component={retrieveClass
            } options={{ headerTitleAlign:"center",  headerStyle: {backgroundColor: 'rgb(80,80,225)', borderBottomWidth: 0, shadowColor: "black", elevation: 50,}, headerTitleStyle: {color: "white", textAlign:"center", fontFamily:"futura_book" }, headerTintColor: "white",}}/>
          
          <Stack.Screen name="Set Pin" component={SetPin
            } options={{ headerTitleAlign:"center",  headerStyle: {backgroundColor: 'rgb(80,80,225)', borderBottomWidth: 0, shadowColor: "black", elevation: 50,}, headerTitleStyle: {color: "white", textAlign:"center", fontFamily:"futura_book" }, headerTintColor: "white",}}/>
          
          <Stack.Screen name="Finish Up" component={FinishUp
            } options={{ headerTitle:"Confirm Pin", headerTitleAlign:"center",  headerStyle: {backgroundColor: 'rgb(80,80,225)', borderBottomWidth: 0, shadowColor: "black", elevation: 50,}, headerTitleStyle: {color: "white", textAlign:"center", fontFamily:"futura_book" }, headerTintColor: "white",}}/>
          
          </Stack.Navigator>          
          </StartContextProvider>
       
    )
  }

  const AppNavigation = ()=>{
    if (login) {
      return(
        <AppContextProvider>
        <Tab.Navigator screenOptions={({ route }) => ({
            unmountOnBlur:true,
            headerShown : true,
            headerTitleAlign:"center",  headerStyle: {backgroundColor: 'rgb(80,80,225)', shadowColor: "black", elevation: 50,}, headerTitleStyle: {color: "white", fontFamily:"futura_medium", fontSize:18, textAlign:"center", }, headerTintColor: "white",
            tabBarHideOnKeyboard:true,
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              size = 25
  
              if (route.name === 'Home') {
                iconName = 'home'
              }
              else if (route.name === 'Settings') {
                return <FeatherIcons name="settings" color={color} size={size}/>
              }
              
              else if (route.name === 'Question') {
                iconName = 'database'
              }
              
              else if (route.name === 'Practical Exam') {
                return <FA name="file-text-o" color={color} size={size}/>
              }
  
              else if (route.name === 'Nominal') {
                return <FeatherIcons name='list' color={color} size ={size} />
              }
  
              // You can return any component that you like here!
             return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'rgb(80,80,225)',
            tabBarInactiveTintColor: 'gray',
          })}>
          <Tab.Screen name="Home" component={HomeStack} options={{ headerShown:false}} />
          <Tab.Screen name="Nominal" component={NominalRollStack} options={{ headerShown:false}} />
          <Tab.Screen name="Practical Exam" component={practicalExam} options={{ headerTitle:"Practical Exam"}} />
          <Tab.Screen name="Question" component={QuestionBankStack} options={{ unmountOnBlur:true, headerShown:false}} />
          <Tab.Screen name="Settings" component={SettingsStack} options={{ headerShown:false}} />
        </Tab.Navigator>
  
        </AppContextProvider>
      )
      
    } else {
      return(
        <Login setLogin={setLogin} />
      )
    }
  }
  if (isLoading) {
    return(
      <SafeAreaView style={styles.main}>
        <StatusBar
          animated={true}
          backgroundColor="rgb(80,80,225)"
        />
      <View>
        <Animated.Text style={[styles.mainText, {opacity}]}>E.S.M</Animated.Text>
        <Animated.Text style={[styles.subText, {opacity:sopacity}]}>Every Student A Musician</Animated.Text>
      </View>
      </SafeAreaView>
    )
  } else {
    if (firstRun) {
      return (
        <NavigationContainer>
          <WelcomeStack />
        </NavigationContainer>
      );
      
    } else {
      return (
        <NavigationContainer>
          <AppNavigation />
        </NavigationContainer>
      );
    }
  }
  
}

export default App;