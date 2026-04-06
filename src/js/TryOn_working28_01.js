/* @ tanmay 02-09-2024*/
console.log("Q3d_Appplication_Tryon V2.3 13-12-2024");
import { serviceUrl, darcoPath } from "./config.js";
import { rediretTryonToQ3dDrapeFabric, stopBuffer, startBuffer } from "./q3dFunction.js"
import QRCode from "qrcode";
import html2pdf from "html2pdf.js";
import { lib } from "crypto-js";
let param = {};
let TdsPluginObj = "";
let garmentImageUrl="";
 
let details = [];
let favList = [];
let TryOnConfig, searchDesignData = undefined;
let lastKeyTime = 0;
let currentTime = 0
let isBarcodeScan = false;
let counter = 0;
let tryonProduct = ['women dress', 'school uniform', 'hijab', 'kurta', 'suit', 'ethnic', 'sherwani']
let TproductType,
  tryonThreedimage,
  Tproduct,
  tryonThreedCol, backBtnClickDesignData = undefined;
  let isClickOnImageCaptureBtn = false
const tryonIndex_name = `tryonIndex`;
let dtop = 'https://s3.ap-south-1.amazonaws.com/aws.tds/dam/q3d/tryon_img/Default_shirt.webp';
let dbottom = 'https://s3.ap-south-1.amazonaws.com/aws.tds/dam/q3d/tryon_img/Default_trouser.webp';
let wtop = "https://tds-tryon.s3.ap-south-1.amazonaws.com/content/Images/Background/w_top1.webp";
let wbottom = "https://tds-tryon.s3.ap-south-1.amazonaws.com/content/Images/Background/w_bottom1.webp";
// startBuffer();
export function startTryon(
  q3d_Plugin,
  designUrl,
  designWidth,
  designHeight,
  designCode, 
  counter
) {
  TdsPluginObj = q3d_Plugin;
  const getModal = ({
    designUrl,
    modalURL,
    modalImg,
    designWidth,
    designHeight,
  }) => {
    return new Promise((resolve, reject) => {
      //
      q3d_Plugin.getModalPng({
        designUrl,
        modalURL,
        designWidth,
        designHeight,
        dracoPath: darcoPath,
        callback: async function (data) {
          resolve(data);
        },
      });
    });
  };
  //$('#New_loader_css1').show();
  startBufferLoader();
  $("video")[0].play();
  $('.right_box').addClass('active');
  $('#tryOnResetBtn').css('display', 'none');
  let libraryName = $("#styleThumbImageList li.active")
    .attr("fab-product")
    .toLowerCase();
     const TOP_WEAR = ["shirt", "jacket"];
const BOTTOM_WEAR = ["trouser"];
const FULL_WEAR = ["suit"];

if (FULL_WEAR.includes(libraryName)) {
  window.currentInjectedClothingType = "Fullset_Clothing";
}
else if (BOTTOM_WEAR.includes(libraryName)) {
  window.currentInjectedClothingType = "Bottom_Clothing";
}
else if (TOP_WEAR.includes(libraryName)) {
  window.currentInjectedClothingType = "Top_Clothing";
}else {
  console.warn("Unknown clothing type:", libraryName);
  window.currentInjectedClothingType = null;
}
    window.currentInjectedCategoryName = libraryName;

  //let libraryName = $('#groupInfo .active').attr('groupname').toLowerCase();
  if(libraryName == 'trouser'){
    $('.tryon_body').addClass('t_bottom');
  } else if(tryonProduct.includes(libraryName)){
    $('.tryon_body').addClass('t_fullset');
  } else {
    $('.tryon_body').removeClass('t_fullset');
    $('.tryon_body').removeClass('t_bottom');
  }
  tryonThreedCol = getTryonImageConfiguration();
  tryonThreedimage = tryonThreedCol.filter((pname) => {
    return pname.productName.toLowerCase() == libraryName;
  });
  if (tryonThreedimage == "") {
    alert("There is no tryon images for this style");
    $(".tryon_page").css("display", "none");
    stopBuffer();
  }
  $(".t_fab_name").text(designCode);
  $(".tfoot_style_name").text(libraryName);
  let fabURL = designUrl;
  let tWidth = designWidth;
  let tHeight = designHeight;
  Object.assign(param, {
    ["myFab"]: fabURL,
    ["tWidth"]: tWidth,
    ["tHeight"]: tHeight,
  });
  let styleName = tryonThreedimage[0].images[0].threeDImageName;
  let modalURL = tryonThreedimage[0].images[0].gltfPath;
  let threed_length =
    tryonThreedimage[0].images.length <= 1
      ? tryonThreedimage[0].images.length
      : 1;
  let gIndex = 0;
  let isView = true;
  let containerDiv = "containerDiv";
  TproductType = "men";
  Tproduct = libraryName;
  q3d_Plugin.getModalPng({fabURL,modalURL,tWidth,tHeight,dracoPath: darcoPath,
    callback: async function (data) {
      for (let index = 1; index < threed_length; index++) {
        const imageData = await getModal({
          fabURL,
          modalURL: tryonThreedimage[0].images[index].gltfPath,
          tHeight,
          tWidth,
        });
        tryonThreedimage[0].images[index].base64 = imageData.Modal;
      }
      if (!data.error) {
        tryonThreedimage[0].images[0].base64 = data.Modal;
            const base64Data = data.Modal; 
    let blobUrl = null;

    if (base64Data) {
        let content, mime;
        if (base64Data.includes(',')) {
            const [metadata, raw] = base64Data.split(',');
            content = raw;
            mime = metadata.match(/:(.*?);/)[1]; 
        } else {
            content = base64Data;
            mime = 'image/png';
        }

        const byteChars = atob(content);
        const byteNumbers = new Array(byteChars.length);
        for (let i = 0; i < byteChars.length; i++) {
            byteNumbers[i] = byteChars.charCodeAt(i);
        }

        const blob = new Blob([new Uint8Array(byteNumbers)], { type: mime });
        blobUrl = URL.createObjectURL(blob);
    }

    // Now blobUrl can be used immediately in <img> or anywhere
    // document.getElementById("fullImageView").src = blobUrl;
    // $(".t_fabric_img img").attr("src", blobUrl);

    // Optional: store it globally
    // window.garmentImageUrl = blobUrl;


       // window.garmentImage = data.Modal;
       // console.log("👕 Garment image ready");
        $('.fabric_zoom').css('display', 'block');
        $("#fullImageView").attr("src", data.Modal);
        $(".t_fabric_img img").attr("src", data.Modal);
        //$('#New_loader_css1').hide();
        stopBufferLoader();
        details.push(data.Modal);
        let modal_TopImg = data.Modal;
        q3d_Plugin.stopAnimation(true);
       // garmentImageUrl = data.Modal;
          garmentImageUrl = blobUrl;
       let category = window.currentInjectedCategoryName;
        let clothingType = window.currentInjectedClothingType;

          try {
    await waitForTryOnReady();

    window.tryOnFromGarmentImage(garmentImageUrl, "men" ,category,clothingType);
    // 🔹 restrict plugin UI to injected variant only
setTimeout(() => {
  applyTryonUIRestriction();
  if (window.currentInjectedCategoryName !== "shirt") {
    activatePluginCategory(
      window.currentInjectedCategoryName.charAt(0).toUpperCase() +
      window.currentInjectedCategoryName.slice(1)
    );
  }
    activateFirstVariantFromInjectedCategory();
}, 0);

    $("#root .tryon-frame").css("visibility", "visible");

    // Stop buffer only after TryOn canvas ready
    stopBufferLoader();
} catch (err) {
    console.error("TryOn API not ready", err);
    stopBufferLoader();
}

 // Waits until TryOn API is ready before calling tryOnFromGarmentImage

function waitForTryOnReady({ maxRetry = 10, delay = 300 } = {}) {
    return new Promise((resolve, reject) => {
        let retry = 0;

        const check = () => {
            if (
                window._tdstryoncore &&
                window.appState?.isInitialized === true &&
                typeof window.tryOnFromGarmentImage === "function"
            ) {
                resolve(true);
                return;
            }

            retry++;
            if (retry >= maxRetry) {
                reject(new Error("TryOn API not ready"));
                return;
            }

            setTimeout(check, delay);
        };

        check();
    });
}
      
    //       if (
    //     window._tdstryoncore &&
    //     window.appState?.isInitialized === true &&
    //     typeof window.tryOnFromGarmentImage === "function"
    // ) {
    //     window.tryOnFromGarmentImage(garmentImageUrl, "male");
    //        $("#root .tryon-frame").css("visibility", "visible");
    //     return;
    // }

    // // Try again (max ~3 seconds)
    // if (retry < 10) {
    //     setTimeout(() => {
    //         waitAndCallTryOn(retry + 1);
    //     }, 300);
    // } else {
    //     console.error("❌ TryOn API not ready");
    // }


      
        // if (TryOnConfig == undefined) {
        //   TryOnPlugin(
        //     containerDiv,
        //     TproductType,
        //     Tproduct,
        //     modal_TopImg,
        //     isView
        //   );
        // } else {
        //   TryonFunc();
        //   TryonWrapImg(libraryName, TproductType, data.Modal);
        // }
      }
      $(".tryon_page").css("display", "block");
      if(counter == 1){
        $('#New_loader_css1').css('display', 'block');
        //$('#CameraImageDiv').css('display', 'block');
        // startBuffer();
        
        setTimeout(()=>{
          stoploader();
        }, 8000);
      }
    },
  });
  appendTryonStyle(tryonThreedimage);
  checkItemFavWishlist();
}
// let loaderCall = setInterval(stoploader, 1000);

