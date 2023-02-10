import { JsonRpc } from 'eosjs';
import { UALContext } from 'ual-reactjs-renderer';



// Main action call to blockchain
async function takeAction(action, dataValue, context) {
  const actions = [{
    account: process.env.REACT_APP_EOS_CONTRACT_NAME,
    name: action,
    authorization: [{
      actor: context.activeUser.accountName,
      permission: context.activeUser.requestPermission ? context.activeUser.requestPermission : 'active',
    }],
    data: dataValue,
  }]

  const transactionConfig = { broadcast: true, expireSeconds: 300 }
  //console.log(actions)

  // Main call to blockchain after setting action, account_name and data
  try {
    const resultWithConfig = await context.activeUser.signTransaction({
      actions: actions
    }, {
      broadcast: true,
      expireSeconds: 300,
    });
    return resultWithConfig;
  } catch (err) {
    //displayError(err)
    throw (err)
  }
}

class ApiService {
  static contextType = UALContext
  static getCurrentUser() {
    return new Promise((resolve, reject) => {
      //console.log('called getCurrentUser')
      if (!localStorage.getItem("cardgame_account")) {
        return reject();
      }
      /*takeAction("login", { username: localStorage.getItem("cardgame_account") }, this.context)
        .then(() => {
          resolve(localStorage.getItem("cardgame_account"));
        })
        .catch(err => {
          localStorage.removeItem("cardgame_account");
          localStorage.removeItem("cardgame_key");
          reject(err);
        });*/
    });
  }

  static login(username, context) {
    return new Promise((resolve, reject) => {
      localStorage.setItem("cardgame_account", username);
      takeAction("login", { username: username }, context)
        .then(() => {
          resolve();
        })
        .catch(err => {
          localStorage.removeItem("cardgame_account");
          reject(err);
        });
    });
  }

  static startGame(context) {
    return takeAction("startgame", { username: context.activeUser.accountName }, context);
  }

  static playCard(cardIdx, context) {
    return takeAction("playcard", { username: context.activeUser.accountName, player_card_idx: cardIdx }, context);
  }

  static nextRound(context) {
    return takeAction("nextround", { username: context.activeUser.accountName }, context);
  }

  static endGame(context) {
    return takeAction("endgame", { username: context.activeUser.accountName }, context);
  }

  static async getUserByName(username) {
    try {
      const rpc = new JsonRpc(process.env.REACT_APP_EOS_HTTP_ENDPOINT);
      const result = await rpc.get_table_rows({
        "json": true,
        "code": process.env.REACT_APP_EOS_CONTRACT_NAME,    // contract who owns the table
        "scope": process.env.REACT_APP_EOS_CONTRACT_NAME,   // scope of the table
        "table": "users",    // name of the table as specified by the contract abi
        "limit": 1,
        "lower_bound": username,
      });
      //console.log(result.rows)
      return result.rows[0];
    } catch (err) {
      console.error(err);
    }
  }

}

export default ApiService;
