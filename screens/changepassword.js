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
  ScrollView,
  ContentView,
  AsyncStorage,
  Dimensions,
  ActivityIndicator,
  InlineImage,
  BackHandler,
  Platform,
	NetInfo,
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import FitImage from 'react-native-fit-image';

import './global.js';

export default class changePasswordScreen extends React.Component {

    static navigationOptions = {
        title: 'Change Password',
        header: null,
		tabBarVisible: false
    };

	constructor(props){
		super(props);
		this.state = {
			isLoading: false
		};
	}
	componentDidMount() {
		BackHandler.addEventListener("hardwareBackPress", () => { return true });
	}

   render() {

   const { navigate } = this.props.navigation;

    return (
		<View style={styles.container}>
			<View style={styles.activityIndicatorView}>
			  {
				this.state.isLoading ?  <ActivityIndicator size="large" style={{padding: 60}}/> : null
			  }
			</View>
			<View style={styles.header}>
				<TouchableHighlight
				underlayColor={"rgba(0,0,0,0)"}
				onPress={this.goBack}>
					<Image source={require('./images/header/back_gray.png')} style={styles.headerMenu}></Image>
				</TouchableHighlight>
				<Text style={styles.headerText}>CHANGE PASSWORD</Text>
			</View>
			<View style={styles.innerView}>
				<View style={styles.textinputborder}>
					<TextInput
					underlineColorAndroid={"transparent"}
					secureTextEntry={true}
					onChangeText={txtOldPassword => this.setState({txtOldPassword})}
					//value={this.state.txtPassword}
					style = {styles.inputbox}
					placeholder = 'Old Password'
					placeholderTextColor='#878384'
					/>
				</View>
				<View style={styles.textinputborder}>
					<TextInput
					underlineColorAndroid={"transparent"}
					secureTextEntry={true}
					onChangeText={txtNewPassword => this.setState({txtNewPassword})}
					//value={this.state.txtPassword}
					style = {styles.inputbox}
					placeholder = 'New Password'
					placeholderTextColor='#878384'
					/>
				</View>
				<View style={styles.textinputborder}>
					<TextInput
					secureTextEntry={true}
					underlineColorAndroid={"transparent"}
					onChangeText={txtConfPassword => this.setState({txtConfPassword})}
					//value={this.state.txtPassword}
					style = {styles.inputbox}
					placeholder = 'Confirm Password'
					placeholderTextColor='#878384'
					/>
				</View>
				<TouchableHighlight
				underlayColor={"rgba(0,0,0,0)"}
				onPress={this.changepassword}
				style = {styles.button}>
					<Text style = {styles.buttonText}>Change password</Text>
				</TouchableHighlight>
			</View>
		</View>
    );
  }

	changepassword = async () => {
		that = this;
		const {state} = this.props.navigation;

		const userId = await AsyncStorage.getItem('userId');
		const token = await AsyncStorage.getItem('token');

		const {txtOldPassword, txtNewPassword, txtConfPassword} = this.state

		if(this.state.txtOldPassword == '' || this.state.txtOldPassword == undefined){
			alert('Please Enter Old Password');
		}else if(this.state.txtNewPassword == '' || this.state.txtNewPassword == undefined){
			alert('Please Enter New Password');
		}else if(this.state.txtConfPassword == '' || this.state.txtConfPassword == undefined){
			alert('Please Enter Confirm Password');
		}else if(this.state.txtNewPassword != this.state.txtConfPassword){
			alert('New Password and Confirm Password must be same');
		}else{
			this.setState({isLoading: true})
			fetch(baseURL+"changePassword", {
				method: "POST",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization' : token
				},
				body: JSON.stringify({
					old_password: this.state.txtOldPassword,
					new_password: this.state.txtNewPassword,
					confirm_password: this.state.txtConfPassword,
					user_id: userId
				})
			})
			.then((response) => response.json())
			.then((responseData) => {
				if(responseData.status == "success"){
					this.setState({isLoading: false})
					alert(responseData.message);
					that.props.navigation.goBack();
				}else if(responseData.status == "logout"){
					alert("Your Session is Expired. Please Login Again");
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
	}
	goBack = () => {
		this.props.navigation.goBack();
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
		flex:1,
	  },
	header:{
		paddingLeft: 10,
		paddingTop: 10,
		paddingBottom: 10,
		flexDirection: "row",
		borderBottomColor: "#c1c1c1",
		borderBottomWidth: 1,
	},
	headerMenu:{
		height: 20,
		width: 20,
		marginTop: 7,
		marginRight: 10,
	},
	headerText:{
		fontSize: 20,
		flex: 2,
		color: "#9c9c9c",
		marginTop: 4,
		fontFamily: 'SourceSansPro-Regular',
	},

	container: {
		flex: 1,
    flexDirection: "column",
    backgroundColor: "#ffffff",
	},
  innerView: {
		paddingLeft: 20,
		paddingRight: 20,
  },

	titleText: {
		fontSize: 40,
		textAlign: 'center',
		width: 250,
		margin: 20,
		fontFamily: 'MontserratAlternates-SemiBold',
		justifyContent: 'center',
		color: '#ffffff',
		position: 'absolute',
		top: 100,
		backgroundColor: 'transparent',
	},
	inputbox: {
		fontSize: 15,
		color: '#878384',
		height: 50,
		textAlign: 'center',
		marginTop: 0,
	},
	textinputborder: {
		borderBottomWidth: 1,
		borderBottomColor: '#c1c1c1',
	},
	button:{
		borderColor:'#9c9c9c',
		borderWidth: 1,
		marginTop:20,
		borderRadius: 5,
	},
	buttonText: {
		color: '#e3323b',
		justifyContent:'center',
		fontSize: 15,
		textAlign: 'center',
		paddingBottom: 10,
		paddingTop: 10,
	},
});