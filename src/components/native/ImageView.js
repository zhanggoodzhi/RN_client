import { PropTypes } from 'prop-types';
import { requireNativeComponent, View } from 'react-native';
var iface = {
    name: 'ImageView',
    propTypes: {
        color: PropTypes.double,
        radius: PropTypes.number,
        ...View.propTypes // 包含默认的View的属性
    },
};

module.exports = requireNativeComponent('MyCustomView', iface);