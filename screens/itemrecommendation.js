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
  ActivityIndicator,
  AsyncStorage,
  Platform,
  FlatList,
  TouchableWithoutFeedback,
	NetInfo,
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import Tabs from 'react-native-tabs';
import Rating from 'react-native-rating';

import './global.js';

const images = {
  starFilled: require('./images/listing/filledstar.png'),
  starUnfilled: require('./images/listing/blankstar.png'),
  starFilledOra: require('./images/listing/filledstar_ora.png'),
  starUnfilledOra: require('./images/listing/blankstar_ora.png')
}

export default class itemRecommendation extends React.Component {

    static navigationOptions = {
        title: 'Item Recommendation',
        header: null,
		tabBarVisible: false
    };
	constructor(props){
		super(props);
		this.state = {
			isLoading: false,
			page: "all",
			isRefreshing:false,
            isMoreDetail:false,
            selectIndex:[],
			currentDisp: null,
			review_rating_respData: null,
			recommanded_review_rating_respData: null,
			expert_review_rating_respData: null,
			title: "loading...",
			isRest: "0",
		}

		this._renderItemView = this._renderItemView.bind(this);
		this._renderRestView = this._renderRestView.bind(this);
	};
	componentDidMount() {
		BackHandler.addEventListener("hardwareBackPress", () => { Alert.alert(
			'Exit App',
			'Are you sure you want to exit app ?',
				[
					{ text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
					{ text: 'OK', onPress: () => BackHandler.exitApp() },
				],
				{
					cancelable: false
				}
			)
			return true;
		});
		
		this.getRecommendation();
	}

	getRecommendation = async () => {
		const {state} = this.props.navigation;
		this.setState({isLoading: true})
		var id = state.params.ids;
		var type = state.params.type;
		var title = state.params.title;
		this.setState({ title: title });
		this.setState({ isRest: type });
		
		const token = await AsyncStorage.getItem('token');
		const userId = await AsyncStorage.getItem('userId');
		
		fetch(baseURL+"getRecommandation", {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': token,
			},
			body: JSON.stringify({
				review_rating_type: type,
				item_id: id,
				user_id: userId,
			})
		})
		.then((response) => response.json())
		.then(async(responseData) => {
			this.setState({isLoading: false})
			
			if(responseData.status == "success")
			{
				this.setState({ review_rating_respData: responseData.data.review_rating });
				this.setState({ recommanded_review_rating_respData: responseData.data.recommanded_review_rating });
				this.setState({ expert_review_rating_respData: responseData.data.expert_review_rating });
			}
			else if(responseData.status == "logout")
			{
				alert(responseData.error)
			}
			else
			{
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
	
	goBack = () => {
	  //this.props.navigation.goBack();
	  this.props.navigation.goBack(null)
	}

	getDataonPress = (index) => {
		this.setState({isMoreDetail:true, selectIndex:index})
		this.setState({ currentDisp: index })
	}

	_renderItemView({item, index}){
        return (
			<TouchableWithoutFeedback
				onPressIn={() => this.getDataonPress(index)}
				activeOpacity={0.6}>
				<View style={styles.list}>
					<View style={styles.partone}>
						<Image source={{ uri: imagebaseProfileURL+item.user_image }} style={styles.userImage}></Image>
					</View>
					<View style={styles.parttwo}>
						<View style={styles.usernames}>
							<Text style={styles.nameOne}>{item.name}</Text>
							<Text style={styles.nameTwo}>Samurai</Text>
						</View>
						
						<View style={[this.state.isMoreDetail && this.state.selectIndex===index?styles.ratingDetails:styles.hideImageList]}>
							<View style={styles.rates}>
								<Text style={styles.ratesText}>Quality</Text>

								<Rating
									max={5}
									initial={Number(item.freshness_quality_star)}
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
							<View style={styles.rates}>
								<Text style={styles.ratesText}>Flavor</Text>

								<Rating
									max={5}
									initial={Number(item.flavor_star)}
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
							<View style={styles.rates}>
								<Text style={styles.ratesText}>Quantity</Text>
								{	
									item.quantity_less_enough_alot == "alot" &&
									<Image source={require("./images/listing/3.png")} style={styles.quantityImage}></Image>
								}
								{	
									item.quantity_less_enough_alot == "enough" &&
									<Image source={require("./images/listing/2.png")} style={styles.quantityImage}></Image>
								}
								{	
									item.quantity_less_enough_alot == "less" &&
									<Image source={require("./images/listing/1.png")} style={styles.quantityImage}></Image>
								}
							</View>
						</View>
						<View style={styles.overallstars}>
							<Rating
								max={5}
								initial={2}
								onChange={rating => console.log(rating)}
								selectedStar={images.starFilled}
								unselectedStar={images.starUnfilled}
								editable={false}
								maxScale={1.4}
								starStyle={{
									width: 12,
									height: 12,
								}}
							/>
							<Text style={[styles.totalrating,this.state.isMoreDetail && this.state.selectIndex===index?{display: "flex"}:{display: "none"}]}>(99)</Text>
						</View>
						<View key={6} style={[this.state.isMoreDetail && this.state.selectIndex===index?styles.detailPhotosView:styles.hideImageList]}>
							<ScrollView horizontal={true}>
								{this.getImages('item',item.images)}
							</ScrollView>
						</View>
					</View>
				</View>
			</TouchableWithoutFeedback>
		)
	}
	
	_renderRestView({item, index}){
        return (
			<TouchableWithoutFeedback
				onPressIn={() => this.getDataonPress(index)}
				activeOpacity={0.6}>
				<View style={styles.list}>
					<View style={styles.partone}>
						<Image source={{ uri: imagebaseProfileURL+item.user_image }} style={styles.userImage}></Image>
					</View>
					<View style={styles.parttwo}>
						<View style={styles.usernames}>
							<Text style={styles.nameOne}>{item.name}</Text>
							<Text style={styles.nameTwo}>Samurai</Text>
						</View>
						
						<View style={[this.state.isMoreDetail && this.state.selectIndex===index?styles.ratingDetails:styles.hideImageList]}>
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
						<View style={styles.overallstars}>
							<Rating
								max={5}
								initial={2}
								onChange={rating => console.log(rating)}
								selectedStar={images.starFilled}
								unselectedStar={images.starUnfilled}
								editable={false}
								maxScale={1.4}
								starStyle={{
									width: 12,
									height: 12,
								}}
							/>
							<Text style={[styles.totalrating,this.state.isMoreDetail && this.state.selectIndex===index?{display: "flex"}:{display: "none"}]}>({item.reviews})</Text>
						</View>
						<View key={6} style={[this.state.isMoreDetail && this.state.selectIndex===index?styles.detailPhotosView:styles.hideImageList]}>
							<ScrollView horizontal={true}>
								{this.getImages('rest',item.images)}
							</ScrollView>
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
				onPress={() => this.goBack()}>
					<Image source={require('./images/header/back_gray.png')} style={styles.headerMenu}></Image>
				</TouchableHighlight>
				<Text style={styles.headerText}>{this.state.title}</Text>
			</View>
			<View style={styles.innerTabs}>
				<Tabs selected={this.state.page}
					style={styles.tabStyles}
					selectedStyle={{color:'#e3323b'}}
					onSelect={el=>this.setState({page:el.props.name})}>
						<Text name="all" style={styles.selectedTabText} selectedIconStyle={styles.selectedTab}>
							All
						</Text>
						<Text name="friends" style={styles.selectedTabText} selectedIconStyle={styles.selectedTab}>
							Friends
						</Text>
						<Text name="experts" style={styles.selectedTabText} selectedIconStyle={styles.selectedTab}>
							Experts
						</Text>
				</Tabs>
			</View>
			<View style={styles.listing}>
				{
					this.state.isRest == "0" &&
					<ScrollView style={{ height: Dimensions.get('window').height-100 }}>
						{
							this.state.page == "all" ?
							<FlatList
								data={this.state.review_rating_respData}
								extraData={this.state}
								renderItem={this._renderItemView}
								keyExtractor={(item, index) => index}
							/>
							:
							this.state.page == "friends" ?
							<FlatList
								data={this.state.recommanded_review_rating_respData}
								extraData={this.state}
								renderItem={this._renderItemView}
								keyExtractor={(item, index) => index}
							/>
							:
							<FlatList
								data={this.state.expert_review_rating_respData}
								extraData={this.state}
								renderItem={this._renderItemView}
								keyExtractor={(item, index) => index}
							/>
						}
					</ScrollView>
				}
				{
					this.state.isRest == "1" &&
					<ScrollView style={{ height: Dimensions.get('window').height-100 }}>
						{
							this.state.page == "all" ?
							<FlatList
								data={this.state.review_rating_respData}
								extraData={this.state}
								renderItem={this._renderRestView}
								keyExtractor={(item, index) => index}
							/>
							:
							this.state.page == "friends" ?
							<FlatList
								data={this.state.recommanded_review_rating_respData}
								extraData={this.state}
								renderItem={this._renderRestView}
								keyExtractor={(item, index) => index}
							/>
							:
							<FlatList
								data={this.state.expert_review_rating_respData}
								extraData={this.state}
								renderItem={this._renderRestView}
								keyExtractor={(item, index) => index}
							/>
						}
					</ScrollView>
				}
			</View>
		</View>
    );
  }

}


const SideMenu = require('react-native-side-menu');

class Application extends React.Component {
  render() {
    const menu = <Menu navigator={navigator}/>;

    return (
      <SideMenu menu={menu}>
        <ContentView/>
      </SideMenu>
    );
  }
}

const styles = StyleSheet.create({

	activityIndicatorView: {
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
	headerText:{
		color: "#9c9c9c",
		fontSize: 20,
		flex: 2,
		marginTop: 4,
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
	overallstars: {
		flex: 3,
		marginTop: 10,
		flexDirection: "row",
		alignItems: "flex-end",
	},
	totalrating: {
		fontFamily: "SourceSansPro-Bold",
		fontSize: 12,
		marginLeft: 2,
		marginBottom: -2,
	},
	ratingDetails: {
		flexDirection: "row",
		marginTop: 10,
	},
	rates: {
		flex: 3,
	},
	rest_rates: {
		flex: 4,
	},
	ratesText: {
		fontSize: 14,
		fontFamily: 'SourceSansPro-Regular',
		marginBottom: 5,
	},
	quantityImage: {
		marginTop: -6,
		height: 25,
		width: 50,
	},
	listing: {
		margin: 10,
	},
	list: {
		flexDirection: "row",
		marginBottom: 5,
		paddingBottom: 5,
		borderBottomColor: "#c1c1c1",
		borderBottomWidth: 1,
	},
	partone: {
		flex: 1,
		justifyContent: "flex-start",
		alignItems: "center",
	},
	parttwo: {
		flex: 3,
	},
	userImage: {
		width: 100,
		height: 100,
	},
	usernames: {
		flexDirection: "row",
	},
	nameOne: {
		fontFamily: "SourceSansPro-Bold",
		fontSize: 16,
		textAlign: "left",
		flex: 2,
	},
	nameTwo: {
		color: "#c1c1c1",
		fontFamily: "SourceSansPro-Regular",
		fontSize: 16,
		textAlign: "right",
		flex: 2,
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
		width: 80,
		height: 80,
		marginRight: 10,
	},
});
