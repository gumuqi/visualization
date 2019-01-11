import React from 'react';
import Input from 'antd/lib/input';

import 'antd/lib/input/style';

class Target extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      href: ''
    };
  }
  componentDidMount() {

  }
  setParam(param) {
    this.setState({
      href: param.href
    });
    // 还原的时候用
    return {
      href: param.href
    }
  }
  onHrefChange(e) {
    let value = e.target.value;
    this.state.href = value;
    this.setState({ href: value });
    this.props.onChange('attributes', { href: value });
  }
  render() {
    let { href } = this.state;
    return (
      <div className="m-item placeholder">
        <div className="i-line">
          <Input.TextArea onChange={ e => this.onHrefChange(e) } value={ href } style={{ maxHeight: "65px", overFlowY: "auto" }}/>
        </div>
      </div>
    )
  }
}

export default Target;