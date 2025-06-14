// function setPageLoadingState(isLoading) {
//   const spinner = document.getElementById("loadingSpinner");
//   const content = document.getElementById("phonePage");

//   spinner.style.display = isLoading ? "flex" : "none";
//   content.style.display = isLoading ? "none" : "flex";
// }

// function setLoadingState(isLoading) {
//   const button = document.getElementById("submitButton");
//   const spinner = document.getElementById("buttonSpinner");
//   const text = document.getElementById("buttonContent");

//   button.disabled = isLoading;
//   spinner.style.display = isLoading ? "inline-block" : "none";
//   text.textContent = isLoading ? "" : "Next";
// }

// const baseURL = process.env.BASE_PACKAGE_URL;
// // const baseURL = "http://localhost:3001";

// async function sendData() {
//   setPageLoadingState(true); // أظهر الشيمر أول ما تبدأ
//           const pathParts = window.location.pathname.split("/");
//         const publicID = pathParts[pathParts.length - 1];
//   try {
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

// // const payload = { pageID: publicID };
// // const encryptedPayload = await encryptHybrid(JSON.stringify(payload), serverPublicKey);

// // 2. إرسال الطلب المشفر بـ POST
// try{
  
// const encryptedPayloadWithPageID = {
//   pageID: publicID // ✅ أضفها داخل body
// };

// const res = await axios.post(`${baseURL}/api/clients/payment-data`, encryptedPayloadWithPageID, {
//   withCredentials: true
// });

//   const decrypted = await decryptHybrid(res.data, rsaKeyPair.privateKey);

//   let rawData;
//   if (typeof decrypted === "string") {
//     rawData = JSON.parse(decrypted);
//   } else {
//     rawData = decrypted;
//   }

//   if (!rawData || !rawData.programmName) {
//     return showToast("Something went wrong, please try again later.");
//   }


// // 4. تعقيم البيانات
// fixedData = {
//   companyName: DOMPurify.sanitize(rawData.companyName),
//   programmName: DOMPurify.sanitize(rawData.programmName),
//   merchantMSISDN: DOMPurify.sanitize(rawData.merchantMSISDN),
//   code: DOMPurify.sanitize(rawData.code),
//   amount: DOMPurify.sanitize(rawData.amount),
//   transactionID: DOMPurify.sanitize(rawData.transactionID),
// };
// otpPageID = DOMPurify.sanitize(rawData.otpPageID);

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

// document.getElementById("merchantInfo").innerHTML =
//   `<strong>Merchant:</strong> ${fixedData.programmName}`;

// document.getElementById("amountInfo").innerHTML =
//   `<strong>Total Amount:</strong> ${Number(fixedData.amount).toLocaleString()} SP`;


//   try{

//     // تشفير البيانات وإرسال طلب token
//   const tokenPayload = {
//       companyName: fixedData.companyName,
//       programmName: fixedData.programmName,
//       merchantMSISDN: fixedData.merchantMSISDN,
//       code: fixedData.code
//     };

//     const encryptedToken = await encryptHybrid(JSON.stringify({
//       ...tokenPayload,
//       pageID: publicID
//     }), serverPublicKey);

//     const tokenRes = await axios.post(`${baseURL}/api/clients/get-token`, {
//       ...encryptedToken,
//       pageID: publicID
//     }, { withCredentials: true}
//     );

//     const result = await decryptHybrid(tokenRes.data, rsaKeyPair.privateKey);
//     // document.cookie = `token=${result.token}; path=/; SameSite=Lax`;
//     sessionStorage.setItem("token", result.token);


//   } catch (error) {
//     if (error.response?.data?.encryptedAESKey) {
//       // إذا الخطأ مشفّر
//       const decryptedError = await decryptHybrid(error.response.data, rsaKeyPair.privateKey);
//       const errMsg = decryptedError.message || decryptedError.errorDesc || "Unknown encrypted error";
//       console.log(DOMPurify.sanitize(errMsg), "error");
//       showToast("something went wrong, try again later.")
//     } else {
//       console.log(DOMPurify.sanitize(error));
//     }
// }
//   // معالجة الفورم
//   document.getElementById("paymentForm").addEventListener("submit", async (e) => {
//     setLoadingState(true); 
//     e.preventDefault();

//     const customerMSISDN = DOMPurify.sanitize(document.getElementById("customerMSISDN").value.trim());
//     const confirmCustomerMSISDN = DOMPurify.sanitize(document.getElementById("confirmCustomerMSISDN").value.trim());

//     if (!customerMSISDN || !confirmCustomerMSISDN) {
//       setLoadingState(false); 
//       return showToast("All fields are required.");
//     }

//     if (customerMSISDN !== confirmCustomerMSISDN) {
//       setLoadingState(false); 
//       return showToast("Phone numbers do not match.");
//     }

//     const phoneRegex = /^0?9\d{8}$/;
//     if (!phoneRegex.test(customerMSISDN)) {
//       setLoadingState(false); 
//       return showToast("Invalid phone number. It must start with 09.");
//     }

//     // const token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];

//     const token = sessionStorage.getItem("token");

    

