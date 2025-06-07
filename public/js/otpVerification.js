

// function setLoadingState(isLoading) {
//   const button = document.getElementById("submitButton");
//   const spinner = document.getElementById("buttonSpinner");
//   const text = document.getElementById("buttonContent");

//   button.disabled = isLoading;
//   spinner.style.display = isLoading ? "inline-block" : "none";
//   text.textContent = isLoading ? "" : "Next";
// }

// const pathParts = window.location.pathname.split("/");
// const publicID = pathParts[pathParts.length - 1];
// window.addEventListener("DOMContentLoaded", async () => {
//   // const baseURL = "https://projecttwo-iqjp.onrender.com";
//     const baseURL = "http://localhost:3001";
//   let fixedData;
//     try{
//     rsaKeyPair = await generateRSAKeyPair();
//     const exportedPublicKey = await exportPublicKey(rsaKeyPair.publicKey);
    
//     const resKey = await axios.post(`${baseURL}/api/clients/exchange-keys`, {
//       clientPublicKey: exportedPublicKey, // ✅ تعديل الاسم
//       phonePageID: publicID // ✅ أضف هذا
//     }, {
//       withCredentials: true
//     });

//     serverPublicKey = await importServerPublicKey(resKey.data.serverPublicKey);

//     }catch(error){
//       console.log(error);
//     }

// const payload = { pageID: publicID };
// const encryptedPayload = await encryptHybrid(JSON.stringify(payload), serverPublicKey);


// try{
// const encryptedPayloadWithPageID = {
//   ...encryptedPayload,
//   pageID: publicID // ✅ أضفها داخل body
// };

// const res = await axios.post(`${baseURL}/api/clients/payment-data`, encryptedPayloadWithPageID, {
//   withCredentials: true
// });



// console.log(res);

// // 3. فك تشفير الاستجابة
// const decrypted = await decryptHybrid(res.data, rsaKeyPair.privateKey);
// console.log("📦 Decrypted response:", decrypted);
// const rawData = decrypted;

// console.log(rawData);


// // 4. تعقيم البيانات
// fixedData = {
//   companyName: DOMPurify.sanitize(rawData.companyName),
//   programmName: DOMPurify.sanitize(rawData.programmName),
//   merchantMSISDN: DOMPurify.sanitize(rawData.merchantMSISDN),
//   code: DOMPurify.sanitize(rawData.code),
//   amount: DOMPurify.sanitize(rawData.amount),
//   transactionID: DOMPurify.sanitize(rawData.transactionID),
//   otp: DOMPurify.sanitize(rawData.otp),
// };
// // otpPageID = DOMPurify.sanitize(rawData.otpPageID);

// } catch (error) {
//     if (error.response?.data?.encryptedAESKey) {
//       // إذا الخطأ مشفّر
//       const decryptedError = await decryptHybrid(error.response.data, rsaKeyPair.privateKey);
//       const errMsg = decryptedError.message || decryptedError.errorDesc || "Unknown encrypted error";
//       console.log(DOMPurify.sanitize(errMsg), "error");
//       console.log(decryptedError);
//     }
//      else {
//       console.log(DOMPurify.sanitize(error));
//     }
// }

//   // ✅ عرض OTP في toast للتجريب
//   // console.log(`OTP is: ${fixedData.otp}`);
//   showToast(`Your verification code is: ${fixedData.otp}`, "success", 10000);

//   // ✅ قراءة التوكن من الكوكيز
//   // function getCookie(name) {
//   //   const cookies = document.cookie.split("; ");
//   //   const found = cookies.find(row => row.startsWith(name + "="));
//   //   return found ? found.split("=")[1] : null;
//   // }

//   const token = sessionStorage.getItem("token");

//   const inputs = document.querySelectorAll(".otp-inputs input");
//   const resendBtn = document.getElementById("resendBtn");
//   const form = document.getElementById("otpForm");

//   // ✅ التنقل بين خانات الإدخال
//   inputs.forEach((input, index) => {
//     input.addEventListener("input", () => {
//       if (input.value.length === 1 && index < inputs.length - 1) {
//         inputs[index + 1].focus();
//       }
//     });

