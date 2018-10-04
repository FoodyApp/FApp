/**
* Sample React Native App
* https://github.com/facebook/react-native
* @flow
*/

import React, { Component } from 'react';
import {
	AppRegistry,
	StyleSheet,
	Text,
	View,
	TextInput,
	TouchableHighlight,
	Image,
	Alert,
	Navigator,
	ActivityIndicator,
	ScrollView,
    BackHandler,
    Platform,
	Keyboard,
	NetInfo,
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import './global.js';



export default class forgotPassScreen extends React.Component {
	static navigationOptions = {
		title: 'Forgot Password',
		header: null
	};

	constructor(props){
		super(props);
		this.state = {
			txtEmailId:'',
			isLoading: false,
		};
	}
	componentDidMount() {
		BackHandler.addEventListener("hardwareBackPress", () => { Alert.alert(
			'Exit App',
			'Are you sure you want to exit app ?',
				[
					{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
					{text: 'OK', onPress: () => BackHandler.exitApp() },
				],
				{
					cancelable: false
				}
			)
			return true;
		});
	}
	
	changePage = () => {
		Keyboard.dismiss();
		this.props.navigation.goBack();
	}
	callForgotPassword = () => {

		const {txtEmail} = this.state

		if(this.state.txtEmail == '' || this.state.txtEmail == undefined){
			alert('Please Enter Your Email ID.');
		}else if(!this.validateEmail(this.state.txtEmail)){
			alert('Your Email ID is not valid');
		}else{
			this.setState({isLoading: true})
			fetch(baseURL+"forgotPassword", {
				method: "POST",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email: this.state.txtEmail
				})
			})
			.then((response) => response.json())
			.then((responseData) => {

			if(responseData.status == "success"){
				this.setState({isLoading: false})
				alert("Email sent for forgot password request, please check.");
				this.props.navigation.goBack();
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
	}

	validateEmail = (email) => {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	};
	
	render() {
		return (
			<View style={styles.container} keyboardShouldPersistTaps="always">
				{
					this.state.isLoading == true &&
					<View style={styles.activityIndicatorView}>
						<ActivityIndicator size="large" style={{padding: 60}}/>
					</View>
				}
				<ScrollView contentContainerStyle={styles.contentContainer}>
					<Image source={require('./images/loginbg.png')} style={styles.bgImage}></Image>
					<Text style={styles.titleText}>FORGOT PASSWORD</Text>
					<View style={styles.innerView}>
						<View style={styles.textinputborder}>
							<TextInput
								underlineColorAndroid={"transparent"}
								onChangeText={txtEmail => this.setState({txtEmail})}
								//value={this.state.txtEmail}
								style = {styles.inputbox}
								placeholder = 'Email Address'
								placeholderTextColor='#878384'
							/>
						</View>
						<TouchableHighlight
							underlayColor={"rgba(0,0,0,0)"}
							onPress={this.callForgotPassword}
							style = {styles.button}>
							<Text style = {styles.buttonText}>Request password</Text>
						</TouchableHighlight>
					</View>
					<View style={styles.redirectionTextContainer}>
						<Text style={styles.textLogin}>Go back to <Text style={styles.btnLogin} onPress={this.changePage} >Login</Text></Text>
					</View>
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({

	activityIndicatorView :{
		justifyContent: 'center',
		alignItems:'center',
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
		flexDirection: "column",
		backgroundColor: "#ffffff",
	},
	contentContainer: {
		marginLeft: 0,
		marginRight: 0,
		alignItems:'center',
		justifyContent: 'flex-start',
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
		borderColor: "#9c9c9c",
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
	btnLogin: {
		color: '#FC7B7F',
		marginTop: 10,
		marginBottom: 20,
	},
	redirectionTextContainer: {
		flexDirection: "row",
	},

	loginBtn: {
		color: '#FC7B7F',
		textAlign: "right",
		fontFamily: 'SourceSansPro-Regular',
	},

});
