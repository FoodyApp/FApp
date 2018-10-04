import homeScreen from './home';
import SideMenu from './SideMenu';
import filterScreen from './filter';
import favoriteScreen from './favorite';
import notificationScreen from './notifications';
import itemdetailScreen from './itemdetail';
import restaurantdetailScreen from './restaurantdetail';
import menuCategoryScreen from './category';

import {DrawerNavigator} from 'react-navigation';

export default DrawerNavigator({
  Home: {
    screen: homeScreen,
	navigationOptions: {
		drawerLockMode: 'locked-closed'
	},
  },
  filterScreen: {
    screen: filterScreen,
	navigationOptions: {
		drawerLockMode: 'locked-closed'
	},
  },
  favoriteScreen: {
    screen: favoriteScreen,
	navigationOptions: {
		drawerLockMode: 'locked-closed'
	},
  },
  notificationScreen: {
    screen: notificationScreen,
	navigationOptions: {
		drawerLockMode: 'locked-closed'
	},
  },
  itemdetailScreen: {
    screen: itemdetailScreen,
	navigationOptions: {
		drawerLockMode: 'locked-closed'
	},
  },
  restaurantdetailScreen: {
    screen: restaurantdetailScreen,
	navigationOptions: {
		drawerLockMode: 'locked-closed'
	},
  },
  menuCategoryScreen: {
    screen: menuCategoryScreen,
	navigationOptions: {
		drawerLockMode: 'locked-closed'
	},
  },
},
{
  contentComponent: SideMenu,
  drawerWidth: 300,
});