function getTryonImageConfiguration() {
  let result = "";
  let payload = sessionStorage.getItem("jsonString") ? JSON.parse(sessionStorage.getItem("jsonString")).organisationId : JSON.parse(sessionStorage.qrScanDataAuth).organisationId;
  let url =
    serviceUrl +
    "/api/Configuration/GetTryonImageConfigurations?OrganisationId=" +
    payload;
  $.ajax({
    url: url,
    type: "GET",
    async: false,
    dataType: "json",
  })
    .done(function (r) {
      if (r != "" || r != null) {
        result = r;
      } else {
        alert("TryonImageConfiguration is empty");
      }
    })
    .fail(function (jqXhr, textStatus, errorThrown) {
      console.log("error while getTryonThreeDCollection");
    });
  return result;
}
function stoploader(){
  // if($('#CameraImageDiv').css('display') == 'block'){
  //   $('.overlay').css('display', 'none');
  //   $('#New_loader_css').css('display', 'none');
  //   $('#New_loader_css1').css('display', 'none');
  //   //clearInterval(loaderCall);
  // } else {
  //   $('.overlay').css('display', 'none');
  //   $('#New_loader_css').css('display', 'none');1067
  //   $('#New_loader_css1').css('display', 'none');
  // }
  $('.overlay').css('display', 'none');
  $('#New_loader_css').css('display', 'none');
  $('#New_loader_css1').css('display', 'none');
}


// async function TryOnPlugin(containerDiv, TproductType, Tproduct, modal_TopImg, isView) {

//   // 🔒 HARD CHECK (prevents silent failure)
//   if (
//     !window.TryonPluginCore ||
//     !window.TryonPluginCore.TdsTryonCore
//   ) {
//    // console.error("❌ TryOn core class not exposed");
//     console.log("TryonPluginCore =", window.TryonPluginCore);
//     return;
//   }
  

//   // ✅ CORRECT CONSTRUCTOR
//   TryOnConfig = new window.TryonPluginCore.TdsTryonCore({
//     containerDiv: containerDiv,
//     productType: TproductType,
//     productGroup: Tproduct,
//     modelTopImg: Tproduct === "trouser" ? undefined : modal_TopImg,
//     modelBottomImg: Tproduct === "trouser" ? modal_TopImg : undefined,
//     isTotem: isView,
//     tryOnVideoDivId: "tryon_video",
//     uploadBtnId: "uploadImg",
//   });
// TryonFunc();

// }

// function TryonFunc() {
//   if (window._tdstryoncore) {
//     console.log("TryonFunc: rendering tryon core"); 
//     window._tdstryoncore.renderTryon();
//   }
// }
function TryonWrapImg(libraryName, Gender, tryonImg) {
  if (libraryName == "shirt" || libraryName == "jacket") {
    TryOnConfig.changeImage(TproductType, libraryName, undefined, tryonImg);
    TryOnConfig.changeBottomImage(
      TproductType,
      "trouser",
      undefined,
      Gender == "men" ? dbottom : wbottom
    );
  } else if (libraryName == "trouser") {
    TryOnConfig.changeImage(
      TproductType,
      "shirt",
      undefined,
      Gender == "men" ? dtop : wbottom
    );
    TryOnConfig.changeBottomImage(
      TproductType,
      libraryName,
      undefined,
      tryonImg
    );
  } else {
    TryOnConfig.changeImage(TproductType, libraryName, undefined, tryonImg);
  }
}
function appendTryonStyle(tryonThreedimage) {
  let styleApend = "";
  let styleName = tryonThreedimage[0].images; //styleName.images
  styleName.forEach((index, value) => {
    styleApend += `<div class="t_style_box" id="tryonIndex-${value}" Index="${value}">`;
    styleApend += `<div class="t_style_img" imgid="${styleName[value].threeDImageId}">`;
    styleApend += `<img class="t_style_thumb" src="${styleName[value].thumbUrl}" alt="tryon style img" loading="lazy">`;
    styleApend += `<div class="marked"> <img src="https://s3.ap-south-1.amazonaws.com/aws.tds/dam/q3d/images/selected.svg" alt="marked image" loading="lazy"></div>`;
    styleApend += `</div>`;
    styleApend += `<div class="t_style_name">${styleName[value].threeDImageName}</div>`;
    styleApend += `</div>`;
  });
  $(".t_style_panel").empty().append(styleApend);
  $($(".t_style_box .t_style_img .marked")[0]).addClass("active");
}
function startBufferLoader(){
  $('.overlay').css('display', 'block');
  $('#New_loader_css1').show();
  console.log("Buffer loader started");
} 
function stopBufferLoader(){
  $('.overlay').css('display', 'none');
  $('#New_loader_css1').hide();
  console.log("Buffer loader stopped");
}
function nextClick(swap) {
  //$('#New_loader_css1').show();
  startBufferLoader();
  $("video")[0].pause();
  const nextIndex = getnextIndex(
    getCurrentIndexd(),
    tryonThreedimage[0].images.length - 1,
    swap
  );
  showSelection(nextIndex);

  let currentindex = nextIndex;
  wrapGetModalpng(currentindex);
}
function getnextIndex(currentIndex, max, swap) {
  currentIndex = parseInt(currentIndex);
  if (swap === "right") {
    if (currentIndex == max) {
      return 0;
    } else {
      return currentIndex + 1;
    }
  } else if (swap === "left") {
    if (currentIndex == 0) {
      return max;
    } else {
      return currentIndex - 1;
    }
  }
}
function getCurrentIndexd() {
  return $(".t_style_box .marked.active").parent().parent().attr("index");
}
function showSelection(nextIndex) {
  let currentIndex = parseInt(getCurrentIndexd());
  $(`#${tryonIndex_name}-${currentIndex} .marked.active`).removeClass("active");
  $(`#${tryonIndex_name}-${nextIndex} .marked`).addClass("active");
}
function wrapGetModalpng(currentindex, videoF) {
  // if($("#addFavBtn").hasClass('active')){ //wishlist
  //   $("#addFavBtn").removeClass('active');
  // }
  let fabURL = param.myFab;
  if (fabURL == undefined) {
    let cacheObj = tryonThreedimage[0]["images"];
    for (let key in cacheObj) {
      if (cacheObj.hasOwnProperty(key)) {
        delete cacheObj[key].base64;
      }
    }
  }
  // let styleImageId = parseInt($(".styleme_product .marked.active").parent().attr("imgid"));
  // let fabName = $(".tryon_fabric_name .t_fab_name").text();
  // if (checkModalImg(styleImageId,fabName)) { //wishlist
  //   $("#addFavBtn").addClass('active')
  // } else {
  //   $("#addFavBtn").removeClass('active')
  // }
  let tWidth = param.tWidth;
  let tHeight = param.tHeight;
  // let modalURL = tryonThreedimage[0].images[currentindex].gltfPath;
  // let modalImg = tryonThreedimage[0].images[currentindex].thumbUrl;
  let modalURL = window.selectedProductAssets.gltfPath;
  let modalImg = window.selectedProductAssets.thumb_url;
  modalImg = modalImg
    .replace("t.", "b.")
    .replace(".jpg", ".png")
    .replace(".jpeg", ".png");

  // if (tryonThreedimage[0].images[currentindex].base64) {
  //   let libraryName = Tproduct;
  //   TryonWrapImg(
  //     libraryName,
  //     TproductType,
  //     tryonThreedimage[0].images[currentindex].base64
  //   );
  //   $("#fullImageView").attr(
  //     "src",
  //     tryonThreedimage[0].images[currentindex].base64
  //   );
  //   $(".t_fabric_img img").attr(
  //     "src",
  //     tryonThreedimage[0].images[currentindex].base64
  //   );
  //   $("video")[0].play();
  //   //$('#New_loader_css1').hide();
  //   stopBufferLoader();
  // } else {
    TdsPluginObj.getModalPng({
      fabURL,
      modalURL,
      tWidth,
      tHeight,
      dracoPath: darcoPath,
      callback: function (data) {
        let libraryName = Tproduct;
        //TryonWrapImg(libraryName, TproductType, data.Modal);
        stopPluginLoader();
        _tdstryoncore.TryonWrapImg(data.Modal, _tdstryoncore.getActiveClothingType());
       
        $("#fullImageView").attr("src", data.Modal);
        $(".t_fabric_img img").attr("src", data.Modal);
        //$('#New_loader_css1').hide();
        stopBufferLoader();
        tryonThreedimage[0].images[currentindex].base64 = data.Modal;
        if (videoF) {
          $("video")[0].pause();
        } else {
          $("video")[0].play();
        }
      },
    });
  }

