import React from 'react';
import ColorPicker from '../colorPicker/colorPicker.jsx';
import Imagg from './image.jsx';

class Background extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: ''
    };
  }
  componentDidMount() {

  }
  setParam(param) {
    this.refs.picker.setColor(param['background-color']);
    this.refs.imagg.setParam({
      src: param['background-image'].replace('url("','').replace('")','')
    });
    // 还原的时候用
    return {
      'background-color': param['background-color'],
      'background-image': param['background-image']
    }
  }
  onColorChange(e) {
    let value = e;
    this.state.backgroundColor = value;
    this.setState({ backgroundColor: value });
    this.props.onChange('css', { 'background-color': value });
  }
  onBackImgChange(type, param) {
    this.props.onChange('css', { 'background-image': 'url(' + param.src + ')' });
  }
  render() {
    return (
      <div>
        <div className="m-item background">
          <div className="i-line clearfix">
            <div className="left">
              <label>背景颜色</label>
            </div>
            <div className="right">
              <ColorPicker ref="picker" left="60px" onChange={ e => this.onColorChange(e) } />
            </div>
          </div>
        </div>
        <div className="m-item">
          <div className="i-line">背景图片</div>
        </div>
        <Imagg ref="imagg" noReset={ true } onChange={ (e,p) => this.onBackImgChange(e,p) }/>
      </div>
    )
  }
}

export default Background;