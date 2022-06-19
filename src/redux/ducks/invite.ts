export const inviteReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'refresh': {
      return {
        ...state,
        users: [],
        userMap: {},
        selectedUsers: [],
        loading: false,
        error: '',
      };
    }
    case 'fetch-users': {
      const {users} = action.payload || {};
      const distinctUsers = users.filter(
        (user: any) => !state.userMap[user.userId],
      );

      let memberUserIds = [];
      if (state.channel) {
        memberUserIds = state.channel.members.map((m: any) => m.userId);
      }

      const mergedUsers = [...state.users];
      for (let i in distinctUsers) {
        const user = distinctUsers[i];
        if (!memberUserIds.includes(user.userId)) {
          mergedUsers.push(user);
        }
      }
      const userMap: any = {};
      for (let i in mergedUsers) {
        const user = mergedUsers[i];
        userMap[user.userId] = true;
      }
      return {
        ...state,
        userMap,
        users: mergedUsers,
      };
    }
    case 'select-user': {
      const {user} = action.payload || {};
      if (!state.selectedUsers.includes(user)) {
        return {
          ...state,
          error: '',
          selectedUsers: [...state.selectedUsers, user],
        };
      }
      break;
    }
    case 'unselect-user': {
      const {user} = action.payload || {};
      if (state.selectedUsers.includes(user)) {
        return {
          ...state,
          error: '',
          selectedUsers: state.selectedUsers.filter(
            (u: any) => u.userId !== user.userId,
          ),
        };
      }
      break;
    }
    case 'start-loading': {
      const {error = null} = action.payload || {};
      return {...state, loading: true, error};
    }
    case 'end-loading': {
      const {error = null} = action.payload || {};
      return {...state, loading: false, error};
    }
    case 'error': {
      const {error} = action.payload || {};
      return {...state, error};
    }
  }
  return state;
};
