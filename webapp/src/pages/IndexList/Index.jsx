import React,{Component} from 'react'
import CommonNavbar from '../../components/CommonNavbar/Index.jsx'
import {Grid,Toast} from 'antd-mobile'
import './index.css'
import Ajax from '../../utils/Ajax'
import Config from '../../config/Config'

class IndexList extends Component {

	constructor(props) {
		super(props);
		this.handleCateItemClick = this.handleCateItemClick.bind(this);
		this.handleBrandClick = this.handleBrandClick.bind(this);
		this.state = {
			dataWhite: [],
			dataRed: [],
			dataBeer: [],
			dataOther: [],
		}
	}

	componentWillMount() {
		Toast.loading('加载中...',0);
	}

	componentDidMount() {
		var self = this;
		this._toggleCateRight(0);
		
		var a1 = Ajax.post({url: Config.API.BRAND_LIST})
			a1.then(function(data) {
				if (data.status === 200) {
					self._filterBrands(data.data);
				}
				Toast.hide();
			}).catch(function(error){
				console.log(error);
			});
	}

	_filterBrands(data) {
		var item = null,dataWhite=[],dataRed=[],dataBeer=[],dataOther=[];
		for (var i = 0; i < data.length; i++) {
			item = {
				icon: data[i].logo,
			  	text: data[i].brandName,
			  	id: data[i].id
			}
			switch(data[i].categoryId){
				case "1":
					dataWhite.push(item)
					break;
				case "2":
					dataRed.push(item)
					break;
				case "3":
					dataBeer.push(item)
					break;
				case "4":
					dataOther.push(item)
					break;
			}
		}
		this.setState({
			dataWhite,dataRed,dataBeer,dataOther
		});
	}

	_toggleCateRight(idx) {
		const cateRightEls = this.cateRightEl.querySelectorAll('.m-right-item')
		cateRightEls.forEach(el => {
			el.style.display = 'none'
		})
		cateRightEls[idx].style.display = 'block'
	}

	_toggleActiveEl(target) {
		const siblings = target.parentNode.children;
		for (let i = 0; i < siblings.length; i++) {
			siblings[i].classList.remove('is-active')
		}
		target.classList.add('is-active')
	}

	handleCateItemClick(e) {
		const target = e.target
		this._toggleActiveEl(target)
		this._toggleCateRight(parseInt(target.getAttribute('data-idx'),10))
	}

	handleBrandClick(el) {
		this.props.history.push('/brand/'+el.id+'?brand='+el.text);
	}

	render() {
		return (
			<div>
				<CommonNavbar 
					centerText="分类"
					showLeftIcon={false}
				/>
				<div className="m-cate-box">
					<div className="m-cate-left">
						<ul className="m-cate-list">
							<li className="m-cate-item is-active" data-idx="0" onClick={this.handleCateItemClick}>白酒</li>
							<li className="m-cate-item" data-idx="1" onClick={this.handleCateItemClick}>红酒</li>
							<li className="m-cate-item" data-idx="2" onClick={this.handleCateItemClick}>啤酒</li>
							<li className="m-cate-item" data-idx="3" onClick={this.handleCateItemClick}>其他</li>
						</ul>
					</div>
					<div className="m-cate-right" ref={cateRightEl => this.cateRightEl = cateRightEl}>
						<div className="m-right-item">
							<Grid
								data={this.state.dataWhite}
								columnNum={3}
								hasLine={false}
								onClick={this.handleBrandClick}
							/>
						</div>
						<div className="m-right-item">
							<Grid
								data={this.state.dataRed}
								columnNum={3}
								hasLine={false}
								onClick={this.handleBrandClick}
							/>
						</div>
						<div className="m-right-item">
							<Grid
								data={this.state.dataBeer}
								columnNum={3}
								hasLine={false}
								onClick={this.handleBrandClick}
							/>
						</div>
						<div className="m-right-item">
							<Grid
								data={this.state.dataOther}
								columnNum={3}
								hasLine={false}
								onClick={this.handleBrandClick}
							/>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default IndexList