function UploadImgForQr(base64, extension) {
  $("#QR_popup").addClass("show");
  $("#QR_popup").css("display", "block");
  let payload = new Object();
  //tanmay Added New Working Imp
  if (extension == "pdf") {
    payload.base64image = base64.split(",")[0];
  } else {
    payload.base64image = base64.split(",")[1];
  }
  payload.supplierId = JSON.parse(sessionStorage.jsonString).userid;
  payload.extension = extension;

  $.ajax({
    url: serviceUrl + "/api/Configuration/SaveBase64ImageAndPdf",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(payload),
    async: false,
  })
    .done((result) => {
      let option = {
        width: 250,
        height: 250,
        colorDark: "#000000",
        colorLight: "#ffffff",
        padding: 10,
      };
      var responseUrl = result;
      QRCode.toDataURL(responseUrl, option)
        .then((url) => {
          $(".qr_loader img").attr("src", url);
        })
        .catch((err) => {
          console.error(err);
        });
    })
    .fail((jqXhr, textStatus, errorThrown) => {
      console.error();
    });
}
// function createTryonImg(shareImgURL, fabName, styleName, extension) {
//   $(".qr_loader img").attr("src", "");
//   var shareImgURL = shareImgURL;
//   var frameImg = new Image();
//   frameImg.crossOrigin = "anonymous";
//   frameImg.onload = () => {
//     var shareImg = new Image();
//     shareImg.crossOrigin = "anonymous";
//     shareImg.onload = () => {
//       var clientLogo = new Image();
//       clientLogo.crossOrigin = "anonymous";
//       clientLogo.onload = () => {
//         var canvas = document.createElement("canvas");
//         var ctx = canvas.getContext("2d");
//         canvas.id = "canvas_id";
//         canvas.width = frameImg.width;
//         canvas.height = frameImg.height;
//         ctx.beginPath();
//         ctx.rect(0, 0, canvas.width, canvas.height);
//         ctx.fillStyle = "white";
//         ctx.fill();
//         ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
//         let Custom_offsetHight = 1771;
//         let Custom_offsetWidth = 1113;
//         if (shareImg.width <= 1080) {
//           ctx.drawImage(
//             shareImg,
//             123,
//             213,
//             Custom_offsetWidth,
//             Custom_offsetHight + 315
//           );
//         } else {
//           ctx.drawImage(
//             shareImg,
//             123,
//             213,
//             Custom_offsetWidth,
//             Custom_offsetHight
//           );
//         }
//         ctx.fillStyle = "black";
//         ctx.font = "bold 36px Arial";
//         ctx.fillText("Fabric ID :", 121, 2080);
//         ctx.fillText(fabName, 318, 2080);
//         ctx.fillText("Style Name :", 700, 2080);
//         ctx.fillText(styleName, 950, 2080);
//         UploadImgForQr(canvas.toDataURL("image/jpeg"), extension);
//       };
//       clientLogo.src =
//         "https://s3.ap-south-1.amazonaws.com/aws.tds/dam/q3d/images/client.png";
//     };
//     shareImg.src = shareImgURL;
//   };
//   frameImg.src ="https://s3.ap-south-1.amazonaws.com/aws.tds/dam/q3d/images/frame6.png";
//     // "https://s3.ap-south-1.amazonaws.com/aws.tds/dam/q3d/images/totem_frame.png";
// }
function createTryonImg(shareImgURL, fabName, styleName, extension) {
  $(".qr_loader img").attr("src", "");
  var shareImgURL = shareImgURL;
  var frameImg = new Image();
  frameImg.crossOrigin = "anonymous";
  frameImg.onload = () => {
    var shareImg = new Image();
    shareImg.crossOrigin = "anonymous";
    shareImg.onload = () => {
      var clientLogo = new Image();
      clientLogo.crossOrigin = "anonymous";
      clientLogo.onload = () => {
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        canvas.id = "canvas_id";
        canvas.width = shareImg.width;
        canvas.height = shareImg.height;
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.fill();
          ctx.drawImage(
            shareImg,
            0,
            0,
            canvas.width,
            canvas.height
          );
        ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
        const margin = canvas.width * 0.032 //here 0.032 is margin from left
        const YPos = canvas.height - (canvas.height * 0.035) // 0.03 is margin from down
        const limitSize =  canvas.width / 2 - margin
        let widthFactor = canvas.width / 1348
        let heightFactor = canvas.height /2192
        let fontSize = 36 * (widthFactor + heightFactor)/2
        drawFooterText(`Fabric ID : `,fabName,ctx,limitSize,margin,YPos,fontSize,margin)
        drawFooterText(` Style Name : `,styleName,ctx,limitSize,canvas.width/2 + (margin/2),YPos,fontSize,0)
        UploadImgForQr(canvas.toDataURL("image/jpeg"), extension);
      };
      clientLogo.src =
        "https://s3.ap-south-1.amazonaws.com/aws.tds/dam/q3d/images/client.png";
    };
    shareImg.src = shareImgURL;
  };
  frameImg.src ="https://s3.ap-south-1.amazonaws.com/aws.tds/dam/q3d/images/frame6.png";
    // "https://s3.ap-south-1.amazonaws.com/aws.tds/dam/q3d/images/totem_frame.png";
}

