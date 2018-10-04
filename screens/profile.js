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
  FlatList,
  TouchableWithoutFeedback,
  Linking,
  ActivityIndicator,
  Share,
	NetInfo,
} from 'react-native';


import { StackNavigator } from 'react-navigation';
import FitImage from 'react-native-fit-image';
import Slider from "react-native-slider";
import Rating from 'react-native-rating';
import Tabs from 'react-native-tabs';

const images = {
  starFilled: require('./images/listing/filledstar.png'),
  starUnfilled: require('./images/listing/blankstar.png'),
  starFilledOra: require('./images/listing/filledstar_ora.png'),
  starUnfilledOra: require('./images/listing/blankstar_ora.png')
}

import './global.js';

export default class profileScreen extends React.Component {

    static navigationOptions = {
        title: 'Profile',
        header: null
    };

	constructor(props){
		super(props);
		this.state = {
			userData: "",
			displayFollowButton: "none",

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

	async componentDidMount() {
		BackHandler.addEventListener("hardwareBackPress", () => { return true });

		this.getUserDetail()

		const current_userId = await AsyncStorage.getItem('userId');
		const {state} = this.props.navigation;
		var userId = state.params.userId;

		if(current_userId != userId)
			this.setState({ displayFollowButton: "flex"});
	}

	getUserDetail = async () => {
		that = this;
		this.setState({isLoading: true})
		const token = await AsyncStorage.getItem('token');

		const {state} = this.props.navigation;
		var userId = state.params.userId;

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
				this.setState({ userData: responseData });
				that.getReviewData("1");
			}
			else if(responseData.status == "logout")
			{
				alert(responseData.error)
			}
			else{
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

	getReviewData = async (type) => {
		that = this;

		this.setState({isLoading: true})
		const {state} = this.props.navigation;

		const token = await AsyncStorage.getItem('token');
		const userId = state.params.userId;
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
						nodishesdata: "No dishes review available.",
					})
					that.getReviewData("0");
				}else{
					this.setState({
						isLoading: false,
						nodata: true,
						norestdata: "No restaurants reviews available.",
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
						<View key={9} style={[this.state.rest_isMoreDetail && this.state.rest_selectIndex===index?styles.detailPhotosView:styles.hideImageList]}>
							<ScrollView horizontal={true}>
								{this.getImages('rest',item.images)}
							</ScrollView>
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
								onPress={()=>this.ShareItemDetail(item,"rest")}
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
						<View key={7} style={[this.state.isMoreDetail && this.state.selectIndex===index?styles.detailPhotosView:styles.hideImageList]}>
							<ScrollView horizontal={true}>
								{this.getImages('item',item.images)}
							</ScrollView>
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

	getImages(type,imgs){
		var imgArray = [];
		for(let i = 0; i < imgs.length; i++){
			if(type == 'item')
				imgArray.push(<Image key={"listimg"+i} source={{uri:imagebaseItemsURL+imgs[i].image_name}} style={styles.detailPhotos}></Image>)
			else
				imgArray.push(<Image key={"restimage"+i} source={{uri:imagebaseRestaurantURL+imgs[i].image_name}} style={styles.detailPhotos}></Image>)
		}
		return imgArray;
	}
	follow = async (type) => {
		that = this;
		const token = await AsyncStorage.getItem('token');
		const current_userId = await AsyncStorage.getItem('userId');

		const {state} = this.props.navigation;
		var followId = state.params.userId;

		fetch(baseURL+"followme", {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': token
			},
			body: JSON.stringify({
				user_id: current_userId,
				follow_id: followId,
				type: type,
			})
		})
		.then((response) => response.json())
		.then(async(responseData) => {
			this.setState({isLoading: false})
			if(responseData.status == "success")
			{
				this.setState({ displayFollowButton: "none" });
				alert(type+" succesfull");
			}
			else if(status == "logout")
			{
				alert(responseData.error);
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
   render() {

	var userData = this.state.userData;
	var userName = "";
	var aboutMe = "";
	var website = "";
	var profilePic = "";
	var total_followers = 0;
	var total_following = 0;
	var total_reviews = 0;
	var is_following = 0;

	if(userData.status == "success")
	{
		username = userData.data.username;
		aboutMe = userData.data.about_me;
		website = userData.data.website;
		profilePic = userData.data.user_profile_pic;
		total_followers = userData.data.followers;
		total_following = userData.data.followings;
		total_reviews = userData.data.reviews;
		is_following = userData.data.is_following;
	}

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
				<Text style={styles.headerText}>{username}</Text>

				{
					is_following == 0 ?
					<TouchableHighlight
					underlayColor={"rgba(0,0,0,0)"}
					style={{display: this.state.displayFollowButton}}
					onPress={() => this.follow("follow")}>
						<Text style={styles.followMe}>Follow</Text>
					</TouchableHighlight>
				:
					<TouchableHighlight
					underlayColor={"rgba(0,0,0,0)"}
					style={{display: this.state.displayFollowButton}}
					onPress={() => this.follow("unfollow")}>
						<Text style={styles.unfollowMe}>Unfollow</Text>
					</TouchableHighlight>
				}

			</View>
			<View style={styles.profileContainer}>
				<View style={styles.profiledetail}>
					<Text style={styles.detTextDif}>Shogun</Text>
					<Text style={styles.detText}>#{total_reviews} Reviews</Text>
					<View>
						<ScrollView style={{maxHeight: 80}}>
							<Text style={styles.reviewText}>{aboutMe}</Text>
						</ScrollView>
					</View>
					<Text style={styles.detTextDifWeb} onPress={() => Linking.openURL(website)}>{website}</Text>
				</View>
				<View style={styles.profileimage}>
					<Image source={{ uri: imagebaseProfileURL+profilePic }} style={styles.profilepic}></Image>
					<View style={styles.totalFollowers}>
						<View style={styles.followCounter}>
							<Text style={styles.followVal}>{total_followers}</Text>
							<Text style={styles.followHead}>followers</Text>
						</View>
						<View style={styles.followCounter}>
							<Text style={styles.followVal}>{total_following}</Text>
							<Text style={styles.followHead}>following</Text>
						</View>
					</View>
				</View>
			</View>
			<View style={styles.itemscontainer}>
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
					<ScrollView style={{ height: Dimensions.get('window').height-300 }}>
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
  							<View style={{height: Dimensions.get('window').height-300, flexDirection: "column",justifyContent: "center", alignItems: "center"}}>
  								<Text style={{fontFamily: "SourceSansPro-Bold", fontSize: 16,}}>
  									Oops, sorry!
  								</Text>
  								<Text style={{fontFamily: "SourceSansPro-Regular", fontSize: 14,}}>{this.state.nodishesdata}</Text>
  							</View>
  							:
  							this.state.nodata && this.state.nodatamessage != null  && this.state.nodishesdata == null &&
  							<View style={{height: Dimensions.get('window').height-300, flexDirection: "column",justifyContent: "center", alignItems: "center"}}>
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
                <View style={{height: Dimensions.get('window').height-300, flexDirection: "column",justifyContent: "center", alignItems: "center"}}>
                  <Text style={{fontFamily: "SourceSansPro-Bold", fontSize: 16,}}>
                    Oops, sorry!
                  </Text>
                  <Text style={{fontFamily: "SourceSansPro-Regular", fontSize: 14,}}>{this.state.norestdata}</Text>
                </View>
                :
                this.state.nodata && this.state.nodatamessage != null && this.state.norestdata == null &&
                <View style={{height: Dimensions.get('window').height-300, flexDirection: "column",justifyContent: "center", alignItems: "center"}}>
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
			</View>
		</View>
    );
  }

 editprofile = () => {}

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
		flex:1,
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
		fontSize: 20,
		color: "#9c9c9c",
		fontWeight: "bold",
		flex: 2,
		marginTop: 4,
		fontFamily: 'SourceSansPro-Regular',
	},
	followMe: {
		fontSize: 16,
		fontWeight: "100",
		fontFamily: 'SourceSansPro-Regular',
		color: "#e3323b",
		paddingLeft: 10,
		paddingRight: 10,
		paddingTop: 7,
		paddingBottom: 5,
		borderWidth: 1,
		borderColor: "#9c9c9c",
		borderRadius: 10,
		marginRight: 10,
	},
	unfollowMe: {
		fontSize: 16,
		fontWeight: "100",
		fontFamily: 'SourceSansPro-Regular',
		color: "#9c9c9c",
		paddingLeft: 10,
		paddingRight: 10,
		paddingTop: 7,
		paddingBottom: 5,
		borderWidth: 1,
		borderColor: "#9c9c9c",
		borderRadius: 10,
		marginRight: 10,
	},
	detText: {
		fontSize: 18,
		fontFamily: 'SourceSansPro-Regular',
		marginLeft: 20,
	},
	detTextDif: {
		fontSize: 18,
		fontFamily: 'SourceSansPro-Regular',
		marginLeft: 20,
		color: "#e3323b",
	},
	detTextDifWeb: {
		fontSize: 18,
		fontFamily: 'SourceSansPro-Regular',
		color: "#00a1e6",
		position: "absolute",
		bottom: 0,
		left: 20,
	},
	reviewText: {
		fontSize: 15,
		fontFamily: 'SourceSansPro-Regular',
		marginLeft: 20,
	},
	profileContainer: {
		flexDirection: "row",
		paddingBottom: 10,
		borderBottomColor: "#c1c1c1",
		borderBottomWidth: 1,
	},
	profiledetail: {
		flex: 2,
		marginTop: 20,
	},
	profileimage: {
		marginTop: 10,
		marginRight: 10,
		marginLeft: 10,
		flex: 2,
		justifyContent: "flex-end",
		alignItems: "flex-end",
	},
	profilepic: {
		height: 150,
		width: 150,
	},
	head: {
		fontSize: 16,
		fontFamily: 'SourceSansPro-Regular',
		marginBottom: 10,
	},
	totalFollowers: {
		flexDirection: "row",
	},
	followCounter: {
		flexDirection: "column",
		flex: 1,
		alignItems: "flex-end",
	},
	followVal: {
		fontFamily: "SourceSansPro-Regular",
		fontSize: 18,
		textAlign: "center",
		width: 60,
	},
	followHead: {
		fontFamily: "SourceSansPro-Regular",
		fontSize: 14,
		textAlign: "center",
		width: 60,
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
	listImage: {
		paddingRight: 10,
		justifyContent: "center",
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
		width: 60,
		height: 24,
		padding: 2,
		backgroundColor: "#e3323b",
		color: "#ffffff",
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
		fontFamily: 'SourceSansPro-Bold',
		fontSize: 16,
		marginLeft: 20,
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
	reviewCount: {
		fontSize: 12,
		position: "absolute",
		top: -3,
		left: 60,
	},
	hidestar: {
		display: "none",
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
		fontFamily: 'SourceSansPro-Bold',
		fontWeight: "bold",
	},
	proTitle2:{
		fontSize: 14,
		fontFamily: 'SourceSansPro-Regular',
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
	detailPhotosView: {
		flexDirection: "row",
		marginTop: 10,
		display: "flex",
	},
	hideImageList: {
		display: "none",
	},
	detailPhotos: {
		flex: 1,
		width: 50,
		height: 50,
		marginRight: 10,
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
