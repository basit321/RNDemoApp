//================================ React Native Imported Files ======================================//

import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from "@react-native-firebase/auth";
import { firebase } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import messaging from "@react-native-firebase/messaging";
import storage from "@react-native-firebase/storage";
import { Platform } from "react-native";
import {
  COLLECTION_NOTIFICATIONS,
  COLLECTION_USERS,
  CURRENT_USER_UID,
  MESSAGING_SERVER_KEY,
  QR_CODES,
} from "./FirebaseConstants";


class FirebaseServices {
  constructor(props) {}

  // ----------------------------  Firebase Utils ---------------------------- //
  getGeoPoint = (latitude, longitude) =>
    new firestore.GeoPoint(latitude, longitude);

  
  getCurrentUser = () => auth().currentUser;

  getAuth = () => auth();


  
  // ---------------------------- Authentication ---------------------------- //


  signUpWith = async (email, password) => {
    try {
      const authResponse = await auth().createUserWithEmailAndPassword(
        email,
        password
      );
      return {
        isSuccess: true,
        response: authResponse.user.uid,
        message: "User signed up successfully.",
      };
    } catch (error) {
      console.error(error);
      return { isSuccess: false, response: null, message: error.message };
    }
  };


  loginWithEmailPass = async (email, password) => {
  
    try {
      const user = await auth().signInWithEmailAndPassword(email, password);
      const response = await this.getUserDataByEmail(email.toLowerCase());
     return {
        isSuccess: true,
        data: response,
        message: "User logged in successfully.",
      };
    } catch (error) {
      console.error(error);
      return { isSuccess: false, response: null, message: error.message };
    }
  };
updateEmail=async(email)=>{
  var user = firebase.auth().currentUser;

user.updateEmail(email).then(function() {
  // Email updated successfully
    console.log("Email updated successfully");
}).catch(function(error) {
  // An error occurred
    console.log("An error occurred",error);
});
}
  
  forgotPassword = async (email) => {
    try {
      await auth().sendPasswordResetEmail(email);
      return {
        isSuccess: true,
        response: null,
        message: "Password reset email sent.",
      };
    } catch (error) {
      console.error(error);
      return { isSuccess: false, response: null, message: error.message };
    }
  };

 
  // ---------------------------- Get Fcm Token ---------------------------- //
  /**
   * Async method to request permission for push notifications.
   */
  requestPermissionForPushNotifications = async () => {
    try {
      const response = await messaging().requestPermission();
      console.log("Notification - requestPermission ===>> ", response);
      return { isSuccess: true, response: null, messaging: response };
    } catch (error) {
      console.log("Notification - requestPermission (Error) ===>> ", error);
      return { isSuccess: false, response: null, message: error.message };
    }
  };

  fetchNotifications=async(docId)=> {
    const response= await firestore().collection(COLLECTION_NOTIFICATIONS).where('users', 'array-contains', docId).get()
    return response?.docs.map((doc) =>{
      let item = doc.data()
      delete item['users'];
      return item
    });
   
  }

getFcmToken = async () => {
    try {
      const resp = await messaging().getToken();
      console.log(
        "ðŸš€ ~ file: ApiServices.js ~ line 125 ~ firebaseServices ~ resp",
        resp
      );
      return resp;
    } catch (error) {
      console.log("error", error);
      return null;
    }
  };


  // ----------------------------  Set User Profile ---------------------------- //
  setProfileForUser = async (userId, isNew, profileData) => {
    let firebaseRef = firestore().collection(COLLECTION_USERS).doc(userId);
 try {
      if (isNew) {
        await firebaseRef.set(profileData);
      } else {
        await firebaseRef.update(profileData);
      }
      const response = await this.getUserDataByEmail(profileData?.email.toLowerCase());
      return {
        isSuccess: true,
        response: response,
        message: "Profile updated successfully",
    };
    } catch (error) {
      console.log("setProfileForUser (Error) ==> ", error);
       return { isSuccess: false, response: null, message: error };
    }
  };


  setQrCodes = async (userId, isNew, data) => {
     let firebaseRef = firestore().collection(QR_CODES).doc(userId);
 try {
  if (isNew) {
    await firebaseRef.set({
        scannedBy: data
    });
} else {
    await firebaseRef.update({
        scannedBy: data
    });
}
       return {
        isSuccess: true,
        response: firebaseRef.id,
        message: "Profile updated successfully",
    };
    } catch (error) {
      console.log("setqrCode (Error) ==> ", error);
       return { isSuccess: false, response: null, message: error };
    }
  };


 
  // ---------------------------- Collection CURD -------- -------------------- //
  
  fetchPaginatedDocument = async (
    collectionName,
    arrayFilters,
    limit,
    startAfter
  ) => {
    let firestoreCollection = firestore().collection(collectionName);

    arrayFilters.forEach((filter) => {
      const { key, operator, value } = filter;
      firestoreCollection = firestoreCollection.where(key, operator, value);
    });

    firestoreCollection = firestoreCollection
      .orderBy("created_date_unix", "desc")
      .limit(limit);

    if (startAfter != null) {
      firestoreCollection = firestoreCollection.startAfter(startAfter);
    }

    return await this._fetchDocument(firestoreCollection);
  };


