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
  Clipboard,
  TouchableOpacity,
  Slider
} from 'react-native';

//import PushNotification from 'react-native-push-notification';
import { StackNavigator } from 'react-navigation';

import Geocoder from 'react-native-geocoder';

import Rating from 'react-native-rating';
import { Easing } from 'react-native';
import CheckBox from 'react-native-check-box';

import Tabs from 'react-native-tabs';

import Menu from './SideMenu';
import SideMenu from 'react-native-side-menu';
import MapView from 'react-native-maps';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const images = {
  starFilled: require('./images/listing/filledstar.png'),
  starUnfilled: require('./images/listing/blankstar.png'),
  starFilledOra: require('./images/listing/filledstar_ora.png'),
  starUnfilledOra: require('./images/listing/blankstar_ora.png')
}

import Swipeout from 'react-native-swipeout';

var swipeoutBtns = [{
	text: "Detail",
	backgroundColor: "#e3323b",
	color: "#ffffff",
}];

import './global.js';

const mapHeight = Dimensions.get('window').height-225;

export default class restaurantScreen extends React.Component {

    static navigationOptions = {
        title: 'Restaurants',
        header: null
    };

	constructor(props){
		super(props);

		this.toggle = this.toggle.bind(this);


		this.state = {
			page: 'all',
			latitude: null,
			longitude: null,
			error: null,
			isLoading: false,
			isOpen: false,
			htmlContent: null,
			isRefreshing: false,
			isMoreDetail: false,
			selectIndex: [],
			currentDisp: null,
			leftVal: 0,
			textMoveDisp: "flex",
			textMoveVal: 0,
			searchText: null,
			markers: [],
			mapstate: false,
			responseData: null,
			mapViewHeight: mapHeight,
			container_one: true,
			searchInput: "",
			searchLat: null,
			searchLong: null,
			searchRadius: 0,
			searchAddress: null,
			order: "asc",
			sort_img: require('./images/header/sorting_asc.png'),
			maplist: require('./images/header/mapmarker.png'),
			
			mapItemList: null,
			nodata: false,
			distance: 0,
            minDistance: 0,
            maxDistance: 50
		}

		this._renderItemView = this._renderItemView.bind(this);
		this._renderItemView2 = this._renderItemView2.bind(this);
	}


	 toggle() {
		this.setState({
		  isOpen: !this.state.isOpen,
		});
	  }

	  updateMenuState(isOpen) {
		Keyboard.dismiss();
		this.setState({ isOpen });
	  }

	    onMenuItemSelected = async (item) => {
			const { navigate } = this.props.navigation;
			
			if(item == "Login")
				await AsyncStorage.removeItem('loggedin');
			
			var userId = await AsyncStorage.getItem('userId');
			if(item == "profile")
				navigate(item,{userId: userId})
			else
				navigate(item);

			this.setState({
			  isOpen: false,
			});
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
		
		this.getLocationAddress();
		
	}
	
