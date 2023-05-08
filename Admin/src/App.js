import { AddExistingFlightSchedule, AddNewFlightSchedule} from './components/AddSchedule';
import {Routes,Route} from 'react-router-dom'
import { Register } from './components/Register'
import { Context } from './components/Context';
import { Login } from './components/Login';
import { Logout } from './components/Logout';
import { ViewFlights } from './components/ViewFlights';
import { SearchFlights } from './components/SearchFlights';
import { ViewBookings } from './components/ViewBookings';
import { FilterBookings } from './components/FilterBookings';


function App() {
  return (
    <div className="App">
      <Context>
        <Routes>

          <Route path="/" element={<ViewFlights/>}></Route>
          <Route path="/searchflights" element={<SearchFlights/>}></Route>
          <Route path="/addschedule/newflight" element={<AddNewFlightSchedule/>}></Route>
          <Route path="/addschedule/existingflight" element={<AddExistingFlightSchedule/>}></Route>
          <Route path="/viewbookings" element={<ViewBookings/>}></Route>
          <Route path="/filterbookings" element={<FilterBookings/>}></Route>
          <Route path="/register" element={<Register/>}></Route>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/logout" element={<Logout/>}></Route>
          
        </Routes>
      </Context>
    </div>
  );
}

export default App;
