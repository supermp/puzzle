String.prototype.trim= function() {
	return this.replace(/(^\s*)|(\s*$)/g, '');
}

String.prototype.mpEncode = function() {
	if (!/^[a-zA-Z]+$/.test(this)) {
		return false;
	}
	var src = this.toUpperCase();
	var dst = '';
	var uBaseAsc = 'A'.charCodeAt(0) - 1;
	var lBaseAsc = 'a'.charCodeAt(0) - 1;
	var firstSrcAsc = src.charCodeAt(0);
	var firstDstAsc = uBaseAsc + (27 - (firstSrcAsc - uBaseAsc));
	dst += String.fromCharCode(firstDstAsc);
	var preSrcAsc, curSrcAsc, curDstAsc;
	for (var i = 1; i <= src.length - 1; i++) {
		preSrcAsc = src.charCodeAt(i - 1);
		curSrcAsc = src.charCodeAt(i);
		if (curSrcAsc > preSrcAsc) {
			curDstAsc = uBaseAsc + (curSrcAsc - preSrcAsc);
		} else if (curSrcAsc < preSrcAsc) {
			curDstAsc = lBaseAsc + (preSrcAsc - curSrcAsc);
		} else {
			curDstAsc = uBaseAsc + 26;
		}
		dst += String.fromCharCode(curDstAsc);
	}
	return dst;
};

String.prototype.mpEncodeLong = function() {
	var src = this.trim();
	var dst = '';
	var srcArray = src.split(/\s+/);
	var dstCode;
	for (var i = 0; i <= srcArray.length - 1; i++) {
		if (dstCode = srcArray[i].mpEncode()) {
			dst += !dst ? dstCode : ' ' + dstCode;
		}
		else {
			return false;
		}
	}
	return dst;
};

String.prototype.mpDecode = function() {
	if (!/^[A-Z][a-zA-Z]*$/.test(this)) {
		return false;
	}
	var src = this;
	var dst = '';
	var uBaseAsc = 'A'.charCodeAt(0) - 1;
	var lBaseAsc = 'a'.charCodeAt(0) - 1;
	var firstSrcAsc = src.charCodeAt(0);
	var firstDstAsc = lBaseAsc + (27 - (firstSrcAsc - uBaseAsc));
	dst += String.fromCharCode(firstDstAsc);
	var preDstAsc, curSrcAsc, curDstAsc;
	for (var i = 1; i <= src.length - 1; i++) {
		preDstAsc = dst.charCodeAt(i - 1);
		curSrcAsc = src.charCodeAt(i);
		if (curSrcAsc == uBaseAsc + 26) {
			curDstAsc = preDstAsc;
		} else if (curSrcAsc > lBaseAsc) {
			curDstAsc = preDstAsc - (curSrcAsc - lBaseAsc);
		} else {
			curDstAsc = preDstAsc + (curSrcAsc - uBaseAsc);
		}
		if (curDstAsc <= lBaseAsc || curDstAsc > lBaseAsc + 26) {
			return false;
		}
		dst += String.fromCharCode(curDstAsc);
	}
	return dst;
};

String.prototype.mpDecodeLong = function() {
	var src = this.trim();
	var dst = '';
	var srcArray = src.split(/\s+/);
	var dstWord;
	for (var i = 0; i <= srcArray.length - 1; i++) {
		if (dstWord = srcArray[i].mpDecode()) {
			dst += !dst ? dstWord : ' ' + dstWord;
		}
		else {
			return false;
		}
	}
	return dst;
};
