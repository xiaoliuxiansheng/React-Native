/**
 * @name: home
 * @author: LIULIU
 * @date: 2020-07-15 09:39
 * @description：home
 * @update: 2020-07-15 09:39
 */
import {observable, action} from 'mobx';
import Request from '../server/index.js'
class homeStore {
    @observable defineTab = 1 //首页默认tab
    @observable amapDataUrl = 'https://restapi.amap.com/v3/place/text'
    @observable amapkey = '197801ada5c77d3295305b8fbf0b83b5'
    @observable defineDestination = {} //默认起点信息 为定位点
    /**
     * 设置tab
     * */
    @action
    handleSaveTab = (tab) => {
        this.defineTab = tab
    }
    /**
     * 设置默认起点信息
     * */
    @action
    handleSavedefineDesti = async (msg) => {
        fetch(`https://restapi.amap.com/v3/geocode/regeo?location=${msg.longitude},${msg.latitude}&key=${this.amapkey}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body:''
        }).then((response) => response.json())
            .then((json) =>{
                this.defineDestination = json.regeocode
                // console.log(json.regeocode)
            }).catch((err) =>console.log(err)).finally(()=>console.log('finally'))
       let xx =await Request.get(`https://restapi.amap.com/v3/geocode/regeo?location=${msg.longitude},${msg.latitude}&key=197801ada5c77d3295305b8fbf0b83b5`)
        // console.log(xx,"---------")
    }
}
export default new homeStore();
