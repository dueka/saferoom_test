import React from 'react';
import {Image, Text, TouchableOpacity, View, Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {withAppContext} from '../context';
import {Login} from '../Authentication/Login';
import Channels from './channels';
import {handleNotificationAction} from '../utils';

const Lobby = (props: any) => {
  const {navigation, sendbird} = props;
  const [initialized, setInitialized] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState(null);
  const savedUserKey = 'savedUser';

  React.useLayoutEffect(() => {
    const title = currentUser ? (
      <View style={style.headerLeftContainer}>
        <Text style={style.headerTitle}>Channels</Text>
      </View>
    ) : null;

    const right = currentUser ? (
      <View style={style.headerRightContainer}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={style.profileButton}
          onPress={startChat}>
          <Text>Chat</Text>
        </TouchableOpacity>
      </View>
    ) : null;

    navigation.setOptions({
      headerShown: !!currentUser,
      headerTitle: () => title,
      headerRight: () => right,
    });
  }, [currentUser]);

  React.useEffect(() => {
    AsyncStorage.getItem(savedUserKey)
      .then(user => {
        if (user) {
          setCurrentUser(JSON.parse(user));
        }
        setInitialized(true);
        return handleNotificationAction(
          navigation,
          sendbird,
          currentUser,
          'lobby',
        );
      })
      .catch(err => console.error(err));
  }, []);

  const login = (user: any) => {
    AsyncStorage.setItem(savedUserKey, JSON.stringify(user))
      .then(async () => {
        try {
          setCurrentUser(user);
          const authorizationStatus = await messaging().requestPermission();
          if (
            authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
          ) {
            if (Platform.OS === 'ios') {
              const token = await messaging().getAPNSToken();
              sendbird.registerAPNSPushTokenForCurrentUser(token);
            } else {
              const token = await messaging().getToken();
              sendbird.registerGCMPushTokenForCurrentUser(token);
            }
          }
        } catch (err) {
          console.error(err);
        }
      })
      .catch(err => console.error(err));
  };

  const startChat = () => {
    if (currentUser) {
      navigation.navigate('Invite', {currentUser});
    }
  };
  return (
    <>
      {initialized ? (
        currentUser ? (
          <Channels {...props} currentUser={currentUser} />
        ) : (
          <Login {...props} onLogin={login} />
        )
      ) : (
        <View />
      )}
    </>
  );
};

const style = {
  headerLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRightContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    color: '#fff',
  },
  logo: {
    width: 32,
    height: 32,
  },
  profileButton: {
    marginLeft: 10,
  },
};

export default withAppContext(Lobby);
