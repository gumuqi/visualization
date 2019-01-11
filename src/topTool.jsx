import React from 'react';
import Util from './util/index.jsx';
import Tooltip from 'antd/lib/tooltip';
import Message from 'antd/lib/message';
import Icon from 'antd/lib/icon';

import 'antd/lib/tooltip/style';
import 'antd/lib/message/style';

class TopTool extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      versionDetail: {}, //当前版本的详情数据
      cacheArr: [], //编辑过，但是还未保存的配置;每一项是一个数据，第一数据是当前步骤编辑后的状态，第二个数据是下一步编辑前的状态
      currIndex: 0 //定位当前处于第几步
    }
  }
  componentDidMount() {
    Util.startDrag("my-visual-top", "my-editor-container")
  }
  /**
   * 更新缓存列表
   * @param {*最新配置} param 
   */
  updateChche(param) {
    let initData  = param.initData; //编辑前的配置
    let afterData = param.afterData; //编辑后的配置
    let cacheArr  = this.state.cacheArr;
    let currIndex = this.state.currIndex;
    if(cacheArr.length == 0) {
      //如果没编辑过，将第一个编辑的元素的初始状态作为第一步
      cacheArr.push([initData]);
      //afterData加入后一步中
      cacheArr.push([afterData]);
    } else {
      if(cacheArr[currIndex][0].selector == afterData.selector) {
        //如果前后编辑的是一个元素，认为是同一步，直接用最新的替换老的
        cacheArr[currIndex][0] = afterData;
      } else  {
        //如果前后编辑的是不同的元素，将initData合并到前一步，这样回退的时候就能找到之前的状态了
        cacheArr[currIndex].push(initData);
        //afterData加入后一步中
        cacheArr.push([afterData]);
      }
    }

    currIndex = cacheArr.length-1;
    this.setState({
      cacheArr: cacheArr,
      currIndex: currIndex
    });
  }
  /**
   * 将操作列表merge在一起，只保留变化的部分
   * @param {*} list 
   */
  mergeChange(list) {
    let param = {};
    //将同一个元素的修改队列放在一个list里
    //如param = {'#stop': [{...},{...}]}
    list.map( m => {
      m.map( n => {
        let key = n.selector;
        if(param[key] == undefined) {
          param[key] = [];
        }
        param[key].push(n);
      })
    });
    //然后拿最后一次的配置，与第一个相比较，找出变化的部分
    for(let key in param) {
      let arr = param[key];
      if(arr.length > 1) {
        let inDa = arr[0];
        let afDa = arr[arr.length-1];
        for(let attr in inDa.attributes) {
          if(inDa.attributes[attr] == afDa.attributes[attr]) {
            //将不变的部分删除
            delete inDa.attributes[attr];
            delete afDa.attributes[attr];
          }
        }
        for(let attr in inDa.css) {
          if(inDa.css[attr] == afDa.css[attr]) {
            //将不变的部分删除
            delete inDa.css[attr];
            delete afDa.css[attr];
          }
        }
        if(inDa.innerText == afDa.innerText) {
          delete inDa.innerText;
          delete afDa.innerText;
        }
        param[key] = afDa;
      }
    }
    //然后将改变的配置合并到versionDetail中
    return param;
  }
  onSave() {
    let { versionDetail, currIndex, cacheArr } = this.state;
    //保存时将0到currIndex的配置都merge到versionDetail中去
    let list = cacheArr.slice(0, currIndex+1);
    //先将变化的部分找到
    let map  = this.mergeChange(list);
    this.props.onSave(map);
    alert('保存内容' + JSON.stringify(map));
  }
  //后退
  back() {
    let { currIndex, cacheArr } = this.state;
    if(currIndex<=0) {
      return;
    }else{
      currIndex += -1;
    }
    this.props.onCurrChange(cacheArr[currIndex] || {});
    this.setState({ currIndex: currIndex });
  }
  //前进
  forword() {
    let { currIndex, cacheArr } = this.state;
    if(cacheArr.length-1<=currIndex) {
      return;
    }else{
      currIndex += 1;
    }
    this.props.onCurrChange(cacheArr[currIndex] || {});
    this.setState({ currIndex: currIndex });
  }

  render() {
    let { editable, type } = this.props;
    let { currIndex, cacheArr } = this.state;

    return (
      <div id="my-visual-top">
        <div className="f-left">
          <Tooltip title="后退" getPopupContainer={trigger => trigger.parentNode}>
            <Icon type="step-backward" onClick={ e => this.back() } disabled={currIndex<=0? true:false}/>
          </Tooltip>
          <Tooltip title="前进" getPopupContainer={trigger => trigger.parentNode}>
            <Icon type="step-forward" onClick={ e => this.forword() } disabled={cacheArr.length-1<=currIndex? true:false}/>
          </Tooltip>
        </div>
        <span className="verti-line">条件配置</span>
        <div className="f-right">
          <Tooltip title="保存" getPopupContainer={trigger => trigger.parentNode}>
            <Icon type="save" onClick={ e => this.onSave() } />
          </Tooltip>
        </div>
      </div>
    )
  }
}

export default TopTool;