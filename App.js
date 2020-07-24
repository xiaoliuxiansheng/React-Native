import React from 'react';
import {
    Platform,
    StyleSheet
} from 'react-native';
import {
    Scene,
    Router,
    ActionConst,
    Overlay,
    Modal,
    Stack,
    Lightbox,
} from 'react-native-router-flux';
import Home from './component/Home';
import Sos from './component/NeedHelp/Index.js'
import {Provider} from 'mobx-react'
import store from './store/index.js'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scene: {
        backgroundColor: '#F5FCFF',
        shadowOpacity: 1,
        shadowRadius: 3,
    },
    tabBarStyle: {
        backgroundColor: '#eee',
    },
    tabBarSelectedItemStyle: {
        backgroundColor: '#ddd',
    },
});

const stateHandler = (prevState, newState, action) => {
    console.log('onStateChange: ACTION:', action);
};
// on Android, the URI prefix typically contains a host in addition to scheme
const prefix = Platform.OS === 'android' ? 'mychat://mychat/' : 'mychat://';

const Example = () => (
    <Provider {...store}>
        <Router
            onStateChange={stateHandler}
            sceneStyle={styles.scene}
            uriPrefix={prefix}>
            <Overlay key="overlay">
                <Modal key="modal" hideNavBar>
                    <Lightbox key="lightbox">
                        <Stack key="root" titleStyle={{alignSelf: 'center'}} hideNavBar>
                            <Scene
                                key="launch"
                                component={Home}
                                title="Launch"
                                initial
                                type={ActionConst.RESET}
                            />
                            <Stack
                                back
                                backTitle="Back"
                                key="needhelp"
                                duration={0}
                                navTransparent>
                                <Scene
                                    key="needhelp"
                                    component={Sos}
                                />
                            </Stack>
                        </Stack>
                    </Lightbox>
                </Modal>
            </Overlay>
        </Router>
    </Provider>
);

export default Example;
