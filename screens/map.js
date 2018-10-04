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
  Image,
  TouchableHighlight,
  Dimensions,
  BackHandler,
  Alert,
	NetInfo,
} from 'react-native';

//import PushNotification from 'react-native-push-notification';
import { StackNavigator } from 'react-navigation';

import MapView from 'react-native-maps';

import './global.js';

export default class mapscreen extends React.Component {

    static navigationOptions = {
        title: 'Map',
        header: null,
		tabBarVisible: false
    };

	constructor(props){
		super(props);
		this.state = {
			markers: [{
				title: 'Hello',
				key: 1,
				coordinates: {
					latitude: 37.78850,
					longitude: -122.4124,
				},
			  },
			  {
				title: 'Hi',
				key: 2,
				coordinates: {
				  latitude: 37.78880,
				  longitude: -122.4350,
				},
			  },
			  {
				title: 'How are you',
				key: 3,
				coordinates: {
				  latitude: 37.78800,
				  longitude: -122.4500,
				},  
			  }],
		}
		
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

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<TouchableHighlight
					underlayColor={"rgba(0,0,0,0)"}
					onPress={this.goBack}>
						<Image source={require('./images/header/back_gray.png')} style={styles.headerMenu}></Image>
					</TouchableHighlight>	
					<Text style={styles.headerText}>MAP</Text>
				</View>

				<View style={styles.mapCotainer}>
					<MapView
						style={ styles.map }
						initialRegion={{
						  latitude: 37.78825,
						  longitude: -122.4324,
						  latitudeDelta: 0.0922,
						  longitudeDelta: 0.0421,
						}}
					>
					  {
						this.state.markers.map(marker => (
						<MapView.Marker 
						  coordinate={marker.coordinates}
						  key={marker.key}
						  title={marker.title}
						/>
					    ))
					 }
					</MapView>
				</View>
			</View>	  
		);
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
	container:{
		backgroundColor: "#ffffff",
		flexDirection: "column",
	},
	header:{
		paddingLeft: 10,
		paddingTop: 10,
		paddingBottom: 10,
		flexDirection: "row",
		borderBottomColor: "#e3323b",
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
		fontWeight: "bold",
		flex: 2,
		marginTop: 4,
		fontFamily: 'SourceSansPro-Regular',
	},
	mapCotainer: {
		position: "relative",
		height: Dimensions.get('window').height-50,
	},
	map: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
});