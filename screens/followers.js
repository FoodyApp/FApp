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
  starUnfilled: require('./images/listing/blankstar.png')
}

import Swipeout from 'react-native-swipeout';

var swipeoutBtns = [{
	text: "Detail",
	backgroundColor: "#e3323b",
	color: "#ffffff",
}];

import './global.js';

export default class followersScreen extends React.Component {

    static navigationOptions = {
        title: 'Followers',
        header: null
    };

	constructor(props){
		super(props);

		this.toggle = this.toggle.bind(this);

		this.state = {
			page:'followers',
			isOpen: false,
			responseDataFollowing: "",
			responseDataFollowers: "",
			responseDataRecommended: "",
			responseDataSearch: "",
			nodata: false,
			nodatamessage: null
		}

		this._renderFollowersList = this._renderFollowersList.bind(this);
		this._renderFollowingList = this._renderFollowingList.bind(this);
		this._renderRecommendedList = this._renderRecommendedList.bind(this);
		this._renderSearchedList = this._renderSearchedList.bind(this);
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
		this.getList();
	}

	getList = async () => {
		that = this;
		this.setState({isLoading: true})
		const token = await AsyncStorage.getItem('token');
		const userId = await AsyncStorage.getItem('userId');

		fetch(baseURL+"getFollowerFollowing", {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': token
			},
			body: JSON.stringify({
				user_id: userId
			})
		})
		.then((response) => response.json())
		.then(async(responseData) => {
			this.setState({isLoading: false})
			if(responseData.status == "success")
			{
				this.setState({	nodata: false });
				this.setState({ responseDataFollowing : responseData.data.followings});
				this.setState({ responseDataFollowers : responseData.data.followers});
				this.setState({ responseDataRecommended : responseData.data.recommanded_users});
			}
			else
			{
				this.setState({
					isLoading: false,
					nodata: true,
					nodatamessage: "Please login to perform the action",
				})
			}
		}).catch((error) => {
			this.setState({
				isLoading: false,
				nodata: true,
				nodatamessage: "Something went wrong. Please try again later",
			})
		})
		 .done();
	}

	follow = async (ids,type) => {
		that = this;
		const token = await AsyncStorage.getItem('token');
		const userId = await AsyncStorage.getItem('userId');

		fetch(baseURL+"followme", {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': token
			},
			body: JSON.stringify({
				user_id: userId,
				follow_id: ids,
				type: type,
			})
		})
		.then((response) => response.json())
		.then(async(responseData) => {
			this.setState({isLoading: false})
			if(responseData.status == "success")
			{
				that.getList();
			}
			else
			{
				alert(responseData.error);
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

	followSearch = async (ids,type) => {
		that = this;
		const token = await AsyncStorage.getItem('token');
		const userId = await AsyncStorage.getItem('userId');

		fetch(baseURL+"followme", {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': token
			},
			body: JSON.stringify({
				user_id: userId,
				follow_id: ids,
				type: type,
			})
		})
		.then((response) => response.json())
		.then(async(responseData) => {
			this.setState({isLoading: false})
			if(responseData.status == "success")
			{
				var user = this.state.searchuser;
				that.searchAvailableUsers(user);
				that.getList();
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

	searchAvailableUsers = async (user) => {
		this.setState({ searchuser : user });

		this.setState({isLoading: true})
		const token = await AsyncStorage.getItem('token');
		const userId = await AsyncStorage.getItem('userId');

		fetch(baseURL+"getUserDetails?filter="+user+"&user_id="+userId, {
			method: "GET",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': token
			},
		})
		.then((response) => response.json())
		.then(async(responseData) => {
			this.setState({isLoading: false})
			if(responseData.status == "success")
			{
				this.setState({	nodata: false });
				this.setState({ responseDataSearch : responseData.data});
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
				this.setState({ responseDataSearch : []});
			}
		}).catch((error) => {
			this.setState({
				isLoading: false,
				nodata: true,
				nodatamessage: "Something went wrong. Please try again later",
			})
		}).done();
	}

	_renderFollowersList({item, index}){
		return (
			<View style={styles.list}>
				<Image source={{ uri: imagebaseProfileURL+item.user_profile_pic}} style={styles.profilePic}></Image>
				<View style={styles.detail}>
					<Text style={styles.username} onPress={()=>this.checkProfile(item.id)}>{item.username}</Text>
					<Text style={styles.userstatus}>Status</Text>
					<Text style={styles.userreview}>Reviews: {item.number_of_review}</Text>
				</View>
				<View style={styles.buttons}>
					{
					item.is_followed === 0 ?
						<TouchableHighlight
							underlayColor={"rgba(0,0,0,0)"}
							onPress={() => this.follow(item.id,"follow")}
							style = {styles.btnFollow}>
								<Text style={styles.buttonFollowText}>Follow</Text>
						</TouchableHighlight>
					:
						<TouchableHighlight
							underlayColor={"rgba(0,0,0,0)"}
							onPress={() => this.follow(item.id,"unfollow")}
							style = {styles.btnUnFollow}>
								<Text style={styles.buttonUnFollowText}>Unfollow</Text>
						</TouchableHighlight>
					}
				</View>
			</View>
		)
	}
	_renderFollowingList({item, index}){
		return (
			<View style={styles.list}>
				<Image source={{ uri: imagebaseProfileURL+item.user_profile_pic}} style={styles.profilePic}></Image>
				<View style={styles.detail}>
					<Text style={styles.username} onPress={()=>this.checkProfile(item.id)}>{item.username}</Text>
					<Text style={styles.userstatus}>Status</Text>
					<Text style={styles.userreview}>Reviews: {item.number_of_review}</Text>
				</View>
				<View style={styles.buttons}>
					<TouchableHighlight
						underlayColor={"rgba(0,0,0,0)"}
						onPress={() => this.follow(item.id,"unfollow")}
						style = {styles.btnUnFollow}>
							<Text style={styles.buttonUnFollowText}>Unfollow</Text>
					</TouchableHighlight>
				</View>
			</View>
		)
	}
	_renderRecommendedList({item, index}){
		return (
			<View style={styles.listRecommended}>
				<Image source={{ uri: imagebaseProfileURL+item.user_profile_pic}} style={styles.profilePic}></Image>
				<View style={styles.detail}>
					<Text style={styles.username} onPress={()=>this.checkProfile(item.id)}>{item.username}</Text>
					<Text style={styles.userstatus}>Status</Text>
					<Text style={styles.userreview}>Reviews: {item.number_of_review}</Text>

					{
						item.is_followed === 0 ?
							<TouchableHighlight
								underlayColor={"rgba(0,0,0,0)"}
								onPress={() => this.follow(item.id,"follow")}
								style = {styles.btnFollow}>
									<Text style={styles.buttonFollowText}>Follow</Text>
							</TouchableHighlight>
						:
							<TouchableHighlight
								underlayColor={"rgba(0,0,0,0)"}
								onPress={() => this.follow(item.id,"unfollow")}
								style = {styles.btnUnFollow}>
									<Text style={styles.buttonUnFollowText}>Unfollow</Text>
							</TouchableHighlight>
					}
				</View>
			</View>
		)
	}
	_renderSearchedList({item, index}){
		return (
			<View style={styles.list}>
				<Image source={{ uri: imagebaseProfileURL+item.user_profile_pic}} style={styles.profilePic}></Image>
				<View style={styles.detail}>
					<Text style={styles.username} onPress={()=>this.checkProfile(item.user_id)}>{item.username}</Text>
					<Text style={styles.userstatus}>Status</Text>
					<Text style={styles.userreview}>Reviews: {item.number_of_review}</Text>
				</View>
				<View style={styles.buttons}>
					<TouchableHighlight
						underlayColor={"rgba(0,0,0,0)"}
						onPress={() => this.followSearch(item.user_id,"follow")}
						style = {styles.btnFollow}>
							<Text style={styles.buttonFollowText}>Follow</Text>
					</TouchableHighlight>
				</View>
			</View>
		)
	}

	checkProfile = (userId) => {
		const { navigate } = this.props.navigation;
		navigate("profile",{userId: userId})
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

					<View style={styles.searchfunction}>
						<View style={styles.search}>
							<TextInput
								style={styles.searchbox}
								underlineColorAndroid={"#c9c9c9"}
								placeholder = 'Search Friends'
								placeholderTextColor='#878384'
								onChangeText={searchuser => this.searchAvailableUsers(searchuser)}
								value={this.state.searchuser}
							/>
							<Image source={require('./images/header/search.png')} style={styles.searchButton}></Image>
						</View>
					</View>
				</View>
				<View style={styles.seperateBorder}></View>
				{
				this.state.searchuser !== undefined && this.state.searchuser !== "" ?

				<View>
					<ScrollView style={{ height: Dimensions.get('window').height-115 }}>
						<FlatList
							data={this.state.responseDataSearch}
							extraData={this.state}
							renderItem={this._renderSearchedList}
							keyExtractor={(item, index) => index}
						/>
						{
							this.state.nodata &&
							<View style={{height: Dimensions.get('window').height-115, flexDirection: "column",justifyContent: "center", alignItems: "center"}}>
								<Text style={{fontFamily: "SourceSansPro-Bold", fontSize: 16,}}>
									sorry!
								</Text>
								<Text style={{fontFamily: "SourceSansPro-Regular", fontSize: 14,}}>
									{this.state.nodatamessage}
								</Text>
							</View>
						}
					</ScrollView>
				</View>

				:

				<View>
					<View style={styles.innerTabs}>
						<Tabs selected={this.state.page}
							style={styles.tabStyles}
							selectedStyle={{color:'#e3323b'}}
							onSelect={el=>this.setState({page:el.props.name})}>
								<Text name="followers" style={styles.selectedTabText} selectedIconStyle={styles.selectedTab}>
									Followers
								</Text>
								<Text name="following" style={styles.selectedTabText} selectedIconStyle={styles.selectedTab}>
									Following
								</Text>
						</Tabs>
					</View>
					<View style={styles.listing}>
						<ScrollView style={{ height: Dimensions.get('window').height-285 }}>
							{
								this.state.page == "following" &&
								<FlatList
									data={this.state.responseDataFollowing}
									extraData={this.state}
									renderItem={this._renderFollowingList}
									keyExtractor={(item, index) => index}
								/>
							}
							{
								this.state.page == "followers" &&
								<FlatList
									data={this.state.responseDataFollowers}
									extraData={this.state}
									renderItem={this._renderFollowersList}
									keyExtractor={(item, index) => index}
								/>
							}
							{
								this.state.nodata &&
								<View style={{height: Dimensions.get('window').height-285, flexDirection: "column",justifyContent: "center", alignItems: "center"}}>
									<Text style={{fontFamily: "SourceSansPro-Bold", fontSize: 16,}}>
										sorry!
									</Text>
									<Text style={{fontFamily: "SourceSansPro-Regular", fontSize: 14,}}>
										{this.state.nodatamessage}
									</Text>
								</View>
							}
						</ScrollView>
					</View>
					<View style={styles.vertlisting}>
						<Text style={styles.textHead}>Recommendations</Text>
						<ScrollView horizontal={true}>
							<FlatList
								data={this.state.responseDataRecommended}
								extraData={this.state}
								renderItem={this._renderRecommendedList}
								keyExtractor={(item, index) => index}
							/>
						</ScrollView>
					</View>
				</View>
				}
			</View>
		</SideMenu>
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
	flexDirection: "row",
},
headerMenu:{
	height: 22,
	width: 22,
	marginTop: 7,
},
searchfunction:{
	flex: 1,
},
searchView: {
	flexDirection: "row",
	marginLeft: 10,
},
search:{
	flexDirection: "row",
  marginBottom: 10,
  marginTop: 5,
},
searchbox:{
	color: "#737373",
	fontFamily: 'SourceSansPro-Regular',
	fontSize: 15,
	flexDirection: "row",
	flex: 2,
	paddingLeft: 15,
  paddingBottom: 10,
  borderBottomColor: "#989898",
  borderBottomWidth: 1,
},
searchButton:{
	height: 20,
	width: 20,
	marginRight: 10,
	marginTop: 5,
},

	innerTabs: {
		height: 30,
		marginTop: -5,
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
	vertlisting: {
		borderTopWidth: 1,
		borderTopColor: "#c1c1c1",
		backgroundColor: "#ffffff",
	},
	list: {
		flex: 1,
		flexDirection: "row",
		paddingBottom: 5,
	},
	listRecommended: {
		flex: 1,
		flexDirection: "row",
		paddingBottom: 15,
	},
	profilePic: {
		height: 70,
		width: 70,
		justifyContent: 'center',
		alignItems:'center',
		marginLeft: 10,
		marginTop: 10,
		marginRight: 20,
	},
	detail: {
		marginTop: 15,
		flex: 2,
	},
	username: {
		fontSize: 13,
		fontWeight: "bold",
		fontFamily: 'SourceSansPro-Regular',
	},
	userstatus: {
		fontSize: 13,
		fontFamily: 'SourceSansPro-Regular',
	},
	userreview: {
		fontSize: 13,
		fontFamily: 'SourceSansPro-Regular',
	},
	textHead: {
		fontFamily: 'SourceSansPro-Regular',
		fontSize: 16,
		marginLeft: 10,
		marginTop: 10,
	},
	buttons: {
		alignItems: "center",
		justifyContent: "center",
	},
	horz_buttons: {
		alignItems: "center",
		justifyContent: "center",
		marginLeft: 40,
		marginRight: 10,
	},
	btnUnFollow:{
		borderColor:'#c1c1c1',
		height:30,
		minWidth: 100,
		borderWidth: 1,
		borderRadius: 5,
		marginRight: 10,
		paddingLeft: 10,
		paddingRight: 10,
		justifyContent: "center",
	},
	buttonUnFollowText: {
		color: '#c1c1c1',
		justifyContent:'center',
		fontSize: 14,
		textAlign: 'center',
		fontFamily: 'SourceSansPro-Regular',
	},
	btnFollow:{
		borderColor:'#e3323b',
		height:30,
		minWidth: 100,
		borderWidth: 1,
		borderRadius: 5,
		marginRight: 10,
		paddingLeft: 10,
		paddingRight: 10,
		justifyContent: "center",
	},
	buttonFollowText: {
		color: '#e3323b',
		justifyContent:'center',
		fontSize: 14,
		textAlign: 'center',
		fontFamily: 'SourceSansPro-Regular',
	},
});
