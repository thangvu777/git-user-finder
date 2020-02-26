import React, { Fragment, Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Search from './components/users/Search';
import Users from './components/users/Users';
import User from './components/users/User';
import Alert from './components/layout/Alert';
import About from './components/pages/About';
import axios from 'axios';
import './App.css';

// Can be function based or class based.
//(Class can have states) // Functions can have states with hooks
class App extends Component {
	// You want the state to be in the main APP component
	state = {
		users: [],
		user: {},
		repos: [],
		loading: false,
		alert: null
	};

	// // Life cycle method
	// async componentDidMount() {
	//   this.setState({ loading: true }); // To update static state
	//   // await resolution
	//   const res = await axios.get(
	//     `https://api.github.com/users?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_SECRET}`
	//   );
	//   this.setState({ users: res.data, loading: false });
	// }

	// Search Github users
	searchUsers = async text => {
		this.setState({ loading: true });
		// await resolution
		const res = await axios.get(
			`https://api.github.com/search/users?q=${text}&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_SECRET}`
		);
		this.setState({ users: res.data.items, loading: false }); // .data has other stuff
	};

	// Get single github user
	getUser = async username => {
		this.setState({ loading: true });
		// await resolution
		const res = await axios.get(
			`https://api.github.com/users/${username}?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_SECRET}`
		);
		this.setState({ user: res.data, loading: false }); // data is the json
	};

	// Get users repos
	getUserRepos = async username => {
		this.setState({ loading: true });
		// await resolution
		const res = await axios.get(
			`https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_SECRET}`
		);
		this.setState({ repos: res.data, loading: false }); // .data has other stuff
	};

	// Clear users from state
	clearUsers = () => this.setState({ users: [], loading: false });

	setAlert = (msg, type) => {
		this.setState({ alert: { msg, type } });
		setTimeout(() => this.setState({ alert: null }), 5000); //5000ms = 5 s
	};

	// JSX gets compiled to javascipt
	render() {
		// Life Cycle method
		const { users, user, repos, loading } = this.state;

		return (
			<Router>
				<div className='App'>
					<Navbar />
					<div className='container'>
						<Alert alert={this.state.alert} />
						<Switch>
							<Route
								exact
								path='/'
								render={props => (
									<Fragment>
										<Search
											searchUsers={this.searchUsers}
											clearUsers={this.clearUsers}
											showClear={users.length > 0 ? true : false}
											setAlert={this.setAlert}
										/>
										<Users loading={loading} users={this.state.users} />
									</Fragment>
								)}
							/>
							<Route exact path='/about' component={About} />
							<Route
								exact
								path='/user/:login'
								render={props => (
									<User
										{...props}
										getUser={this.getUser}
										getUserRepos={this.getUserRepos}
										repos={repos}
										user={user}
										loading={loading}
									/>
								)}
							/>
						</Switch>
					</div>
				</div>
			</Router>
		);
	}
}

export default App;
