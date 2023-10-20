/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import GenContextProvider from './components/genContext'
import {name as appName} from './app.json';

const Application = ()=>{
    return(
        <GenContextProvider><App /></GenContextProvider>
    )
}

AppRegistry.registerComponent(appName, () => Application );
