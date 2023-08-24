//================================ React Native Imported Files ======================================//
import React from 'react'
import { Provider } from 'react-redux'
import store, { persister } from './redux/Store'
import { PersistGate } from 'redux-persist/integration/react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native'
import Toast, { BaseToast } from "react-native-toast-message";

//================================ Local Imported Files ======================================//
import RootStack from './navigation/RootStack'
import { Colors } from './assets'
import { CommonStyles,FontSize, UtilityMethods } from './utility'

export const navigationRef = createNavigationContainerRef();

///  Toast Config this function is used to show toast message ///  

const toastConfig = {
  ToastMessage: (props) => (
    <BaseToast
      {...props}
      style={{
        backgroundColor:Colors.WHITE,
        borderLeftColor:Colors.PRIMARY,
        width: "95%",
        height:UtilityMethods.hp(7)
      }}
      contentContainerStyle={{ paddingHorizontal: UtilityMethods.wp(3) }}
      text1Style={{
       fontSize:FontSize.VALUE(16),
        ...CommonStyles.BOLD,
        color:Colors.BLACK,
      }}
      text2Style={{
        fontSize:FontSize.VALUE(13),
        ...CommonStyles.REGULAR,
        color:Colors.DARK_GRAY,
       
      }}
    />
  ),
};

const App = () => {
  return (
      <Provider store={store}>
        <PersistGate persistor={persister}>
          <NavigationContainer ref={navigationRef}>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <RootStack />
              <Toast
                          position="top"
                          autoHide={true}
                          config={toastConfig}
                        />
            </GestureHandlerRootView>
          </NavigationContainer>
        </PersistGate>
      </Provider>
  )
}

export default App