//     input.addEventListener("keydown", (e) => {
//       if (e.key === "Backspace" && !input.value && index > 0) {
//         inputs[index - 1].focus();
//       }
//     });
//   });

//   // ✅ التحقق من رمز OTP عند الإرسال
//   form.addEventListener("submit", async (e) => {
//     setLoadingState(true); 
//     e.preventDefault();

//     const otpCode = DOMPurify.sanitize(Array.from(inputs).map(input => input.value).join(""));

//     if (otpCode.length !== 6 || !/^\d{6}$/.test(otpCode)) {
//       showToast("Please enter a valid 6-digit OTP.");
//       return;
//     }

//         const paymentConfirmationPayload ={
//           code: fixedData.code,
//           merchantMSISDN: fixedData.merchantMSISDN,
//           transactionID: fixedData.transactionID,
//           OTP: otpCode,
//           token
//     };

//   const encryptedPaymentConfirmationPayload = await encryptHybrid(JSON.stringify({
//     ...paymentConfirmationPayload,
//     pageID: publicID // ✅ أضف pageID داخل البيانات المشفرة
//   }), serverPublicKey);


//     try {
//   const confirmRes = await axios.post(`${baseURL}/api/clients/payment-confirmation`, {
//     ...encryptedPaymentConfirmationPayload,
//     pageID: publicID // ✅ أضف pageID أيضًا خارج التشفير
//   }, {
//     withCredentials: true
//   });
// const decryptedConfirmRes = await decryptHybrid(confirmRes.data, rsaKeyPair.privateKey);


// if (decryptedConfirmRes.errorCode === 0) {
//   setLoadingState(false); 
//   showToast("OTP verified successfully! ✅", "success");

//   // ثم نرسل getRedirct-url كالمعتاد

//          const redirectUrlPayload ={
//         companyName: fixedData.companyName,
//         programmName: fixedData.programmName,
//         code: fixedData.code
//     };

//   const encryptedRedirectUrlPayload = await encryptHybrid(JSON.stringify({
//     ...redirectUrlPayload,
//     pageID: publicID // ✅ أضف pageID داخل البيانات المشفرة
//   }), serverPublicKey);


//     try{

//   const urlResponse = await axios.post(`${baseURL}/api/clients/getRedirct-url`, {
//     ...encryptedRedirectUrlPayload,
//     pageID: publicID // ✅ أضف pageID أيضًا خارج التشفير
//   }, {
//     withCredentials: true
//   });

//     const decryptedUrlResponse = await decryptHybrid(urlResponse.data, rsaKeyPair.privateKey);

//    if (decryptedUrlResponse.url) {
//     window.location.href = decryptedUrlResponse.url;
//   } else {
//     showToast("URL not found for this transaction.");
//   }
//   }catch (error) {
//     if (error.response?.data?.encryptedAESKey) {
//       // إذا الخطأ مشفّر
//       const decryptedError = await decryptHybrid(error.response.data, rsaKeyPair.privateKey);
//       const errMsg = decryptedError.message || decryptedError.errorDesc || "Unknown encrypted error";
//       console.log(DOMPurify.sanitize(errMsg), "error");
//     }
//     else {
//       console.log("Unexpected error occurred", "error");
//     }
// }

// } 

// } catch (error) {
//     setLoadingState(false); 
//     if (error.response?.data?.encryptedAESKey) {
//       // إذا الخطأ مشفّر
//       const decryptedError = await decryptHybrid(error.response.data, rsaKeyPair.privateKey);
//       const errMsg = decryptedError.message || decryptedError.errorDesc || "Unknown encrypted error";
//       console.log(DOMPurify.sanitize(errMsg), "error");

//     if(error.response.status === 404 || 405 || 406 || 407 || 408 || 410 ){
//             const errorMessage = DOMPurify.sanitize(errMsg);
//             showToast(errorMessage);
//             return;
//         }

//     else {
//       showToast("something went wrong, try again later.");
//     }


//     } else {
//       console.log(DOMPurify.sanitize(error));
//       showToast("something went wrong, try again later.");
//     }
// }
//   });

//   // ✅ إعادة إرسال OTP
//   resendBtn.addEventListener("click", async () => {
//     if (resendBtn.classList.contains("disabled")) return;

