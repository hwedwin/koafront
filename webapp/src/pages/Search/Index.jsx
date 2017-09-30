import './index.css'
import React,{Component} from 'react'
import {Link} from 'react-router-dom'
import {Toast,SearchBar,Tag} from 'antd-mobile'
import BlockTitle from '../../components/BlockTitle/Index.jsx'

class Search extends Component {

	constructor(props) {
		super(props);
		this.handleValueChange = this.handleValueChange.bind(this);
		this.handleValueSubmit = this.handleValueSubmit.bind(this);
		this.state = {
			value: '',
			hotWords: ['茅台','酒鬼酒','五粮液'],
			search: []
		}
	}

	componentWillMount() {
		this._getSearch();
	}

	_setSearch(item) {
		var localStorage = window.localStorage;
		var searchStr = localStorage.getItem('search');
		var searchArr = [];
		if (searchStr) {
			searchArr = JSON.parse(searchStr);
		}
		if (searchArr.indexOf(item) === -1) {
			searchArr.push(item);
		}
		if (searchArr.length > 8) {
			searchArr = searchArr.slice(-8);
		}
		localStorage.setItem('search',JSON.stringify(searchArr));
	}

	_getSearch() {
		var localStorage = window.localStorage;
		var search = localStorage.getItem('search');
		if (search) {
			this.setState({
				search: JSON.parse(search)
			});
		}
	}

	handleValueChange(value) {
		this.setState({
			value
		});
	}

	handleValueSubmit(value) {
		if (this.state.value.trim() === '') {
			Toast.info('请输入关键字');
			return;
		}
		this.props.history.push('/result/'+this.state.value);
		this._setSearch(value);
	}

	handleHotWordClick(word) {
		this.props.history.push('/result/'+word);
		this._setSearch(word);
	}

	render() {
		return (
			<div className="m-search-page">
				<div className="m-searchtop-box">
					<SearchBar
				        value={this.state.value}
				        placeholder="搜索"
				        onSubmit={this.handleValueSubmit}
				        onCancel={() => this.props.history.goBack()}
				        showCancelButton
				        onChange={this.handleValueChange}
				      />
				   	<BlockTitle title="热搜"/>
				   	<div className="m-hotword-box">
				   		{
				   			this.state.hotWords.map((el,ii) => 
				   				(<Tag key={ii} onChange={this.handleHotWordClick.bind(this,el)}>{el}</Tag>)
				   			)
				   		}
				   	</div>
				</div>
				<div className="m-history-box">
					<BlockTitle title="历史搜索"/>
					<ul className="m-history-list">
						{
							this.state.search.map((el,ii) => (
								<li className="u-history-item" key={ii}>
									<Link to={`/result/${el}`}>{el}</Link>
								</li>
							))
						}
					</ul>
				</div>
			</div>
		)
	}
}

export default Search