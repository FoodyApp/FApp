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
  Dimensions,
  TouchableOpacity,
  FlatList,
  TouchableWithoutFeedback,
  ActivityIndicator,
  AsyncStorage,
  Share,
	NetInfo,
} from 'react-native';

import './global.js';
import Slideshow from 'react-native-slideshow';
import Rating from 'react-native-rating';
import PhotoUpload from 'react-native-photo-upload';

import Accordion from 'react-native-collapsible/Accordion';
const winHeight = Dimensions.get('window').height;
const winWidth = Dimensions.get('window').width;

const images = {
  starFilled: require('./images/listing/filledstar.png'),
  starUnfilled: require('./images/listing/blankstar.png'),
  starFilledOra: require('./images/listing/filledstar_ora.png'),
  starUnfilledOra: require('./images/listing/blankstar_ora.png')
}

export default class restDetailScreen extends React.Component {

    static navigationOptions = {
        title: 'Restaurant Detail',
        header: null,
		tabBarVisible: false
    };

	constructor(props){
		super(props);
		this.state = {
			isLoading: false,
			image_array: [],
			isFav: 0,
			over_all_stars: null,
			dishes_star: null,
			ambiance_star: null,
			services_star: null,
			cleanliness_star: null,
			daysHeight: 15,
			btnArrowDays: require('./images/detail/down.png'),
			responseData: "",
			menu_categories: null,
			review_array: [],
			isMoreDetail: false,
			selectIndex: [],
			currentDisp: null,
			textHeight: 30,
			btnArrow: "Menu",
		};
		this._renderItemView = this._renderItemView.bind(this);
	}

	componentDidMount() {
		this.getRestaurantDetail();

	}
	ShareItemDetail = () => {
		var item = this.state.responseData;

		var messageText = "Restaurant :"+item.data.restaurant_name+" Address: "+ item.data.address_line_1 +" "+imagebaseRestaurantURL+item.data.userImageData[0].image_name;

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
	getRestaurantDetail = async () => {

		this.setState({ isLoading: true });
		const {state} = this.props.navigation;
		var restId = state.params.restId;
		var userId = await AsyncStorage.getItem('userId');

		fetch(baseURL+"restaurantDetail", {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},

			body: JSON.stringify({
				restaurant_id: restId,
				userId: userId,
			})
		}).then((response) => response.json() )
		.then((responseData) => {

			this.setState({ isLoading: false });

			if(responseData.status == "success")
			{
				this.setState({ responseData: responseData });
				this.setState({ isFav: responseData.data.isFav });
				this.setState({over_all_stars :
					<View style={{flexDirection: "row"}}>
						<Rating
							max={5}
							initial={Number(responseData.data.overall_rating)}
							onChange={rating => console.log(rating)}
							selectedStar={images.starFilled}
							unselectedStar={images.starUnfilled}
							editable={false}
							maxScale={1.4}
							starStyle={{
								width: 15,
								height: 15,
							}}
						/>
						<Text style={styles.totalrating}>({responseData.data.number_of_reviews})</Text>
					</View>
				});
				this.setState({ dishes_star:
					<Rating
						max={5}
						initial={Number(responseData.data.menu_overall_rating)}
						onChange={rating => console.log(rating)}
						selectedStar={images.starFilledOra}
						unselectedStar={images.starUnfilledOra}
						editable={false}
						stagger={80}
						maxScale={1.4}
						starStyle={{
							width: 12,
							height: 12,
						}}
					/>
				});
				this.setState({ services_star:
					<Rating
						max={5}
						initial={Number(responseData.data.service_rating)}
						onChange={rating => console.log(rating)}
						selectedStar={images.starFilledOra}
						unselectedStar={images.starUnfilledOra}
						editable={false}
						stagger={80}
						maxScale={1.4}
						starStyle={{
							width: 12,
							height: 12,
						}}
					/>
				});
				this.setState({ ambiance_star:
					<Rating
						max={5}
						initial={Number(responseData.data.ambiance_rating)}
						onChange={rating => console.log(rating)}
						selectedStar={images.starFilledOra}
						unselectedStar={images.starUnfilledOra}
						editable={false}
						stagger={80}
						maxScale={1.4}
						starStyle={{
							width: 12,
							height: 12,
						}}
					/>
				});
				this.setState({ cleanliness_star:
					<Rating
						max={5}
						initial={Number(responseData.data.cleanliness_rating)}
						onChange={rating => console.log(rating)}
						selectedStar={images.starFilledOra}
						unselectedStar={images.starUnfilledOra}
						editable={false}
						stagger={80}
						maxScale={1.4}
						starStyle={{
							width: 12,
							height: 12,
						}}
					/>
				});

				for(i=0;i<responseData.data.userImageData.length;i++)
				{
					this.setState({ image_array:
						this.state.image_array.concat([
							{ url: imagebaseRestaurantURL+responseData.data.userImageData[i].image_name }
						])
					});
				}

				this.setState({menu_categories : responseData.data.menu_item});

				for(j=0;j<responseData.data.reviewUserData.length;j++)
				{
					this.setState({ review_array :
						this.state.review_array.concat([
							<View style={styles.review} key={"reviews"+j}>
								<Image source={{ uri: imagebaseProfileURL+responseData.data.reviewUserData[j].user_profile_pic }} style={styles.reviewProfile}></Image>
								<Text style={styles.reviewNameOne}>{responseData.data.reviewUserData[j].username}</Text>
								<View>
									<Rating
										max={5}
										initial={Number(responseData.data.reviewUserData[j].overall_rating)}
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
								</View>
							</View>
						])
					})
				}
			}
			else
			{
				alert(responseData.message);
			}
		}).done();
	}



