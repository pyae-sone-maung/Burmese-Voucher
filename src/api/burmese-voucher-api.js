const bvapi = 'https://burmese-voucher-api.herokuapp.com'

export const accountLoginURL = bvapi + "/login"   // အကောင့်၀င်ရန်

export const createVoucherURL = bvapi + '/create-voucher'   // ဘောင်ချာသိမ်းဆည်း

export const balanceVoucherURL = bvapi + '/balance-voucher' // လက်ကျန်ငွေစာရင်း

export const searchBalanceVoucherByDateURL = bvapi + '/search-balance-voucher'  // နေ့ရက်ဖြင့် လက်ကျန်ငွေဘောင်ချာရှာမည်

export const recordVoucherURL = bvapi + '/records-voucher'   // ဘောင်ချာမှတ်တမ်းများ

export const searchRecordVoucherByDateURL = bvapi + '/search-record-voucher'  // နေ့ရက်ဖြင့် မှတ်တမ်းဘောင်ချာရှာမည်

export const updateVoucherById = bvapi + '/update-voucher'  // id ဖြင့်ဘောင်ချာ update လုပ်ခြင်း

export const deleteVoucherById = bvapi + '/delete-voucher'  // id ဖြင့်ဘောင်ချာ ဖျက်မည်

export const updateBusinessInfo = bvapi + '/businessinfo'   // id ဖြင့်လုပ်ငန်းအချက်အလက်ပြောင်းလဲခြင်း

export const updateAccount = bvapi + '/account'   // id ဖြင့်အသုံးပြုသူအချက်အလက်ပြောင်းလဲခြင်း