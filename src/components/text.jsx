import React from 'react';
import Input from 'antd/lib/input';
import Select from 'antd/lib/Select';
import Radio from 'antd/lib/radio';
import Icon from 'antd/lib/icon';

import 'antd/lib/input/style';
import 'antd/lib/select/style';
import 'antd/lib/radio/style';

import ColorPicker from '../colorPicker/colorPicker.jsx';
class Text extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      innerText: undefined,
      color: '',
      size: '',
      weight: '粗细',
      align: ''
    };
  }
  componentDidMount() {

  }
  setParam(param) {
    this.setState({
      innerText: param['innerText'],
      color: param.css['color'],
      size: param.css['font-size'],
      weight: param.css['font-weight'],
      align: param.css['text-align']
    })
    this.refs.picker.setColor(param.css['color']);
    // 还原的时候用
    return {
      innerText: param['innerText'],
      css: {
        'color': param.css['color'],
        'font-size': param.css['font-size'],
        'font-weight': param.css['font-weight'],
        'text-align': param.css['text-align']
      }
    }
  }
  onTextChange(e) {
    let value = e.target.value;
    this.state.innerText = value;
    this.setState({ innerText: value });
    this.props.onChange('top', { 'innerText': value });
  }
  onColorChange(e) {
    let value = e;
    this.state.color = value;
    this.setState({ color: value });
    this.props.onChange('css', { 'color': value });
  }
  onSizeChange(e) {
    let value = e.target.value;
    this.state.size = value;
    this.setState({ size: value });
    this.props.onChange('css', { 'font-size': value });
  }
  onWeightChange(e) {
    let value = e;
    this.state.weight = value;
    this.setState({ weight: value });
    this.props.onChange('css', { 'font-weight': value });
  }
  onAlignChange(e) {
    let value = e.target.value;
    this.state.align = value;
    this.setState({ align: value });
    this.props.onChange('css', { 'text-align': value });
  }
  render() {
    let { innerText, color, size, weight, align } = this.state;
   
    if (size.indexOf('px') > 0) {
      size = size.replace('px', '');
      size = parseInt(size) + 'px';
    }
    return (
      <div className="m-item text">
        {
          innerText!== undefined ?
          <div className="i-line clearfix">
            <Input.TextArea onChange={ e => this.onTextChange(e) } value={ innerText }/>
          </div> : null
        }
        <div className="i-line clearfix">
          <div className="left">
            <label><ColorPicker ref="picker" onChange={ e => this.onColorChange(e) }/></label>
          </div>
          <div className="right">
            <Input onChange={ e => this.onSizeChange(e) } value={ size } maxLength={10} placeholder="字号"/>
            <Select onChange={ e => this.onWeightChange(e) } value={ weight } getPopupContainer={trigger => trigger.parentNode}>
              <Select.Option value="bold">粗体</Select.Option>
              <Select.Option value="normal">正常</Select.Option>
              <Select.Option value="lighter">细体</Select.Option>
              <Select.Option value="100">100</Select.Option>
              <Select.Option value="200">200</Select.Option>
              <Select.Option value="300">300</Select.Option>
              <Select.Option value="400">400</Select.Option>
              <Select.Option value="500">500</Select.Option>
              <Select.Option value="600">600</Select.Option>
              <Select.Option value="700">700</Select.Option>
              <Select.Option value="800">800</Select.Option>
              <Select.Option value="900">900</Select.Option>
            </Select>
            </div>
        </div>
        <div className="i-line clearfix">
          <div className="left">
            <label>对齐</label>
          </div>
          <div className="right">
            <Radio.Group onChange={ e => this.onAlignChange(e) } value={ align } getPopupContainer={trigger => trigger.parentNode}>
              <Radio.Button value="left"><Icon type="align-left" style={{fontSize:"16px"}}/></Radio.Button>
              <Radio.Button value="center"><Icon type="align-center" style={{fontSize:"16px"}}/></Radio.Button>
              <Radio.Button value="right"><Icon type="align-right" style={{fontSize:"16px"}}/></Radio.Button>
            </Radio.Group>
          </div>
        </div>
      </div>
    )
  }
}

export default Text;