function drawFooterText(key,text,context,limitSize,Xpos,Ypos,fontSize = 36,leftMargin){
  context.fillStyle = "black";
  context.font = `bold ${fontSize}px Arial`;
  text = key + text
  let measurment = context.measureText(text);
  if (measurment.width + leftMargin > limitSize) {
    context.font = "bold 27px Arial";
    measurment = context.measureText(text);
    let keyWidth = context.measureText(key).width;
    let textHeight = parseInt(measurment.fontBoundingBoxAscent) + parseInt(measurment.fontBoundingBoxDescent);
    let perCharWidth = measurment.width / text.length;
    let maxCharInLine = limitSize / perCharWidth;
    let totalLines = Math.ceil(text.length / maxCharInLine);
    let index = 0;
    for (let line = 0; line < totalLines; line++) {
      if (line == 0) {
        let tempFab = text.substring(0, maxCharInLine);
        Ypos = totalLines == 1 ? Ypos : Ypos - ((totalLines - 1)  * textHeight)
        context.fillText(tempFab, Xpos, Ypos);
      }else{
          let tempFab = text.substring(index, index + maxCharInLine);
          context.fillText(tempFab, Xpos + keyWidth, Ypos);
      }
      index += maxCharInLine;
      Ypos += textHeight
    }
  } else {
    context.fillText(text, Xpos, Ypos);
  }
}
function addFavitemWishlist(id, fabName, data) {
  if (!favList[id]) {
    favList[id] = { [fabName]: data };
  } else {
    favList[id][fabName] = data;
  }
  AppendWishlist(`${id}^${fabName}`, data);
  $("#addFavBtn").addClass("active");
  let totalWishList = $(`#myFevList .form-check-input`).length; //msg
      let selectedCount = 0;
      $(".msg")
        .empty()
        .text(
          `${0}/${
            totalWishList == undefined ? 0 : totalWishList
          } selected`);
}
function deleteFavitemWishlist(id, fabName, f) {
  if (f) {
    favList = {};
  } else {
    delete favList[id][fabName];
    if (Object.keys(favList[id]).length == 0) {
      delete favList[id];
    }
  }
}
function checkModalImg(id, fabName) {
  return favList[id] && favList[id][fabName];
}
function AppendWishlist(id, data) {
  let myFavAppendTxt = "";
  myFavAppendTxt += `<div class="product_wrap" id=${id}>`;
  myFavAppendTxt += `<div class="form-check product_checkbox">
                  <input class="form-check-input" type="checkbox" name='wishlistcheck' value="">
                 </div>`;
  myFavAppendTxt += `<div class="product_img"><img loading="lazy" alt="Favourites product image" src="${data.url}"></div>`;
  myFavAppendTxt += `<div class="product_details">`;
  myFavAppendTxt += `<p class="product_name">${id.split("^")[1]}</p>`;
  myFavAppendTxt += `<p class="product_price">Rs.742 (55% OFF)</p>`;
  myFavAppendTxt += `</div>`;
  myFavAppendTxt += `</div>`;
  $(".fav_product").append(myFavAppendTxt);
}
function checkItemFavWishlist() {
  let styleImageId = parseInt(
    $(".t_style_box .marked.active").parent().attr("imgid")
  );
  let fabName = $(".tryon_fabric_name .t_fab_name").text();
  if (!checkModalImg(styleImageId, fabName)) {
    $("#addFavBtn").removeClass("active");
  } else {
    $("#addFavBtn").addClass("active");
  }
}
function clearcache() {
  var cacheObj = tryonThreedimage[0]["images"];
  for (var key in cacheObj) {
    if (cacheObj.hasOwnProperty(key)) {
      delete cacheObj[key].base64;
    }
  }
}
function wishlistCheckBoxSelected(pid) {
  let selectedCount = 0;
  $(`#${pid} .form-check-input`).map((e, k) => {
    if (k.checked) {
      selectedCount++;
    }
  });
  let totalWishList = $(`#${pid} .form-check-input`).length; //msg
  if(totalWishList == selectedCount){
    $("#allCheckBoxSelectWishList .form-check-input").prop("checked", true);
  } else {
    $("#allCheckBoxSelectWishList .form-check-input").prop("checked", false);
  }
  $(".msg")
    .empty()
    .text(
      `${selectedCount}/${
        totalWishList == undefined ? 0 : totalWishList
      } selected`
    );
}
async function htmlForPdf() {
  let allData = getAllwishlistData();
  let imageData = "";

  imageData +=
    '<div id="main_div" >' +
    '<div id="fav2" ><img src="https://s3.ap-south-1.amazonaws.com/aws.tds/dam/q3d/images/client.png" style="width: 100px;padding-left: 15px;padding-top: 5px;float: left;"></img></div>' +
    '<div id="fav3" ><img src="https://s3.ap-south-1.amazonaws.com/aws.tds/dam/q3d/images/tryon.png" style="width: 100px;padding-left: 15px;padding-top: 5px;float: right;"></img></div>' +
    "<br>" +
    "</br>" +
    '<div id="fav" style="text-align: left;background-color: #f5f5f5;padding:12px 12px;font-size: 14px;font-weight: 600;color:#000!important;border-top: 1px solid;width: 100%">FAVOURITES</div>' +
    '<div id="div" style="overflow-x: visible !important;">';

  for (let i = 0; i < allData.length; i++) {
    let imgPath = allData[i].url;
    let image_name = allData[i].fabName;
    imageData +=
      '<table style="width:160mm;margin-left:24mm;border-spacing: 8px;display:flex">' +
      '<tr style="page-break-inside: avoid;">' +
      '<td style="border: 1px solid #c5c3c3;height: 100mm;position: relative;">' +
      '<div style="position: absolute;right: 12px;text-align: left;bottom:12px">' +
      '<h4 style="margin:0;font-size: 14px;color:#363434; font-weight: 600;">' +
      image_name +
      "</h4>" +
      '<p style="margin:0;font-size: 14px;color:#706a6a">4568</p>' +
      '<span style="margin:0;font-size: 11px;color:#706a6a">56562222</span>' +
      "</div>" +
      '<table style="width: 100%;text-align: center">' +
      "<tr>" +
      '<td style="width:76mm"><img src=' +
      imgPath +
      ' class="fevimg"></td>' +
      "</tr>" +
      "</table>" +
      "</td>";
    let nexImg = "";
    let available = i + 1;
    if (available < allData.length) {
      imgPath = allData[available].url;
      image_name = allData[i].fabName;
      nexImg =
        '<td style="border: 1px solid #c5c3c3;height: 100mm;position: relative;">' +
        '<div style="position: absolute;right: 12px;text-align: left;bottom:12px">' +
        '<h4 style="margin:0;font-size: 14px;color:#363434; font-weight: 600;">' +
        image_name +
        "</h4>" +
        '<p style="margin:0;font-size: 14px;color:#706a6a">4568</p>' +
        '<span style="margin:0;font-size: 11px;color:#706a6a">56562222</span>' +
        "</div>" +
        '<table style="width: 100%;text-align: center">' +
        "<tr>" +
        '<td style="width:80mm"><img src=' +
        imgPath +
        ' class="fevimg"></td>' +
        "</tr>" +
        "</table>" +
        "</td>";

      i = available;
    }
    imageData += nexImg;

    "</tr>" + "</table>";
  }
  imageData += "</div>" + "</div>";
  let final = imageData;
  let p = new DOMParser();
  let pass = p.parseFromString(final, "text/html");
  let element = pass.getElementById("main_div");
  // let htmldoc = $("#temp111").contents().find('body');
  // htmldoc.html(tempdiv);
   // let scripts = [
  //   "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.3.2/html2canvas.min.js",
  //   "https://cdnjs.cloudflare.com/ajax/libs/dompurify/2.3.3/purify.min.js",
  //   "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js",
  //   "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js"
  // ];

  // scripts.forEach(function(url) {
  //   let script = temp111.contentWindow.document.createElement("script");
  //   script.type = "text/javascript";
  //   script.src = url;
  //   script.innerHTML = `$.loadScript(url, function() {console.log('load')})`;
  //   temp111.contentWindow.document.body.append(script);
  // });

  // let script = temp111.contentWindow.document.createElement("script");
  // script.type = "text/javascript";
  // script.innerHTML = `setTimeout(() => {console.log('script start');var temp111 = document.getElementById('temp111');var element = temp111.contentWindow.document.body;console.log(element);var opt = {margin: 1,hmargin: -0.60,vmargin: 20,filename: 'myfile.pdf',image: { type: 'jpg', quality: 1 },html2canvas: { scale: 1 },jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait'}};html2pdf().set(opt).from(element).toPdf().get('pdf').outputPdf().then((e) => {UploadImgForQr(btoa(e), 'pdf')})},10000)`;
  // temp111.contentWindow.document.body.append(script);
  // }
  // Tanmay Added : New pdf Working TODO
  var options = {
    margin: 1,
    hmargin: -0.6,
    vmargin: 20,
    filename: "myfile.pdf",
    image: { type: "jpg", quality: 1 },
    html2canvas: { scale: 1 },
    jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
  };
  const pdf = await html2pdf().set(options).from(element).toPdf().outputPdf('blob');
  const base64String = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result.split(",")[1]); // Get Base64 part of the data URL
    };
    reader.readAsDataURL(pdf);
  });
  UploadImgForQr(base64String, "pdf");
}
function getAllwishlistData() {
  let a = [];
  for (let key in favList) {
    for (let key2 in favList[key]) {
      a.push(favList[key][key2]);
    }
  }
  return a;
}
function containsNumber(str) {
  return /\d/.test(str); // \d matches any digit, and .test() checks for a match
}
function trimDesignNameByBarcode(designName){
  let str = designName;//"F27845230423951185530001010325";
        let arr = str.split('');        // Convert the string to an array
        let spliced = arr.splice(parseInt(JSON.parse(sessionStorage.getItem('configuration')).q3d_product_name.split(',')[0]), parseInt(JSON.parse(sessionStorage.getItem('configuration')).q3d_product_name.split(',')[1])); // Splice from index 15 to 24 (10 characters)
        let result = spliced.join('');  // Join the array back into a string
        // Insert '-' at the 6th index of the result string (position 5 in the array)
        let resultArray = result.split('');  // Convert the result string to an array
        resultArray.splice(6, 0, '-');      // Insert '-' at the 6th index
        let finalResult = resultArray.join('');
        return finalResult;
}
function tryOnDesignSearch(searchData, isBarcodeScan) {
  //$('#New_loader_css1').show();
  startBufferLoader();
  let designName = "";
  if (searchData.includes("?k") && searchData.includes("&t")) {
    let s_designName = searchData.split("&t=")[1];
    if (designName.split(",").length > 1) {
      alert("created Qr more then one design");
    } else {
      designName = s_designName;
    }
  } else {
    if(isBarcodeScan) {
      if(containsNumber(JSON.parse(sessionStorage.getItem('configuration')).q3d_product_name)){
        designName = trimDesignNameByBarcode(searchData)
      } else {
        designName = searchData;
      }
    } else {
      designName = searchData;
    }
  }
  searchDesignData = getTryonImageData(designName);
  backBtnClickDesignData = searchDesignData;
  let tempDesignPath = searchDesignData.tempPath;
  if (searchDesignData != "") {
    let searchFilterData = searchDesignData.designMaster1;
    designName.replace("%20", " ");
    searchDesignData = searchFilterData.filter((fName) => {
      return (
        fName.designCode.toLowerCase() ==
        designName.replaceAll("%20", " ").toLowerCase()
      );
    });
    $(".t_fab_name").text(searchDesignData[0].designCode);
    let libraryName = $("#styleThumbImageList li.active")
      .attr("fab-product")
      .toLowerCase();
    $(".tfoot_style_name").text(libraryName);
    let imageUrl =
      tempDesignPath + "t/" + searchDesignData[0].designCode + "t.jpg";
    let fabURL = imageUrl;
    let fabSize = searchDesignData[0].designSize.split(",");
    let tWidth = fabSize[0];
    let tHeight = fabSize[1];
    //lastFabricInfoSave(fabURL, tWidth, tHeight, searchDesignData[0].designId);
    Object.assign(param, {
      ["myFab"]: fabURL,
      ["tWidth"]: tWidth,
      ["tHeight"]: tHeight,
    });
    let tryonThreedimage = tryonThreedCol.filter((pname) => {
      return pname.productName.toLowerCase() == libraryName;
    });
    let styleName = tryonThreedimage[0].images[0].threeDImageName;
    //let modalURL = tryonThreedimage[0].images[0].gltfPath;
    let threed_length =
      tryonThreedimage[0].images.length <= 1
        ? tryonThreedimage[0].images.length
        : 1;
    let styleImageId = parseInt(
      $(".t_style_box .marked.active").parent().attr("imgid")
    );
    let fabName = $(".tryon_fabric_name .t_fab_name").text();
    if (checkModalImg(styleImageId, fabName)) {
      if (
        checkModalImg(styleImageId, fabName)["fabName"] ==
        searchDesignData[0].designCode
      ) {
        $("#addFavBtn").AddClass("active");
      } else {
        $("#addFavBtn").removeClass("active");
      }
    } else {
      $("#addFavBtn").removeClass("active");
    }
    let modalURL = tryonThreedimage[0].images[0].gltfPath;
    //var modalImg = tryonThreedimage[0].images[0].thumbUrl;
    TdsPluginObj.getModalPng({
      fabURL,
      modalURL,
      tWidth,
      tHeight,
      dracoPath: darcoPath,
      callback: async function (data) {
        if (!data.error) {
          $("#fullImageView").attr("src", data.Modal);
          $(".t_fabric_img img").attr("src", data.Modal);
          //$('#New_loader_css1').hide();
          stopBufferLoader();
          clearcache();
          $(".t_style_box .t_style_img .marked.active").removeClass('active');
          $($(".t_style_box .t_style_img .marked")[0]).addClass("active");
          TryonWrapImg(libraryName, TproductType, data.Modal);
          //$('#New_loader_css1').hide();
          stopBufferLoader();
        }
      },
    });
  } else {
    //$('#New_loader_css1').hide();
    stopBufferLoader();
    $(".tryon_search_box input").val('');
    $('#TryonClearIcon').hide();
    alert("design Not Found");
    $('#TryOnSearch').show();
  }

  console.log(searchDesignData);
}
function getTryonImageData(designName) {
  let result = "";
  let orgtypeId = JSON.parse(sessionStorage.jsonString).org_type_id;
  let orgId = JSON.parse(sessionStorage.jsonString).organisationId;
  let payLoadUrl =
    serviceUrl +
    "/api/Configuration/GetTryonDesign?&SupplierId=" +
    orgtypeId +
    "&DesignName=" +
    designName +
    "&OrganisationId=" +
    orgId;
  $.ajax({
    url: payLoadUrl,
    type: "GET",
    dataType: "json",
    async: false,
  })
    .done((r) => {
      result = r;
      if (!result) {
        alert("design Not found");
        $('#TryonClearIcon').hide();
        $(".tryon_search_box input").val("");
        //$('#New_loader_css1').hide();
        stopBufferLoader();
        result = false;
      } else {
        $('#TryonClearIcon').hide();
        $(".tryon_search_box input").val("");
      }
    })
    .fail((jqXhr, textStatus, errorThrown) => {
      console.log("An error occurred while GetTryonDesign");
    });
  return result;
}
function removeWishlist(pid, wishlistData) {
  let wishlistLen = $(`#${pid} .form-check-input`).length;
  let id = "";
  let fabName = "";
  for (let num = 0; num < wishlistLen; num++) {
    if ($($(`#${pid} .form-check-input`)[num]).is(":checked")) {
      id = $($(`#${pid} .form-check-input`)[num])
        .parent()
        .parent()
        .attr("id")
        .split("^")[0];
      fabName = $($(`#${pid} .form-check-input`)[num])
        .parent()
        .parent()
        .attr("id")
        .split("^")[1];
      deleteFavitemWishlist(id, fabName);
      $($(`#${pid} .form-check-input`)[num])
        .parent()
        .parent()
        .remove();
        num--;
    }
  }
}
function tryOnWishlistClickOnbackBtn() {
  let styleImageId = parseInt(
    $(".t_style_box .marked.active").parent().attr("imgid")
  );
  let fabName = $(".t_fab_name").text();
  if (checkModalImg(styleImageId, fabName)) {
    if (
      checkModalImg(styleImageId, fabName)["fabName"] ==
      searchDesignData[0].designCode
    ) {
      $("#addFavBtn").AddClass("active");
    } else {
      $("#addFavBtn").removeClass("active");
    }
  } else {
    $("#addFavBtn").removeClass("active");
  }
}
$("body").on("click", "#removeWishlistBtn", function () {
  const r = removeWishlist("myFevList", favList);
  wishlistCheckBoxSelected("myFevList");
});
$("body").on("click", ".t_back_btn", function () {
  TdsPluginObj.stopAnimation(false);
  TryOnConfig.stopCamera();
  $(".t_style_box .marked.active").removeClass();
  details = [];
  $(".tryon_page").css("display", "none");
  let fabricUrl, designName, designId, designSize, designProduct, renderFabricName, renderFabricProductName = "";
  if(backBtnClickDesignData) {
    fabricUrl = backBtnClickDesignData.cachePath;
    designName = backBtnClickDesignData.designMaster1[0].designCode;
    designId = backBtnClickDesignData.designMaster1[0].designId;
    designSize = backBtnClickDesignData.designMaster1[0].designSize;
    designProduct = backBtnClickDesignData.designMaster1[0].products;
    backBtnClickDesignData = undefined;
    rediretTryonToQ3dDrapeFabric(designName, designProduct, fabricUrl, designId, designSize);
  } else {
    renderFabricName = $('.t_fab_name').text();
    renderFabricProductName = $('.tfoot_style_name').text();
    rediretTryonToQ3dDrapeFabric(renderFabricName, renderFabricProductName);
  }
    
});
$("body").on("click", "#tryOnImageCapture", function () {
  isClickOnImageCaptureBtn = true;
  TryOnConfig.__proto__.captureImage();
  setTimeout(() => {
    $(".right_box").removeClass("active");
    $(".t_reset").css("display", "block");
  }, 6500);
 
});

