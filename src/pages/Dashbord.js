import React from 'react'
import '../components/css/slidebar.css'
import { Route, Routes } from 'react-router-dom'
import Logout from '../pages/Logout'
import Slidebar from '../components/Slidebar'
import Voucher from '../components/Voucher'
import BalanceList from '../components/BalanceList'
import RecordsList from '../components/RecordsList'
import AccountSetting from '../components/AccountSetting'

const Dashbord = () => {
     return (
          <div>
               <Slidebar>
                    <Routes>
                         <Route path='/voucher' element={<Voucher />}> </Route>
                         <Route path='/balancelist' element={<BalanceList />}> </Route>
                         <Route path='/recordslist' element={<RecordsList />}></Route>
                         <Route path='/setting' element={<AccountSetting />}></Route>
                         <Route path='/logout' element={<Logout />}></Route>
                    </Routes>
               </Slidebar>
          </div>
     )
}

export default Dashbord