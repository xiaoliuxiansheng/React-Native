/**
 * @name: Home
 * @author: LIULIU
 * @date: 2020-07-10 16:58
 * @description：Home
 * @update: 2020-07-10 16:58
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
    TextInput,
    Dimensions,
    ScrollView,
    SafeAreaView,
    NativeModules,
    StatusBar
} from 'react-native'
import AntDesign from "react-native-vector-icons/AntDesign"
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Entypo from 'react-native-vector-icons/Entypo'
import Feather from 'react-native-vector-icons/Feather'
import Fontisto from 'react-native-vector-icons/Fontisto'
import Foundation from 'react-native-vector-icons/Foundation'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {Drawer, Theme} from 'teaset'
import AllModules from './modulars/Index.js'
import {Actions} from 'react-native-router-flux'
import {observer, inject} from 'mobx-react';
import {Drawer as DrawerAnt} from '@ant-design/react-native';
import MapLinking from 'react-native-map-linking';
import AsyncStorage from '@react-native-community/async-storage';
import Storage from 'react-native-storage';
import SplashScreen from 'react-native-splash-screen'
const { StatusBarManager } = NativeModules;

@inject("homeStore")
@observer
export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            travelType: 1,
            datetime: '',
            destination: '',//终点
            destinationLocation: '',
            departure: '', //起始地址
            departureLocation: '',//起点地址经纬度
            localDate: new Date().toLocaleString().replace(/\//g, "-").replace('上午').replace('下午', ''),
            tabType: [
                {
                    name: '普通服务',
                    icon: 'torso-business',
                },
                {
                    name: '残疾人服务',
                    icon: 'torso-business',
                },
                {
                    name: '女性服务',
                    icon: 'torso-business',
                },
                {
                    name: '儿童服务',
                    icon: 'torso-business',
                },
                {
                    name: '商务服务',
                    icon: 'torso-business',
                },
                {
                    name: '购物服务',
                    icon: 'torso-business',
                },
                {
                    name: '主题服务',
                    icon: 'torso-business',
                },
                {
                    name: 'VIP服务',
                    icon: 'torso-business',
                },
                {
                    name: '观光旅游服务',
                    icon: 'torso-business',
                },
                {
                    name: '物流服务',
                    icon: 'torso-business',
                },
                {
                    name: '国际服务',
                    icon: 'torso-business',
                },
                {
                    name: '敬请期待',
                    icon: 'torso-business',
                }
            ],
            searchItem: '',
            searchName: '',
            searchData: [],
            locationType: 1, // 1为出发类型 2为目的地
            inputText: ''
        };
    }

    componentDidMount() {
        SplashScreen.hide()
        // this.handelGetamapData()
    }

    handleSetTab = (index) => {
        const {handleSaveTab, defineTab} = this.props.homeStore
        if (defineTab !== index) {
            handleSaveTab(index)
        }
        if (this.DrawerTop) {
            this.DrawerTop.close()
        }
    }
    // 取消搜索地址框
    cancelSearch = () => {
        this.drawerant.closeDrawer()
    }
    // 选择对应地址
    handleSelectItem = async (item) => {
        this.drawerant.closeDrawer()
        if (this.state.locationType === 1) {
            this.setState({
                departure: item.name,
                departureLocation: item.location
            })
        } else {
            this.setState({
                destination: item.name,
                destinationLocation: item.location
            })
        }
        // 设置本地缓存 存储输入地址历史
        item.isSelected = true
        let storage = await this.getMyObject() !== null ? await this.getMyObject() :[]
        // 倒序 数据长度最多5
        storage.unshift(item)
        if (storage.length > 5) storage.length = 5
        await this.setObjectValue(storage)
    }
    // 打开位置搜索框
    handelSearchPlace = async (type) => {
        if (+type === 1) {
            this.setState({
                locationType: 1,
                searchName: this.state.departure
            })
            if (this.state.departure !== '') {
                this.setState({})
            } else {
                const {defineDestination} = this.props.homeStore
                await this.setState({
                    searchName: defineDestination.formatted_address
                })
            }
        } else {
            this.setState({
                locationType: 2,
                searchName: this.state.destination
            })
        }
        await this.handelGetamapData()
        this.drawerant.openDrawer()
    }
    // 打开选择框
    handleOpenTab = (bole) => {
        let statusBarHeight;
        if (Platform.OS === "ios") {
            StatusBarManager.getHeight(height => {
                statusBarHeight = height;
            });
        } else {
            statusBarHeight = StatusBar.currentHeight;
        }
        let view = (
            <SafeAreaView
                style={[{ paddingTop: statusBarHeight}]}
            >
            <View style={[{backgroundColor: Theme.defaultColor}]}>
                <View style={styles.container}>
                    <TouchableWithoutFeedback onPress={this.openDrawer}>
                        <Feather name="user" size={28} color="black" style={styles.person}/>
                    </TouchableWithoutFeedback>
                    <Text style={styles.city}>北京市</Text>
                    <AntDesign name='message1' size={28} color="black" style={styles.message}></AntDesign>
                </View>
                <View style={styles.drawerBoxTitle}>
                    <Text style={styles.drawerBoxTitleText}>全部服务</Text>
                    <TouchableWithoutFeedback onPress={this.handleOpenTab.bind(this, false)}>
                        <AntDesign name='close' size={22} style={styles.drawerBoxClose}></AntDesign>
                    </TouchableWithoutFeedback>
                </View>
                <View style={styles.drawerBoxMoudal}>
                    {
                        this.state.tabType.map((item, index) => {
                            return (
                                <TouchableWithoutFeedback onPress={this.handleSetTab.bind(this, index + 1)}>
                                    <View
                                        key={index}
                                        style={[styles.drawerBoxMoudalItem, {width: Dimensions.get('window').width / 3}]}>
                                        <Foundation name={item.icon} size={30}
                                                    style={styles.drawerBoxIcon}></Foundation>
                                        <Text style={styles.drawerBoxText}>{item.name}</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            )
                        })
                    }
                </View>
            </View>
            </SafeAreaView>
        )
        if (bole) {
            this.DrawerTop = Drawer.open(view, 'top');
        } else {
            this.DrawerTop.close()
        }
    }
    openDrawer = () => {
        let view = (
            <View style={[styles.drawerBox]}>
                <View style={styles.drawerBoxContent}>
                    <FontAwesome name="user-circle" size={30} style={styles.drawerBoxIcon}></FontAwesome>
                    <Text style={styles.drawerBoxText}>刘柳</Text>
                </View>
                <View style={{backgroundColor: Theme.defaultColor}}>
                    <View style={styles.drawerBoxContent} marginTop={50}>
                        <Fontisto name="person" size={25} style={styles.drawerBoxIcon}></Fontisto>
                        <Text style={styles.drawerBoxText}>个人信息</Text>
                    </View>
                    <View style={styles.drawerBoxContent}>
                        <FontAwesome5 name="tasks" size={25} style={styles.drawerBoxIcon}></FontAwesome5>
                        <Text style={styles.drawerBoxText}>我的订单</Text>
                    </View>
                    <View style={styles.drawerBoxContent}>
                        <Entypo name="wallet" size={25} style={styles.drawerBoxIcon}></Entypo>
                        <Text style={styles.drawerBoxText}>我的钱包</Text>
                    </View>
                    <View style={styles.drawerBoxContent}>
                        <FontAwesome name="envelope-square" size={25} style={styles.drawerBoxIcon}></FontAwesome>
                        <Text style={styles.drawerBoxText}>月租套餐</Text>
                    </View>
                    <View style={styles.drawerBoxContent}>
                        <AntDesign name="Safety" size={25} style={styles.drawerBoxIcon}></AntDesign>
                        <Text style={styles.drawerBoxText}>安全</Text>
                    </View>
                    <View style={styles.drawerBoxContent}>
                        <Fontisto name="player-settings" size={25} style={styles.drawerBoxIcon}></Fontisto>
                        <Text style={styles.drawerBoxText}>设置</Text>
                    </View>
                </View>
            </View>
        );
        Drawer.open(view, 'left');
    }
    // 设置出行类型
    handleType = (type) => {
        this.setState({
            travelType: type
        })
    }
    // 记录input的值
    onChangeText = (text) => {
        this.setState({
            searchName: text
        })
        this.DEBOUNCE(this.handelGetamapData(), 1000)
    }
    // 输入地址搜索时 防抖
    DEBOUNCE = (fn, wait) => {
        let timeout = null;
        return function () {
            if (timeout !== null) clearTimeout(timeout);
            timeout = setTimeout(fn, wait);
        }
    }
    // 读取缓存数据
    getMyObject = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('InputAddressStorage')
            return jsonValue != null ? JSON.parse(jsonValue) : null
        } catch(e) {
            // read error
        }
    }
    // 保存缓存数据
    setObjectValue = async (value) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem('InputAddressStorage', jsonValue)
        } catch(e) {
            // save error
        }
    }
    // 获取地址信息以供选择
    handelGetamapData = async () => {
        const {amapDataUrl, amapkey} = this.props.homeStore
        // 获取之前本地存储的历史记录
        let storage = await this.getMyObject() !== null ? await this.getMyObject():[]
        let data = [...storage]
        fetch(`${amapDataUrl}?keywords=${this.state.searchName}&offset=20&key=${amapkey}&extensions=all&page=1`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => response.json())
            .then((json) => {
                data.push(...json.pois)
                this.setState({
                    searchData: data
                })
            }).catch((err) => console.log(err)).finally(() => console.log('finally'))
    }
    // 跳转app
    handleLinkapp = () => {
        if (this.state.departureLocation && this.state.destinationLocation) {
            let one = this.state.departureLocation.split(',')
            let two = this.state.destinationLocation.split(',')
            MapLinking.planRoute({lat: one[1], lng: one[0], title: '起点'}, {
                lat: two[1],
                lng: two[0],
                title: '终点'
            }, 'walk');
        }
    }
    // 获取两点间的距离
    handelGetamapDistance = async () => {
        await fetch('https://restapi.amap.com/v3/direction/walking', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'origin=116.434307,39.90909&destination=116.434446,39.90816&key=7ca1e96fcbc6e4c4467518e956d5242e'
        }).then((response) => response.json())
            .then((json) => {
                this.setState({
                    searchDistance: json
                })
            }).catch((err) => console.log(err)).finally(() => console.log('finally'))
    }

    render() {
        const {defineTab, defineDestination} = this.props.homeStore
        const sidebar = (
            <View style={styles.searchplace}>
                <View style={styles.searchviewTitle}>
                    <TextInput
                        style={[styles.searchviewsearch]}
                        onChangeText={text => this.onChangeText(text)}
                        placeholder={+this.state.locationType === 1 ? '请输入起点' : '请输入终点'}
                        defaultValue={this.state.searchName}
                        allowFontScaling={false}
                        multiline={false}
                    />
                    <TouchableWithoutFeedback onPress={this.cancelSearch}>
                        <Text style={styles.searchviewsearchtext}>取消</Text>
                    </TouchableWithoutFeedback>
                </View>
                {
                    <ScrollView style={styles.searchItemList}>
                        {
                            this.state.searchData.map((item, index) => {
                                return (
                                    <TouchableWithoutFeedback onPress={this.handleSelectItem.bind(this, item)}>
                                        <View style={styles.searchItem}>
                                            <View style={styles.searchItemLeft}>
                                                {
                                                    item.isSelected && <Fontisto name='history' size={10}></Fontisto>
                                                }
                                                {
                                                    !item.isSelected && <Ionicons name='ios-location' size={10}></Ionicons>

                                                }
                                            </View>
                                            <View style={styles.searchItemRight}>
                                                <Text style={styles.searchItemname}>
                                                    {item.name}
                                                </Text>
                                                <Text style={styles.searchItemaddress}>
                                                    {item.adname} {item.address}
                                                </Text>
                                            </View>
                                        </View>
                                    </TouchableWithoutFeedback>
                                )
                            })
                        }
                    </ScrollView>

                }
            </View>
        );
        let statusBarHeight;
        if (Platform.OS === "ios") {
            StatusBarManager.getHeight(height => {
                statusBarHeight = height;
            });
        } else {
            statusBarHeight = StatusBar.currentHeight;
        }
        return (
            // 对安卓IOS刘海屏、异形屏 进行适配
            <SafeAreaView
                style={[{ marginTop: statusBarHeight,flex:1 }]}
            >
            <DrawerAnt
                sidebar={sidebar}
                position="enum{'left'"
                open={false}
                drawerRef={el => (this.drawerant = el)}
                drawerBackgroundColor="#fff"
                drawerWidth={Dimensions.get('window').width / 5 * 4}
            >
                <View style={{flex: 1}}>
                    <View style={styles.container}>
                        <TouchableWithoutFeedback onPress={this.openDrawer}>
                            <Feather name="user" size={28} color="black" style={styles.person}/>
                        </TouchableWithoutFeedback>
                        {
                            defineDestination && defineDestination.addressComponent &&
                            <Text style={styles.city}>{defineDestination.addressComponent.province}</Text>
                        }
                        <AntDesign name='message1' size={28} color="black" style={styles.message}></AntDesign>
                    </View>
                    <View style={styles.menu}>
                        {
                            this.state.tabType.map((item, index) => {
                                return (
                                    index < 4 &&
                                    <TouchableWithoutFeedback onPress={this.handleSetTab.bind(this, index + 1)}>
                                        <Text
                                            key={index}
                                            style={[styles.scrooltab, {color: defineTab === index + 1 ? 'rgb(255, 198, 69)' : 'rgba(53, 54, 55, 1.000)'}]}>{item.name}</Text>
                                    </TouchableWithoutFeedback>
                                )
                            })
                        }
                        <TouchableWithoutFeedback onPress={this.handleOpenTab.bind(this, true)}>
                            <Entypo name='grid' size={32} color="black" style={styles.modals}></Entypo>
                            {/*<Text style={styles.modals}>ASDAS</Text>*/}
                        </TouchableWithoutFeedback>
                    </View>
                    <AllModules selectTab={defineTab}></AllModules>
                    <View style={[styles.InputAddress]}>
                        <View style={styles.InputAddressHead}>
                            <TouchableWithoutFeedback onPress={this.handleType.bind(this, 1)}>
                                <Text
                                    style={[styles.InputAddressText, {color: this.state.travelType === 1 ? 'rgb(255, 198, 69)' : 'rgba(53, 54, 55, 1.000)'}]}>现在</Text>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={this.handleType.bind(this, 2)}>
                                <Text
                                    style={[styles.InputAddressText, {color: this.state.travelType === 2 ? 'rgb(255, 198, 69)' : 'rgba(53, 54, 55, 1.000)'}]}>预约</Text>
                            </TouchableWithoutFeedback>
                        </View>
                        {
                            this.state.travelType === 1 &&
                            <View style={styles.InputAddressBody}>
                                <View style={styles.InputAddressBodyLeft}>
                                    <View style={styles.textInputBox}>
                                        <View
                                            style={[styles.textInputSpot, {backgroundColor: 'rgba(11, 155, 116, 1.000)'}]}></View>
                                        <TouchableWithoutFeedback onPress={this.handelSearchPlace.bind(this, 1)}>
                                            <Text
                                                style={[styles.textInput, {color: this.state.departure.length === 0 ? '#ddd' : 'rgba(53, 54, 55, 1.000)'}]}>
                                                {this.state.departure || '请输入出发地'}
                                            </Text>
                                        </TouchableWithoutFeedback>
                                    </View>
                                    <View style={styles.textInputBox}>
                                        <View
                                            style={[styles.textInputSpot, {backgroundColor: 'rgba(233,194,51,1.000)'}]}></View>
                                        <TouchableWithoutFeedback onPress={this.handelSearchPlace.bind(this, 2)}>
                                            <Text
                                                style={[styles.textInput, {color: this.state.destination.length === 0 ? '#ddd' : 'rgba(53, 54, 55, 1.000)'}]}>
                                                {this.state.destination || '请输入目的地'}
                                            </Text>
                                        </TouchableWithoutFeedback>
                                    </View>
                                </View>
                                <View style={styles.InputAddressBodyRight}>
                                    <View
                                        style={[styles.InputAddressBodyRightBox, {backgroundColor: this.state.destination === '' || this.state.departure === '' ? '#eee' : 'rgba(30, 143, 245, 1.000)'}]}>
                                        <TouchableWithoutFeedback onPress={this.handleLinkapp}>
                                            <MaterialCommunityIcons name="navigation" size={20} color='#fff'
                                            ></MaterialCommunityIcons>
                                        </TouchableWithoutFeedback>
                                    </View>
                                </View>
                            </View>
                        }
                    </View>
                    <TouchableWithoutFeedback onPress={() => Actions.push('needhelp')}>
                        <View style={styles.needHelp}>
                            <View style={styles.needHelpIcon}>
                                <Text style={styles.needHelpText}>SOS</Text>
                            </View>
                            <Text style={styles.needHelpText}>紧急求助</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </DrawerAnt>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    content: {
        position: 'relative'
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 50
    },
    person: {
        left: 15,
        flex: 1,
    },
    message: {
        flex: 1,
        textAlign: 'right',
        right: 15
    },
    city: {
        flex: 1,
        textAlign: 'center',
    },
    menu: {
        flexDirection: 'row',
        marginTop:0,
        paddingTop:0,
        height:50
    },
    scrooltab: {
        flex: 1,
        textAlign: 'center'
    },
    modals: {
        flex: .5,
        textAlign: 'center',
        paddingTop:0,
        marginTop:0
    },
    drawerBox: {
        flex: 1,
        alignItems: 'center',
        top: 80
    },
    drawerBoxContent: {
        width: 250,
        flexDirection: 'row',
        alignItems: 'center',
        textAlign: 'center',
        marginTop: 25
    },
    drawerBoxIcon: {
        marginRight: 10,
        marginLeft: 20
    },
    drawerBoxText: {
        marginLeft: 10
    },
    needHelp: {
        position: 'absolute',
        right: 30,
        bottom: 0,
        top: 150,
        height: 50,
        flexDirection: 'column',
        alignItems: 'center',
    },
    needHelpIcon: {
        height: 26, //窗口高度
        width: 26,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    needHelpText: {
        fontSize: 10
    },
    InputAddress: {
        backgroundColor: '#fff',
        position: 'absolute',
        right: 40,
        left: 40,
        bottom: 40,
        height: 180, //窗口高度
        borderRadius: 20
    },
    InputAddressHead: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    InputAddressText: {
        flex: 1,
        textAlign: 'center',
        marginBottom: 20
    },
    textInput: {
        flex: 8,
        marginLeft: 20,
        marginRight: 20,
        height: 40,
        lineHeight: 40,
        padding: 0,
        borderWidth: 0
    },
    dateTime: {
        flex: 8,
        marginLeft: 10,
        marginRight: 20,
        height: 40,
        padding: 0,
        borderWidth: 0,
        textAlign: 'left'
    },
    textInputBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 30,
        marginRight: 30
    },
    textInputSpot: {
        height: 3,
        width: 3,
        padding: 3,
        borderRadius: 3,
        backgroundColor: '#333'
    },
    drawerBoxTitle: {
        marginTop: 10,
        fontSize: 22,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
    },
    drawerBoxClose: {
        position: 'absolute',
        right: 15
    },
    drawerBoxMoudal: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexWrap: 'wrap'
    },
    drawerBoxMoudalItem: {
        height: 100,
        flexDirection: 'column',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#eee'
    },
    InputAddressBody: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    InputAddressBodyLeft: {
        flex: 6
    },
    InputAddressBodyRight: {
        flex: 1
    },
    InputAddressBodyRightBox: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(30, 143, 245, 1.000)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 5,
        borderColor: 'rgba(211,234,254,1.000)'
    },
    searchplace: {
        marginTop: 50,
        paddingLeft: 20,
        paddingRight: 20
    },
    searchviewTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 35
    },
    searchviewsearch: {
        textAlign: 'left',
        backgroundColor: '#EEE',
        flex: 6,
        paddingLeft: 15,
        borderRadius: 5,
        fontSize: 14,
        paddingTop: 6,
        paddingBottom: 6
    },
    searchviewsearchtext: {
        flex: 1,
        paddingLeft: 15,
        height: 35,
        lineHeight: 35
    },
    searchItem: {
        flexDirection: 'row',
        // height:50,
        minHeight: 50,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#eee',
        paddingTop: 5,
        paddingBottom: 5
    },
    searchItemList: {
        marginTop: 20,
        marginBottom: 30
    },
    searchItemLeft: {
        flex: 1,
        textAlign: 'center'
    },
    searchItemRight: {
        flex: 7,
        flexDirection: 'column'
    },
    searchItemaddress: {
        paddingTop: 5,
        color: '#444',
        fontSize: 12,
    }
});
