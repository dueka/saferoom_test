import React from 'react';
import {
  Text,
  StatusBar,
  SafeAreaView,
  View,
  FlatList,
  TouchableOpacity,
  AppState,
} from 'react-native';
import {withAppContext} from '../context';
import {memberReducer} from '../redux/ducks/member';
import User from '../components/user';

const Member = (props: any) => {
  const {route, navigation, sendbird} = props;
  const {currentUser, channel} = route.params;
  const [state, dispatch] = React.useReducer(memberReducer, {
    members: channel.members,
    error: '',
  });

  React.useLayoutEffect(() => {
    const right = (
      <View style={style.headerRightContainer}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={style.inviteButton}
          onPress={invite}>
          {/* <Icon name="person-add" color="#fff" size={28} /> */}

          <Text>Person add</Text>
        </TouchableOpacity>
      </View>
    );
    navigation.setOptions({
      headerRight: () => right,
    });
  });

  // on state change
  React.useEffect(() => {
    sendbird.addConnectionHandler('member', connectionHandler);
    sendbird.addChannelHandler('member', channelHandler);
    const unsubscribe = AppState.addEventListener('change', handleStateChange);

    if (!sendbird.currentUser) {
      sendbird.connect(currentUser.userId, (_: any, err: any) => {
        if (!err) {
          refresh();
        } else {
          dispatch({
            type: 'error',
            payload: {
              error: 'Connection failed. Please check the network status.',
            },
          });
        }
      });
    } else {
      refresh();
    }

    return () => {
      sendbird.removeConnectionHandler('member');
      sendbird.removeChannelHandler('member');
      unsubscribe.remove();
    };
  }, []);

  /// on connection event
  const connectionHandler = new sendbird.ConnectionHandler();
  connectionHandler.onReconnectStarted = () => {
    dispatch({
      type: 'error',
      payload: {
        error: 'Connecting..',
      },
    });
  };
  connectionHandler.onReconnectSucceeded = () => {
    dispatch({
      type: 'error',
      payload: {
        error: '',
      },
    });
    refresh();
  };

  connectionHandler.onReconnectFailed = () => {
    dispatch({
      type: 'error',
      payload: {
        error: 'Connection failed. Please check the network status.',
      },
    });
  };
  /// on channel event
  const channelHandler = new sendbird.ChannelHandler();
  channelHandler.onUserJoined = (_: any, user: any) => {
    if (user.userId !== currentUser.userId) {
      dispatch({type: 'add-member', payload: {user}});
    }
  };
  channelHandler.onUserLeft = (_: any, user: any) => {
    if (user.userId !== currentUser.userId) {
      dispatch({type: 'remove-member', payload: {user}});
    } else {
      navigation.goBack();
    }
  };
  const handleStateChange = (newState: any) => {
    if (newState === 'active') {
      sendbird.setForegroundState();
    } else {
      sendbird.setBackgroundState();
    }
  };
  const invite = () => {
    navigation.navigate('Invite', {channel, currentUser});
  };
  const refresh = () => {
    dispatch({type: 'refresh', payload: {members: channel.members}});
  };

  return (
    <>
      <StatusBar backgroundColor="#742ddd" barStyle="light-content" />

      <SafeAreaView style={style.container}>
        <FlatList
          data={state.members}
          renderItem={({item}) => <User user={item} />}
          keyExtractor={item => item.userId}
          contentContainerStyle={{flexGrow: 1}}
          ListHeaderComponent={
            state.error && (
              <View style={style.errorContainer}>
                <Text style={style.error}>{state.error}</Text>
              </View>
            )
          }
        />
      </SafeAreaView>
    </>
  );
};

const style = {
  container: {
    flex: 1,
  },
  inviteButton: {
    marginRight: 12,
  },
  errorContainer: {
    backgroundColor: '#333',
    opacity: 0.8,
    padding: 10,
  },
  error: {
    color: '#fff',
  },
};

export default withAppContext(Member);
