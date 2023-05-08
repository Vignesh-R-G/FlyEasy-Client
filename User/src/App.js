import {Routes,Route} from 'react-router-dom'
import { Register } from './components/Register';
import { Login } from './components/Login';
import { Context } from './components/Context';
import { ViewFlights } from './components/ViewFlights';
import { SearchFlights } from './components/SearchFlights';
import { Booking } from './components/Booking';
import { MyBookings } from './components/MyBookings';
import {Logout} from './components/Logout'
import { AboutUs } from './components/AboutUs';

function App() {
  return (
    <div className="App">
      <Context>
        <Routes>
          <Route path="/" element={<ViewFlights/>}></Route>
          <Route path="/searchflights" element={<SearchFlights/>}></Route>
          <Route path="/mybookings" element={<MyBookings/>}></Route>
          <Route path="/booking" element={<Booking/>}></Route>
          <Route path="/register" element={<Register/>}></Route>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/aboutus" element={<AboutUs/>}></Route>
          <Route path="/logout" element={<Logout/>}></Route>
        </Routes>
      </Context>
    </div>
  );
}

export default App;