  _fetchDocument = async (firestoreCollection) => {
    const snapshot = await firestoreCollection.get();

    if (!snapshot?._data) {
      const lastVisible = snapshot?._docs[snapshot?._docs?.length - 1];
      const snapshotData = snapshot?._docs.map((item) => {
        let data = item._data;
        data.docId = item._ref.id;
        return data;
      });

      if (snapshot?._docs && snapshot?._docs.length > 0) {
        return {
          isSuccess: true,
          response: snapshotData,
          lastVisible,
          message: "Document fetched successfully",
        };
      } else {
        return {
          isSuccess: false,
          response: null,
          message: "Document Not found",
        };
      }
    } else {
      if (snapshot?._data) {
        let documentData = snapshot?._data;
        documentData.docId = snapshot?._ref.id;
        return {
          isSuccess: true,
          response: documentData,
          message: "Document fetched successfully",
        };
      } else {
        return {
          isSuccess: false,
          response: null,
          message: "Document Not found",
        };
      }
    }
  };

  _liveSnapshot = async (firestoreCollection) => {
    let snapshot_ref = firestoreCollection.onSnapshot((snapshot) => {
      const snapshotData = snapshot?._docs.map((item) => {
        let data = item._data;
        data.docId = item._ref.id;
        return data;
      });
      if (snapshot?._docs && snapshot?._docs.length > 0) {
        return {
          isSuccess: true,
          response: snapshotData,
          reference: snapshot_ref,
          message: "Data fetched successfully",
        };
      } else {
        return {
          isSuccess: false,
          response: null,
          reference: snapshot_ref,
          message: "Data Not found",
        };
      }
    });
    return snapshot_ref;
  };

  sendNotifications = async ({ title, body, fcm_tokens }) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `key=${MESSAGING_SERVER_KEY}`);
    myHeaders.append("Content-Type", "application/json");

    var data = {
      registration_ids: fcm_tokens,
      notification: {
        body: body,
        title: title,
        sound: "default",
      },
      android: {
        sound: "default",
        notification: null,
      },
      data: {
        body: body,
        title: title,
      },
    };

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(data),
    };

    try {
      const response = await fetch(
        "https://fcm.googleapis.com/fcm/send",
        requestOptions
      );
      const result = await response.json();
      return { isSuccess: true, res: result };
    } catch (error) {
      return { isSuccess: false, res: error };
    }
  };

  getUserDataByEmail = async (email) => {
    try {
      const usersRef = firestore().collection(COLLECTION_USERS);
      
      // Use a where query to search for users with a matching email
      const querySnapshot = await usersRef.where('email', '==', email).get();
  
      // Check if we've found any users
      if (querySnapshot.empty) {
        return {
          isSuccess: true,
          response: null,
          message: "user not found",
        };
      }
  
      // If multiple users are found, this will just take the first one (assuming unique emails)
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
  
      return {
        isSuccess: true,
        response: userData,
        message: "user found",
      };
  
    } catch (error) {
      return {
        isSuccess: false,
        response: null,
        message: error.message,
      };
    }
  };
  checkBatchNo=async(batchNo)=>{
   
   try{
    
    const response= await firestore().collection(QR_CODES).where('batchNo', '==', batchNo).get()
    if(response.empty){
      return {
        isSuccess: true,
        data: null,
        message: "Batch No not found",
      };
    }
    const qrDoc = response.docs[0];
    const qrData = qrDoc.data();
    return {
      isSuccess: true,
      data: {
        id: qrDoc.id,
        ...qrData,
      },
      message: "Batch No found",
    };
  }catch(error){
    return {
      isSuccess: false,
      data: null,
      message: error.message,
    };
  }
  }
  /**
   * Async method to upload an image.
   */
  uploadImages = async (imageUris) => {
    const imageUrls = [];
    let success = true;
    let errorMessage = "";

    for (const [index, imageUri] of imageUris.entries()) {
      const image =
        Platform.OS === "android" ? imageUri : imageUri.replace("file:///", "");
      const imageName = `Image_${index}`; // This is just a placeholder. Consider using a more unique naming scheme.
      const imageRef = storage().ref(`ProfileImages/${imageName}.png`);
      console.log("imageRef", image);
      try {
        await imageRef.putFile(image);
        const url = await imageRef.getDownloadURL();
        imageUrls.push(url);
      } catch (error) {
        console.error("Error uploading image:", error.message);
        success = false;
        errorMessage = error.message;
        break; // Exiting the loop if an error occurs
      }
    }

    return {
      isSuccess: success,
      message: success ? "Images uploaded successfully" : errorMessage,
      imageUrls: imageUrls,
    };
  };
}

const FirebaseService = new FirebaseServices();

export default FirebaseService;