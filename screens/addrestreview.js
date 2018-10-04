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
  ActivityIndicator,
    Platform,
	NetInfo,
} from 'react-native';

//import PushNotification from 'react-native-push-notification';
import { StackNavigator } from 'react-navigation';
import FitImage from 'react-native-fit-image';
import Rating from 'react-native-rating'
import './global.js';

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
			MenuOverallfood : 0,
			Service : 0,
			cleanness : 0,
			ambiance : 0,
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
		var restId = state.params.restId;

		const userId = await AsyncStorage.getItem('userId');
		const token = await AsyncStorage.getItem('token');

		var MenuOverallfood = this.state.MenuOverallfood;
		var Service = this.state.Service;
		var cleanness = this.state.cleanness;
		var ambiance = this.state.ambiance;
		var review = this.state.txtReview;

		fetch(baseURL+"addRestaurantReviewRating", {
		  method: "POST",
		  headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': token,
		  },
		  body: JSON.stringify({
			restaurant_id: restId,
			user_id: userId,
			service_star: Service,
			cleanliness_bathroom_star: cleanness,
			ambiance_star: ambiance,
			restaurant_review_write_up: review,
			menu_food_star: MenuOverallfood,
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
			else if(responseData.status == "logout")
			{
				alert(responseData.error);
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


   render() {

   const { navigate } = this.props.navigation;

    return (
		<View style={styles.container}>
			<View style={styles.activityIndicatorView}>
			  {
				this.state.isLoading ?  <ActivityIndicator size="large" style={{padding: 60}}/> : null
			  }
			</View>
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
            <Text style={styles.GiveReviewTitle}>Restaurant Rating</Text>
          </View>

      <View style={styles.MenuFoodRate} key={22}>
            <Text style={styles.RateText}>Menu Overall Food</Text>
            <Rating
              max={5}
              // initial={dataResponse.data[i].menu_food_star}
              onChange={rating => this.setState({MenuOverallfood: rating})}
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
                <Text style={styles.RateText}>Service</Text>
                <Rating
                  max={5}
                //  initial={dataResponse.data[i].menu_food_star}
                    onChange={rating => this.setState({Service: rating})}
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

              <View style={styles.MenuFoodRate} key={24}>
                    <Text style={styles.RateText}>Cleanliness</Text>
                    <Rating
    								  max={5}
    								//  initial={dataResponse.data[i].menu_food_star}
                    onChange={rating => this.setState({cleanness: rating})}
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

                  <View style={styles.MenuFoodRate} key={25}>
                        <Text style={styles.RateText}>Ambiance</Text>
                        <Rating
							max={5}
							//initial={dataResponse.data[i].menu_food_star}
							onChange={rating => this.setState({ambiance: rating})}
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


						<TextInput
							underlineColorAndroid={"transparent"}
							style = {styles.inputbox}
							placeholder = 'Add review'
							placeholderTextColor='#878384'
							multiline={true}
							onChangeText={txtReview => this.setState({txtReview})}
                        />

						<TouchableHighlight
							underlayColor={"rgba(0,0,0,0)"}
							style = {styles.button}
							onPress={()=>this.submitDetails()}>
								<Text style = {styles.buttonText}>Submit</Text>
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
		fontSize: 17,
		marginTop: 10,
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

});
