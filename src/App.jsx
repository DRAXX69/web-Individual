import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Addition from './addition'
import Counter from './Counter'
import Greeting from './Greeting'
import Sum from './Sum'

function App(){
  return(
    <>
    <Addition a = {12} b = {12} />
    </>
  );
}

export default App;
