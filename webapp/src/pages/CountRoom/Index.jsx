import './index.css';
import React,{Component} from 'react';
import CommonNavbar from '../../components/CommonNavbar/Index.jsx';
import {Toast,Grid,Icon} from 'antd-mobile';
import Ajax from '../../utils/Ajax'
import Config from '../../config/Config'
import {connect} from 'react-redux';
import svgTransRecord from '../../assets/svg/trans-record.svg'
import svgWithdraw from '../../assets/svg/withdraw.svg'
import svgWithdrawRecord from '../../assets/svg/withdraw-record.svg'
import Wrapper from '../Wrapper.jsx';

const MineBox = props => {
	const data = [
		{
			icon: svgTransRecord,
			text: '交易记录',
			tagId: 'trans-record'
		},
		{
			icon: svgWithdrawRecord,
			text: '提现记录',
			tagId: 'withdraw-record'
		},
		{
			icon: svgWithdraw,
			text: '提现',
			tagId: 'withdraw'
		},
	]
	return (
		<div className="mine-box">
			<div className="m-badge-grid">
				{
					data.map((item,ii) => (
							<div className="m-item" key={ii} onClick={() => props.onItemClick(item)}>
								<Icon type={item.icon} size="md"/>
								<div className="u-text">{item.text}</div>
							</div>
						)
					)
				}
			</div>
		</div>
	)
}

class CountRoom extends Component {

	constructor(props) {
		super(props);
		this.state = {
			expenseAll: 0
		}
	}

	componentWillMount() {
		Toast.loading('加载中...',0)
		var p1 = Ajax.post({url: Config.API.BALANCE_GET})
		.then((res) => {
			Toast.hide();
			if (res.status === 200) {
				if (res.data.code === 200) {
					this.setState({
						expenseAll: res.data.data.balance
					});
				}
			}else{
				Toast.info(res.message);
			}
		},()=>{
			Toast.info('请求超时');
		}).catch(function(error){
		});
	}

	onMineItemClick(item) {
		var href = '';
		if (item.tagId === 'trans-record') {
			href = '/balance';
		}else if(item.tagId === 'withdraw-record'){
			href = '/balance?type=7';
		}else if(item.tagId === 'withdraw'){
			href = '/withdraw'
		}
		this.props.history.push(href);
	}

	render() {
		return (
			<div className="page-count-room">
				<CommonNavbar 
					centerText="账房"
					onBackbarClick={()=>this.props.history.goBack()}
					showRightContent={false}
				/>
				<div>
					<div className="m-banlance-box">
						<div className="u-banlance">{this.state.expenseAll}</div>
						<div className="u-title">账户余额</div>
					</div>
					<MineBox 
						onItemClick={this.onMineItemClick.bind(this)}
					/>
				</div>
			</div>
		)
	}
}

// export default Favorite;
const mapStateToProps = (state) => {
  return {
  	agentId: state.agentId,
    member: state.member
  }
}

export default connect(mapStateToProps)(Wrapper(CountRoom));