import React from 'react';
import {Text, Image, TouchableOpacity, View} from 'react-native';
import {withAppContext} from '../context';

const User = (props: any) => {
  const {user, selected, selectable, onSelect} = props;
  const [select, setSelect] = React.useState(selected);
  const onPress = () => {
    if (selectable) {
      setSelect(!select);
      onSelect(user);
    }
  };
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={style.container}
      onPress={() => onPress()}>
      <View style={style.profileImageContainer}>
        <Image source={{uri: user.profileUrl}} style={style.profileImage} />
        {selected && <Text style={style.check}>done</Text>}
      </View>
      <Text style={style.nickname}>{user.nickname || '(Unnamed)'}</Text>
    </TouchableOpacity>
  );
};

const style = {
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 8,
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    width: 40,
    height: 40,
    marginRight: 12,
  },
  profileImage: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderWidth: 0,
    borderRadius: 20,
  },
  check: {
    position: 'absolute',
    width: 40,
    height: 40,
    opacity: 0.6,
    borderWidth: 0,
    borderRadius: 20,
    backgroundColor: '#666',
  },
  nickname: {
    fontSize: 18,
    color: '#666',
  },
};

export default withAppContext(User);