//     resendBtn.classList.add("disabled");
//     let seconds = 60;
//     resendBtn.textContent = `Resend OTP in ${seconds}s`;

//     const timerInterval = setInterval(() => {
//       seconds--;
//       resendBtn.textContent = `Resend OTP in ${seconds}s`;
//       if (seconds <= 0) {
//         clearInterval(timerInterval);
//         resendBtn.classList.remove("disabled");
//         resendBtn.textContent = "Resend OTP";
//       }
//     }, 1000);

//             const resendOtpPayload ={
//         code: fixedData.code,
//         merchantMSISDN: fixedData.merchantMSISDN,
//         transactionID: fixedData.transactionID,
//         token
//     };

//   const encryptedresendOtpPayload = await encryptHybrid(JSON.stringify({
//     ...resendOtpPayload,
//     pageID: publicID // ✅ أضف pageID داخل البيانات المشفرة
//   }), serverPublicKey);



//     try {
//     const response = await axios.post(`${baseURL}/api/clients/resend-otp`, {
//       ...encryptedresendOtpPayload,
//       pageID: publicID // ✅ أضف pageID أيضًا خارج التشفير
//     }, {
//       withCredentials: true
//     });

//     const decryptedResendOtp = await decryptHybrid(response.data, rsaKeyPair.privateKey);

//       if (decryptedResendOtp.errorCode === 0) {
//         const newOtp = DOMPurify.sanitize(decryptedResendOtp.otp);
//         showToast("New verification code sent successfully ✅", "success");
//       } 
//     }catch (error) {
//     if (error.response?.data?.encryptedAESKey) {
//       // إذا الخطأ مشفّر
//       const decryptedError = await decryptHybrid(error.response.data, rsaKeyPair.privateKey);
//       const errMsg = decryptedError.message || decryptedError.errorDesc || "Unknown encrypted error";
//       console.log(DOMPurify.sanitize(errMsg), "error");

//       if (error.response && [405 , 410].includes(error.response.status)) {
//         clearInterval(timerInterval);
//         resendBtn.classList.remove("disabled");
//         resendBtn.textContent = "Resend OTP";
//         const errorMessage = DOMPurify.sanitize(errMsg);
//         showToast(errorMessage);
//         return;

//       } else {
//       clearInterval(timerInterval);
//       resendBtn.classList.remove("disabled");
//       resendBtn.textContent = "Resend OTP";
//       showToast("Something went wrong, try again later.");
//       }
//     } else {
//       console.log(DOMPurify.sanitize(error));
//       showToast("something went wrong, try again later.");
//     }
// }
//   });
// });


