import React from 'react';
import Collapse from 'antd/lib/collapse';
import Size from './components/size.jsx';
import Imagg from './components/image.jsx';
import Text from './components/text.jsx';
import Background from './components/background.jsx';
import Border from './components/border.jsx';
import Placeholder from './components/placeholder.jsx';
import Target from './components/target.jsx';

import TopTool from './topTool.jsx';
import 'antd/lib/collapse/style';

class MainTool extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        isActive: false,  // 当选中一个元素后激活
        initParam: {}, //保存点击元素时的初始状态，用于回退
        param: {},
        isOpen: true
      }
  }
  componentDidMount() {

  }
  setParam(param) {

    this.state.initParam = JSON.parse(JSON.stringify(param));
    this.state.param = JSON.parse(JSON.stringify(param));
    this.setState({ param: param, isActive: true }, () => {
        this.refs.size.setParam(param.css);
        this.refs.border.setParam(param.css);
        if(this.refs.background) {
            this.refs.background.setParam(param.css);
        }
        if(this.refs.text) {
            this.refs.text.setParam(param);
        }
        if(this.refs.imagg) {
            this.refs.imagg.setParam(param.attributes);
        }
        if(this.refs.placeholder) {
            this.refs.placeholder.setParam(param.attributes);
        }
        if(this.refs.target) {
            this.refs.target.setParam(param.attributes);
        }
    });
  }
  getParam() {
      let initData  = JSON.parse(JSON.stringify(this.state.initParam));
      let afterData = JSON.parse(JSON.stringify(this.state.param));

      return {
        selector: initData.selector,
        initData: initData,
        afterData: afterData
      }
  }
  onChange(type, param) {
    if(!this.state.param.selector) {
        //没选中元素时，不触发
        return;
    }

    if(type == 'top') {
        Object.assign(this.state.param, param);
    } else {
        Object.assign(this.state.param[type], param);
    }
    this.joinEdited();
    this.props.onChange(this.state.param);
  }
  joinEdited() {
    let curDom = this.getParam(); 
    if(!!curDom.selector) {
      this.refs.topTool.updateChche(curDom);
    }
  }
  render() {
    let { isActive, isOpen, param } = this.state;
    let css  = param.css || {};
    let attr = param.attributes || {};
    let template = (
        <div>
            <TopTool ref="topTool" onSave={ e => this.props.onSave(e) } onCurrChange={ e => this.props.onCurrChange(e) }/>            
            <Collapse className={ isOpen? "":"hide" } bordered={false} defaultActiveKey={['size','imagg','text','background','border','placeholder','target']}>
                <Collapse.Panel header="尺寸" key="size">
                    <Size ref="size" onChange={ (e,p) => this.onChange(e,p) }></Size>
                </Collapse.Panel>
                {
                    param.nodeName==="IMG"?
                    <Collapse.Panel header="图片" key="imagg">
                        <Imagg ref="imagg" onChange={ (e,p) => this.onChange(e,p) }></Imagg>
                    </Collapse.Panel> : null
                }
                {
                    param.innerText!==undefined?
                    <Collapse.Panel header="文本" key="text">
                        <Text ref="text" onChange={ (e,p) => this.onChange(e,p) }></Text>
                    </Collapse.Panel> : null
                }
                {
                    param.nodeName!=="IMG"?
                    <Collapse.Panel header="背景" key="background">
                        <Background ref="background" onChange={ (e,p) => this.onChange(e,p) }></Background>
                    </Collapse.Panel> : null
                }
                <Collapse.Panel header="边框" key="border">
                    <Border ref="border" onChange={ (e,p) => this.onChange(e,p) }></Border>
                </Collapse.Panel>
                {
                    attr.placeholder!==undefined?
                    <Collapse.Panel header="提示信息" key="placeholder">
                        <Placeholder ref="placeholder" onChange={ (e,p) => this.onChange(e,p) }></Placeholder>
                    </Collapse.Panel> : null
                }
                {
                    attr.href!==undefined?
                    <Collapse.Panel header="目标链接" key="target">
                        <Target ref="target" onChange={ (e,p) => this.onChange(e,p) }></Target>
                    </Collapse.Panel> : null
                }
            </Collapse>
        </div>
    );
    return (
        <div id="my-visual-main">
            {template}
        </div>
    )
  }
}

export default MainTool;