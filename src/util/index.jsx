import { select } from 'optimal-select';

export default {
  getDomIndex(el){
    var indexof = [].indexOf;
    if (!el.parentNode) return -1;
    var list = el.parentNode.children;

    if (!list) return -1;
    var len = list.length;

    if (indexof) return indexof.call(list, el);
    for (var i = 0; i < len; ++i) {
      if (el == list[i]) return i;
    }
    return -1;
  },
  selector(el){
    //var classname = _.trim(el.className.baseVal ? el.className.baseVal : el.className);
    var i = el.parentNode && 9 == el.parentNode.nodeType ? -1 : this.getDomIndex(el);
    if(el.id){
      return '#' + el.id;
    }else{
      return el.tagName.toLowerCase()      //+ (classname ? classname.replace(/^| +/g, '.') : '')
        + (~i ? ':nth-child(' + (i + 1) + ')' : '');
    }
  },
  getDomSelector(el,arr) {
    if(!el || !el.parentNode || !el.parentNode.children){
      return false;
    }
    arr = arr && arr.join ? arr : [];
    var name = el.nodeName.toLowerCase();
    if (!el || name === 'body' || 1 != el.nodeType) {
      arr.unshift('body');
      return arr.join(' > ');
    }
    arr.unshift(this.selector(el));
    if (el.id) return arr.join(' > ');
    return this.getDomSelector(el.parentNode, arr);    
  },
  getDomSelectorTwo(el) {
    if(!el || !el.parentNode || !el.parentNode.children){
      return false;
    }
    return select(el);
  },
  isParent(itemEl, parentEl) {
    while (itemEl != undefined && itemEl != null && itemEl.tagName.toUpperCase() != 'BODY'){ 
      if (itemEl == parentEl){ 
        return true; 
      }
      itemEl = itemEl.parentNode; 
    }
    return false; 
  },
  querySelector(selector, parentEl) {
		try {
			return (parentEl || document).querySelector(selector);
		} catch (e) {
			return null
		}
  },
  querySelectorAll(selector, parentEl) {
		try {
			return (parentEl || document).querySelectorAll(selector);
		} catch (e) {
			return []
		}
  },
  offset(itemEl){
    if (!itemEl) return;
    const rect = itemEl.getBoundingClientRect();
    if ( rect.width || rect.height ) {
      const doc = itemEl.ownerDocument;
      const docElem = doc.documentElement;
      // 兼容IE写法 ==》  - docElem.clientTop、 - docElem.clientLeft ，其它浏览器为0px，IE为2px
      return {
        top: rect.top + window.pageYOffset - docElem.clientTop,
        left: rect.left + window.pageXOffset - docElem.clientLeft
      };
    }else{
      return {
        top: 0,
        left: 0
      }
    }
  },
  getSize(itemEl){
    if (!itemEl) return;
    if (!window.getComputedStyle) {
      return {width: itemEl.offsetWidth, height: itemEl.offsetHeight};
    }
    try {
      const bounds = itemEl.getBoundingClientRect();
      return {width: bounds.width, height: bounds.height};
    } catch (e){
      return {width: 0, height: 0};
    }
  },
  getStyle(itemEl, value){
    // 若可以拿到 style上的属性，则取它
    if(itemEl.style[value]) {
      return itemEl.style[value];
    }
    // 兼容IE
    if(itemEl.currentStyle){
      return itemEl.currentStyle[value];
    }else{
      return itemEl.ownerDocument.defaultView.getComputedStyle(itemEl, null).getPropertyValue(value);
    }
  },
  removeChild(itemEl) {
    itemEl && itemEl.parentNode && itemEl.parentNode.removeChild(itemEl);
  },
  getElementSpacingOffset(direction) {
    const $html = document.getElementsByTagName('html')[0];
    const $body = document.getElementsByTagName('body')[0];
    const scroll = (direction === 'top' ? window.scrollY : window.scrollX);
    const htmlPadding = parseInt(this.getStyle($html, 'padding-' + direction));
    const htmlMargin = parseInt(this.getStyle($html, 'margin-' + direction));
    const htmlBorder = parseInt(this.getStyle($html, 'border-' + direction));
    const bodyBorder = parseInt(this.getStyle($body, 'border-' + direction));
    let a = 0;
    if (htmlBorder > 0 && bodyBorder > 0) {
      a = htmlBorder + bodyBorder;
    }
    return parseInt(htmlPadding + htmlMargin + scroll + a, 10);
  },
  // 设置蒙层样式
  setOverlayPropertiesForElement(originEl, targetEl) {
    try {
      const offset = this.offset(originEl);
      const getSize = this.getSize(originEl);
      const elementBounds = {
        bottom: offset.top + getSize.height,
        top: offset.top,
        left: offset.left,
        right: offset.left + getSize.width,
        width: getSize.width,
        height: getSize.height
      };
      const setOverlayPropertiesForElementLeft = this.getElementSpacingOffset('left') + 1;
      const setOverlayPropertiesForElementTop = this.getElementSpacingOffset('top') + 1;
      targetEl.style.top = (elementBounds.top - setOverlayPropertiesForElementTop)  + 'px';
      targetEl.style.left = (elementBounds.left - setOverlayPropertiesForElementLeft)  + 'px';
      targetEl.style.width = elementBounds.width + 'px';
      targetEl.style.height = elementBounds.height + 'px';
    } catch (error) {
      console.error(error);
    }
  },
  getElementInfo(itemEl) {
    if (!itemEl) {
      return null;
    }
    const obj = {
      nodeName: itemEl.nodeName,
      outerHtml: itemEl.outerHtml,
      css: {
        'width': this.getStyle(itemEl, 'width'),
        'height': this.getStyle(itemEl, 'height'),
        'display': this.getStyle(itemEl, 'display'),
        'visibility': this.getStyle(itemEl, 'visibility'),
        'font-size': this.getStyle(itemEl, 'font-size'),
        'font-weight': this.getStyle(itemEl, 'font-weight'),
        'color': this.getStyle(itemEl, 'color'),
        'text-align': this.getStyle(itemEl, 'text-align'),
        'background-color': this.getStyle(itemEl, 'background-color'),
        'background-image': this.getStyle(itemEl, 'background-image'),
        'border-color': this.getStyle(itemEl, 'border-color'),
        'border-style': this.getStyle(itemEl, 'border-style'),
        'border-width': this.getStyle(itemEl, 'border-width')
      },
      attributes: {
      }
    };
    if (!itemEl.children.length) {
      obj.innerText = itemEl.innerText
    }
    if (itemEl.nodeName === 'A') {
      obj.attributes.href = itemEl.getAttribute('href') || "";
    }
    if (itemEl.nodeName === 'INPUT' || itemEl.nodeName === 'TEXTAREA') {
      obj.attributes.placeholder = itemEl.getAttribute('placeholder') || "";
    }
    if (itemEl.nodeName === 'IMG') {
      delete obj.innerText;
      obj.attributes.src = itemEl.getAttribute('src') || "";
    }
    return obj;
},
  /**
 * 纯js实现多div拖拽
 * @param bar, 拖拽触柄
 * @param target, 可拖动窗口
 * @param inWindow, 为true时只能在屏幕范围内拖拽
 * @param callback, 拖拽时执行的回调函数。包含两个参数，target的left和top
 * @returns {*}
 * @private
 */
startDrag: function(bar, target, /* optional */inWindow, /* optional */callback) {
    (function(bar, target, callback) {
        var D = document,
            DB = document.body,
            params = {
                left: 0,
                top: 0,
                currentX: 0,
                currentY: 0
            };
        if(typeof bar == "string") {
            bar = D.getElementById(bar);
        }
        if(typeof target == "string") {
            target = D.getElementById(target);
        }
        bar.style.cursor="-webkit-grab";
        bindHandler(bar, "mousedown", function(e) {
            e.preventDefault();
            params.left = target.offsetLeft;
            params.top = target.offsetTop;
            if(!e){
                e = window.event;
                bar.onselectstart = function(){
                    return false;
                }
            }
            params.currentX = e.clientX;
            params.currentY = e.clientY;
            
            var stopDrag = function() {
                setTimeout(() => {
                  window.isDraging = false;
                }, 200);
                removeHandler(DB, "mousemove", beginDrag);
                removeHandler(DB, "mouseup", stopDrag);
            }, beginDrag = function(e) {
                window.isDraging = true;
                var evt = e ? e: window.event,
                    nowX = evt.clientX, nowY = evt.clientY,
                    disX = nowX - params.currentX, disY = nowY - params.currentY,
                    left = parseInt(params.left) + disX,
                    top = parseInt(params.top) + disY;
                if(inWindow) {
                    var maxTop = DB.offsetHeight - target.offsetHeight ,
                        maxLeft = DB.offsetWidth - target.offsetWidth;
                    if(top < 0) top = 0;
                    if(top > maxTop) top = maxTop;
                    if(left < 0) left = 0;
                    if(left > maxLeft) left = maxLeft;
                }
                if(top<=0) {
                  return;
                }
                //target.style.left = left + "px";
                target.style.right = DB.offsetWidth - left - target.scrollWidth + 10 + "px";
                target.style.top = top + "px";
  
                if (typeof callback == "function") {
                    callback(left, top);
                }
            };
            
            bindHandler(DB, "mouseup", stopDrag);
            bindHandler(DB, "mousemove", beginDrag);
        });
        
        function bindHandler(elem, type, handler) {
            if (window.addEventListener) {
                //false表示在冒泡阶段调用事件处理程序
                elem.addEventListener(type, handler, false);
            } else if (window.attachEvent) {
                // IE浏览器
                elem.attachEvent("on" + type, handler);
            }
        }
  
        function removeHandler(elem, type, handler) {
            // 标准浏览器
            if (window.removeEventListener) {
                elem.removeEventListener(type, handler, false);
            } else if (window.detachEvent) {
                // IE浏览器
                elem.detachEvent("on" + type, handler);
            }
        }
        
    })(bar, target, inWindow, callback);
  }
};