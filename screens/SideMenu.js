/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import PropTypes from 'prop-types';
import React, {Component} from 'react';

import styles from './SideMenu.style';

import {NavigationActions} from 'react-navigation';
import {
	ScrollView,
	Text,
	View,
	Image,
	AsyncStorage,
} from 'react-native';

export default function Menu({onItemSelected }) {
    return (
      <View style={styles.container}>
        <ScrollView>
			<View>
				<View style={styles.profile}>
					<Image source={ user_profile_pic != "" ?
						{ uri: imagebaseProfileURL+user_profile_pic } :
						{ uri: imagebaseProfileURL+"default.png" }
					} style={styles.profileImage}></Image>
					<Text style={styles.profileName} onPress={ ()=> isalreadylogin == true ? onItemSelected('profile') : alert("Please login for perform the action")}>{username == "" ? "No User" : username}</Text>
				</View>
				<View style={styles.menuList}>
					<Image source={require('./images/sidemenu/menu_bookmark.png')} style={styles.menuIcon}></Image>
					<Text style={styles.menuName} onPress={ () => onItemSelected('favorite') }>To try list</Text>
				</View>
				<View style={styles.menuList}>
					<Image source={require('./images/sidemenu/menu_notification.png')} style={styles.menuIcon}></Image>
					<Text style={styles.menuName} onPress={ () => onItemSelected('notifications') }>Notifications</Text>
				</View>
				<View style={styles.menuList}>
					<Image source={require('./images/sidemenu/menu_setting.png')} style={styles.menuIcon}></Image>
					<Text style={styles.menuName} onPress={ () => isalreadylogin == true ? onItemSelected('setting') : alert("Please login for perform the action") }>Settings</Text>
				</View>
			</View>
        </ScrollView>
		<View style={styles.footerContainer}>
			<Image source={require('./images/sidemenu/menu_logout.png')} style={styles.menuIcon}></Image>
		  	<Text style={styles.menuName} onPress={ () => onItemSelected('Login')} >{isalreadylogin == true ? "Log Out" : "Login"}</Text>
        </View>
      </View>
    );
}

Menu.propTypes = {
  onItemSelected: PropTypes.func.isRequired,
};
