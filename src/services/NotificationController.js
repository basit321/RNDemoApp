import Toast from "react-native-toast-message";
import { navigationRef } from "../App";
import Routes from "../navigation/Routes";
import messaging from "@react-native-firebase/messaging";


// notification listener   when app is in closed 
export const initNotifications = (
  navigation = navigationRef?.current,
  user
) => {
  initNotificationListeners(navigation, user);
  initForegroundMessage(navigation);
};

// notification listener   when app is in background
export const initNotificationListeners = (navigation, user) => {
  messaging()
    .getInitialNotification()
    .then((message) => {
      
      if (message) {
          navigation.navigate(Routes.NOTIFICATION_SCREEN);
      } else {
      }
    });

  messaging().onNotificationOpenedApp((message) => {

    if (message) {
      
      navigation.navigate(Routes.NOTIFICATION_SCREEN);
    } else {
    }
  });
};

export const initForegroundMessage = (navigation) => {

  return messaging().onMessage(async (remoteMessage) => {

    onMessageReceived(remoteMessage, navigation);
  });
};

// notification listener   when app is in Opened 

export const onMessageReceived = (message, navigation) => {
  

  Toast.show({
    type: "ToastMessage",
    text1: message.notification.title,
    text2: message.notification.body,
    onPress: () => {
      Toast.hide();

      navigation.navigate(Routes.NOTIFICATION_SCREEN);
    },
  });
};