$("body").on("click", "#tryOnShareBtn", function () {
  let shareImgURL = TryOnConfig.getShareImage();
  let styleName = tryonThreedimage[0].images[0].threeDImageName;
  createTryonImg(shareImgURL, lastFabricInfo.designCode, styleName, "jpeg");
});

$("body").on("click", "#tryOnResetBtn", function () {
  isClickOnImageCaptureBtn = false;
  TryOnConfig.startCamera();
  $(".right_box").addClass("active");
  $(".t_reset").css("display", "none");
});
$('body').on('click', '.t_fabric_img', function(){
  $("video")[1].pause();
});
$("body").on("click", "#addFavBtn", function () {
  let styleImageId = parseInt(
    $(".t_style_box .marked.active").parent().attr("imgid")
  );
  let fabName = $(".tryon_fabric_name .t_fab_name").text();
  let data = {
    url: $(".t_fabric_img img").attr("src"),
    styleName: $(".tryon_style_name .tfoot_style_name").text(),
    fabName: fabName,
  };
  if (!checkModalImg(styleImageId, fabName)) {
    addFavitemWishlist(styleImageId, fabName, data);
    $("#allCheckBoxSelectWishList .form-check-input").prop("checked", false);
    $(`#myFevList .form-check-input`).prop("checked", false);
    $('.t_notification').text("Successfully Added in Favourite");
    $('.t_notification').show();
    setTimeout(() => {
      $('.t_notification').hide();
    }, 2000);
    
  } else {
    deleteFavitemWishlist(styleImageId, fabName);
    $('.t_notification').text("Successfully Removed in Favourite");
    $('.t_notification').show();
    setTimeout(() => {
      $('.t_notification').hide();
    }, 2000);
    let deleteId = `${styleImageId}^${fabName}`;
    $("div[id='"+deleteId+"']").remove();
    // $().remove();
    $("#addFavBtn").removeClass("active");
    let totalWishList = $(`#myFevList .form-check-input`).length; //msg
    $(".msg")
        .empty()
        .text(
          `${0}/${
            totalWishList == undefined ? 0 : totalWishList
          } selected`);
  }
});
// $("body").on("click", ".t_style_box", function () {
//   //$('#New_loader_css1').show();
 
