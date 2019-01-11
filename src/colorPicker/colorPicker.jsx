import React from 'react';
import Picker from './jscolor.jsx';

import SketchPicker from 'react-color';

class ColorPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: '#ffffff', // 颜色值
      show: false // 是否显示颜色面板
    };
  }

  /**
   * 颜色变动回调
   * @param {*} value 
   */
  onColorChange(value) {
    this.setState({
      color: value.hex
    })
    this.props.onChange(value.hex);
  }
  /**
   * 提供给外部设置颜色
   * @param {*} color 
   */
  setColor(color) {
    this.setState({
      color: color
    })
  }
  /**
   * 显示颜色面板
   * @param {*} e 
   */
  showPicker(e) {
    this.setState({
      show: true
    })
  }
  /**
   * 隐藏颜色面板
   * @param {*} e 
   */
  hidePickder(e) {
    this.setState({
      show: false
    })
  }
  render() {
    const { color, show } = this.state;
    const { left } = this.props;

    let styles = {
      pcont: {
        position: "relative",
        display: "inline-block",
        width:"32px",
        height:"32px",
        padding:"4px",
        border:"1px solid #d9d9d9",
        borderRadius:"2px",
        marginBottom:"-11px"
      },
      pcolor: {
        width: "22px",
        height:"22px",
        background: color
      },
      popover: {
        position: 'absolute',
        zIndex: '2',
        left: left
      },
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      }
    }

    return (
        <div>
          <div style={ styles.pcont } onClick={ e => this.showPicker(e) }>
            <div style={ styles.pcolor } />
          </div>
          { 
            show ? 
            <div style={ styles.popover }>
              <div style={ styles.cover } onClick={ e => this.hidePickder(e) }/>
              <SketchPicker color={ color } onChange={ e => this.onColorChange(e) } />
            </div> : null 
          }
        </div>
    )
  }
}

export default ColorPicker;