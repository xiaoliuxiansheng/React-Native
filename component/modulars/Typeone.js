import React, { Component } from "react";
import { FlatList, StyleSheet, Text, View, PermissionsAndroid, Platform, Dimensions} from "react-native";
import { MapView } from "react-native-amap3d";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
import {observer, inject} from 'mobx-react';
@inject("homeStore")
@observer
export default class EventsExample extends Component {
    static navigationOptions = {
        title: "地图事件"
    };

    state = {
        logs: [],
        coordinate:{
            latitude: 39.91095,
            longitude: 116.37296
        }
    };

    async componentDidMount() {
        await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]);
    }

    handelGetamapData = async () =>{
        await fetch('https://restapi.amap.com/v3/place/text?keywords=北京大学&offset=20&page=1&key=&extensions=all&page=1',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body:''
        }).then((response) => response.json())
            .then((json) =>{
                this.setState({
                    searchData:json.pois
                })
            }).catch((err) =>console.log(err)).finally(()=>console.log('finally'))
    }
    _log = async(event, data) =>{
        const {handleSavedefineDesti} = this.props.homeStore
        this.DEBOUNCE(handleSavedefineDesti(data),5000)
        this.setState({
            coordinate:{
                latitude:data.latitude,
                longitude:data.longitude
            },
            logs: [
                {
                    key: Date.now().toString(),
                    time: new Date().toLocaleString(),
                    event,
                    data: JSON.stringify(data, null, 2)
                },
                ...this.state.logs
            ]
        });
    }
    // 输入地址搜索时 防抖
    DEBOUNCE = (fn, wait) => {
        let timeout = null;
        return function () {
            if (timeout !== null) clearTimeout(timeout);
            timeout = setTimeout(fn, wait);
        }
    }
    _logClickEvent = data => this._log("onClick", data);
    _logLongClickEvent = data => this._log("onLongClick", data);
    _logLocationEvent = data => this._log("onLocation", data);
    _logStatusChangeCompleteEvent = data => this._log("onStatusChangeComplete", data);

    _renderItem = ({ item }) => (
        <Text style={styles.logText}>
            {item.time} {item.event}: {item.data}
        </Text>
    );

    render() {
        return (
            <View>
                <MapView
                    style={styles.absoluteFill}
                    locationEnabled
                    coordinate={this.state.coordinate}
                    // coordinate={{
                    //     latitude: 39.91095,
                    //     longitude: 116.37296
                    // }
                    // }
                    locationInterval={10000}
                    // distanceFilter={10}
                    // onClick={this._logClickEvent}
                    // onLongClick={this._logLongClickEvent}
                    onLocation={this._logLocationEvent}
                />
                {/*<FlatList style={styles.logs} data={this.state.searchData} renderItem={this._renderItem} />*/}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    absoluteFill:{
        height:deviceHeight,
        width:deviceWidth
    }
})
