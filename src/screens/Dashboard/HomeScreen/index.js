//================================ React Native Imported Files ======================================//
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react'
import { useDispatch } from 'react-redux'

//================================ Local Imported Files ======================================//
import { setUser } from '../../../redux/Reducers/AuthReducer';

const HomeScreen = () => {
    const dispatch = useDispatch();
    const loginUser = () => {
        dispatch(setUser(null))
    }
    return (
        <SafeAreaView>
            <Text>HomeScreen</Text>
            <TouchableOpacity onPress={loginUser}>
                <Text>Logout</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default HomeScreen