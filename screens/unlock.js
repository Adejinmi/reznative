import React, { useEffect, useState } from 'react';
import { Platform, SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import SInfo from 'react-native-sensitive-info';

export default function UnlockScreen(){
    const styles = StyleSheet.create({
        main:{
            flex:1
        }
    })

    const [isBio, setIsBio] = useState()
    

    useEffect(()=>{
        const myFunc = async () => {
            return await SInfo.getAllItems({        
                sharedPreferencesName: 'esmSuitePrefs',
                keychainService: 'esmSuiteKeychain'
            });
        }

        const checkBio = async()=> {
            if (Platform.OS === 'ios'){
                return setIsBio(await SInfo.isSensorAvailable())
            }
            if (Platform.OS === 'android') {
                return setIsBio(await SInfo.hasEnrolledFingerprints()) 
                          
            }
            ;    
        }
        checkBio();
        console.log(myFunc())

        
        
       
        
    },[])

    const checkPin = async()=>{
        const protectedData = await SInfo.getItem('esmsuite', {
            sharedPreferencesName: 'esmSuitePrefs',
            keychainService: 'esmSuiteKeychain',
        });
    }

    
    

    return(
        <SafeAreaView>
            <View>
                <TouchableOpacity onPress={checkPin}>
                    <Text>
                        Press
                    </Text>
                </TouchableOpacity>
                
            </View>
        </SafeAreaView>
    )
    

}