	getLocationAddress = async () => {
		
		var lat = await AsyncStorage.getItem('current_latitude');
		var lng = await AsyncStorage.getItem('current_longitude');
		
		fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + lat + ',' + lng + '&key=AIzaSyBZoOxzzUEgRDaja12SmlkLptDM_NdrSCQ')
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({
				searchAddress: responseJson.results[0].formatted_address
			});
		})
		
		
		this.setState({
			latitude: Number(lat),
			longitude: Number(lng),
			markers: [],
		});
		this.setState({
			markers: this.state.markers.concat([
				{
					coordinates: {
						latitude: Number(lat),
						longitude: Number(lng)
					},
					key: "",
					title: "You are here",
					id: 0,
					item: "You are here",
					index: "",
				}
			]),
		});
	}
	
	sorting = (val) => {
		if(this.state.order == "asc")
		{
			this.setState({
				order: "desc",
				sort_img: require('./images/header/sorting_desc.png')
			});
			if(val == 1){
				this.searchRestaurantData();
			}
		}else{
			this.setState({
				order: "asc",
				sort_img: require('./images/header/sorting_asc.png')
			});
			if(val == 1){
				this.searchRestaurantData();
			}
		}
	}
	
	searchItems = () => {
		this.setState({ container_one: false });
		this.searchRestaurantData();
	}
	getDataonPress = (index) => {
		this.setState({isMoreDetail:true, selectIndex:index})
		this.setState({ currentDisp: index })
	}

	openDetailPage = (id) => {
		const { navigate } = this.props.navigation;
		navigate('restaurantdetailScreen',{restId: id});
	}

	openFilter = () => {
		this.props.navigation.navigate('rest_filter', {
		  onNavigateBack: this.handleFilterSearch
		})
	}
	handleFilterSearch = async (refresh) => {
		if(refresh == true){
			this.searchItems();
		}
	}
	
	openMap = () => {
		
		this.setState({ isLoading: true })
		if(this.state.mapstate == true)
		{
			this.setState({ mapstate : false});
			this.setState({ isLoading: false });
			this.setState({
				maplist: require('./images/header/mapmarker.png')
			});
		}
		else
		{
			this.setState({ 
				mapstate : true,
				container_one: false,
				isLoading: false,
				mapViewHeight : mapHeight,
				maplist: require('./images/header/listview.png')
			});
		}
	}
	
	
	searchRestaurantData = async () => {
		this.setState({isLoading: true})
		var address = this.state.searchAddress;
		if(address == "" || address == null){
			this.searchRestaurantData2(this.state.searchLat,this.state.searchLong);
		}else{			
			fetch('https://maps.googleapis.com/maps/api/geocode/json?address='+address+ '&key=AIzaSyBZoOxzzUEgRDaja12SmlkLptDM_NdrSCQ')
			.then((response) => response.json())
			.then((data) => {
				const lat = data.results[0].geometry.location.lat;
				const lng = data.results[0].geometry.location.lng;
				//alert(lat+ " && "+lng);
				this.searchRestaurantData2(lat,lng);
			})
		}
	}

	searchRestaurantData2 = async (lat,lng) => {
		that = this;
		Keyboard.dismiss();
		
		var searchInput = this.state.searchInput;
		var searchLat = lat;
		var searchLong = lng;
		var searchRadius = this.state.textMoveVal;
		
		if(searchLat == null)
		{
			searchLat = await AsyncStorage.getItem('current_latitude');
			searchLong = await AsyncStorage.getItem('current_longitude');
		}
		var rest_radius = await AsyncStorage.getItem('rest_radius');
		if(rest_radius == null)
		{
			searchRadius = this.state.textMoveVal;
		}
		else
		{
			searchRadius = rest_radius;
		}
		var current_userId = await AsyncStorage.getItem('userId');
		
		var one_mi_to_km = 1.60934;
		
		var rest_sortby = await AsyncStorage.getItem('rest_sortby');
		if(rest_sortby == "null")
			rest_sortby = "";
		
		var rest_craving_category = await AsyncStorage.getItem('rest_craving_category');
		var rest_cuisine_category = await AsyncStorage.getItem('rest_cuisine_category');
		var rest_diatery_preference_category = await AsyncStorage.getItem('rest_diatery_preference_category');
		
		if(rest_craving_category != null)
			rest_craving_category = rest_craving_category.split(",")
		
		if(rest_cuisine_category != null)
			rest_cuisine_category = rest_cuisine_category.split(",")
		
		if(rest_diatery_preference_category != null)
			rest_diatery_preference_category = rest_diatery_preference_category.split(",")
		
		Clipboard.setString(
			JSON.stringify({
				lattitude: searchLat,
				longitude: searchLong,
				radius: searchRadius,
				userId: current_userId,
				sortby: rest_sortby,
				search_keyword: searchInput,
				diatery_preference_category: rest_diatery_preference_category,
				craving_category: rest_craving_category,
				cuisine_category: rest_cuisine_category,
				order: this.state.order,
			})
		)
		
		
		fetch(baseURL+"getCravinRestaurantList", {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				lattitude: searchLat,
				longitude: searchLong,
				radius: searchRadius,
				userId: current_userId,
				sortby: rest_sortby,
				search_keyword: searchInput,
				diatery_preference_category: rest_diatery_preference_category,
				craving_category: rest_craving_category,
				cuisine_category: rest_cuisine_category,
				order: this.state.order,
			})
		})
		//.then((response) => Clipboard.setString(JSON.stringify(response)))
		.then((response) => response.json())
		.then(async(responseData) => {
			this.setState({isLoading: false})
			
			if(responseData.status == "success")
			{
				this.setState({ responseData: responseData.data});
				this.setState({	nodata: false });
				
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
								id: responseData.data[i].id,
								item: responseData.data[i].restaurant_name,
								index: i,
							}
						]),
					});
				}
			}
			else
			{
				this.setState({
					nodata: true,
					responseData: null, 
				});
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
	
	checkItem = (index) => {	
		
		this.setState({ mapViewHeight : Dimensions.get('window').height-370});
		var data = [];
		data = this.state.responseData;
		var newData = data[index];
		
		this.setState({ mapItemList: [newData] });
	}
	
	_renderItemView({item, index}){
        return (
			<TouchableWithoutFeedback
				onPressIn={() => this.getDataonPress(index)}
				onPress={() => this.openDetailPage(item.restaurant_id)}
				activeOpacity={0.6}>
				<View style={styles.listView}>
					<View style={styles.listImage}>
						<Image source={{uri: imagebaseRestaurantLogoURL+item.restaurant_logo}} style={{width:90, height:90}}>
						</Image>
						<Text style={styles.price}>$$$</Text>
					</View>
					<View style={styles.listDetail}>
						<Text style={styles.proTitle}><Text style={{color: "#f7b51b",}}>#{index+1} </Text>{item.restaurant_name}</Text>
						<Text style={styles.proDesc}>{item.address_line_1}</Text>
						<Text style={styles.proDistance}>{item.distance} Mi</Text>
						<View key={6} style={[this.state.isMoreDetail && this.state.selectIndex===index?styles.listStars:styles.hidestar]}>
							<View style={styles.ratingDetails}>
								<View style={styles.rates}>
									<Text style={styles.ratesText}>Dishes</Text>

									<Rating
										max={5}
										initial={parseInt(item.menu_food_rating)}
										onChange={rating => console.log(rating)}
										selectedStar={images.starFilledOra}
										unselectedStar={images.starUnfilledOra}
										editable={false}
										stagger={80}
										maxScale={1.4}
										starStyle={{
											width: 8,
											height: 8,
										}}
									/>
								</View>
								<View style={styles.rates}>
									<Text style={styles.ratesText}>Service</Text>

									<Rating
										max={5}
										initial={parseInt(item.service_rating)}
										onChange={rating => console.log(rating)}
										selectedStar={images.starFilledOra}
										unselectedStar={images.starUnfilledOra}
										editable={false}
										stagger={80}
										maxScale={1.4}
										starStyle={{
											width: 8,
											height: 8,
										}}
									/>
								</View>
								<View style={styles.rates}>
									<Text style={styles.ratesText}>Ambiance</Text>

									<Rating
										max={5}
										initial={parseInt(item.ambiance_rating)}
										onChange={rating => console.log(rating)}
										selectedStar={images.starFilledOra}
										unselectedStar={images.starUnfilledOra}
										editable={false}
										stagger={80}
										maxScale={1.4}
										starStyle={{
											width: 8,
											height: 8,
										}}
									/>
								</View>
								<View style={styles.rates}>
									<Text style={styles.ratesText}>Cleanliness</Text>

									<Rating
										max={5}
										initial={parseInt(item.cleanliness_rating)}
										onChange={rating => console.log(rating)}
										selectedStar={images.starFilledOra}
										unselectedStar={images.starUnfilledOra}
										editable={false}
										stagger={80}
										maxScale={1.4}
										starStyle={{
											width: 8,
											height: 8,
										}}
									/>
								</View>
							</View>
						</View>
						<View style={styles.listStars}>
							<View style={{flexDirection: "row"}}>
								<Rating
									max={5}
									initial={parseInt(item.rating)}
									onChange={rating => console.log(rating)}
									selectedStar={images.starFilled}
									unselectedStar={images.starUnfilled}
									editable={false}
									stagger={80}
									maxScale={1.4}
									starStyle={{
										width: 11,
										height: 11,
									}}
								/>
								<Text style={[styles.reviewCount,this.state.isMoreDetail && this.state.selectIndex===index?{display: "flex"}:{display: "none"}]}>({item.reviews})</Text>
							</View>
						</View>
					</View>


					<View style={styles.medalView}>
						{index===0 && <Image source={require('./images/medal/1.png')} style={{width: 40, height: 40}}></Image> }
						{index===1 && <Image source={require('./images/medal/2.png')} style={{width: 40, height: 40}}></Image> }
						{index===2 && <Image source={require('./images/medal/3.png')} style={{width: 40, height: 40}}></Image> }
					</View>

					<View style={styles.listIcons}>
						<TouchableHighlight 
						underlayColor={"rgba(0,0,0,0)"}
						onPress={()=>this.toTryList(item.restaurant_id,'1')}>
							<Image source={item.isFav == 0 ? require('./images/listing/heart.png') : require('./images/listing/filledheart_red.png')}
								style={{width: 20, height: 20}}
							></Image>
						</TouchableHighlight>



						<View style={{justifyContent: "flex-end", flex: 1}}>
							<TouchableHighlight
								underlayColor={"rgba(0,0,0,0)"}
								onPress={()=>this.ShareItemDetail(item) }
							>
							<Image source={require('./images/listing/share.png')}
							style={{width: 20, height: 20,}}
							></Image>
							</TouchableHighlight>
						</View>
					</View>

				</View>
			</TouchableWithoutFeedback>
		)
	}
	
	ShareItemDetail = (item) => {
		var messageText = "Restaurant :"+item.restaurant_name+" Address: "+ item.address_line_1 +" "+imagebaseRestaurantLogoURL+item.restaurant_logo;
		
		Share.share({
			message: messageText,
			url: imagebaseItemsURL+item.item_icon,
			title: item.restaurant_name,
		}, {
			// Android only:
			dialogTitle: 'Share On',
			// iOS only:
			excludedActivityTypes: [
			'com.apple.UIKit.activity.PostToTwitter'
			]
		}) 
	}
	
	toTryList = async (id,isRest) => {
		that = this;
		this.setState({isLoading: true})
		
		const token = await AsyncStorage.getItem('token');
		const current_userId = await AsyncStorage.getItem('userId');
		
		fetch(baseURL+"addFavorite", {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': token,
			},
			body: JSON.stringify({
				user_id: current_userId,
				fav_id: id,
				is_restaurant: isRest
			})
		})
		.then((response) => response.json())
		.then(async (responseData) => {
			
			if(responseData.status == "success"){
				that.searchRestaurantData();
			}else{
				this.setState({isLoading: false})
				alert("Please login to perform the action")
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
	
	_renderItemView2({item, index}){
        return (
				<TouchableWithoutFeedback
					onPressIn={() => this.getDataonPress(index)}
					onPress={() => this.openDetailPage(item.restaurant_id)}
					activeOpacity={0.6}>
					<View style={[styles.listView,{borderBottomWidth: 0,}]}>
						<View style={styles.listImage}>
							<Image source={{uri: imagebaseRestaurantLogoURL+item.restaurant_logo}} style={{width:90, height:90}}>
							</Image>
							<Text style={styles.price}>$$$</Text>
						</View>
						<View style={styles.listDetail}>
							<Text style={styles.proTitle}>{item.restaurant_name}</Text>
							<Text style={styles.proDesc}>{item.address_line_1}</Text>
							<Text style={styles.proDistance}>{item.distance} Mi</Text>
							<View key={6} style={styles.listStars}>
								<View style={styles.ratingDetails}>
									<View style={styles.rates}>
										<Text style={styles.ratesText}>Dishes</Text>

										<Rating
											max={5}
											initial={parseInt(item.menu_food_rating)}
											onChange={rating => console.log(rating)}
											selectedStar={images.starFilledOra}
											unselectedStar={images.starUnfilledOra}
											editable={false}
											stagger={80}
											maxScale={1.4}
											starStyle={{
												width: 8,
												height: 8,
											}}
										/>
									</View>
									<View style={styles.rates}>
										<Text style={styles.ratesText}>Service</Text>

										<Rating
											max={5}
											initial={parseInt(item.service_rating)}
											onChange={rating => console.log(rating)}
											selectedStar={images.starFilledOra}
											unselectedStar={images.starUnfilledOra}
											editable={false}
											stagger={80}
											maxScale={1.4}
											starStyle={{
												width: 8,
												height: 8,
											}}
										/>
									</View>
									<View style={styles.rates}>
										<Text style={styles.ratesText}>Ambiance</Text>

										<Rating
											max={5}
											initial={parseInt(item.ambiance_rating)}
											onChange={rating => console.log(rating)}
											selectedStar={images.starFilledOra}
											unselectedStar={images.starUnfilledOra}
											editable={false}
											stagger={80}
											maxScale={1.4}
											starStyle={{
												width: 8,
												height: 8,
											}}
										/>
									</View>
									<View style={styles.rates}>
										<Text style={styles.ratesText}>Cleanliness</Text>

										<Rating
											max={5}
											initial={parseInt(item.cleanliness_rating)}
											onChange={rating => console.log(rating)}
											selectedStar={images.starFilledOra}
											unselectedStar={images.starUnfilledOra}
											editable={false}
											stagger={80}
											maxScale={1.4}
											starStyle={{
												width: 8,
												height: 8,
											}}
										/>
									</View>
								</View>
							</View>
							<View style={styles.listStars}>
								<View style={{flexDirection: "row"}}>
									<Rating
										max={5}
										initial={parseInt(item.rating)}
										onChange={rating => console.log(rating)}
										selectedStar={images.starFilled}
										unselectedStar={images.starUnfilled}
										editable={false}
										stagger={80}
										maxScale={1.4}
										starStyle={{
											width: 11,
											height: 11,
										}}
									/>
									<Text style={styles.reviewCount}>({item.reviews})</Text>
								</View>
							</View>
						</View>

						<View style={styles.listIcons}>
							<Image source={require('./images/listing/heart.png')}
								style={{width: 20, height: 20}}
							></Image>

							<View style={{justifyContent: "flex-end", flex: 1}}>
							<TouchableHighlight
								underlayColor={"rgba(0,0,0,0)"}
								onPress={()=>this.ShareItemDetail(item)}
							>
								<Image source={require('./images/listing/share.png')}
								style={{width: 20, height: 20,}}
								></Image>
							</TouchableHighlight>
							</View>
						</View>

					</View>
				</TouchableWithoutFeedback>
		)
	}
	

	
	render() {

		const menu = <Menu onItemSelected={this.onMenuItemSelected} navigator={navigator}/>;

		return (
		<SideMenu
			menu={menu}
			isOpen={this.state.isOpen}
			onChange={isOpen => this.updateMenuState(isOpen)}>

			<View style={styles.container}>
			{
				this.state.isLoading == true && 
				<View style={styles.activityIndicatorView}>
					<ActivityIndicator size={"large"} style={{padding: 60}}/>
				</View>
			}
			
			{ 
				this.state.container_one &&
				<View style={styles.container_one}>
					<View style={styles.mainHeader}>
						<TouchableHighlight
						underlayColor={"rgba(0,0,0,0)"}
						style={styles.headerMenuTouch}
						onPress={this.toggle}>
							<Image source={require('./images/header/sidemenu.png')} style={styles.headerMenu}></Image>
						</TouchableHighlight>
						<View style={styles.logo}>
							<Image source={require("./images/icon.png")} style={styles.logoimage}></Image>
						</View>
					</View>
					<View style={styles.searchView}>
						<TextInput
							style={styles.searchbox1}
							underlineColorAndroid={"rgba(0,0,0,0)"}
							placeholder = 'Vietnamese, Indian, Hibachi, French...'
							placeholderTextColor='#878384'
							value={this.state.searchInput}
							onChangeText={searchInput => this.setState({searchInput})}
						/>
						<TouchableOpacity onPress={()=>this.searchItems()}>
						<Image source={require('./images/header/search.png')} style={styles.searchButton}></Image>
						</TouchableOpacity>
					</View>
					<View style={styles.locationView}>
						<Image source={require('./images/header/locationcircle.png')} 
							style={{
								marginLeft: 10,
								marginTop: 15,
								height: 20,
								width: 20,
							}}>
						</Image>
						
						<TextInput
							style={styles.searchbox2}
							underlineColorAndroid={"rgba(0,0,0,0)"}
							placeholder = 'Enter Location'
							placeholderTextColor='#878384'
							value={this.state.searchAddress}
							onChangeText={searchAddress => this.setState({searchAddress})}
						/>
						{/*
						this.state.searchAddress != null &&
						<GooglePlacesAutocomplete
							getDefaultValue={() => this.state.searchAddress}
							placeholder='Enter Location'
							minLength={2}
							autoFocus={false}
							returnKeyType={'default'}
							fetchDetails={true}
							enablePoweredByContainer={false}
							onPress={(data)=>this.getLatlong(data.description)}
							query={{
								// available options: https://developers.google.com/places/web-service/autocomplete
								//mine old : key: 'AIzaSyDTilylMwv_j8t5LJCdAxooMk2jJj_Wsaw',
								key: 'AIzaSyBZoOxzzUEgRDaja12SmlkLptDM_NdrSCQ', //By Manu Prajapati
								language: 'en', // language of the results
								types: '(cities)' // default: 'geocode'
							}}
							styles={{
								textInputContainer: {
									backgroundColor: 'rgba(0,0,0,0)',
									borderTopWidth: 0,
									borderBottomWidth: 1,
									borderBottomColor: '#c9c9c9',
									padding: 0,
									marginLeft: 10,
									marginRight: 33,
								},
								textInput: {
									color: "#878384",
									fontFamily: 'SourceSansPro-Regular',
									fontSize: 15,
									flexDirection: "row",
									flex: 2,
									paddingLeft: -25,
								},
								predefinedPlacesDescription: {
									color: '#878384'
								},
							}}
						/> */
						}
						<TouchableHighlight
							underlayColor={"rgba(0,0,0,0)"}
							onPress={this.openMap}>
							<Image source={this.state.maplist} style={styles.searchButton}></Image>
						</TouchableHighlight>
					</View>
					<View style={styles.radiusViewOne}>
						<TouchableHighlight
							underlayColor={"rgba(0,0,0,0)"}
							onPress={()=>this.sorting(0)}>
							<Image source={this.state.sort_img} style={styles.sortingIcon}></Image>
						</TouchableHighlight>
						<View key={5} style={styles.radiusprogressview}>
							<Slider style={styles.sliderView}
								step={1}
								thumbStyle={{height: 10, width: 10,}}
								trackStyle={{height: 2,}}
								minimumTrackTintColor={"#e3323b"}
								maximumTrackTintColor={"#000000"}
								thumbTintColor={"#e3323b"}
								minimumValue={this.state.minDistance}
								maximumValue={this.state.maxDistance}
								value={this.state.distance}
								onValueChange={val => this.setState({ distance: val })}
							/>
							<View style={styles.bottomTextContainer}>
								<Text style={styles.bottomText}>0 mi</Text>
								<Text style={[styles.bottomText,{color: "#e3323b",}]}>{this.state.distance} mi</Text>
								<Text style={styles.bottomText}>50 mi</Text>
							</View>
						</View>
						<TouchableHighlight
						underlayColor={"rgba(0,0,0,0)"}
						onPress={this.openFilter}>
							<Image source={require('./images/header/filter.png')} style={styles.filterIcon}></Image>
						</TouchableHighlight>
					</View>
					<View style={styles.finalSearchView}>
						<TouchableHighlight	
							underlayColor={"rgba(0,0,0,0)"}
							style = {styles.finalSearchbutton}
							onPress={()=>this.searchItems()}>
								<Text style={styles.finalSearchButtonText}>Search</Text>
						</TouchableHighlight>
					</View>
				</View>
			}
			
			{ 
				this.state.container_one == false &&
				<View style={styles.container_two}>
					<View style={styles.header}>
						<TouchableHighlight
						underlayColor={"rgba(0,0,0,0)"}
						onPress={this.toggle}>
							<Image source={require('./images/header/sidemenu.png')} style={styles.headerMenu}></Image>
						</TouchableHighlight>

						<View style={styles.searchfunction}>
							<View style={styles.search}>
								<TextInput
									style={styles.searchbox}
									underlineColorAndroid={"rgba(0,0,0,0)"}
									placeholder = 'Vietnamese, Indian, Hibachi, French...'
									placeholderTextColor='#878384'
								/>
								<TouchableHighlight
								underlayColor={"rgba(0,0,0,0)"}
								onPress={() => this.searchRestaurantData()}>
									<Image source={require('./images/header/search.png')} style={styles.searchButton}></Image>
								</TouchableHighlight>
							</View>
							<View style={styles.location}>
								<Image source={require('./images/header/locationcircle.png')} style={styles.locationcircle}></Image>

								<TextInput
									style={styles.searchbox2}
									underlineColorAndroid={"rgba(0,0,0,0)"}
									placeholder = 'Enter Location'
									placeholderTextColor='#878384'
									value={this.state.searchAddress}
									onChangeText={searchAddress => this.setState({searchAddress})}
								/>
								{/*
								<GooglePlacesAutocomplete
									getDefaultValue={() => this.state.searchAddress}
									listViewDisplayed={false}
									placeholder='Enter Location'
									minLength={2}
									autoFocus={false}
									returnKeyType={'default'}
									fetchDetails={true}
									enablePoweredByContainer={false}
									onPress={(data)=>this.searchByLatlong(data.description)}
									query={{
											//available options: https://developers.google.com/places/web-service/autocomplete
											//mine old : key: 'AIzaSyDTilylMwv_j8t5LJCdAxooMk2jJj_Wsaw',
											key: 'AIzaSyBZoOxzzUEgRDaja12SmlkLptDM_NdrSCQ', //By Manu Prajapati
											language: 'en', // language of the results
											types: '(cities)' // default: 'geocode'
										  }}
										styles={{
										textInputContainer: {
											backgroundColor: 'rgba(0,0,0,0)',
											borderTopWidth: 0,
											borderBottomWidth: 1,
											borderBottomColor: '#c9c9c9',
											padding: 0,
											marginLeft: 20,
											marginRight: 10,
										},
										textInput: {
											color: "#878384",
											fontFamily: 'SourceSansPro-Regular',
											fontSize: 15,
											flexDirection: "row",
											flex: 2,
											paddingLeft: -20,
										},
										predefinedPlacesDescription: {
											color: '#878384'
										},
									}}
								/>
								*/}
								
								<TouchableHighlight
									underlayColor={"rgba(0,0,0,0)"}
									onPress={()=>this.openMap()}>
									<Image source={this.state.maplist} style={styles.searchButton}>
									</Image>
								</TouchableHighlight>
							</View>
						</View>
						
					</View>

					<View style={styles.radiusView}>
						<TouchableHighlight
						underlayColor={"rgba(0,0,0,0)"}
						onPress={()=>this.sorting(1)}>
							<Image source={this.state.sort_img} style={styles.sortingIcon}></Image>
						</TouchableHighlight>
						<View key={5} style={styles.radiusprogressview}>
							<Slider style={styles.sliderView}
								step={1}
								thumbStyle={{height: 10, width: 10,}}
								trackStyle={{height: 2,}}
								minimumTrackTintColor={"#e3323b"}
								maximumTrackTintColor={"#000000"}
								thumbTintColor={"#e3323b"}
								minimumValue={this.state.minDistance}
								maximumValue={this.state.maxDistance}
								value={this.state.distance}
								onValueChange={val => this.setState({ distance: val })}
							/>
							<View style={styles.bottomTextContainer}>
								<Text style={styles.bottomText}>0 mi</Text>
								<Text style={[styles.bottomText,{color: "#e3323b",}]}>{this.state.distance + ' mi'}</Text>
								<Text style={styles.bottomText}>50 mi</Text>
							</View>
						</View>
						<TouchableHighlight
						underlayColor={"rgba(0,0,0,0)"}
						onPress={this.openFilter}>
							<Image source={require('./images/header/filter.png')} style={styles.filterIcon}></Image>
						</TouchableHighlight>
					</View>

					{/* <View style={styles.filterButtons}>
						<TouchableHighlight
							underlayColor={"rgba(0,0,0,0)"}
							onPress={this.filter}
							style = {styles.btnFilter}>
								<Text style = {styles.buttonText}>SEARCH</Text>
						</TouchableHighlight>
					</View> */}

					<View style={styles.listContent}>
						{ this.state.mapstate === false && 
							<ScrollView style={{ height: Dimensions.get('window').height-220 }}>
								<FlatList
									data={this.state.responseData}
									extraData={this.state}
									renderItem={this._renderItemView}
									keyExtractor={(item, index) => index}
								/>
								{
									this.state.nodata &&
									<View style={{height: Dimensions.get('window').height-220, flexDirection: "column",justifyContent: "center", alignItems: "center"}}>
										<Text style={{fontFamily: "SourceSansPro-Bold", fontSize: 16,}}>
											Oops, sorry!
										</Text>
										<Text style={{fontFamily: "SourceSansPro-Regular", fontSize: 14,}}>
											Restaurants not availble in this area.
										</Text>
									</View>
								}
							</ScrollView>
						}
						{ this.state.mapstate === true &&
						<View>
							<View style={{position: "relative", height: this.state.mapViewHeight}}>
								<MapView
									style={ styles.map }
									initialRegion={{
									  latitude: this.state.latitude,
									  longitude: this.state.longitude,
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
									  onCalloutPress={() => this.checkItem(marker.index)}
									>
									<View style={styles.markercircle}>
										<Text style={styles.pinText}>{marker.key}</Text>
									</View>
									<MapView.Callout>
										<Text>{marker.item}</Text>
									</MapView.Callout>
									</MapView.Marker>
									))
								 }
								</MapView>
							</View>
								<View>
									<FlatList
										data={this.state.mapItemList}
										extraData={this.state}
										renderItem={this._renderItemView2}
										keyExtractor={(item, index) => index}
									/>
								</View>
							</View>
						}
					</View>
				</View>
			}
			</View>
		</SideMenu>
		);
	}

	openSidebar = () => {
		Keyboard.dismiss();
		this.props.navigation.navigate('DrawerOpen');
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
	
	map: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
	markercircle: {
		position: "relative",
	},
	pinText: {
		color: '#e3323b',
		fontWeight: 'bold',
		textAlign: 'center',
		fontSize: 16,
		position: "absolute",
		top: 1,
		left: 12,
	},
	header:{
		paddingLeft: 10,
		paddingTop: 10,
		paddingBottom: 10,
		flexDirection: "row",
	},
	mainHeader: {
		flexDirection: "row",
	},
	
	headerMenuTouch: {
		justifyContent: "flex-start",
		marginLeft: 10,
		marginTop: 10,
	},
	headerMenu:{
		height: 22,
		width: 22,
		marginRight: 10,
		marginTop: 7,
	},
	logo: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 20,
		marginBottom: 50,
		marginLeft: -10,
	},
	logoimage: {
		width: 200,
		height: 35,
	},
	searchView: {
		flexDirection: "row",
		marginLeft: 10,
	},
	searchbox1:{
		color: "#737373",
		fontFamily: 'SourceSansPro-Regular',
		fontSize: 15,
		flexDirection: "row",
		flex: 2,
		marginLeft: 25,
		paddingLeft: 5,
		marginRight: 28,
		borderBottomColor: "#c9c9c9",
		borderBottomWidth: 1,
	},
	
	searchbox2:{
		color: "#737373",
		fontFamily: 'SourceSansPro-Regular',
		fontSize: 15,
		flexDirection: "row",
		flex: 2,
		marginLeft: 5,
		paddingLeft: 5,
		marginRight: 28,
		borderBottomColor: "#c9c9c9",
		borderBottomWidth: 1,
	},
	locationView: {
		flexDirection: "row",
	},
	finalSearchbutton: {
		height:40,
		width: 200,
		borderRadius: 10,
		borderColor:'#9c9c9c',
		borderWidth: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	finalSearchButtonText: {
		fontSize: 15,
		color: '#e3323b',
		fontFamily: 'SourceSansPro-Regular',
	},
	headerFilterTouch: {
		height: 35,
		width: 35,
		marginRight: 10,
		marginTop: 8,
	},
	headerFilter: {
		height: 35,
		width: 35,
	},
	headerText:{
		color: "#9c9c9c",
		fontSize: 20,
		fontWeight: "bold",
		flex: 2,
		marginTop: 4,
		fontFamily: 'SourceSansPro-Regular',
	},

	searchfunction:{
		flex: 1,
	},
	search:{
		flexDirection: "row",
	},
	location:{
		flexDirection: "row",
		marginLeft: -35	,
		marginRight: 0,
	},
	searchButton:{
		height: 20,
		width: 20,
		marginRight: 10,
		marginTop: 10,
	},
	locationcircle:{
		height: 20,
		width: 20,
		marginTop: 15,
	},
	searchbox:{
		color: "#737373",
		fontFamily: 'SourceSansPro-Regular',
		fontSize: 15,
		flexDirection: "row",
		flex: 2,
		paddingLeft: 5,
		borderBottomColor: "#c9c9c9",
		borderBottomWidth: 1,
		paddingTop: 3,
	},
	searchbox2:{
		color: "#737373",
		fontFamily: 'SourceSansPro-Regular',
		fontSize: 15,
		flexDirection: "row",
		flex: 2,
		paddingLeft: 5,
		borderBottomColor: "#c9c9c9",
		borderBottomWidth: 1,
		marginLeft: 10,
		marginRight: 10,
	},
	radiusView:{
		flexDirection: "row",
		paddingLeft: 10,
		marginTop: 15,
		paddingBottom: 5,
		borderBottomColor: "#9c9c9c",
		borderBottomWidth: 1,
	},
	radiusViewOne: {
		flexDirection: "row",
		paddingLeft: 10,
		marginTop: 30,
		marginBottom: 40,
	},
	finalSearchView: {
		flexDirection: "row",
		justifyContent: "center",
	},
	finalSearchbutton: {
		height:40,
		width: 200,
		borderRadius: 10,
		borderColor:'#9c9c9c',
		borderWidth: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	finalSearchButtonText: {
		fontSize: 15,
		color: '#e3323b',
		fontFamily: 'SourceSansPro-Regular',
	},
	filterIcon: {
		height: 30,
		width: 30,
		marginRight: 10,
	},
	sortingIcon: {
		height: 30,
		width: 30,
	},

	radiusprogressview:{
		flex: 2,
		backgroundColor: "#ffffff",
	},

	radiusprogressviewPrice:{
		marginTop: 10,
		paddingBottom: 20,
		paddingLeft: 40,
		paddingRight: 40,
		borderBottomWidth: 1,
		borderBottomColor: "#c1c1c1",
	},
	sliderView: {
		height: 20,
	},
	bottomTextContainer: {
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
	filterButtons: {
		padding: 20,
		flexDirection: "row",
		borderBottomColor: "#9c9c9c",
		borderBottomWidth: 1,
	},
	btnFilter: {
		height:40,
		flex: 2,
		justifyContent: "center",
		backgroundColor:'#9c9c9c',
		borderRadius: 5,
	},
	buttonText: {
		color: '#FFFFFF',
		justifyContent:'center',
		fontSize: 15,
		textAlign: 'center',
		fontFamily: 'SourceSansPro-Regular',
	},

	listView: {
		flexDirection: "row",
		paddingTop: 15,
		paddingBottom: 15,
		paddingRight: 5,
		borderBottomWidth: 1,
		borderBottomColor: "#9c9c9c",
	},
	listImage: {
		paddingRight: 10,
		justifyContent: "flex-start",
		height: 110,
		width: 90,
		marginRight: 10,
	},
	price: {
		position: "absolute",
		width: 60,
		height: 24,
		padding: 2,
		backgroundColor: "#ffffff",
		color: "#e3323b",
		bottom: 0,
		left: 0,
		textAlign: "center",
		fontSize: 15,
		fontFamily: 'SourceSansPro-Regular',
	},
	listDetail: {
		flex: 6,
	},
	listStars: {
		flex: 1,
		justifyContent: "flex-end",
		display: "flex",
	},
	reviewCount: {
		fontSize: 12,
		position: "absolute",
		top: -3,
		left: 60,
	},
	hidestar: {
		display: "none",
	},
	ratingDetails: {
		flexDirection: "row",
		marginBottom: 4,
	},
	listIcons: {
		flex: 1,
		justifyContent: "flex-end",
		alignItems: "flex-end",
		marginLeft: -20,
	},
	medalView: {
		position: "absolute",
		right: 25,
		top: 15,
	},
	rates: {
		flex: 1,
	},
	ratesText: {
		fontSize: 10,
		fontFamily: 'SourceSansPro-Regular',
		marginBottom: 5,
	},
	listArrow: {
		flex: 1,
		justifyContent: "center",
	},
	swipeOutBg: {
		backgroundColor: "#ffffff" ,
	},
	proTitle:{
		fontSize: 14,
		fontFamily: 'SourceSansPro-Bold',
		fontWeight: "bold",
	},
	proDesc:{
		fontSize: 13,
		fontFamily: 'SourceSansPro-Regular',
	},
	proDistance:{
		fontSize: 13,
		fontFamily: 'SourceSansPro-Regular',
	},
});
