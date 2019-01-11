/**
 * 可视化实验：选择元素和渲染
 * hubbleoverlay
 */
import Util from '../util/index.jsx';

class DomPicker {
  constructor(props) {
    this.lastKnownHoverElement = null;
    this.selectedElement = null;
    // 元素的原始属性集合 elementOriginalAttributes = { path: {xx:''} }
    this.elementOriginalAttributes = {};
    this.types = {
      'hover': 'my-abtest-hover',
      'selected': 'my-abtest-selected'
    };
    this.nextDom = props.nextDom;
    this.onSelectElement = props.onSelectElement || function(){};
  }
  init() {
    this.setupEventListeners();
  }
  //禁止交互的元素
  forbidElement(nodeName) {
    let bool = true;
    if (['BODY','HTML'].indexOf(nodeName) > -1) {
      bool = false;
    }
    return bool;
  }
  // 重新设置蒙层样式
  rerender() {
    const $hubbleAbtestCursorHover = Util.querySelector('div.my-abtest-hover');
    const $hubbleAbtestCursorSelected = Util.querySelector('div.my-abtest-selected');
    if ($hubbleAbtestCursorHover) {
      Util.setOverlayPropertiesForElement(this.lastKnownHoverElement, $hubbleAbtestCursorHover);
    }
    if ($hubbleAbtestCursorSelected) {
      Util.setOverlayPropertiesForElement(this.selectedElement, $hubbleAbtestCursorSelected);
    }
  }
  highlight(e) {
    const selector = e.selector || '';
    const $elArr = Util.querySelectorAll(selector);
    for(let i = 0; i < $elArr.length; i += 1) {
      let $div = document.createElement('div');
      $div.className = 'my-abtest-cursor ' + this.types[e.type];
      document.body.insertBefore($div, Util.querySelector('.my-abtest-page-overlay'));
      
      Util.setOverlayPropertiesForElement($elArr[i], $div);
    }
  }
  unhighlight(e) {
    const selector = '.my-abtest-' + e.type;
    const $elArr = Util.querySelectorAll(selector);
    for(let i = 0; i < $elArr.length; i += 1) {
      Util.removeChild($elArr[i]);
    }
  }
  handleHover(e) {
    const $element = this.getElementFromPoint(e);
    if ($element && $element !== this.lastKnownHoverElement) {
      const selector = Util.getDomSelector($element);
      const elementInfo = Util.getElementInfo($element);
      if (!this.forbidElement(elementInfo.nodeName)) {
        return false;
      }
      if (selector) {
        this.unhighlight({
          type: 'hover'
        });
        this.highlight({
          selector: selector,
          type: 'hover'
        });
      }
    }
    this.lastKnownHoverElement = $element;
  }
  unHover() {
    this.unhighlight({
      type: 'hover'
    });
    this.lastKnownHoverElement = null;
  }
  handleClick(e) {
    this.unHover();
    const $element = this.getElementFromPoint(e);
    const selector = Util.getDomSelector($element);
    const elementInfo = Util.getElementInfo($element);
    if (!this.forbidElement(elementInfo.nodeName)) {
      return false;
    }
    if (elementInfo) {
      this.unhighlight({
        type: 'selected'
      });
      this.highlight({
        selector: selector,
        type: 'selected'
      });
      var obj = {
        selector: selector,
        css: elementInfo.css,
        attributes: elementInfo.attributes,
        nodeName: elementInfo.nodeName
      };
      if (typeof elementInfo.innerText !== 'undefined') {
        obj.innerText = elementInfo.innerText;
      }

      this.onSelectElement(obj);
      console.log(obj)
      console.log('当前选中元素的原始版本属性信息:', this.getElementOriginalAttributes(selector))
      this.selectedElement = $element;
    }
  }
  handleEvent(e) {
    const target = e.target;
    if (
      !Util.isParent(target, document.getElementById('my-editor-container'))
    ) {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "contextmenu") {
        return false;
      }
      switch (e.type) {
        case 'mousemove':
          this.handleHover(e);
          break;
        case 'click':
          this.handleClick(e);
          break;
        case 'mouseleave':
          this.unHover();
          break;
        default:
          return false;      
      }
    } else {
      this.unHover();
    }
  }
  getElementFromPoint(e) {
    const $overlay =  document.getElementsByClassName('my-abtest-page-overlay')[0];
    let $element = null;
    if ($overlay) {
      $overlay.style.width = '0';
      $element = document.elementFromPoint(e.clientX, e.clientY);
      $overlay.style.width = '';
    }
    return $element;
  }
  setupEventListeners() {
    const hubbleoverlay = document.createElement('hubbleoverlay');
    hubbleoverlay.className = 'my-abtest-page-overlay';
    
    document.body.addEventListener("mousemove", this.handleEvent.bind(this));
    document.body.addEventListener("click", this.handleEvent.bind(this));
    document.body.addEventListener("mouseleave", this.handleEvent.bind(this));
    document.body.addEventListener("contextmenu", this.handleEvent.bind(this));
    window.addEventListener('resize', () => {
      setTimeout(() => this.rerender(), 50);
    });
    window.addEventListener('scroll', () => {
      setTimeout(() => this.rerender(), 50);
    });

    if (this.nextDom) {
      document.body.insertBefore(hubbleoverlay, this.nextDom)
    } else {
      document.body.appendChild(hubbleoverlay);
    }
  }
  // 选中后元素样式重新渲染
  setElementAttributes(variation) {
    let bool = false;
    if (!variation || !variation.selector) {
      return false;
    }
    this.unHover();

    const $element = Util.querySelector(variation.selector);
    if ($element) {
      for (let key in variation.css) {
        if (variation.css.hasOwnProperty(key)) {
          $element.style[key] = variation.css[key];
        }
      }
      for (let key in variation.attributes) {
        if (variation.attributes.hasOwnProperty(key)) {
          $element.setAttribute(key,variation.attributes[key]);
        }
      }
      for (let ii in variation) {
        if (variation.hasOwnProperty(ii)) {
          if (['css', 'attributes', 'nodeName', 'selector'].indexOf(ii) === -1) {
            $element[ii] = variation[ii];
          }
        }
      }
      // 选中后元素的蒙层重新渲染
      if (this.selectedElement) {
        Util.setOverlayPropertiesForElement(this.selectedElement, Util.querySelector('.my-abtest-selected'));
      }
      bool = true;
    }
    return bool;
  }
  // 外部调用：绘制
  setElementArrAttributes(varList) {
    let notRender = [];
    let _settimeNum = 0;
    varList.map( e => {
      const ttBol = this.setElementAttributes(e);
      if (!ttBol) {
        notRender.push(e);
      }
    } );

    const tt = () => {
      let notRenderNum = 0;
      let ttnotRenderArr = [];
      notRender.map( e => {
        const ttBol = this.setElementAttributes(e);
        if (!ttBol) {
          notRenderNum ++;
          ttnotRenderArr.push(e);
        }
      });

      notRender = ttnotRenderArr;
      if (notRenderNum > 0) {
        _settimeNum = setTimeout(() => {
            tt();
        }, 0);
      } else {
        clearTimeout(_settimeNum); 
      }
    };
    tt();
  }
  // 返回某个指定某个元素的原始属性
  // selector 表示元素的选择器
  getElementOriginalAttributes(selector) {
    return this.elementOriginalAttributes[selector];
  }
 }

export default DomPicker;
