import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Icon, Modal } from 'semantic-ui-react'
import Cookies from 'js-cookie'

const Logout = () => {
     let navigate = useNavigate();
     const [open, setOpen] = useState(true)

     const logout = () => {
          window.sessionStorage.clear()
          Cookies.remove('token')
          navigate('/')
     }

     return (
          <div className='h-screen'>
               <Modal open={open} size={'tiny'}>
                    <Modal.Header>
                         <p className='font-noto text-2xl font-bold tracking-wider'> <Icon name='sign-out' /> အကောင့်ထွက်ရန်</p>
                    </Modal.Header>
                    <Modal.Content>
                         <p className='font-noto text-xl px-5'> သင့်အကောင့်မှထွက်ရန် သေချာပြီလား? </p>
                    </Modal.Content>
                    <Modal.Actions>
                         <Button color='red' onClick={() => { setOpen(false); navigate('/dashbord/voucher') }} size='large'> <Icon name='close' /> မထွက်သေးပါ </Button>
                         <Button color='blue' onClick={logout} size='large'> <Icon name='check' /> ထွက်မည် </Button>
                    </Modal.Actions>
               </Modal>
          </div>
     )
}

export default Logout