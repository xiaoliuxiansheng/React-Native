import React, { Component } from "react";
import { FlatList, StyleSheet, Text, View, PermissionsAndroid, Platform, Dimensions} from "react-native";
import { MapView } from "react-native-amap3d";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
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

    _log(event, data) {
        // console.log(data);
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
                    // locationInterval={10000}
                    // distanceFilter={10}
                    // onClick={this._logClickEvent}
                    // onLongClick={this._logLongClickEvent}
                    onLocation={this._logLocationEvent}
                />
                {/*<FlatList style={styles.logs} data={this.state.logs} renderItem={this._renderItem} />*/}
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
