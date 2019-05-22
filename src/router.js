import { StackNavigator } from 'react-navigation';
import Login from './pages/login/index.js';
import Home from './pages/home/index.js';
import Train from './pages/train/index.js';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addListener } from './redux/store';
export const AppNavigator = StackNavigator({
    login: {
        screen: Login,
        navigationOptions: {
            header: null
        }
    },
    home: {
        screen: Home,
        navigationOptions: {
            header: null
        }
    },
    train: {
        screen: Train,
        navigationOptions: {
            header: null
        }
    },
});

class AppWithNavigationState extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        nav: PropTypes.object.isRequired,
    };

    render() {
        const { dispatch, nav } = this.props;
        return (
            <AppNavigator
                navigation={{
                    dispatch,
                    state: nav,
                    addListener,
                }}
            />
        );
    }
}

const mapStateToProps = state => ({
    nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);
