import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { COLOR, SCALE2 } from '../utils'
export default class FixedWidthImage extends React.Component {
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            height: 0,
        };
    }

    componentDidMount() {
        Image.getSize( this.props.imageUrl, (width, height) => {
            height = this.props.width * height / width; //按照屏幕宽度进行等比缩放
            console.log('height', height);
            this.setState({ height });
        });
    }

    render() {
        return (
            <Image style={[{ width: this.props.width, height: this.state.height }]}
                // source={{ uri: 'http://gss0.bdstatic.com/5foIcy0a2gI2n2jgoY3K/static/fisp_static/common/img/sidebar/report_02cdef2.png' }} />
                source={{ uri: this.props.imageUrl }} />
        )

    }

}