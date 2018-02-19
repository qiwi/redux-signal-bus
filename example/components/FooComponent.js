import bus from '../bus'
import React, {Component} from 'react'

class FooComponent extends Component {
  doSomething() {
    this.props.bus.emit('foo', {bar: 'baz'})
  }
  render() {
    return (<div>
      <a onClick={this.doSomething.bind(this)}>click</a>
    </div>)
  }
}

export default bus.connect(FooComponent)
