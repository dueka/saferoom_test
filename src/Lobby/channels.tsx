import React from 'react';
import {
  Text,
  StatusBar,
  SafeAreaView,
  View,
  FlatList,
  RefreshControl,
  AppState,
} from 'react-native';
import {channelsReducer} from '../redux/ducks/channels';
import Channel from '../components/channel';
import {handleNotificationAction} from '../utils';

const Channels = (props: any) => {
  const {route, navigation, sendbird, currentUser} = props;
  const [query, setQuery] = React.useState(null as any);
  const [state, dispatch] = React.useReducer(channelsReducer, {
    sendbird,
    currentUser,
    channels: [],
    channelMap: {},
    loading: false,
    empty: '',
    error: null,
  });

  // on state change
  React.useEffect(() => {
    sendbird.addConnectionHandler('channels', connectionHandler);
    sendbird.addChannelHandler('channels', channelHandler);
    const unsubscribe = AppState.addEventListener('change', handleStateChange);

    if (!sendbird.currentUser) {
      sendbird.connect(currentUser.userId, (_: any, err: any) => {
        if (!err) {
          refresh();
        } else {
          dispatch({
            type: 'end-loading',
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
      dispatch({type: 'end-loading'});
      sendbird.removeConnectionHandler('channels');
      sendbird.removeChannelHandler('channels');
      unsubscribe.remove();
    };
  }, []);

  React.useEffect(() => {
    if (route.params && route.params.action) {
      const {action, data} = route.params;
      switch (action) {
        case 'leave':
          data.channel.leave((_: any, err: any) => {
            if (err) {
              dispatch({
                type: 'error',
                payload: {
                  error: 'Failed to leave the channel.',
                },
              });
            }
          });
          break;
      }
    }
  }, [route.params]);

  React.useEffect(() => {
    if (query) {
      next();
    }
  }, [query]);

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
    dispatch({type: 'error', payload: {error: null}});
    refresh();

    handleNotificationAction(
      navigation,
      sendbird,
      currentUser,
      // likely to throw error
      'channels',
    ).catch(err => console.error(err));
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
  channelHandler.onUserJoined = (channel: any, user: any) => {
    if (user.userId === sendbird.currentUser.userId) {
      dispatch({type: 'join-channel', payload: {channel}});
    }
  };

  channelHandler.onUserLeft = (channel: any, user: any) => {
    if (user.userId === sendbird.currentUser.userId) {
      dispatch({type: 'leave-channel', payload: {channel}});
    }
  };
  channelHandler.onChannelChanged = (channel: any) => {
    dispatch({type: 'update-channel', payload: {channel}});
  };
  channelHandler.onChannelDeleted = (channel: any) => {
    dispatch({type: 'delete-channel', payload: {channel}});
  };

  const handleStateChange = (newState: any) => {
    if (newState === 'active') {
      sendbird.setForegroundState();
    } else {
      sendbird.setBackgroundState();
    }
  };

  const chat = (channel: any) => {
    navigation.navigate('Chat', {
      channel,
      currentUser,
    });
  };

  const refresh = () => {
    setQuery(sendbird.GroupChannel.createMyGroupChannelListQuery());
    dispatch({type: 'refresh'});
  };

  const next = () => {
    if (query?.hasNext) {
      dispatch({type: 'start-loading'});
      query.limit = 20;
      query.next((fetchedChannels: any, err: any) => {
        dispatch({type: 'end-loading'});
        if (!err) {
          dispatch({
            type: 'fetch-channels',
            payload: {channels: fetchedChannels},
          });
        } else {
          dispatch({
            type: 'error',
            payload: {
              error: 'Failed to get the channels.',
            },
          });
        }
      });
    }
  };

  return (
    <>
      <StatusBar backgroundColor="#742ddd" barStyle="light-content" />
      <SafeAreaView style={style.container}>
        <FlatList
          data={state.channels}
          renderItem={({item}) => (
            <Channel
              key={item.url}
              channel={item}
              onPress={(channel: any) => chat(channel)}
            />
          )}
          keyExtractor={item => item.url}
          refreshControl={
            <RefreshControl
              refreshing={state.loading}
              colors={['#742ddd']}
              tintColor={'#742ddd'}
              onRefresh={refresh}
            />
          }
          contentContainerStyle={{flexGrow: 1}}
          ListHeaderComponent={
            state.error && (
              <View style={style.errorContainer}>
                <Text style={style.error}>{state.error}</Text>
              </View>
            )
          }
          ListEmptyComponent={
            <View style={style.emptyContainer}>
              <Text style={style.empty}>{state.empty}</Text>
            </View>
          }
          onEndReached={() => next()}
          onEndReachedThreshold={0.5}
        />
      </SafeAreaView>
    </>
  );
};

const style = {
  container: {
    flex: 1,
  },
  errorContainer: {
    backgroundColor: '#333',
    opacity: 0.8,
    padding: 10,
  },
  error: {
    color: '#fff',
  },
  loading: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    fontSize: 24,
    color: '#999',
    alignSelf: 'center',
  },
};

export default Channels;
