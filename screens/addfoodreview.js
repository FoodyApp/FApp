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
	NetInfo,
} from 'react-native';

import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

var radio_props = [
  {label: 'Low', value: 0 },
  {label: 'Enough', value: 1 },
  {label: 'A Lot', value: 2 }
];

import { StackNavigator } from 'react-navigation';
import FitImage from 'react-native-fit-image';
import Rating from 'react-native-rating'
import './global.js';
import Slider from "react-native-slider";

const images = {
  starFilled: require('./images/listing/filledstar.png'),
  starUnfilled: require('./images/listing/blankstar.png'),
  starFilledOra: require('./images/listing/filledstar_ora.png'),
  starUnfilledOra: require('./images/listing/blankstar_ora.png')
}

export default class addReviewScreen extends React.Component {

    static navigationOptions = {
        title: 'WriteYourReview',
        header: null,
		tabBarVisible: false
    };
    constructor(props){
  		super(props);
  		this.state = {
  			isLoading: false,
			FreshnessStar : 0,
			FlavourStar : 0,
			QuantityValue: 0,
			txtReview: "",
      };
  	}

	componentDidMount() {
		BackHandler.addEventListener("hardwareBackPress", () => { return true });
	}

	submitDetails = async () => {
		this.setState({ isLoading: true });
		
		that = this;
		
		const {state} = this.props.navigation;
		var itemId = state.params.itemId;
		
		const userId = await AsyncStorage.getItem('userId');
		const token = await AsyncStorage.getItem('token');
		
		var freshness = this.state.FreshnessStar;
		var flavor = this.state.FlavourStar;
		var quantity = this.state.QuantityValue;
		var review = this.state.txtReview;
		
		var quantity_text = "";
		
		if(quantity == 0){
			quantity_text = "less";
		}else if(quantity == 0.5){
			quantity_text = "enough";
		}else{
			quantity_text = "alot";
		}
		
		fetch(baseURL+"addMenuItemReviewRating", {
		  method: "POST",
		  headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': token,
		  },
		  body: JSON.stringify({
			menu_item_id: itemId,
			user_id: userId,
			freshness_quality_star: freshness,
			flavor_star: flavor,
			quantity_less_enough_alot: quantity_text,
			menu_review_write_up: review,
		  })
		})
		.then((response) => response.json())
		.then((responseData) => {
			this.setState({ isLoading: false });
			if(responseData.status == "success")
			{
				alert("Review Added Successfully");
				that.goBack();
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

   const { navigate } = this.props.navigation;

    return (
		<View style={styles.container}>

			<View style={styles.header}>
				<TouchableHighlight
				underlayColor={"rgba(0,0,0,0)"}
				onPress={this.goBack}>
					<Image source={require('./images/header/back_gray.png')} style={styles.headerMenu}></Image>
				</TouchableHighlight>
				<Text style={styles.headerText}>WRITE REVIEW</Text>
			</View>

			<ScrollView keyboardShouldPersistTaps="always" >

        <View key={20}>
          <View style={styles.TitleReview} key={21}>
            <Text style={styles.GiveReviewTitle}>Menu item Rating</Text>
          </View>

		<View style={styles.MenuFoodRate} key={22}>
            <Text style={styles.RateText}>Freshness/Quality</Text>
            <Rating
              max={5}
              // initial={dataResponse.data[i].menu_food_star}
              onChange={rating => this.setState({FreshnessStar: rating})}
              selectedStar={images.starFilledOra}
              unselectedStar={images.starUnfilledOra}
              editable={true}
              stagger={80}
              maxScale={1.4}
              starStyle={{
              width: 15,
              height: 15,
              marginRight: 5,
              }}
              />
          </View>

          <View style={styles.MenuFoodRate} key={23}>
                <Text style={styles.RateText}>Flavour</Text>
                <Rating
                  max={5}
                //  initial={dataResponse.data[i].menu_food_star}
                  onChange={rating => this.setState({FlavourStar: rating})}
                  selectedStar={images.starFilledOra}
                  unselectedStar={images.starUnfilledOra}
                  editable={true}
                  stagger={80}
                  maxScale={1.4}
                  starStyle={{
                  width: 15,
                  height: 15,
                  marginRight: 5,
                  }}
                  />
              </View>
					
					
					
					{/*<View style={styles.MenuFoodRate} key={24}>
                        <Text style={styles.RateText}>Quantity</Text>
						 <RadioForm
                          radio_props={radio_props}
                          initial={0}
						  borderWidth={1}
						  buttonInnerColor={'#F73540'}
						  buttonOuterColor={'#F73540'}
						  buttonSize={10}
						  buttonOuterSize={15}
                          formHorizontal={true}
                          buttonColor={'#F73540'}
                          selectedButtonColor={'#F73540'}
						  wrapStyle={{backgroundColor: "#f73540"}}
						  labelStyle={{marginRight: 10}}
                          onPress={(value) => {this.setState({value:value})}}
                        />

                      </View> 	*/}
					  
						<View style={styles.sliderContainer}>
							<Text style={styles.RateText}>Quantity</Text>
							<View style={{flex: 2, flexDirection: "column"}}>
								<View style={styles.sliderSignHolder}>
									<Text style={styles.slidertext1}>-</Text>
									<Text style={styles.slidertext3}>+</Text>
								</View>
								<View style={styles.sliderHolder}>
								   <Slider
									  style={styles.sliderStyle}
									  value={0}
									  step={0.5}
									  thumbStyle={{height: 10, width: 10,}}
									  trackStyle={{height: 2,}}
									  minimumTrackTintColor={"#ff6600"}
									  maximumTrackTintColor={"#9c9c9c"}
									  thumbTintColor={"#ff6600"}
									  onValueChange={value => this.setState({ QuantityValue: value })}
									/>
								</View>
								<View style={styles.sliderTextHolder}>
									<Text style={styles.slidertext1}>Low</Text>
									<Text style={styles.slidertext2}>Enough</Text>
									<Text style={styles.slidertext3}>A lot</Text>
								</View>
							</View>
						</View>
						
						<TextInput
							underlineColorAndroid={"transparent"}
							style = {styles.inputbox}
							placeholder = 'Add review'
							placeholderTextColor='#878384'
							multiline={true}
							onChangeText={txtReview => this.setState({txtReview})}
                        />
                     
					  
					<TouchableHighlight underlayColor={"rgba(0,0,0,0)"}>
						<Text style = {styles.buttonText} onPress={()=>this.submitDetails()}>Submit</Text>
					</TouchableHighlight>

                    
					
					</View>
					
              </ScrollView>

		</View>
    );
  }
  goBack = () => {
	  this.props.navigation.goBack();
  }
}




const styles = StyleSheet.create({

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
		fontSize: 18,
		flex: 2,
		marginTop: 5,
		fontFamily: 'SourceSansPro-Regular',
	},
  buttonText: {
		height: 40,
		borderColor: "#9c9c9c",
		borderWidth: 1,
		color: "#e3323b",
		marginLeft: 20,
		marginRight: 20,
		borderRadius: 4,
		textAlign: "center",
		paddingTop: 8,
		fontSize: 16,
		marginTop: 10,
	},
	inputbox: {
		fontSize: 15,
		color: '#878384',
		flex: 1,
		height: 65,
		marginTop: 10,
		borderColor : 'grey',
		borderWidth : 1,
		padding : 5,
		textAlignVertical: "top",
		marginLeft: 20,
		marginRight: 20,
		borderRadius: 5,
	},
	backbuttonTouch:{
		marginLeft: 10,
		height: 60,
		width: 50,
	},
  addReviewButtonTouch: {
    position: "absolute",
    height: 20,
    width: 20,
    right: 20,
    top: 13,

  },
  MenuFoodRate1:{
	  marginTop:10,
	  marginLeft:20,
	  marginRight:20,
	  flex:1,
  },
  MenuFoodRate:{
    flex : 1,
    flexDirection : "row",
    marginTop:10,
	marginRight:20,

  },
  MenuFoodRate3:{
    marginTop:10,
	marginRight:20,

  },
  
  RateText:{
    flex : 2,
	marginLeft : 20,
	marginRight:20,
  },
  TitleReview:{
    marginTop:10,
    marginLeft:20,
	marginRight: 20,
  },
  GiveReviewTitle:{
    fontSize: 15,
    fontWeight: 'bold',
  },
  addReviewButton: {
    height: 20,
    width: 20,
  },
	headerleft: {
		height: 20,
		width: 30,
		marginTop: 20,
		marginBottom: 20,
		justifyContent: 'center',
		alignItems:'center',
	},
	headercenter: {
		color: "#ffffff",
		textAlign: "center",
		flex: 1,
		fontSize: 16,
		marginTop: 20,
		fontWeight: 'bold',
		marginRight: 60,
	},
	container: {
		backgroundColor: "#ffffff",
		flex: 1,
	},

	categoryImageView: {
		height: 200,

	},
	categoryImage: {
		flex: 1,
		width: "100%",
		height: "100%",
	},
	footer: {
		flexDirection:'column',
		justifyContent:'flex-end',
		padding: 5,
		backgroundColor: "#ffffff",
		height: 60,
		borderTopWidth: 1,
		borderTopColor: "#c1c1c1",
	},
	insideFooter: {
		flexDirection:'row',
		flex: 4,
	},
	footericonView: {
		justifyContent: 'center',
		alignItems:'center',
		flex: 4,
		padding: 10,
		height: 40,
		width: 40,
		marginTop: 5,
	},
	footericon: {
		height: 40,
		width: 40,
	},
	
	sliderContainer: {
		flex: 1,
		flexDirection: "row", 
		marginTop:10,
	    marginRight:20,
	},
	sliderHolder: {
		flex: 1,
		marginTop: -12,
	},
	
	  sliderStyle: {
		  flex: 2,
		  flexDirection: "column",
	  },
	  sliderSignHolder:{
		  flex: 1, 
		marginTop: -5,
		flexDirection: "row",
	  },
	sliderTextHolder: {
		flex: 1, 
		marginTop: -15,
		flexDirection: "row",
	},
	slidertext1: {
		flex: 1,
		fontSize: 10,
		textAlign: "left",
	},
	slidertext2: {
		flex: 1,
		fontSize: 10,
		textAlign: "center",
	},
	slidertext3: {
		flex: 1,
		fontSize: 10,
		textAlign: "right",
	},
});
