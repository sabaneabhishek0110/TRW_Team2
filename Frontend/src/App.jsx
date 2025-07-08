import { useState } from 'react'
import LineChart from './components/LineChart'
import { Route, Routes } from 'react-router-dom'
import OverallDashboard from './pages/OverallDashboard'
import Machine1 from './pages/Machine1'
import Machine2 from './pages/Machine2'
import Machine3 from './pages/Machine3'
import Machine4 from './pages/Machine4'
import ViewHistory from './pages/ViewHistory'
import Home from './pages/Home'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element ={<Home/>}/>
        <Route path='/dash' element ={<OverallDashboard/>}/>
        <Route path='/machine1' element ={<Machine1/>}/>
        <Route path='/machine2' element ={<Machine2/>}/>
        <Route path='/machine3' element ={<Machine3/>}/>
        <Route path='/machine4' element ={<Machine4/>}/>
        <Route path='/viewhistory' element ={<ViewHistory/>}/>
      </Routes>
      
    </>
  )
}

export default App
