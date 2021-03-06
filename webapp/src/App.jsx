import React, { Component } from 'react';
import { Provider,connect } from 'react-redux';
import userStore from './store/userStore';
// import { HashRouter as Router, Route, Redirect } from 'react-router-dom';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Bundle from './pages/Bundle.jsx';
import {Toast} from 'antd-mobile';

import Index from './pages/Index.jsx';
import Register from './pages/Register/Index.jsx';
import RegisterAgent from './pages/RegisterAgent/Index.jsx';
import Login from './pages/Login/Index.jsx';
import GoodsDetail from './pages/GoodsDetail/Index.jsx';
import Search from './pages/Search/Index.jsx';
import SearchResult from './pages/SearchResult/Index.jsx';
import Order from './pages/Order/Index.jsx';
import OrderDetail from './pages/OrderDetail/Index.jsx';
import OrderCreate from './pages/OrderCreate/Index.jsx';
import Address from './pages/Address/Index.jsx';
import AddressEdit from './pages/AddressEdit/Index.jsx';
import Favorite from './pages/Favorite/Index.jsx';
import UserEdit from './pages/UserEdit/Index.jsx';
import DrinkCate from './pages/DrinkCate/Index.jsx';
import Pay from './pages/Pay/Index.jsx';
import Customer from './pages/Customer/Index.jsx';
import BalanceDetail from './pages/BalanceDetail/Index.jsx';
import CountRoom from './pages/CountRoom/Index.jsx';
import TransDetail from './pages/TransDetail/Index.jsx';
import Withdraw from './pages/Withdraw/Index.jsx';

import Ajax from './utils/Ajax';
import Util from './utils/Util';
import wxUtil from './utils/wxUtil';
import Config from './config/Config';
import { initMember } from './store/userStore';

class AppWrapper extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isChecked: false
        };
    }

    componentWillMount() {
        if (window.location.pathname === '/regagent') {
            return;
        }
        window.localStorage.setItem('agentId','top');
        var aid = Util.getSearch(window.location.search, 'aid');
        this._initParamAgentId(aid); //检查地址带的agentId参数
    }

    _initParamAgentId(aid) {
        if (aid) {
            // 检测地址参数ID是否合法
            Ajax.post({ url: Config.API.MEMBER_DATA_BYID, data: { id: aid } })
                .then((res) => {
                    if (res.status === 200 && res.data.code === 200) {
                        var mData = res.data.data;
                        if (mData && mData.isAgent == '1' && mData.isPay == '1') {
                            window.localStorage.setItem('agentId',mData.id);
                            window.localStorage.setItem('nickname',mData.nickname||'我');
                            window.document.title = (mData.nickname||'我')+'的麦智商城';
                        }else{
                             window.localStorage.setItem('agentId','top');
                        }
                    }
                    this._initSelfAgentIdTimer(aid);
                },()=>{
                    this._initSelfAgentIdTimer(aid);
                }).catch(function(error) {});
        }else{
            this._initSelfAgentIdTimer(aid);
        }
    }

    _initSelfAgentIdTimer(aid) {
        this.beatTimer = setInterval(() => {
            this._initSelfAgentId(aid);
        }, 5000);
        this._initSelfAgentId(aid);
    }

    _initSelfAgentId(aid) {
        var self = this;
        Ajax.post({ url: Config.API.BEAT })
            .then((res) => {
                var mData = res.data.data;
                self.props.onInitMember(mData);
                //已经检测过
                if (this.state.isChecked) {
                    return;
                }
                this.setState({
                    isChecked: true
                });
                if (res.status === 200 && res.data.code === 200) {
                    //已支付经销商处理
                    if (mData.isAgent == '1' && mData.isPay == '1') {
                        if (aid != null && mData.id != aid) { //地址带了agentId并且不是自己
                            // 切换店铺
                            if (window.confirm('尊敬的经销商,您目前处于其他经销商店铺,返利将进入其他经销商账户,是否切换至您的店铺?')) {
                                window.localStorage.setItem('agentId',mData.id);
                                window.localStorage.setItem('nickname',mData.nickname||'我');
                                window.document.title = (mData.nickname||'我')+'的麦智商城';
                                Toast.info('已切换至您的店铺');
                            }
                            return;
                        }else {
                            window.document.title = (mData.nickname||'我')+'的麦智商城';
                            window.localStorage.setItem('nickname',mData.nickname||'我');
                            window.localStorage.setItem('agentId',mData.id);
                        }
                    } else if (mData.isAgent == '1' && mData.isPay == '0') {
                        if (window.confirm('您在注册为经销商时尚未支付，无法享受返利行为，是否进行支付？')) {
                            Toast.loading('支付中',0);
                            // 重新为经销商支付
                            Ajax.post({url: Config.API.MEMBER_RESUME_PAY})
                                .then((res) => {
                                    if (res.status === 200) {
                                        Util.wxPay(res.data,function(state){
                                            if (state) {
                                                Toast.info('支付成功，即将跳转...');
                                                setTimeout(()=>{
                                                    window.location.href = 'http://www.baebae.cn';
                                                },1500);
                                            }else{
                                                Toast.info('支付失败，请重试');
                                            }
                                        });
                                    }
                                },()=>{
                                    Toast.info('支付超时，请重试');
                                });
                            return;
                        }
                    }
                }
            }).catch(function(error) {
                console.log(error);
            });
    }

    _initWxShare() {
        Ajax.post({url: Config.API.WXJS_SIGN,data:{url: window.escape(window.location.href)}})
                .then((res) => {
                    if (res.status === 200) {
                        var title = '麦智商城';
                        var link = window.location.origin;
                        var logo = 'http://jiuji-test.gz.bcebos.com/logo_100.png';
                        var desc = '来麦智商城，享受高性价比糖酒食品';
                        wxUtil.share(res.data,title,link,logo,desc);
                    }
                }).catch(function(error){
                    console.log(error);
                });
    }

    render() {
        return ( <div className = "App" > { this.props.children } </div>);
    }
}