//   if (parseInt($(".t_style_box .marked.active").parent().parent().attr("index")) != parseInt($(this).attr("index"))) {
//      startBufferLoader();
//     $(".t_style_box .marked.active").removeClass("active");
//     $($(this).children().children()[1]).addClass("active");
//     let index = $(this).attr("index");
//     wrapGetModalpng(index, $("video")[0].paused);
//     checkItemFavWishlist();
//   }
// });
// $("body").on("click", ".styleme_product", function () {
//   //$('#New_loader_css1').show();
 
//   if (parseInt($(".styleme_product .marked.active").parent().parent().attr("index")) != parseInt($(this).attr("index"))) {
//      startBufferLoader();
//     $(".styleme_product .marked.active").removeClass("active");
//     $($(this).children().children()[1]).addClass("active");
//     let index = $(this).attr("index");
//     wrapGetModalpng(index, $("video")[0].paused);
//     checkItemFavWishlist();
//   }
// });
document.addEventListener(
  "click",
  function (e) {
    
    const product = e.target.closest(".styleme_product");
    if (!product) return;
    startPluginLoader();
    const container = product.closest(".totem_category");
    if (!container) return;
   
    const Index = parseInt(product.dataset.index);
    _tdstryoncore.getProductData()
    
    setTimeout(() => {
      const activeProduct = container.querySelector(".styleme_product.active");
      let thumbUrl = null;
if (activeProduct) {
  const thumbImg = activeProduct.querySelector(
    "figure.product_img > img"
  );
  thumbUrl = thumbImg ? thumbImg.src : null;
}
      if (!activeProduct) return;

      const activeIndex = parseInt(activeProduct.dataset.index);
       const productId = activeProduct.dataset.productId;
      window.productId = productId;

      //  thumbUrl = getActiveFabricThumbUrl(container);

      console.log({
        activeIndex,
        Index,
        sku: activeProduct.dataset.sku,
        name: activeProduct.dataset.name, 
         productId: activeProduct.dataset.productId,
        thumb_url: thumbUrl
      });  
     
      //startBuffer();
      getGltfPathById();
      
        wrapGetModalpng(Index, document.querySelector("video")?.paused);
        checkItemFavWishlist();
    }, 0);
  },
  true
);
// function getGltfPathById(productId) {
//         const id = window.productId;
//   const productList = window._tdstryoncore.getProductData()._Productlist;

//   const product = productList.find(p => p.id === id);

//   if (!product || !product.ProductVariant?.length) {
//     return null;
//   }

//   return product.ProductVariant[0].gltfPath;
// }

function getGltfPathById(productId) {
  productId = window.productId;
  if (
    !window._tdstryoncore ||
    typeof window._tdstryoncore.getProductData !== "function"
  ) {
    console.error("_tdstryoncore not ready");
    return null;
  }

  const productList = window._tdstryoncore.getProductData()._Productlist;

  if (!Array.isArray(productList)) {
    console.error("_Productlist is not an array");
    return null;
  }

  const id = Number(productId); 

  const product = productList.find(p => Number(p.id) === id);

  if (!product || !Array.isArray(product.ProductVariant)) {
    return null;
  }
   window.selectedProductAssets = {
    gltfPath: product.ProductVariant[0]?.gltfPath,
    thumb_url: product.ProductVariant[0]?.thumb_url
  };

  return window.selectedProductAssets;
}

$("body").on("click", "#myFavBtn", function () {
  $("#my_favourite").toggleClass("show");
  $("#my_favourite").toggle();
});

$("body").on("click", "#myFavPopupCloseBtn", function () {
  $("#my_favourite").removeClass("show");
  $("#my_favourite").css("display", "none");
  tryOnWishlistClickOnbackBtn();
});

$("body").on("click", "#myFevList .form-check-input", () => {
  wishlistCheckBoxSelected("myFevList");
});
$("body").on(
  "click",
  "#allCheckBoxSelectWishList .form-check-input ",
  function () {
    if ($("#allCheckBoxSelectWishList .form-check-input").prop("checked")) {
      $(`#myFevList .form-check-input`).prop("checked", true);
      let totalWishList = $(`#myFevList .form-check-input`).length; //msg
      $(".msg")
        .empty()
        .text(
          `${totalWishList}/${
            totalWishList == undefined ? 0 : totalWishList
          } selected`
        );
    } else {
      $(`#myFevList .form-check-input`).prop("checked", false);
      let totalWishList = $(`#myFevList .form-check-input`).length; //msg
      let selectedCount = 0;
      $(".msg")
        .empty()
        .text(
          `${selectedCount}/${
            totalWishList == undefined ? 0 : totalWishList
          } selected`
        );
    }
  }
);
$("body").on("click", ".qr_close", function () {
  $("#QR_popup").removeClass("show");
  $("#QR_popup").css("display", "none");
});
$("body").on("click", "#TryOnQrDoneBtn", function () {
  $("#QR_popup").removeClass("show");
  $("#QR_popup").css("display", "none");
});
$("body").on("click", "#share_fav_btn", function () {
  htmlForPdf();
});
$('body').on('click', '#searchIconBtn', function(e){
  e.stopPropagation();
  $('.right_box').addClass('active');

});
$("body").on("click", "#tryOnFullScreenBtn", function () {
  $("#zoom_fabric").removeClass("show");
  $("#zoom_fabric").css("display", "none");
  if(!isClickOnImageCaptureBtn){
  $("video")[1].play();
  }
});

$("body").on("click", ".fabric_zoom", function () {
  $("#zoom_fabric").addClass("show");
  $("#zoom_fabric").css("display", "block");
});
$("body").on("click", ".qr_close", function () {
  $("#QR_popup").removeClass("show");
  $("#QR_popup").css("display", "none");
});

jQuery.loadScript = function (url, callback) {
  jQuery.ajax({
    url: url,
    dataType: "script",
    success: callback,
    async: true,
  });
};

$("body").on("keyup", ".tryon_search_box", function (e) {

      if(counter == 0){
        currentTime = new Date().getTime();
        counter++
      }
      
  if (e.keyCode === 13) {
    lastKeyTime = new Date().getTime();
      const timeDiff = lastKeyTime - currentTime;
      if (timeDiff < 500) { // 50ms is the threshold for determining manual input
        isBarcodeScan = true;
        counter = 0;
        lastKeyTime = 0
        currentTime = 0
      } else {
        counter = 0;
        lastKeyTime = 0
        currentTime = 0
      }
    let designName = $(".tryon_search_box input").val();
    tryOnDesignSearch(designName, isBarcodeScan);
    isBarcodeScan = false
  } else {
    $('#TryonClearIcon').show();
  }
  
});
$("body").on("click", "#TryOnSearch", function () {
  let designName = $(".tryon_search_box input").val();
  tryOnDesignSearch(designName);
});
$('body').on('click', '#TryonClearIcon', function(){
  $(".tryon_search_box input").val('');
  $('#TryonClearIcon').hide();
  $('#TryOnSearch').show();
});

