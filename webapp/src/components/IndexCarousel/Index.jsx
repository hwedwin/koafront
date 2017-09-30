import React,{Component} from 'react'
import PropTypes from 'prop-types'
import {Carousel} from 'antd-mobile'
import './carousel.css'

class IndexCarousel extends Component {

	static propTypes = {
		data: PropTypes.array,
		autoplay: PropTypes.bool,
		height: PropTypes.number,
		adjustImageSize: PropTypes.bool,
		pureImage: PropTypes.bool
	}

	static defaultProps = {
		data: [
		],
		autoplay: false,
		height: 3.2,
		adjustImageSize: true,
		pureImage: false
	}

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<Carousel
					className="my-carousel"
					infinite
					selectedIndex={1}
					swipeSpeed={35}
					autoplay={this.props.autoplay}
					autoplayInterval={5000}
					style={{height: this.props.height+'rem'}}
				>
				{
					this.props.pureImage ?
					this.props.data.map((el,ii) => (
			            <div key={ii} className="m-carousel-itema" style={{height: this.props.height+'rem'}}>
			              <img
			                src={el}
			                alt="icon"
			                onLoad={(e) => {
			                	this.props.adjustImageSize && window.gUtil.resizeImage(e.target)
			                }}
			              />
			            </div>
			          )):
					this.props.data.map((el,ii) => (
			            <a href={'/goods/'+el.drinkId} key={ii} className="m-carousel-itema" style={{height: this.props.height+'rem'}}>
			              <img
			                src={el.imgPath}
			                alt="icon"
			                onLoad={(e) => {
			                	this.props.adjustImageSize && window.gUtil.resizeImage(e.target)
			                }}
			              />
			            </a>
			          ))
				}
				</Carousel>
			</div>
		)
	}
}

export default IndexCarousel