import bus from '../bus'
import React, {Component} from 'react'

class BarComponent extends Component {
  render(props) {
    return (<div>
      Signals from from the 'FooComponent':
      {props.bus.listen('foo').map(({data}) => JSON.stringify(data)).join(', ')}
    </div>)
  }
}

export default bus.connect(BarComponent)