//     try {
    
//       const paymentRequestPayload = {
//         code: fixedData.code,
//         customerMSISDN,
//         merchantMSISDN: fixedData.merchantMSISDN,
//         amount: fixedData.amount,
//         transactionID: fixedData.transactionID,
//         token
//       };

//       const encryptedpaymentRequestPayload = await encryptHybrid(JSON.stringify({
//         ...paymentRequestPayload,
//         pageID: publicID // ✅ أضف pageID داخل البيانات المشفرة
//       }), serverPublicKey);

//       const response = await axios.post(`${baseURL}/api/clients/payment-request`, {
//         ...encryptedpaymentRequestPayload,
//         pageID: publicID // ✅ أضف pageID أيضًا خارج التشفير
//       }, {
//         withCredentials: true
//       });

//       const result = await decryptHybrid(response.data, rsaKeyPair.privateKey);

//       if (result.errorCode === 0) {
//         setLoadingState(false); 
//         showToast("Verification code sent successfully ✅", "success");
//         setTimeout(() => {
//           window.location.href = `${baseURL}/api/clients/otpVerification-page/${otpPageID}`;
//         }, 3000);
//       } else {
//         showToast(result.message || "Something went wrong.");
//       }
//     } catch (error) {
//       setLoadingState(false); 
//     if (error.response?.data?.encryptedAESKey) {
//       // إذا الخطأ مشفّر
//       const decryptedError = await decryptHybrid(error.response.data, rsaKeyPair.privateKey);
//       const errMsg = decryptedError.message || decryptedError.errorDesc || "Unknown encrypted error";
//       console.log(DOMPurify.sanitize(errMsg), "error");

//       if (error.response.status === 404) {
//         const errorMessage = DOMPurify.sanitize(errMsg); // الرسالة المفكوكة
//         showToast(errorMessage);
//         return;
//       }

//       else {
//             showToast("something went wrong, try again later.");
//       }


//     } else {
//       console.log(DOMPurify.sanitize(error));
//       showToast("something went wrong, try again later.");
//     }
// }
//   });

// }catch(error){
//   console.log(error);
// }finally{
//   setPageLoadingState(false); // أظهر الشيمر أول ما تبدأ
// }
// }

// window.onload = sendData;

