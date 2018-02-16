import store, { dispatch } from '../../model/store';
import { debounce } from 'lodash-es';


export const COMPACT_THROTTLE_DELAY = 1000; // TODO get delay from config or make selfbalanced
export const EMIT_SIGNAL = 'EMIT_SIGNAL';
export const CAPTURE_SIGNAL = 'CAPTURE_SIGNAL';
export const LISTEN_SIGNAL = 'LISTEN_SIGNAL';
export const ERASE_SIGNAL = 'ERASE_SIGNAL';

export const listenSignal = filter => (store.getState().signals || []).filter(filter);

export const emitSignal = signal =>
  dispatch({
    type: EMIT_SIGNAL,
    signal
  });

export const eraseSignal = filter =>
  dispatch({
    type: ERASE_SIGNAL,
    filter,
  });

export const captureSignal = filter => {
  compact();
  const signals = listenSignal(filter);
  signals.length && eraseSignal(filter);

  return signals;
};

export const compact = debounce(() => {
  const now = Date.now();
  eraseSignal(item => item.expiresAt >= now);
}, COMPACT_THROTTLE_DELAY);
