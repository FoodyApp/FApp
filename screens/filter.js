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
  Slider
} from 'react-native';

import RouterScreen from './routes';
import { StackNavigator } from 'react-navigation';

import Rating from 'react-native-rating';
import { Easing } from 'react-native';
import CheckBox from 'react-native-check-box';

import Tabs from 'react-native-tabs';

import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

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

var radio_props = [
  {label: 'Quantity', value: "menu_item_quantity_less_enough_alot" },
  {label: 'Quality', value: "freshness_menu_item_quality_star" },
  {label: 'Flavor', value: "menu_item_flavor_star" }
];


import './global.js';

export default class filterScreen extends React.Component {

    static navigationOptions = {
        title: 'Filter',
        header: null,
	    	tabBarVisible: false
    };

	constructor(props){
		super(props);
		this.state = {
			page:'craving',
			isLoading: false,
			prileftVal: 0,
			pritextMoveDisp: "flex",
			pritextMoveVal: 0,
			leftVal: 0,
			textMoveDisp: "flex",
			textMoveVal: 0,
			sortby: "menu_item_quantity_less_enough_alot",
			cravingChecks: [],
			cuisineChecks: [],
			diateryChecks: [],
			craving_category: [],
			cuisine_category: [],
			diatery_preference_category: [],
			radius: 0,
			price: 0,
            initialSelection: 0,
			
			distance: 0,
            minDistance: 0,
            maxDistance: 50,
			price: 10,
			minPrice: 10,
			maxPrice: 100
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

		this.getFilterCategoryList();

		var item_radius = await AsyncStorage.getItem('item_radius');
		var item_maxPrice = await AsyncStorage.getItem('item_maxPrice');

		if(item_radius != null){
			this.setState({ distance: Number(item_radius) });
		}

		if(item_maxPrice != null){
			this.setState({ price: Number(item_maxPrice) });
		}

		var sortByType = await AsyncStorage.getItem('item_sortby');

		if(sortByType == "menu_item_quantity_less_enough_alot" || sortByType == null){
			this.refs.radioForm.updateIsActiveIndex(0)
			this.setState({ sortby : "menu_item_quantity_less_enough_alot" });
		}else if(sortByType == "freshness_menu_item_quality_star"){
			this.refs.radioForm.updateIsActiveIndex(1)
			this.setState({ sortby : "freshness_menu_item_quality_star" });
		}else{
			this.refs.radioForm.updateIsActiveIndex(2)
			this.setState({ sortby : "menu_item_flavor_star" });
		}
		
	}


	getFilterCategoryList = async () => {

		var item_craving_category = await AsyncStorage.getItem('item_craving_category');
		var item_cuisine_category = await AsyncStorage.getItem('item_cuisine_category');
		var item_diatery_preference_category = await AsyncStorage.getItem('item_diatery_preference_category');

		if(item_craving_category != null){
			item_craving_category = item_craving_category.split(",")
			this.setState({ craving_category: item_craving_category });
		}
		else
			item_craving_category = 0;

		if(item_cuisine_category != null){
			item_cuisine_category = item_cuisine_category.split(",")
			this.setState({ cuisine_category: item_cuisine_category });
		}
		else
			item_cuisine_category = 0;

		if(item_diatery_preference_category != null){
			item_diatery_preference_category = item_diatery_preference_category.split(",")
			this.setState({ diatery_preference_category: item_diatery_preference_category });
		}
		else
			item_diatery_preference_category = 0;

		fetch(baseURL+"getCategoryForFilter", {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
		})
		.then((response) => response.json())
		.then((responseData) => {
			if(responseData.status == "success"){
				for(i=0;i<responseData.data["cravnig"].length;i++)
				{
					var flag = 0;
					for(a=0;a<item_craving_category.length;a++)
					{
						if(flag != 1)
						{
							if(item_craving_category[a] == responseData.data["cravnig"][i].id)
							{
								this.setState({
									cravingChecks: this.state.cravingChecks.concat([
										<CheckBox
											key={"crav"+i}
											style={styles.checkboxes}
											onClick={this.getCategory.bind(this,'cravnig',responseData.data["cravnig"][i].id)}
											isChecked={true}
											rightText={responseData.data["cravnig"][i].category_name}
											rightTextStyle={{color: "#9c9c9c"}}
											checkBoxColor={"#9c9c9c"}
										/>
									])
								});
								flag = 1;
							}
						}

					}
					if(flag != 1)
					{
						this.setState({
							cravingChecks: this.state.cravingChecks.concat([
								<CheckBox
									key={"crav"+i}
									style={styles.checkboxes}
									onClick={this.getCategory.bind(this,'cravnig',responseData.data["cravnig"][i].id)}
									isChecked={false}
									rightText={responseData.data["cravnig"][i].category_name}
									rightTextStyle={{color: "#9c9c9c"}}
									checkBoxColor={"#9c9c9c"}
								/>
							])
						});
					}
				}
				for(j=0;j<responseData.data["cuisine"].length;j++)
				{
					var flag = 0;
					for(b=0;b<item_cuisine_category.length;b++)
					{
						if(flag != 1)
						{
							if(item_cuisine_category[b] == responseData.data["cuisine"][j].id)
							{
								this.setState({
									cuisineChecks: this.state.cuisineChecks.concat([
										<CheckBox
											key={"cuis"+j}
											style={styles.checkboxes}
											onClick={this.getCategory.bind(this,'cuisine',responseData.data["cuisine"][j].id)}
											isChecked={true}
											rightText={responseData.data["cuisine"][j].category_name}
											rightTextStyle={{color: "#9c9c9c"}}
											checkBoxColor={"#9c9c9c"}
										/>
									])
								});
								flag = 1;
							}
						}
					}
					if(flag != 1)
					{
						this.setState({
							cuisineChecks: this.state.cuisineChecks.concat([
								<CheckBox
									key={"cuis"+j}
									style={styles.checkboxes}
									onClick={this.getCategory.bind(this,'cuisine',responseData.data["cuisine"][j].id)}
									isChecked={false}
									rightText={responseData.data["cuisine"][j].category_name}
									rightTextStyle={{color: "#9c9c9c"}}
									checkBoxColor={"#9c9c9c"}
								/>
							])
						});
					}
				}
				for(k=0;k<responseData.data["diatery"].length;k++)
				{
					var flag = 0;
					for(c=0;c<item_diatery_preference_category.length;c++)
					{
						if(flag != 1)
						{
							if(item_diatery_preference_category[c] == responseData.data["diatery"][k].id)
							{
								this.setState({
									diateryChecks: this.state.diateryChecks.concat([
										<CheckBox
											key={"diat"+k}
											style={styles.checkboxes}
											onClick={this.getCategory.bind(this,'diatery',responseData.data["diatery"][k].id)}
											isChecked={true}
											rightText={responseData.data["diatery"][k].category_name}
											rightTextStyle={{color: "#9c9c9c"}}
											checkBoxColor={"#9c9c9c"}
										/>
									])
								});
								flag = 1;
							}
						}
					}
					if(flag != 1)
					{
						this.setState({
							diateryChecks: this.state.diateryChecks.concat([
								<CheckBox
									key={"diat"+k}
									style={styles.checkboxes}
									onClick={this.getCategory.bind(this,'diatery',responseData.data["diatery"][k].id)}
									isChecked={false}
									rightText={responseData.data["diatery"][k].category_name}
									rightTextStyle={{color: "#9c9c9c"}}
									checkBoxColor={"#9c9c9c"}
								/>
							])
						});
					}
				}
			}else if(responseData.status == "logout"){
				alert("Your Session is Expired. Please Login Again");
				//await AsyncStorage.removeItem('loggedin');
				const { navigate } = this.props.navigation;
				navigate('Login');
			}else{
				this.setState({isLoading: false})
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
		}).done();
	}
	getCategory = (catName,catId) => {
		if(catName == "cravnig")
		{
			var array = this.state.craving_category;
			var index = array.toString().split(',').indexOf(catId.toString());
			if(index > -1)
				array.splice(index, 1);
			else
				array.push(catId);

			this.setState({craving_category: array});

			//alert("Array "+array+" CatID "+catId+" index "+index)
		}
		else if(catName == "cuisine")
		{
			var array = this.state.cuisine_category;
			var index = array.toString().split(',').indexOf(catId.toString());
			if(index > -1)
				array.splice(index, 1);
			else
				array.push(catId);

			this.setState({cuisine_category: array });
		}
		else
		{
			var array = this.state.diatery_preference_category;
			var index = array.toString().split(',').indexOf(catId.toString());
			if(index > -1)
				array.splice(index, 1);
			else
				array.push(catId);

			this.setState({ diatery_preference_category: array });

		}
	}
	goBack = (refresh) => {
		this.props.navigation.state.params.onNavigateBack(refresh)
		this.props.navigation.goBack();
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<TouchableHighlight
					underlayColor={"rgba(0,0,0,0)"}
					onPress={() => this.goBack(false)}>
						<Image source={require('./images/header/back_gray.png')} style={styles.headerMenu}></Image>
					</TouchableHighlight>
					<Text style={styles.headerText}>FILTER</Text>
				</View>
				<ScrollView>

				<View key={501} style={styles.radiusprogressviewPrice}>
					<Text style={styles.radiusText}>Price</Text>
					<Slider style={styles.sliderView}
						step={1}
						thumbStyle={{height: 10, width: 10,}}
						trackStyle={{height: 2,}}
						minimumTrackTintColor={"#e3323b"}
						maximumTrackTintColor={"#000000"}
						thumbTintColor={"#e3323b"}
						minimumValue={this.state.minPrice}
						maximumValue={this.state.maxPrice}
						value={this.state.price}
						onValueChange={val => this.setState({ price: val })}
					/>
					<View style={styles.bottomTextContainer}>
						<Text style={styles.bottomText}>$10</Text>
						<Text style={[styles.bottomText,{color: "#e3323b",}]}>${this.state.price}</Text>
						<Text style={styles.bottomText}>$100</Text>
					</View>
				</View>

				<View key={5} style={styles.radiusprogressviewPrice}>
					<Text style={styles.radiusText}>Distance</Text>
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

				<View style={styles.sorting}>
					<Text style={styles.headText}>Sort by</Text>
					<View style={styles.radioView}>
						<RadioForm
						  ref="radioForm"
						  radio_props={radio_props}
						  initial={this.state.initialSelection}
						  onPress={(value) => {this.setState({sortby:value})}}
						  formHorizontal={true}
						  buttonColor={"#e3323b"}
						  selectedButtonColor={"#e3323b"}
						  buttonSize={10}
						  labelStyle={{marginRight: 15, color: "#9c9c9c",}}
						/>
					</View>
				</View>
				<View style={styles.innerTabs}>
					<Tabs selected={this.state.page}
						style={styles.tabStyles}
						selectedStyle={{color:'#e3323b'}}
						onSelect={el=>this.setState({page:el.props.name})}>
							<Text name="craving" style={styles.selectedTabText} selectedIconStyle={styles.selectedTab}>
								Craving
							</Text>
							<Text name="cuisinetype" style={styles.selectedTabText} selectedIconStyle={styles.selectedTab}>
								Cuisine Type
							</Text>
							<Text name="dietary" style={styles.selectedTabText} selectedIconStyle={styles.selectedTab}>
								Dietary
							</Text>
					</Tabs>
				</View>
				<View style={styles.listofselection}>
					<View style={(this.state.page == "craving")?styles.show:styles.hide}>
						{this.state.cravingChecks}
					</View>
					<View style={(this.state.page == "cuisinetype")?styles.show:styles.hide}>
						{this.state.cuisineChecks}
					</View>
					<View style={(this.state.page == "dietary")?styles.show:styles.hide}>
						{this.state.diateryChecks}
					</View>
				</View>
				<View style={styles.filterButtons}>
					<TouchableHighlight
						underlayColor={"rgba(0,0,0,0)"}
						onPress={() => this.filter()}
						style = {styles.btnFilter}>
							<Text style = {styles.buttonText}>SEARCH</Text>
					</TouchableHighlight>
					<TouchableHighlight
						underlayColor={"rgba(0,0,0,0)"}
						onPress={()=>this.resetfilter()}
						style = {styles.btnReset}>
							<Text style = {styles.buttonText}>RESET</Text>
					</TouchableHighlight>
				</View>
				</ScrollView>
			</View>
		);
	}
	filter = async () => {
		var priceFilter = this.state.price;
		var distaceFilter = this.state.distance;
		var sortby = this.state.sortby;
		
		var craving = this.state.craving_category;
		var cuisine = this.state.cuisine_category;
		var diatery = this.state.diatery_preference_category;

		await AsyncStorage.setItem('item_radius', String(distaceFilter));
		await AsyncStorage.setItem('item_maxPrice', String(priceFilter));
		await AsyncStorage.setItem('item_sortby', String(sortby));
		await AsyncStorage.setItem('item_craving_category', String(craving));
		await AsyncStorage.setItem('item_cuisine_category', String(cuisine));
		await AsyncStorage.setItem('item_diatery_preference_category', String(diatery));

		this.goBack(true);

	}
	resetfilter = async () => {
		await AsyncStorage.removeItem('item_radius');
		await AsyncStorage.removeItem('item_maxPrice');
		await AsyncStorage.removeItem('item_sortby');
		await AsyncStorage.removeItem('item_craving_category');
		await AsyncStorage.removeItem('item_cuisine_category');
		await AsyncStorage.removeItem('item_diatery_preference_category');

		this.setState({ cravingChecks: [] });
		this.setState({ cuisineChecks: [] });
		this.setState({ diateryChecks: [] });
		this.setState({ craving_category: [] });
		this.setState({ cuisine_category: [] });
		this.setState({ diatery_preference_category: [] });

		this.getFilterCategoryList();

		this.setState({price: 10});
		this.setState({distance: 0});

		this.refs.radioForm.updateIsActiveIndex(0)
		this.setState({sortby: "menu_item_quantity_less_enough_alot"});
	}
}
const styles = StyleSheet.create({


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
		borderBottomColor: "#c1c1c1",
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
	sorting:{
		marginTop: 10,
		paddingLeft: 20,
		paddingRight: 20,
		paddingBottom: 10,
		borderBottomWidth: 1,
		borderBottomColor: "#c1c1c1",
		position: "relative",
	},
	radiusprogressview:{
		marginTop: 10,
	},
	radiusprogressviewPrice:{
		marginTop: 10,
		paddingBottom: 20,
		paddingLeft: 10,
		paddingRight: 10,
		borderBottomWidth: 1,
		borderBottomColor: "#c1c1c1",
	},
	headText: {
		fontSize: 14,
		fontFamily: 'SourceSansPro-Regular',
		marginBottom: 10,
		color: "#9c9c9c",
	},
	radioView: {
		position: "relative"
	},
	radiusText: {
		fontSize: 14,
		fontFamily: 'SourceSansPro-Regular',
		color: "#9c9c9c",
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
		color: "#9c9c9c",
		fontSize: 14,
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
		color: "#9c9c9c",
	},
	listofselection: {
		marginLeft: 20,
		marginRight: 20,
		marginTop: 10,
	},
	checkboxes: {
		borderColor: "#c1c1c1",
		marginBottom: 5,
	},
	show: {
		display: "flex",
	},
	hide: {
		display: "none",
	},
	filterButtons: {
		marginTop: 20,
		flex: 1,
		flexDirection: "row",
		marginLeft: 20,
		marginRight: 20,
		marginBottom: 20,
	},
	btnFilter: {
		height:40,
		flex: 2,
		justifyContent: "center",
		borderColor:'#8c8c8c',
		borderWidth: 2,
		marginRight: 5,
		borderRadius: 5,
	},
	btnReset:{
		height:40,
		flex: 2,
		justifyContent: "center",
		borderColor:'#8c8c8c',
		borderWidth: 2,
		marginLeft: 5,
		borderRadius: 5,
	},
	buttonText: {
		color: '#e3323b',
		justifyContent:'center',
		fontSize: 15,
		textAlign: 'center',
		fontFamily: 'SourceSansPro-Regular',
	},
});
