import React, { useState } from 'react'
import { Button, Form, Icon, Input, Modal } from 'semantic-ui-react'
import Cookies from 'js-cookie'
import axios from 'axios'
import { updateBusinessInfo, updateAccount } from '../api/burmese-voucher-api'

const AccountSetting = () => {
     const businessInfo = JSON.parse(window.sessionStorage.getItem('businessInfo'))
     const [alertMessage, setAlertMessage] = useState({
          open: false,
          title: null,
          titleIcon: null,
          messageIcon: null,
          message: null
     })

     const changeBusinessInfo = (e) => {
          e.preventDefault();
          const [businessName, businessType, address, phoneNo] = e.target.elements;
          const updateBusinessData = {
               businessName: businessName.value || '',
               businessType: businessType.value || '',
               address: address.value || '',
               phone: phoneNo.value || ''
          }
          axios({
               method: 'patch',
               url: updateBusinessInfo + '/' + businessInfo.id,
               headers: {
                    authorization: 'Bearer ' + Cookies.get('token')
               },
               data: updateBusinessData
          }).then(res => {
               setAlertMessage(prevState => ({
                    ...prevState,
                    open: true,
                    title: 'လုပ်ငန်းအချက်အလက် ပြောင်းလဲခြင်း',
                    titleIcon: 'briefcase',
                    messageIcon: 'check circle',
                    message: 'လုပ်ငန်းအချက်အလက် ပြောင်းလဲခြင်း အောင်မြင်ပါသည်။ အကောင့်ထွက်၍ ပြန်လည်၀င်ရောက်ပါ။'
               }));
               e.target.reset();
          }).catch(err => {
               setAlertMessage(prevState => ({
                    ...prevState,
                    open: true,
                    title: 'လုပ်ငန်းအချက်အလက် ပြောင်းလဲခြင်း',
                    titleIcon: 'briefcase',
                    messageIcon: 'exclamation triangle',
                    message: 'တစ်စုံတစ်ခုမှားယွင်းနေပါသည်။ ဤ၀န်ဆောင်မှုအား လက်ရှိအသုံးပြု၍မရနိုင်သေးပါ။'
               }));
          })
     }

     const changeAccountInfo = (e) => {
          e.preventDefault();
          const [newusrname, newpswd, cfmnewpswd] = e.target.elements;
          const updateAccountData = {
               username: (newusrname.value).toLowerCase() || '',
               password: newpswd.value
          }

          if (newpswd.value === cfmnewpswd.value) {
               axios({
                    method: 'patch',
                    url: updateAccount + '/' + businessInfo.id,
                    headers: {
                         authorization: 'Bearer ' + Cookies.get('token')
                    },
                    data: updateAccountData
               }).then(res => {
                    setAlertMessage(prevState => ({
                         ...prevState,
                         open: true,
                         title: 'အသုံးပြုသူအချက်အလက်ပြောင်းလဲခြင်း',
                         titleIcon: 'user',
                         messageIcon: 'check circle',
                         message: 'အသုံးပြုသူအချက်အလက်ပြောင်းလဲခြင်း အောင်မြင်ပါသည်။ အကောင့်ထွက်၍ ပြန်လည်၀င်ရောက်ပါ။'
                    }));
                    e.target.reset();
               }).catch(err => {
                    setAlertMessage(prevState => ({
                         ...prevState,
                         open: true,
                         title: 'အသုံးပြုသူအချက်အလက်ပြောင်းလဲခြင်း',
                         titleIcon: 'user',
                         messageIcon: 'exclamation triangle',
                         message: 'တစ်စုံတစ်ခုမှားယွင်းနေပါသည်။ ဤ၀န်ဆောင်မှုအား လက်ရှိအသုံးပြု၍မရနိုင်သေးပါ။'
                    }))
               })
          } else {
               setAlertMessage(prevState => ({
                    ...prevState,
                    open: true,
                    title: 'အသုံးပြုသူအချက်အလက်ပြောင်းလဲခြင်း',
                    titleIcon: 'user',
                    messageIcon: 'times circle',
                    message: 'စကား၀ှက်အသစ်အတည်ပြုခြင်း မှားယွင်းနေပါသည်'
               }))
          }
     }

     return (
          <div className='md:h-screen'>
               <p className='py-5 font-noto font-bold text-xl lg:text-2xl text-center'> မိမိအကောင့်ကို ပြင်ဆင်ရန် </p>
               <div className='px-5 lg:px-20 lg:py-10 grid gap-y-10 lg:place-content-center lg:flex lg:gap-x-64'>
                    <Form onSubmit={changeBusinessInfo}>
                         <div className='py-4 lg:py-6 grid place-content-start'>
                              <p className='font-noto text-lg lg:text-xl font-bold mb-1 lg:mb-2'> လုပ်ငန်းအချက်အလက်များပြောင်းလဲမည်</p>
                         </div>
                         <div className='py-2 lg:py-4'>
                              <p className='font-noto font-bold mb-1 lg:mb-2'> လုပ်ငန်းအမည် </p>
                              <Input icon='address card' iconPosition='left' placeholder='Business name' id='businessName' className='mt-1 w-80 lg:w-96'></Input>
                         </div>
                         <div className='py-2 lg:py-4'>
                              <p className='font-noto font-bold mb-1 lg:mb-2'> လုပ်ငန်းအမျိုးအစား</p>
                              <Input icon='briefcase' iconPosition='left' placeholder='Type of business' id='businessType' className='mt-1 w-80 lg:w-96'></Input>
                         </div>
                         <div className='py-2 lg:py-4'>
                              <p className='font-noto font-bold mb-1 lg:mb-2'> လိပ်စာအပြည့်အစုံ </p>
                              <Input icon='map marker alternate' iconPosition='left' placeholder='Address' id="address" className='mt-1 w-80 lg:w-96'></Input>
                         </div>
                         <div className='py-2 lg:py-4'>
                              <p className='font-noto font-bold mb-1 lg:mb-2'> ဖုန်းနံပါတ် </p>
                              <Input icon='phone square' iconPosition='left' placeholder='09-xxx, 09-xxx' id='phoneNo' className='mt-1 w-80 lg:w-96'></Input>
                         </div>
                         <div className='py-2 lg:py-4 grid place-content-center'>
                              <Button primary type='submit' disabled> <Icon name='save' /> သိမ်းဆည်းမည် </Button>
                         </div>
                    </Form>

                    <Form onSubmit={changeAccountInfo}>
                         <div className='py-4 lg:py-6 grid place-content-start'>
                              <p className='font-noto text-lg lg:text-xl font-bold mb-1 lg:mb-2'> အသုံးပြုသူအချက်အလက် ပြောင်းလဲမည်</p>
                         </div>
                         <div className='py-2 lg:py-4'>
                              <p className=' font-roboto font-bold mb-1 lg:mb-2'> New Username </p>
                              <Input icon='user' iconPosition='left' type='text' minLength='5' placeholder='New username' id='newusrname' className='mt-1 w-80 lg:w-96'></Input>
                         </div>
                         <div className='py-2 lg:py-4'>
                              <p className=' font-noto font-bold mb-1 lg:mb-2'> စကား၀ှက်အသစ်ထည့်ပါ </p>
                              <Input icon='lock' iconPosition='left' type='password' minLength='6' placeholder='New password' id='newpswd' className='mt-1 w-80 lg:w-96' required></Input>
                         </div>
                         <div className='py-2 lg:py-4'>
                              <p className=' font-noto font-bold mb-1 lg:mb-2'> စကား၀ှက်အသစ် အတည်ပြုပါ </p>
                              <Input icon='lock' iconPosition='left' type='password' minLength='6' placeholder='Confirm new password' id='cfmnewpswd' className='mt-1 w-80 lg:w-96' required></Input>
                         </div>
                         <div className='py-2 lg:py-4 grid place-content-center'>
                              <Button primary type='submit' disabled> <Icon name='save' /> စကား၀ှက်ပြောင်းမည် </Button>
                         </div>
                    </Form>
               </div>

               {/* VIEW MODAL FOR ALERT MESSAGE  */}
               {
                    alertMessage.open ?
                         <div className='h-screen'>
                              <Modal open={alertMessage.open} size={'tiny'}>
                                   <Modal.Header>
                                        <p className='font-noto text-center text-xl'> <Icon name={alertMessage.titleIcon} /> {alertMessage.title} </p>
                                   </Modal.Header>
                                   <Modal.Content>
                                        <p className='font-noto text-lg text-center'> <Icon name={alertMessage.messageIcon} /> {alertMessage.message}</p>
                                   </Modal.Content>
                                   <Modal.Actions style={{ textAlign: 'center' }}>
                                        <Button color='red' size='small' onClick={() => { setAlertMessage(prevState => ({ ...prevState, open: false, title: null, titleIcon: null, messageIcon: null, message: null })) }}> <Icon name='close' /> ပိတ်မည် </Button>
                                   </Modal.Actions>
                              </Modal>
                         </div>
                         : null
               }
          </div >
     )
}

export default AccountSetting