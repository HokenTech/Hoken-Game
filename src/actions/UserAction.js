import { ActionTypes } from 'const';

class UserAction {

  static setUser({ name, win_count, lost_count, game, registered }) {
    //console.log('called setUser')
    return {
      type: ActionTypes.SET_USER,
      name,      // User name
      win_count, // Users win count
      lost_count,// Users lost count
      game,      // Users current Gamestate
      registered,
    }
  }

}

export default UserAction;
