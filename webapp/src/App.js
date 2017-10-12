import React, { Component } from 'react';
import {Provider} from 'react-redux';
import userStore from './store/userStore';
import {BrowserRouter as Router,Route,Redirect} from 'react-router-dom';

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

import Ajax from './utils/Ajax';
import Util from './utils/Util';
import Config from './config/Config';
import {connect} from 'react-redux';
import {initMember} from './store/userStore';
import {initAgentId} from './store/userStore';

class AppWrapper extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: null
    }
  }

  componentWillMount() {
    var self = this;
    // this.beatTimer = setInterval(function(){
      Ajax.post({url: Config.API.BEAT})
      .then((res) => {
        if (res.status === 200 && res.data.code === 200) {
          this.setState({
            data: res.data.data
          });
          self.props.onInitMember(res.data.data);
        }else{
        }
      }).catch(function(error){
        console.log(error);
      });
    // },3000);
    self.props.onInitAgentId(Util.getSearch(window.location.search,'aid'));
  }

  render() {
    return (
      <div className="App">
        {this.props.children}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    member: state.member
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onInitMember: (member) => dispatch(initMember(member)),
    onInitAgentId: (agentId) => dispatch(initAgentId(agentId))
  }
}

var AppWrapper2 = connect(mapStateToProps,mapDispatchToProps)(AppWrapper);

class App extends Component {
  render() {
    return (
      <Provider store={userStore}>
      <AppWrapper2>
      <Router>
        <div className="app">
          <Route path="/" exact render={
          		(p) => {
                var search = p.location.search;
                search = search ? search : '';
                return <Redirect to={"/home"+search} />
              }
          	}
          />
          <Route path="/home" component={Index} />
          <Route path="/register" component={Register} />
          <Route path="/regagent" component={RegisterAgent} />
          <Route path="/login" component={Login} />
          <Route path="/goods/:id" component={GoodsDetail} />
          <Route path="/search" component={Search} />
          <Route path="/result/:query" component={SearchResult} />
          <Route path="/order/:tab" component={Order} />
          <Route path="/orderdetail/:id" component={OrderDetail} />
          <Route path="/ordercreate" component={OrderCreate} />
          <Route path="/address" component={Address} />
          <Route path="/addressedit/:action" component={AddressEdit} />
          <Route path="/favorite" component={Favorite} />
          <Route path="/uedit" component={UserEdit} />
          <Route path="/cate/:id" component={DrinkCate} />
          <Route path="/brand/:id" component={DrinkCate} />
          <Route path="/pay/:id" component={Pay} />
          <Route path="/customer" component={Customer} />
          <Route path="/balance" component={BalanceDetail} />
        </div>
      </Router>
      </AppWrapper2>
      </Provider>
    );
  }
}

export default App;
