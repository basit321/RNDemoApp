//================================ React Native Imported Files ======================================//
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../redux/Reducers/AuthReducer';

//================================ Local Imported Files ======================================//
import { CustomizedInput } from '../../../components';
import styles from './styles';

const LoginScreen = () => {
    const dispatch = useDispatch();
    const loginUser = () => {
        dispatch(setUser({
            name: "Hamza"
        }))
    }
    return (
        <View style={styles.root}>
            <CustomizedInput type="text" />
            <TouchableOpacity onPress={loginUser}>
                <Text>Login</Text>
            </TouchableOpacity>
        </View>
    )
}

export default LoginScreen