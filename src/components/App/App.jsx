// React core
import { func, instanceOf, shape } from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
// Components
import { Game, Login } from 'components';
// Services and redux action
import { UserAction } from 'actions';
import { ApiService } from 'services';
import { UALContext } from 'ual-reactjs-renderer';

class App extends Component {
  static contextType = UALContext
  constructor(props) {
    // Inherit constructor
    super(props);
    // State for showing/hiding components when the API (blockchain) request is loading
    this.state = {
      loading: true,
    };
    // Bind functions
    this.getCurrentUser = this.getCurrentUser.bind(this);
    // Call getCurrentUser before mounting the app
    this.getCurrentUser();
  }

  componentDidUpdate(prevProps) {
    const { setUser, user: { name } } = this.props;
    // Via withUAL() below, access to the error object is now available
    // This error object will be set in the event of an error during any UAL execution
    const {
      ual: { error },
    } = this.props
    const {
      ual: { error: prevError },
    } = prevProps
    if (error && (prevError ? error.message !== prevError.message : true)) {
      // UAL modal will display the error message to the user, so no need to render this error in the app
      console.error('UAL Error', JSON.parse(JSON.stringify(error)))
    }
    if ((this.context == undefined || this.context.activeUser == null) && name) {
      setUser({
        registered: false,
        name: "",
      })
    }
  }

  displayNotificationBar = (display) => this.setState({ showNotificationBar: display })

  displayResults = (display) => this.setState({ showResults: display })

  displayError = (error) => {
    if (error.source) {
      console.error('UAL Error', JSON.parse(JSON.stringify(error)))
    }
    //console.log('UAL Info', JSON.parse(JSON.stringify(error)))
    //console.log('UAL Info', error)
    this.setState({ error })
    this.displayNotificationBar(true)
  }

  displayResponse = (resp) => {
    this.setState({ error: null, resp })
    this.displayNotificationBar(true)
  }

  clearMessage = () => {
    this.setState({ error: null, resp: null })
    this.displayNotificationBar(false)
  }

  componentDidMount() {
    this._isMounted = true
    document.body.classList.add('is-loaded')
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  static propTypes = {
    ual: shape({
      error: instanceOf(Error),
      logout: func,
      showModal: func.isRequired,
      hideModal: func.isRequired,
    }),
  }

  displayLoginModal = (display) => {
    // Via withUAL() below, access to the showModal & hideModal functions are now available
    const {
      ual: { showModal, hideModal },
    } = this.props
    if (display) {
      showModal()
    } else {
      hideModal()
    }
  }

  getCurrentUser() {
    // Extract setUser of UserAction from redux
    const { setUser } = this.props;
    // Send a request to API (blockchain) to get the current logged in user
    //console.log("calling getCurrentUser")
    return ApiService.getCurrentUser()
      // If the server return a username
      .then(username => {
        // Save the username to redux store
        // For structure, ref: ./frontend/src/reducers/UserReducer.js
        setUser({ name: username });
      })
      // To ignore 401 console error
      .catch(() => { })
      // Run the following function no matter the server return success or error
      .finally(() => {
        // Set the loading state to false for displaying the app
        this.setState({ loading: false });
      });
  }

  render() {

    const login = () => this.displayLoginModal(true)
    // Extract data from state and props (`user` is from redux)
    const { loading } = this.state;
    const { user: { name, game, registered } } = this.props;

    // Determine the app status for styling
    let appStatus = "login";
    if (game && game.status !== 0) {
      appStatus = "game-ended";
    } else if (game && game.selected_card_ai > 0) {
      appStatus = "card-selected";
    } else if (game && game.deck_ai.length !== 17) {
      appStatus = "started";
    } else if (name) {
      appStatus = "profile";
    }

    // Set class according to loading state, it will hide the app (ref to css file)
    // If the username is set in redux, display the Game component
    // If the username is NOT set in redux, display the Login component
    return (
      <div className={`App status-${appStatus}${loading ? " loading" : ""}`}>
        {registered && <Game />}
        {!registered && <Login login={login} />}
      </div>
    );
  }

}

// Map all state to component props (for redux to connect)
const mapStateToProps = state => state;

// Map the following action to props
const mapDispatchToProps = {
  setUser: UserAction.setUser,
};

// Export a redux connected component
export default connect(mapStateToProps, mapDispatchToProps)(App);