function setPageLoadingState(_0x4cd812){const _0x3f78e1=document['getElementById']('loadingSpinner');const _0x392c64=document['getElementById']('phonePage');_0x3f78e1['style']['display']=_0x4cd812?'flex':'none';_0x392c64['style']['display']=_0x4cd812?'none':'flex';}function setLoadingState(_0x5c5195){const _0x28f870=document['getElementById']('submitButton');const _0x4f8656=document['getElementById']('buttonSpinner');const _0x365100=document['getElementById']('buttonContent');_0x28f870['disabled']=_0x5c5195;_0x4f8656['style']['display']=_0x5c5195?'inline-block':'none';_0x365100['textContent']=_0x5c5195?'':'Next';}const baseURL=process['env']['BASE_PACKAGE_URL'];async function sendData(){setPageLoadingState(!![]);const _0x7685dd=window['location']['pathname']['split']('/');const _0x13d20f=_0x7685dd[_0x7685dd['length']-0x1];try{try{rsaKeyPair=await generateRSAKeyPair();const _0x1c2a07=await exportPublicKey(rsaKeyPair['publicKey']);const _0x5e5f1e=await axios['post'](baseURL+'/api/clients/exchange-keys',{'clientPublicKey':_0x1c2a07,'phonePageID':_0x13d20f},{'withCredentials':!![]});serverPublicKey=await importServerPublicKey(_0x5e5f1e['data']['serverPublicKey']);}catch(_0x5dd285){console['log'](_0x5dd285);}try{const _0x1e1133={'pageID':_0x13d20f};const _0x33b04b=await axios['post'](baseURL+'/api/clients/payment-data',_0x1e1133,{'withCredentials':!![]});const _0x5e8e72=await decryptHybrid(_0x33b04b['data'],rsaKeyPair['privateKey']);let _0x33cec2;if(typeof _0x5e8e72==='string'){_0x33cec2=JSON['parse'](_0x5e8e72);}else{_0x33cec2=_0x5e8e72;}if(!_0x33cec2||!_0x33cec2['programmName']){return showToast('Something\x20went\x20wrong,\x20please\x20try\x20again\x20later.');}fixedData={'companyName':DOMPurify['sanitize'](_0x33cec2['companyName']),'programmName':DOMPurify['sanitize'](_0x33cec2['programmName']),'merchantMSISDN':DOMPurify['sanitize'](_0x33cec2['merchantMSISDN']),'code':DOMPurify['sanitize'](_0x33cec2['code']),'amount':DOMPurify['sanitize'](_0x33cec2['amount']),'transactionID':DOMPurify['sanitize'](_0x33cec2['transactionID'])};otpPageID=DOMPurify['sanitize'](_0x33cec2['otpPageID']);}catch(_0x1827ef){if(_0x1827ef['response']?.['data']?.['encryptedAESKey']){const _0x2ebf41=await decryptHybrid(_0x1827ef['response']['data'],rsaKeyPair['privateKey']);const _0x3bd8a3=_0x2ebf41['message']||_0x2ebf41['errorDesc']||'Unknown\x20encrypted\x20error';console['log'](DOMPurify['sanitize'](_0x3bd8a3),'error');console['log'](_0x2ebf41);}else{console['log'](DOMPurify['sanitize'](_0x1827ef));}}document['getElementById']('merchantInfo')['innerHTML']='<strong>Merchant:</strong>\x20'+fixedData['programmName'];document['getElementById']('amountInfo')['innerHTML']='<strong>Total\x20Amount:</strong>\x20'+Number(fixedData['amount'])['toLocaleString']()+'\x20SP';try{const _0x12ce5c={'companyName':fixedData['companyName'],'programmName':fixedData['programmName'],'merchantMSISDN':fixedData['merchantMSISDN'],'code':fixedData['code']};const _0x4cc368=await encryptHybrid(JSON['stringify']({..._0x12ce5c,'pageID':_0x13d20f}),serverPublicKey);const _0x147d57=await axios['post'](baseURL+'/api/clients/get-token',{..._0x4cc368,'pageID':_0x13d20f},{'withCredentials':!![]});const _0xbc582c=await decryptHybrid(_0x147d57['data'],rsaKeyPair['privateKey']);sessionStorage['setItem']('token',_0xbc582c['token']);}catch(_0x1ca1c3){if(_0x1ca1c3['response']?.['data']?.['encryptedAESKey']){const _0x107ab5=await decryptHybrid(_0x1ca1c3['response']['data'],rsaKeyPair['privateKey']);const _0x309c04=_0x107ab5['message']||_0x107ab5['errorDesc']||'Unknown\x20encrypted\x20error';console['log'](DOMPurify['sanitize'](_0x309c04),'error');showToast('something\x20went\x20wrong,\x20try\x20again\x20later.');}else{console['log'](DOMPurify['sanitize'](_0x1ca1c3));}}document['getElementById']('paymentForm')['addEventListener']('submit',async _0x2bf92c=>{setLoadingState(!![]);_0x2bf92c['preventDefault']();const _0x13f76b=DOMPurify['sanitize'](document['getElementById']('customerMSISDN')['value']['trim']());const _0x4b07b9=DOMPurify['sanitize'](document['getElementById']('confirmCustomerMSISDN')['value']['trim']());if(!_0x13f76b||!_0x4b07b9){setLoadingState(![]);return showToast('All\x20fields\x20are\x20required.');}if(_0x13f76b!==_0x4b07b9){setLoadingState(![]);return showToast('Phone\x20numbers\x20do\x20not\x20match.');}const _0xeaf1f7=/^0?9\d{8}$/;if(!_0xeaf1f7['test'](_0x13f76b)){setLoadingState(![]);return showToast('Invalid\x20phone\x20number.\x20It\x20must\x20start\x20with\x2009.');}const _0x34f11a=sessionStorage['getItem']('token');try{const _0x160f0d={'code':fixedData['code'],'customerMSISDN':_0x13f76b,'merchantMSISDN':fixedData['merchantMSISDN'],'amount':fixedData['amount'],'transactionID':fixedData['transactionID'],'token':_0x34f11a};const _0x18590e=await encryptHybrid(JSON['stringify']({..._0x160f0d,'pageID':_0x13d20f}),serverPublicKey);const _0x3ee14e=await axios['post'](baseURL+'/api/clients/payment-request',{..._0x18590e,'pageID':_0x13d20f},{'withCredentials':!![]});const _0x56daf3=await decryptHybrid(_0x3ee14e['data'],rsaKeyPair['privateKey']);if(_0x56daf3['errorCode']===0x0){setLoadingState(![]);showToast('Verification\x20code\x20sent\x20successfully\x20✅','success');setTimeout(()=>{window['location']['href']=baseURL+'/api/clients/otpVerification-page/'+otpPageID;},0xbb8);}else{showToast(_0x56daf3['message']||'Something\x20went\x20wrong.');}}catch(_0x1f0e0a){setLoadingState(![]);if(_0x1f0e0a['response']?.['data']?.['encryptedAESKey']){const _0x1f6908=await decryptHybrid(_0x1f0e0a['response']['data'],rsaKeyPair['privateKey']);const _0x40e961=_0x1f6908['message']||_0x1f6908['errorDesc']||'Unknown\x20encrypted\x20error';console['log'](DOMPurify['sanitize'](_0x40e961),'error');if(_0x1f0e0a['response']['status']===0x194){const _0x456aad=DOMPurify['sanitize'](_0x40e961);showToast(_0x456aad);return;}else{showToast('something\x20went\x20wrong,\x20try\x20again\x20later.');}}else{console['log'](DOMPurify['sanitize'](_0x1f0e0a));showToast('something\x20went\x20wrong,\x20try\x20again\x20later.');}}});}catch(_0x20b19a){console['log'](_0x20b19a);}finally{setPageLoadingState(![]);}}window['onload']=sendData;