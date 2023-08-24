
//================================ React Native Imported Files ======================================//
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

/// ====================================== Local Imported Files ======================================//
import { HomeScreen } from '../../screens';
import Routes from '../Routes';


const Stack = createNativeStackNavigator();

const DashboardStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name={Routes.HOME_SCREEN} component={HomeScreen} />
        </Stack.Navigator>
    )
}

export default DashboardStack