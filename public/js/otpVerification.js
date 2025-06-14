

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
// const baseURL = process.env.BASE_PACKAGE_URL;
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

// // 3. فك تشفير الاستجابة
// const decrypted = await decryptHybrid(res.data, rsaKeyPair.privateKey);
// const rawData = decrypted;
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


function setLoadingState(_0x1ba0b0){const _0x27b80d=document['getElementById']('submitButton');const _0x25f9bc=document['getElementById']('buttonSpinner');const _0x18fd35=document['getElementById']('buttonContent');_0x27b80d['disabled']=_0x1ba0b0;_0x25f9bc['style']['display']=_0x1ba0b0?'inline-block':'none';_0x18fd35['textContent']=_0x1ba0b0?'':'Next';}const pathParts=window['location']['pathname']['split']('/');const publicID=pathParts[pathParts['length']-0x1];window['addEventListener']('DOMContentLoaded',async()=>{const _0x1f920f=process['env']['BASE_PACKAGE_URL'];let _0x58c504;try{rsaKeyPair=await generateRSAKeyPair();const _0x5e7ad0=await exportPublicKey(rsaKeyPair['publicKey']);const _0x549e6d=await axios['post'](_0x1f920f+'/api/clients/exchange-keys',{'clientPublicKey':_0x5e7ad0,'phonePageID':publicID},{'withCredentials':!![]});serverPublicKey=await importServerPublicKey(_0x549e6d['data']['serverPublicKey']);}catch(_0x34925b){console['log'](_0x34925b);}const _0x3b0b3b={'pageID':publicID};const _0xd00f3c=await encryptHybrid(JSON['stringify'](_0x3b0b3b),serverPublicKey);try{const _0x54c9c5={..._0xd00f3c,'pageID':publicID};const _0x438b64=await axios['post'](_0x1f920f+'/api/clients/payment-data',_0x54c9c5,{'withCredentials':!![]});const _0x2f2d12=await decryptHybrid(_0x438b64['data'],rsaKeyPair['privateKey']);const _0x17b4db=_0x2f2d12;_0x58c504={'companyName':DOMPurify['sanitize'](_0x17b4db['companyName']),'programmName':DOMPurify['sanitize'](_0x17b4db['programmName']),'merchantMSISDN':DOMPurify['sanitize'](_0x17b4db['merchantMSISDN']),'code':DOMPurify['sanitize'](_0x17b4db['code']),'amount':DOMPurify['sanitize'](_0x17b4db['amount']),'transactionID':DOMPurify['sanitize'](_0x17b4db['transactionID']),'otp':DOMPurify['sanitize'](_0x17b4db['otp'])};}catch(_0x54c9bc){if(_0x54c9bc['response']?.['data']?.['encryptedAESKey']){const _0x305360=await decryptHybrid(_0x54c9bc['response']['data'],rsaKeyPair['privateKey']);const _0xeb000c=_0x305360['message']||_0x305360['errorDesc']||'Unknown\x20encrypted\x20error';console['log'](DOMPurify['sanitize'](_0xeb000c),'error');console['log'](_0x305360);}else{console['log'](DOMPurify['sanitize'](_0x54c9bc));}}const _0x57303f=sessionStorage['getItem']('token');const _0x19c333=document['querySelectorAll']('.otp-inputs\x20input');const _0x53c15b=document['getElementById']('resendBtn');const _0x180dbe=document['getElementById']('otpForm');_0x19c333['forEach']((_0x476643,_0x8bff97)=>{_0x476643['addEventListener']('input',()=>{if(_0x476643['value']['length']===0x1&&_0x8bff97<_0x19c333['length']-0x1){_0x19c333[_0x8bff97+0x1]['focus']();}});_0x476643['addEventListener']('keydown',_0x445f71=>{if(_0x445f71['key']==='Backspace'&&!_0x476643['value']&&_0x8bff97>0x0){_0x19c333[_0x8bff97-0x1]['focus']();}});});_0x180dbe['addEventListener']('submit',async _0x1781b4=>{setLoadingState(!![]);_0x1781b4['preventDefault']();const _0x27d457=DOMPurify['sanitize'](Array['from'](_0x19c333)['map'](_0x5cc43d=>_0x5cc43d['value'])['join'](''));if(_0x27d457['length']!==0x6||!/^\d{6}$/['test'](_0x27d457)){showToast('Please\x20enter\x20a\x20valid\x206-digit\x20OTP.');return;}const _0x1f5c87={'code':_0x58c504['code'],'merchantMSISDN':_0x58c504['merchantMSISDN'],'transactionID':_0x58c504['transactionID'],'OTP':_0x27d457,'token':_0x57303f};const _0x5f5c15=await encryptHybrid(JSON['stringify']({..._0x1f5c87,'pageID':publicID}),serverPublicKey);try{const _0x1aa4d8=await axios['post'](_0x1f920f+'/api/clients/payment-confirmation',{..._0x5f5c15,'pageID':publicID},{'withCredentials':!![]});const _0x31c377=await decryptHybrid(_0x1aa4d8['data'],rsaKeyPair['privateKey']);if(_0x31c377['errorCode']===0x0){setLoadingState(![]);showToast('OTP\x20verified\x20successfully!\x20✅','success');const _0x40c761={'companyName':_0x58c504['companyName'],'programmName':_0x58c504['programmName'],'code':_0x58c504['code']};const _0x352b0f=await encryptHybrid(JSON['stringify']({..._0x40c761,'pageID':publicID}),serverPublicKey);try{const _0xc60504=await axios['post'](_0x1f920f+'/api/clients/getRedirct-url',{..._0x352b0f,'pageID':publicID},{'withCredentials':!![]});const _0xd459c=await decryptHybrid(_0xc60504['data'],rsaKeyPair['privateKey']);if(_0xd459c['url']){window['location']['href']=_0xd459c['url'];}else{showToast('URL\x20not\x20found\x20for\x20this\x20transaction.');}}catch(_0x33b96b){if(_0x33b96b['response']?.['data']?.['encryptedAESKey']){const _0x5e1bc7=await decryptHybrid(_0x33b96b['response']['data'],rsaKeyPair['privateKey']);const _0x3bcfc7=_0x5e1bc7['message']||_0x5e1bc7['errorDesc']||'Unknown\x20encrypted\x20error';console['log'](DOMPurify['sanitize'](_0x3bcfc7),'error');}else{console['log']('Unexpected\x20error\x20occurred','error');}}}}catch(_0x171713){setLoadingState(![]);if(_0x171713['response']?.['data']?.['encryptedAESKey']){const _0x24082e=await decryptHybrid(_0x171713['response']['data'],rsaKeyPair['privateKey']);const _0x28f251=_0x24082e['message']||_0x24082e['errorDesc']||'Unknown\x20encrypted\x20error';console['log'](DOMPurify['sanitize'](_0x28f251),'error');if(_0x171713['response']['status']===0x194||0x195||0x196||0x197||0x198||0x19a){const _0x53f5fa=DOMPurify['sanitize'](_0x28f251);showToast(_0x53f5fa);return;}else{showToast('something\x20went\x20wrong,\x20try\x20again\x20later.');}}else{console['log'](DOMPurify['sanitize'](_0x171713));showToast('something\x20went\x20wrong,\x20try\x20again\x20later.');}}});_0x53c15b['addEventListener']('click',async()=>{if(_0x53c15b['classList']['contains']('disabled'))return;_0x53c15b['classList']['add']('disabled');let _0xb28cbf=0x3c;_0x53c15b['textContent']='Resend\x20OTP\x20in\x20'+_0xb28cbf+'s';const _0x1c2406=setInterval(()=>{_0xb28cbf--;_0x53c15b['textContent']='Resend\x20OTP\x20in\x20'+_0xb28cbf+'s';if(_0xb28cbf<=0x0){clearInterval(_0x1c2406);_0x53c15b['classList']['remove']('disabled');_0x53c15b['textContent']='Resend\x20OTP';}},0x3e8);const _0x34b239={'code':_0x58c504['code'],'merchantMSISDN':_0x58c504['merchantMSISDN'],'transactionID':_0x58c504['transactionID'],'token':_0x57303f};const _0x5568b0=await encryptHybrid(JSON['stringify']({..._0x34b239,'pageID':publicID}),serverPublicKey);try{const _0x59d26d=await axios['post'](_0x1f920f+'/api/clients/resend-otp',{..._0x5568b0,'pageID':publicID},{'withCredentials':!![]});const _0x22f850=await decryptHybrid(_0x59d26d['data'],rsaKeyPair['privateKey']);if(_0x22f850['errorCode']===0x0){const _0x5c2852=DOMPurify['sanitize'](_0x22f850['otp']);showToast('New\x20verification\x20code\x20sent\x20successfully\x20✅','success');}}catch(_0x5caf92){if(_0x5caf92['response']?.['data']?.['encryptedAESKey']){const _0x33822a=await decryptHybrid(_0x5caf92['response']['data'],rsaKeyPair['privateKey']);const _0x5787cf=_0x33822a['message']||_0x33822a['errorDesc']||'Unknown\x20encrypted\x20error';console['log'](DOMPurify['sanitize'](_0x5787cf),'error');if(_0x5caf92['response']&&[0x195,0x19a]['includes'](_0x5caf92['response']['status'])){clearInterval(_0x1c2406);_0x53c15b['classList']['remove']('disabled');_0x53c15b['textContent']='Resend\x20OTP';const _0x59e3b9=DOMPurify['sanitize'](_0x5787cf);showToast(_0x59e3b9);return;}else{clearInterval(_0x1c2406);_0x53c15b['classList']['remove']('disabled');_0x53c15b['textContent']='Resend\x20OTP';showToast('Something\x20went\x20wrong,\x20try\x20again\x20later.');}}else{console['log'](DOMPurify['sanitize'](_0x5caf92));showToast('something\x20went\x20wrong,\x20try\x20again\x20later.');}}});});