function setLoadingState(_0x18c4d8){const _0x1e0bcc=document['getElementById']('submitButton');const _0x25cafa=document['getElementById']('buttonSpinner');const _0xfcee80=document['getElementById']('buttonContent');_0x1e0bcc['disabled']=_0x18c4d8;_0x25cafa['style']['display']=_0x18c4d8?'inline-block':'none';_0xfcee80['textContent']=_0x18c4d8?'':'Next';}const pathParts=window['location']['pathname']['split']('/');const publicID=pathParts[pathParts['length']-0x1];window['addEventListener']('DOMContentLoaded',async()=>{const _0x10b51a='http://localhost:3001';let _0x4bddcc;try{rsaKeyPair=await generateRSAKeyPair();const _0x54b776=await exportPublicKey(rsaKeyPair['publicKey']);const _0x137260=await axios['post'](_0x10b51a+'/api/clients/exchange-keys',{'clientPublicKey':_0x54b776,'phonePageID':publicID},{'withCredentials':!![]});serverPublicKey=await importServerPublicKey(_0x137260['data']['serverPublicKey']);}catch(_0x267a7a){console['log'](_0x267a7a);}const _0xc47575={'pageID':publicID};const _0x57724e=await encryptHybrid(JSON['stringify'](_0xc47575),serverPublicKey);try{const _0x4c7238={..._0x57724e,'pageID':publicID};const _0x1d83a1=await axios['post'](_0x10b51a+'/api/clients/payment-data',_0x4c7238,{'withCredentials':!![]});console['log'](_0x1d83a1);const _0x456365=await decryptHybrid(_0x1d83a1['data'],rsaKeyPair['privateKey']);console['log']('📦\x20Decrypted\x20response:',_0x456365);const _0x4e9d77=_0x456365;console['log'](_0x4e9d77);_0x4bddcc={'companyName':DOMPurify['sanitize'](_0x4e9d77['companyName']),'programmName':DOMPurify['sanitize'](_0x4e9d77['programmName']),'merchantMSISDN':DOMPurify['sanitize'](_0x4e9d77['merchantMSISDN']),'code':DOMPurify['sanitize'](_0x4e9d77['code']),'amount':DOMPurify['sanitize'](_0x4e9d77['amount']),'transactionID':DOMPurify['sanitize'](_0x4e9d77['transactionID']),'otp':DOMPurify['sanitize'](_0x4e9d77['otp'])};}catch(_0x63439f){if(_0x63439f['response']?.['data']?.['encryptedAESKey']){const _0x3ef43f=await decryptHybrid(_0x63439f['response']['data'],rsaKeyPair['privateKey']);const _0x27c5ec=_0x3ef43f['message']||_0x3ef43f['errorDesc']||'Unknown\x20encrypted\x20error';console['log'](DOMPurify['sanitize'](_0x27c5ec),'error');console['log'](_0x3ef43f);}else{console['log'](DOMPurify['sanitize'](_0x63439f));}}showToast('Your\x20verification\x20code\x20is:\x20'+_0x4bddcc['otp'],'success',0x2710);const _0x11595e=sessionStorage['getItem']('token');const _0x403bc0=document['querySelectorAll']('.otp-inputs\x20input');const _0x304661=document['getElementById']('resendBtn');const _0x2fbea2=document['getElementById']('otpForm');_0x403bc0['forEach']((_0x59a498,_0xd97625)=>{_0x59a498['addEventListener']('input',()=>{if(_0x59a498['value']['length']===0x1&&_0xd97625<_0x403bc0['length']-0x1){_0x403bc0[_0xd97625+0x1]['focus']();}});_0x59a498['addEventListener']('keydown',_0x55c147=>{if(_0x55c147['key']==='Backspace'&&!_0x59a498['value']&&_0xd97625>0x0){_0x403bc0[_0xd97625-0x1]['focus']();}});});_0x2fbea2['addEventListener']('submit',async _0x4a9fce=>{setLoadingState(!![]);_0x4a9fce['preventDefault']();const _0x39b55d=DOMPurify['sanitize'](Array['from'](_0x403bc0)['map'](_0x1733f5=>_0x1733f5['value'])['join'](''));if(_0x39b55d['length']!==0x6||!/^\d{6}$/['test'](_0x39b55d)){showToast('Please\x20enter\x20a\x20valid\x206-digit\x20OTP.');return;}const _0x58610b={'code':_0x4bddcc['code'],'merchantMSISDN':_0x4bddcc['merchantMSISDN'],'transactionID':_0x4bddcc['transactionID'],'OTP':_0x39b55d,'token':_0x11595e};const _0x5a5b79=await encryptHybrid(JSON['stringify']({..._0x58610b,'pageID':publicID}),serverPublicKey);try{const _0x2ea1c1=await axios['post'](_0x10b51a+'/api/clients/payment-confirmation',{..._0x5a5b79,'pageID':publicID},{'withCredentials':!![]});const _0x2fdf9d=await decryptHybrid(_0x2ea1c1['data'],rsaKeyPair['privateKey']);if(_0x2fdf9d['errorCode']===0x0){setLoadingState(![]);showToast('OTP\x20verified\x20successfully!\x20✅','success');const _0xe15427={'companyName':_0x4bddcc['companyName'],'programmName':_0x4bddcc['programmName'],'code':_0x4bddcc['code']};const _0x501291=await encryptHybrid(JSON['stringify']({..._0xe15427,'pageID':publicID}),serverPublicKey);try{const _0x4c1462=await axios['post'](_0x10b51a+'/api/clients/getRedirct-url',{..._0x501291,'pageID':publicID},{'withCredentials':!![]});const _0x171a89=await decryptHybrid(_0x4c1462['data'],rsaKeyPair['privateKey']);if(_0x171a89['url']){window['location']['href']=_0x171a89['url'];}else{showToast('URL\x20not\x20found\x20for\x20this\x20transaction.');}}catch(_0x56d16d){if(_0x56d16d['response']?.['data']?.['encryptedAESKey']){const _0x57848c=await decryptHybrid(_0x56d16d['response']['data'],rsaKeyPair['privateKey']);const _0x1e29ca=_0x57848c['message']||_0x57848c['errorDesc']||'Unknown\x20encrypted\x20error';console['log'](DOMPurify['sanitize'](_0x1e29ca),'error');}else{console['log']('Unexpected\x20error\x20occurred','error');}}}}catch(_0xf8825){setLoadingState(![]);if(_0xf8825['response']?.['data']?.['encryptedAESKey']){const _0x1e3063=await decryptHybrid(_0xf8825['response']['data'],rsaKeyPair['privateKey']);const _0x4a9f5e=_0x1e3063['message']||_0x1e3063['errorDesc']||'Unknown\x20encrypted\x20error';console['log'](DOMPurify['sanitize'](_0x4a9f5e),'error');if(_0xf8825['response']['status']===0x194||0x195||0x196||0x197||0x198||0x19a){const _0x44f949=DOMPurify['sanitize'](_0x4a9f5e);showToast(_0x44f949);return;}else{showToast('something\x20went\x20wrong,\x20try\x20again\x20later.');}}else{console['log'](DOMPurify['sanitize'](_0xf8825));showToast('something\x20went\x20wrong,\x20try\x20again\x20later.');}}});_0x304661['addEventListener']('click',async()=>{if(_0x304661['classList']['contains']('disabled'))return;_0x304661['classList']['add']('disabled');let _0x5d5955=0x3c;_0x304661['textContent']='Resend\x20OTP\x20in\x20'+_0x5d5955+'s';const _0x5c2558=setInterval(()=>{_0x5d5955--;_0x304661['textContent']='Resend\x20OTP\x20in\x20'+_0x5d5955+'s';if(_0x5d5955<=0x0){clearInterval(_0x5c2558);_0x304661['classList']['remove']('disabled');_0x304661['textContent']='Resend\x20OTP';}},0x3e8);const _0x411d8e={'code':_0x4bddcc['code'],'merchantMSISDN':_0x4bddcc['merchantMSISDN'],'transactionID':_0x4bddcc['transactionID'],'token':_0x11595e};const _0x5e2e06=await encryptHybrid(JSON['stringify']({..._0x411d8e,'pageID':publicID}),serverPublicKey);try{const _0x28c483=await axios['post'](_0x10b51a+'/api/clients/resend-otp',{..._0x5e2e06,'pageID':publicID},{'withCredentials':!![]});const _0x2e8be8=await decryptHybrid(_0x28c483['data'],rsaKeyPair['privateKey']);if(_0x2e8be8['errorCode']===0x0){const _0x59fa9e=DOMPurify['sanitize'](_0x2e8be8['otp']);showToast('New\x20verification\x20code\x20sent\x20successfully\x20✅','success');}}catch(_0x4ee64d){if(_0x4ee64d['response']?.['data']?.['encryptedAESKey']){const _0x2e507d=await decryptHybrid(_0x4ee64d['response']['data'],rsaKeyPair['privateKey']);const _0x508d19=_0x2e507d['message']||_0x2e507d['errorDesc']||'Unknown\x20encrypted\x20error';console['log'](DOMPurify['sanitize'](_0x508d19),'error');if(_0x4ee64d['response']&&[0x195,0x19a]['includes'](_0x4ee64d['response']['status'])){clearInterval(_0x5c2558);_0x304661['classList']['remove']('disabled');_0x304661['textContent']='Resend\x20OTP';const _0x450d53=DOMPurify['sanitize'](_0x508d19);showToast(_0x450d53);return;}else{clearInterval(_0x5c2558);_0x304661['classList']['remove']('disabled');_0x304661['textContent']='Resend\x20OTP';showToast('Something\x20went\x20wrong,\x20try\x20again\x20later.');}}else{console['log'](DOMPurify['sanitize'](_0x4ee64d));showToast('something\x20went\x20wrong,\x20try\x20again\x20later.');}}});});