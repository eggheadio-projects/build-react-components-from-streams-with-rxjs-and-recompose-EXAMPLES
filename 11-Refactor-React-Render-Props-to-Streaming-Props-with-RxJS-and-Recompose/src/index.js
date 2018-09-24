import "./styles.css"
import React from "react"
import ReactDOM from "react-dom"
import { Observable } from "rxjs"
import {
  setObservableConfig,
  componentFromStream,
  createEventHandler
} from "recompose"
import rxjsConfig from "recompose/rxjsObservableConfig"
setObservableConfig(rxjsConfig)

const ToggleStream = componentFromStream(props$ => {
  const {
    handler: toggle,
    stream: toggle$
  } = createEventHandler()

  const on$ = Observable.merge(
    toggle$,
    Observable.interval(1000)
  )
    .startWith(true)
    .scan(bool => !bool)

  return props$.combineLatest(on$, (props, on) =>
    props.render({
      on,
      toggle
    })
  )
})

class Toggle extends React.Component {
  static defaultProps = { onToggle: () => {} }
  state = { on: false }
  toggle = () =>
    this.setState(
      ({ on }) => ({ on: !on }),
      () => this.props.onToggle(this.state.on)
    )
  render() {
    return this.props.render({
      on: this.state.on,
      toggle: this.toggle
    })
  }
}

function MyToggle({ on, toggle }) {
  return (
    <button onClick={toggle}>{on ? "on" : "off"}</button>
  )
}

function App() {
  return (
    <ToggleStream
      onToggle={on => console.log("toggle", on)}
      render={({ on, toggle }) => (
        <div>
          {on ? "The button is on" : "The button is off"}
          <Switch on={on} onClick={toggle} />
          <hr />
          <MyToggle on={on} toggle={toggle} />
        </div>
      )}
    />
  )
}

/*
 *
 *
 * Below here are irrelevant
 * implementation details...
 *
 *
 */

function Switch({ on, className = "", ...props }) {
  return (
    <div className="toggle">
      <input className="toggle-input" type="checkbox" />
      <button
        className={`${className} toggle-btn ${
          on ? "toggle-btn-on" : "toggle-btn-off"
        }`}
        aria-expanded={on}
        {...props}
      />
    </div>
  )
}

ReactDOM.render(
  <div
    style={{
      marginTop: 40,
      display: "flex",
      justifyContent: "center",
      flexDirection: "column",
      textAlign: "center"
    }}
  >
    <App />
  </div>,
  document.getElementById("root")
)
