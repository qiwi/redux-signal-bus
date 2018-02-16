import { EMIT_SIGNAL, ERASE_SIGNAL } from '../action';
import { negate } from 'lodash-es';

export default (state = [], {type, filter, signal}) => {
  let signals;

  switch (type) {
    case EMIT_SIGNAL:
      return state.concat(signal);

    case ERASE_SIGNAL:
      const filtered = state.filter(negate(filter));

      return filtered.length !== state.length?
        filtered :
        state;

    default:
      return state;
  }
};