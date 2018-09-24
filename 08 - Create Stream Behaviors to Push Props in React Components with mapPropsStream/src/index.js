import React from "react"
import { render } from "react-dom"
import { Observable } from "rxjs"
import config from "recompose/rxjsObservableConfig"
import {
  setObservableConfig,
  componentFromStream,
  createEventHandler,
  mapPropsStream
} from "recompose"

setObservableConfig(config)
//#endregion

const interval = mapPropsStream(props$ =>
  props$.switchMap(
    props => Observable.interval(1000),
    (props, count) => ({ ...props, count })
  )
)
const Counter = props => <h1>{props.count}</h1>

const CounterWithInterval = interval(Counter)

const App = () => (
  <div>
    <CounterWithInterval />
  </div>
)

render(<App />, document.getElementById("root"))
