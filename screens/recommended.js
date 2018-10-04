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

import Menu from './SideMenu';
import SideMenu from 'react-native-side-menu';
import Rating from 'react-native-rating';
import { Easing } from 'react-native';
import CheckBox from 'react-native-check-box';

import Tabs from 'react-native-tabs';

const images = {
  starFilled: require('./images/listing/filledstar.png'),
  starUnfilled: require('./images/listing/blankstar.png'),
  starFilledOra: require('./images/listing/filledstar_ora.png'),
  starUnfilledOra: require('./images/listing/blankstar_ora.png')
}

import Swipeout from 'react-native-swipeout';

import './global.js';

export default class recommendedScreen extends React.Component {

    static navigationOptions = {
        title: 'Recommended',
        header: null
    };

	constructor(props){
		super(props);
		
		this.toggle = this.toggle.bind(this);
		
		this.state = {
			page: 'items',
			isLoading: false,
			isRefreshing: false,
            isMoreDetail: false,
            selectIndex: [],
			currentDisp: null,
			
			rest_isMoreDetail: false,
            rest_selectIndex: [],
			rest_currentDisp: null,
			
			responseItemData: "",
			responseRestData: "",
			responseItemRecomData: "",
			responseRestRecomData: "",

			nodata: false,
			nodatamessage: null,
			nodishesdata: null,
			norestdata: null,
		}

		this._renderItemView = this._renderItemView.bind(this);
		this._renderRestView = this._renderRestView.bind(this);
	}

	toggle() {
		this.setState({
		  isOpen: !this.state.isOpen,
		});
	}

	updateMenuState(isOpen) {
		this.setState({ isOpen });
	}

