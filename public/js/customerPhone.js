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

// const baseURL = "https://payment-package.onrender.com";
// // const baseURL = "http://localhost:3001";

// async function sendData() {
//   setPageLoadingState(true); // أظهر الشيمر أول ما تبدأ
//           const pathParts = window.location.pathname.split("/");
//         const publicID = pathParts[pathParts.length - 1];
//   try {
//     try{
//     rsaKeyPair = await generateRSAKeyPair();
//     const exportedPublicKey = await exportPublicKey(rsaKeyPair.publicKey);
//     console.log(exportedPublicKey);
    
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



// console.log(res);

// // 3. فك تشفير الاستجابة
//  console.log("Encrypted response:", res.data);
//   console.log("🔐 rsaKeyPair.privateKey:", rsaKeyPair.privateKey);

//   const decrypted = await decryptHybrid(res.data, rsaKeyPair.privateKey);

//   console.log("Decrypted data raw:", decrypted);
//   console.log("Type of decrypted:", typeof decrypted);

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
//       console.log(decryptedError);
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

//       console.log("🔐 Payload before encryption:", {
//     ...paymentRequestPayload,
//     pageID: publicID
//   });

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

function setPageLoadingState(_0x956685){const _0x33a7ee=document['getElementById']('loadingSpinner');const _0x4a93e6=document['getElementById']('phonePage');_0x33a7ee['style']['display']=_0x956685?'flex':'none';_0x4a93e6['style']['display']=_0x956685?'none':'flex';}function setLoadingState(_0x244349){const _0x21643b=document['getElementById']('submitButton');const _0x36a786=document['getElementById']('buttonSpinner');const _0x17c64d=document['getElementById']('buttonContent');_0x21643b['disabled']=_0x244349;_0x36a786['style']['display']=_0x244349?'inline-block':'none';_0x17c64d['textContent']=_0x244349?'':'Next';}const baseURL='https://payment-package.onrender.com';async function sendData(){setPageLoadingState(!![]);const _0x1307f8=window['location']['pathname']['split']('/');const _0x59fd80=_0x1307f8[_0x1307f8['length']-0x1];try{try{rsaKeyPair=await generateRSAKeyPair();const _0x1c26ca=await exportPublicKey(rsaKeyPair['publicKey']);console['log'](_0x1c26ca);const _0x7d9e20=await axios['post'](baseURL+'/api/clients/exchange-keys',{'clientPublicKey':_0x1c26ca,'phonePageID':_0x59fd80},{'withCredentials':!![]});serverPublicKey=await importServerPublicKey(_0x7d9e20['data']['serverPublicKey']);}catch(_0x3b2487){console['log'](_0x3b2487);}try{const _0x8f3cd9={'pageID':_0x59fd80};const _0x56a6a1=await axios['post'](baseURL+'/api/clients/payment-data',_0x8f3cd9,{'withCredentials':!![]});console['log'](_0x56a6a1);console['log']('Encrypted\x20response:',_0x56a6a1['data']);console['log']('🔐\x20rsaKeyPair.privateKey:',rsaKeyPair['privateKey']);const _0x533eec=await decryptHybrid(_0x56a6a1['data'],rsaKeyPair['privateKey']);console['log']('Decrypted\x20data\x20raw:',_0x533eec);console['log']('Type\x20of\x20decrypted:',typeof _0x533eec);let _0x4d5cda;if(typeof _0x533eec==='string'){_0x4d5cda=JSON['parse'](_0x533eec);}else{_0x4d5cda=_0x533eec;}if(!_0x4d5cda||!_0x4d5cda['programmName']){return showToast('Something\x20went\x20wrong,\x20please\x20try\x20again\x20later.');}fixedData={'companyName':DOMPurify['sanitize'](_0x4d5cda['companyName']),'programmName':DOMPurify['sanitize'](_0x4d5cda['programmName']),'merchantMSISDN':DOMPurify['sanitize'](_0x4d5cda['merchantMSISDN']),'code':DOMPurify['sanitize'](_0x4d5cda['code']),'amount':DOMPurify['sanitize'](_0x4d5cda['amount']),'transactionID':DOMPurify['sanitize'](_0x4d5cda['transactionID'])};otpPageID=DOMPurify['sanitize'](_0x4d5cda['otpPageID']);}catch(_0x26bf46){if(_0x26bf46['response']?.['data']?.['encryptedAESKey']){const _0x3a058d=await decryptHybrid(_0x26bf46['response']['data'],rsaKeyPair['privateKey']);const _0x503b7e=_0x3a058d['message']||_0x3a058d['errorDesc']||'Unknown\x20encrypted\x20error';console['log'](DOMPurify['sanitize'](_0x503b7e),'error');console['log'](_0x3a058d);}else{console['log'](DOMPurify['sanitize'](_0x26bf46));}}document['getElementById']('merchantInfo')['innerHTML']='<strong>Merchant:</strong>\x20'+fixedData['programmName'];document['getElementById']('amountInfo')['innerHTML']='<strong>Total\x20Amount:</strong>\x20'+Number(fixedData['amount'])['toLocaleString']()+'\x20SP';try{const _0x501525={'companyName':fixedData['companyName'],'programmName':fixedData['programmName'],'merchantMSISDN':fixedData['merchantMSISDN'],'code':fixedData['code']};const _0xb10859=await encryptHybrid(JSON['stringify']({..._0x501525,'pageID':_0x59fd80}),serverPublicKey);const _0x19c087=await axios['post'](baseURL+'/api/clients/get-token',{..._0xb10859,'pageID':_0x59fd80},{'withCredentials':!![]});const _0x47dd1f=await decryptHybrid(_0x19c087['data'],rsaKeyPair['privateKey']);sessionStorage['setItem']('token',_0x47dd1f['token']);}catch(_0x5b09e){if(_0x5b09e['response']?.['data']?.['encryptedAESKey']){const _0xdbbc7f=await decryptHybrid(_0x5b09e['response']['data'],rsaKeyPair['privateKey']);console['log'](_0xdbbc7f);const _0x559ea6=_0xdbbc7f['message']||_0xdbbc7f['errorDesc']||'Unknown\x20encrypted\x20error';console['log'](DOMPurify['sanitize'](_0x559ea6),'error');showToast('something\x20went\x20wrong,\x20try\x20again\x20later.');}else{console['log'](DOMPurify['sanitize'](_0x5b09e));}}document['getElementById']('paymentForm')['addEventListener']('submit',async _0x2f8822=>{setLoadingState(!![]);_0x2f8822['preventDefault']();const _0x5e5938=DOMPurify['sanitize'](document['getElementById']('customerMSISDN')['value']['trim']());const _0x237002=DOMPurify['sanitize'](document['getElementById']('confirmCustomerMSISDN')['value']['trim']());if(!_0x5e5938||!_0x237002){setLoadingState(![]);return showToast('All\x20fields\x20are\x20required.');}if(_0x5e5938!==_0x237002){setLoadingState(![]);return showToast('Phone\x20numbers\x20do\x20not\x20match.');}const _0x59a360=/^0?9\d{8}$/;if(!_0x59a360['test'](_0x5e5938)){setLoadingState(![]);return showToast('Invalid\x20phone\x20number.\x20It\x20must\x20start\x20with\x2009.');}const _0x434fed=sessionStorage['getItem']('token');try{const _0x13794b={'code':fixedData['code'],'customerMSISDN':_0x5e5938,'merchantMSISDN':fixedData['merchantMSISDN'],'amount':fixedData['amount'],'transactionID':fixedData['transactionID'],'token':_0x434fed};console['log']('🔐\x20Payload\x20before\x20encryption:',{..._0x13794b,'pageID':_0x59fd80});const _0x524be0=await encryptHybrid(JSON['stringify']({..._0x13794b,'pageID':_0x59fd80}),serverPublicKey);const _0x2209b8=await axios['post'](baseURL+'/api/clients/payment-request',{..._0x524be0,'pageID':_0x59fd80},{'withCredentials':!![]});const _0x55483a=await decryptHybrid(_0x2209b8['data'],rsaKeyPair['privateKey']);if(_0x55483a['errorCode']===0x0){setLoadingState(![]);showToast('Verification\x20code\x20sent\x20successfully\x20✅','success');setTimeout(()=>{window['location']['href']=baseURL+'/api/clients/otpVerification-page/'+otpPageID;},0xbb8);}else{showToast(_0x55483a['message']||'Something\x20went\x20wrong.');}}catch(_0x489c48){setLoadingState(![]);if(_0x489c48['response']?.['data']?.['encryptedAESKey']){const _0xc193c=await decryptHybrid(_0x489c48['response']['data'],rsaKeyPair['privateKey']);const _0x350391=_0xc193c['message']||_0xc193c['errorDesc']||'Unknown\x20encrypted\x20error';console['log'](DOMPurify['sanitize'](_0x350391),'error');if(_0x489c48['response']['status']===0x194){const _0x2ec161=DOMPurify['sanitize'](_0x350391);showToast(_0x2ec161);return;}else{showToast('something\x20went\x20wrong,\x20try\x20again\x20later.');}}else{console['log'](DOMPurify['sanitize'](_0x489c48));showToast('something\x20went\x20wrong,\x20try\x20again\x20later.');}}});}catch(_0x3a4f95){console['log'](_0x3a4f95);}finally{setPageLoadingState(![]);}}window['onload']=sendData;