$('body').on('click', '#containerDiv', function(){
  if($('#tryOnResetBtn').css('display') == 'block' && $('.right_box').hasClass('active')){
    $('.right_box').removeClass('active');
  }
})
$("body").on("click", "#switchbt", function (e) {
  e.preventDefault();
    const $canvas = $("#tryon_output");
    const $img = $(this).find("img");

    if ($canvas.hasClass("enlarge")) {
        // Remove enlarge
        $canvas.removeClass("enlarge");
        $img.attr("src", "https://m2mtailor.s3.ap-south-1.amazonaws.com/tailori/plugin/images/maximize_q3d.svg");
    } else {
        // Add enlarge
        $canvas.addClass("enlarge");
        $img.attr("src", "https://m2mtailor.s3.ap-south-1.amazonaws.com/tailori/plugin/images/minimize_q3d.svg");
    }
});

// (function waitForSwapProduct() {
//   if (
//     window._tdstryoncore &&
//     typeof window._tdstryoncore.swapProduct === "function"
//   ) {
//     const originalSwapProduct = _tdstryoncore.swapProduct;

//     _tdstryoncore.swapProduct = function (...args) {

//       // ✅ OUTSIDE ALERT (BEFORE PLUGIN LOGIC)
//       alert("Product swapped");

//       // ✅ ORIGINAL PLUGIN EXECUTION (UNCHANGED)
//       return originalSwapProduct.apply(this, args);
//     };

//   } else {
//     setTimeout(waitForSwapProduct, 50);
//   }
// })();
// (function waitForSwapProduct() {
//   if (
//     window._tdstryoncore &&
//     typeof window._tdstryoncore.swapProduct === "function"
//   ) {
//     debugger;
//     const originalSwapProduct = _tdstryoncore.swapProduct;

//     _tdstryoncore.swapProduct = function (...args) {
//       debugger;

//       alert("Product swapped");
//       const result = originalSwapProduct.apply(this, args);

//       setTimeout(() => {
//         const activeProduct = document.querySelector(
//           ".totem_category .styleme_product.active"
//         );

//         if (!activeProduct) return;

//         const data = {
//           sku: activeProduct.dataset.sku,
//           index: activeProduct.dataset.index,
//           productId: activeProduct.dataset.productId,
//           image:
//             activeProduct.querySelector("figure.product_img img")?.src || null
//         };

//         console.log("✅ Next Active Variant Data:", data);
//       }, 0);

//       return result;
//     };
//   } else {
//     setTimeout(waitForSwapProduct, 50);
//   }
// })();
// (function waitForSwapProduct() {
//   if (
//     window._tdstryoncore &&
//     typeof window._tdstryoncore.swapProduct === "function"
//   ) { debugger;
//     const originalSwapProduct = _tdstryoncore.swapProduct;

//     _tdstryoncore.swapProduct = function (...args) {

//       alert("Product swapped");
//        const swapDirection = args[1];
//        const result = originalSwapProduct.apply(this, args);
//   window.swapDirection = swapDirection;
//       console.log("swap args:", args);


//       const productList =
//         window._tdstryoncore.getProductData()._Productlist;

//       //let Index = window._tdstryoncore.getActiveFilteredProductIndex();
//       debugger;
//       const activeEl = document.querySelector(
//         ".totem_category .styleme_product.active"
//       );

//       if (activeEl && productList?.length) {
//         const currentProductId = Number(activeEl.dataset.productId);

//         const currentIdx = productList.findIndex(
//           p => Number(p.id) === currentProductId
//         );

//         if (currentIdx !== -1) {
//         //   const nextIdx =
//         //     currentIdx + 1 < productList.length ? currentIdx + 1 : 0;
//         //  debugger;
//         //   const nextProduct = productList[nextIdx];
//          //let Index = currentIdx;

//           if (swapDirection === "right" || swapDirection === 1) {
//             Index = Index + 1 < productList.length
//               ? Index + 1
//               : 0;
//           }

//           if (swapDirection === "left" || swapDirection === -1) {
//             Index = Index - 1 >= 0
//               ? Index - 1
//               : productList.length - 1;
//           }

//           // ✅ 5. FETCH NEXT PRODUCT DATA
//           const nextProduct = productList[Index];

//           // ✅ SAFELY FETCH GLTF + THUMB FROM NEXT PRODUCT
//           const gltfPath =
//             nextProduct?.ProductVariant?.[0]?.gltfPath;

//           const thumb_url =
//             nextProduct?.ProductVariant?.[0]?.thumb_url;
//             window.gltfPath = gltfPath;
//             window.thumb_url = thumb_url;

//               //const Index = nextIdx;

//           startBuffer();
//           wrapGetModalpng(Index, document.querySelector("video")?.paused);
//           checkItemFavWishlist();
//         }
//       }

//       // 🔁 continue original plugin swap
//       // return originalSwapProduct.apply(this, args);
//     };
//   } else {
//     setTimeout(waitForSwapProduct, 50);
//   }
// })();

// (function waitForSwapProduct() {
//   if (
//     window._tdstryoncore &&
//     typeof window._tdstryoncore.swapProduct === "function"
//   ) {
//     debugger;
//     const originalSwapProduct = _tdstryoncore.swapProduct;

//     _tdstryoncore.swapProduct = function (...args) {
//        alert("Product swapped");
//     debugger
//       // ✅ 1. STORE REAL DIRECTION
//       const swapDirection = args[1];
//       window.swapDirection = swapDirection;

//       // ✅ 2. GET PRODUCT LIST
//       const productList =
//         window._tdstryoncore.getFilteredProducts();

//       // ✅ 3. CAPTURE CURRENT INDEX *BEFORE SWAP*
//       let currentIdx = -1;
//      debugger;
//       const activeElBefore = document.querySelector(
//         ".totem_category .styleme_product.active"
//       );

//       if (activeElBefore && productList?.length) {
//         const currentProductId = Number(activeElBefore.dataset.productId);

//         currentIdx = productList.findIndex(
//           p => Number(p.id) === currentProductId
//         );
//       }

//       console.log("INDEX BEFORE SWAP:", currentIdx);

//       // ✅ 4. LET PLUGIN DO THE SWAP
//       originalSwapProduct.apply(this, args);

//       // ✅ 5. CALCULATE NEXT INDEX USING *OLD* INDEX
//       if (currentIdx !== -1 && productList?.length) {
//         let Index = currentIdx;

//        if (swapDirection === "right") {
//         alert(" right Product swapped");
//         if (currentIdx === productList.length - 1) {
//           Index = 0; // last → first
//         } else {
//           Index = currentIdx + 1;
//         }

//         console.log("RIGHT SWAP → INDEX:", Index);
//       }

//       // LEFT SWAP
//       else if (swapDirection === "left") {
//         alert(" left Product swapped");
//         if (currentIdx === 0) {
//           Index = productList.length - 1; // first → last
//         } else {
//           Index = currentIdx - 1;
//         }

//         console.log("LEFT SWAP → INDEX:", Index);
//       }


//         console.log("CALCULATED INDEX:", Index);
//         // 🔹 UPDATE ACTIVE CLASS AFTER SWAP
//             const allProducts = document.querySelectorAll(
//               ".totem_category .styleme_product"
//             );

//             // remove active from all
//             allProducts.forEach(p => p.classList.remove("active"));

//             // add active to the new index
//             const newActiveEl = allProducts[Index];
//             if (newActiveEl) {
//               newActiveEl.classList.add("active");
//             }
//             console.log("UPDATED ACTIVE ELEMENT:", newActiveEl);


//         // ✅ 6. FETCH PRODUCT USING CALCULATED INDEX
//         const nextProduct = productList[Index];

//         const gltfPath =
//           nextProduct?.ProductVariant?.[0]?.gltfPath;

//         const thumb_url =
//           nextProduct?.ProductVariant?.[0]?.thumb_url;

//         window.selectedProductAssets.gltfPath = gltfPath;
//         window.selectedProductAssets.thumb_url = thumb_url;

//         console.log("NEXT PRODUCT:", {
//           index: Index,
//           id: nextProduct?.id,
//           gltfPath,
//           thumb_url
//         });

