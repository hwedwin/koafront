const gUtil = {
	$: function(selector) {
		return document.querySelectorAll(selector)
	},
	css: function(el,p1,p2) {
		if (typeof p1 === 'string' && p2) {
			el.style[p1] = p2
			return el;
		}

		for(let name in p1) {
			el.style[name] = p1[name]
		}
		return el
	},
	resizeImage: function(el) {
		let pW = el.parentNode.offsetWidth,
			pH = el.parentNode.offsetHeight;

		let elW = el.naturalWidth,
			elH = el.naturalHeight;

		let ratioW = pW / elW,
			ratioH = pH / elH,
			maxRatio = Math.max(ratioW,ratioH);
		let setedW = elW * maxRatio,
			setedH = elH * maxRatio,
			offLeft = (setedW - pW) / 2,
			offTop = (setedH - pH) / 2

		gUtil.css(el,{
			position: 'absolute',
			width: setedW + 'px',
			height: setedH + 'px',
			top: -offTop + 'px',
			left: -offLeft + 'px',
		})
	}
}

export default gUtil