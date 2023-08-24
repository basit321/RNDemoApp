import { View, Text, TextInput } from 'react-native'
import React from 'react'
import styles from './styles'

export const InputTypes = {
  EMAIL: 'email',
  PASSWORD: 'password',
  TEXT: 'text',
}

const CustomizedInput = ({type, ...props}) => {
  return (
    <View style={styles.container}>
      <TextInput style={{margin: 0,padding: 0, lineHeight: 0}} />
    </View>
  )
}

export {CustomizedInput} 