const mapStateToProps = (state) => {
    return {
        member: state.member
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onInitMember: (member) => dispatch(initMember(member))
    }
}

var AppWrapper2 = connect(mapStateToProps, mapDispatchToProps)(AppWrapper);


class App extends Component {
    render() {
        return ( <Provider store = { userStore } >
                <AppWrapper2 >
                    <Router>
                        <div className="app" >
                            <Route path="/" exact render={
                                (p) => {
                                    window.localStorage.setItem('firstUrl',window.location.href);
                                    var search = p.location.search;
                                    search = search ? search : '';
                                    return <Redirect to={ "/home"+search }/>
                                }
                            }/> 
                            <Route path="/home" component={ Index }/> 
                            <Route path="/register" component={ Register }/> 
                            <Route path="/regagent" component={ RegisterAgent }/> 
                            <Route path="/login" component={ Login }/> 
                            <Route path="/goods/:id" component={ GoodsDetail }/> 
                            <Route path="/search" component={ Search }/> 
                            <Route path="/result/:query" component={ SearchResult }/> 
                            <Route path="/order/:tab" component={ Order }/> 
                            <Route path="/orderdetail/:id" component={ OrderDetail }/> 
                            <Route path="/ordercreate" component={ OrderCreate }/> 
                            <Route path="/address" component={ Address }/> 
                            <Route path="/addressedit/:action" component={ AddressEdit }/> 
                            <Route path="/favorite" component={ Favorite }/> 
                            <Route path="/uedit" component={ UserEdit }/> 
                            <Route path="/cate/:id"component={ DrinkCate }/> 
                            <Route path="/brand/:id" component={ DrinkCate }/> 
                            <Route path="/pay/:id" component={ Pay }/> 
                            <Route path="/customer" component={ Customer }/> 
                            <Route path="/balance" component={ BalanceDetail }/> 
                            <Route path="/countroom" component={ CountRoom }/> 
                            <Route path="/transdetail/:id" component={ TransDetail }/> 
                            <Route path="/withdraw" component={ Withdraw }/> 
                        </div> 
                    </Router> 
                </AppWrapper2> 
            </Provider>
        );
    }
}

export default App;