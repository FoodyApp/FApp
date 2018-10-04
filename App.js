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
  Image
} from 'react-native';

import {
    StackNavigator,
	TabNavigator
} from 'react-navigation';

import splashScreen from './screens/splash'
import loginScreen from './screens/login';
import registerScreen from './screens/register';
import forgotPassScreen from './screens/forgotpassword';

import homeScreen from './screens/home';
import myReviewScreen from './screens/myreviewtab';
import restaurantScreen from './screens/restaurants';
import followerScreen from './screens/followers';
import recommendScreen from './screens/recommended';

import itemdetailScreen from './screens/itemdetail';
import restaurantdetailScreen from './screens/restaurantdetail';
import itemRecommendation from './screens/itemrecommendation';

import filter from './screens/filter';
import rest_filter from './screens/filter_rest';
import favorite from './screens/favorite';
import notifications from './screens/notifications';
import menuCategoryScreen from './screens/category';
import mapScreen from './screens/map';
import setting from './screens/setting';
import profile from './screens/profile';
import ChangePassword from './screens/changepassword';
import AddFoodReview from './screens/addfoodreview';
import AddRestReview from './screens/addrestreview';
import ClaimRest from './screens/claimrestaurant';


const Tab = TabNavigator({
	Recommended : {
		screen: recommendScreen,
		navigationOptions: {
			tabBarLabel: "Recommended",
			tabBarIcon: ({ tintColor, focused }) => (
				<Image source={focused ? require('./screens/images/footer/recommended_active.png') : require('./screens/images/footer/recommended.png') } style={{height: 28, width: 28}}/>
			),
		}
	},
	Followers : {
		screen: followerScreen,
		navigationOptions: {
			tabBarLabel: "Followers",
			tabBarIcon: ({ tintColor, focused }) => (
				<Image source={focused ? require('./screens/images/footer/followers_active.png') : require('./screens/images/footer/followers.png') } style={{height: 30, width: 30}}/>
			),
		}
	},
	MyReview : {
		screen: myReviewScreen,
		navigationOptions: {
			tabBarLabel: "Reviews",
			tabBarIcon: ({ tintColor, focused }) => (
				<Image source={focused ? require('./screens/images/footer/review_active.png') : require('./screens/images/footer/review.png') } style={{height: 30, width: 30}}/>
			),
		}
	},
	Restaurants : {
		screen: restaurantScreen,
		navigationOptions: {
			tabBarLabel: "Restaurants",
			tabBarIcon: ({ tintColor, focused }) => (
				<Image source={focused ? require('./screens/images/footer/restaurant_active.png') : require('./screens/images/footer/restaurant.png') } style={{height: 30, width: 30}}/>
			),
		}
	},
	Home : {
		screen: homeScreen,
		navigationOptions: {
			tabBarLabel: "Dishes",
			tabBarIcon: ({ tintColor, focused }) => (
				<Image source={focused ? require('./screens/images/footer/food_active.png') : require('./screens/images/footer/food.png') } style={{height: 30, width: 30}}/>
			),
		}
	}
}, {
	initialRouteName: "Home",
	tabBarPosition: 'bottom',
	animationEnabled: false,
	swipeEnabled : false,
	tabBarOptions: {
		activeTintColor: '#e3323b',
		inactiveTintColor: '#919191',
		showLabel: true,
		showIcon: true,
		upperCaseLabel: false,
		indicatorStyle: {
			backgroundColor: '#e3323b'
		},
		labelStyle: {
			fontSize: 9,
			padding: 0,
			margin: 0,
		},
		style: {
			backgroundColor: '#ffffff',
			borderTopWidth: 1,
			borderTopColor: '#919191',
		},
	},
});


const Nav = StackNavigator({
	Splash : {screen: splashScreen},
	Login : {screen: loginScreen},
	Register : {screen: registerScreen},
	ForgotPassword : {screen: forgotPassScreen},
	HomeTab : {	screen: Tab	},
	itemdetailScreen : { screen: itemdetailScreen },
	restaurantdetailScreen : { screen: restaurantdetailScreen },
	favorite : { screen: favorite },
	notifications : { screen: notifications },
	filter : { screen: filter },
	rest_filter : { screen: rest_filter },
	menuCategoryScreen : { screen: menuCategoryScreen },
	mapScreen : { screen: mapScreen },
	itemRecommendation : { screen: itemRecommendation },
	setting : { screen: setting },
	profile : { screen: profile },
	ChangePassword : { screen:  ChangePassword },
	AddFoodReview : { screen:  AddFoodReview },
	AddRestReview : { screen:  AddRestReview },
	ClaimRest : { screen:  ClaimRest },
}, {
  headerMode: 'none',
});

export default class FApp extends Component {
  render() {
    return (
      <Nav/>
    );
  }
}
