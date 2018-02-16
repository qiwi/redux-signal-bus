// We'll create our own notification bus with ttl, filters, blackjack & hookers over redux.

import { connect } from 'react-redux';
import Signal from './Signal';

import { captureSignal, emitSignal as emit} from '../action/signal';


function emitSignal(name, data, ttl) {
  return emit(new Signal(name, data, ttl));
}

function withBus(component) {
  return connect(({signals}) => ({signals}))(component);
}

function withStore(component) {
  return connect(({store}) => ({store}))(component);
}

export {
  Signal,
  withBus,
  captureSignal,
  emitSignal
};

