export const memberReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'refresh': {
      const {members} = action.payload || {};
      return {...state, members, error: ''};
    }
    case 'add-member': {
      const {user} = action.payload || {};
      if (!state.members.map((m: any) => m.userId).includes(user.userId)) {
        return {...state, members: [...state.members, user], error: ''};
      }
      break;
    }
    case 'remove-member': {
      const {user} = action.payload || {};
      if (state.members.map((m: any) => m.userId).includes(user.userId)) {
        return {
          ...state,
          members: state.members.filter((m: any) => m.userId !== user.userId),
          error: '',
        };
      }
      break;
    }
    case 'error': {
      const {error} = action.payload || {};
      return {...state, error};
    }
  }
  return state;
};
