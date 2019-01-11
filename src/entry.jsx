import React from 'react';
import ReactDOM from 'react-dom';
import MainTool from './mainTool.jsx';
import DomPicker from './domPicker/index.jsx';

import './entry.less';

class Entry extends React.Component {
  static defaultProps = {
    onSave: () => {}
  }
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }
  componentDidMount() {
    this.domPicker = new DomPicker({
      nextDom: document.getElementById('my-editor-container'),
      onSelectElement: (e) => {
        this.refs.mainTool.setParam(e);
      }
    })
    this.domPicker.init();
  }

  /**
   * flag: -1代表回退，渲染的是initData；+1代表前进，渲染的是afterData
   * 例如当前保存了三步，点击回退到第二步，实际上我们要回到的是第三步编辑的初始状态，也就是第三步数据的initData
   * 注意，第三步的initData并不等于第二步的afterData
   */
  setCurrParam(param) {

    //如果前进的话，定位到最后一个操作的元素
    let lastData = param[param.length-1];
    //渲染结束状态
    this.refs.mainTool.setParam(lastData);
    
    param.map( e => {
      this.domPicker.setElementAttributes(e);
    })
  }
  /**
   * 在编辑器上修改参数时
   * @param {*} e 
   */
  onParamChange(e) {
    //将改变的配置渲染到页面上
    this.domPicker.setElementAttributes(e);
  }
  render() {
    return (
      <div>
        
        <MainTool ref="mainTool"
        onChange={ e => this.onParamChange(e) }
        onCurrChange={ e => this.setCurrParam(e) }
        onSave={ e => this.props.onSave(e) }/>
      </div>
    )
  }
}
let container = document.createElement('div');
container.id = "my-editor-container";
document.body.appendChild(container);

ReactDOM.render(<Entry />, container);

/**
 * 页面各个组件初始化
 */
// function init(testDetail, verDetail) {
//   ChoiceElement.init();

//   let topCnt  = document.createElement('div');
//   let mainCnt = document.createElement('div');
//   topCnt.id   = 'my-visual-top';
//   mainCnt.id  = 'my-visual-main';
//   mainCnt.className  = 'open';

//   document.body.appendChild(mainCnt);
//   document.body.appendChild(topCnt);

//   let topObj  = ReactDOM.render(<TopTool />, topCnt);
//   let mainObj = ReactDOM.render(<MainTool />, mainCnt);

//   Util.installEvent(topObj);
//   Util.installEvent(mainObj);

//   topObj.setDetail(testDetail, verDetail);
      
//   //退出编辑
//   topObj.listen('out', function() {

//   })
//   //回退
//   topObj.listen('back', function() {
 
//   })
//   //前进
//   topObj.listen('forward', function() {

//   })
//   /**
//    * flag: -1代表回退，渲染的是initData；+1代表前进，渲染的是afterData
//    * 例如当前保存了三步，点击回退到第二步，实际上我们要回到的是第三步编辑的初始状态，也就是第三步数据的initData
//    * 注意，第三步的initData并不等于第二步的afterData
//    */
//   topObj.listen('setCurrParam', function(param) {

//     //如果前进的话，定位到最后一个操作的元素
//     let lastData = param[param.length-1];
//     //渲染结束状态
//     mainObj.setParam(lastData);
    
//     param.map( e => {
//       ChoiceElement.setElementAttributes(e);
//     })
//   })
//   //参数变化时，触发UI变化
//   mainObj.listen('onChange', function(param) {
//     joinEdited();
//     //将改变的配置渲染到页面上
//     ChoiceElement.setElementAttributes(param);
//   });
//   // 执行还原操作
//   mainObj.listen('onReset', function(param) {
//     joinEdited(true);
//     //将改变的配置渲染到页面上
//     ChoiceElement.setElementAttributes(param);
//   })
//   //选择元素
//   ChoiceElement.listen('selected', function(next) {
//     mainObj.setParam(next);
//   })
  
//   function joinEdited(isReset) {
//     let curDom = mainObj.getParam(); 
//     if(!!curDom.selector) {
//       topObj.updateChche(curDom, isReset);
//     }
//   }
//   let varValue = verDetail.varValue || {};
//   let varList  = varValue.variations || [];
//   ChoiceElement.setElementArrAttributes(varList);
// }