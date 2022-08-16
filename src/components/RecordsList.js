import React, { useEffect, useState } from 'react'
import { Button, Table, Pagination, Input, Form, Icon, Modal, Segment, Dimmer, Loader } from 'semantic-ui-react'
import Cookies from 'js-cookie'
import axios from 'axios'
import { recordVoucherURL, deleteVoucherById, searchRecordVoucherByDateURL } from '../api/burmese-voucher-api'

const RecordsList = () => {
     const [voucher, setVoucher] = useState([])
     const [totalPage, setTotalPage] = useState(1);
     const [activePage, setActivePage] = useState(1)
     const [isLoading, setIsLoading] = useState(true)

     const [alertMessage, setAlertMessage] = useState({
          open: false,
          titleIcon: null,
          title: null,
          messageIcon: null,
          message: null,
     })

     useEffect(() => {
          const recordVoucher = () => {
               axios({
                    method: 'get',
                    url: recordVoucherURL,
                    headers: {
                         authorization: 'Bearer ' + Cookies.get('token')
                    }
               }).then(res => {
                    setVoucher(res.data.data)
                    setIsLoading(false)
                    setTotalPage(res.data.meta.totalPage)
               }).catch(err => {
                    setAlertMessage(prevState => ({
                         ...prevState,
                         open: true,
                         titleIcon: 'exclamation triangle',
                         title: 'System Alert',
                         messageIcon: 'times circle',
                         message: 'System ချို့ယွင်းချက်ဖြစ်ပေါ်နေပါသည်။ ဤ၀န်ဆောင်မှုအား လက်ရှိအသုံးပြု၍မရနိုင်သေးပါ။'
                    }))
                    setIsLoading(false)
               })
          }
          recordVoucher()
     }, [])

     const searchVoucher = (e) => {
          setIsLoading(true)
          const [date] = e.target.elements;
          const voucherDate = new Date(date.value)

          axios({
               method: 'post',
               url: searchRecordVoucherByDateURL,
               headers: {
                    authorization: 'Bearer ' + Cookies.get('token')
               },
               data: { date: voucherDate }
          }).then(res => {
               setIsLoading(false)
               setVoucher(res.data);
               document.getElementById('pagination').classList.add('hidden')
          }).catch(err => {
               setAlertMessage(prevState => ({
                    ...prevState,
                    open: true,
                    titleIcon: 'exclamation triangle',
                    title: 'System Alert',
                    messageIcon: 'times circle',
                    message: 'System ချို့ယွင်းချက်ဖြစ်ပေါ်နေပါသည်။ ဤ၀န်ဆောင်မှုအား လက်ရှိအသုံးပြု၍မရနိုင်သေးပါ။'
               }))
          })
     }

     // VIEW RECORD VOUCHER
     const [openRecordModal, setOpenRecordModal] = useState(false)
     const [recordVoucher, setRecordVoucher] = useState([])

     const viewVoucher = (item) => {
          setOpenRecordModal(true)
          setRecordVoucher(item)
     }

     // DELETE RECORD VOUCHER
     const [openDeleteModal, setOpenDeleteModal] = useState({
          confirm: false,
          voucherId: null,
          voucherIndex: null,
     }
     )

     const deleteVoucher = (id, index) => {
          setOpenDeleteModal(prevState => ({
               ...prevState,
               confirm: true,
               voucherId: id,
               voucherIndex: index
          }));
     }

     const confirmDelete = () => {
          const id = openDeleteModal.voucherId
          const index = openDeleteModal.voucherIndex;

          axios({
               method: 'delete',
               url: deleteVoucherById + '/' + id,
               headers: {
                    authorization: 'Bearer ' + Cookies.get('token')
               }
          }).then(res => {
               setOpenDeleteModal(prevState => ({
                    ...prevState,
                    confirm: false,
                    voucherId: null,
                    voucherIndex: null
               }));
               voucher.splice(index, 1)
          }).catch(err => {
               setAlertMessage(prevState => ({
                    ...prevState,
                    open: true,
                    titleIcon: 'exclamation triangle',
                    title: 'System Alert',
                    messageIcon: 'times circle',
                    message: 'System ချို့ယွင်းချက်ဖြစ်ပေါ်နေပါသည်။ ဤ၀န်ဆောင်မှုအား လက်ရှိအသုံးပြု၍မရနိုင်သေးပါ။'
               }))
          })

     }

     // PAGINATION
     const paginateVoucher = (e, { activePage }) => {
          setIsLoading(true)
          setActivePage(activePage)
          axios({
               method: 'get',
               url: recordVoucherURL + '?page=' + activePage,
               headers: {
                    authorization: 'Bearer ' + Cookies.get('token')
               }
          }).then(res => {
               setIsLoading(false)
               setVoucher(res.data.data);
          })
     }

     return (
          <div className='mt-1'>
               <p className='font-noto font-bold text-2xl px-1'> ဘောင်ချာမှတ်တမ်းများ </p>
               <div className='mt-5 flex place-content-center lg:place-content-start gap-x-1'>
                    <Form onSubmit={searchVoucher}>
                         <div className='flex gap-x-20'>
                              <Input label='နေ့ရက်' type='date' id='date' required />
                              <Button primary type='submit'> ရှာဖွေမည် </Button>
                         </div>
                    </Form>
               </div>
               <div className='mt-5 overflow-auto h-screen'>
                    <Table celled={true} padded={true} size='large'>
                         <Table.Header className='font-noto lg:text-center'>
                              <Table.Row>
                                   <Table.HeaderCell> စဉ် </Table.HeaderCell>
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
                                                  <Table.Cell> {index + 1} </Table.Cell>
                                                  <Table.Cell> {item.voucherNo} </Table.Cell>
                                                  <Table.Cell> {item.customerName} </Table.Cell>
                                                  <Table.Cell> {new Date(item.date).toLocaleDateString()} </Table.Cell>
                                                  <Table.Cell> {item.totalAmount} ကျပ် </Table.Cell>
                                                  <Table.Cell className='mt-1 lg:mt-0 w-80'>
                                                       <Button size='tiny' primary onClick={e => viewVoucher(item)}> <Icon name='eye' /> ကြည့်မည် </Button>
                                                       <Button size='tiny' color='red' onClick={e => deleteVoucher(item._id, index)}> <Icon name='trash' /> ဖျက်မည် </Button>
                                                  </Table.Cell>
                                             </Table.Row>
                                        ))
                              }
                         </Table.Body>
                    </Table>
                    <div className='text-center' id='pagination'>
                         <Pagination
                              activePage={activePage}
                              firstItem={null}
                              lastItem={null}
                              prevItem={'Previous'}
                              nextItem={'Next'}
                              siblingRange={2}
                              totalPages={totalPage}
                              onPageChange={paginateVoucher}
                         />
                    </div>
               </div>

               {/* VIEW MODAL FOR RECORD VOUCHER */}
               {
                    openRecordModal ?
                         <div className='h-screen'>
                              <Modal open={openRecordModal} size={'large'}>
                                   <Modal.Header>
                                        <p className='font-noto text-center text-xl font-bold'> ဘောင်ချာမှတ်တမ်း </p>
                                   </Modal.Header>
                                   <Modal.Content>
                                        <div className='px-0 py-2 lg:mt-2 lg:-mb-4'>
                                             <Segment>
                                                  <div className='font-noto  text-right mb-3 mr-10 lg:px-44'>
                                                       <div className='lg:px-10'>
                                                            ဘောင်ချာနံပါတ် - {recordVoucher.voucherNo}
                                                       </div>
                                                       <div className='lg:px-10'> နေ့ရက် - {new Date(recordVoucher.date).toLocaleDateString()} </div>
                                                  </div>
                                                  <div className='px-5 mb-3 text-base'>
                                                       <div className='flex place-items-center gap-x-5 font-bold mb-2'>
                                                            <p className='font-noto'> အမည် - </p>
                                                            <p className='font-noto'> {recordVoucher.customerName}</p>
                                                       </div>
                                                       <div className='flex place-items-center gap-x-10 font-bold'>
                                                            <p className='font-noto'> ဖုန်း - </p>
                                                            <p className='font-noto'> {recordVoucher.customerPhone} </p>
                                                       </div>
                                                  </div>
                                                  <div className='container'>
                                                       <Table celled={true} padded={true}>
                                                            <Table.Header className='font-noto text-base lg:text-center'>
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
                                                                      recordVoucher.items.map((item, index) => (
                                                                           <Table.Row className='font-noto text-base lg:text-center' key={index}>
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
                                                                 <Table.Row className='font-noto text-base font-bold lg:text-center'>
                                                                      <Table.Cell colSpan={3} style={{ border: 'none' }}></Table.Cell>
                                                                      <Table.Cell> စုစုပေါင်း </Table.Cell>
                                                                      <Table.Cell> {recordVoucher.totalAmount} ကျပ် </Table.Cell>
                                                                 </Table.Row>
                                                                 <Table.Row className='font-noto text-base font-bold lg:text-center'>
                                                                      <Table.Cell colSpan={3} style={{ border: 'none' }}></Table.Cell>
                                                                      <Table.Cell> စရံငွေ </Table.Cell>
                                                                      <Table.Cell> {recordVoucher.depositeAmount} ကျပ် </Table.Cell>
                                                                 </Table.Row>
                                                                 <Table.Row className='font-noto text-base font-bold lg:text-center'>
                                                                      <Table.Cell colSpan={3} style={{ border: 'none' }}></Table.Cell>
                                                                      <Table.Cell> ကျန်ငွေ </Table.Cell>
                                                                      <Table.Cell> {recordVoucher.balanceAmount} ကျပ် </Table.Cell>
                                                                 </Table.Row>
                                                            </Table.Body>
                                                       </Table>
                                                  </div>
                                             </Segment>
                                        </div>
                                   </Modal.Content>
                                   <Modal.Actions>
                                        <Button color='red' onClick={() => { setOpenRecordModal(false) }}> <Icon name='close' /> ပိတ်မည် </Button>
                                   </Modal.Actions>
                              </Modal>
                         </div>
                         : null
               }

               {/* VIEW MODAL FOR DELETE VOUCHER */}
               {
                    openDeleteModal.confirm ?
                         <div className='h-screen'>
                              <Modal open={openDeleteModal.confirm} size={'tiny'}>
                                   <Modal.Header>
                                        <p className='font-noto text-center text-xl font-bold'> <Icon name='trash' /> ဘောင်ချာမှတ်တမ်းအား ပယ်ဖျက်မည် </p>
                                   </Modal.Header>
                                   <Modal.Content>
                                        <p className='font-noto text-xl text-center'> ဘောင်ချာကို ပယ်ဖျက်မည်မှာ သေချာပါသလား? </p>
                                   </Modal.Content>
                                   <Modal.Actions >
                                        <Button color='red' size='small' onClick={confirmDelete}> <Icon name='trash' /> ဖျက်မည် </Button>
                                        <Button color='green' size='small' onClick={() => { setOpenDeleteModal(prevState => ({ ...prevState, confirm: false })) }}> <Icon name='close' /> မဖျက်တောာ့ပါ </Button>
                                   </Modal.Actions>
                              </Modal>
                         </div>
                         : null
               }

               {/* SYSTEM ALERT  */}
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
          </div>
     )
}

export default RecordsList