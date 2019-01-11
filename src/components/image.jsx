import React from 'react';
import Input from 'antd/lib/input';

import 'antd/lib/input/style';

class Imagg extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      width: 0,
      height: 0,
      src: ''
    };
  }
  setParam(param) {
    
    this.setState({
      src: param['src'],
    }, () => {
      let imgName = param['src'].substring(param['src'].lastIndexOf("/")+1, param['src'].length);
      let img = new Image();
      img.src = param['src'];

      this.setState({
        name: imgName,
        width: img.width,
        height: img.height
      });
    });
    // 还原的时候用
    return {
      src: param['src']
    }
  }
  onSrcChange(e) {
    let value = e.target.value;

    this.state.src = value;
    this.props.onChange('attributes', { 'src': value });
    this.setState({ src: value }, () => {
      let imgName = value.substring(value.lastIndexOf("/")+1, value.length);
      let img = new Image();
      img.src = value;

      this.setState({
        name: imgName,
        width: img.width,
        height: img.height
      });
    });
  }
  render() {
    let { name, width, height, src } = this.state;
    return (
      <div className="m-item img">
        <div className="i-line clearfix">
        {
          src !== '' && src !== 'none' ?
          <div className="img-short">
            <img className="left" src={ src } />
            <div className="left detail">
              <span className="autocut" title={ name }>{ name }</span>
              <span>{ width } × { height }</span>
            </div>
          </div> : <div className="empty"></div>
        }
        </div>
        <div className="i-line clearfix">
          <Input.TextArea onChange={ e => this.onSrcChange(e) } value={ (src=='' || src=='none') ? '请输入图片地址':src }  style={{ maxHeight: "65px", overFlowY: "auto" }} />
        </div>
      </div>
    )
  }
}

export default Imagg;