

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
// //   showToast(`Your verification code is: ${fixedData.otp}`, "success", 10000);

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

function setLoadingState(_0x43b80d){const _0x2305fa=document['getElementById']('submitButton');const _0x404f78=document['getElementById']('buttonSpinner');const _0x1ae587=document['getElementById']('buttonContent');_0x2305fa['disabled']=_0x43b80d;_0x404f78['style']['display']=_0x43b80d?'inline-block':'none';_0x1ae587['textContent']=_0x43b80d?'':'Next';}const pathParts=window['location']['pathname']['split']('/');const publicID=pathParts[pathParts['length']-0x1];window['addEventListener']('DOMContentLoaded',async()=>{const _0x258819='https://payment-package.onrender.com';let _0xed0d36;try{rsaKeyPair=await generateRSAKeyPair();const _0x4c50f3=await exportPublicKey(rsaKeyPair['publicKey']);const _0x4041ca=await axios['post'](_0x258819+'/api/clients/exchange-keys',{'clientPublicKey':_0x4c50f3,'phonePageID':publicID},{'withCredentials':!![]});serverPublicKey=await importServerPublicKey(_0x4041ca['data']['serverPublicKey']);}catch(_0x1845f2){console['log'](_0x1845f2);}const _0x37624d={'pageID':publicID};const _0x5e26f8=await encryptHybrid(JSON['stringify'](_0x37624d),serverPublicKey);try{const _0xf5f35b={..._0x5e26f8,'pageID':publicID};const _0x346976=await axios['post'](_0x258819+'/api/clients/payment-data',_0xf5f35b,{'withCredentials':!![]});console['log'](_0x346976);const _0x40d5f6=await decryptHybrid(_0x346976['data'],rsaKeyPair['privateKey']);console['log']('📦\x20Decrypted\x20response:',_0x40d5f6);const _0x597cac=_0x40d5f6;console['log'](_0x597cac);_0xed0d36={'companyName':DOMPurify['sanitize'](_0x597cac['companyName']),'programmName':DOMPurify['sanitize'](_0x597cac['programmName']),'merchantMSISDN':DOMPurify['sanitize'](_0x597cac['merchantMSISDN']),'code':DOMPurify['sanitize'](_0x597cac['code']),'amount':DOMPurify['sanitize'](_0x597cac['amount']),'transactionID':DOMPurify['sanitize'](_0x597cac['transactionID']),'otp':DOMPurify['sanitize'](_0x597cac['otp'])};}catch(_0x3c3adb){if(_0x3c3adb['response']?.['data']?.['encryptedAESKey']){const _0xbff31=await decryptHybrid(_0x3c3adb['response']['data'],rsaKeyPair['privateKey']);const _0x25c966=_0xbff31['message']||_0xbff31['errorDesc']||'Unknown\x20encrypted\x20error';console['log'](DOMPurify['sanitize'](_0x25c966),'error');console['log'](_0xbff31);}else{console['log'](DOMPurify['sanitize'](_0x3c3adb));}}const _0x3772e4=sessionStorage['getItem']('token');const _0x46e5d7=document['querySelectorAll']('.otp-inputs\x20input');const _0x39f1bf=document['getElementById']('resendBtn');const _0x56d868=document['getElementById']('otpForm');_0x46e5d7['forEach']((_0x5d7466,_0x240451)=>{_0x5d7466['addEventListener']('input',()=>{if(_0x5d7466['value']['length']===0x1&&_0x240451<_0x46e5d7['length']-0x1){_0x46e5d7[_0x240451+0x1]['focus']();}});_0x5d7466['addEventListener']('keydown',_0x35fcea=>{if(_0x35fcea['key']==='Backspace'&&!_0x5d7466['value']&&_0x240451>0x0){_0x46e5d7[_0x240451-0x1]['focus']();}});});_0x56d868['addEventListener']('submit',async _0x2b75fe=>{setLoadingState(!![]);_0x2b75fe['preventDefault']();const _0x8f89bb=DOMPurify['sanitize'](Array['from'](_0x46e5d7)['map'](_0x3aab12=>_0x3aab12['value'])['join'](''));if(_0x8f89bb['length']!==0x6||!/^\d{6}$/['test'](_0x8f89bb)){showToast('Please\x20enter\x20a\x20valid\x206-digit\x20OTP.');return;}const _0x1adda9={'code':_0xed0d36['code'],'merchantMSISDN':_0xed0d36['merchantMSISDN'],'transactionID':_0xed0d36['transactionID'],'OTP':_0x8f89bb,'token':_0x3772e4};const _0x4147e4=await encryptHybrid(JSON['stringify']({..._0x1adda9,'pageID':publicID}),serverPublicKey);try{const _0x2e8a26=await axios['post'](_0x258819+'/api/clients/payment-confirmation',{..._0x4147e4,'pageID':publicID},{'withCredentials':!![]});const _0x7250dc=await decryptHybrid(_0x2e8a26['data'],rsaKeyPair['privateKey']);if(_0x7250dc['errorCode']===0x0){setLoadingState(![]);showToast('OTP\x20verified\x20successfully!\x20✅','success');const _0x5edbbb={'companyName':_0xed0d36['companyName'],'programmName':_0xed0d36['programmName'],'code':_0xed0d36['code']};const _0x3271c7=await encryptHybrid(JSON['stringify']({..._0x5edbbb,'pageID':publicID}),serverPublicKey);try{const _0x4b4fe8=await axios['post'](_0x258819+'/api/clients/getRedirct-url',{..._0x3271c7,'pageID':publicID},{'withCredentials':!![]});const _0x119d78=await decryptHybrid(_0x4b4fe8['data'],rsaKeyPair['privateKey']);if(_0x119d78['url']){window['location']['href']=_0x119d78['url'];}else{showToast('URL\x20not\x20found\x20for\x20this\x20transaction.');}}catch(_0x3559f6){if(_0x3559f6['response']?.['data']?.['encryptedAESKey']){const _0x3384a7=await decryptHybrid(_0x3559f6['response']['data'],rsaKeyPair['privateKey']);const _0x26dc94=_0x3384a7['message']||_0x3384a7['errorDesc']||'Unknown\x20encrypted\x20error';console['log'](DOMPurify['sanitize'](_0x26dc94),'error');}else{console['log']('Unexpected\x20error\x20occurred','error');}}}}catch(_0x27e3e9){setLoadingState(![]);if(_0x27e3e9['response']?.['data']?.['encryptedAESKey']){const _0x5e528d=await decryptHybrid(_0x27e3e9['response']['data'],rsaKeyPair['privateKey']);const _0xe4c312=_0x5e528d['message']||_0x5e528d['errorDesc']||'Unknown\x20encrypted\x20error';console['log'](DOMPurify['sanitize'](_0xe4c312),'error');if(_0x27e3e9['response']['status']===0x194||0x195||0x196||0x197||0x198||0x19a){const _0x576873=DOMPurify['sanitize'](_0xe4c312);showToast(_0x576873);return;}else{showToast('something\x20went\x20wrong,\x20try\x20again\x20later.');}}else{console['log'](DOMPurify['sanitize'](_0x27e3e9));showToast('something\x20went\x20wrong,\x20try\x20again\x20later.');}}});_0x39f1bf['addEventListener']('click',async()=>{if(_0x39f1bf['classList']['contains']('disabled'))return;_0x39f1bf['classList']['add']('disabled');let _0x3c1e5f=0x3c;_0x39f1bf['textContent']='Resend\x20OTP\x20in\x20'+_0x3c1e5f+'s';const _0x166641=setInterval(()=>{_0x3c1e5f--;_0x39f1bf['textContent']='Resend\x20OTP\x20in\x20'+_0x3c1e5f+'s';if(_0x3c1e5f<=0x0){clearInterval(_0x166641);_0x39f1bf['classList']['remove']('disabled');_0x39f1bf['textContent']='Resend\x20OTP';}},0x3e8);const _0x37913a={'code':_0xed0d36['code'],'merchantMSISDN':_0xed0d36['merchantMSISDN'],'transactionID':_0xed0d36['transactionID'],'token':_0x3772e4};const _0x31a799=await encryptHybrid(JSON['stringify']({..._0x37913a,'pageID':publicID}),serverPublicKey);try{const _0x355b2c=await axios['post'](_0x258819+'/api/clients/resend-otp',{..._0x31a799,'pageID':publicID},{'withCredentials':!![]});const _0x4ea918=await decryptHybrid(_0x355b2c['data'],rsaKeyPair['privateKey']);if(_0x4ea918['errorCode']===0x0){const _0x47a5ad=DOMPurify['sanitize'](_0x4ea918['otp']);showToast('New\x20verification\x20code\x20sent\x20successfully\x20✅','success');}}catch(_0x44f9ef){if(_0x44f9ef['response']?.['data']?.['encryptedAESKey']){const _0x14e5cd=await decryptHybrid(_0x44f9ef['response']['data'],rsaKeyPair['privateKey']);const _0x588e45=_0x14e5cd['message']||_0x14e5cd['errorDesc']||'Unknown\x20encrypted\x20error';console['log'](DOMPurify['sanitize'](_0x588e45),'error');if(_0x44f9ef['response']&&[0x195,0x19a]['includes'](_0x44f9ef['response']['status'])){clearInterval(_0x166641);_0x39f1bf['classList']['remove']('disabled');_0x39f1bf['textContent']='Resend\x20OTP';const _0x1e1080=DOMPurify['sanitize'](_0x588e45);showToast(_0x1e1080);return;}else{clearInterval(_0x166641);_0x39f1bf['classList']['remove']('disabled');_0x39f1bf['textContent']='Resend\x20OTP';showToast('Something\x20went\x20wrong,\x20try\x20again\x20later.');}}else{console['log'](DOMPurify['sanitize'](_0x44f9ef));showToast('something\x20went\x20wrong,\x20try\x20again\x20later.');}}});});