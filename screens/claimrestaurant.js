 /* Sample React Native App
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
  ActivityIndicator,
	NetInfo,
} from 'react-native';


//import PushNotification from 'react-native-push-notification';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import PhotoUpload from 'react-native-photo-upload';

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
			txtRestaurantAddress:"",
			txtContactNumber:"",
			txtRestaurantEmail:"",
			txtRestaurantClaim:"",
			selectedImages: [],
			imageArray: [],
			addButtonIcon : require('./images/detail/addButton.png'),
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
		
		var txtRestaurantAddress = this.state.txtRestaurantAddress;
		var txtContactNumber = this.state.txtContactNumber;
		var txtRestaurantEmail = this.state.txtRestaurantEmail;
		var txtRestaurantClaim = this.state.txtRestaurantClaim;
		
		
		fetch(baseURL+"addRestaurantReviewRating", {
		  method: "POST",
		  headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': token,
		  },
		  body: JSON.stringify({
			user_id: userId,
			restaurant_id: restId,
			address: txtRestaurantAddress,
			contact_number: txtContactNumber,
			email_id: txtRestaurantEmail,
			description: txtRestaurantClaim,
			menu_image: this.state.selectedImages
		  })
		})
		.then((response) => response.json())
		.then((responseData) => {
			this.setState({ isLoading: false });
			if(responseData.status == "success")
			{
				alert("Claimed Successfully");
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
   let that = this;
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
				<Text style={styles.headerText}>CLAIM RESTAURANT</Text>
			</View>

			<ScrollView keyboardShouldPersistTaps="always">
			<View style={styles.claimContent}>

        <View style={styles.textinputborder}>
        <TextInput
        underlineColorAndroid={"transparent"}
        onChangeText={txtRestaurantAddress => this.setState({txtRestaurantAddress})}
        value={this.state.txtRestaurantAddress}
        style = {styles.inputbox}
        placeholder = 'Address'
        placeholderTextColor='#878384'
        />
        </View>
        <View style={styles.textinputborder}>

        <TextInput
		keyboardType={'phone-pad'}
        underlineColorAndroid={"transparent"}
        onChangeText={txtContactNumber => this.setState({txtContactNumber})}
        //value={this.state.txtEmail}
        style = {styles.inputbox}
        placeholder = 'Contact Phone Number'
        placeholderTextColor='#878384'
        />
        </View>
        <View style={styles.textinputborder}>
        <TextInput
        underlineColorAndroid={"transparent"}
        onChangeText={txtRestaurantEmail => this.setState({txtRestaurantEmail})}
        //value={this.state.txtEmail}
        style = {styles.inputbox}
        placeholder = 'Email Address'
        placeholderTextColor='#878384'
        />
        </View>
        <View style={styles.textinputborder}>
        <TextInput
        underlineColorAndroid={"transparent"}
        onChangeText={txtRestaurantClaim => this.setState({txtRestaurantClaim})}
        //value={this.state.txtEmail}
        style = {styles.inputbox}
        placeholder = 'What do you do at the restaurant?'
        placeholderTextColor='#878384'
        />
        </View>

        <View style={styles.addPhotoOptions} key={17}>
			<View style={styles.addPhotoTitle} key={107}>
				<Text style={styles.addPhotoText}>Add restaurant menu picture</Text>
			</View>
			<View style={styles.addPhotoButton} key={108}>
				<PhotoUpload
				style={styles.addButtonCover}
				onPhotoSelect={avatar => {
				  if(avatar){
					// this.setState({AvtarState:avatar});
					this.setState({imageArray: [] });
					selectedImages: that.state.selectedImages.push("data:image/jpeg;base64,"+avatar);
					for(i=0;i<this.state.selectedImages.length;i++)
					{
						this.setState({imageArray: this.state.imageArray.concat([
							<Image
							  key={i}
							  source={{ uri: this.state.selectedImages[i] }}
							  style={styles.detailPhotos}></Image>
							])
						});
					}
					this.setState({addButtonIcon : require('./images/detail/addButton.png')});
				  }
				 }}
				>
					<Text style={styles.addButtonStyle}> + </Text>
				</PhotoUpload>
			</View>
        </View>
        <View style={styles.detailPhotosView} key={18}>
          <ScrollView horizontal={true} key={19}>
           {that.state.imageArray}
          </ScrollView>
        </View>
        <View style={styles.claimbuttonview} key={41}>
          <TouchableHighlight
			underlayColor={"rgba(0,0,0,0)"}
			onPress={()=>this.submitDetails()}
			style = {styles.button}>
          <Text style = {styles.buttonText}>Claim now</Text>
        </TouchableHighlight>
      </View>
		</View>
      </ScrollView>

		</View>
    );
  }
  goBack = () => {
	  this.props.navigation.goBack(null);
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
		fontSize: 20,
		flex: 2,
		color: "#9c9c9c",
		marginTop: 4,
		fontFamily: 'SourceSansPro-Regular',
	},
	claimContent: {
		marginTop: 20,
	},
	button:{
		height: 40,
		width: "100%",
		borderColor: "#9c9c9c",
		borderWidth: 1,
		borderRadius: 5,
		marginTop: 10,
		marginLeft: 20,
		marginRight: 20,
		alignSelf:'center',
	},
	buttonText: {
		color: '#e3323b',
		justifyContent:'center',
		fontSize: 15,
		textAlign: 'center',
		paddingTop: 10,
		marginLeft: 20,
		marginRight: 20,
	},
  inputbox: {
		fontSize: 15,
		color: '#878384',
		width: "100%",
		height: 100,
		marginTop: 10,
    borderColor : 'grey',
    borderWidth : 1,
    padding : 5,
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
  marginLeft:10,
  marginRight:10,
  flex:1,
  },
  MenuFoodRate:{
    flex : 1,
    flexDirection : "row",
    marginTop:10,

  },
  claimbuttonview:{
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  RateText:{
    flex : 2,
  marginLeft : 10,
  },
  TitleReview:{
    marginTop:10,
    marginLeft:5,
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

  inputbox: {
    fontSize: 15,
    color: '#878384',
    width: 300,
    height: 40,
    marginTop: 0,
  },
  textinputborder:{
    borderBottomWidth: 1,
    borderBottomColor: '#c1c1c1',
    marginRight:20,
    marginLeft:20,
  },

  addPhotoOptions: {
    flex: 1,
    flexDirection:'row',
    marginTop: 10,
	marginLeft: 20,
	marginRight: 20,
	marginBottom: 10,
	paddingBottom: 10,
	paddingLeft: 5,
	borderBottomWidth: 1,
	borderBottomColor: "#c1c1c1",
  },
   addPhotoTitle: {
	   flex: 2,
	   justifyContent: "flex-start",
   },
   addPhotoText: {
	   fontSize: 16,
   },
   addButtonStyle: {
	   fontSize: 16,
   },
  detailPhotosView: {
		flexDirection: "row",
		marginLeft: 20,
		marginRight: 20,
	},
  detailPhotos: {
		flex: 1,
		width: 80,
		height: 80,
		marginRight: 10,
	},

});