	onMenuItemSelected = async (item) => {
		const { navigate } = this.props.navigation;
		
		if(item == "Login")
			await AsyncStorage.removeItem('loggedin');
		
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
		
		this.getReviewData("1");
	}
	getReviewData = async (type) => {
		that = this;
		
		this.setState({isLoading: true})
		
		const token = await AsyncStorage.getItem('token');
		const userId = await AsyncStorage.getItem('userId');
		const searchLat = await AsyncStorage.getItem('current_latitude');
		const searchLong = await AsyncStorage.getItem('current_longitude');
		
		fetch(baseURL+"getMyReviewRating", {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': token
			},
			body: JSON.stringify({
				user_id: userId,
				review_rating_type: type,
				lattitude: searchLat,
				longitude: searchLong,
			})
		})
		.then((response) => response.json())
		.then(async(responseData) => {
			
			if(responseData.status == "success")
			{
				this.setState({	nodata: false });
				if(type == "1")
				{
					this.setState({ responseRestData: responseData.data.review_rating});	
					this.setState({ responseRestRecomData: responseData.data.recommanded_review_rating});	
					that.getReviewData("0");
				}
				else
				{	
					this.setState({isLoading: false})
					this.setState({ responseItemData: responseData.data.review_rating});	
					this.setState({ responseItemRecomData: responseData.data.recommanded_review_rating});
				}	
			}
			else if(responseData.status == "logout")
			{
				this.setState({
					isLoading: false,
					nodata: true,
					nodatamessage: "Please login to perform the action",
				})
			}
			else
			{
				if(type == "1")
				{
					this.setState({
						nodata: true,
						nodishesdata: "No dishes recommendation available.",
					})
					that.getReviewData("0");
				}else{
					this.setState({
						isLoading: false,
						nodata: true,
						norestdata: "No restaurants recommendation available.",
					})
				}
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


	getDataonPress = (index) => {
		this.setState({ isMoreDetail:true, selectIndex:index})
		this.setState({ currentDisp: index })
	}
	
	rest_getDataonPress = (index) => {
		this.setState({ rest_isMoreDetail:true, rest_selectIndex:index})
		this.setState({ rest_currentDisp: index })
	}
	
	openRestDetailPage = (id) => {
		const { navigate } = this.props.navigation;
		navigate('restaurantdetailScreen',{restId: id});
	}

	openDetailPage = (id) => {
		const { navigate } = this.props.navigation;
		navigate('itemdetailScreen',{itemId: id});
	}

	ShareItemDetail = (item,type) => {
		if(type == "item"){
			var messageText = "Item :"+item.item_name+" Restaurant :"+item.restaurant_name+" Address: "+ item.address_line_1 +" "+imagebaseItemsURL+item.item_icon;
			
			Share.share({
				message: messageText,
				url: imagebaseItemsURL+item.item_icon,
				title: item.item_name,
			}, {
				// Android only:
				dialogTitle: 'Share On',
				// iOS only:
				excludedActivityTypes: [
				'com.apple.UIKit.activity.PostToTwitter'
				]
			}) 
		}else{
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
	}

	_renderRestView({item, index}){
		return (
				<TouchableWithoutFeedback
					onPressIn={() => this.rest_getDataonPress(index)}
					onPress={() => this.openRestDetailPage(item.restaurant_id)}
					activeOpacity={0.6}>
					<View style={styles.rest_listView}>
						<View style={styles.rest_listImage}>
							<Image source={{uri: imagebaseRestaurantLogoURL+item.restaurant_logo}} style={{width:90, height:90}}>
							</Image>
							<Text style={styles.rest_price}>$$$</Text>
						</View>
						<View style={styles.rest_listDetail}>
							<Text style={styles.rest_proTitle}><Text style={{color: "#f7b51b",}}>#{index+1} </Text>{item.restaurant_name}</Text>
							<Text style={styles.rest_proDesc}>{item.address_line_1}</Text>
							<Text style={styles.proDesc}>{this.renderRecommeder(item)}</Text>
							<Text style={styles.rest_proDistance}>{item.distance} Mi</Text>
							<View key={6} style={[this.state.rest_isMoreDetail && this.state.rest_selectIndex===index?styles.rest_listStars:styles.rest_hidestar]}>
								<View style={styles.rest_ratingDetails}>
									<View style={styles.rest_rates}>
										<Text style={styles.rest_ratesText}>Dishes</Text>

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
									<View style={styles.rest_rates}>
										<Text style={styles.rest_ratesText}>Service</Text>

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
									<View style={styles.rest_rates}>
										<Text style={styles.rest_ratesText}>Ambiance</Text>

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
									<View style={styles.rest_rates}>
										<Text style={styles.rest_ratesText}>Cleanliness</Text>

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
							<View style={styles.rest_listStars}>
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
									<Text style={[styles.rest_reviewCount,this.state.rest_isMoreDetail && this.state.rest_selectIndex===index?{display: "flex"}:{display: "none"}]}>({item.reviews})</Text>
								</View>
							</View>
						</View>


						<View style={styles.rest_listIcons}>
							<TouchableHighlight 
							underlayColor={"rgba(0,0,0,0)"}
							onPress={()=>this.toTryList(item.restaurant_id,'1')}>
								<Image source={item.is_favourite == 0 ? require('./images/listing/heart.png') : require('./images/listing/filledheart_red.png')}
									style={{width: 20, height: 20}}
								></Image>
							</TouchableHighlight>



							<View style={{justifyContent: "flex-end", flex: 1}}>
								<TouchableHighlight
									underlayColor={"rgba(0,0,0,0)"}
									onPress={()=>this.ShareItemDetail(item,"rest") }
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
				that.getReviewData(isRest);
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
	
	_renderItemView({item, index}){
        return (
			<TouchableWithoutFeedback
				onPressIn={() => this.getDataonPress(index)}
				onPress={() => this.openDetailPage(item.id)}
				activeOpacity={0.6}>
				<View style={styles.listView}>
					<View style={styles.listImage}>
						<Image source={{uri: imagebaseItemsURL+item.item_icon}} style={{width:100, height:100}}>
						</Image>
						<Text style={styles.price}>${item.item_price}</Text>
					</View>
					<View style={styles.listDetail}>
						<Text style={styles.proTitle}>{item.item_name}</Text>
						<Text style={styles.proTitle2}>{item.restaurant_name}</Text>
						<Text style={styles.proDesc}>{item.address_line_1}</Text>
						<Text style={styles.proDesc}>{this.renderRecommeder(item)}</Text>
						<Text style={styles.proDistance}>{item.distance} Mi</Text>
						<View key={6} style={[this.state.isMoreDetail && this.state.selectIndex===index?styles.listStars:styles.hidestar]}>
							<View style={{flexDirection: "row"}}>
								<Rating
									max={5}
									initial={parseInt(item.overall_star_rating)}
									onChange={rating => console.log(rating)}
									selectedStar={images.starFilled}
									unselectedStar={images.starUnfilled}
									editable={false}
									stagger={80}
									maxScale={1.4}
									starStyle={{
										width: 10,
										height: 10,
									}}
								/>
								<Text style={styles.reviewCount}>({item.menu_item_overall})</Text>
							</View>
						</View>
					</View>
					<View style={styles.listIcons}>
						<TouchableHighlight 
						underlayColor={"rgba(0,0,0,0)"}
						onPress={()=>this.toTryList(item.id,'0')}>
							<Image source={item.is_favourite == 0 ? require('./images/listing/heart.png') : require('./images/listing/filledheart_red.png')}
								style={{width: 20, height: 20}}
							></Image>
						</TouchableHighlight>
						
						<View style={{justifyContent: "flex-end", flex: 1}}>
							<TouchableHighlight
								underlayColor={"rgba(0,0,0,0)"}
								onPress={()=>this.ShareItemDetail(item,"item") }
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
	
	renderRecommeder(item){
		var j = 0;
		var users = [];
		if(item.recommanded_user.length != null && item.recommanded_user.length >= 2) {
			for(i=0;i<item.recommanded_user.length;i++)
			{
				if(item.recommanded_user[i].user != null)
				{
					j+=1;
					users.push(item.recommanded_user[i].user.username)
					if(j==2)
						break;
				}
			}
			return users+" +"+(item.recommanded_user.length-2)+" Recommended"
			
		} else if(item.recommanded_user.length != null && item.recommanded_user.length >= 1) {
			for(i=0;i<item.recommanded_user.length;i++)
			{
				if(item.recommanded_user[i].user != null)
				{
					j+=1;
					users.push(item.recommanded_user[i].user.username)
					if(j==2)
						break;
				}
			}
			return users+" Recommended"
		} else {
			return "0 Recommended"
		}
	}
	
	
	
	_renderHorItemView({item, index}){
        return (
			<TouchableWithoutFeedback
				onPress={() => this.openDetailPage(item.id)}
				activeOpacity={0.6}>
				<View style={styles.listViewHor}>
					<View style={styles.listImageHor}>
						<Image source={{uri: imagebaseItemsURL+item.item_icon}} style={{width:100, height:100}}>
						</Image>
						<Text style={styles.priceHor}>${item.item_price}</Text>
						<View style={{flexDirection: "row",}}>
							<Rating
								max={5}
								initial={parseInt(item.menu_item_overall)}
								onChange={rating => console.log(rating)}
								selectedStar={images.starFilled}
								unselectedStar={images.starUnfilled}
								editable={false}
								stagger={80}
								maxScale={1.4}
								starStyle={{
									width: 10,
									height: 10,
									marginTop: 5,
								}}
							/>
						</View>
						<Text style={styles.proTitle2}>{item.item_name}</Text>
					</View>
				</View>
			</TouchableWithoutFeedback>
		)
	}
	_renderHorRestView({item, index}){
        return (
			<TouchableWithoutFeedback
				onPress={() => this.openRestDetailPage(item.restaurant_id)}
				activeOpacity={0.6}>
				<View style={styles.listViewHor}>
					<View style={styles.listImageHor}>
						<Image source={{uri: imagebaseRestaurantLogoURL+item.restaurant_logo}} style={{width:100, height:100}}>
						</Image>
						<Text style={styles.priceHor}>$$$</Text>
						<View style={{flexDirection: "row",}}>
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
									width: 10,
									height: 10,
									marginTop: 5,
								}}
							/>
						</View>
						<Text style={styles.proTitle2}>{item.restaurant_name}</Text>
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
				<View style={styles.header}>
					<TouchableHighlight
					underlayColor={"rgba(0,0,0,0)"}
					onPress={this.toggle}>
						<Image source={require('./images/header/sidemenu.png')} style={styles.headerMenu}></Image>
					</TouchableHighlight>
					<Text style={styles.headerText}>RECOMMENDED</Text>
				</View>
				<View style={styles.innerTabs}>
					<Tabs selected={this.state.page}
						style={styles.tabStyles}
						selectedStyle={{color:'#e3323b'}}
						onSelect={el=>this.setState({page:el.props.name})}>
							<Text name="items" style={styles.selectedTabText} selectedIconStyle={styles.selectedTab}>Dishes</Text>
							<Text name="restaurants" style={styles.selectedTabText} selectedIconStyle={styles.selectedTab}>Restaurants</Text>
					</Tabs>
				</View>
				<View style={styles.listContent}>
					<ScrollView style={{ height: Dimensions.get('window').height-320 }}>
					{
						this.state.page == "items" &&
						<View>
						<FlatList
							data={this.state.responseItemData}
							extraData={this.state}
							renderItem={this._renderItemView}
							keyExtractor={(item, index) => index}
						/>
						
						{
							this.state.nodata && this.state.nodatamessage == null && this.state.nodishesdata != null ?
							<View style={{height: Dimensions.get('window').height-225, flexDirection: "column",justifyContent: "center", alignItems: "center"}}>
								<Text style={{fontFamily: "SourceSansPro-Bold", fontSize: 16,}}>
									Oops, sorry!
								</Text>								
								<Text style={{fontFamily: "SourceSansPro-Regular", fontSize: 14,}}>{this.state.nodishesdata}</Text>
							</View>
							:
							this.state.nodata && this.state.nodatamessage != null  && this.state.nodishesdata == null &&
							<View style={{height: Dimensions.get('window').height-225, flexDirection: "column",justifyContent: "center", alignItems: "center"}}>
								<Text style={{fontFamily: "SourceSansPro-Bold", fontSize: 16,}}>
									Oops, sorry!
								</Text>								
								<Text style={{fontFamily: "SourceSansPro-Regular", fontSize: 14,}}>{this.state.nodatamessage}</Text>
							</View>
						}
						</View>
					}
					{
						this.state.page == "restaurants" &&
						<View>
						<FlatList
							data={this.state.responseRestData}
							extraData={this.state}
							renderItem={this._renderRestView}
							keyExtractor={(item, index) => index}
						/>
						{
							this.state.nodata && this.state.nodatamessage == null && this.state.norestdata != null ?
							<View style={{height: Dimensions.get('window').height-225, flexDirection: "column",justifyContent: "center", alignItems: "center"}}>
								<Text style={{fontFamily: "SourceSansPro-Bold", fontSize: 16,}}>
									Oops, sorry!
								</Text>								
								<Text style={{fontFamily: "SourceSansPro-Regular", fontSize: 14,}}>{this.state.norestdata}</Text>
							</View>
							:
							this.state.nodata && this.state.nodatamessage != null && this.state.norestdata == null &&
							<View style={{height: Dimensions.get('window').height-225, flexDirection: "column",justifyContent: "center", alignItems: "center"}}>
								<Text style={{fontFamily: "SourceSansPro-Bold", fontSize: 16,}}>
									Oops, sorry!
								</Text>								
								<Text style={{fontFamily: "SourceSansPro-Regular", fontSize: 14,}}>{this.state.nodatamessage}</Text>
							</View>
						}
						</View>
					}
					</ScrollView>
				</View>
				<View style={styles.vertlisting}>
					<Text style={styles.textHead}>Recommendations</Text>
					<ScrollView horizontal={true}>	
						{
							this.state.page == "items" &&
							<FlatList
								data={this.state.responseItemRecomData}
								extraData={this.state}
								renderItem={this._renderHorItemView}
								keyExtractor={(item, index) => index}
								horizontal={true}
							/>
						}
						{
							this.state.page == "restaurants" &&
							<FlatList
								data={this.state.responseRestRecomData}
								extraData={this.state}
								renderItem={this._renderHorRestView}
								keyExtractor={(item, index) => index}
								horizontal={true}
							/>
						}
					</ScrollView>
				</View>
			</View>
		</SideMenu>
		);
	}

	openSidebar = () => {
		Keyboard.dismiss();
		this.props.navigation.navigate('DrawerOpen');
	}
	clickMe = () => {
		alert("Ohk");
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
		height: 22,
		width: 22,
		marginTop: 7,
		marginRight: 10,
	},
	headerEdit: {
		height: 25,
		width: 25,
		marginTop: 7,
		marginRight: 10,
	},
	headerText: {
		color: "#9c9c9c",		
		fontSize: 16,
		flex: 2,
		marginTop: 7,
		fontFamily: 'SourceSansPro-Regular',
	},
	innerTabs: {
		height: 30,
		marginLeft: 20,
		marginRight: 20,
	},
	tabStyles: {
		backgroundColor: "#ffffff",
		borderBottomWidth: 1,
		borderBottomColor: "#c1c1c1",
		height: 30,
	},
	selectedTab: {
		borderBottomWidth: 2,
		borderBottomColor:'#e3323b',
		height: 30,
	},
	selectedTabText: {
		fontFamily: 'SourceSansPro-Regular',
		textAlign: "center",
		height: 20,
	},
	listView: {
		flexDirection: "row",
		paddingTop: 10,
		paddingBottom: 10,
		borderBottomWidth: 1,
		borderBottomColor: "#9c9c9c",
	},
	listViewHor: {
		flexDirection: "row",
		padding: 10,
	},
	listImage: {
		paddingRight: 10,
		justifyContent: "center",
	},
	listImageHor: {
		justifyContent: "center",
		width: 100,
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
	priceHor: {
		position: "absolute",
		backgroundColor: "#ffffff",
		width: 60,
		height: 24,
		padding: 2,
		color: "#e3323b",
		bottom: 0,
		top: 76,
		textAlign: "center",
		fontSize: 15,
		fontFamily: 'SourceSansPro-Regular',
	},
	  vertlisting: {
		borderTopWidth: 1,
		borderTopColor: "#c1c1c1",
	  },
	textHead: {
		fontFamily: 'SourceSansPro-Regular',
		fontSize: 16,
		marginLeft: 10,
		marginTop: 10,
	},
	listDetail: {
		flex: 4,
	},
	listStars: {
		flex: 1,
		justifyContent: "flex-end",
		display: "flex",
	},
	hidestar: {
		display: "none",
	},
	reviewCount: {
		fontSize: 12,
		position: "absolute",
		top: -3,
		left: 55,
	},
	listIcons: {
		flex: 1,
		justifyContent: "flex-end",
		alignItems: "flex-end",
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
		fontFamily: 'SourceSansPro',
		fontWeight: "bold",
	},
	proTitle2:{
		fontSize: 14,
		fontFamily: 'SourceSansPro',
	},
	proTitle2: {
		fontSize: 14,
		fontFamily: 'SourceSansPro',
		fontWeight: "100",
	},
	proDesc:{
		fontSize: 13,
		fontFamily: 'SourceSansPro-Regular',
	},
	proDistance:{
		fontSize: 13,
		fontFamily: 'SourceSansPro-Regular',
	},
	totalRatings: {
		fontSize: 12,
		fontFamily: 'SourceSansPro-Regular',
		marginTop: 2,
		marginLeft: 5,
	},
	
	
	rest_listView: {
		flexDirection: "row",
		paddingTop: 15,
		paddingBottom: 15,
		paddingRight: 5,
		borderBottomWidth: 1,
		borderBottomColor: "#9c9c9c",
	},
	rest_listImage: {
		paddingRight: 10,
		justifyContent: "flex-start",
		height: 110,
		width: 90,
		marginRight: 10,
	},
	rest_price: {
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
	rest_listDetail: {
		flex: 6,
	},
	rest_listStars: {
		flex: 1,
		justifyContent: "flex-end",
		display: "flex",
	},
	rest_reviewCount: {
		fontSize: 12,
		position: "absolute",
		top: -3,
		left: 60,
	},
	rest_hidestar: {
		display: "none",
	},
	rest_ratingDetails: {
		flexDirection: "row",
		marginBottom: 4,
	},
	rest_listIcons: {
		flex: 1,
		justifyContent: "flex-end",
		alignItems: "flex-end",
		marginLeft: -20,
	},
	rest_medalView: {
		position: "absolute",
		right: 25,
		top: 15,
	},
	rest_rates: {
		flex: 1,
	},
	rest_ratesText: {
		fontSize: 10,
		fontFamily: 'SourceSansPro-Regular',
		marginBottom: 5,
	},
	rest_listArrow: {
		flex: 1,
		justifyContent: "center",
	},
	rest_swipeOutBg: {
		backgroundColor: "#ffffff" ,
	},
	rest_proTitle:{
		fontSize: 14,
		fontFamily: 'SourceSansPro-Bold',
		fontWeight: "bold",
	},
	rest_proDesc:{
		fontSize: 13,
		fontFamily: 'SourceSansPro-Regular',
	},
	rest_proDistance:{
		fontSize: 13,
		fontFamily: 'SourceSansPro-Regular',
	},
	
	
	
	
});
