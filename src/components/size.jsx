import React from 'react';
import Input from 'antd/lib/input';
import Radio from 'antd/lib/radio';

import 'antd/lib/input/style';
import 'antd/lib/radio/style';

class Size extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: '',
      height: '',
      initDisplay: '',  //保存当前元素的display，当在显示和隐藏之间来回点的时候，才知道该元素是inline、inline-block还是block等
      display: '',
      visibility: '',
      activeIndex: ''
    };
  }
  componentDidMount() {

  }
  setParam(param) {
    let index = 1;
    if(param.display == 'none') {
      //不展示
      index = 3;
    } else if (param.visibility == 'hidden') {
      //占据位置，但是不显示
      index = 2;
    } else {
      index = 1;
    }
    this.setState({
      width: param['width'],
      height: param['height'],
      initDisplay: param['display'],
      display: param['display'],
      visibility: param['visibility'],
      activeIndex: index
    });
    // 还原的时候用
    return {
      width: param['width'],
      height: param['height'],
      display: param['display'],
      visibility: param['visibility']
    }
  }
  onWidthChange(e) {
    let value = e.target.value;
    this.state.width = value;
    this.setState({ width: value });
    this.props.onChange('css', { width: value });
  }
  onHeightChange(e) {
    let value = e.target.value;
    this.state.height = value;
    this.setState({ height: value });
    this.props.onChange('css', { height: value });
  }
  onDisplayChange(e) {
    let value = e.target.value;
    if(value == 3) {
      this.state.display = 'none';
    } else if (value == 2) {
      this.state.visibility = 'hidden';
    } else {
      this.state.display = this.state.initDisplay;
      this.state.visibility = 'visible';
    }

    this.setState({ activeIndex: value });
    this.props.onChange('css', {
      display: this.state.display,
      visibility: this.state.visibility
    });
  }
  render() {
    let { width, height, display, visibility, activeIndex } = this.state;
    if (width.indexOf('px') > 0) {
      width = width.replace('px', '');
      width = parseInt(width) + 'px';
    }
    if (width.indexOf('%') > 0) {
      width = width.replace('%', '');
      width = parseInt(width) + '%';
    }
    if (height.indexOf('px') > 0) {
      height = height.replace('px', '');
      height = parseInt(height) + 'px';
    }
    if (height.indexOf('%') > 0) {
      height = height.replace('%', '');
      height = parseInt(height) + '%';
    }
    return (
      <div className="m-item size">
        <div className="i-line clearfix">
          <div className="left">
            <label>尺寸</label>
          </div>
          <div className="right">
            <span>宽</span><Input maxLength={10} value={ width } onChange={ e => this.onWidthChange(e) } style={{marginRight:"13px"}}/>
            <span>高</span><Input maxLength={10} value={ height } onChange={ e => this.onHeightChange(e) } />
          </div>
        </div>
        <div className="i-line clearfix">
          <div className="left">
            <label>显示</label>
          </div>
          <div className="right">
            <Radio.Group onChange={ e => this.onDisplayChange(e) } value={ activeIndex }>
              <Radio.Button value={ 1 }>显示</Radio.Button>
              <Radio.Button value={ 2 }>隐藏</Radio.Button>
              <Radio.Button value={ 3 }>删除</Radio.Button>
            </Radio.Group>
          </div>
        </div>
      </div>
    )
  }
}

export default Size;