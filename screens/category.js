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

//import PushNotification from 'react-native-push-notification';
import { StackNavigator } from 'react-navigation';
import Rating from 'react-native-rating';
import { Easing } from 'react-native';
import CheckBox from 'react-native-check-box';


const images = {
  starFilled: require('./images/listing/filledstar.png'),
  starUnfilled: require('./images/listing/blankstar.png'),
  starFilledOra: require('./images/listing/filledstar_ora.png'),
  starUnfilledOra: require('./images/listing/blankstar_ora.png')
}

import './global.js';

export default class menuCategoryScreen extends React.Component {

    static navigationOptions = {
        title: 'Category',
        header: null,
		tabBarVisible: false
    };
	constructor(props){
		super(props);
		this.state = {
			isLoading: false,
			htmlContent: [],
			breakfastMore: "+", 
			lunchMore: "+",
			dinnerMore: "+",
			beverageMore: "+",
			
			isOpen: false,
			isRefreshing: false,
			isMoreDetail: false,
			selectIndex: [],
			currentDisp: null,
		}
		
		this._renderItemView = this._renderItemView.bind(this);
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
				<View style={styles.listView}>
					<View style={styles.listImage}>
						<Image source={require('./images/chickenburger.jpg')} style={{width:100, height:100}}>
						</Image>
						<Text style={styles.price}>$999.00</Text>
					</View>
					<View style={styles.listDetail}>
						<Text style={styles.proTitle}><Text style={{color: "#f7b51b",}}>#{index+1}</Text> Red Lobster</Text>
						<Text style={styles.proDesc}>2-B-12, Ramasmruti Flate.</Text>
						<Text style={styles.proDistance}>331.27 Mi</Text>
						<View key={6} style={[this.state.isMoreDetail && this.state.selectIndex===index?styles.listStars:styles.hidestar]}>

							<View style={styles.ratingDetails}>
								<View style={styles.rates}>
									<Text style={styles.ratesText}>Quality</Text>

									<Rating
										max={5}
										initial={5}
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
									<Text style={styles.ratesText}>Flavor</Text>

									<Rating
										max={5}
										initial={4}
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
									<Text style={styles.ratesText}>Quantity</Text>
									<Image source={require("./images/listing/2.png")} style={styles.quantityImage}></Image>
								</View>
							</View>
						</View>
						<View style={styles.listStars}>
							<Rating
								max={5}
								initial={3}
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
						</View>
					</View>


					<View style={styles.listIcons}>
						<Image source={require('./images/listing/heart.png')}
							style={{width: 20, height: 20}}
						></Image>

						<View style={{justifyContent: "flex-end", flex: 1}}>
						<Image source={require('./images/listing/share.png')}
							style={{width: 20, height: 20}}
						></Image>
						</View>
					</View>
				</View>
			</TouchableWithoutFeedback>
		)
	}

	changestate = (state) => {
		if(state == "breakfast"){
			if(this.state.breakfastMore == "+"){
				this.setState({breakfastMore: "-"});
				this.setState({lunchMore: "+"});
				this.setState({dinnerMore: "+"});
				this.setState({beverageMore: "+"});
			}else{
				this.setState({breakfastMore: "+"});
			}
		}else if(state == "lunch"){
			if(this.state.lunchMore == "+"){
				this.setState({breakfastMore: "+"});
				this.setState({lunchMore: "-"});
				this.setState({dinnerMore: "+"});
				this.setState({beverageMore: "+"});
			}else{
				this.setState({lunchMore: "+"});
			}
		}else if(state == "dinner"){
			if(this.state.dinnerMore == "+"){
				this.setState({breakfastMore: "+"});
				this.setState({lunchMore: "+"});
				this.setState({dinnerMore: "-"});
				this.setState({beverageMore: "+"});
			}else{
				this.setState({dinnerMore: "+"});
			}
		}else{
			if(this.state.beverageMore == "+"){
				this.setState({breakfastMore: "+"});
				this.setState({lunchMore: "+"});
				this.setState({dinnerMore: "+"});
				this.setState({beverageMore: "-"});
			}else{
				this.setState({beverageMore: "+"});
			}
		}
	}
	

   render() {

	const { navigate } = this.props.navigation;

    return (
		<View style={styles.container}>
			
			<View style={styles.header}>
				<TouchableHighlight
				underlayColor={"rgba(0,0,0,0)"}
				onPress={() => this.goBack()}>
					<Image source={require('./images/header/back.png')} style={styles.headerMenu}></Image>
				</TouchableHighlight>	
				<Text style={styles.headerText}>MENU</Text>
			</View>

			<View>
				<View style={styles.categoryView}>
					<Text style={styles.categoryText} onPress={()=>this.changestate("breakfast")}>BREAKFAST {this.state.breakfastMore}</Text>
				</View>
				
				{ this.state.breakfastMore === "-" && 
					<ScrollView style={{ height: Dimensions.get('window').height-205 }}>
						<FlatList
							data={[
								{key: 'a',value: 'Apple'},
								{key: 'b',value: 'Ball'},
								{key: 'c',value: 'Cat'},
								{key: 'd',value: 'Doll'},
								{key: 'e',value: 'Elephant'},
								{key: 'f',value: 'Fish'},
								{key: 'g',value: 'Goat'},
							]}
							extraData={this.state}
							renderItem={this._renderItemView}
						/>
					</ScrollView>
				}
				
				<View style={styles.categoryView}>
					<Text style={styles.categoryText} onPress={()=>this.changestate("lunch")}>LUNCH {this.state.lunchMore}</Text>
				</View>
				
				{ this.state.lunchMore === "-" && 
					<ScrollView style={{ height: Dimensions.get('window').height-285 }}>
						<FlatList
							data={[
								{key: 'a',value: 'Apple'},
								{key: 'b',value: 'Ball'},
								{key: 'c',value: 'Cat'},
								{key: 'd',value: 'Doll'},
								{key: 'e',value: 'Elephant'},
								{key: 'f',value: 'Fish'},
								{key: 'g',value: 'Goat'},
							]}
							extraData={this.state}
							renderItem={this._renderItemView}
						/>
					</ScrollView>
				}
				
				<View style={styles.categoryView}>
					<Text style={styles.categoryText} onPress={()=>this.changestate("dinner")}>DINNER {this.state.dinnerMore}</Text>
				</View>
				
				{ this.state.dinnerMore === "-" && 
					<ScrollView style={{ height: Dimensions.get('window').height-365 }}>
						<FlatList
							data={[
								{key: 'a',value: 'Apple'},
								{key: 'b',value: 'Ball'},
								{key: 'c',value: 'Cat'},
								{key: 'd',value: 'Doll'},
								{key: 'e',value: 'Elephant'},
								{key: 'f',value: 'Fish'},
								{key: 'g',value: 'Goat'},
							]}
							extraData={this.state}
							renderItem={this._renderItemView}
						/>
					</ScrollView>
				}
				
				<View style={styles.categoryView}>
					<Text style={styles.categoryText} onPress={()=>this.changestate("beverages")}>BEVERAGES {this.state.beverageMore}</Text>
				</View>
				
				{ this.state.beverageMore === "-" && 
					<ScrollView style={{ height: Dimensions.get('window').height-365 }}>
						<FlatList
							data={[
								{key: 'a',value: 'Apple'},
								{key: 'b',value: 'Ball'},
								{key: 'c',value: 'Cat'},
								{key: 'd',value: 'Doll'},
								{key: 'e',value: 'Elephant'},
								{key: 'f',value: 'Fish'},
								{key: 'g',value: 'Goat'},
							]}
							extraData={this.state}
							renderItem={this._renderItemView}
						/>
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
		color: "#e3323b",
		fontSize: 20,
		flex: 2,
		marginTop: 4,
		fontFamily: 'SourceSansPro-Regular',
	},
	categoryView: {
		height: 80,
		justifyContent: "center",
		alignItems: "center",
		borderBottomColor: "#696969",
		borderBottomWidth: 0.5,
		borderTopColor: "#696969",
		borderTopWidth: 0.5,
	},
	categoryText: {
		fontSize: 18,
		color: "#696969",
		fontWeight: "700",
	},
	nodataFound: {
		marginTop: 150,
	},
	nodatatext: {
		marginLeft: 40,
		marginRight: 40,
		fontSize: 22,
		textAlign: "center",
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
	hidestar: {
		display: "none",
	},
	ratingDetails: {
		flexDirection: "row",
		marginBottom: 3,
	},

	listIcons: {
		flex: 1,
		justifyContent: "flex-end",
		alignItems: "flex-end",
		marginLeft: -20,
	},
	medalView: {
		justifyContent: "flex-end",
		flex: 1,
		marginTop: 0,
		flexDirection: "row",
	},
	rates: {
		flex: 3,
	},
	ratesText: {
		fontSize: 10,
		fontFamily: 'SourceSansPro-Regular',
		marginBottom: 5,
	},
	quantityImage: {
		marginTop: -6,
    height: 20,
    width: 40,
	},
	swipeOutBg: {
		backgroundColor: "#ffffff",
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