	viewMore = () => {
	  if(this.state.textHeight == "auto")
	  {
		  this.setState({textHeight: 30});
		  this.setState({btnArrow: "Menu"});
	  }
	  else
	  {
		  this.setState({textHeight: "auto"});
		  this.setState({btnArrow: "Back"});
	  }
	}
	viewMoreDays = () => {
		if(this.state.daysHeight == "auto")
		{
		  this.setState({daysHeight: 15});
		  this.setState({btnArrowDays: require('./images/detail/down.png')});
		}
		else
		{
		  this.setState({daysHeight: "auto"});
		  this.setState({btnArrowDays: require('./images/detail/up.png')});
		}
	}

	getDataonPress = (index) => {
		this.setState({ isMoreDetail: true, selectIndex:index})
	}
	changeStates = () => {
		this.setState({ isMoreDetail: false, selectIndex:[]})
	}

	_renderItemView({item, index}){
		const ind = index+""+item.parent_category_id
        return (
			<TouchableWithoutFeedback
				onPressIn={() => this.getDataonPress(ind)}
				activeOpacity={0.6}>

				<View style={styles.listViewLi}>
					<View style={styles.listDetailLi}>
						<Text style={styles.proTitleLi}>{item.item_name}</Text>
							<View style={[this.state.isMoreDetail && this.state.selectIndex===ind?styles.listStarsLi:styles.hidestarLi]}>
							<View style={styles.ratingDetailsLi}>
								<View style={styles.ratesLi}>
									<Text style={styles.ratesTextLi}>Quality</Text>

									<Rating
										max={5}
										initial={Number(item.freshness_menu_item_quality_star)}
										onChange={rating => console.log(rating)}
										selectedStar={images.starFilledOra}
										unselectedStar={images.starUnfilledOra}
										editable={false}
										stagger={80}
										maxScale={1.4}
										starStyle={{
											width: 10,
											height: 10,
										}}
									/>
								</View>
								<View style={styles.ratesLi}>
									<Text style={styles.ratesTextLi}>Flavor</Text>

									<Rating
										max={5}
										initial={Number(item.menu_item_flavor_star)}
										onChange={rating => console.log(rating)}
										selectedStar={images.starFilledOra}
										unselectedStar={images.starUnfilledOra}
										editable={false}
										stagger={80}
										maxScale={1.4}
										starStyle={{
											width: 10,
											height: 10,
										}}
									/>
								</View>
								<View style={styles.ratesLi}>
									<Text style={styles.ratesTextLi}>Quantity</Text>
									{
										item.menu_item_quantity_less_enough_alot == "alot" &&
										<Image source={require("./images/listing/3.png")} style={styles.quantityImageLi}></Image>
									}
									{
										item.menu_item_quantity_less_enough_alot == "enough" &&
										<Image source={require("./images/listing/2.png")} style={styles.quantityImageLi}></Image>
									}
									{
										item.menu_item_quantity_less_enough_alot == "less" &&
										<Image source={require("./images/listing/1.png")} style={styles.quantityImageLi}></Image>
									}
								</View>
							</View>
						</View>
						<View style={styles.listStarsLi}>
							<Rating
								max={5}
								initial={Number(item.star_rating)}
								onChange={rating => console.log(rating)}
								selectedStar={images.starFilled}
								unselectedStar={images.starUnfilled}
								editable={false}
								stagger={80}
								maxScale={1.4}
								starStyle={{
									width: 15,
									height: 15,
								}}
							/>
						</View>
					</View>
					<View style={styles.listImageLi}>
						<Text style={styles.priceLi}>${item.item_price}</Text>
							<Image source={{uri: imagebaseItemsURL+item.item_icon}} style={[this.state.isMoreDetail && this.state.selectIndex===ind?{width: 100, height: 100}:{height: 0, width: 0,}]}></Image>
					</View>
				</View>

			</TouchableWithoutFeedback>
		)
	}
	UploadImage = async () => {

	  const {state} = this.props.navigation;
	  var restId = state.params.restId;
	  const userId = await AsyncStorage.getItem('userId');

	if(userId != null){
	  const token = await AsyncStorage.getItem('token');

	  this.setState({isLoading: true})

	  fetch(baseURL+"addItemRestaurantPhoto", {
		method: "POST",
		headers: {
		  'Accept': 'application/json',
		  'Content-Type': 'application/json',
		  'Authorization': token,
		},

		body: JSON.stringify({
		  type_id:restId,
		  user_id:userId,
		  section_type:"restaurant",
		  image_name: "data:image/jpeg;base64,"+this.state.AvtarState,
		})
	  })
	  .then((response) => response.json())
	  .then((responseData) => {
		if(responseData.status == "success"){
		  alert(responseData.message);
			this.setState({ image_array:
				this.state.image_array.concat([
					{ url: imagebaseItemsURL+responseData.image_name }
				])
			});
		  this.setState({isLoading: false})
		}else{
		  alert(responseData.message);
		  this.setState({isLoading: false})
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
		}else{
			alert("Please Login to perform the action")
		}
	}
	toTryList = async () => {
		that = this;
		const token = await AsyncStorage.getItem('token');
		const current_userId = await AsyncStorage.getItem('userId');
		const {state} = this.props.navigation;
		var restId = state.params.restId;

		fetch(baseURL+"addFavorite", {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': token,
			},
			body: JSON.stringify({
				user_id: current_userId,
				fav_id: restId,
				is_restaurant: "1",
			})
		})
		.then((response) => response.json())
		.then(async (responseData) => {
			if(responseData.status == "success"){
				if(this.state.isFav == 0)
					this.setState({ isFav: 1 });
				else
					this.setState({ isFav: 0 });
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
	addReviews = async () => {
		const userId = await AsyncStorage.getItem('userId');
		if(userId != null){
			const {state} = this.props.navigation;
			var id = state.params.restId;
			const { navigate } = this.props.navigation;
			navigate("AddRestReview",{restId: id});
		}else{
			alert("Please Login to perform the action")
		}
	}
	claimrest = async () => {
		const userId = await AsyncStorage.getItem('userId');
		if(userId != null){
			const {state} = this.props.navigation;
			var id = state.params.restId;
			const { navigate } = this.props.navigation;
			navigate("ClaimRest",{restId: id});
		}else{
			alert("Please Login to perform the action")
		}
	}
	gotoRecommendPage = async () => {
		const userId = await AsyncStorage.getItem('userId');
		if(userId != null){
			const {state} = this.props.navigation;
			var id = state.params.restId;
			var responseData = this.state.responseData;
			const { navigate } = this.props.navigation;
			navigate("itemRecommendation",{ids: id, type: "1", title: responseData.data.restaurant_name});
		}else{
			alert("Please Login to perform the action")
		}
	}

	_renderHeader(section) {
		return (
		  <View>
			<Text style={styles.menucategory}>{section.title} +</Text>
		  </View>
		);
	}

	_renderContent(section) {
		return (
		  <View>
			  <FlatList
				data={section.data}
				extraData={that.state}
				renderItem={that._renderItemView}
				keyExtractor={(item, index) => index}
			  />
		  </View>
		);
	}

	render() {

	var responseData = this.state.responseData;
	const menu_cat = this.state.menu_categories;
	const menuSection = [];
	var restaurant_name = "";
	var address_line_1 = "";
	var contact_number_1 = "";
	var description = "";
	var number_of_reviews = "";
	var hours_sunday = "";
	var hours_monday = "";
	var hours_tuesday = "";
	var hours_wednesday = "";
	var hours_thursday = "";
	var hours_friday = "";
	var hours_saturday = "";
	if(responseData.status == "success")
	{
		restaurant_name = responseData.data.restaurant_name;
		address_line_1 = responseData.data.address_line_1;
		contact_number_1 = responseData.data.contact_number_1;
		description = responseData.data.description;
		number_of_reviews = responseData.data.number_of_reviews;
		hours_sunday = responseData.data.hours_sunday;
		hours_monday = responseData.data.hours_monday;
		hours_tuesday = responseData.data.hours_tuesday;
		hours_wednesday = responseData.data.hours_wednesday;
		hours_thursday = responseData.data.hours_thursday;
		hours_friday = responseData.data.hours_friday;
		hours_saturday = responseData.data.hours_saturday;

		if(menu_cat != null && menu_cat.length > 0){
			for(i=0;i<menu_cat.length;i++){
				var newElement = {};
				var menuName = menu_cat[i].category_name;
				newElement['title'] = menuName;
				newElement['index'] = i;
				newElement['data'] = menu_cat[i].food_list;
				menuSection.push(newElement);
			}
		}
	}

    return (
		<ScrollView>
		<View style={styles.container}>
			{
				this.state.isLoading == true &&
				<View style={styles.activityIndicatorView}>
					<ActivityIndicator size={"large"} style={{padding: 60}}/>
				</View>
			}
			<View style={styles.header}>
				<TouchableOpacity onPress={()=>this.goBack()} style={styles.backbuttonTouch}>
					<Image source={require('./images/detail/back_red.png')} style={styles.backimg}></Image>
				</TouchableOpacity>
			</View>
			<View style={styles.foodimageview}>
				<View style={styles.sliderView}>
					<Slideshow
					  height={250}
					  indicatorColor={"rgba(0,0,0,0)"}
					  indicatorSelectedColor={"rgba(0,0,0,0)"}
					  arrowSize={40}
					  arrowLeft={
						<View style={styles.arrowTouch}>
							<Image source={require('./images/detail/back.png')} style={styles.headerMenu}></Image>
						</View>
					  }
					  arrowRight={
						<View style={styles.arrowTouch}>
							<Image source={require('./images/detail/next.png')} style={styles.headerMenu}>
							</Image>
						</View>
					  }
					  dataSource={this.state.image_array}/>
				</View>
				<View style={styles.sideicons}>
					<TouchableOpacity onPress={()=>this.toTryList()} style={styles.iconLikeTouch}>
						<Image source={this.state.isFav == 0 ? require('./images/detail/heart.png') : require('./images/detail/filledheart_red.png')} style={styles.iconLike}></Image>
					</TouchableOpacity>
					<TouchableOpacity onPress={()=>this.ShareItemDetail()} style={styles.iconShareTouch}>
						<Image source={require('./images/detail/share.png')} style={styles.iconShare}></Image>
					</TouchableOpacity>
				</View>
			</View>
			<View style={styles.headTitles}>
				<Text style={styles.headTitle}>{restaurant_name}</Text>
				<Text style={styles.foodPrice}>$$$</Text>
			</View>
			<View style={styles.otheroptions}>
				<View style={styles.overallstars}>
					{this.state.over_all_stars}
				</View>
				<PhotoUpload
					style={styles.addnewphoto}
					onPhotoSelect={avatar => {
						if(avatar){
						  this.setState({AvtarState:avatar});
						  this.UploadImage();
						}
					}}
				>
				<Image source={require('./images/detail/camera.png')} style={styles.cameraIcon} />
				</PhotoUpload>
				<TouchableOpacity style={styles.addnewreview} onPress={()=>this.addReviews()}>
					<Image source={require('./images/detail/edit.png')} style={styles.editMenu}></Image>
				</TouchableOpacity>
			</View>
			<View style={styles.ratingDetails}>
				<View style={styles.rates}>
					<Text style={styles.ratesText}>Dishes</Text>
					{this.state.dishes_star}
				</View>
				<View style={styles.rates}>
					<Text style={styles.ratesText}>Services</Text>
					{this.state.services_star}
				</View>
				<View style={styles.rates}>
					<Text style={styles.ratesText}>Ambiance</Text>
					{this.state.ambiance_star}
				</View>
				<View style={styles.rates}>
					<Text style={styles.ratesText}>Cleanliness</Text>
					{this.state.cleanliness_star}
				</View>
			</View>
			<View style={styles.contactAndScheduleView}>
				<View style={styles.contactView}>
					<Text style={styles.textContent}>{contact_number_1}</Text>
				</View>
				<View>
					<View style={[styles.setOpenCloseDays,{height: this.state.daysHeight}]}>
						<TouchableHighlight underlayColor={'rgba(0,0,0,0)'}  style={styles.daysArrowPos} onPress={()=>this.viewMoreDays()}>
							<Image source={this.state.btnArrowDays} style={styles.daysArrow}></Image>
						</TouchableHighlight>
						<Text style={styles.days}>Sunday	{hours_sunday}</Text>
						<Text style={styles.days}>Monday	{hours_monday}</Text>
						<Text style={styles.days}>Tuesday	{hours_tuesday}</Text>
						<Text style={styles.days}>Wednesday	{hours_wednesday}</Text>
						<Text style={styles.days}>Thursday	{hours_thursday}</Text>
						<Text style={styles.days}>Friday	{hours_friday}</Text>
						<Text style={styles.days}>Saturday	{hours_saturday}</Text>

					</View>
				</View>
			</View>
			<View style={styles.detailDesc}>
				<Text style={styles.textContent}>
					{address_line_1}
				</Text>
			</View>

			<View style={styles.detailDesc}>
				<Text style={styles.textContent}>
					{description}
				</Text>
			</View>

			<View style={styles.detailDesc}>
				<Text style={styles.menuHead}>Menu</Text>
				<View style={{ height: this.state.textHeight, backgroundColor: "#ffffff", }}>

					{ menu_cat != null &&
						<Accordion
							onChange={()=>this.changeStates()}
							sections={menuSection}
							underlayColor={"rgba(0,0,0,0)"}
							renderHeader={this._renderHeader}
							renderContent={this._renderContent}
						/>
					}


					<Text style={styles.btnClaimRest} onPress={()=>this.claimrest()}>CLAIM THIS RESTAURANT</Text>
				</View>
				{
					this.state.textHeight == 30 &&
					<TouchableOpacity style={styles.viewmore} onPress={()=>this.viewMore()}>
						<Image source={require('./images/detail/downmenu.png')} style={styles.arrowsize}></Image>
					</TouchableOpacity>
				}
			</View>
			<View style={styles.totalRecommendations}>
				<Text style={styles.recomText} onPress={()=>this.gotoRecommendPage()}>John, James, Peter, Danim +3 friends & experts have recommended.</Text>
				<View style={styles.recommendedBtnView}>
					<Text style={styles.recomTextBtn} onPress={()=>this.gotoRecommendPage()}>Read Reviews</Text>
				</View>
			</View>
			<View style={styles.reviews}>
				<Text style={styles.reviewTitle}>Reviews</Text>
				<ScrollView horizontal={true}>
					{this.state.review_array}
				</ScrollView>
			</View>
		</View>
		</ScrollView>
    );
	}

	goBack = () => {
		this.props.navigation.goBack();
	}

}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#ffffff",
		flex: 1,
	},
	activityIndicatorView :{
		justifyContent: 'center',
		alignItems:'center',
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		flex: 1,
	},
	header:{
		paddingLeft: 10,
		paddingTop: 10,
		paddingBottom: 10,
		position: "absolute",
		zIndex: 1,
	},
	backbuttonTouch: {
		backgroundColor: "rgba(255,255,255,0.8)",
		borderRadius: 20,
		height: 40,
		width: 40,
		justifyContent: "center",
		alignItems: "center",
	},
	backimg: {
		height: 20,
		width: 20,
	},
	foodimageview: {
		height: 250,
	},
	sliderView: {
		flex: 1,
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	},
	arrowTouch: {
		borderRadius: 20,
		height: 40,
		width: 40,
	},
	sideicons: {
		position: 'absolute',
		right: 0,
		top: 0,
		bottom: 0,
		left: 0,
	},
	iconLikeTouch: {
		position: "absolute",
		right: 10,
		top: 5,
		height: 40,
		width: 40,
		backgroundColor: "rgba(255,255,255,0.8)",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 20,
	},
	iconShareTouch: {
		position: "absolute",
		right: 10,
		bottom: 5,
		height: 40,
		width: 40,
		backgroundColor: "rgba(255,255,255,0.8)",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 20,
	},
	iconLike: {
		height: 30,
		width: 30,
	},
	iconShare: {
		height: 30,
		width: 30,
	},
	headTitles: {
		marginLeft: 20,
		marginRight: 20,
		marginTop: 5,
		marginBottom: 5,
		flexDirection: "row",
	},
	headTitle: {
		fontFamily: "SourceSansPro-Regular",
		fontSize: 18,
		flex: 2,
	},
	foodPrice: {
		fontFamily: "SourceSansPro-Regular",
		fontSize: 18,
		flex: 2,
		textAlign: "right",
		color: "#c1c1c1",
	},
	otheroptions: {
		marginLeft: 20,
		marginRight: 20,
		flexDirection: "row",
	},
	overallstars: {
		flex: 3,
		marginTop: 8,
		flexDirection: "row",
	},
	totalrating: {
		fontFamily: "SourceSansPro-Bold",
		fontSize: 15,
		marginTop: -2,
		marginLeft: 2,
	},
	addnewphoto: {
		flex: 3,
		alignItems: "flex-end",
		marginRight: 30,
	},
	cameraIcon: {
		height: 30,
		width: 30,
	},
	addnewreview: {
		flex: 3,
		alignItems: "flex-end",
	},
	editMenu: {
		height: 23,
		width: 23,
		marginTop: 5,
	},
	ratingDetails: {
		flexDirection: "row",
		marginTop: 10,
	},
	rates: {
		flex: 4,
		alignItems: "center",
	},
	ratesText: {
		fontSize: 14,
		fontFamily: 'SourceSansPro-Regular',
		marginBottom: 5,
	},
	contactAndScheduleView: {
		flexDirection: "row",
		marginTop: 20,
		marginBottom: 10,
		marginLeft: 20,
		marginRight: 20
	},
	contactView: {
		flex: 1,
		flexDirection: "row",
	},
	textContent: {
		fontSize: 14,
		fontFamily: 'SourceSansPro-Regular',
		fontWeight: "100",
		textAlign: "justify",
	},
	setOpenCloseDays: {
		flexDirection: "column",
		overflow: "hidden",
		backgroundColor: "#ffffff",
	},
	daysArrowPos: {
		position: "absolute",
		right: 20,
		bottom: 0,
	},
	daysArrow: {
		height: 15,
		width: 15,
	},
	days: {
		marginLeft: 10,
		marginRight: 40,
		textAlign: "right",
	},
	detailDesc: {
		marginLeft: 20,
		marginRight: 20,
		marginTop: 10,
	},
	menuHead: {
		fontFamily: "SourceSansPro-Regular",
		fontSize: 18,
	},
	menucategory: {
		fontStyle: "italic",
	},
	btnClaimRest: {
		marginTop: 10,
		marginBottom: 20,
		fontFamily: "SourceSansPro-Regular",
		fontSize: 14,
		textAlign: "left",
		color: "#e3323b",
	},
	viewmore: {
		flex: 1,
		alignItems: "center",
		marginBottom: -10,
		marginTop: -10,
		zIndex: 20,
	},
	arrowsize: {
		height: 20,
		width: 55,
	},
	totalRecommendations: {
		marginLeft: 20,
		marginRight: 20,
		paddingTop: 15,
		borderTopWidth: 1,
		borderTopColor: "#c1c1c1",
	},
	recomText: {
		fontFamily: "SourceSansPro-Regular",
		fontSize: 15,
	},
	recommendedBtnView: {
		marginTop: 10,
		justifyContent: "center",
		flex: 1,
		alignItems: "center",
	},
	recomTextBtn: {
		width: 170,
		textAlign: "center",
		paddingLeft: 10,
		paddingRight: 10,
		paddingTop: 3,
		paddingBottom: 3,
		borderRadius: 10,
		borderWidth: 1,
		color: "#e3323b",
		borderColor: "#9c9c9c",
	},
	reviews: {
		marginLeft: 20,
		marginRight: 20,
		marginTop: 10,
		marginBottom: 20,
	},
	reviewTitle: {
		fontFamily: "SourceSansPro-Regular",
		fontSize: 18,
		marginBottom: 5,
	},
	review: {
		marginLeft: 5,
		marginRight: 5,
	},
	reviewProfile: {
		height: 80,
		width: 80,
	},
	reviewNameOne: {
		fontFamily: "SourceSansPro-Regular",
		fontSize: 12,
		textAlign: "left",
	},
	reviewNameTwo: {
		fontFamily: "SourceSansPro-Regular",
		fontSize: 12,
		textAlign: "center",
	},
	listViewLi: {
		flexDirection: "row",
		paddingTop: 15,
		paddingBottom: 15,
		paddingRight: 5,
		borderBottomWidth: 1,
		borderBottomColor: "#9c9c9c",
	},
	listImageLi: {
		paddingRight: 10,
		justifyContent: "flex-start",
		height: "auto",
	},
	priceLi: {
		position: "absolute",
		width: 60,
		height: 24,
		padding: 2,
		color: "#9c9c9c",
		textAlign: "center",
		fontSize: 15,
		fontFamily: 'SourceSansPro-Regular',
		right: 10,
		top: 0,
		zIndex: 3,
		backgroundColor: "#ffffff",

	},
	listDetailLi: {
		flex: 6,
	},
	listStarsLi: {
		flex: 1,
		justifyContent: "flex-end",
		display: "flex",
		marginLeft: 30,
	},
	hidestarLi: {
		display: "none",
	},
	ratingDetailsLi: {
		flexDirection: "row",
		marginBottom: 3,
	},
	ratesLi: {
		flex: 3,
	},
	ratesTextLi: {
		fontSize: 14,
		fontFamily: 'SourceSansPro-Regular',
		marginBottom: 5,
	},
	quantityImageLi: {
		marginTop: -6,
        height: 20,
        width: 40,
	},
	proTitleLi:{
		fontSize: 14,
		fontFamily: 'SourceSansPro-Bold',
		fontWeight: "bold",
	},
});
