/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Platform,
} from 'react-native';
import SendBird from 'sendbird';
import 'react-native-gesture-handler';
import messaging from '@react-native-firebase/messaging';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SENDBIRD_APP_ID} from 'react-native-dotenv';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {AppContext} from './src/context';
import {onRemoteMessage} from './src/utils';
import Lobby from './src/Lobby/Lobby';
import Chat from './src/Chat/Chat';
import Invite from './src/Invite/Invite';
import Member from './src/Member/Member';
import Profile from './src/Profile/Profile';

const Stack = createNativeStackNavigator();
const appId = '81F9E3D7-AA39-4F38-A95A-3909804695AC';
const sendbird = new SendBird({appId});

const initialState: any = {
  sendbird,
};
const defaultHeaderOptions = {
  headerStyle: {
    backgroundColor: '#742ddd',
  },
  headerTintColor: '#fff',
};

const App = () => {
  const savedUserKey = 'savedUser';

  const isDarkMode = useColorScheme() === 'dark';
  React.useEffect(() => {
    AsyncStorage.getItem(savedUserKey)
      .then(async user => {
        try {
          if (user) {
            const authorizationStatus = await messaging().requestPermission();
            if (
              authorizationStatus ===
                messaging.AuthorizationStatus.AUTHORIZED ||
              authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
            ) {
              if (Platform.OS === 'ios') {
                const token: any = await messaging().getAPNSToken();
                sendbird.registerAPNSPushTokenForCurrentUser(token);
              } else {
                const token = await messaging().getToken();
                sendbird.registerGCMPushTokenForCurrentUser(token);
              }
            }
          }
        } catch (err) {
          console.error(err);
        }
      })
      .catch(err => console.error(err));

    if (Platform.OS !== 'ios') {
      const unsubscribeHandler = messaging().onMessage(onRemoteMessage);
      return unsubscribeHandler;
    }
  }, []);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <NavigationContainer>
      <AppContext.Provider value={initialState}>
        <Stack.Navigator>
          <Stack.Screen
            name="Lobby"
            component={Lobby}
            options={{...defaultHeaderOptions}}
          />
          <Stack.Screen
            name="Chat"
            component={Chat}
            options={{...defaultHeaderOptions}}
          />
          <Stack.Screen
            name="Invite"
            component={Invite}
            options={{...defaultHeaderOptions}}
          />
          <Stack.Screen
            name="Member"
            component={Member}
            options={{...defaultHeaderOptions}}
          />
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{...defaultHeaderOptions}}
          />
        </Stack.Navigator>
      </AppContext.Provider>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
