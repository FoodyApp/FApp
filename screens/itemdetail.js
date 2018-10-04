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
  BackHandler,
  ActivityIndicator,
  AsyncStorage,
  Share,
	NetInfo,
} from 'react-native';

const winHeight = Dimensions.get('window').height;
const winWidth = Dimensions.get('window').width;

import FitImage from 'react-native-fit-image';

import Rating from 'react-native-rating';
import { Easing } from 'react-native';

import Slideshow from 'react-native-slideshow';
import MapView from 'react-native-maps';

import PhotoUpload from 'react-native-photo-upload'

const images = {
  starFilled: require('./images/listing/filledstar.png'),
  starUnfilled: require('./images/listing/blankstar.png'),
  starFilledOra: require('./images/listing/filledstar_ora.png'),
  starUnfilledOra: require('./images/listing/blankstar_ora.png')
}

export default class ItemDetailScreen extends React.Component {

  static navigationOptions = {
	  title:'Item Detail',
      header: null,
	  tabBarVisible: false
  };
	constructor(props){
		super(props);
		this.state = {
			isLoading: false,
			textHeight: 40,
			sliderPopUp: false,
			btnArrow: require('./images/detail/down.png'),
			responseData: "",
			review_array: [],
			image_array: [],
			star_rating: null,
			flavor_star: null,
			quality_star: null,
			isFav: 0,
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

	this.getItemDetail();
  }
  addReviews = async () => {
	const userId = await AsyncStorage.getItem('userId');
	if(userId != null){
		const {state} = this.props.navigation;
		var id = state.params.itemId;
		const { navigate } = this.props.navigation;
		navigate("AddFoodReview",{itemId: id});
	}else{
		alert("Please Login to perform the action")
	}
  }
  openMenuPage = () => {
	  const { navigate } = this.props.navigation;
	  navigate("menuCategoryScreen");
  }
  gotoRecommendPage = async () => {
	const userId = await AsyncStorage.getItem('userId');
	if(userId != null){
		const {state} = this.props.navigation;
		var id = state.params.itemId;
		var responseData = this.state.responseData;
		const { navigate } = this.props.navigation;
		navigate("itemRecommendation",{ids: id, type: "0", title: responseData.data.item_name});
	}else{
		alert("Please Login to perform the action")
	}
  }
  viewMore = () => {
	  if(this.state.textHeight == "auto")
	  {
		  this.setState({textHeight: 40});
		  this.setState({btnArrow: require('./images/detail/down.png')});
	  }
	  else
	  {
		  this.setState({textHeight: "auto"});
		  this.setState({btnArrow: require('./images/detail/up.png')});
	  }
  }

	getItemDetail = async () => {

		var userId = await AsyncStorage.getItem('userId');

		this.setState({isLoading: true})
		const {state} = this.props.navigation;
		var itemId = state.params.itemId;

		fetch(baseURL+"getMenuItemDetail", {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				menu_item_id: itemId,
				userId: userId
			})
		})
		.then((response) => response.json())
		.then(async(responseData) => {
			this.setState({isLoading: false})
			if(responseData.status == "success")
			{
				this.setState({responseData: responseData});
				this.setState({ isFav: responseData.data.isFav });
				this.setState({ quality_star :
					<View style={styles.rates}>
						<Text style={styles.ratesText}>Quality</Text>
						<Rating
							max={5}
							initial={parseInt(responseData.data.freshness_menu_item_quality_star)}
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
					</View>
				});
				this.setState({ flavor_star :
					<View style={styles.rates}>
						<Text style={styles.ratesText}>Flavor</Text>

						<Rating
							max={5}
							initial={parseInt(responseData.data.menu_item_flavor_star)}
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
					</View>
				});

				this.setState({ star_rating :
					<View style={styles.overallstars}>
						<Rating
							max={5}
							initial={parseInt(responseData.data.star_rating)}
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

				for(i=0;i<responseData.data.userImageData.length;i++)
				{
					this.setState({ image_array:
						this.state.image_array.concat([
							{ url: imagebaseItemsURL+responseData.data.userImageData[i].image_name }
						])
					});
				}
				for(i=0;i<responseData.data.reviewUserData.length;i++)
				{
					this.setState({ review_array :
						this.state.review_array.concat([
							<View style={styles.review} key={"reviews"+i}>
								<Image source={{ uri: imagebaseProfileURL+responseData.data.reviewUserData[i].user_profile_pic }} style={styles.reviewProfile}></Image>
								<Text style={styles.reviewNameOne}>{responseData.data.reviewUserData[i].username}</Text>
								<View>
									<Rating
										max={5}
										initial={responseData.data.reviewUserData[i].overall_rating}
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

	UploadImage = async () => {

	  const {state} = this.props.navigation;
	  var itemId = state.params.itemId;
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
		  type_id:itemId,
		  user_id:userId,
		  section_type:"item",
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
		var itemId = state.params.itemId;

		fetch(baseURL+"addFavorite", {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': token,
			},
			body: JSON.stringify({
				user_id: current_userId,
				fav_id: itemId,
				is_restaurant: "0",
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
	ShareItemDetail = () => {

		var responseData = this.state.responseData;
    var url = "";
    if(responseData.data.userImageData != "")
      url = imagebaseItemsURL+responseData.data.userImageData[0].image_name;

    var messageText = "Item :"+responseData.data.item_name+" Restaurant :"+responseData.data.restaurant_name+" Address: "+ responseData.data.address_line_1 +" "+url;

		Share.share({
			message: messageText,
			url: url,
			title: responseData.data.item_name,
		}, {
			// Android only:
			dialogTitle: 'Share On',
			// iOS only:
			excludedActivityTypes: [
			'com.apple.UIKit.activity.PostToTwitter'
			]
		})
	}

   render() {

	var responseData = this.state.responseData;
	let item_name = "";
	let item_price = "";
	let restaurant_name = "";
	let address_line_1 = "";
	let contact_number_1 = "";
	let long_description = "";
	let generic_receipe = "";
	let number_of_reviews = "";
	let item_quantity = "";

	if(responseData.status == "success")
	{
		item_name = responseData.data.item_name;
		item_price = responseData.data.price;
		restaurant_name = responseData.data.restaurant_name;
		address_line_1 = responseData.data.address_line_1;
		contact_number_1 = responseData.data.contact_number_1;
		long_description = responseData.data.long_description;
		generic_receipe = responseData.data.generic_receipe;
		number_of_reviews = responseData.data.number_of_reviews;
		item_quantity = responseData.data.menu_item_quantity_less_enough_alot;
	}

    return (
		<View style={styles.container}>
			{
				this.state.isLoading == true ?
				<View style={styles.activityIndicatorView}>
					<ActivityIndicator size={"large"} style={{padding: 60}}/>
				</View>
			:
			<View>
			<View style={styles.header}>
				<TouchableHighlight
				underlayColor={"rgba(0,0,0,0)"}
				style={styles.backbuttonTouch}
				onPress={this.goBack}>
					<Image source={require('./images/detail/back_red.png')} style={styles.headerMenu}></Image>
				</TouchableHighlight>
			</View>
			<ScrollView>
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
						<TouchableHighlight
							underlayColor={"rgba(0,0,0,0)"}
							onPress={()=>this.toTryList()}
							style={styles.iconLikeTouch}>
							<Image source={this.state.isFav == 0 ? require('./images/detail/heart.png') : require('./images/detail/filledheart_red.png')} style={styles.iconLike}></Image>
						</TouchableHighlight>
						<TouchableHighlight underlayColor={"rgba(0,0,0,0)"} style={styles.iconMenuTouch} onPress={()=>this.ShareItemDetail()}>
							<Image source={require('./images/detail/share.png')} style={styles.iconShare}></Image>
						</TouchableHighlight>
					</View>
				</View>
				<View style={styles.headTitles}>
					<Text style={styles.headTitle}>{item_name}</Text>
					<Text style={styles.foodPrice}>${item_price}</Text>
				</View>
				<View style={styles.otheroptions}>
					{this.state.star_rating}

					<PhotoUpload
						style={styles.addnewphoto}
						onPhotoSelect={avatar => {
							if(avatar){
							  this.setState({AvtarState:avatar});
							  this.UploadImage();
							}
						}}
					>
					<View style={styles.iconMenu}>
						<Image source={require('./images/detail/camera.png')} style={styles.iconMenu} />
					</View>
					</PhotoUpload>
					{/*Image source={require('./images/detail/camera.png')}*/}

					<TouchableHighlight underlayColor={"rgba(0,0,0,0)"} style={styles.addnewreview} onPress={()=>this.addReviews()}>
						<Image source={require('./images/detail/edit.png')} style={styles.editMenu}></Image>
					</TouchableHighlight>
				</View>
				<View style={styles.ratingDetails}>
					{this.state.quality_star}
					{this.state.flavor_star}


					<View style={styles.rates}>
						<Text style={styles.ratesText}>Quantity</Text>

						{
							item_quantity == "alot" &&
							<Image source={require("./images/listing/3.png")} style={styles.quantityImage}></Image>
						}
						{
							item_quantity == "enough" &&
							<Image source={require("./images/listing/2.png")} style={styles.quantityImage}></Image>
						}
						{
							item_quantity == "less" &&
							<Image source={require("./images/listing/1.png")} style={styles.quantityImage}></Image>
						}
					</View>
				</View>
				<View style={styles.detailDesc}>
					<Text style={styles.headTitle}>{restaurant_name}</Text>
				</View>
				<View style={styles.detailDesc}>
					<Text style={styles.textContent}>{address_line_1}</Text>
					<View style={{flexDirection: "row",marginTop: 5,}}>
						<Text style={styles.textContent}>{contact_number_1}</Text>
					</View>
				</View>
				<View style={styles.detailDesc}>
					<Text style={[styles.textContent,{height: this.state.textHeight}]}>
						{long_description}
						{"\n\n"}
						{generic_receipe}
					</Text>
					<TouchableHighlight underlayColor={'rgba(0,0,0,0)'} style={styles.viewmore} onPress={()=>this.viewMore()}>
						<Image source={this.state.btnArrow} style={styles.arrowsize}></Image>
					</TouchableHighlight>
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
			</ScrollView>
			</View>
			}
		</View>
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
		marginTop: 7,
		marginRight: 10,
		backgroundColor: "rgba(255,255,255,0.8)",
		borderRadius: 20,
		height: 40,
		width: 40,
	},
	arrowTouch: {
	//	backgroundColor: "rgba(255,255,255,0.8)",
		borderRadius: 20,
		height: 40,
		width: 40,
	},
	headerMenu:{
		height: 20,
		width: 20,
		marginTop: 10,
		marginLeft: 10,
	},
	foodimageview: {
		height: 250,
	},
	foodimage: {
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
		top: 110,
		height: 40,
		width: 40,
		backgroundColor: "rgba(255,255,255,0.8)",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 20,
	},
	iconMenuTouch: {
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
	iconMenu: {
		height: 30,
		width: 30,
	},
	iconShare: {
		height: 30,
		width: 30,
	},
	arrows: {
		height: 40,
		width: 40,
		borderRadius: 20,
		backgroundColor: "rgba(255,255,255,0.8)",
		color: "#e3323b",
		fontSize: 22,
		fontWeight: "bold",
		textAlign: "center",
		lineHeight: 30,

	},
	iconLike: {
		height: 30,
		width: 30,
	},
	  editMenu: {
		height: 23,
		width: 23,
		marginTop: 5,
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
	showGallery: {
		flex: 3,
		alignItems: "center",
	},
	addnewphoto: {
		flex: 3,
		alignItems: "flex-end",
		marginRight: 30,
	},
	addnewreview: {
		flex: 3,
		alignItems: "flex-end",
	},
	ratingDetails: {
		flexDirection: "row",
		marginTop: 10,
		marginLeft: 20,
		marginRight: 20,
	},
	rates: {
		flex: 3,
		alignItems: "center",
	},
	ratesText: {
		fontSize: 14,
		fontFamily: 'SourceSansPro-Regular',
		marginBottom: 5,
	},
	quantityImage: {
		marginTop: -5,
    height: 20,
    width: 50,
	},
	detailDesc: {
		marginLeft: 20,
		marginRight: 20,
		marginTop: 10,
	},
	textContent: {
		fontSize: 14,
		fontFamily: 'SourceSansPro-Regular',
		fontWeight: "100",
		textAlign: "justify",
	},
	telephoneicon: {
		height: 20,
		width: 20,
		marginRight: 5,
	},
	viewmore: {
		flex: 1,
		alignItems: "center",
	},
	arrowsize: {
		height: 20,
		width: 20,
	},
	totalRecommendations: {
		marginLeft: 20,
		marginRight: 20,
		marginTop: 5,
		paddingTop: 5,
		borderTopWidth: 1,
		borderTopColor: "#c1c1c1",
	},
	recomText: {
		fontFamily: "SourceSansPro-Regular",
		fontSize: 15,
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
	recommendedBtnView: {
		marginTop: 10,
		justifyContent: "center",
		flex: 1,
		alignItems: "center",
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


	sliderPopUp: {
		zIndex: 2,
		position: "absolute",
		top: 0,
		left: 0,
		height: winHeight,
		width: winWidth,
		backgroundColor: "rgba(0,0,0,0.8)",
	},
	closeBtnHolder: {
		position: "absolute",
		right: 10,
		top: 10,
		height: 35,
		width: 35,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#ffffff",
		borderRadius: 17,
	},
	closePopup: {
		height: 20,
		width: 20,
	},
	sliderView: {
		flex: 1,
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	},
});
