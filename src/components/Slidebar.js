import React, { useState } from 'react'
import { FaFileInvoice, FaMoneyBill, FaHistory, FaBars } from 'react-icons/fa'
import { MdManageAccounts, MdLogout } from 'react-icons/md'
import { NavLink } from 'react-router-dom'

const Slidebar = ({ children }) => {
     const [isOpen, setIsOpen] = useState(false);
     const toggle = () => setIsOpen(!isOpen);
     const menuItem = [
          {
               path: '/dashbord/voucher',
               name: 'ဘောင်ချာ',
               icon: <FaFileInvoice />
          },
          {
               path: '/dashbord/balancelist',
               name: 'လက်ကျန်ငွေစာရင်း',
               icon: <FaMoneyBill />
          },
          {
               path: '/dashbord/recordslist',
               name: 'မှတ်တမ်းများ',
               icon: <FaHistory />
          },
          {
               path: '/dashbord/setting',
               name: 'အကောင့်ပြင်ဆင်ရန်',
               icon: <MdManageAccounts />
          },
          {
               path: '/dashbord/logout',
               name: 'အကောင့်ထွက်ရန်',
               icon: <MdLogout />
          }

     ]
     return (
          <div>
               <div className='container flex'>
                    <div className="slidebar bg-navy-dark text-white transition-all duration-500 ease-in-out" style={{ width: isOpen ? "300px" : "60px" }}>
                         <div className="flex px-5 py-5 gap-x-10 border-b-2 border-blue-900 mb-5">
                              <p className='font-roboto font-bold text-lg lg:text-xl'
                                   style={{ display: isOpen ? "block" : "none" }}>
                                   Burmese Voucher
                              </p>
                              <div className="bars text-xl py-3 lg:py-1" style={{ marginLeft: isOpen ? "10px" : "0px" }}>
                                   <FaBars className='cursor-pointer' onClick={toggle} />
                              </div>
                         </div>
                         {
                              menuItem.map((item, index) => (
                                   <NavLink to={item.path} key={index} className="flex px-5 py-5 gap-x-5 text-white font-bold font-roboto transition-all hover:transition-all hover:text-black hover:bg-blue-200" activeclassname='active'>
                                        <div className="text-xl lg:text-2xl"> {item.icon}</div>
                                        <div className="text-base lg:text-lg font-noto" style={{ display: isOpen ? "block" : "none" }}> {item.name}</div>
                                   </NavLink>
                              ))
                         }
                    </div>
                    <main> {children}</main>
               </div>
          </div>
     )
}

export default Slidebar