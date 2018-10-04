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
  Button,
  AsyncStorage,
  BackHandler,
  ActivityIndicator,
  Share,
  Platform,
  Dimensions,
  FlatList,
  TouchableWithoutFeedback,
	NetInfo,
} from 'react-native';

import { StackNavigator } from 'react-navigation';

import Rating from 'react-native-rating'
import { Easing } from 'react-native'

import MapView from 'react-native-maps';
import Tabs from 'react-native-tabs';

const images = {
  starFilled: require('./images/listing/filledstar.png'),
  starUnfilled: require('./images/listing/blankstar.png')
}

import './global.js';


export default class myReviewScreen extends React.Component {

    static navigationOptions = {
        title: 'My Review',
        header: null,
    };

	constructor(props){
		super(props);
		this.state = {
			isLoading: false,
			latitude: null,
			longitude: null,
      initialReg: null,
			markers: [],
		}
	}
	async componentDidMount() {
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

    const lat_titude = await AsyncStorage.getItem('current_latitude');
		const log_gitude = await AsyncStorage.getItem('current_longitude');

    this.setState({
        latitude: lat_titude,
        longitude: log_gitude
    })

		this.searchRestaurantData();
	}

	openReviewScreen = (ids) => {
		if(ids != 0){
			const { navigate } = this.props.navigation;
			navigate("AddRestReview",{restId: ids});
		}
	}

	searchRestaurantData = async () => {
		that = this;

		this.setState({isLoading: true})

		this.setState({
			markers: this.state.markers.concat([
				{
					coordinates: {
						latitude: Number(this.state.latitude),
						longitude: Number(this.state.longitude)
					},
					key: "",
					title: "You are here",
					id: 0,
					item: "You are here",
					index: "",
					img: "",
				}
			]),
		});

		fetch(baseURL+"getCravinRestaurantList", {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				lattitude: this.state.latitude,
				longitude: this.state.longitude,
			})
		})
		.then((response) => response.json())
		.then(async(responseData) => {
			this.setState({isLoading: false})
			if(responseData.status == "success")
			{
				this.setState({ responseData: responseData.data});

				for(i=0;i<responseData.data.length;i++)
				{
					this.setState({
						markers: this.state.markers.concat([
							{
								coordinates: {
									latitude: Number(responseData.data[i].lattitude),
									longitude: Number(responseData.data[i].longitude)
								},
								key: i+1,
								title: responseData.data[i].restaurant_name,
								id: responseData.data[i].restaurant_id,
								item: responseData.data[i].restaurant_name,
								img: responseData.data[i].restaurant_logo,
								index: i,
							}
						]),
					});
				}
			}
			else
			{
				alert(responseData.message);
			}
		}).catch((error) => {
				this.setState({isLoading: false})
				alert("Something went wrong. Please try again later");
			})
		 .done();
	}

	render() {
		return (
			<View style={styles.container}>
				{/*<View style={styles.halfScrView}>
					<Image source={require('./images/review/placeholder.jpg')} style={styles.placeimage}></Image>
				</View>*/}
				<View style={styles.halfScrView}>

					<View style={styles.mapCotainer}>
            {
              this.state.latitude != null &&

           <MapView
							style={ styles.map }
							initialRegion={{
                latitude: parseFloat(this.state.latitude),
                longitude: parseFloat(this.state.longitude),
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
								  image={require('./images/mapmarker.png')}
								  onCalloutPress={() => this.openReviewScreen(marker.id)}
								>
								<Image source={{uri: imagebaseRestaurantLogoURL+marker.img}} style={{height:25, width: 25, marginLeft: 4,}}></Image>
								</MapView.Marker>
							))
						 }
						</MapView>
            }
					</View>
					<View style={styles.fileFolder}>
						<TouchableHighlight underlayColor={"rgba(0,0,0,0)"}>
							<Image source={require('./images/review/folder.png')} style={styles.iconhere}></Image>
						</TouchableHighlight>
						<Text style={styles.textstyle}>Photos</Text>
					</View>
					<View style={styles.fileCamera}>
						<TouchableHighlight underlayColor={"rgba(0,0,0,0)"}>
							<Image source={require('./images/review/camera.png')} style={styles.iconhere}></Image>
						</TouchableHighlight>
						<Text style={styles.textstyle}>Camera</Text>
					</View>
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
	halfScrView: {
		height: Dimensions.get('window').height-50,
		flexDirection: "column",
	},
	placeimage: {
		flex: 1,
		width: "100%",
		height: "100%",
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
	fileFolder: {
		position: "absolute",
		left: Dimensions.get('window').width/2/2-25,
		bottom: 10,
		justifyContent: "center",
		alignItems: "center",
		padding: 5,
	},
	fileCamera: {
		position: "absolute",
		right: Dimensions.get('window').width/2/2-25,
		bottom: 10,
		justifyContent: "center",
		alignItems: "center",
		padding: 5,
	},
	iconhere: {
		height: 40,
		width: 40,
	},
	textstyle: {
		fontFamily: 'SourceSansPro-Regular',
		fontSize: 11,
	},
});
