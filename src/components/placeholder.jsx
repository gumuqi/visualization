import React from 'react';
import Input from 'antd/lib/input';

import 'antd/lib/input/style';

class Placeholder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      placeholder: ''
    };
  }
  componentDidMount() {

  }
  setParam(param) {
    this.setState({
      placeholder: param['placeholder']
    });
    // 还原的时候用
    return {
      placeholder: param['placeholder']
    }
  }
  onPlaceChange(e) {
    let value = e.target.value;
    this.setState({ placeholder: value });
    this.props.onChange('attributes', {
      placeholder: value
    })
  }
  render() {
    let { placeholder } = this.state;
    return (
      <div className="m-item placeholder">
        <div className="i-line">
          <Input onChange={ e => this.onPlaceChange(e) } value={ placeholder } maxLength={40}/>
        </div>
      </div>
    )
  }
}

export default Placeholder;