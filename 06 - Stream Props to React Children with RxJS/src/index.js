import React, { cloneElement } from "react"
import { render } from "react-dom"
import { Observable } from "rxjs"
import config from "recompose/rxjsObservableConfig"
import {
  setObservableConfig,
  componentFromStream,
  createEventHandler
} from "recompose"

setObservableConfig(config)

const Counter = ({ value, onInc, onDec }) => (
  <div>
    <button onClick={onInc}>+</button>
    <h2>{value}</h2>
    <button onClick={onDec}>-</button>
  </div>
)

const CounterStream = componentFromStream(
  props$ => {
    const {
      handler: onInc,
      stream: onInc$
    } = createEventHandler()
    const {
      handler: onDec,
      stream: onDec$
    } = createEventHandler()

    return props$.switchMap(props =>
      Observable.merge(
        onInc$.mapTo(1),
        onDec$.mapTo(-1)
      )
        .startWith(props.value)
        .scan((acc, curr) => acc + curr)
        .map(value => ({
          ...props,
          value,
          onInc,
          onDec
        }))
        .map(props =>
          cloneElement(props.children, props)
        )
    )
  }
)

const App = () => (
  <div>
    <CounterStream value={3}>
      <Counter />
    </CounterStream>
  </div>
)

render(<App />, document.getElementById("root"))
