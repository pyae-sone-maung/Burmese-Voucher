import React, { useState, useRef, useEffect } from 'react'
import { useReactToPrint } from 'react-to-print';
import { Segment, Form, Input, Table, Button, Checkbox, Icon, Modal } from 'semantic-ui-react'
import Cookies from 'js-cookie';
import axios from 'axios';
import { createVoucherURL } from '../api/burmese-voucher-api';

const Voucher = () => {
     // Print document
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

     // Initialized business information
     const initialBusinessInfo = {
          businessName: '',
          businessType: '',
          address: '',
          phone: ''
     }
     const [businessInfo, setBusinessInfo] = useState(initialBusinessInfo)
     useEffect(() => {
          const data = JSON.parse(window.sessionStorage.getItem('businessInfo'))
          setBusinessInfo({
               businessName: data.businessName,
               businessType: data.businessType,
               address: data.address,
               phone: data.phone
          })
     }, [])

     // Initialized voucher items
     const d = new Date();
     const voucherNo = 'VCH' + d.getFullYear() + d.getDate() + (d.getMonth() + 1) + d.getHours() + d.getMinutes() + d.getMilliseconds();
     const initialVoucherState = {
          'voucherNo': voucherNo,
          'date': d.toLocaleDateString(),
          'customerName': '',
          'customerPhone': '',
          'items': [],
          'totalAmount': 0,
          'depositeAmount': 0,
          'balanceAmount': 0
     }

     const [depositeCheck, setdepositeCheck] = useState(false)
     const [voucher, setVoucher] = useState(initialVoucherState)

     const totalItemsAmount = (items) => {
          const total = items.reduce((total, currentValue) => {
               return total + currentValue.itemQuantity * currentValue.itemPrice
          }, 0)
          return total
     }

     const newVoucher = () => {
          setVoucher(initialVoucherState)
          setVoucher(voucher => ({
               ...voucher,
               'voucherNo': voucherNo
          }))
     }

     const addInfoToVoucher = (e) => {
          e.preventDefault();
          const { customerName, customerPhone } = e.target.elements;
          setVoucher(voucher => ({
               ...voucher,
               'customerName': customerName.value,
               'customerPhone': customerPhone.value
          }))
     }

     const addItemsToVoucher = (e) => {
          e.preventDefault();
          let voucherItems = voucher.items;
          const { itemType, itemQuantity, itemPrice } = e.target.elements;
          const itemList = {
               'itemType': itemType.value,
               'itemQuantity': itemQuantity.value,
               'itemPrice': itemPrice.value
          }
          voucherItems.push(itemList);
          const totalAmount = totalItemsAmount(voucherItems)
          setVoucher(voucher => ({
               ...voucher,
               'items': voucherItems,
               'totalAmount': totalAmount,
               'depositeAmount': voucher.depositeAmount > totalAmount ? 0 : voucher.depositeAmount,
               'balanceAmount': voucher.depositeAmount > totalAmount || voucher.depositeAmount === 0 ? 0 : totalAmount - voucher.depositeAmount
          }))
          e.target.reset()
     }

     const removeItemsFromVoucher = (index) => {
          const voucherItems = voucher.items
          voucherItems.splice(index, 1)
          const totalAmount = totalItemsAmount(voucherItems)
          setVoucher(voucher => ({
               ...voucher,
               'items': voucherItems,
               'totalAmount': totalAmount,
               'depositeAmount': voucher.depositeAmount > totalAmount ? 0 : voucher.depositeAmount,
               'balanceAmount': voucher.depositeAmount > totalAmount || voucher.depositeAmount === 0 ? 0 : totalAmount - voucher.depositeAmount
          }))
     }

     const addDepositeAmount = (e) => {
          e.preventDefault()
          const { deposite } = e.target.elements
          const depositeAmount = Number(deposite.value)
          setVoucher(voucher => ({
               ...voucher,
               'depositeAmount': depositeAmount > voucher.totalAmount || depositeAmount <= 0 ? 0 : depositeAmount,
               'balanceAmount': depositeAmount > voucher.totalAmount || depositeAmount <= 0 ? 0 : voucher.totalAmount - depositeAmount
          }))
     }

     // Saving Voucher
     const [saveAlert, setSaveAlert] = useState({
          open: false,
          icon: null,
          message: null
     })
     const saveVoucher = () => {
          voucher.items.length === 0 ?
               setSaveAlert(prevState => ({
                    ...prevState,
                    open: true,
                    icon: 'exclamation triangle',
                    message: '?????????????????????????????????????????????????????????????????? ???????????????????????????????????????'
               }))
               :
               axios({
                    method: 'post',
                    url: createVoucherURL,
                    headers: {
                         authorization: 'Bearer ' + Cookies.get('token')
                    },
                    data: voucher
               }).then(res => {
                    setSaveAlert(prevState => ({
                         ...prevState,
                         open: true,
                         icon: 'check circle',
                         message: '?????????????????????????????????????????????????????????????????????????????????'
                    }))
               }).catch(err => {
                    setSaveAlert(prevState => ({
                         ...prevState,
                         open: true,
                         icon: 'exclamation triangle',
                         message: '???????????????????????????????????????????????????????????????????????????????????? ????????????????????????????????????????????? ????????????????????????????????????????????????????????????????????????????????????'
                    }))
               })
     }

     return (
          <div className='px-0 py-1 container lg:grid lg:place-content-center lg:pl-28'>
               <div className='mb-1 lg:mb-2'>
                    <div className=' py-1 lg:py-2 grid place-content-center font-noto font-bold text-xl lg:text-2xl tracking-wider'> {businessInfo.businessName} </div>
                    <div className='py-1 lg:py-2 font-noto text-bale lg:text-xl grid place-content-center'>{businessInfo.businessType} </div>
                    <div className='lg:flex lg:place-content-center lg:gap-x-10'>
                         <div className='py-1 font-noto text-center text-sm lg:text-base'> ?????????????????? - {businessInfo.address} </div>
                         <div className='py-1 font-noto text-center text-sm lg:text-base'> ??????????????? - {businessInfo.phone} </div>
                    </div>
                    <div className='px-0 py-2 lg:mt-2 lg:-mb-4'>
                         <Segment>
                              <div className='font-noto text-xs lg:text-base text-right mb-3 mr-10 lg:px-44'>
                                   <div className='lg:px-10'>
                                        ?????????????????????????????????????????? - {voucher.voucherNo}
                                   </div>
                                   <div className='lg:px-10'> ?????????????????? - {voucher.date} </div>
                              </div>
                              <div className='px-5 mb-3 lg:mb-5 text-xs lg:text-base'>
                                   <div className='flex place-items-center gap-x-5 font-bold mb-2'>
                                        <p className='font-noto'> ???????????? - </p>
                                        <p className='font-noto'> {voucher.customerName}</p>
                                   </div>
                                   <div className='flex place-items-center gap-x-10 font-bold'>
                                        <p className='font-noto'> ??????????????? - </p>
                                        <p className='font-noto'> {voucher.customerPhone} </p>
                                   </div>
                              </div>
                              <div className='container'>
                                   <Table celled={true} padded={true}>
                                        <Table.Header className='font-noto text-xs lg:text-base lg:text-center'>
                                             <Table.Row>
                                                  <Table.HeaderCell> ????????? </Table.HeaderCell>
                                                  <Table.HeaderCell> ??????????????????????????????????????????????????? </Table.HeaderCell>
                                                  <Table.HeaderCell> ???????????????????????? </Table.HeaderCell>
                                                  <Table.HeaderCell> ?????????????????????????????? </Table.HeaderCell>
                                                  <Table.HeaderCell> ????????????????????? </Table.HeaderCell>
                                                  <Table.HeaderCell>  </Table.HeaderCell>

                                             </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                             {
                                                  voucher.items.map((item, index) => (
                                                       <Table.Row className='font-noto text-xs lg:text-base lg:text-center' key={index}>
                                                            <Table.Cell> {index + 1} </Table.Cell>
                                                            <Table.Cell> {item.itemType} </Table.Cell>
                                                            <Table.Cell> {item.itemQuantity} </Table.Cell>
                                                            <Table.Cell> {item.itemPrice} ???????????? </Table.Cell>
                                                            <Table.Cell> {item.itemQuantity * item.itemPrice} ???????????? </Table.Cell>
                                                            <Table.Cell>  <Icon name='times circle' color='red' size='large' onClick={() => removeItemsFromVoucher(index)} /> </Table.Cell>
                                                       </Table.Row>
                                                  ))
                                             }
                                             <Table.Row>
                                                  <Table.Cell colSpan={6}> </Table.Cell>
                                             </Table.Row>
                                             <Table.Row className='font-noto text-xs lg:text-base font-bold lg:text-center'>
                                                  <Table.Cell colSpan={3} style={{ border: 'none' }}></Table.Cell>
                                                  <Table.Cell> ?????????????????????????????? </Table.Cell>
                                                  <Table.Cell> {voucher.totalAmount} ???????????? </Table.Cell>
                                                  <Table.Cell> </Table.Cell>
                                             </Table.Row>
                                             <Table.Row className='font-noto text-xs lg:text-base font-bold lg:text-center'>
                                                  <Table.Cell colSpan={3} style={{ border: 'none' }}></Table.Cell>
                                                  <Table.Cell> ?????????????????? </Table.Cell>
                                                  <Table.Cell> {voucher.depositeAmount} ???????????? </Table.Cell>
                                                  <Table.Cell> </Table.Cell>
                                             </Table.Row>
                                             <Table.Row className='font-noto text-xs lg:text-base font-bold lg:text-center'>
                                                  <Table.Cell colSpan={3} style={{ border: 'none' }}></Table.Cell>
                                                  <Table.Cell> ????????????????????? </Table.Cell>
                                                  <Table.Cell> {voucher.balanceAmount} ???????????? </Table.Cell>
                                                  <Table.Cell> </Table.Cell>
                                             </Table.Row>
                                        </Table.Body>
                                   </Table>
                              </div>
                         </Segment>
                    </div>
               </div>

               <Segment className='place-content-center hover:bg-indigo-500 hover:text-white' onClick={newVoucher}>
                    <div className='font-noto text-sm lg:text-lg text-center cursor-pointer'> <Icon name='plus' /> ???????????????????????????????????? ?????????????????????????????? </div>
               </Segment>

               <div className='grid place-content-center font-noto lg:font-bold lg:mt-5 mb-10'>
                    <Form className='lg:flex gap-x-10' onSubmit={addInfoToVoucher}>
                         <div className='py-1 lg:py-0 flex gap-x-5'>
                              <p className='grid place-items-center lg:text-lg'> ????????????????????????????????? </p>
                              <Input icon='user' iconPosition='left' placeholder="?????????????????????????????????" id='customerName'></Input>
                         </div>
                         <div className='py-1 lg:py-0 flex gap-x-5 lg:px-0'>
                              <p className='grid place-items-center lg:text-lg'> ????????????????????????????????? </p>
                              <Input icon='phone square' iconPosition='left' placeholder='?????????????????????????????????????????????????????????' id='customerPhone'></Input>
                         </div>
                         <div className='text-center py-2 lg:py-0'>
                              <Button primary type='submit' size='large'> <Icon name='check' /> ?????????????????????????????? </Button>
                         </div>
                    </Form>
               </div>

               <div className='py-5 grid place-content-center font-noto lg:font-bold'>
                    <Form className='lg:flex gap-x-10' onSubmit={addItemsToVoucher}>
                         <div className='py-1 lg:py-0 flex gap-x-5'>
                              <p className='grid place-items-center lg:text-lg'> ??????????????????????????????????????????????????? </p>
                              <Input icon='cube' iconPosition='left' placeholder="?????????????????????????????????" id='itemType' required></Input>
                         </div>
                         <div className='py-1 lg:py-0 flex gap-x-5 lg:px-0'>
                              <p className='grid place-items-center lg:text-lg'> ???????????????????????? </p>
                              <Input icon='cubes' iconPosition='left' type='number' min='0' placeholder="?????????????????????????????????????????????" id='itemQuantity' required></Input>
                         </div>
                         <div className='py-1 lg:py-0 flex gap-x-5 lg:px-0'>
                              <p className='grid place-items-center lg:text-lg'> ?????????????????????????????? </p>
                              <Input icon='dollar sign' iconPosition='left' type='number' min='1' placeholder="???????????????????????????????????????????????????" id='itemPrice' required></Input>
                         </div>
                         <div className='text-center py-2 lg:py-0'>
                              <Button primary type='submit' size='large'> <Icon name='plus square' /> ????????????????????????????????????????????????????????? </Button>
                         </div>
                    </Form>
               </div>
               <div className='flex lg:place-content-center mt-10 gap-x-10 '>
                    <Checkbox label='???????????????????????????????????????????????????' toggle className='font-noto font-bold mt-5' onChange={(e, data) => setdepositeCheck(data.checked)} checked={depositeCheck} />
                    {
                         depositeCheck ?
                              <Form className='lg:flex py-3 gap-x-5' onSubmit={addDepositeAmount}>
                                   <Input icon='dollar sign' iconPosition='left' type='number' placeholder='??????????????????????????????' id='deposite' required></Input>
                                   <div className='py-1 lg:py-0'>
                                        <Button primary type='submit' size='large'> <Icon name='plus square' /> ????????????????????????????????????????????????????????? </Button>
                                   </div>
                              </Form>
                              : null
                    }
               </div>

               <div className='flex place-content-center py-16 gap-x-2'>
                    <Button primary size='large' disabled onClick={saveVoucher}> <Icon name='save' /> ???????????????????????????????????? </Button>
                    <Button secondary size='large' onClick={printPage}> <Icon name='print' /> ????????????????????????????????????????????? </Button>
               </div>

               {/* ALERT FOR SAVE VOUCHER  */}
               {
                    saveAlert.open ?
                         <div className='h-screen'>
                              <Modal open={saveAlert.open} size={'tiny'}>
                                   <Modal.Header>
                                        <p className='font-noto text-center text-xl'> <Icon name='save' /> ???????????????????????? ??????????????????????????????????????????</p>
                                   </Modal.Header>
                                   <Modal.Content>
                                        <p className='font-noto text-lg text-center'> <Icon name={saveAlert.icon} /> {saveAlert.message} </p>
                                   </Modal.Content>
                                   <Modal.Actions style={{ textAlign: 'center' }}>
                                        <Button color='red' size='small' onClick={() => { setSaveAlert(prevState => ({ ...prevState, open: false, message: null })) }}> <Icon name='close' /> ????????????????????? </Button>
                                   </Modal.Actions>
                              </Modal>
                         </div>
                         : null
               }

               {/* PRINT DOCUMENT  */}
               <div className='mt-56'>
                    <div ref={printRef} style={{ display: 'none' }}>
                         <div className=' py-1 text-center font-noto font-bold text-2xl tracking-wider'> {businessInfo.businessName} </div>
                         <div className=' font-noto text-center text-base tracking-wide'>{businessInfo.businessType} </div>
                         <div className='py-1 font-noto text-center text-sm'> ?????????????????? - {businessInfo.address} </div>
                         <div className='font-noto text-center text-sm'> ??????????????? - {businessInfo.phone} </div>
                         <Segment>
                              <div className='font-noto text-sm text-right pr-3'>
                                   <p> ?????????????????????????????????????????? - {voucher.voucherNo} </p>
                                   <p>  ?????????????????? - {voucher.date} </p>
                              </div>
                              <div className='px-5 mb-1 text-sm'>
                                   <div className='flex gap-x-2'>
                                        <p className='font-noto'> ???????????? - </p>
                                        <p className='font-noto'> {voucher.customerName}</p>
                                   </div>
                                   <div className='flex py-1 -mb-3 gap-x-5'>
                                        <p className='font-noto'> ??????????????? - </p>
                                        <p className='font-noto'> {voucher.customerPhone} </p>
                                   </div>
                              </div>
                              <Table celled={true}>
                                   <Table.Header className='font-noto text-center text-sm'>
                                        <Table.Row>
                                             <Table.HeaderCell> ????????? </Table.HeaderCell>
                                             <Table.HeaderCell> ??????????????????????????????????????????????????? </Table.HeaderCell>
                                             <Table.HeaderCell> ???????????????????????? </Table.HeaderCell>
                                             <Table.HeaderCell> ?????????????????????????????? </Table.HeaderCell>
                                             <Table.HeaderCell> ????????????????????? </Table.HeaderCell>

                                        </Table.Row>
                                   </Table.Header>
                                   <Table.Body >
                                        {
                                             voucher.items.map((item, index) => (
                                                  <Table.Row className='font-noto text-center text-sm' key={index}>
                                                       <Table.Cell> {index + 1} </Table.Cell>
                                                       <Table.Cell> {item.itemType} </Table.Cell>
                                                       <Table.Cell> {item.itemQuantity} </Table.Cell>
                                                       <Table.Cell> {item.itemPrice} ???????????? </Table.Cell>
                                                       <Table.Cell> {item.itemQuantity * item.itemPrice} ???????????? </Table.Cell>
                                                  </Table.Row>
                                             ))
                                        }
                                        <Table.Row>
                                             <Table.Cell colSpan={5}> </Table.Cell>
                                        </Table.Row>
                                        <Table.Row className='font-noto font-bold text-center text-sm'>
                                             <Table.Cell colSpan={3} style={{ border: 'none' }}></Table.Cell>
                                             <Table.Cell> ?????????????????????????????? </Table.Cell>
                                             <Table.Cell> {voucher.totalAmount} ???????????? </Table.Cell>
                                        </Table.Row>
                                        <Table.Row className='font-noto font-bold text-center text-sm'>
                                             <Table.Cell colSpan={3} style={{ border: 'none' }}></Table.Cell>
                                             <Table.Cell> ?????????????????? </Table.Cell>
                                             <Table.Cell> {voucher.depositeAmount} ???????????? </Table.Cell>
                                        </Table.Row>
                                        <Table.Row className='font-noto font-bold text-center text-sm'>
                                             <Table.Cell colSpan={3} style={{ border: 'none' }}></Table.Cell>
                                             <Table.Cell> ????????????????????? </Table.Cell>
                                             <Table.Cell> {voucher.balanceAmount} ???????????? </Table.Cell>
                                        </Table.Row>
                                   </Table.Body>
                              </Table>
                              <p className='text-center mt-3 font-roboto font-thin tracking-wide' style={{ fontSize: '9px' }}> Developed By Burmese Voucher</p>
                         </Segment>
                    </div>
               </div>

          </div>
     )
}

export default Voucher