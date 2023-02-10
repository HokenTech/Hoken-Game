import React, { Component } from 'react';
// Components
import { Button } from 'components';
import { func, instanceOf, oneOfType, shape } from 'prop-types';
import { onKeyUpEnter } from 'utils/keyPress';
// Services and redux action
import { UserAction } from 'actions';
import { connect } from 'react-redux';
import { ApiService } from 'services';
import { AnchorUser } from 'ual-anchor';
import { EOSIOAuthUser } from 'ual-eosio-reference-authenticator';
import { LedgerUser } from 'ual-ledger';
import { LynxUser } from 'ual-lynx';
import { MeetOneUser } from 'ual-meetone';
import { UALContext } from 'ual-reactjs-renderer';
import { TokenPocketUser } from 'ual-token-pocket';

class Login extends Component {

  constructor(props) {
    // Inherit constructor
    super(props);
    // State for form data and error message
    this.state = {
      form: {
        username: '',
        key: '',
        error: '',
      },
      isSigningIn: false,
    }
    // Bind functions
    //this.signUp = this.signUp.bind(this);
    //this.handleChange = this.handleChange.bind(this);
    //this.handleSubmit = this.handleSubmit.bind(this);
  }
  static contextType = UALContext

  static propTypes = {
    ual: shape({
      activeUser: oneOfType([
        instanceOf(EOSIOAuthUser),
        instanceOf(LynxUser),
        instanceOf(TokenPocketUser),
        instanceOf(AnchorUser),
        instanceOf(LedgerUser),
        instanceOf(MeetOneUser),
      ]),
    }),
    //routeToLanding: func.isRequired,
    login: func.isRequired
  }

  // Runs on every keystroke to update the React state
  handleChange(event) {
    /* const { name, value } = event.target;
     const { form } = this.state;
     this.setState({
       form: {
         ...form,
         [name]: value,
         error: '',
       },
     });*/
  }

  componentDidMount() {
    this.isComponentMounted = true;
  }

  componentWillUnmount() {
    this.isComponentMounted = false;
  }
  componentDidUpdate() {
    const { setUser } = this.props;
    const { user: { name } } = this.props;
    if (this.context.activeUser && !name) {
      const accountName = this.context.activeUser.accountName;
      ApiService.getUserByName(accountName).then((resp) => {
        //console.log("resp =", resp)
        if (resp.username == accountName) {
          //console.log('user is registred')
          setUser({ name: accountName, registered: true });
        }
      })
    }    /*ApiService.login(accountName)
    .then(() => {
      setUser({ name: accountName });
    })
    .catch(err => {
      this.setState({ error: err.toString() });
    })
    .finally(() => {
      ApiService.getUserByName(accountName).then(user => { console.log(user) })
      if (this.isComponentMounted) {
        this.setState({ isSigningIn: false });
      }
    });
}*/
  }

  signUp = () => {
    //console.log("signup called")
    const accountName = this.context.activeUser.accountName;
    ApiService.login(accountName, this.context)
    return
  }

  render() {
    // Extract data from state
    const { form, error, isSigningIn } = this.state;
    const { login } = this.props
    const { logout } = this.context
    const { user: { name, game, registered } } = this.props;
    const { activeUser } = this.context
    return (
      <div className="Login">
        <div className="title">Card Battle - powered by Hoken Tech</div>
        {activeUser && !registered ? (
          //Already logged with UAL, if not registered into the contract show the button
          < React.Fragment >
            <div className="description">Register your account into the contract to start playing Molfetta Card Game</div>
            <div className="bottom" >
              <Button type="submit" className="green" onClick={() => this.signUp()} onKeyUp={(event) => onKeyUpEnter(event, this.signUp)} >
                SIGN UP
              </Button>
              <Button type="submit" className="green" onClick={logout} >
                LOG OUT
              </Button>
            </div>
          </React.Fragment >
        ) : (
          //Login with UAL
          <React.Fragment>
            <div className="description">Login to start playing Molfetta Card Game</div>
            <div className="bottom">
              <Button type="submit" className="green" onClick={login} onKeyUp={(event) => onKeyUpEnter(event, login)} >
                LOGIN WITH UAL
              </Button>
            </div>
          </React.Fragment>
        )
        }
      </div >
    )
  }
}

// Map all state to component props (for redux to connect)
const mapStateToProps = state => state;

// Map the following action to props
const mapDispatchToProps = {
  setUser: UserAction.setUser,
};

// Export a redux connected component
export default connect(mapStateToProps, mapDispatchToProps)(Login);
