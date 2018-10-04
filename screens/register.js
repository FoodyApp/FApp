/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform,
  BackHandler,
  AsyncStorage,
  Keyboard,
  KeyboardAvoidingView,
	NetInfo,
} from 'react-native';

import {requestPermission} from 'react-native-android-permissions';

import { StackNavigator } from 'react-navigation';
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';

const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  AccessToken,
  LoginManager,
} = FBSDK;

import './global.js';


export default class registerScreen extends React.Component {

    static navigationOptions = {
        title: 'Register',
        header: null,
		tabBarVisible: false
    };

    constructor(props){
        super(props);
        this.state = {
			txtUserName:'',
			txtEmail:'',
			txtPassword:'',
			txtConfPass:'',
			isLoading: false,
			latitude: null,
			longitude: null,
			error: '',
        };
    }

	async componentDidMount() {
		BackHandler.addEventListener("hardwareBackPress", () => {});

		const lat_titude = await AsyncStorage.getItem('current_latitude');
		const log_gitude = await AsyncStorage.getItem('current_longitude');

		this.setState({ latitude: lat_titude });
		this.setState({ longitude: log_gitude });

	}


	 _signUp = async () => {
		Keyboard.dismiss();
        const { txtUserName, txtEmail, txtPassword, txtConfPass } = this.state

        if(this.state.txtUserName == ''){
            alert('Please Enter Your User Name.');
        }else if(this.state.txtEmail == ''){
            alert('Please Enter Your Email ID.');
        }else if(!this.validateEmail(this.state.txtEmail)){
            alert('Your Email ID is not valid');
        }else if(this.state.txtPassword == ''){
			alert('Please Enter Password');
		}else if(this.state.txtPassword.length <= 6){
			alert('Password must be greater than 6 characters');
		}else if(this.state.txtConfPass == ''){
			alert('Please Enter Confirm Password');
		}else if(this.state.txtPassword != this.state.txtConfPass){
			alert('Your Password and Confirm Password Must be Same.');
        }else{

		   this.setState({isLoading: true})
			const token = "Test123";;
			fetch(baseURL+"register", {
			  method: "POST",
			  headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			  },
			  body: JSON.stringify({
					username: this.state.txtUserName,
					email: this.state.txtEmail,
					password: this.state.txtPassword,
					device_type: Platform.OS,
					device_token: token,
					is_social_login: '0',
					user_facebook_id: '',
					user_google_id: '',
					lat: this.state.latitude,
					long: this.state.longitude,
			  })
			})
		   .then((response) => response.json() )
		   .then((responseData) => {
				if(responseData.status == "success"){
				   this.setState({isLoading: false})
				   alert(responseData.message);
				   const { navigate } = this.props.navigation;
				   navigate('Login');
				}else{
				   this.setState({isLoading: false})
				   alert(responseData.message);
			   }
		   }).catch((error) => {
				this.setState({isLoading: false})
				NetInfo.isConnected.fetch().then(isConnected => {
				   if(isConnected)
				   {
					   alert("Something went wrong. Please try again later");
				   }
				   else
				   {
						alert("No internet connection availble");
				   }
				})
			})
		 .done();
        }
    };

	_Facebook_Login = () => {
		Keyboard.dismiss();
	/*	LoginManager.logInWithReadPermissions(['public_profile']).then(
		  function(result) {
			if (result.isCancelled) {
			  alert('Login cancelled');
			} else {
			  alert('Login success with permissions: '
				+result.grantedPermissions.toString());
			}
		  },
		  function(error) {
			alert('Login fail with error: ' + error);
		  }
		); */

	}
	_callGoogle = () => {
		Keyboard.dismiss();
		GoogleSignin.configure({
		  iosClientId:'1016820305735-2qu0ib8kdirl1fbocfqjv7hqgc3hnphi.apps.googleusercontent.com',
		  androidClientId: '1016820305735-p79k1fotmpfnl30n5t35gudv91ecc7lc.apps.googleusercontent.com',
		  offlineAccess: false
		})
		.then(() => {
			GoogleSignin.signIn()
			.then((user) => {
				this._socialSignUp(user.name, user.email, '', user.id, "1");
			})
			.catch((err) => {
			  alert('WRONG SIGNIN', err);
			})
			.done();
		});
	}

	_socialSignUp = async (username, email_id, fb_id, gm_id, media_type) => {
		this.setState({isLoading: true})
		const token = "Test123";
		fetch(baseURL+"register", {
			method: "POST",
			headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				username: username,
				email: email_id,
				password: "",
				device_type: Platform.OS,
				device_token: token,
				is_social_login: '1',
				user_facebook_id: fb_id,
				user_google_id: gm_id,
				lat: this.state.latitude,
				long: this.state.longitude,
				media_type: media_type,
			})
		})
		 .then((response) => response.json() )
		 .then(async (responseData) => {
			if(responseData.status == "success"){
				this.setState({isLoading: false})

				await AsyncStorage.setItem('loggedin', 'true');
				await AsyncStorage.setItem('userId', String(responseData.data.id));
				await AsyncStorage.setItem('token', String(responseData.token));
				await AsyncStorage.setItem('username', String(responseData.data.username));
				await AsyncStorage.setItem('user_profile_pic', String(responseData.data.user_profile_pic));
				await AsyncStorage.setItem('user_notification_radius', String(responseData.data.user_notification_radius));

				const { navigate } = this.props.navigation;
				navigate('HomeTab');

			}else{

				 this.setState({isLoading: false})
				 alert(responseData.message);
			 }
		 }).catch((error) => {
				this.setState({isLoading: false})
				NetInfo.isConnected.fetch().then(isConnected => {
				   if(isConnected)
				   {
					   alert("Something went wrong. Please try again later");
				   }
				   else
				   {
						alert("No internet connection availble");
				   }
				})
			})
		 .done();
	}

	validateEmail = (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };

	changePage = () => {
		Keyboard.dismiss();
		this.props.navigation.goBack();
	}

	render() {

		const { navigate } = this.props.navigation;

		return (
			<ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={styles.contentContainer}>
				{
					this.state.isLoading == true &&
					<View style={styles.activityIndicatorView}>
						<ActivityIndicator size="large" style={{padding: 60}}/>
					</View>
				}
				
				<KeyboardAvoidingView behavior="padding" style={{backgroundColor: "#ffffff",}}>
				<View style={styles.container}>
					<Image source={require('./images/registerbg.png')} style={styles.bgImage}></Image>

					<Text style={styles.titleText}>CREATE ACCOUNT</Text>

					<View style={styles.innerView}>
						<View style={styles.textinputborder}>
							<TextInput
								underlineColorAndroid={"transparent"}
								onChangeText={txtUserName => this.setState({txtUserName})}
								value={this.state.txtUserName}
								style = {styles.inputbox}
								placeholder = 'User Name'
								maxLength={12}
								placeholderTextColor='#878384'
								returnKeyType="next"
								ref="username"
								onSubmitEditing={() => this.refs.email.focus()}
							/>
						</View>

						<View style={styles.textinputborder}>
							<TextInput
								underlineColorAndroid={"transparent"}
								onChangeText={txtEmail => this.setState({txtEmail})}
								value={this.state.txtEmail}
								style = {styles.inputbox}
								placeholder = 'Email Address'
								placeholderTextColor='#878384'
								returnKeyType="next"
								ref="email"
								onSubmitEditing={() => this.refs.password.focus()}
							/>
						</View>

						<View style={styles.textinputborder}>
							<TextInput
								underlineColorAndroid={"transparent"}
								secureTextEntry={true}
								onChangeText={txtPassword => this.setState({txtPassword})}
								value={this.state.txtPassword}
								style = {styles.inputbox}
								placeholder = 'Password'
								placeholderTextColor='#878384'
								returnKeyType="next"
								ref="password"
								onSubmitEditing={() => this.refs.confpass.focus()}
							/>
						</View>

						<View style={styles.textinputborder}>
							<TextInput
								underlineColorAndroid={"transparent"}
								secureTextEntry={true}
								onChangeText={txtConfPass => this.setState({txtConfPass})}
								value={this.state.txtConfPass}
								style = {styles.inputbox}
								placeholder = 'Confirm Password'
								placeholderTextColor='#878384'
								ref="confpass"
							/>
						</View>

						<TouchableHighlight
							underlayColor={"rgba(0,0,0,0)"}
							onPress={this._signUp}
							style = {styles.button}>
							<Text style = {styles.buttonText}>Sign up</Text>
						</TouchableHighlight>
					</View>

					{/* Seperator */}
					<View style={styles.lineseperator}></View>
					<View style={styles.centerText}><Text style={styles.textOr}>OR</Text></View>

					<View style={styles.socialbuttonView}>
						<TouchableHighlight
							underlayColor={"rgba(0,0,0,0)"}
							onPress={()=>this._Facebook_Login()}
							style = {styles.socialbtnfb}>
							<Image source={require('./images/FBLogin.png')} style={styles.socialbg}></Image>
						</TouchableHighlight>
						<TouchableHighlight
							underlayColor={"rgba(0,0,0,0)"}
							onPress = {()=>this._callGoogle()}
							style = {styles.socialbtngp}>
							<Image source={require('./images/gpluslogin.png')} style={styles.socialbg}></Image>
						</TouchableHighlight>
					</View>

					<Text style = {styles.textLogin}>Already have an account? <Text style={styles.loginBtn} onPress={this.changePage}>Log in here</Text></Text>
				</View>
				</KeyboardAvoidingView>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({

	activityIndicatorView :{
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		flex: 1,
		zIndex: 1,
	},
	container: {
		flex: 1,
		marginLeft: 0,
		marginRight: 0,
		alignItems:'center',
		justifyContent: 'flex-start',
		backgroundColor: "#ffffff",
	},
 bgImage: {
    justifyContent: 'center',
    alignItems:'center',
	height: 300,
  },
  titleText: {
    fontSize: 40,
    textAlign: 'center',
	  width: 250,
    margin: 20,
	  justifyContent: 'center',
	  color: '#ffffff',
	  position: 'absolute',
	  top: 100,
    backgroundColor: 'transparent',
	fontFamily: 'SourceSansPro-Regular',
  },
  innerView: {
      margin: 10
  },
  inputbox: {
		fontSize: 15,
		color: '#878384',
		width: 300,
		height: 50,
		textAlign: 'center',
		marginTop: 0,
	fontFamily: 'SourceSansPro-Regular',
	},
	textinputborder:{
		borderBottomWidth: 1,
		borderBottomColor: '#c1c1c1',
	},
  button:{
      height:40,
	  width: 300,
	  borderColor:'#9c9c9c',
	  borderWidth: 1,
	  borderRadius: 5,
      marginTop:10,
    },
	buttonText: {
		color: '#e3323b',
		justifyContent:'center',
		fontSize: 15,
		textAlign: 'center',
		paddingTop: 10,
	fontFamily: 'SourceSansPro-Regular',
	},
	textOr: {
		fontSize: 15,
		textAlign: 'center',
		fontFamily: 'SourceSansPro-Regular',
	},
	lineseperator: {
		borderBottomWidth: 1,
		borderColor: "#c1c1c1",
		flex: 1,
		width: 300,
		marginTop: 10,
	},
	centerText:{
		marginTop: -12,
		backgroundColor: "#ffffff",
		paddingLeft: 10,
		paddingRight: 10,
	},
	textLogin: {
		fontSize: 15,
		textAlign: 'center',
		marginTop: 10,
		marginBottom: 20,
	fontFamily: 'SourceSansPro-Regular',
	},
	loginBtn: {
		color: '#FC7B7F',
		borderBottomColor: '#FC7B7F',
		borderBottomWidth: 1,
		fontFamily: 'SourceSansPro-Regular',
	},
	socialbtn: {
		fontSize: 15,
		lineHeight: 30,
		color: '#FFFFFF',
		textAlign: 'center'
	},
	socialbuttonView:{
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		width: 300,
		marginTop: 10,
		marginBottom: 10
	},
	socialbtnfb: {
		height:40,
		width: 140,
		justifyContent:'center',
	},
	socialbtngp: {
		height:40,
		width: 140,
		marginLeft: 20,
		justifyContent:'center',
	},
	socialbg:{
		flex: 1,
		height: 40,
		width: 140,
	}

});
