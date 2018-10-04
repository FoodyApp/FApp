/**
* Sample React Native App
* https://github.com/facebook/react-native
* @flow
*/

import React, { Component } from 'react';
import {
	AppRegistry,
	StyleSheet,
	AsyncStorage,
	Text,
	View,
	BackHandler,
	Image,
    Platform,
	StatusBar,
	PermissionsAndroid,
	Alert,
	Dimensions,
	NetInfo,
} from 'react-native';

const win = Dimensions.get('window');
const ratioforlogo = win.width-30/726; 

import FusedLocation from 'react-native-fused-location';

export default class SplashScreen extends React.Component {
	static navigationOptions = {
		title: 'Splash',
		header: null
	};

	constructor(props){
  		super(props);
  		this.state = {
  			positions: null,
			displayMessage: false,
		};
  	}
	
	componentDidMount() {
		StatusBar.setHidden(true);
		that = this;
		
		setTimeout(() => {
			if(Platform.OS == "ios"){
				that.geolocationIos();
			}else{
				that.geolocation();
			}
		},3000);
	}

	geolocation = async () => {
		that = this;
		try{
			const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
					title: 'App needs to access your location',
					message: 'App needs access to your location ' +
						'so we can let our app be even more awesome.'
				}
			);
			if (granted) {

				FusedLocation.setLocationPriority(FusedLocation.Constants.HIGH_ACCURACY);

				const location = await FusedLocation.getFusedLocation();
				this.setState({lat: location.latitude, long: location.longitude});

				FusedLocation.setLocationPriority(FusedLocation.Constants.BALANCED);
				FusedLocation.setLocationInterval(20000);
				FusedLocation.setFastestLocationInterval(15000);
				FusedLocation.setSmallestDisplacement(10);

				FusedLocation.startLocationUpdates();

				this.subscription = FusedLocation.on('fusedLocation', location => {
				    const lat = location.latitude;
					const lng = location.longitude;
					that.checkLogin(lat,lng);
				});
			}
		 }catch(e){alert(e)} 
	}
	
	
	componentWillUnmount() {
		FusedLocation.off(this.subscription);
		FusedLocation.stopLocationUpdates(); 
	}  

	geolocationIos = async () => {
		that = this;
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const lat = position.coords.latitude;
				const lng = position.coords.longitude;
				this.checkLogin(lat,lng);
			},
			(error) => {
				Alert.alert(
				  'Location',
				  'We are not able to get your current location.',
				  [
					{text: 'Cancel', style: 'cancel'},
					{text: 'Try Again', onPress: () => this.geolocationIos()},
				  ],
				  { cancelable: false }
				)
			},
			{ enableHighAccuracy: false, timeout: 5000, maximumAge: 1000, distanceFilter: 1 }
		);
	}
	
	
	checkLogin = async (lat,lng) => {
		await AsyncStorage.setItem('current_latitude', String(lat));
		await AsyncStorage.setItem('current_longitude', String(lng));
		
		const isLoggedin = await AsyncStorage.getItem('loggedin');
		const { navigate } = this.props.navigation;
		if(isLoggedin == null || isLoggedin == "false")
		{
			navigate('Login');
		}
		else
		{
			navigate('HomeTab');
		}
	}
	render() {
		return(
			<View style={{flex: 1}}>
				<View style={styles.container}>
					<Image source={require('./images/icon.png')} style={styles.splashLogo} />
				</View>
				<View style={styles.errorMessage}>
					<Text style={this.state.displayMessage ? styles.show : styles.hide }>
						This device is not compatible for geolocation
					</Text>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#ffffff",
		flex: 1,
		justifyContent:'center',
		alignItems:'center',
		flexDirection: "row",
	},
	splashLogo: {
		width: win.width-30,
		height: 141 * ratioforlogo,
	},
	errorMessage: {
		position: "absolute",
		bottom: 100,
		width: "100%",
	},
	show: {
		textAlign: "center",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		fontSize: 16,
		color: "red",
		fontWeight: "bold",
	},
	hide: {
		display: "none",
	},
});

AppRegistry.registerComponent('FApp', () => FApp);
