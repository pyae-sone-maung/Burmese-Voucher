import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Form, Segment, Input, Modal, Icon } from 'semantic-ui-react'
import Cookies from 'js-cookie'
import axios from 'axios'
import { accountLoginURL } from '../api/burmese-voucher-api'

const Login = () => {
     let navigate = useNavigate()
     const [errorMessage, setErrorMessage] = useState({
          open: false,
          icon: null,
          message: null
     })

     const handleSubmit = (e) => {
          e.preventDefault();
          const { usrname, usrpassword } = e.target.elements;

          axios({
               method: 'post',
               url: accountLoginURL,
               data: {
                    username: usrname.value,
                    password: usrpassword.value
               }
          }).then(res => {
               const businessInfo = {
                    id: res.data.data.id,
                    businessName: res.data.data.businessName,
                    businessType: res.data.data.businessType,
                    address: res.data.data.address,
                    phone: res.data.data.phone
               }
               Cookies.set('token', res.data.token, {
                    expires: 1,
                    secure: true
               })
               window.sessionStorage.setItem('businessInfo', JSON.stringify(businessInfo));
               window.sessionStorage.setItem('isAuthenticated', JSON.stringify('true'))
               navigate('/dashbord/voucher')
          })
               .catch(err => {
                    err.response.status === 401 ?
                         setErrorMessage(prevState => ({
                              open: true,
                              icon: 'times circle',
                              message: 'password မှားယွင်းနေပါသည်။'
                         }))
                         : err.response.status === 404 ?
                              setErrorMessage(prevState => ({
                                   open: true,
                                   icon: 'times circle',
                                   message: 'username နှင့် password မှားယွင်းနေပါသည်'
                              }))
                              : setErrorMessage(prevState => ({
                                   open: true,
                                   icon: 'exclamation triangle',
                                   message: 'တစ်စုံတစ်ခုမှားယွင်းနေပါသည်။ ဤ၀န်ဆောင်မှုအား လက်ရှိအသုံးပြု၍မရနိုင်သေးပါ။'
                              }))
               })

     }
     return (
          <div className='font-noto bg-indigo-500 w-screen h-screen px-2 lg:px-10 py-20 lg:py-20'>
               <div className='py-16 lg:py-28 bg-glass'>
                    <p className='font-bold text-white text-center text-xl lg:text-2xl'> သင့်လုပ်ငန်းကို အထောက်အကူပြုမည့် </p>
                    <p className='py-5 text-white text-center font-bold text-xl lg:text-2xl uppercase'> Burmese Voucher </p>
                    <br />

                    <Form className=' container grid place-content-center' onSubmit={handleSubmit}>
                         <Segment>
                              <Form.Field className='py-5'>
                                   <Input icon='at' iconPosition='left' placeholder='username' type='text' id='usrname' required></Input>
                              </Form.Field>
                              <Form.Field>
                                   <Input icon='lock' iconPosition='left' placeholder='password' type='password' id='usrpassword' required></Input>
                              </Form.Field>
                              <Form.Field className='py-3'>
                                   <Button className='w-96'> အကောင့်၀င်ရောက်မည်</Button>
                              </Form.Field>
                         </Segment>
                    </Form>
               </div>

               {/* VIEW MODAL FOR LOGIN ALERT  */}
               {
                    errorMessage.open ?
                         <div className='h-screen'>
                              <Modal open={errorMessage.open} size={'tiny'}>
                                   <Modal.Header>
                                        <p className='font-noto text-center text-xl'> <Icon name='sign-in' /> အကောင့်၀င်ရောက်ခြင်း </p>
                                   </Modal.Header>
                                   <Modal.Content>
                                        <p className='font-noto text-lg text-center'> <Icon name={errorMessage.icon} /> {errorMessage.message}</p>
                                   </Modal.Content>
                                   <Modal.Actions style={{ textAlign: 'center' }}>
                                        <Button color='red' size='small' onClick={() => { setErrorMessage(prevState => ({ ...prevState, open: false, icon: null, message: null })) }}> <Icon name='close' /> ပိတ်မည် </Button>
                                   </Modal.Actions>
                              </Modal>
                         </div>
                         : null
               }
          </div>
     )
}

export default Login