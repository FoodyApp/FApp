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
  Dimensions,
  InlineImage,
  BackHandler,
  AsyncStorage,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
  Slider,
	NetInfo,
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import FitImage from 'react-native-fit-image';
import FlipToggle from 'react-native-flip-toggle-button';
import PhotoUpload from 'react-native-photo-upload';

import './global.js';

export default class settingScreen extends React.Component {

    static navigationOptions = {
        title: 'Setting',
        header: null
    };
	constructor(props){
		super(props);
		this.state = {
			latitude: null,
			longitude: null,
			error: null,
			sliderValue: 0.2,
			response: "",
			isLoading: false,
			leftVal: 0,
			textMoveVal: 0,
			profile_pic: null,
			username: "",
			about_me: "",
			website: "",
			radius: 0,
			new_dishes: false,
			allow_followers: false,
			AvtarState: "",
			
			distance: 0,
            minDistance: 0,
            maxDistance: 50
		};
	}
	async componentDidMount() {
		BackHandler.addEventListener("hardwareBackPress", () => { return true });
		
		const lat_titude = await AsyncStorage.getItem('current_latitude');
		const log_gitude = await AsyncStorage.getItem('current_longitude');
		
		this.setState({ latitude: lat_titude });
		this.setState({ longitude: log_gitude });
		
		this.getUserDetail();
	}

