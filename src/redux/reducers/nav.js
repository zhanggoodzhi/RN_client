import * as constent from '../constent';
import {
    createStackNavigator,
    NavigationActions
} from 'react-navigation';
import {
    createNavigationReducer,
} from 'react-navigation-redux-helpers';
import { AppNavigator } from '../../router';
const navReducer = createNavigationReducer(AppNavigator);
export default navReducer;