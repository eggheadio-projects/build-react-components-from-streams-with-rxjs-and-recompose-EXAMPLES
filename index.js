import { render } from "react-dom"
import { Observable } from "rxjs"
import config from "recompose/rxjsObservableConfig"
import {
  setObservableConfig,
  componentFromStream
} from "recompose"

setObservableConfig(config)

const App = componentFromStream(props$ => {
  return Observable.interval(1000).map(i => (
    <div>{i}</div>
  ))
})

render(<App />, document.getElementById("app"))
