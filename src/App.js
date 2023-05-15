import React from 'react'
import Kanban1 from './Components/Kanban1.jsx'
import store from "./redux/store";
import { Provider } from "react-redux";
import './App.css'

const App = () => {

  return (
    <Provider store={store}>
        <Kanban1 />
    </Provider>
  )
}

export default App