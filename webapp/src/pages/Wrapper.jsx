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

    componentDidMount() {
      if (Util.isAndroid()) {
          this._initWxShare();
      }
    }

    _initWxShare() {
      var _url = '';
      if (Util.weixinVersion()) {
            _url = window.escape(window.location.href);
        }else{
           _url = escape(window.localStorage.getItem('firstUrl'));
        }
      // window.escape(window.location.href)'http://www.baebae.cn/'window.location.origin
        Ajax.post({url: Config.API.WXJS_SIGN,data:{url: _url}})
                .then((res) => {
                    if (res.status === 200) {
                        var title = window.localStorage.getItem('nickname')+'的麦智商城';
                        var link = 'http://www.baebae.cn/?aid='+window.localStorage.getItem('agentId');
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