import React from "react"
import { render } from "react-dom"
import { Observable } from "rxjs"
import config from "recompose/rxjsObservableConfig"
import {
  setObservableConfig,
  componentFromStream,
  createEventHandler,
  mapPropsStream,
  compose
} from "recompose"

setObservableConfig(config)


const count = mapPropsStream(props$ => {
  const {
    stream: onInc$,
    handler: onInc
  } = createEventHandler()
  const {
    stream: onDec$,
    handler: onDec
  } = createEventHandler()

  return props$.switchMap(
    props =>
      Observable.merge(
        onInc$.mapTo(1),
        onDec$.mapTo(-1)
      )
        .startWith(0)
        .scan((acc, curr) => acc + curr),
    (props, count) => ({
      ...props,
      count,
      onInc,
      onDec
    })
  )
})
const load = mapPropsStream(props$ =>
  props$.switchMap(
    props =>
      Observable.ajax(
        `https://swapi.co/api/people/${props.count}`
      )
        .pluck("response")
        .startWith({ name: "loading..." })
        .catch(err =>
          Observable.of({ name: "Not found" })
        ),
    (props, person) => ({ ...props, person })
  )
)

const typewriter = mapPropsStream(props$ =>
  props$.switchMap(
    props =>
      Observable.zip(
        Observable.from(props.person.name),
        Observable.interval(100),
        letter => letter
      ).scan((acc, curr) => acc + curr),
    (props, name) => ({
      ...props,
      person: { ...props.person, name }
    })
  )
)

const Counter = props => (
  <div>
    <button onClick={props.onInc}>+</button>
    <button onClick={props.onDec}>-</button>
    <h3>{props.count}</h3>
    <h1>{props.person.name}</h1>
  </div>
)

const CounterWithPersonLoader = compose(
  count,
  load,
  typewriter
)(Counter)

const App = () => (
  <div>
    <CounterWithPersonLoader />
  </div>
)

render(<App />, document.getElementById("root"))
