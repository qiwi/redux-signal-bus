# redux-signal-bus

We'll create our own notification bus with ttl, filters, blackjack and hookers over redux.

####Inject to store
Since [store.getReducer](https://github.com/reactjs/redux/issues/350) was replaced from redux, there's no tricky way to inject reducer to chain.
So you need to wrap bus instance manually in accordance to your app architecture