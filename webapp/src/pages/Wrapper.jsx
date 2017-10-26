import React,{Component} from 'react';
import wxUtil from '../utils/wxUtil';
import Ajax from '../utils/Ajax';
import Util from '../utils/Util';
import Config from '../config/Config';

export default (WrappedComponent) => {
  class Wrapper extends Component {
    constructor () {
      super()
      this.state = { data: null }
    }

    componentWillMount () {
    	this._initWxShare();
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

    render () {
      return (
        <WrappedComponent {...this.props} />
      )
    }
  }
  return Wrapper;
}