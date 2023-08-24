import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useSelector } from 'react-redux';
import { AuthStack, DashboardStack } from './Stacks';
import Routes from './Routes';

const Stack = createNativeStackNavigator();
const RootStack = () => {
    let isLogin = useSelector(state => state.auth?.user)
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
        }}>
            {!!isLogin ?
                <Stack.Screen name={Routes.DASHBOARD_STACK} component={DashboardStack} />
                : <Stack.Screen name={Routes.AUTH_STACK} component={AuthStack} />}
        </Stack.Navigator>
    )
}

export default RootStack