/**
 * @name: Index
 * @author: LIULIU
 * @date: 2020-07-14 14:50
 * @description：Index
 * @update: 2020-07-14 14:50
 */
import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableWithoutFeedback, Image} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'
import {Actions} from 'react-native-router-flux'
import Sospng from '../../images/SOS.png'
import Voicepng from '../../images/voice.png'
export default class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View style={styles.container}>
                {/*<TouchableWithoutFeedback onPress={Actions.pop}>*/}
                {/*    <View style={styles.navbar}>*/}
                {/*        <AntDesign name="left" size={25}></AntDesign>*/}
                {/*        <Text style={styles.navbarText}>返回</Text>*/}
                {/*    </View>*/}
                {/*</TouchableWithoutFeedback>*/}
                <View style={styles.notice}>
                    <Text style={styles.noticeText}>紧急求助通道</Text>
                    <Text style={styles.noticeText}>请谨慎使用</Text>
                </View>
                <View style={styles.imagesButton}>
                    <Image
                        style={styles.imgone}
                        source={Voicepng}
                    />
                    <Image
                        style={styles.imgtwo}
                        source={Sospng}
                    />
                    <Image
                        style={styles.imgthree}
                        source={Voicepng}
                    />
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create(
    {
        container: {
            marginTop: 50,
            flex: 1,
        },
        navbar: {
            paddingLeft: 15,
            paddingRight: 15,
            flexDirection: 'row',
            alignItems: 'center'
        },
        navbarText: {
            fontSize: 18,
            marginLeft: 5
        },
        notice: {
            marginTop: 80,
            justifyContent:'center',
            textAlign:'center'
        },
        noticeText: {
            fontSize: 20,
            textAlign:'center',
            lineHeight: 30
        },
        imagesButton: {
            flexDirection: 'row',
            justifyContent:'center',
            marginTop: 180
        },
        imgone: {
            // flex:1,
            width:120,
            height:120,
            transform:[{rotate: "180deg" }]
        },
        imgtwo: {
            // flex:1,
            width:120,
            height:120,
            marginLeft:10,
            marginRight:10
        },
        imgthree: {
            // flex:1,
            width:120,
            height:120,}
    });