	getUserDetail = async () => {
		that = this;
		
		this.setState({isLoading: true})
		const token = await AsyncStorage.getItem('token');
		const userId = await AsyncStorage.getItem('userId');
		fetch(baseURL+"getUserDetail", {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': token,
			},
			body: JSON.stringify({
				user_id: userId,
			})
		})
		.then((response) => response.json())
		.then(async (responseData) => {
			this.setState({isLoading: false})
			
			if(responseData.status == "success")
			{
				this.setState({profile_pic: imagebaseProfileURL+responseData.data.user_profile_pic});
				this.setState({username: responseData.data.username});
				this.setState({about_me: responseData.data.about_me});
				this.setState({website: responseData.data.website});
				
				if(responseData.data.new_dishes_from_favorite == "0")
					this.setState({new_dishes: false});
				else
					this.setState({new_dishes: true});
				
				if(responseData.data.allow_non_followers == "0")
					this.setState({allow_followers: false});
				else
					this.setState({allow_followers: true});
				
				var value = responseData.data.user_notification_radius;
				
				this.setState({	distance: value	});
			}
			else if(responseData.status == "logout"){
				alert(responseData.error)
			}else if(token == null){
				alert(responseData.error)
			}else{
				alert(responseData.message)
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
		}).done(); 
	}
	updateProfile = async () => {
		that = this;
		
		this.setState({isLoading: true})
		const token = await AsyncStorage.getItem('token');
		const userId = await AsyncStorage.getItem('userId');
		
		let radius = this.state.distance;
		
		let avtarImage = null;
		if(this.state.AvtarState != "")
		{
			avtarImage = "data:image/jpeg;base64,"+this.state.AvtarState;
		}
		let userName = null;
		if(this.state.username != "")
		{
			userName = this.state.username;
		}
	
		fetch(baseURL+"saveSetting", {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': token,
			},
			body: JSON.stringify({
				user_id: userId,
				latitude: this.state.latitude,
				longitude: this.state.longitude,
				about_me: this.state.about_me,
				website: this.state.website,
				user_notification_radius: radius,
				new_dishes_from_favorite: this.state.new_dishes,
				allow_non_followers: this.state.allow_followers,
				user_profile_pic: avtarImage,
				username: userName,
			})
		})
		.then((response) => response.json())
		.then(async (responseData) => {
			this.setState({isLoading: false})
			if(responseData.status == "logout")
			{
				alert(responseData.error)
			}
			else
			{
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
	
	changeNewDishes = (newState) => {
		this.setState({ new_dishes: newState });
	}
	allowFollowers = (newState) => {
		this.setState({ allow_followers: newState });
	}
   render() {
	
    return (
		<View key={11} style={styles.container}>
			 {
				this.state.isLoading == true && 
				<View style={styles.activityIndicatorView}>
					<ActivityIndicator size={"large"} style={{padding: 60}}/>
				</View>
			  }
			
			<View style={styles.header}>
				<TouchableHighlight
				underlayColor={"rgba(0,0,0,0)"}
				onPress={this.goBack}>
					<Image source={require('./images/header/back_gray.png')} style={styles.headerMenu}></Image>
				</TouchableHighlight>
				<Text style={styles.headerText}>SETTINGS</Text>
			</View>
			<KeyboardAvoidingView behavior="padding" style={{backgroundColor: "#ffffff",}}>
			<ScrollView key={13}>
				<View key={1}>
					<View key={2} style={styles.profileImagebgView}>
     					<FitImage source={require('./images/profilebg.png')} style={styles.profilebgimage}></FitImage>
     				</View>
     				<View key={3} style={styles.profileImageView}>
     					<PhotoUpload
							style={styles.profilepic}
							onPhotoSelect={avatar => {
							if(avatar){
								  this.setState({AvtarState:avatar});
								}
							}}
						>
						<Image source={{uri: this.state.profile_pic}} style={styles.profilepic}></Image>
						</PhotoUpload>
     				</View>
     				<View key={4} style={styles.profileName}>
     					
						<TextInput
							underlineColorAndroid={"transparent"}
							value={this.state.username}
							placeholder = {"Username"}
							style = {styles.inputboxUsername}
							editable = {true}
							placeholderTextColor='#878384'
							onChangeText={username => this.setState({username: username})}
						/>
     				</View>
					
					<TextInput
						underlineColorAndroid={"transparent"}
						style = {styles.inputbox}
						placeholder = 'About me'
						placeholderTextColor='#878384'
						value={this.state.about_me}
						multiline={true}
						onChangeText={about_me => this.setState({about_me})}
					/>
					<TextInput
						underlineColorAndroid={"transparent"}
						style = {styles.inputbox2}
						placeholder = 'favorite food blog, recipe site, food video site'
						placeholderTextColor='#878384'
						value={this.state.website}
						multiline={true}
						onChangeText={website => this.setState({website})}
					/>
					
					
				
					
					
					
					<View key={5} style={styles.radiusprogressview}>
     					<Text style={styles.radiusText}>Select radius for notification</Text>
     					<Slider style={styles.sliderView}
     						minimumTrackTintColor={"#F73540"}
     						maximumTrackTintColor={"#c1c1c1"}
							step={1}
							minimumValue={this.state.minDistance}
							maximumValue={this.state.maxDistance}
							value={this.state.distance}
     						thumbTintColor={"#F73540"}
     						value={this.state.radius}
							onValueChange={val => this.setState({ distance: val })}
						/>
						<View style={styles.bottomTextContainer}>
							<Text style={styles.bottomText}>0 mi</Text>
							<Text style={styles.bottomText}>{this.state.distance} mi</Text>
							<Text style={styles.bottomText}>50 mi</Text>
						</View>
						
					</View>
					<View key={9} style={styles.notificationButtonView}>
     					<Text style={styles.notificationText}>New dish/specials from favorite restaurants</Text>	
						<FlipToggle
							value={this.state.new_dishes}
							buttonWidth={55}
							buttonHeight={22}
							buttonRadius={25}
							sliderWidth={18}
							sliderHeight={18}
							sliderRadius={50}
							buttonOnColor={"#f0848b"}
							buttonOffColor={"#c1c1c1"}
							sliderOnColor={"#ffffff"}
							sliderOffColor={"#ffffff"}
							labelStyle={{ color: 'black' }}
							onToggle={(newState) => this.changeNewDishes(newState)}
							onToggleLongPress={() => console.log('toggle long pressed!')}
						/>
     				</View>

					<View key={10} style={styles.notificationButtonView}>
     					<Text style={styles.notificationText}>Allow non-followers to see pictures</Text>
						
						<FlipToggle
							value={this.state.allow_followers}
							buttonWidth={55}
							buttonHeight={22}
							buttonRadius={25}
							sliderWidth={18}
							sliderHeight={18}
							sliderRadius={50}
							buttonOnColor={"#f0848b"}
							buttonOffColor={"#c1c1c1"}
							sliderOnColor={"#ffffff"}
							sliderOffColor={"#ffffff"}
							labelStyle={{ color: 'black' }}
							onToggle={(newState) => this.allowFollowers(newState)}
							onToggleLongPress={() => console.log('toggle long pressed!')}
						/>
     				</View>

					<Text style = {[styles.changepasswordbutton,{marginBottom: 10}]} onPress={()=>this.updateProfile()}>Save Changes</Text>
					<Text style = {styles.changepasswordbutton} onPress={this.changePass}>Change password</Text>

				</View>

			</ScrollView>
			</KeyboardAvoidingView>
		</View>
    );
  }

    editprofile = () => {

	}
	changePass = () => {
		const { navigate } = this.props.navigation;
		navigate('ChangePassword');
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
		flex: 1,
		zIndex: 1,
	},
	container: {
		backgroundColor: "#ffffff",
		flex: 1,
	},

	header:{
		paddingLeft: 10,
		paddingTop: 10,
		paddingBottom: 10,
		flexDirection: "row",
		borderBottomColor: "#9c9c9c",
		borderBottomWidth: 1,
	},
	headerMenu:{
		height: 20,
		width: 20,
		marginTop: 7,
		marginRight: 10,
	},
	headerEdit: {
		height: 25,
		width: 25,
		marginTop: 7,
		marginRight: 10,
	},
	headerText:{
		color: "#9c9c9c",		
		fontSize: 20,
		flex: 2,
		marginTop: 4,
		fontFamily: 'SourceSansPro-Regular',
	},

	profileImagebgView: {
		height: 200,
		position: "relative",
	},
	profilebgimage: {},
	profileImageView: {
		height: 140,
		position: "absolute",
		left: 0,
		right: 0,
		top: 130,
	},
	profilepic: {
		height: 140,
		width: 140,
		borderRadius: 70,
	},
	profileName: {
		marginTop: 80,
	},
	inputboxUsername: {
		fontFamily: 'SourceSansPro',
		fontWeight: 'bold',
		color: "#737373",
		fontSize: 18,
		flex: 1,
		padding : 5,
		marginLeft: 20,
		marginRight: 20,
		textAlign: "center",
	},
	inputbox: {
		fontSize: 15,
		color: '#878384',
		flex: 1,
		height: 80,
		marginTop: 10,
		borderColor : 'grey',
		borderWidth : 1,
		padding : 5,
		textAlignVertical: "top",
		marginLeft: 20,
		marginRight: 20,
		borderRadius: 5,
		marginTop: 20,
	},
	inputbox2: {
		fontSize: 15,
		color: '#878384',
		flex: 1,
		marginTop: 10,
		borderBottomColor : 'grey',
		borderBottomWidth : 1,
		paddingBottom: 0,
		textAlignVertical: "top",
		marginLeft: 20,
		marginRight: 20,
		marginTop: 10,
	},
	radiusprogressview:{
		marginTop: 20,
		flex: 1,
		position: "relative",
		marginLeft: 20,
		marginRight: 20,
		overflow: "hidden",
	},
	sliderView: {
		height: 20,
		marginTop: 5,
	},
	bottomTextContainer: {
		flex: 1,
		flexDirection: "row",
		marginBottom: 10,
		overflow: "hidden",
		backgroundColor: "#ffffff",
		alignItems: "center",
		justifyContent: "center",
		justifyContent: 'space-between'
	},
	bottomText: {
		fontFamily: 'SourceSansPro',
		fontWeight: 'bold',
		color: "#737373",
		fontSize: 14,
	},
	
	notificationButtonView: {
		position: "relative",
		flexDirection: "row",
		marginRight: 20,
		marginBottom: 20,
	},
	radioStyle: {
		flex: 2,
		justifyContent: 'flex-end',
		marginTop: 0,
	},
	notificationText: {
		fontSize: 16,
		fontFamily: 'SourceSansPro-Regular',
		marginLeft: 20,
		flex: 2,
		justifyContent: "flex-start",
	},
	changepasswordbutton: {
		height: 40,
		borderColor: "#9c9c9c",
		borderWidth: 1,
		marginLeft: 20,
		marginRight: 20,
		borderRadius: 5,
		color: "#e3323b",
		textAlign: "center",
		paddingTop: 8,
		fontSize: 18,
		fontFamily: 'SourceSansPro-Regular',
		marginTop: 10,
		marginBottom: 30,
	},

});
