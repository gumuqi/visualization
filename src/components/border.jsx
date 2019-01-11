import React from 'react';
import Input from 'antd/lib/input';
import Select from 'antd/lib/Select';
import Radio from 'antd/lib/radio';

import ColorPicker from '../colorPicker/colorPicker.jsx';

import 'antd/lib/input/style';
import 'antd/lib/select/style';
import 'antd/lib/radio/style';

class Border extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: '',
      style: '线型',
      width: ''
    };
  }
  componentDidMount() {

  }
  setParam(param) {
    this.setState({
      color: param['border-color'],
      style: param['border-style'],
      width: param['border-width']
    });
    this.refs.colorPicker.setColor(param['border-color']);
    // 还原的时候用
    return {
      'border-color': param['border-color'],
      'border-style': param['border-style'],
      'border-width': param['border-width']
    }
  }
  onColorChange(e) {
    let value = e;
    this.state.color = value;
    this.setState({ color: value });
    this.props.onChange('css', { 'border-color': value });
  }
  onStyleChange(e) {
    let value = e;
    this.state.style = value;
    this.setState({ style: value });
    this.props.onChange('css', { 'border-style': value });
  }
  onWidthChange(e) {
    let value = e.target.value;
    this.state.width = value;
    this.setState({ width: value });
    this.props.onChange('css', { 'border-width': value });
  }
  render() {
    let { color, style, width } = this.state;
    if (width.indexOf('px') > 0) {
      width = width.replace('px', '');
      width = parseInt(width) + 'px';
    }
    return (
      <div className="m-item border">
        <div className="i-line clearfix">
          <div className="left">
            <label><ColorPicker ref="colorPicker" onChange={ e => this.onColorChange(e) } placement="top"/></label>
          </div>
          <div className="right">
            <Select onChange={ e => this.onStyleChange(e) } style={{marginRight:"10px"}} value={ style } getPopupContainer={trigger => trigger.parentNode}>
              <Select.Option value="solid">实线</Select.Option>
              <Select.Option value="dashed">虚线</Select.Option>
              <Select.Option value="double">双线</Select.Option>
              <Select.Option value="inherit">继承</Select.Option>
              <Select.Option value="dotted">点</Select.Option>
              <Select.Option value="groove">凹槽</Select.Option>
              <Select.Option value="ridge">垄状</Select.Option>
              <Select.Option value="inset">inset</Select.Option>
              <Select.Option value="outset">outset</Select.Option>
              <Select.Option value="none">无</Select.Option>
            </Select>
            <Input onChange={ e => this.onWidthChange(e) } value={ width } maxLength={10} />
          </div>
        </div>
      </div>
    )
  }
}

export default Border;