//         // ✅ 7. CONTINUE YOUR FLOW
//         startBuffer();
//         wrapGetModalpng(Index, document.querySelector("video")?.paused);
//         checkItemFavWishlist();
//       }
//     };
//   } else {
//     setTimeout(waitForSwapProduct, 50);
//   }
// })();

function startPluginLoader() {
  const loader = document.getElementById("tryo-loader");
  if (!loader) {
    console.warn("Plugin loader not found");
    return;
  }

  loader.style.display = "flex";
  document.body.classList.add("ui-frozen");
  console.log("🔄 Plugin Loader START – UI FROZEN");
}

function stopPluginLoader() {
  const loader = document.getElementById("tryo-loader");
  if (!loader) return;

  // Hide loader
  loader.style.display = "none";
  document.body.classList.remove("ui-frozen");
  console.log(" Plugin Loader STOP – UI UNFROZEN");
}

window.startPluginLoader = startPluginLoader;
window.stopPluginLoader = stopPluginLoader;


(function waitForSwapProduct() {
  if (
    window._tdstryoncore &&
    typeof window._tdstryoncore.swapProduct === "function"
  ) {

    const originalSwapProduct = window._tdstryoncore.swapProduct;
    let pluginLoaderTimer = null;

    window._tdstryoncore.swapProduct = function (...args) {

      const swapDirection = args[1];
      window.swapDirection = swapDirection;

      startPluginLoader();

      clearTimeout(pluginLoaderTimer);
      pluginLoaderTimer = setTimeout(() => {
        stopPluginLoader();
      }, 3000);

      const productList =
        window._tdstryoncore.getFilteredProducts();

      let currentIdx = -1;

      const activeElBefore = document.querySelector(
        ".totem_category .styleme_product.active"
      );

      if (activeElBefore && productList?.length) {
        const currentProductId = Number(activeElBefore.dataset.productId);
        currentIdx = productList.findIndex(
          p => Number(p.id) === currentProductId
        );
      }

      originalSwapProduct.apply(this, args);

      if (currentIdx !== -1 && productList?.length) {

        let Index = currentIdx;

        if (swapDirection === "right") {
          Index =
            currentIdx === productList.length - 1
              ? 0
              : currentIdx + 1;
        } else if (swapDirection === "left") {
          Index =
            currentIdx === 0
              ? productList.length - 1
              : currentIdx - 1;
        }

        const allProducts = document.querySelectorAll(
          ".totem_category .styleme_product"
        );

        allProducts.forEach(p => p.classList.remove("active"));
        allProducts[Index]?.classList.add("active");

        const nextProduct = productList[Index];

        window.selectedProductAssets = window.selectedProductAssets || {};
        window.selectedProductAssets.gltfPath =
          nextProduct?.ProductVariant?.[0]?.gltfPath;

        window.selectedProductAssets.thumb_url =
          nextProduct?.ProductVariant?.[0]?.thumb_url;

        wrapGetModalpng(Index, document.querySelector("video")?.paused);
        checkItemFavWishlist();
      }
    };

  } else {
    setTimeout(waitForSwapProduct, 50);
  }
})();

window.currentInjectedClothingType = null;

window.currentInjectedClothingType = "Top_Clothing";

window.currentInjectedClothingType = "Bottom_Clothing";

window.currentInjectedClothingType = "Fullset_Clothing";


// 🔹 MAIN UI CONTROLLER (OUTSIDE PLUGIN)
function applyTryonUIRestriction() {
  const type = window.currentInjectedClothingType;
  if (!type) return;

  const leftPane = document.getElementById("apparel_window_top");
  const rightPane = document.getElementById("apparel_window_bottom");

  // 1️⃣ HANDLE PANES
  if (type === "Top_Clothing") {
    leftPane.style.display = "block";
    rightPane.style.display = "none";
  }

  if (type === "Bottom_Clothing") {
    leftPane.style.display = "none";
    rightPane.style.display = "block";
  }

  if (type === "Full_Clothing" || type === "Fullset_Clothing") {
    leftPane.style.display = "block";
    rightPane.style.display = "none";
  }

  // 2️⃣ FILTER CATEGORY DROPDOWN
  document.querySelectorAll(".category_menu li").forEach(li => {
    li.style.display =
      li.dataset.clothingType === type
        ? "block"
        : "none";
  });

  // 3️⃣ FILTER VARIANTS
  document.querySelectorAll(".styleme_product").forEach(card => {
    card.style.display =
      card.dataset.clothingType === type
        ? "block"
        : "none";
  });

  // 🔹 FORCE DROPDOWN TO MATCH INJECTED CATEGORY
(function syncCategoryDropdown() {
  const type = window.currentInjectedClothingType;
  const injectedCategory = window.currentInjectedCategoryName; 

  if (!injectedCategory) return;

  // Remove active from all categories
  document.querySelectorAll(".category_menu li").forEach(li => {
    li.classList.remove("active");
  });
  // Activate the injected category
  const activeLi = document.querySelector(
    `.category_menu li[data-category-name="${injectedCategory.charAt(0).toUpperCase() + injectedCategory.slice(1)}"]`
  );

  if (activeLi) {
    activeLi.classList.add("active");
    // Update dropdown label text
    const menu = activeLi.closest(".category_menu");
    const label = menu?.querySelector(".cat_name");
    if (label) {
      label.textContent = activeLi.dataset.categoryName;
    }
  }
})();
// 🔹 FILTER VARIANT CARDS
document.querySelectorAll(".category_menu li").forEach(li => {
  li.style.display =
    li.dataset.categoryName ===
    window.currentInjectedCategoryName
      ? "block"
      : "none";
});
document.querySelectorAll(".styleme_product").forEach(card => {
  const sku = card.dataset.sku?.toLowerCase() || "";
  const name = card.dataset.name?.toLowerCase() || "";

  const isMatch =
    sku.includes(window.currentInjectedCategoryName) ||
    name.includes(window.currentInjectedCategoryName);

  card.style.display = isMatch ? "block" : "none";
  hidePluginCategoryDropdown();
});

}
function activatePluginCategory(categoryName) {
  if (!categoryName) return;

  const li = document.querySelector(
    `.category_menu li[data-category-name="${categoryName}"]`
  );

  if (!li) {
    console.warn("Plugin category not found:", categoryName);
    return;
  }
  li.click();

  console.log("Plugin category auto-activated:", categoryName);
}
function hidePluginCategoryDropdown() {
  document.querySelectorAll(".category_menu").forEach(menu => {
    menu.style.display = "none";
  });
}


// function activateIndexZeroFromPlugin() {
//   if (
//     !window._tdstryoncore ||
//     typeof window._tdstryoncore.getFilteredProducts !== "function"
//   ) {
//     return;
//   }

//   const filtered = window._tdstryoncore.getFilteredProducts();
//   if (!filtered || !filtered.length) return;

//   const first = filtered[0]; // ✅ plugin index 0

//   // remove existing active
//   document.querySelectorAll(".styleme_product.active").forEach(el => {
//     el.classList.remove("active");
//   });

//   // activate matching DOM element
//   const el = document.querySelector(
//     `.styleme_product[data-product-id="${first.id}"]`
//   );

//   if (el) {
//     el.classList.add("active");
//      el.scrollIntoView({
//       behavior: "smooth",
//       block: "nearest",
//       inline: "nearest"
//     });
//     console.log("Activated plugin index 0:", first.id);
//   }
// }
function activateFirstVariantFromInjectedCategory() {
  if (!window._tdstryoncore || !window.currentInjectedCategoryName) return;

  const productData = window._tdstryoncore.getProductData();

  const products = window._tdstryoncore.getProductData()._Productlist;
  if (!Array.isArray(products)) return;

  // const injected =
  // window.currentInjectedCategoryName
  //   .toLowerCase()
  //   .replace(/^\w/, c => c.toUpperCase());
 // e.g. "Suit"
 const injected ='Jacket';

  // 1️⃣ filter products of this category
  const categoryProducts = products.filter(
    p => p.categoryname === injected
  );

  if (!categoryProducts.length) {
    console.warn("No products found for category:", injected);
    return;
  }
  const firstProduct = categoryProducts[0];

  //  remove existing active
  document
    .querySelectorAll(".styleme_product.active")
    .forEach(el => el.classList.remove("active"));

  // activate matching UI card
  const el = document.querySelector(
    `.styleme_product[data-product-id="${firstProduct.id}"]`
  );

  if (el) {
    el.classList.add("active");
    console.log("Activated index 0 product for category:", injected);
  } else {
    console.warn("UI element not found for product:", firstProduct.id);
  }
}

//tryon_body