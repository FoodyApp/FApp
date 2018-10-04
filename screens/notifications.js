/**
ANDROID iOS Fonts Setup :: https://medium.com/react-native-training/react-native-custom-fonts-ccc9aacf9e5e
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 dynamic Image : source={{ uri: imagebaseURL+responseData.data[i].item_icon }}

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
  ActivityIndicator,
  BackHandler,
  Keyboard,
  AsyncStorage,
  Share,
  Platform,
  NetInfo,
  Dimensions,
  FlatList,
  TouchableWithoutFeedback,  
} from 'react-native';

//import PushNotification from 'react-native-push-notification';
import { StackNavigator } from 'react-navigation';

import Rating from 'react-native-rating';
import { Easing } from 'react-native';
import Swipeout from 'react-native-swipeout';

import './global.js';

export default class notificationScreen extends React.Component {

    static navigationOptions = {
        title: 'Notification',
        header: null,
		tabBarVisible: false
    };

	constructor(props){
		super(props);
		this.state = {
			responseData: "",
			nodata: false,
			nodatamessage: null,
		}
		
		this._renderItemView = this._renderItemView.bind(this);
	}
	
	componentDidMount() {
		this.getNotification();
	}
	
	getNotification = async () => {
		that = this;
		this.setState({isLoading: true})
		
		const token = await AsyncStorage.getItem('token');
		const current_userId = await AsyncStorage.getItem('userId');
		
		fetch(baseURL+"getMyNotification", {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': token,
			},
			body: JSON.stringify({
				user_id: current_userId,
			})
		})
		.then((response) => response.json())
		.then(async (responseData) => {
				this.setState({isLoading: false})
				if(responseData.status == "success"){
					this.setState({ responseData: responseData.data });
				}else if(responseData.status == "logout"){
					this.setState({
						isLoading: false,
						nodata: true,
						nodatamessage: "Please login to check notifications",
					})
				}else if(token == null){
					this.setState({
						isLoading: false,
						nodata: true,
						nodatamessage: "Please login to check notifications",
					})
				}else{
					this.setState({
						isLoading: false,
						nodata: true,
						nodatamessage: response.message,
					})
				}		
		}).catch((error) => {
			this.setState({
				isLoading: false,
				nodata: true,
				nodatamessage: "Something went wrong. Please try again later",
			})
		}).done(); 
	}
	
	_renderItemView({item, index}){
		return (
		<TouchableHighlight
			onPress={()=>this.readNotification(item.id,item.is_read)}
		>
			<Text style={ item.is_read == "0" ? styles.listtext:styles.listtext2 }>
				{item.message}
			</Text>
		</TouchableHighlight>
		)
	}
	
	goBack = () => {
	  this.props.navigation.goBack();
	}
	
	readNotification = async (id,isRead) => {
		if(isRead != "1"){
			that = this;
			this.setState({isLoading: true})
			
			const token = await AsyncStorage.getItem('token');
			const current_userId = await AsyncStorage.getItem('userId');
			
			fetch(baseURL+"readNotification", {
				method: "POST",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': token,
				},
				body: JSON.stringify({
					notification_id: id,
				})
			})
			.then((response) => response.json())
			.then(async (responseData) => {
				this.setState({isLoading: false})
				if(responseData.status == "success"){
					that.getNotification();
				}else if(responseData.status == "logout"){
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
			})
			.done(); 
		}
	}
	
	render() {
		return (
			<View style={styles.container}>
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
					<Text style={styles.headerText}>NOTIFICATIONS</Text>
				</View>
				<View style={styles.listing}>
					<ScrollView>
						<FlatList
							data={this.state.responseData}
							extraData={this.state}
							renderItem={this._renderItemView}
							keyExtractor={(item, index) => index}
						/>
						{
							this.state.nodata == true &&
							<View style={{height: Dimensions.get('window').height-225, flexDirection: "column",justifyContent: "center", alignItems: "center"}}>								
								<Text style={{fontFamily: "SourceSansPro-Regular", fontSize: 16,}}>{this.state.nodatamessage}</Text>
							</View>
						}
					</ScrollView>
				</View>
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
		flex:1,
	},
	container:{
		backgroundColor: "#ffffff",
		flexDirection: "column",
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
	headerText:{
		color: "#9c9c9c",		
		fontSize: 20,
		flex: 2,
		marginTop: 4,
		fontFamily: 'SourceSansPro-Regular',
	},
	listing: {
		flexDirection:'row', 	
		flexWrap:'wrap',
	},
	listtext: {
		fontFamily: 'SourceSansPro-Regular',
		fontSize: 15,
		paddingBottom: 10,
		paddingTop: 10,
		paddingLeft: 20,
		paddingRight: 20,
		borderBottomColor: "#c1c1c1",
		borderBottomWidth: 1,	
		backgroundColor: "#c1c1c1",
		fontWeight: "bold",
	},
	listtext2: {
		fontFamily: 'SourceSansPro-Regular',
		fontSize: 15,
		paddingBottom: 10,
		paddingTop: 10,
		paddingLeft: 20,
		paddingRight: 20,
		borderBottomColor: "#c1c1c1",
		borderBottomWidth: 1,
	},
});