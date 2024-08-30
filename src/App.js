import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';
import Home from'./Home'
import Calculator from './Calculator';
import {Routes, Route} from 'react-router-dom'
import GetStarted from './getStarted';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home/>}></Route>
      <Route path='/getStarted' element={<GetStarted/>}></Route>
    </Routes>
  );
}

export default App;
