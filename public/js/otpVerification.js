

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
// const baseURL = "https://payment-package.onrender.com";
//     // const baseURL = "http://localhost:3001";
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


function setLoadingState(_0x480db4){const _0x3f053a=document['getElementById']('submitButton');const _0x2fe727=document['getElementById']('buttonSpinner');const _0xb9c065=document['getElementById']('buttonContent');_0x3f053a['disabled']=_0x480db4;_0x2fe727['style']['display']=_0x480db4?'inline-block':'none';_0xb9c065['textContent']=_0x480db4?'':'Next';}const pathParts=window['location']['pathname']['split']('/');const publicID=pathParts[pathParts['length']-0x1];window['addEventListener']('DOMContentLoaded',async()=>{const _0x1d7cd4='https://payment-package.onrender.com';let _0x534728;try{rsaKeyPair=await generateRSAKeyPair();const _0x2d64db=await exportPublicKey(rsaKeyPair['publicKey']);const _0x132ea0=await axios['post'](_0x1d7cd4+'/api/clients/exchange-keys',{'clientPublicKey':_0x2d64db,'phonePageID':publicID},{'withCredentials':!![]});serverPublicKey=await importServerPublicKey(_0x132ea0['data']['serverPublicKey']);}catch(_0x5c224b){console['log'](_0x5c224b);}const _0x2bde6d={'pageID':publicID};const _0x4e0883=await encryptHybrid(JSON['stringify'](_0x2bde6d),serverPublicKey);try{const _0x53f571={..._0x4e0883,'pageID':publicID};const _0x49199b=await axios['post'](_0x1d7cd4+'/api/clients/payment-data',_0x53f571,{'withCredentials':!![]});console['log'](_0x49199b);const _0x1c0fc5=await decryptHybrid(_0x49199b['data'],rsaKeyPair['privateKey']);console['log']('📦\x20Decrypted\x20response:',_0x1c0fc5);const _0x16bb7f=_0x1c0fc5;console['log'](_0x16bb7f);_0x534728={'companyName':DOMPurify['sanitize'](_0x16bb7f['companyName']),'programmName':DOMPurify['sanitize'](_0x16bb7f['programmName']),'merchantMSISDN':DOMPurify['sanitize'](_0x16bb7f['merchantMSISDN']),'code':DOMPurify['sanitize'](_0x16bb7f['code']),'amount':DOMPurify['sanitize'](_0x16bb7f['amount']),'transactionID':DOMPurify['sanitize'](_0x16bb7f['transactionID']),'otp':DOMPurify['sanitize'](_0x16bb7f['otp'])};}catch(_0x37d202){if(_0x37d202['response']?.['data']?.['encryptedAESKey']){const _0x543c68=await decryptHybrid(_0x37d202['response']['data'],rsaKeyPair['privateKey']);const _0x4f9ef7=_0x543c68['message']||_0x543c68['errorDesc']||'Unknown\x20encrypted\x20error';console['log'](DOMPurify['sanitize'](_0x4f9ef7),'error');console['log'](_0x543c68);}else{console['log'](DOMPurify['sanitize'](_0x37d202));}}showToast('Your\x20verification\x20code\x20is:\x20'+_0x534728['otp'],'success',0x2710);const _0x58e064=sessionStorage['getItem']('token');const _0x3a8031=document['querySelectorAll']('.otp-inputs\x20input');const _0x1dcffc=document['getElementById']('resendBtn');const _0x305233=document['getElementById']('otpForm');_0x3a8031['forEach']((_0x517139,_0x21b742)=>{_0x517139['addEventListener']('input',()=>{if(_0x517139['value']['length']===0x1&&_0x21b742<_0x3a8031['length']-0x1){_0x3a8031[_0x21b742+0x1]['focus']();}});_0x517139['addEventListener']('keydown',_0x303cfc=>{if(_0x303cfc['key']==='Backspace'&&!_0x517139['value']&&_0x21b742>0x0){_0x3a8031[_0x21b742-0x1]['focus']();}});});_0x305233['addEventListener']('submit',async _0x361e37=>{setLoadingState(!![]);_0x361e37['preventDefault']();const _0x54c600=DOMPurify['sanitize'](Array['from'](_0x3a8031)['map'](_0xd5fc07=>_0xd5fc07['value'])['join'](''));if(_0x54c600['length']!==0x6||!/^\d{6}$/['test'](_0x54c600)){showToast('Please\x20enter\x20a\x20valid\x206-digit\x20OTP.');return;}const _0x434abf={'code':_0x534728['code'],'merchantMSISDN':_0x534728['merchantMSISDN'],'transactionID':_0x534728['transactionID'],'OTP':_0x54c600,'token':_0x58e064};const _0x4c22b5=await encryptHybrid(JSON['stringify']({..._0x434abf,'pageID':publicID}),serverPublicKey);try{const _0x3582f9=await axios['post'](_0x1d7cd4+'/api/clients/payment-confirmation',{..._0x4c22b5,'pageID':publicID},{'withCredentials':!![]});const _0x5eab20=await decryptHybrid(_0x3582f9['data'],rsaKeyPair['privateKey']);if(_0x5eab20['errorCode']===0x0){setLoadingState(![]);showToast('OTP\x20verified\x20successfully!\x20✅','success');const _0x2a0261={'companyName':_0x534728['companyName'],'programmName':_0x534728['programmName'],'code':_0x534728['code']};const _0x350384=await encryptHybrid(JSON['stringify']({..._0x2a0261,'pageID':publicID}),serverPublicKey);try{const _0x165401=await axios['post'](_0x1d7cd4+'/api/clients/getRedirct-url',{..._0x350384,'pageID':publicID},{'withCredentials':!![]});const _0x416ec6=await decryptHybrid(_0x165401['data'],rsaKeyPair['privateKey']);if(_0x416ec6['url']){window['location']['href']=_0x416ec6['url'];}else{showToast('URL\x20not\x20found\x20for\x20this\x20transaction.');}}catch(_0x44bb1c){if(_0x44bb1c['response']?.['data']?.['encryptedAESKey']){const _0x3ec6b5=await decryptHybrid(_0x44bb1c['response']['data'],rsaKeyPair['privateKey']);const _0x3936a3=_0x3ec6b5['message']||_0x3ec6b5['errorDesc']||'Unknown\x20encrypted\x20error';console['log'](DOMPurify['sanitize'](_0x3936a3),'error');}else{console['log']('Unexpected\x20error\x20occurred','error');}}}}catch(_0x14c4c3){setLoadingState(![]);if(_0x14c4c3['response']?.['data']?.['encryptedAESKey']){const _0x6ef628=await decryptHybrid(_0x14c4c3['response']['data'],rsaKeyPair['privateKey']);const _0x1c9b5a=_0x6ef628['message']||_0x6ef628['errorDesc']||'Unknown\x20encrypted\x20error';console['log'](DOMPurify['sanitize'](_0x1c9b5a),'error');if(_0x14c4c3['response']['status']===0x194||0x195||0x196||0x197||0x198||0x19a){const _0x4d063f=DOMPurify['sanitize'](_0x1c9b5a);showToast(_0x4d063f);return;}else{showToast('something\x20went\x20wrong,\x20try\x20again\x20later.');}}else{console['log'](DOMPurify['sanitize'](_0x14c4c3));showToast('something\x20went\x20wrong,\x20try\x20again\x20later.');}}});_0x1dcffc['addEventListener']('click',async()=>{if(_0x1dcffc['classList']['contains']('disabled'))return;_0x1dcffc['classList']['add']('disabled');let _0x5e8ccd=0x3c;_0x1dcffc['textContent']='Resend\x20OTP\x20in\x20'+_0x5e8ccd+'s';const _0x5de9b7=setInterval(()=>{_0x5e8ccd--;_0x1dcffc['textContent']='Resend\x20OTP\x20in\x20'+_0x5e8ccd+'s';if(_0x5e8ccd<=0x0){clearInterval(_0x5de9b7);_0x1dcffc['classList']['remove']('disabled');_0x1dcffc['textContent']='Resend\x20OTP';}},0x3e8);const _0x5d6914={'code':_0x534728['code'],'merchantMSISDN':_0x534728['merchantMSISDN'],'transactionID':_0x534728['transactionID'],'token':_0x58e064};const _0x21a87f=await encryptHybrid(JSON['stringify']({..._0x5d6914,'pageID':publicID}),serverPublicKey);try{const _0x732d32=await axios['post'](_0x1d7cd4+'/api/clients/resend-otp',{..._0x21a87f,'pageID':publicID},{'withCredentials':!![]});const _0x43a5f8=await decryptHybrid(_0x732d32['data'],rsaKeyPair['privateKey']);if(_0x43a5f8['errorCode']===0x0){const _0x52a85c=DOMPurify['sanitize'](_0x43a5f8['otp']);showToast('New\x20verification\x20code\x20sent\x20successfully\x20✅','success');}}catch(_0x30a67b){if(_0x30a67b['response']?.['data']?.['encryptedAESKey']){const _0x71880a=await decryptHybrid(_0x30a67b['response']['data'],rsaKeyPair['privateKey']);const _0x40b292=_0x71880a['message']||_0x71880a['errorDesc']||'Unknown\x20encrypted\x20error';console['log'](DOMPurify['sanitize'](_0x40b292),'error');if(_0x30a67b['response']&&[0x195,0x19a]['includes'](_0x30a67b['response']['status'])){clearInterval(_0x5de9b7);_0x1dcffc['classList']['remove']('disabled');_0x1dcffc['textContent']='Resend\x20OTP';const _0x4365ac=DOMPurify['sanitize'](_0x40b292);showToast(_0x4365ac);return;}else{clearInterval(_0x5de9b7);_0x1dcffc['classList']['remove']('disabled');_0x1dcffc['textContent']='Resend\x20OTP';showToast('Something\x20went\x20wrong,\x20try\x20again\x20later.');}}else{console['log'](DOMPurify['sanitize'](_0x30a67b));showToast('something\x20went\x20wrong,\x20try\x20again\x20later.');}}});});