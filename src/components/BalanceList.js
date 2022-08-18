import React, { useState, useEffect, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { Button, Table, Input, Form, Icon, Modal, Segment, Checkbox, Dimmer, Loader } from 'semantic-ui-react'
import Cookies from 'js-cookie'
import axios from 'axios'
import { balanceVoucherURL, searchBalanceVoucherByDateURL, updateVoucherById } from '../api/burmese-voucher-api'


const BalanceList = () => {
     const [voucher, setVoucher] = useState([])
     const [isLoading, setIsLoading] = useState(true)
     const [alertMessage, setAlertMessage] = useState({
          open: false,
          titleIcon: null,
          title: null,
          messageIcon: null,
          message: null,
     })

     useEffect(() => {
          const balanceVoucher = async () => {
               await axios({
                    method: 'get',
                    url: balanceVoucherURL,
                    headers: {
                         authorization: 'Bearer ' + Cookies.get('token')
                    }
               }).then(res => {
                    setIsLoading(false)
                    setVoucher(res.data);
               }).catch(err => {
                    setAlertMessage(prevState => ({
                         ...prevState,
                         open: true,
                         titleIcon: 'exclamation triangle',
                         title: 'System Alert',
                         messageIcon: 'times circle',
                         message: 'တစ်စုံတစ်ခုမှားယွင်းနေပါသည်။ ဤ၀န်ဆောင်မှုအား လက်ရှိအသုံးပြု၍မရနိုင်သေးပါ။'
                    }))
               })
          }
          balanceVoucher()
     }, [])

     const searchVoucher = (e) => {
          setIsLoading(true)
          const [date] = e.target.elements;
          const voucherDate = new Date(date.value)

          axios({
               method: 'post',
               url: searchBalanceVoucherByDateURL,
               headers: {
                    authorization: 'Bearer ' + Cookies.get('token')
               },
               data: { date: voucherDate }
          }).then(res => {
               setIsLoading(false)
               setVoucher(res.data)
          }).catch(err => {
               setAlertMessage(prevState => ({
                    ...prevState,
                    open: true,
                    titleIcon: 'exclamation triangle',
                    title: 'System Alert',
                    messageIcon: 'times circle',
                    message: 'တစ်စုံတစ်ခုမှားယွင်းနေပါသည်။ ဤ၀န်ဆောင်မှုအား လက်ရှိအသုံးပြု၍မရနိုင်သေးပါ။'
               }))
          })
     }

     // FOR PRINT DOCUMENT
     const [isPrint, setIsPrint] = useState(false)
     const printRef = useRef();
     const getPageMargins = () => {
          return `@page { margin: ${'0.5cm'} ${'16cm'} ${0} ${'1cm'} !important;}`;
     };

     const printPage = useReactToPrint({
          pageStyle: getPageMargins,
          onBeforeGetContent: () => printRef.current.style.display = 'block',
          onAfterPrint: () => printRef.current.style.display = 'none',
          content: () => printRef.current,
          documentTitle: 'Vouncher',
     })

     // FOR BALANCE VIEW MODAL
     const businessInfo = JSON.parse(window.sessionStorage.getItem('businessInfo'));

     const [openBalanceModal, setOpenBalanceModal] = useState(false)
     const [depositeCheck, setDepositeCheck] = useState(false)
     const [balanceVoucher, setBalanceVoucher] = useState([])
     const [voucherIndex, setVoucherIndex] = useState(null)

     const addBalanceAmount = (e) => {
          const [balance] = e.target.elements;
          const inputBalance = Number(balance.value);
          const currentBalance = balanceVoucher.balanceAmount - inputBalance
          setBalanceVoucher(voucher => ({
               ...voucher,
               'depositeAmount': (voucher.depositeAmount + inputBalance) >= voucher.totalAmount || currentBalance <= 0 ? 0 : voucher.depositeAmount + inputBalance,
               'balanceAmount': voucher.balanceAmount - inputBalance < 0 ? 0 : voucher.balanceAmount - inputBalance
          }))
     }

     const saveVoucher = () => {
          axios({
               method: 'patch',
               url: updateVoucherById + '/' + balanceVoucher._id,
               headers: {
                    authorization: 'Bearer ' + Cookies.get('token')
               },
               data: balanceVoucher
          }).then(res => {
               setAlertMessage(prevState => ({
                    ...prevState,
                    open: true,
                    titleIcon: 'save',
                    title: 'ဘောင်ချာသိမ်းဆည်းခြင်း',
                    messageIcon: 'check circle',
                    message: 'ဘောင်ချာသိမ်းဆည်းခြင်း အောင်မြင်ပါသည်။'
               }))
               voucher.splice(voucherIndex, 1, balanceVoucher)
          }).catch(err => {
               setAlertMessage(prevState => ({
                    ...prevState,
                    open: true,
                    titleIcon: 'save',
                    title: 'ဘောင်ချာသိမ်းဆည်းခြင်း',
                    messageIcon: 'times circle',
                    message: 'ဘောင်ချာသိမ်းဆည်းခြင်း မအောင်မြင်ပါ။ တစ်စုံတစ်ခုမှားယွင်းနေပါသည်။'
               }))
          })
     }

     const viewVoucher = (item, index) => {
          setVoucherIndex(index)
          setBalanceVoucher(item)
          setOpenBalanceModal(true)
          setIsPrint(true)
     }

     return (
          <div className='mt-1'>
               <p className='font-noto font-bold text-2xl'> လက်ကျန်ငွေစာရင်းများ </p>
               <div className='mt-5 flex place-content-center lg:place-content-start gap-x-1'>
                    <Form onSubmit={searchVoucher}>
                         <div className='flex gap-x-20'>
                              <Input label='နေ့ရက်' type='date' id='date' required />
                              <Button primary type='submit'> ရှာဖွေမည် </Button>
                         </div>
                    </Form>
               </div>
               <div className='mt-5 overflow-auto h-screen'>
                    <Table celled={true} padded={true}>
                         <Table.Header className='font-noto lg:text-center'>
                              <Table.Row>
                                   <Table.HeaderCell> ဘောင်ချာနံပါတ် </Table.HeaderCell>
                                   <Table.HeaderCell> အမည် </Table.HeaderCell>
                                   <Table.HeaderCell> နေ့ရက် </Table.HeaderCell>
                                   <Table.HeaderCell> စုစုပေါင်း </Table.HeaderCell>
                                   <Table.HeaderCell> လုပ်ဆောင်ရန် </Table.HeaderCell>

                              </Table.Row>
                         </Table.Header>
                         <Table.Body>
                              {
                                   isLoading ?
                                        <Table.Row>
                                             <Table.Cell colSpan={6}>
                                                  <Segment className='h-32'>
                                                       <Dimmer active inverted>
                                                            <Loader> Loading ... </Loader>
                                                       </Dimmer>
                                                  </Segment>
                                             </Table.Cell>
                                        </Table.Row>
                                        :
                                        voucher.map((item, index) => (
                                             <Table.Row className='font-noto lg:text-lg lg:text-center' key={item._id}>
                                                  <Table.Cell> {item.voucherNo} </Table.Cell>
                                                  <Table.Cell> {item.customerName} </Table.Cell>
                                                  <Table.Cell> {new Date(item.date).toLocaleDateString()} </Table.Cell>
                                                  <Table.Cell> {item.totalAmount} ကျပ် </Table.Cell>
                                                  <Table.Cell className='mt-1 lg:mt-0'>
                                                       <Button size='tiny' primary onClick={e => viewVoucher(item, index)}> <Icon name='eye' /> ကြည့်မည် </Button>
                                                  </Table.Cell>
                                             </Table.Row>
                                        ))
                              }
                         </Table.Body>
                    </Table>
               </div>

               {/* VIEW MODAL FOR BALANCE VOUCHER  */}
               {
                    openBalanceModal ?
                         <div className='h-screen'>
                              <Modal open={openBalanceModal} size={'large'}>
                                   <Modal.Header>
                                        <p className='font-noto text-center text-xl lg:text-2xl font-bold'> လက်ကျန်ငွေမှတ်တမ်း </p>
                                   </Modal.Header>
                                   <Modal.Content>
                                        <div className='px-0 py-2'>
                                             <div className=' py-1 -mt-2 grid place-content-center font-noto font-bold text-xl lg:text-2xl'> {businessInfo.businessName} </div>
                                             <div className='py-1 font-noto text-base lg:text-xl grid place-content-center'> {businessInfo.businessType} </div>
                                             <div className='lg:flex lg:place-content-center lg:gap-x-10'>
                                                  <div className='py-1 font-noto text-center text-sm lg:text-lg'> လိပ်စာ - {businessInfo.address} </div>
                                                  <div className='py-1 font-noto text-center text-sm lg:text-lg'> ဖုန်း - {businessInfo.phone} </div>
                                             </div>
                                             <Segment>
                                                  <div className='font-noto text-xs lg:text-base text-right mb-3 mr-10 lg:px-44'>
                                                       <div className='lg:px-10'>
                                                            ဘောင်ချာနံပါတ် - {balanceVoucher.voucherNo}
                                                       </div>
                                                       <div className='lg:px-10'> နေ့ရက် - {new Date(balanceVoucher.date).toLocaleDateString()} </div>
                                                  </div>
                                                  <div className='px-5 mb-3 text-xs lg:text-base'>
                                                       <div className='flex place-items-center gap-x-5 font-bold mb-2'>
                                                            <p className='font-noto'> အမည် - </p>
                                                            <p className='font-noto'> {balanceVoucher.customerName}</p>
                                                       </div>
                                                       <div className='flex place-items-center gap-x-10 font-bold'>
                                                            <p className='font-noto'> ဖုန်း - </p>
                                                            <p className='font-noto'> {balanceVoucher.customerPhone} </p>
                                                       </div>
                                                  </div>
                                                  <div className='container'>
                                                       <Table celled={true} padded={true}>
                                                            <Table.Header className='font-noto text-xs lg:text-base lg:text-center'>
                                                                 <Table.Row>
                                                                      <Table.HeaderCell> စဉ် </Table.HeaderCell>
                                                                      <Table.HeaderCell> ပစ္စည်းအမျိုးအစား </Table.HeaderCell>
                                                                      <Table.HeaderCell> အရေအတွက် </Table.HeaderCell>
                                                                      <Table.HeaderCell> စျေးနှုန်း </Table.HeaderCell>
                                                                      <Table.HeaderCell> သင့်ငွေ </Table.HeaderCell>

                                                                 </Table.Row>
                                                            </Table.Header>
                                                            <Table.Body>
                                                                 {
                                                                      balanceVoucher.items.map((item, index) => (
                                                                           <Table.Row className='font-noto text-xs lg:text-base lg:text-center' key={index}>
                                                                                <Table.Cell> {index + 1} </Table.Cell>
                                                                                <Table.Cell> {item.itemType} </Table.Cell>
                                                                                <Table.Cell> {item.itemQuantity} </Table.Cell>
                                                                                <Table.Cell> {item.itemPrice} ကျပ် </Table.Cell>
                                                                                <Table.Cell> {item.itemQuantity * item.itemPrice} ကျပ် </Table.Cell>
                                                                           </Table.Row>
                                                                      ))
                                                                 }


                                                                 <Table.Row>
                                                                      <Table.Cell colSpan={5}> </Table.Cell>
                                                                 </Table.Row>
                                                                 <Table.Row className='font-noto text-xs lg:text-base font-bold lg:text-center'>
                                                                      <Table.Cell colSpan={3} style={{ border: 'none' }}></Table.Cell>
                                                                      <Table.Cell> စုစုပေါင်း </Table.Cell>
                                                                      <Table.Cell> {balanceVoucher.totalAmount} ကျပ် </Table.Cell>
                                                                 </Table.Row>
                                                                 <Table.Row className='font-noto text-xs lg:text-base font-bold lg:text-center'>
                                                                      <Table.Cell colSpan={3} style={{ border: 'none' }}></Table.Cell>
                                                                      <Table.Cell> စရံငွေ </Table.Cell>
                                                                      <Table.Cell> {balanceVoucher.depositeAmount} ကျပ် </Table.Cell>
                                                                 </Table.Row>
                                                                 <Table.Row className='font-noto text-xs lg:text-base font-bold lg:text-center'>
                                                                      <Table.Cell colSpan={3} style={{ border: 'none' }}></Table.Cell>
                                                                      <Table.Cell> ကျန်ငွေ </Table.Cell>
                                                                      <Table.Cell> {balanceVoucher.balanceAmount} ကျပ် </Table.Cell>
                                                                 </Table.Row>
                                                            </Table.Body>
                                                       </Table>
                                                  </div>
                                             </Segment>
                                        </div>
                                   </Modal.Content>
                                   <Modal.Actions>
                                        <Segment className='text-left flex gap-x-5'>
                                             <Checkbox label='လက်ကျန်ငွေရှင်းမည်' toggle className='font-noto font-bold mt-5' onChange={(e, data) => setDepositeCheck(data.checked)} checked={depositeCheck} />
                                             {
                                                  depositeCheck ?
                                                       <Form className='lg:flex py-3 gap-x-5' onSubmit={addBalanceAmount}>
                                                            <Input icon='dollar sign' iconPosition='left' type='number' min='0' placeholder='ငွေပမာဏ' id='balance' required></Input>
                                                            <div className='py-1 lg:py-0'>
                                                                 <Button primary type='submit' size='large'> <Icon name='plus square' /> ဘောင်ချာသို့ထည့်မည် </Button>
                                                            </div>
                                                       </Form>
                                                       : null
                                             }
                                        </Segment>
                                        <Button primary onClick={saveVoucher} size='large' disabled> <Icon name='save' /> သိမ်းဆည်းမည် </Button>
                                        <Button secondary onClick={printPage} size='large'> <Icon name='print' /> ဘောင်ချာထုတ်မည် </Button>
                                        <Button color='red' size='large' onClick={() => { setOpenBalanceModal(false); setVoucherIndex(null); setDepositeCheck(false) }}> <Icon name='close' /> ပိတ်မည် </Button>
                                   </Modal.Actions>
                              </Modal>
                         </div>
                         : null
               }

               {/* BALANCE VOUCHER UPDATE ALERT AND SYSTE ALERT  */}
               {
                    alertMessage ?
                         <div className='h-screen'>
                              <Modal open={alertMessage.open} size={'tiny'}>
                                   <Modal.Header>
                                        <p className='font-noto text-center text-xl'> <Icon name={alertMessage.titleIcon} /> {alertMessage.title} </p>
                                   </Modal.Header>
                                   <Modal.Content>
                                        <p className='font-noto text-lg text-center'> <Icon name={alertMessage.messageIcon} /> {alertMessage.message} </p>
                                   </Modal.Content>
                                   <Modal.Actions style={{ textAlign: 'center' }}>
                                        <Button color='red' size='small' onClick={() => { setAlertMessage(prevState => ({ ...prevState, open: false, icon: null, message: null })) }}> <Icon name='close' /> ပိတ်မည် </Button>
                                   </Modal.Actions>
                              </Modal>
                         </div>
                         : null
               }

               {/* PRINT DOCUMENT  */}
               {
                    isPrint ?
                         <div className='mt-1'>
                              <div ref={printRef} style={{ display: 'none' }}>
                                   <div className=' py-1 text-center font-noto font-bold text-2xl tracking-wider'> {businessInfo.businessName} </div>
                                   <div className=' font-noto text-center text-base tracking-wide'>{businessInfo.businessType} </div>
                                   <div className='py-1 font-noto text-center text-sm'> လိပ်စာ - {businessInfo.address} </div>
                                   <div className='font-noto text-center text-sm'> ဖုန်း - {businessInfo.phone} </div>
                                   <Segment>
                                        <div className='font-noto text-right text-sm pr-3'>
                                             <p> ဘောင်ချာနံပါတ် - {balanceVoucher.voucherNo} </p>
                                             <p>  နေ့ရက် - {new Date(balanceVoucher.date).toLocaleDateString()} </p>
                                        </div>
                                        <div className='px-5 mb-1 text-sm'>
                                             <div className='flex gap-x-2'>
                                                  <p className='font-noto'> အမည် - </p>
                                                  <p className='font-noto'> {balanceVoucher.customerName}</p>
                                             </div>
                                             <div className='flex py-1 -mb-3 gap-x-5'>
                                                  <p className='font-noto'> ဖုန်း - </p>
                                                  <p className='font-noto'> {balanceVoucher.customerPhone} </p>
                                             </div>
                                        </div>
                                        <Table celled={true}>
                                             <Table.Header className='font-noto text-center text-sm'>
                                                  <Table.Row>
                                                       <Table.HeaderCell> စဉ် </Table.HeaderCell>
                                                       <Table.HeaderCell> ပစ္စည်းအမျိုးအစား </Table.HeaderCell>
                                                       <Table.HeaderCell> အရေအတွက် </Table.HeaderCell>
                                                       <Table.HeaderCell> စျေးနှုန်း </Table.HeaderCell>
                                                       <Table.HeaderCell> သင့်ငွေ </Table.HeaderCell>

                                                  </Table.Row>
                                             </Table.Header>
                                             <Table.Body >
                                                  {
                                                       balanceVoucher.items.map((item, index) => (
                                                            <Table.Row className='font-noto text-center text-sm' key={index}>
                                                                 <Table.Cell> {index + 1} </Table.Cell>
                                                                 <Table.Cell> {item.itemType} </Table.Cell>
                                                                 <Table.Cell> {item.itemQuantity} </Table.Cell>
                                                                 <Table.Cell> {item.itemPrice} ကျပ် </Table.Cell>
                                                                 <Table.Cell> {item.itemQuantity * item.itemPrice} ကျပ် </Table.Cell>
                                                            </Table.Row>
                                                       ))
                                                  }
                                                  <Table.Row>
                                                       <Table.Cell colSpan={5}> </Table.Cell>
                                                  </Table.Row>
                                                  <Table.Row className='font-noto font-bold text-center text-sm'>
                                                       <Table.Cell colSpan={3} style={{ border: 'none' }}></Table.Cell>
                                                       <Table.Cell> စုစုပေါင်း </Table.Cell>
                                                       <Table.Cell> {balanceVoucher.totalAmount} ကျပ် </Table.Cell>
                                                  </Table.Row>
                                                  <Table.Row className='font-noto font-bold text-center text-sm'>
                                                       <Table.Cell colSpan={3} style={{ border: 'none' }}></Table.Cell>
                                                       <Table.Cell> စရံငွေ </Table.Cell>
                                                       <Table.Cell> {balanceVoucher.depositeAmount} ကျပ် </Table.Cell>
                                                  </Table.Row>
                                                  <Table.Row className='font-noto font-bold text-center text-sm'>
                                                       <Table.Cell colSpan={3} style={{ border: 'none' }}></Table.Cell>
                                                       <Table.Cell> ကျန်ငွေ </Table.Cell>
                                                       <Table.Cell> {balanceVoucher.balanceAmount} ကျပ် </Table.Cell>
                                                  </Table.Row>
                                             </Table.Body>
                                        </Table>
                                        <p className='text-center mt-3 font-roboto font-thin tracking-wide' style={{ fontSize: '9px' }}> Developed By Burmese Voucher</p>
                                   </Segment>
                              </div>
                         </div>
                         : null
               }
          </div>
     )
}

export default BalanceList