
import { saveAs } from 'file-saver';
let q3d_PluginObj = "";
import "https://plugin.dam3d.in/fabric/v1/Fabric.min.js?v1.4"
// import "./TdsFabric.min.js";
// import './TdsFabric.min.js';
//import './TdsFabric.min.js?v3.1';
import { serviceUrl, getzner, getznercf, getznermtm, getznertech, getznerTechFile, getznerPdf } from './config.js';
import { setConfiguration } from './configuration.js'
import { sweetalert_success, sweetalert_error, sweetalert_warning } from './sweetalert.js'
import QrScanner from 'qr-scanner';
import { deduct_credits, hasCredits, checkClientDomain } from './login.js';
import { stopAllCameras } from './q3d.js';
//import QrScanner from "https://cdn.jsdelivr.net/npm/qr-scanner@1.4.2/qr-scanner.min.js";

import Quagga from 'quagga';
// import BarcodeScanner from 'barcode-scanner';
// import BarcodeScanner from 'barcode-scanner';
// // import { BrowserMultiFormatReader } from '@zxing/library';
//import { BrowserMultiFormatReader } from '@zxing/browser';
// import { Html5QrcodeScanner } from "html5-qrcode";
import { h_style_panel, d_portrait, h_fabric_panel } from './Q3d_ui.js';
// import LazyLoad from 'lazyload';
let fabricPluginObj = "";
let configuration = '';
let productTypeId, productGroupId = '';
let FabricData = []
let lastFabricInfo = {}
let ModelwiseDrapeCount = {}
let allQrScanDesign = []
let allQrDesignData = []
let textSearchD, alreadtDrapefab = ''
let timeOut = null;
let getznerData = "";
let G_paylaod = {};
let isScannerRunning = false;
let isLoginBelmont = false;

let completeDownloadImage = true;
let loadAllFabricName = false;
let loadAllImageFlag = true;
let fabStart, AllFabricData, currentFabricDrapeCount = 0;
let appendFabricCount, timeoutId, timeout = 0;
let currentStyleli, prevStyleli, currentStyleMain, prevStylemain, Current_FabListName, prevFabListName, styleModelChange, qrDesignRespData = undefined;
let internalTextSearch, fabListchange, scrollGetFabric, filterSearchFab, sortFilter, qrScan, isredirect, isCheckDesignExist, openFullViewClickOnFabric, fabricDrapeOnModel = false

let camQrResult = ''
async function appendPTPG(loadAllfabric) {
  let ptpg = await fabricPluginObj.getProductTypeGroup();
  productTypeId = ptpg.allDesignTypesByRoles[0].design_type_id;
  productGroupId = ptpg.allDesignTypesByRoles[0].getDesignGroupsByRoleListDto[0].design_groups_id;
  fabricPluginObj.setTypeGroup(productTypeId, productGroupId);
  appendProdutAndGroupList(ptpg);
  getznerData ? appendFabricProductList(ptpg.allDesignTypesByRoles[0].getDesignGroupsByRoleListDto, undefined, 'getzner') : '';
  if (getznerData.featureAsLibrary) {
    let featureData = await fabricPluginObj.getFeatures();
    featureData = featureData.filter((element) => {
      return element.design_feature_name.toLowerCase() == getznerData.featureAsLibrary.toLowerCase();
    })
    appendFabricProductList(featureData, undefined, 'getzner', "featureAppend")
  }
  //console.log(getznerData + "123456456456465")
  const designName = configuration.q3d_display_groups ? $('#groupInfo .active').attr('g_ProductName') : $('.btn_fabric_lib b').text()//$('#fabricList li.active').text().toUpperCase(); //$('#$('#groupInfo .active').attr('g_ProductName');
  appendFabric(designName, {}, function () {
    const threeDImageId = $('.style_thumb li.active').attr('id');

    if (configuration.q3d_drape_first_fabric) {
      sessionStorage.setItem('FirstTimefabricCall', true);
      $('#appendFabricList li:first').addClass('active');
      const groupName = $('#groupInfo .active').attr('groupname') == 'All' ? 'ungrouped' : $('#groupInfo .active').attr('groupname');
      //prevGroupProductName = $('#groupInfo .active').attr('g_productname');
      let fabricImageUrl = $('#appendFabricList li.active .fabric_img').attr('data-src'); //TODO 01-08

      if (fabricImageUrl) {
        fabricImageUrl = q3dDrapingFile(fabricImageUrl)
        if (fabricImageUrl) {
          fabricDrapeOnModel = true;
        }
        let designSize = $('#appendFabricList li.active .fabric_img').attr('designSize').split(',');
        const designWidth = parseFloat(designSize[0]);
        const designHeight = parseFloat(designSize[1]);
        const designCode = $('#appendFabricList li.active .fabric_img').attr('id')
        $('.last_drap_fab').text($('#appendFabricList li.active .fabric_img').attr('id'));
        lastFabricInfoSave($('#appendFabricList li.active .fabric_img').attr('data-src'), designWidth, designHeight, designCode);
        //stopBuffer();
        q3d_PluginObj.loadThreeDImage(threeDImageId, fabricImageUrl, designWidth, designHeight, groupName, function () {
          stopBuffer();
          if (!isMobile()) {
            q3d_getProductFeature(Number($('#appendFabricList li.active .fabric_thumb_wrap').attr('designid')));//fabric_thumb_wrap
          };
        });
        let renderFabName = $('#appendFabricList li.active .fabric_img').attr('id');
        saveFabricDrapeCount(threeDImageId, renderFabName);
      } else {
        q3d_PluginObj.loadThreeDImage(threeDImageId, undefined, undefined, undefined, undefined, function () {
          stopBuffer()
        });
      }

    } else {
      q3d_PluginObj.loadThreeDImage(threeDImageId, undefined, undefined, undefined, undefined, function () {
        stopBuffer()
      });
    }

  });
}

// async function appendPTPG(loadAllfabric) {
//   const ptpg = await fabricPluginObj.getProductTypeGroup();
//   const firstRole = ptpg.allDesignTypesByRoles[0];
//   const firstGroup = firstRole.getDesignGroupsByRoleListDto[0];
//   productTypeId = firstRole.design_type_id;
//   productGroupId = firstGroup.design_groups_id;
//   fabricPluginObj.setTypeGroup(productTypeId, productGroupId);
//   appendProdutAndGroupList(ptpg);
//   const $activeStyle = $('.style_thumb li.active');
//   const threeDImageId = $activeStyle.attr('id');
//   const loadDrape = async ($fabricLi, groupName) => {
//     const $img = $fabricLi.find('.fabric_img');
//     let fabricImageUrl = $img.attr('data-src');
//     if (fabricImageUrl) {
//       fabricImageUrl = q3dDrapingFile(fabricImageUrl);
//       if (fabricImageUrl) fabricDrapeOnModel = true;
//       const [designWidth, designHeight] = $img.attr('designSize').split(',').map(parseFloat);
//       const designCode = $img.attr('id');
//       $('.last_drap_fab').text(designCode);
//       lastFabricInfoSave($img.attr('data-src'), designWidth, designHeight, designCode);

//       q3d_PluginObj.loadThreeDImage(threeDImageId, fabricImageUrl, designWidth, designHeight, groupName, () => {
//         stopBuffer();
//         if (!isMobile()) {
//           const designId = Number($fabricLi.find('.fabric_thumb_wrap').attr('designid'));
//           q3d_getProductFeature(designId);
//         }
//       });
//       saveFabricDrapeCount(threeDImageId, designCode);
//     } else {
//       q3d_PluginObj.loadThreeDImage(threeDImageId, undefined, undefined, undefined, undefined, stopBuffer);
//     }
//   };
//   if (getznerData) {
//     appendFabricProductList(firstRole.getDesignGroupsByRoleListDto, undefined, 'getzner');
//     if (getznerData.featureAsLibrary) {
//       let featureData = await fabricPluginObj.getFeatures();
//       const featureName = getznerData.featureAsLibrary.toLowerCase();
//       featureData = featureData.filter(f => f.design_feature_name.toLowerCase() === featureName);
//       appendFabricProductList(featureData, undefined, 'getzner', "featureAppend");
//     }
//   }
//   const designName = configuration.q3d_display_groups
//     ? $('#groupInfo .active').attr('g_ProductName')
//     : $('.btn_fabric_lib b').text();

//   if (configuration.q3d_drape_first_fabric) {
//     sessionStorage.setItem('FirstTimefabricCall', "false");
//     const url = window.location.href;
//     const match = url.match(/[?/]t=([^&]+)/);
//     let fabricId = match ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : null;
//     if (fabricId) {
//       $('.fab_search_input1').val(fabricId);
//       q3d_textSearch(fabricId, false);

//       const trySelectFabric = () => {
//         const $targetLi = $(`#appendFabricList li .fabric_img#${CSS.escape(fabricId)}, #appendFabricList li .fabric_info#${CSS.escape(fabricId)}`).closest('li');
//         if ($targetLi.length) {
//           clearInterval(interval);
//           $('#appendFabricList li').removeClass('active');
//           $targetLi.addClass('active');
//           $targetLi[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
//           const groupName = $('#groupInfo .active').attr('groupname') === 'All' ? 'ungrouped' : $('#groupInfo .active').attr('groupname');
//           loadDrape($targetLi, groupName);
//         }
//       };

//       const interval = setInterval(trySelectFabric, 300);
//     }
//     else {
//       appendFabric(designName, {}, async function () {
//         const $firstLi = $('#appendFabricList li:first').addClass('active');
//         const groupName = $('#groupInfo .active').attr('groupname') === 'All' ? 'ungrouped' : $('#groupInfo .active').attr('groupname');
//         loadDrape($firstLi, groupName);
//       });
//     }
//   } else {
//     q3d_PluginObj.loadThreeDImage(threeDImageId, undefined, undefined, undefined, undefined, stopBuffer);
//   }
// }

async function appendPTPGQ3dLite() {
  let ptpg = await fabricPluginObj.getProductTypeGroup();
  productTypeId = ptpg.allDesignTypesByRoles[0].design_type_id;
  productGroupId = ptpg.allDesignTypesByRoles[0].getDesignGroupsByRoleListDto[0].design_groups_id;
  fabricPluginObj.setTypeGroup(productTypeId, productGroupId);
  appendProdutAndGroupList(ptpg);
  getFabricImageNameQ3dLite();

}
async function loadFabricPlugin(key, loadAllfabric = false, qrSupplierId, qrRoleID = 2868034031) {

  const suppId = !loadAllfabric ? JSON.parse(sessionStorage.getItem('jsonString')).org_type_id : qrSupplierId
  const roleId = !loadAllfabric ? JSON.parse(sessionStorage.getItem('jsonString')).roleId : qrRoleID
  const orgId = !loadAllfabric ? JSON.parse(sessionStorage.getItem('jsonString')).organisationId : key
  const _isDemoUser = loadAllfabric ? JSON.parse(sessionStorage.getItem('clickOnVisitDemo')) : undefined
  const sessionKey = isLoginBelmont ? 'qrScanDataAuth' : 'jsonString';
  const sessionData = JSON.parse(sessionStorage.getItem(sessionKey) || '{}');
  fabricPluginObj = new TdsFabric({
    Start: 0,
    SupplierId: suppId,
    OrgId: orgId, //1179106177,
    RoleId: roleId, //2665718983
    ServiceUrl: serviceUrl,
    isDemoUser: _isDemoUser,
    MaxFabLimit: parseInt(configuration.q3d_show_fabrics),
    emailid: sessionData.emailid || "",
    token: sessionData.api_token || "",
    SortBy: getznerData.sortby ? getznerData.sortby : "IsDateDesc", //"IsNameAsc","IsNameDesc","IsDateDesc","IsDateAsc" 
    onViewCrop: upd_onViewCrop
  });
  appendFabricCount = parseInt(configuration.q3d_show_fabrics);
  if (loadAllfabric) {
    loadAllFabricName = $("#appendFabricList li:first .fabric_name").text();
    loadAllImageFlag = false;
  }
  else {
    loadAllFabricName = undefined;
  }
  appendPTPG(); //loadAllFabricName
}

export function q3d_CopyLink(copyToClipboard = true) {
  let baseUrl = window.location.href.split("?")[0];
  let domainName = sessionStorage.getItem('clientDomain');
  // let domainName = 'getznertech'; // for testing
  if (baseUrl.includes("#")) {
    baseUrl = baseUrl.substr(0, baseUrl.indexOf('#'))
  }
  let supplierID = qrScan ? JSON.parse(sessionStorage.getItem('jsonString')).org_type_id.toString(16) : Number((sessionStorage.qrSupplierId)).toString(16);
  let designName = $('.last_drap_fab').text(); //$('#appendFabricList li.active .fabric_img').attr('id');
  var link = "";
  if (isLoginBelmont) {
    link = baseUrl.split('#')[0] + "?k=" + supplierID + "&t=" + designName + "&p=" + "ecom";
  } else if (domainName == 'getznertech') {
    // link = baseUrl.split('#')[0] + "&t=" + designName;
    link = baseUrl.split('#')[0] + "?k=" + supplierID + "&t=" + designName + "&p=" + "ecom";

  } else {
    link = baseUrl.split('#')[0] + "?k=" + supplierID + "&t=" + designName;
  }
  if (copyToClipboard) {
    var $tempInput = $("<input>");
    $("body").append($tempInput);
    $tempInput.val(link).select();
    try {
      document.execCommand("copy");
      $tempInput.remove();
      sweetalert_success("Link copied to clipboard!");
    } catch (err) {
      console.error("Unable to copy link:", err);
    }
  }
  return link;
}

export function shareOnWhatsApp() {
  const link = q3d_CopyLink(false);
  const linkUrl = `Check this out :- ${link}`;
  const Wlink = 'https://api.whatsapp.com/send?text=' + encodeURIComponent(linkUrl);
  window.open(Wlink, '_blank');
}

export function q3d_QrScanData(designData, userAuthenticateData) {
  qrDesignRespData = designData;
  if (!isredirect) {
    userAuthenticateData = userAuthenticateData ? userAuthenticateData : JSON.parse(sessionStorage.qrScanDataAuth)
    sessionStorage.setItem('qrScanDataAuth', JSON.stringify(userAuthenticateData));
    configuration = setConfiguration(false);
    sessionStorage.setItem('configuration', JSON.stringify(configuration));
  }
  if (allQrDesignData.length > 0) {
    allQrScanDesign = uniqueImageLoad(allQrDesignData, designData);
    if (allQrScanDesign.length == 0) {
      isCheckDesignExist = true;
    }
  } else {
    allQrScanDesign = designData;
  }

  for (let index = 0; index < allQrScanDesign.length; index++) {
    allQrScanDesign[index].thumbImagePath = `${allQrScanDesign[index].thumbImagePath}/t/${allQrScanDesign[index].designAdvName}t.jpg`;
    allQrScanDesign[index].bestFitImagePath = allQrScanDesign[index].thumbImagePath.replaceAll("/t/", "/b/").replaceAll("t.jpg", "b.jpg");
    allQrScanDesign[index].zoomImagePath = allQrScanDesign[index].thumbImagePath.replaceAll("/t/", "/z/").replaceAll("t.jpg", "z.jpg");
    if ($('body').hasClass('q3dlite')) {
      allQrDesignData[index + parseInt($('#q3dLiteappendFabricList li').length)] = allQrScanDesign[index];
    } else {
      allQrDesignData[index + parseInt($('#appendFabricList li').length)] = allQrScanDesign[index];
    }
  }

  if ($('body').hasClass('q3dlite')) {
    q3dliteQrScanAppendFabric(allQrScanDesign, undefined, undefined, undefined)
  } else {
    qrScanAppendFabric(allQrScanDesign);
  }
  lazyLoadImg();
}
export function clickOnGetznerInfoBtn() {
  $('#appendFabricList li.active .fabric_thumb_wrap .fabric_info').click();
}
export function appnedStyleImage(key, q3d_Plugin, firstAppendProduct, isLogin, loadAllfabric, qrSupplierId, qrRoleID) {
  if (isLogin) {
    if (JSON.parse(sessionStorage.jsonString).organisationId == 2775378004) {
      isLoginBelmont = true;
    }
  }
  if (loadAllfabric) {
    isLoginBelmont = true;
  }
  checkGetznerlogin();
  qrScan = isLogin;
  let AllStyleData = [];
  q3d_PluginObj = q3d_Plugin;
  let w_sortingProductName = "";
  if (isLogin) {
    configuration = setConfiguration(isLogin);
    sessionStorage.setItem('configuration', JSON.stringify(configuration));
  }
  let configureProductName = q3d_Plugin.getProducts();
  let configureGroupProductList = q3d_Plugin.getGroupProductList();
  let loadFistproductModel = configureProductName.filter((value) => {

    if (configureProductName.length == 1) {
      firstAppendProduct = value.name;
      return value.name.toLowerCase() == firstAppendProduct.toLowerCase();
    }
    else {
      return value.name.toLowerCase() == firstAppendProduct.toLowerCase();
    }
  });

  if (configureProductName.length == 1) {
    w_sortingProductName = loadFistproductModel
  } else {
    w_sortingProductName = loadFistproductModel.concat(configureProductName);
  }

  configureProductName = w_sortingProductName.filter(
    (prod, index) => index === w_sortingProductName.findIndex(
      other => prod.id === other.id
        && prod.name === other.name
    ));

  if (!configuration.q3d_is_q3d_lite || isdeskStop()) { //configuration.q3d_is_q3d_lite
    let styleLibraryListStr = "";
    let styleLibraryStr = ""
    let url = "";
    let isApendProduct = true;
    for (let c in configureProductName) {
      styleLibraryListStr += `<li class = "" index = ${configureProductName[c].id} fab-product="${configureProductName[c].name}"><span><a href=${"#tab" + configureProductName[c].id}>${configureProductName[c].name}</a></span></li>`
      styleLibraryStr += `<ul id=tab${configureProductName[c].id}>`
      let pruductThreeDImage = q3d_Plugin.getThreeDImages(configureProductName[c].name);
      for (let threeDThumb in pruductThreeDImage) {

        if (isApendProduct) {
          appendProductGroup(pruductThreeDImage[threeDThumb].id);
          isApendProduct = false;
        }

        styleLibraryStr += `<li id=${pruductThreeDImage[threeDThumb].id} isThreeD = ${pruductThreeDImage[threeDThumb].isThreeD} defaultGroup=${pruductThreeDImage[threeDThumb].displayGroupIndex}>`
        styleLibraryStr += `<div value="${pruductThreeDImage[threeDThumb].name}" product=${configureProductName[c].name} class = style_thumb_wrap>`
        if (isTotem() && !pruductThreeDImage[threeDThumb].isThreeD) {
          url = pruductThreeDImage[threeDThumb].imgsrc
          url = url.replace('t.jpg', 'tl.jpg');
        } else {
          url = pruductThreeDImage[threeDThumb].imgsrc;
        }
        let date = new Date();
        url += "?v=" + date.getTime();
        styleLibraryStr += `<div class = "style_img"><img class=img-thumbnail loading="lazy" src=${url} alt="thumb">`
        if (pruductThreeDImage[threeDThumb].isThreeD) {
          styleLibraryStr += `<img class=three_d loading="lazy" src="https://s3.ap-south-1.amazonaws.com/aws.tds/dam/q3d/images/three_d1.gif.gif" alt="thumb">`
        }
        styleLibraryStr += `</div>`
        styleLibraryStr += `<div class = "style_name">${pruductThreeDImage[threeDThumb].displayName}</div>`
        styleLibraryStr += `</div>`
        styleLibraryStr += `</li>`

      }
      styleLibraryStr += '</ul>'
    }
    $('.style_lib').empty().append('<ul id="styleThumbImageList">' + styleLibraryListStr + '</ul>');
    $('.style_thumb').empty().append(styleLibraryStr);
    $('.style_thumb ul').eq(0).addClass('active');
    $('.style_lib ul li').eq(0).addClass('active');
    $('.btn_style_lib b').text($('.style_lib ul li.active').attr('fab-product'))
    $($('.style_thumb ul.active li')[0]).addClass('active')
    !d_portrait() ? h_style_panel() : null;
    if (loadAllfabric) {
      appendFabricProductList(configureGroupProductList, configureProductName);
      loadFabricPlugin(key, loadAllfabric, qrSupplierId, qrRoleID);
    }
    if (isLogin) {
      appendFabricProductList(configureGroupProductList, configureProductName);
      loadFabricPlugin(key);
    }
  } else {
    configureProductName.forEach((value) => {
      let productStyleImages = q3d_Plugin.getThreeDImages(value.name)
      AllStyleData.push(productStyleImages);
    });
    appendAllStyleQ3dLite(AllStyleData);
    if (qrScan) {
      loadFabricPluginQ3dLite(key);
    }
  }
}

export async function appendFabric(prodName, G_paylaod, callback) {

  let designMaster = Object.keys(G_paylaod).length > 0 ? await fabricPluginObj.filterSearch(G_paylaod) : await fabricPluginObj.setProductLibrary(prodName);

  if (!loadAllImageFlag) {
    loadAllImageFlag = true;
    designMaster.designMaster = (designMaster.designMaster).filter((element) => {
      return element.designCode != loadAllFabricName;
    })
  }
  AllFabricData = designMaster['totalCount'];
  sessionStorage.setItem("totalcount", AllFabricData);

  $('.next_fabric').css('visibility', 'hidden');
  $('.prev_fabric').css('visibility', 'hidden');
  $('.fabric_count span').text(`Count : ${AllFabricData}`);

  if (designMaster.totalCount > 0) {

    G_paylaod = {};
    fabStart = fabStart + appendFabricCount;
    startAppendFabric(designMaster);

    if (designMaster.designMaster.length > 1) {
      $('.next_fabric').css('visibility', 'visible');
    } else {
      $('.next_fabric').css('visibility', 'hidden');
      $('.prev_fabric').css('visibility', 'hidden');
    }

    $('.fabric_count span').text(`Count : ${AllFabricData}`);
    lazyLoadImg();
    getLastImageDrape();
    if (typeof callback === 'function') {
      callback();
    }

  } else {
    G_paylaod = {}
    sweetalert_warning('Upload a fabric to preview it on the available models.');
    startAppendFabric(designMaster);
    $('.fabric_count span').text(`Count : ${0}`);
    if ($('.fabric_count .no-fabrics-msg').length === 0) {
      $('.fabric_count').append('<div class="no-fabrics-msg" style="color:red; font-style:italic;">Upload a fabric to preview it on the available models.</div>');
    }
    stopBuffer();
    if (typeof callback === 'function') {
      callback();
    }
  }

  !d_portrait() ? h_fabric_panel() : null;
}

export function checkScrollBarPos() {

  if ($('#appendFabricList').children().length > 0) { //&& AllFabricData > fabStart
    fabricPluginObj.loadMoreData().then((res) => { //fabStart
      AllFabricData = res['totalCount'];
      $('.fabric_count span').text(`Count : ${AllFabricData}`);
      scrollGetFabric = true
      if (res.designMaster.length > 1) {
        $('.next_fabric').css('visibility', 'visible');
        $('.prev_fabric').css('visibility', 'visible');
      } else if (res.designMaster.length == 1) {
        $('.next_fabric').css('visibility', 'hidden');
        $('.prev_fabric').css('visibility', 'visible');
      }
      startAppendFabric(res);
      lazyLoadImg();
      getLastImageDrape();
    });
  } else {
    // alert('fabric not more');
  }
}

export function q3d_changeStyleModel(data, modelchange) {  //This function handles changing the style or model of a 3D product in your Q3D system.

  startBuffer();
  if (modelchange) {
    currentStyleli = data.attr('value')
    if (currentStyleli != prevStyleli) {
      prevStyleli = currentStyleli;
      //modelchange = false;
      $(".style_thumb ul li.active").removeClass('active');
      data.parent().addClass('active');
      resetSlider();
      //resetTextureoperation();
      if ($('.style.style_exp_red').length > 0) {
        $('.style_expand').click();
      }
      if (!isdeskStop()) {
        $('#crossButton').click();
      }
      // if($('#fabricList li.active').attr('id') == 'myUpd' && modelchange){
      //   uploadViewFabricDrapeOnModel();
      // } else {
      changeStyleModel(data, modelchange);
      // }
    } else {
      stopBuffer();
    }
  } else {
    //styleModelChange = true
    currentStyleMain = data.attr('fab-product')
    if (currentStyleMain != prevStylemain) {
      prevStylemain = currentStyleMain;
      $('.style_thumb').scrollTop(0);
      $(".style_lib li.active").removeClass('active');
      data.addClass('active');
      $('.style_lib').removeClass('active');
      $('.style_lib').css("display", ""); //akash
      $($('.style_thumb ul.active li.active')[0]).removeClass('active');
      $('.style_thumb ul.active').removeClass('active')
      const tabNew = data.children().children().attr('href');
      $(tabNew).addClass('active');
      $('.btn_style_lib b').text($('.style_lib ul li.active').attr('fab-product'))
      $($('.style_thumb ul.active li')[0]).addClass('active');
      $('.filter_wrap.active').removeClass('active');
      prevStyleli = $('.style_thumb ul.active li:first').children().attr('value')
      if (!isdeskStop()) {
        $(`.style_thumb #tab${data.attr('index')}`).scrollLeft(0);
        $('#crossButton').click();
      }
      $(`.style_thumb #tab${data.attr('index')}`).scrollTop(0);
      if ($('.style.style_exp_red').length > 0) {
        $('.style_expand').click();
      }
      // if($('#fabricList li.active').attr('id') == 'myUpd' && modelchange){
      //   uploadViewFabricDrapeOnModel();
      // } else {
      // console.log('load image');
      changeStyleModel(data, modelchange);
      // }
    } else {
      stopBuffer();
      $('.style_lib').removeClass('active')
    }
  }
}

function uploadViewFabricDrapeOnModel() {

  const ModelThreedImageId = $('.style_thumb ul.active li.active').attr('id');
  const activeImageUrl = $('#myuploadFabric li.active .fabric_img').attr('data-src');
  let activeImageSize = $('#myuploadFabric li.active .fabric_thumb_wrap').attr('designsize').split(',');
  const width = activeImageSize[0];
  const height = activeImageSize[1];
  const activeGroupName = configuration.q3d_display_groups ? groupNameChange($('#groupInfo .active').attr('groupname'), parseInt($('#groupInfo .active').attr('groupno'))) : undefined;

  q3d_PluginObj.loadThreeDImage(ModelThreedImageId, activeImageUrl, width, height, activeGroupName, () => {
    stopBuffer();
  });

}
export function getznerPopupDownload(q3d_Plugin) {
  let clearTime = null;
  q3d_Plugin.resetModel();
  clearTimeout(clearTime);
  clearTime = setTimeout(() => {
    downloadQ3dModel(q3d_Plugin, "getzner");
  }, 2000);
}
export function downloadQ3dModel(q3d_Plugin) {
  try {
    // $("#downloadButton").attr("disabled", true);
    let DownloadBtn = document.getElementById('downloadButton');
    DownloadBtn.disabled = true;
    setTimeout(function () {
      window.isActivity = true;
    }, 0);
    $('#common_notification').text('Download in progress');
    $('#common_notification').show();
    if (completeDownloadImage) {
      if (fabricDrapeOnModel || !qrScan) {
        completeDownloadImage = false;
        const threeDModelWH = q3d_Plugin.getThreeDImageSize();
        let width, height, isBgImg, imgFormat, downloadImageQuality = "";
        if (getznerData != "") {
          width = getznerData != '' ? $('#downloadWH :selected').attr('width') : threeDModelWH.width;
          height = getznerData != '' ? $('#downloadWH :selected').attr('height') : threeDModelWH.height;
          isBgImg = getznerData != '' ? $('#no_bg').is(":checked") : true; // UI Side Working Pending Added Tanmay D Working in Progress : 06-07-2024
          imgFormat = getznerData != '' ? $('#imgFormat :selected').val() : 'jpeg'; // UI side Working pending 
          downloadImageQuality = 1;
        } else {
          width = $('#downloadWH :selected').attr('width') != '' ? $('#downloadWH :selected').attr('width') : threeDModelWH.width;
          height = $('#downloadWH :selected').attr('height') != '' ? $('#downloadWH :selected').attr('height') : threeDModelWH.height;
          isBgImg = $('#no_bg').is(":checked") != '' ? $('#no_bg').is(":checked") : true; // UI Side Working Pending Added Tanmay D Working in Progress : 06-07-2024
          imgFormat = $('#imgFormat :selected').val() != '' ? $('#imgFormat :selected').val() : 'jpeg'; // UI side Working pending 
          downloadImageQuality = 1;
        }
        // let watermarkImage = ;tdsLogo
        let watermarkImage = document.getElementById('tdsLogo');
        watermarkImage.crossOrigin = "anonymous"
        let is360Download = $(".style_thumb li.active").attr('isThreeD') == "true" ? true : false;
        // if(is360Download){
        //   q3d_Plugin.flipBackSide('back',parseInt(width), parseInt(height),downloadImageQuality,function(data){
        //     console.log('data',data);
        //     $('#download_popup').removeClass('show');
        //     $('#download_popup').css('display', 'none');
        //     width *= downloadImageQuality;
        //     height *= downloadImageQuality;
        //     let c = document.createElement('canvas');
        //     let ctx = c.getContext("2d");
        //     ctx.clearRect(0,0,width,height);
        //     c.width = parseFloat(width);
        //     c.height = parseFloat(height);
        //     let margin = c.width * 0.020 > 40 ? c.width * 0.020 : 40; 
        //       let designleft = c.width * 0.01 ; // print design Name x axis position
        //       let designtop = c.height * 0.02; //print design Name y axis position
        //       let designheight = 20; 
        //       // image sizes 
        //       let imageleft = 0;
        //       let imagetop = c.height * 0.0123; // header margin set to 1% of total canvas
        //       let imagewidth = width * downloadImageQuality;
        //       let imageheight = height * downloadImageQuality;
        //         // copyright text sizes 
        //       let footertop = imageheight;
        //       let footerleft = imagewidth - margin;
        //       let logoright = footerleft;

        //       let  logoheight = Math.min(c.height ,c.width) * 0.02864; // aspect ratio of logo image
        //       let logowidth = logoheight * (watermarkImage.height/watermarkImage.width);
        //     let logoleft = logoright - logowidth - 5;
        //     let footerheight = logoheight;
        //    // total download canvas size
        //       let canvaswidth = imagewidth; 
        //     c.height = designheight + imageheight + footerheight;

        //     const scaleFactor = Math.min(c.width, c.height) / 1500;
        //     let fSize = 25 * scaleFactor;
        //     let imageObj1 = new Image();
        //       imageObj1.crossOrigin="anonymous"
        //     var ClientLogo = new Image();
        //       ClientLogo.crossOrigin="anonymous"
        //       imageObj1.onload = function () {

        //         ctx.beginPath();
        //         ctx.rect(0, 0, c.width, c.height);
        //         ctx.fillStyle = "#ffffff";
        //         ctx.fill();
        //         ctx.drawImage(imageObj1, imageleft, imagetop, imagewidth, imageheight);
        //          ctx.fillStyle = "black";
        //         // ctx.fill();
        //         ctx.font = "bold  " + fSize + "px Arial";
        //         //var pointer = this.height + 5;
        //         ctx.textBaseline = 'middle';
        //         ctx.textAlign = 'right';
        //         let fabName =  $('.last_drap_fab').text();//$('.product_tag').text() 
        //         let FabNameSize = ctx.measureText("Design : " + fabName);
        //         //let FabNameSize = ctx.measureText("Design : " + "Tanmay");
        //         footertop += parseInt(FabNameSize.fontBoundingBoxAscent) + parseInt(FabNameSize.fontBoundingBoxDescent);
        //           ctx.fillText("Design : " + fabName, designleft + FabNameSize.width, designtop);
        //         fSize = 20 * scaleFactor; // shubham added purpose: small font for watermark
        //         ctx.font = fSize + "px Arial";
        //         ctx.textAlign = 'right';
        //         var watermark = "Powered By Textronics";
        //        var footerwidth = ctx.measureText(watermark) ;
        //        logoleft -= footerwidth.width;
        //         ctx.fillText(watermark, footerleft , footertop);// shubham added purpose: Added watermark for download design
        //        ctx.drawImage(watermarkImage, logoleft, imageheight, logowidth, logoheight);
        //         //ctx.drawImage(ClientLogo, ClientLogoXpos, ClientLogoYpos, ClientLogoWidth, ClientLogoHeight);
        //         //ctx.drawImage(ClientLogo, ClientLogoXpos,ClientLogoYpos, ClientLogoWidth, ClientLogoHeight);
        //         //ctx.drawImage(ClientLogo, 10, 50, 200, 200);
        //         if(orgLogo){
        //           let clientLogoSize = clientLogoCalc(c.width, c.height,ClientLogo.naturalWidth, ClientLogo.naturalHeight)
        //           var ClientLogoXpos = c.width - (clientLogoSize[0] + designleft)
        //           var ClientLogoYpos = designtop/2;
        //          ctx.drawImage(ClientLogo, ClientLogoXpos,ClientLogoYpos, clientLogoSize[0], clientLogoSize[1]);
        //         } 
        //         $('body').append(c);
        //         $(c).attr('id', 'newCanvas');
        //         $(c).hide();
        //         var canvas = document.getElementById("newCanvas");
        //         canvas.toBlob(function (blob, mimeType) {
        //           let name  = $('.last_drap_fab').text() + "." + imgFormat
        //           saveAs(blob, name);

        //           $('#common_notification').text('Download Completed');

        //           timeOut = setTimeout(function() {
        //             completeDownloadImage = true;
        //             DownloadBtn.disabled = false;
        //             window.isActivity = false;
        //             $('#common_notification').hide();
        //             //$("#downloadButton").removeAttr("disabled");
        //           }, 3000);
        //           $('#newCanvas').remove();
        //         },"image/png",1);

        //         }
        //         let orgLogo = qrScan ? JSON.parse(sessionStorage.jsonString).org_logoImg_url : JSON.parse(sessionStorage.qrScanDataAuth).org_logoImg_url//.replaceAll("var/www/html/textronics/services/tdb/","");
        //           //JSON.parse(sessionStorage.qrScanDataAuth).org_logoImg_url
        //           orgLogo = orgLogo.replaceAll("var/www/html/textronics/services/tdb/","");
        //           if(orgLogo){
        //           //tanmay Added : adding version ORGLOGO url 14-7-2024 
        //           let version = new Date().getTime();
        //           if(orgLogo.includes('?v=')){
        //             orgLogo = orgLogo.split("?v=")[0] + '?v=' + version;
        //           }else{
        //             orgLogo = orgLogo + '?v=' + version;
        //           }
        //           ClientLogo.src = orgLogo;
        //           ClientLogo.onload = function (){
        //             imageObj1.src = data;
        //           }
        //         }
        //            else
        //           imageObj1.src = data;
        //   })

        // } else {
        q3d_Plugin.getImage(parseInt(width), parseInt(height), isBgImg, imgFormat, function (data) {
          $('#download_popup').removeClass('show');
          $('#download_popup').css('display', 'none');
          width *= downloadImageQuality;
          height *= downloadImageQuality;
          let c = document.createElement('canvas');
          let ctx = c.getContext("2d");
          ctx.clearRect(0, 0, width, height);
          c.width = parseFloat(width);
          c.height = parseFloat(height);
          let margin = c.width * 0.020 > 40 ? c.width * 0.020 : 40;
          let designleft = c.width * 0.01; // print design Name x axis position
          let designtop = c.height * 0.02; //print design Name y axis position
          let designheight = 20;
          // image sizes 
          let imageleft = 0;
          let imagetop = c.height * 0.0123; // header margin set to 1% of total canvas
          let imagewidth = width * downloadImageQuality;
          let imageheight = height * downloadImageQuality;
          // copyright text sizes 
          let footertop = imageheight;
          let footerleft = imagewidth - margin;
          let logoright = footerleft;

          let logoheight = Math.min(c.height, c.width) * 0.02864; // aspect ratio of logo image
          let logowidth = logoheight * (watermarkImage.height / watermarkImage.width);
          let logoleft = logoright - logowidth - 5;
          let footerheight = logoheight;
          // total download canvas size
          let canvaswidth = imagewidth;
          c.height = designheight + imageheight + footerheight;

          const scaleFactor = Math.min(c.width, c.height) / 1500;
          let fSize = 25 * scaleFactor;
          let imageObj1 = new Image();
          imageObj1.crossOrigin = "anonymous"
          var ClientLogo = new Image();
          ClientLogo.crossOrigin = "anonymous"
          imageObj1.onload = function () {
            ctx.beginPath();
            ctx.rect(0, 0, c.width, c.height);
            ctx.fillStyle = "#ffffff";
            ctx.fill();
            ctx.drawImage(imageObj1, imageleft, imagetop, imagewidth, imageheight);
            ctx.fillStyle = "black";
            // ctx.fill();
            ctx.font = "bold  " + fSize + "px Arial";
            //var pointer = this.height + 5;
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'right';
            let fabName = $('.last_drap_fab').text();//$('.product_tag').text() 
            let FabNameSize = ctx.measureText("Design : " + fabName);
            //let FabNameSize = ctx.measureText("Design : " + "Tanmay");
            footertop += parseInt(FabNameSize.fontBoundingBoxAscent) + parseInt(FabNameSize.fontBoundingBoxDescent);
            ctx.fillText("Design : " + fabName, designleft + FabNameSize.width, designtop);
            fSize = 20 * scaleFactor; // shubham added purpose: small font for watermark
            ctx.font = fSize + "px Arial";
            ctx.textAlign = 'right';
            var watermark = "Powered By Textronics";
            var footerwidth = ctx.measureText(watermark);
            logoleft -= footerwidth.width;
            ctx.fillText(watermark, footerleft, footertop);// shubham added purpose: Added watermark for download design
            ctx.drawImage(watermarkImage, logoleft, imageheight, logowidth, logoheight);
            //ctx.drawImage(ClientLogo, ClientLogoXpos, ClientLogoYpos, ClientLogoWidth, ClientLogoHeight);
            //ctx.drawImage(ClientLogo, ClientLogoXpos,ClientLogoYpos, ClientLogoWidth, ClientLogoHeight);
            //ctx.drawImage(ClientLogo, 10, 50, 200, 200);
            if (orgLogo) {
              let clientLogoSize = clientLogoCalc(c.width, c.height, ClientLogo.naturalWidth, ClientLogo.naturalHeight)
              var ClientLogoXpos = c.width - (clientLogoSize[0] + designleft)
              var ClientLogoYpos = designtop / 2;
              ctx.drawImage(ClientLogo, ClientLogoXpos, ClientLogoYpos, clientLogoSize[0], clientLogoSize[1]);
            }
            $('body').append(c);
            $(c).attr('id', 'newCanvas');
            $(c).hide();
            var canvas = document.getElementById("newCanvas");
            canvas.toBlob(function (blob, mimeType) {
              let name = $('.last_drap_fab').text() + "." + imgFormat
              saveAs(blob, name);

              $('#common_notification').text('Download Completed');

              timeOut = setTimeout(function () {
                completeDownloadImage = true;
                DownloadBtn.disabled = false;
                window.isActivity = false;
                $('#common_notification').hide();
                //$("#downloadButton").removeAttr("disabled");
              }, 3000);
              $('#newCanvas').remove();
            }, "image/png", 1);

          }
          let orgLogo = qrScan ? JSON.parse(sessionStorage.jsonString).org_logoImg_url : JSON.parse(sessionStorage.qrScanDataAuth).org_logoImg_url//.replaceAll("var/www/html/textronics/services/tdb/","");
          //JSON.parse(sessionStorage.qrScanDataAuth).org_logoImg_url
          orgLogo = orgLogo.replaceAll("var/www/html/textronics/services/tdb/", "");
          if (orgLogo) {
            //tanmay Added : adding version ORGLOGO url 14-7-2024 
            let version = new Date().getTime();
            if (orgLogo.includes('?v=')) {
              orgLogo = orgLogo.split("?v=")[0] + '?v=' + version;
            } else {
              orgLogo = orgLogo + '?v=' + version;
            }
            ClientLogo.src = orgLogo;
            ClientLogo.onload = function () {
              imageObj1.src = data;
            }
          }
          else
            imageObj1.src = data;
        });
        // }
        deduct_credits('DownloadImage'); // Pravesh Changes added for credit deduction
      } else {
        // alert('');
        sweetalert_warning('first Fabric drpae On model');
      }
    }
  } catch (e) {
    sweetalert_error('download Failed');
  }

}

export function prevdrapFabricOnModel(selectedData) {
  startBuffer();

  // const isFirstTime = sessionStorage.getItem('FirstTimefabricCall') === "true"; for credit working

  const processFabric = () => {
    $('#appendFabricList li.active').removeClass('active');
    $("#myuploadFabric li").removeClass('active');
    selectedData.parent().addClass('active');
    resetSlider();

    if ($('.fabric.fabric_exp_red').length > 0) {
      $('.fabric_expand').click();
    }

    if ($(".fabric.desk_fab_fullview").length > 0) {
      $('.desk_fab_expand').click();
    }

    if ($('#fabric_fullview').css('display') === 'block') {
      openFullViewClickOnFabric = true;
      $('.fabric_fullview_img').css(
        'background-image',
        'url("' + q3dFullviewImage($(selectedData.children()[0]).attr('data-src')) + '")'
      );
    }

    displayNextPrevBtn(selectedData.parent().attr('index'));

    if (selectedData.children().attr('id') !== alreadtDrapefab) {
      alreadtDrapefab = selectedData.children().attr('id');
      drapFabricOnModel(selectedData);
    } else {
      stopBuffer();
    }
  };

  // for credit working commented for render
  // if (!isFirstTime) {
  //   if (hasCredits('Render')) {
  //     processFabric();
  //     deduct_credits('Render');
  //   } else {
  //     $('#notification')
  //       .text('No more render credits left!')
  //       .css('display', 'flex');
  //     setTimeout(() => $('#notification').css('display', 'none'), 2000);
  //     stopBuffer();
  //     return;
  //   }
  // } else {
  processFabric();
  sessionStorage.setItem('FirstTimefabricCall', "false");
  // }
}

export function q3d_appendFabric(selectedData) {
  // resetSlider();
  G_paylaod = {};
  if (configuration.q3d_fabric_to_model) {
    Current_FabListName = selectedData.children().text()
    if (Current_FabListName != prevFabListName) {
      prevFabListName = Current_FabListName
      $('#appendFabricList').empty();
      $('#fabricList li.active').removeClass('active');
      $('.filter_wrap.active').removeClass('active');
      selectedData.addClass('active');
      $('.btn_fabric_lib b').text(selectedData.children().text().toLocaleLowerCase());
      if (isdeskStop()) {
        $('.fabric_lib').css('display', 'none');
      }
      $('#filter_popup input[type="checkbox"]:checked').prop('checked', false);
      // fabStart = 0;
      fabListchange = true;
      textSearchD = "";
      if (styleModelChange) {
        styleModelChange = false;
        if (getznerData) {
          let listData = document.querySelector("li a[groupName='" + selectedData.children().text() + "']");
          if (listData) {
            let productTypeId = listData.parentElement.getAttribute('design_type_id');
            let productGroupId = listData.parentElement.getAttribute('design_groups_id')
            fabricPluginObj.setTypeGroup(productTypeId, productGroupId);
          } else {
            //G_paylaod = new Object();
            G_paylaod[getznerData.featureAsLibrary] = selectedData.children().text();
          }
          appendFabric($('#groupInfo .active').attr('g_productname'), G_paylaod, loadModelAndDrapeFabric);
        } else {
          appendFabric(selectedData.children().text().toLocaleUpperCase(), {}, loadModelAndDrapeFabric);
        }

      } else {
        if (getznerData) {
          let listData = document.querySelector("li a[groupName='" + selectedData.children().text() + "']");
          if (listData) {
            let productTypeId = listData.parentElement.getAttribute('design_type_id');
            let productGroupId = listData.parentElement.getAttribute('design_groups_id')
            fabricPluginObj.setTypeGroup(productTypeId, productGroupId);
          } else {
            //G_paylaod = new Object();
            G_paylaod[getznerData.featureAsLibrary] = selectedData.children().text();
          }

          appendFabric($('#groupInfo .active').attr('g_productname'), G_paylaod, q3d_fabric_to_modelChange);
        } else {
          appendFabric(selectedData.children().text().toLocaleUpperCase(), {}, q3d_fabric_to_modelChange);
        }

      }
    } else {
      if (isdeskStop()) {
        $('.fabric_lib').css('display', 'none');
      }
    }
  } else {
    Current_FabListName = selectedData.children().text()// == $('#fabricList li.active').text() ? selectedData.children().text() : $('#fabricList li.active').text() ;//selectedData.children().text()//$(".btn_fabric_lib b").text();//selectedData.children().text()
    if (Current_FabListName != prevFabListName) {
      prevFabListName = Current_FabListName
      $('#appendFabricList').empty();
      resetAllTextSearch();
      $('#fabricList li.active').removeClass('active');
      selectedData.addClass('active');
      $('.filter_wrap.active').removeClass('active');
      $('.btn_fabric_lib b').text(selectedData.children().text().toLocaleLowerCase());
      if (isdeskStop()) {
        $('.fabric_lib').css('display', 'none');
      }
      $('#filter_popup input[type="checkbox"]:checked').prop('checked', false);
      // fabStart = 0;
      textSearchD = "";
      fabListchange = true;
      if (styleModelChange) {
        styleModelChange = false;
        if (getznerData) {
          let listData = document.querySelector("li a[groupName='" + selectedData.children().text() + "']");
          if (listData) {
            let productTypeId = listData.parentElement.getAttribute('design_type_id');
            let productGroupId = listData.parentElement.getAttribute('design_groups_id')
            fabricPluginObj.setTypeGroup(productTypeId, productGroupId);
          } else {
            // G_paylaod = new Object();
            G_paylaod[getznerData.featureAsLibrary] = selectedData.children().text();
          }
          appendFabric($('#groupInfo .active').attr('g_productname'), G_paylaod, loadModelAndDrapeFabric);
        } else {
          appendFabric(selectedData.children().text().toLocaleUpperCase(), {}, loadModelAndDrapeFabric);
        }

      } else {
        if (getznerData) {
          let listData = document.querySelector("li a[groupName='" + selectedData.children().text() + "']");
          if (listData) {
            let productTypeId = listData.parentElement.getAttribute('design_type_id');
            let productGroupId = listData.parentElement.getAttribute('design_groups_id')
            fabricPluginObj.setTypeGroup(productTypeId, productGroupId);
          } else {
            //G_paylaod = new Object();
            G_paylaod[getznerData.featureAsLibrary] = selectedData.children().text();
          }
          appendFabric($('#groupInfo .active').attr('g_productname'), G_paylaod);
        } else {

          // const id = $('#fabricList li.active')[0].id;
          // G_paylaod = {
          //   [id]: selectedData.children().text().toLocaleUpperCase() // Akash 
          // };
          // console.log(G_paylaod)

          appendFabric(selectedData.children().text().toLocaleUpperCase(), G_paylaod, {});
        }

      }
    } else {
      if (isdeskStop()) {
        $('.fabric_lib').css('display', 'none');
      }
    }

  }
}

export function clickOnModelPrevBtn() {
  // $('#appendFabricList li.active').prev().children().click();
  //$(".fabric_thumb ul li.active").prev().children().click();
  //displayNextPrevBtn();
  if ($("#myUpd").hasClass("active")) {
    $(".fabric_thumb ul li.active").prev().children().click();
  } else {
    $('#appendFabricList li.active').prev().children().click();
  }
}

export function clickOnModelNextBtn() {

  // if($('#appendFabricList li.active').length > 0){
  //   $('#appendFabricList li.active').next().children().click();
  // } else {
  //   $('#appendFabricList li:first').children().click();
  // }
  $(".fabric_thumb ul li.active")
  if ($('#appendFabricList li.active').length > 0) {
    $('#appendFabricList li.active').next().children().click();
  }
  else if ($("#myUpd").hasClass("active") && $(".fabric_thumb ul li.active").length > 0) {
    $(".fabric_thumb ul li.active").next().children().click();
  } else {
    $('#appendFabricList li:first').children().click();
  }
}

export function textureOperation() {
  let slide = parseInt($('#slide-scale').val());
  let rotate = parseInt($('#slide-rotate').val());
  let offsetX = parseFloat($('#slide-offset').val());
  let offsetY = parseFloat($('#slide-offset-b').val());
  let hue = parseFloat($('#input-hue').val());
  let groupNo = parseInt($('#groupInfo .group.active').attr('groupno'));
  q3d_PluginObj.textureOpration(slide, offsetX, offsetY, rotate, hue ? hue : 0, groupNo);
}
function resetTextureoperation() {
  let groupNo = parseInt($('#groupInfo .group.active').attr('groupno'));
  q3d_PluginObj.textureOpration(undefined, undefined, undefined, undefined, 0, groupNo);
}

export function resetSlider() {
  $("#input-offset").val(0);
  $('#slide-offset').val(0);
  $("#input-offset-b").val(0);
  $('#slide-offset-b').val(0);
  $("#input-rotate").val(0);
  $('#slide-rotate').val(0);
  $("#input-scale").val(100);
  $('#slide-scale').val(100);
  $('#hue').val(0);
  $('#input-hue').val(0);
}

export function q3d_Filter() {
  fabricPluginObj.getFeatures().then((res) => {
    if (res != null) {
      getFeatureTypeAppend(res);
    }
  });
}

export function q3d_clickOnFilterBtn() {
  let filterDataObj = new Object();
  let filterFirstOpt = '';
  if ($('#filter_popup input[type="checkbox"]:checked').length >= 1) {
    filterFirstOpt = $($('#filter_popup input[type="checkbox"]:checked')[0]).attr('key');
    let checkBoxClickdata = $('#filter_popup input[type="checkbox"]:checked')
    checkBoxClickdata.each((index, num1) => {
      if (filterFirstOpt == $(checkBoxClickdata[index]).attr('key')) {
        if (filterDataObj[filterFirstOpt]) {
          filterDataObj[filterFirstOpt] += ',' + checkBoxClickdata[index].value
        } else {
          filterDataObj[filterFirstOpt] = checkBoxClickdata[index].value
        }

      } else {
        filterFirstOpt = $(checkBoxClickdata[index]).attr('key')
        filterDataObj[filterFirstOpt] = checkBoxClickdata[index].value
      }

    });
    filterSearchData(filterDataObj);
  } else {
    textSearchD = '';
    q3d_resetFilter();
  }
}

export function q3d_resetFilter() {
  if ($('#filter_popup input[type="checkbox"]:checked').length != 0) {
    $('#filter_popup input[type="checkbox"]:checked').prop('checked', false);
    // $('#filter_popup').hide();
    $('.filter_wrap.active').removeClass('active');
    $('#appendFabricList').empty();
    const activeDesignListName = $('.btn_fabric_lib b').text();
    textSearchD = '';
    // fabStart = 0;
    appendFabric(activeDesignListName, {});
  } else {
    $("#filter_popup").removeClass("show");
    $("#filter_popup").css("display", "none");
  }
}
// export function q3d_clickonFilterCrossBtn(){
//   $('#filter_popup input[type="checkbox"]:checked').prop('checked', false);
//   $('.filter_wrap.active').removeClass('active');
// }
export function q3d_textSearch(searchData, isBarcodeScan) {
  let includeChar = '&t='
  let result = ''
  internalTextSearch = true;
  if (searchData.includes(includeChar)) {
    result = searchData.split('&t=')[1];
  } else {
    if (isBarcodeScan) {
      if (containsNumber(configuration.q3d_product_name)) {
        result = trimDesignNameByBarcode(searchData)
      } else if (searchData.includes('&t')) {
        // result = searchData;
        const url = new URL(searchData);
        result = url.searchParams.get("t");
      } else {
        result = searchData
      }
    } else {
      result = searchData
    }

  }
  if (result != textSearchD) {
    textSearchD = result;
    if (loadAllFabricName) {
      $('#appendFabricList').empty();
      textSearch(result);
    }
    else if (!qrScan) {
      isredirect = true;
      qrScanTextSearch(textSearchD)
    } else {
      $('#appendFabricList').empty();
      textSearch(result);
    }
  } else {
    sweetalert_error('Search Another Design Name');//resetTextSearch();
  }
}

export function q3d_resetTextSearch() {
  textSearchD = '';
  // fabStart = 0
  internalTextSearch = true;
  if ($('#filter_popup input[type="checkbox"]:checked').length >= 1) {
    q3d_clickOnFilterBtn()
  } else {
    resetTextSearch()
  }

}

export function q3d_SortingFilter(sortdata) {
  sortFilter = true;
  // fabStart = 0;
  $('.sort_by_dropdown ul li').removeClass('active');
  sortdata.addClass('active');
  const selectSortFilter = sortdata.attr('value');
  $('#appendFabricList').empty();
  $('.next_fabric').css('visibility', 'hidden');
  $('.prev_fabric').css('visibility', 'hidden');
  fabricPluginObj.SortBy(selectSortFilter).then((res) => {
    if (res.designMaster.length > 1) {
      $('.next_fabric').css('visibility', 'visible');
    }
    startAppendFabric(res);
    lazyLoadImg();
    getLastImageDrape();
  });

}

export function isdeskStop() {
  if (window.screen.width > 1024) {
    if (window.screen.width == 1080 && window.screen.height == 1920) {
      return false
    } else {
      return true;
    }
  } else {
    return false;
  }
}

function isTotem() {
  if ((window.screen.width == 1080 && window.screen.height == 1920) && window.matchMedia("(orientation: Portrait)").matches) {
    return true
  } else {
    return false;
  }
}

export function q3d_ptpgFilter(apendGroupSelect) {
  if ($('.group_by_dropdown ul li.active').children().text() !== apendGroupSelect.children().text()) {
    $('.group_by_dropdown ul li.active').removeClass('active');
    apendGroupSelect.addClass('active');
    $('#filter_popup input[type="checkbox"]:checked').prop('checked', false);
    $('.header_options').removeClass('active');
    productTypeId = apendGroupSelect.attr('design_type_id');
    productGroupId = apendGroupSelect.attr('design_groups_id');
    fabricPluginObj.setTypeGroup(parseInt(productTypeId), parseInt(productGroupId));
    const designName = $('#groupInfo .active').attr('g_ProductName');
    $('#appendFabricList').empty();
    appendFabric(designName, {});
  }
}

export function q3d_logout() {
  // let url = serviceUrl + '/api/Configuration/ForceLogoutQ3dUser?UserId='+JSON.parse(sessionStorage.jsonString).userid+'&DeviceLoginId='+ getUniqueId();
  //   $.ajax({
  //     url: url,
  //     type: "GET",
  //     dataType: "json",
  //     async: false,
  //   }).done(function(r) {
  //     if((r.message).includes('Logout successful')){
  //       document.cookie = 'deviceData=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  //       document.cookie = 'shareData=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  //       document.cookie = "deviceData=;max-age=0";
  //       document.cookie = "shareData=;max-age=0";
  //       localStorage.removeItem("shareData");
  //       localStorage.removeItem("deviceData");
  //       sessionStorage.clear();
  //       const checkboxflag = localStorage.getItem("checkbox");
  //       if((checkboxflag === 'false')){
  //         document.cookie = "q3duser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  //         document.cookie = "q3dpass=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  //         localStorage.removeItem("checkbox");
  //       } 
  //       sessionStorage.removeItem('userLog');
  //         window.location.reload();
  //     }
  //   }).fail(function(jqXhr, textStatus, errorThrown) {
  //     console.log("error while log out");
  //   });
  let payload = new Object();
  payload.userId = parseInt(JSON.parse(sessionStorage.jsonString).userid);
  const url = serviceUrl + '/api/Configuration/ForceLogoutOrgUser';
  $.ajax({
    url: url,
    type: "POST",

    contentType: 'application/json',
    data: JSON.stringify(payload),
  }).done(function (r) {
    //(r)
    document.cookie = 'deviceData=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'shareData=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = "deviceData=;max-age=0";
    document.cookie = "shareData=;max-age=0";
    localStorage.removeItem("shareData");
    localStorage.removeItem("deviceData");
    sessionStorage.clear();
    const checkboxflag = localStorage.getItem("checkbox");
    if ((checkboxflag === 'false')) {
      document.cookie = "q3duser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "q3dpass=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      localStorage.removeItem("checkbox");
    }
    sessionStorage.removeItem('userLog');
    window.location.reload();
  }).fail(function (jqXhr, textStatus, errorThrown) {
    console.log("error while force logout");
  });
}

export function q3d_changePassword() {
  let pass_validate = validatePassword();
  if (pass_validate) {
    let data1 = updatePasswordPayload();
    let url = serviceUrl + '/api/Configuration/UpdateUserPassword';
    $.ajax({
      url: url,
      type: "POST",
      contentType: 'application/json',
      data: JSON.stringify(data1),
      async: false,
    }).done(function (r) {
      if (r) {
        $('#inputPassword1').val('');
        $('#inputPassword2').val('');
        $('#inputPassword3').val('');
        $('.currentpass').hide();
        $('.oldpass').hide();
        $('#user_change_pass').removeClass('show');
        sweetalert_error('password Update'); //tanmay added : alert Show
      } else {
        sweetalert_error('Something Went Wrong, password Not Update');
      }
    }).fail(function (jqXhr, textStatus, errorThrown) {
      console.log("error while changePassword");
    });
  } else {
    sweetalert_error('password Not Match');
  }
}

export function q3d_clickOnLichangePassword() {
  $('#inputPassword1').val('');
  $('#inputPassword2').val('');
  $('#inputPassword3').val('');
  $('.pass_Old_eye').removeClass('active');
  $('.pass_new_eye').removeClass('active');
  $('.pass_confirm_eye').removeClass('active');
  let pass = document.getElementById('inputPassword1');
  pass.type = 'password';
  let pass1 = document.getElementById('inputPassword2');
  pass1.type = 'password';
  let pass2 = document.getElementById('inputPassword3');
  pass2.type = 'password';
  $('.oldpass').hide();
  $('.newpass').hide();
  $('.currentpass').hide();
}

export function q3d_myProfile() {
  $('#user_profile').css('display', 'block');

  $('.invalid-email')
    .css({
      'display': 'none',
      'color': 'red',
      'font-size': '12px'
    });
  $('.invalid-mobile')
    .css({
      'display': 'none',
      'color': 'red',
      'font-size': '12px'
    });
  $('.invalid-firstname')
    .css({
      'display': 'none',
      'color': 'red',
      'font-size': '12px'
    });
  $('.invalid-lastname')
    .css({
      'display': 'none',
      'color': 'red',
      'font-size': '12px'
    });

  var url = serviceUrl + '/api/Configuration/GetOrganisationUserById?id=' + JSON.parse(sessionStorage.jsonString).userid;
  $.ajax({
    url: url,
    type: "GET",
    dataType: "json",
    async: true,
  }).done(function (r) {
    //console.log(r)
    $('#validationDefault01').val(r.first_name);
    $('#validationDefault02').val(r.last_name);
    $('#validationDefault03').val(r.login_id);
    $('#validationDefault03').attr('userid', r.user_id);
    $('#validationDefault04').val(r.email);
    $('#validationDefault05').val(r.mobile);

    if (r.url) {
      r.url = r.url.replaceAll("//", "/") //temporory added should be removed
      r.url = r.url.replaceAll("var/www/html/textronics/services/tdb/", "") //temporory added should be removed
      r.url = r.url.replaceAll("https:/", "https://") //temporory added should be removed
      // $('#p_profileImg').empty().append('<img src="data:image/png;base64,' + r.profile_image + '" style="width:45px;height:auto">');
      // $('.myavtaar').attr('src', 'data:image/png;base64,' + r.profile_image);
      $('.profile_img').empty().append('<img src=' + r.url + ' style="width:45px;height:auto">');
      // $('.myavtaar').attr('src', r.url);
    }
  }).fail(function (jqXhr, textStatus, errorThrown) {
    console.log("An error occurred while GetOrganisationUserById.");
    //netToolTip()
  });
}
function allDataFunction(dataAll, scanner) {
  // console.log(dataAll);
  setTimeout(QrscanResult(dataAll.data), 1000);
}
export function QrscanResult(url) {

  if (!url) {
    return
  } else {
    startBuffer();
    //if((url).includes("?k" && "&t")) {
    if ((url)) {
      $(".camera_popup").css("display", "none");
      $('.barcode_popup').css("display", "none");

      scanner.stop();
      // Quagga.stop();
      if (qrScan) {
        q3d_TotemQrScan(url);
      } else {
        isredirect = true;
        qrScanTextSearch(url);
      }

    } else {
      $(".camera_popup").css("display", "none");
      $('.barcode_popup').css("display", "none");
      scanner.stop();
      // Quagga.stop();
      sweetalert_error("Fabric Name Not Found" + url);
    }
  }

}

export function q3d_getProductFeature(designId, fabName) {

  if (!designId) {
    designId = Number($('#appendFabricList li.active .fabric_thumb_wrap').attr('designid'));
  }

  if ($('.fab_features').css('display') == "block" || $('#fabric_fullview').css('display') == 'block') {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(async () => {
      const productFeature = await getProductFeature(designId);
      if ($('#fabric_fullview').css('display') == 'block' && openFullViewClickOnFabric) {
        openFullViewClickOnFabric = false;
        fullviewAppendProductFeature(productFeature)
        appendProductFeature(productFeature, fabName);
      } else if ($('#fabric_fullview').css('display') == 'block') {
        fullviewAppendProductFeature(productFeature)
      } else {
        appendProductFeature(productFeature, fabName)

      }
    }, 1000);
  }
}

export function q3d_initializeTron() {
  $('#root').append(loadTryonUi());
}

export function q3d_clickOnFullviewCloseBtn() {
  $('#fabric_fullview').css('display', 'none');
  $('#fabric_fullview').removeClass('show');
  saveClickOnFabricInfo();
  displayNextPrevBtn($('#appendFabricList li.active').attr('index'));
}

export function q3d_openFullView(clickOnSelectedFab) {
  //openFullView = true;
  const FabricUrl = clickOnSelectedFab.siblings().attr('data-src');
  $('#appendFabricList li.active').removeClass('active');
  clickOnSelectedFab.parent().parent().addClass('active');
  displayNextPrevBtn(clickOnSelectedFab.parent().parent().attr('index'))
  $('.fabric_fullview_img').css('background-image', 'url("' + q3dFullviewImage(FabricUrl) + '")');
  q3d_getProductFeature(Number($('#appendFabricList li.active .fabric_thumb_wrap').attr('designid')));
}

export function clickOnFullviewPrevBtn() {
  //displayNextPrevBtn();
  let index = parseInt($('#appendFabricList li.active').attr('index'))
  $('#appendFabricList li.active').removeClass('active');
  $('#appendFabricList li').eq(index - 1).addClass('active');
  displayNextPrevBtn(parseInt($('#appendFabricList li.active').attr('index')));
  let FabricUrl = $('#appendFabricList li.active .fabric_img').attr('data-src')
  $('.fabric_fullview_img').css('background-image', 'url("' + q3dDrapingFile(FabricUrl) + '")');
  q3d_getProductFeature(Number($('#appendFabricList li.active .fabric_thumb_wrap').attr('designid')));

}

export function clickOnFullviewNextBtn() {
  let index = parseInt($('#appendFabricList li.active').attr('index'));
  $('#appendFabricList li.active').removeClass('active');
  $('#appendFabricList li').eq(index + 1).addClass('active');
  displayNextPrevBtn(parseInt($('#appendFabricList li.active').attr('index')))
  let FabricUrl = $('#appendFabricList li.active .fabric_img').attr('data-src');
  $('.fabric_fullview_img').css('background-image', 'url("' + q3dDrapingFile(FabricUrl) + '")');
  q3d_getProductFeature(Number($('#appendFabricList li.active .fabric_thumb_wrap').attr('designid')));
}

export function openFullviewApplyBtn() {
  startBuffer();                  //   Starts some kind of loading/buffering animation while applying the fabric.
  //q3dLite Working added 
  if ($('body').hasClass('q3dlite')) {
    $('#fabric_fullview').css('display', 'none');
    $('#fabric_fullview').removeClass('show');
    let designUrl = $('#appendFabricList li.active .fab_img').attr('data-src');
    designUrl = q3dDrapingFile(designUrl);
    const designData = $('#appendFabricList li.active .fabric_list_wrap').attr('designsize').split(',');
    const designheight = designData[1];
    const designwidth = designData[0];
    //const designCode = $('#appendFabricList li.active .fabric_img').attr('id');
    //lastFabricInfoSave($('#appendFabricList li.active .fabric_img').attr('data-src'), designwidth, designheight, designCode);
    let groupOrderNumber = parseInt($('#AppendAllStyle li.active').children().attr('displaygroupindex'));
    groupOrderNumber = groupOrderNumber == 0 ? 0 : groupOrderNumber - 1

    //This actually applies the fabric texture to the 3D model.
    q3d_PluginObj.loadFabric(designUrl, groupOrderNumber, parseFloat(designwidth), parseFloat(designheight), function () {
      stopBuffer();
    });
  } else {
    $('#fabric_fullview').css('display', 'none');
    $('#fabric_fullview').removeClass('show');           //  Whenever user clicks Apply in full-view fabric popup → it closes the popup.
    if ($('.fabric.desk_fab_fullview').css('display') == 'block') {
      $('.desk_fab_expand').click();
    }
    if ($('.fabric.fabric_exp_red').css('display') == 'block') {
      //$('.fabric').removeClass('fabric_exp_red');
      $('.fabric_expand').click();
    }

    // Find the active fabric, Get its designid attribute, Convert it to a number
    q3d_getProductFeature(Number($('#appendFabricList li.active .fabric_thumb_wrap').attr('designid')));
    let index = Number($('#appendFabricList li.active').attr('index'));
    displayNextPrevBtn(index);
    getLastImageDrape();  //restores last applied fabric if needed.

    const groupOrderNumber = configuration.q3d_display_groups ? parseInt($('#groupInfo .active').attr('groupno')) : 0;
    let designUrl = $('#appendFabricList li.active .fabric_img').attr('data-src');
    designUrl = q3dDrapingFile(designUrl);
    const designData = $('#appendFabricList li.active .fabric_img').attr('designsize').split(',');
    const designheight = designData[1];
    const designwidth = designData[0];
    const designCode = $('#appendFabricList li.active .fabric_img').attr('id');
    lastFabricInfoSave($('#appendFabricList li.active .fabric_img').attr('data-src'), designwidth, designheight, designCode);
    q3d_PluginObj.loadFabric(designUrl, groupOrderNumber, parseFloat(designwidth), parseFloat(designheight), function () {
      stopBuffer();
    });
    $('.last_drap_fab').text(designCode);
    const ThreeDImageId = $('.style_thumb li.active').attr('id');
    const fabName = $('#appendFabricList li.active .fabric_img').attr('id');
    fabName ? saveFabricDrapeCount(ThreeDImageId, fabName) : '';
  }

}

export function q3d_changeUserProfilePhoto(imageData) {

  if (imageData.files && imageData.files[0]) {

    const FR = new FileReader();
    FR.addEventListener("load", function (evt) {
      var image = new Image();
      image.onload = function (imageEvent) {
        // Resize the image
        var canvas = document.createElement('canvas'),
          max_size = "200", // TODO : pull max size from a site config
          width = image.width,
          height = image.height;
        if (width > height) {
          if (width > max_size) {
            height *= max_size / width;
            width = max_size;
          }
        } else {
          if (height > max_size) {
            width *= max_size / height;
            height = max_size;
          }
        }

        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(image, 0, 0, width, height);
        var dataUrl = canvas.toDataURL('image/jpeg');

        $('.profile_img').empty().append('<img src="' + dataUrl + '" style="width: 100%;height: 100%;">');

      }
      image.src = evt.target.result;

    });
    FR.readAsDataURL(imageData.files[0]);
  } else {
    //sweetalert_warning('Please select image.');
  }
}

export function q3d_UpdateProfile() {

  let data1 = payloadProfiledata();
  let url = serviceUrl + '/api/Configuration/UpdateUserProfile';
  let dataValidity = validateprofileData(data1);

  if (dataValidity[0]) {
    $.ajax({
      url: url,
      type: "POST",
      contentType: 'application/json',
      data: JSON.stringify(data1),
      async: false,
    }).done(function (r) {
      if (r.isSave) {
        sweetalert_success('Profile Update Successfully');
        if (data1.org_user_imagebyte) {
          $('.user_img').empty().append('<img src="data:image/png;base64,' + data1.org_user_imagebyte + '" style="width:100%;height:auto">');
        }
        $('#user_profile').removeClass('show');
      } else {
        sweetalert_error('Error in update user profile.');
      }
    }).fail(function (error) {
      console.log("error while get fabric", error);
    })
  } else {
    //sweetalert_error('Plaese fill all fields or check email id and mobile number format.');
    if (dataValidity[1] == '.invalid' && dataValidity[2] == '.invalid') {
      sweetalert_error('Please check all fields required.');
    } else {
      $(dataValidity[1]).css('display', 'block');
      $(dataValidity[2]).css('display', 'block');
    }
  }
}

export function q3d_switchOnGroupBtn(selectedGroup) {
  startBuffer();
  if ($("#myuploadFabric").css('display') == 'flex') {   // If "myuploadFabric" is visible, switch to "appendFabricList"
    $("#myuploadFabric").css('display', 'none')
    $("#appendFabricList").css('display', 'flex')

  }
  if (qrScan || loadAllFabricName) {
    if ($('.group.active').attr('groupname') != selectedGroup.attr('groupname')) {
      $(".fab_search_filter").find("*").prop("disabled", false);
      $(".sorting_dropdown").find("*").prop("disabled", false);
      $('.group.active').removeClass('active');  // Switch "active" group
      selectedGroup.addClass('active');
      // Added Imp Working Not Chnage :- 20-02-2025
      prevFabListName = $('#groupInfo .active').attr('g_productname'); // Save previously active fabric group name
      if ($('#fabricList li.active span').text().toLowerCase() != selectedGroup.attr('g_productname').toLowerCase()) {
        $('#appendFabricList').empty();
        $('#fabricList li.active').removeClass('active');
        $('#fabricList li').eq(fabViseSelectionNumber(selectedGroup.attr('g_productname'))).addClass('active');
        $('.btn_fabric_lib b').empty().text(selectedGroup.attr('g_productname').toLowerCase());

        if ($('body').hasClass('q3dlite')) {   //  
          getFabricImageNameQ3dLite("q3dLite");
        } else {
          appendFabric(selectedGroup.attr('g_productname'), {}, drapOnFabricSelectedGroup);
        }
      } else {
        drapOnFabricSelectedGroup();
      }
    } else {
      stopBuffer();
    }
  } else {
    $('.group.active').removeClass('active');
    $(".fab_search_filter").find("*").prop("disabled", false);
    $(".sorting_dropdown").find("*").prop("disabled", false);
    selectedGroup.addClass('active');
    if ($('body').hasClass('q3dlite')) {
      q3dLitefabricdrapeOnModel();
    } else {
      const groupOrderNumber = configuration.q3d_display_groups ? parseInt($('#groupInfo .active').attr('groupno')) : 0;
      let designUrl = $('#appendFabricList li.active .fabric_img').attr('data-src');
      if (designUrl) {
        designUrl = q3dDrapingFile(designUrl);
        const designData = $('#appendFabricList li.active .fabric_img').attr('designsize').split(',');
        const designheight = designData[1];
        const designwidth = designData[0];
        const designCode = $('#appendFabricList li.active .fabric_img').attr('id');
        lastFabricInfoSave($('#appendFabricList li.active .fabric_img').attr('data-src'), designwidth, designheight, designCode);
        q3d_PluginObj.loadFabric(designUrl, groupOrderNumber, parseFloat(designwidth), parseFloat(designheight), function () {
          stopBuffer();
        });
        $('.last_drap_fab').text(designCode);
      } else {
        stopBuffer();
      }
    }
  }
}
export function appendProductFeature(productFeaturedata, fabName) {
  if (!productFeaturedata) return;
  let length = Object.keys(productFeaturedata).length;
  let productFeature = "";
  productFeature = `<div class="fab_features_name"> <h5>${fabName ? fabName : $('#appendFabricList li.active .fabric_name').text().trim()}</h5> </div>`
  productFeature += `<table class="table">`
  productFeature += `<tbody>`
  Object.keys(productFeaturedata).forEach((index, value) => {
    productFeature += `<tr>`
    productFeature += `<th>${index}</th>`
    productFeature += `<td>`
    productFeature += `<div class="value_wrap">`
    productFeature += `<span></span>${productFeaturedata[Object.keys(productFeaturedata)[value]]}`
    productFeature += `</div>`
    productFeature += `</td>`
    productFeature += `</tr>`
  });
  productFeature += `</tbody>`
  productFeature += `</table>`

  $('.fab_features_body').empty().append(productFeature);
}

export function startBuffer() {
  $('.overlay').css('display', 'block');
  $('#New_loader_css').css('display', 'block');
}

export function stopBuffer() {
  $('.overlay').css('display', 'none');
  $('#New_loader_css').css('display', 'none');
  $('#New_loader_css1').css('display', 'none');
}

export async function q3d_TotemtextSearch(desName, isBarcodeScan) {

  let includeChar = '&t='
  let includeId = "?k="
  let designName = '';
  let belmontFlag = "&p="
  let qrScansupplierId = "";

  if (desName.includes(includeChar) && desName.includes(includeId) && desName.includes(belmontFlag)) {
    const url = new URL(desName);
    designName = url.searchParams.get("t");// desName.split('&t=')[1];
    designName = designName.split(',')[0];
    designName = designName.replaceAll("%20", " ");
    qrScansupplierId = url.searchParams.get("k");//desName.split('&t=')[1]
    qrScansupplierId = parseInt(qrScansupplierId, 16);
  } else if (desName.includes(includeChar) && desName.includes(includeId)) {
    const url = new URL(desName);
    designName = desName.split('&t=')[1];
    designName = designName.split(',')[0];
    designName = designName.replaceAll("%20", " ");
    qrScansupplierId = url.searchParams.get("k");//desName.split('&t=')[1]
    qrScansupplierId = parseInt(qrScansupplierId, 16);
  }
  else {
    qrScansupplierId = qrScan ? parseInt(JSON.parse(sessionStorage.getItem('jsonString')).org_type_id) : Number((sessionStorage.qrSupplierId));
  }
  if (!qrScan && !isLoginBelmont) {
    if (desName.includes("&p=")) {
      const url = new URL(desName);
      let designName = url.searchParams.get("t");
      desName = designName
    }
    q3d_textSearch(desName, isBarcodeScan);
  } else {
    if (isBarcodeScan) {
      if (containsNumber(configuration.q3d_product_name)) {
        if (desName.length == 10) {
          designName = desName;
        } else {
          designName = trimDesignNameByBarcode(desName)
        }

      } else if (desName.includes('&t')) {
        const url = new URL(desName);
        designName = url.searchParams.get("t");
      } else {
        designName = desName;
      }
    } else {
      designName = desName;
    }

    const qrscanDesignData = await getQrScanDesignData(designName, qrScansupplierId);
    if (qrscanDesignData.loadProductsByFabricResponseDto != null) {
      let resp = qrscanDesignData.loadProductsByFabricResponseDto;
      let fabUrl = resp[0].thumbImagePath + '/t/' + resp[0].designAdvName + 't.jpg';
      let drapefabUrl = q3dDrapingFile(fabUrl);
      const designN = resp[0].designAdvName;
      const fabSize = resp[0].designSize.split(',');
      const fabCode = resp[0].designAdvName;
      const fabWidth = fabSize[0];
      const fabHeight = fabSize[1];
      const a_Group = configuration.q3d_display_groups ? parseInt($('#groupInfo .active').attr('groupno')) : 0;
      lastFabricInfoSave(fabUrl, fabWidth, fabHeight, fabCode);
      //q3d_QrScanData(qrscanDesignData.loadProductsByFabricResponseDto);
      q3d_PluginObj.loadFabric(drapefabUrl, a_Group, parseFloat(fabWidth), parseFloat(fabHeight), function () {
        $('.last_drap_fab').text(designN);
        if ($('body').hasClass('q3dlite')) {
          saveSelectionClickOnFab();
        } else {
          const ThreeDImageId = $('.style_thumb li.active').attr('id');
          const fabName = $('#appendFabricList li.active .fabric_img').attr('id');
          fabName ? saveFabricDrapeCount(ThreeDImageId, fabName, true) : '';
          saveClickOnFabricInfo(designN);
          q3d_getProductFeature(Number(fabCode), designN);
        }

      });
      $('.fab_close3').css('display', 'none');
      $('.fab_search_input3').val('');
      $('.fab_search_icon3').css('display', 'block');
    } else {
      sweetalert_error("Design Not Found");
      $('.fab_close3').css('display', 'none');
      $('.fab_search_input3').val('');
      $('.fab_search_icon3').css('display', 'block');
    }
  }
}
//   const setProductNameEmpty = await fabricPluginObj.setProductLibrary('', false);
//   if(setProductNameEmpty){
//     fabricPluginObj.textSearch(result).then((resp) =>{
//     console.log(resp);
//     if(resp.designMaster.length > 0){
//       //$('#appendFabricList li.active').removeClass('active');
//       $('.fab_search_input3').val('');
//       $('.fab_close3').css('display', 'none');
//       $('.fab_search_icon3').css('display', 'block');
//       let fabUrl = resp.tempPath + 't/' + resp.designMaster[0].designCode +'t.jpg';
//       let drapefabUrl = q3dDrapingFile(fabUrl);
//       const fabSize = resp.designMaster[0].designSize.split(',');
//       const fabCode = resp.designMaster[0].designId;
//       const fabWidth=fabSize[0];
//       const fabHeight=fabSize[1];
//       const a_Group = configuration.q3d_display_groups ? parseInt($('#groupInfo .active').attr('groupno')) : 0;
//       lastFabricInfoSave(fabUrl, fabWidth, fabHeight, fabCode);
//       q3d_PluginObj.loadFabric(drapefabUrl, a_Group, parseFloat(fabWidth), parseFloat(fabHeight), function(){
//       $('.last_drap_fab').text(resp.designMaster[0].designCode);
//       const ThreeDImageId = $('.style_thumb li.active').attr('id');
//       const fabName = $('#appendFabricList li.active .fabric_img').attr('id');
//       fabName ? saveFabricDrapeCount(ThreeDImageId,fabName, true) : '' ;
//         saveClickOnFabricInfo(resp.designMaster[0].designCode);
//         q3d_getProductFeature(Number(fabCode), resp.designMaster[0].designCode);
//       });
//     } else {
//       sweetalert_error("Design Not Found");
//       $('.fab_close3').css('display', 'none');
//       $('.fab_search_input3').val('');
//     }
//   })
// }
export function rediretTryonToQ3dDrapeFabric(designName, designProductName, fabUrl, designId, designSize) {
  stopAllCameras();
  if (designName) {
    let currentDesignName = document.querySelector('[id="' + designName.trim() + '"]');
    if (currentDesignName) {
      if (currentDesignName.id == designName) {
        let index = currentDesignName.parentElement.parentElement.attributes.index.value;
        $('#appendFabricList li .fabric_thumb_wrap').eq(parseInt(index)).click();
      } else {
        tryOnDesignDrapeOnCurrentModel(designName, fabUrl, designId, designSize);
      }
    } else {
      tryOnDesignDrapeOnCurrentModel(designName, fabUrl, designId, designSize);
    }
  }
}

export function saveFabricDrapeCount(threedImgId, fabricName, qrscanCount) {
  if (qrscanCount) {
    let data = {
      qrcount: qrscanCount ? $('#appendFabricList li').length : 0
    }
    // commenting as per discussion with Kapil sir 06-10-2025
    // if (data.qrcount > 0) {
    //   clearTimeout(timeout)
    //   timeout = setTimeout(() => {
    //     saveFabCount(data, true)
    //   }, 10000)
    // }
    return;
  } else {
    let total = 0;
    currentFabricDrapeCount++;
    let modelDrapeCount = ModelwiseDrapeCount[threedImgId];
    if (modelDrapeCount) {
      let index = modelDrapeCount.totalLength;
      modelDrapeCount.totalLength += 1;
      modelDrapeCount[index] = fabricName;
    } else {
      ModelwiseDrapeCount[threedImgId] = {
        0: fabricName,
        totalLength: 1
      };
    }
    Object.values(ModelwiseDrapeCount).forEach((val) => { if (val.totalLength) total += val.totalLength })
    ModelwiseDrapeCount.TotalDrapeCount = total;
    var data = {
      count: ModelwiseDrapeCount.TotalDrapeCount
    }

    // commenting as per discussion with Kapil sir 06-10-2025
    // if (data.count > 0) {
    //   clearTimeout(timeOut)
    //   timeOut = setTimeout(() => {
    //     saveFabCount(data)
    //     data = {}
    //   }, 10000)
    // }
  }
}
export function getznerTechnicalSheet() {
  // ActiveDesignName = openFabricSheet((ActiveDesignName.split('-')[0]).toLowerCase());
  const activeImage = $('#appendFabricList li.active .fabric_img');
  const designName = activeImage.attr('id');
  const qrSupplierId = sessionStorage.getItem('qrSupplierId');
  if (!designName) {
    return sweetalert_error("Technical sheet not found for this design");
  }
  try {
    const orgData = qrScan
      ? JSON.parse(sessionStorage.getItem('jsonString'))
      : JSON.parse(sessionStorage.qrScanDataAuth);
    const orgId = parseInt(orgData.org_type_id || qrSupplierId);
    const encodedName = encodeURIComponent(designName).replace(/%20/g, "+");
    const pdfUrl = `${getznerTechFile}${orgId}/${encodedName}.pdf`;

    window.open(pdfUrl, '_blank');
  } catch (err) {
    sweetalert_error("Unable to load technical sheet. Please try again.");
    console.error(err);
  }
}

export async function getznerAppendInfo() {
  if ($('#getznerInfo').children().length == 0) {
    const info = await GetznerInfoData();
    appendGetznerInfoFeature(info);
  }
}

export function downloadPDF(data) {
  //console.log(data);
  let checkBoxData = data.parent().parent().children().children();
  let selectedId = data.attr('id');
  for (let index = 0; index < checkBoxData.length - 2; index++) {
    if ($($("div[id='" + selectedId + "'] .g_info_body input")[index]).prop('checked')) {
      let name = $($("div[id='" + selectedId + "'] .g_info_body input")[index]).siblings().text().trim();
      let url = getznerPdf + parseInt(JSON.parse(sessionStorage.jsonString).organisationId) + '/' + selectedId + '/' + name;
      downloadPDF1(url, name); //$('div[id="Hand Tag"]')
    }
  }
}
//************************************************************************************************** */
// Q3dLite TODO Working 17-10-2024 
// Q3dLite Working 
export function q3dLiteOpenFullview() {
  let img = $('#q3dLiteappendFabricList li.active .fab_img').attr('data-src');
  let updateImg = q3dFullviewImage(img);
  $(".fabric_fullview_img").css({ "background-image": "url(" + updateImg + ")" });
}
// Q3dLite Working 
export function q3dLiteChangeModel(currentSelection) {
  startBuffer();
  const prevthreeDImageId = $('#AppendAllStyle li.active').children().attr('modelid');
  let prevGroupName = activeDisplayGroupIndex(parseInt($('#AppendAllStyle li.active').children().attr('displaygroupindex')), prevthreeDImageId);
  $('#AppendAllStyle li.active').removeClass('active');
  currentSelection.parent().addClass('active');
  const currentThreeDImageId = $('#AppendAllStyle li.active').children().attr('modelid');
  appendProductGroup(currentThreeDImageId);
  let currentgroupName = activeDisplayGroupIndex(parseInt($('#AppendAllStyle li.active').children().attr('displaygroupindex')), currentThreeDImageId);
  if ($('body').hasClass('q3dlite') && !qrScan) {
    loadQ3dLiteThreeDImage();
  } else {
    if (prevGroupName.toLowerCase() != currentgroupName.toLowerCase()) {
      getFabricImageNameQ3dLite();
    } else {
      loadQ3dLiteThreeDImage();
    }
  }

}
// Q3dLite Working 
export function q3dLiteChangeFabric(currectselectFabrics) {
  startBuffer()
  $('#q3dLiteappendFabricList li.active').removeClass('active');
  currectselectFabrics.parent().addClass('active');
  let fabUrl = $('#q3dLiteappendFabricList li.active .fab_img').attr('data-src');

  if (fabUrl) {

    let designUrl = q3dDrapingFile(fabUrl);
    let fabricCode = $('#q3dLiteappendFabricList li.active').children().attr('designname');
    $('.last_drap_fab').text(fabricCode);
    let FabricSize = $('#q3dLiteappendFabricList li.active').children().attr('designsize').split(',');
    let FabricWidth = FabricSize[0];
    let fabricHeight = FabricSize[1];
    let groupOrderNumber = parseInt($('#groupInfo .group.active').attr('groupno'));
    //groupOrderNumber = groupOrderNumber == 0 ? 0 : groupOrderNumber - 1;
    q3d_PluginObj.loadFabric(designUrl, groupOrderNumber, parseFloat(FabricWidth), parseFloat(fabricHeight), function () {
      stopBuffer();
    });

  } else {
    stopBuffer();
  }
}
// Q3dLite Working 
export function q3dLiteCheckScrollBarPos() {
  if (qrScan) {
    if ($('#q3dLiteappendFabricList').children().length > 0) { //&& AllFabricData > fabStart //&& $('#q3dLiteappendFabricList li').length
      fabricPluginObj.loadMoreData().then((res) => { //fabStart
        AllFabricData = res['totalCount'];
        // $('.fabric_count span').text(`Count : ${AllFabricData}`);
        scrollGetFabric = true
        // startAppendFabric(res);
        let url = res.cachePath;
        appendQ3dLiteFabric(res.designMaster, url, undefined, 'Abc', true);
        //lazyLoadImg();
        //getLastImageDrape();
      });
    } else {
      // alert('fabric not more');
    }
  }
}
function q3dLitefabricdrapeOnModel() {
  let fabUrl = $('#q3dLiteappendFabricList li.active .fab_img').attr('data-src');
  if (fabUrl) {
    let designUrl = q3dDrapingFile(fabUrl);
    let fabricCode = $('#q3dLiteappendFabricList li.active').children().attr('designname');
    $('.last_drap_fab').text(fabricCode);
    let FabricSize = $('#q3dLiteappendFabricList li.active').children().attr('designsize').split(',');
    let FabricWidth = FabricSize[0];
    let fabricHeight = FabricSize[1];
    let groupOrderNumber = parseInt($('#groupInfo .group.active').attr('groupno'));
    //groupOrderNumber = groupOrderNumber == 0 ? 0 : groupOrderNumber - 1
    q3d_PluginObj.loadFabric(designUrl, groupOrderNumber, parseFloat(FabricWidth), parseFloat(fabricHeight), function () {
      stopBuffer();
    });
  } else {
    stopBuffer();
  }
}
// Q3dLite Working 
function loadFabricPluginQ3dLite(key) {
  const suppId = JSON.parse(sessionStorage.getItem('jsonString')).org_type_id
  const roleId = JSON.parse(sessionStorage.getItem('jsonString')).roleId
  const orgId = JSON.parse(sessionStorage.getItem('jsonString')).organisationId
  fabricPluginObj = new TdsFabric({
    Start: 0,
    SupplierId: suppId,
    OrgId: orgId, //1179106177,
    RoleId: roleId, //2665718983
    ServiceUrl: serviceUrl,
    MaxFabLimit: parseInt(configuration.q3d_show_fabrics),
    SortBy: getznerData.sortby ? getznerData.sortby : "IsDateDesc" //"IsNameAsc","IsNameDesc","IsDateDesc","IsDateAsc" 
  });
  // const res = await fabricPluginObj.getProductList()
  //appendFabricProductList(res);
  appendFabricCount = parseInt(configuration.q3d_show_fabrics);
  appendPTPGQ3dLite();
}
// Q3dLite Working 
function appendAllStyleQ3dLite(styleData) {
  let str = "";
  appendProductGroup(styleData[0][0].id);
  styleData.forEach((key, value) => {
    styleData[value].forEach((key1, value1) => {
      str += `<li>`
      str += `<div class="style_list_wrap" modelId=${styleData[value][value1].id} displayGroupIndex=${styleData[value][value1].displayGroupIndex}>`
      str += `<div class="style_list_img" isThreeDFlag ="${styleData[value][value1].isThreeD}">
                    <img class="img-thumbnail" loading="lazy" src="${styleData[value][value1].imgsrc}" alt="thumb">
                  </div>`
      str += `<div class="style_thumb_name">${styleData[value][value1].displayName}</div>`
      str += `</div>`
      str += `</li>`
    })
  });

  $(".style_thumb_list").empty().append(`<ul id ="AppendAllStyle">${str}</ul>`);
  $('#AppendAllStyle').addClass('active');
  $('#AppendAllStyle li:first').addClass('active');
}
// Q3dLite Working 
async function getFabricImageNameQ3dLite(className, textSearchFlag) {
  let passFunctionName = "";
  let activeThreeDimageId = parseInt($('#AppendAllStyle li.active').children().attr('modelId'));
  // console.log(activeThreeDimageId);
  let groupProductName = q3d_PluginObj.getGroups(activeThreeDimageId);
  // let groupDisplayIndex = parseInt($('#AppendAllStyle li.active').children().attr('displaygroupindex')) ? parseInt($('#AppendAllStyle li.active').children().attr('displaygroupindex')) - 1 : 0;
  // let loadProductLibrary = groupProductName[groupDisplayIndex].ProductName
  let loadProductLibrary = $('#groupInfo .group.active').attr('g_productname')

  const fabricMaster = await fabricPluginObj.setProductLibrary(loadProductLibrary);

  if (fabricMaster.designMaster.length > 0) {
    const dynamicUrl = fabricMaster.cachePath
    if (textSearchFlag) {
      passFunctionName = saveSelectionClickOnFab;
    } else {
      passFunctionName = className ? q3dLitefabricdrapeOnModel : loadQ3dLiteThreeDImage
    }
    appendQ3dLiteFabric(fabricMaster.designMaster, dynamicUrl, passFunctionName);
  } else {
    sweetalert_error('Upload a fabric to preview it on the available models.');
    $('#q3dLiteappendFabricList').empty();
    loadQ3dLiteThreeDImage();
    stopBuffer();
  }

}
// Q3dLite Working 
function loadQ3dLiteThreeDImage() {

  const threeDImageId = $('#AppendAllStyle li.active').children().attr('modelid');
  let fabricUrl = $('#q3dLiteappendFabricList li.active .fab_img').attr('data-src');

  if (fabricUrl) {

    fabricUrl = q3dDrapingFile(fabricUrl);
    let fabricCode = $('#q3dLiteappendFabricList li.active').children().attr('designname');
    $('.last_drap_fab').text(fabricCode);
    let FabricSize = $('#q3dLiteappendFabricList li.active').children().attr('designsize').split(',');
    let FabricWidth = FabricSize[0];
    let fabricHeight = FabricSize[1];
    let activeDisplayGroupIndex1 = "";
    const groupName = $('#groupInfo .active').attr('groupname') == 'All' ? 'ungrouped' : $('#groupInfo .active').attr('groupname');
    // let fabricGroupDrapeName= activeDisplayGroupIndex(parseInt($('#AppendAllStyle li.active').children().attr('displaygroupindex')), threeDImageId)

    q3d_PluginObj.loadThreeDImage(threeDImageId, fabricUrl, FabricWidth, fabricHeight, groupName, function () {
      stopBuffer()
    });

  } else {
    q3d_PluginObj.loadThreeDImage(threeDImageId, undefined, undefined, undefined, undefined, function () {
      stopBuffer()
    });
  }
}
// Q3dLite Working 
function activeDisplayGroupIndex(index, activeThreeDimageId) {
  let selectGroupData = q3d_PluginObj.getGroups(activeThreeDimageId)
  index = index == 0 ? 0 : index - 1;
  let GroupData = selectGroupData[index];
  if (GroupData.name == "All") {
    GroupData = selectGroupData[1];
    return GroupData.name;
  }
  return GroupData.name;
}
// Q3dLite Working 
function appendQ3dLiteFabric(fabricMater, dynamicUrl, callback, className, fabricEmptyAppend) {
  let fabricQ3dLiteTxt = "";
  let dynamicFinalUrl = dynamicUrl;
  fabricMater.forEach((key, value) => {
    fabricQ3dLiteTxt += `<li>`
    fabricQ3dLiteTxt += `<div class="fabric_list_wrap" id= "${fabricMater[value].designCode}" designId="${fabricMater[value].designId}" designProductName = "${fabricMater[value].products}" designName= "${fabricMater[value].designCode}" designSize="${fabricMater[value].designSize}">`
    dynamicFinalUrl = `${dynamicUrl}t/${fabricMater[value].designCode}t.jpg`
    fabricQ3dLiteTxt += `<div class="fab_img" style="background-image: url(${dynamicFinalUrl});" data-src="${dynamicFinalUrl}"> </div>`
    fabricQ3dLiteTxt += `<div class="fabric_info">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"></path>
                                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"></path>
                                  </svg>
                                </div>`
    fabricQ3dLiteTxt += `<div class="fab_thumb_name">${fabricMater[value].designCode}</div>`
    fabricQ3dLiteTxt += `</div>`
    fabricQ3dLiteTxt += `</li>`
  });
  if (fabricEmptyAppend) {
    $('.fabric_thumb_list #q3dLiteappendFabricList').append(fabricQ3dLiteTxt);
  } else {
    $('.fabric_thumb_list #q3dLiteappendFabricList').empty().append(fabricQ3dLiteTxt);
  }

  if (!className) {
    $($('#q3dLiteappendFabricList li')[0]).addClass('active');
  }
  lazyLoadImg(".fab_img");

  if (typeof (callback) === 'function') {
    callback();
  }
}

function q3dliteQrScanAppendFabric(fabricMater, dynamicUrl, className) {

  let fabricQ3dLiteTxt = "";
  let index = 0
  let dynamicFinalUrl = "";
  fabricMater.forEach((key, value) => {
    let dynamicUrl1 = (fabricMater[0].thumbImagePath).split('/t/')[0] + '/';
    index = $('#q3dLiteappendFabricList li').length == 0 ? value : $('#q3dLiteappendFabricList li').length + value
    fabricQ3dLiteTxt += `<li index=${index}>`
    fabricQ3dLiteTxt += `<div class="fabric_list_wrap" id= "${fabricMater[value].designAdvName}" designId="${fabricMater[value].designId}" designProductName = "${fabricMater[value].designProductName}" designName= "${fabricMater[value].designCode}" designSize="${fabricMater[value].designSize}">`
    dynamicFinalUrl = `${dynamicUrl1}t/${fabricMater[value].designAdvName}t.jpg`
    fabricQ3dLiteTxt += `<div class="fab_img" style="background-image: url(${dynamicFinalUrl});" data-src="${dynamicFinalUrl}"> </div>`
    fabricQ3dLiteTxt += `<div class="fabric_info">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"></path>
                                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"></path>
                                  </svg>
                                </div>`
    fabricQ3dLiteTxt += `<div class="fab_thumb_name">${fabricMater[value].designAdvName}</div>`
    fabricQ3dLiteTxt += `</div>`
    fabricQ3dLiteTxt += `</li>`
  });

  $('.fabric_thumb_list #q3dLiteappendFabricList').append(fabricQ3dLiteTxt);

  if (!className) {
    $($('#q3dLiteappendFabricList li')[0]).addClass('active');
  }

  lazyLoadImg(".fab_img");
  $('#q3dLiteappendFabricList li.active').removeClass('active');
  $('#q3dLiteappendFabricList li').eq(qrScanActiveImageIndex()).addClass('active');
}
//************************************************************************************************** */    
function containsNumber(str) {
  return /\d/.test(str); // \d matches any digit, and .test() checks for a match
}
function trimDesignNameByBarcode(designName) {
  let str = designName;//"F27845230423951185530001010325";
  let arr = str.split('');        // Convert the string to an array
  let spliced = arr.splice(parseInt(configuration.q3d_product_name.split(',')[0]), parseInt(configuration.q3d_product_name.split(',')[1])); // Splice from index 15 to 24 (10 characters)
  let result = spliced.join('');  // Join the array back into a string
  // Insert '-' at the 6th index of the result string (position 5 in the array)
  let resultArray = result.split('');  // Convert the result string to an array
  resultArray.splice(6, 0, '-');      // Insert '-' at the 6th index
  let finalResult = resultArray.join('');
  return finalResult;
}

function downloadPDF1(url, name) {
  $.ajax({
    url: url,
    xhrFields: {
      responseType: 'blob'
    },
    success: function (blob) {
      var link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = name;
      link.click();
    }
  });
}
function appendGetznerInfoFeature(info) {
  let infoFeature = "";
  let infoData = info.pdfDataDtos; //groupData
  (infoData).forEach((key, value) => {
    infoFeature += `<div class="info_wrap" id="${(infoData[value].groupData)}">`
    infoFeature += `<div class="col-md-12 g_info_head">`
    infoFeature += `<div class="g_info_name">${infoData[value].groupData}</div>`
    infoFeature += `<div class="g_info_arrow">`
    infoFeature += `<div class="arrow_down">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0  1 0-.708"></path>
                              </svg>
                          </div>`
    infoFeature += `<div class="arrow_up">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-up" viewBox="0 0 16 16">
                              <path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"></path>
                            </svg>
                          </div>`
    infoFeature += `</div>`
    infoFeature += `</div>`
    infoFeature += `<div class="col-md-12 g_info_body">`
    for (let index = 0; index < infoData[value].pdfNames.length; index++) {
      infoFeature += `<div class="info_checklist_wrap">`
      infoFeature += `<div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="">
                        <label class="form-check-label" for="Color-3121515480"> ${infoData[value].pdfNames[index]} </label>
                      </div>`
      infoFeature += `</div>`

    }
    infoFeature += `<div class="info_download_btn">`
    infoFeature += `<div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" key="Color" id="${infoData[value].groupData}">
                    <label class="form-check-label" for="Color-3121515480"> Select All </label>
                    </div>`
    infoFeature += `<button type="button" class="btn download_pdf_info" id="${infoData[value].groupData}">Download</button>`
    infoFeature += `</div>`
    infoFeature += `</div>`
    infoFeature += `</div>`
  });
  $('#getznerInfo').empty().append(infoFeature);
}

function GetznerInfoData() {
  var res = undefined;
  let orgnizationId = !qrScan ? JSON.parse(sessionStorage.qrScanDataAuth).organisationId : JSON.parse(sessionStorage.jsonString).organisationId;;
  var url = serviceUrl + '/api/Configuration/GetPdfData?OrganisationId=' + orgnizationId;
  return new Promise((resolve) => {
    $.ajax({
      url: url,
      type: "GET",
      dataType: "json",
      async: true,
    }).done(function (r) {
      resolve(r);
    }).fail(function (jqXhr, textStatus, errorThrown) {
      console.log("error while getProductFeatures");
    });
  })
}

function tryOnDesignDrapeOnCurrentModel(designName, fabUrl, designId, designSize) {

  let drapefabUrl = fabUrl + 't/' + designName + 't.jpg';
  drapefabUrl = q3dDrapingFile(drapefabUrl);
  let drapeDesignSize = designSize.split(',');
  let width = drapeDesignSize[0];
  let height = drapeDesignSize[1];

  let groupOrderNumber = configuration.q3d_display_groups ? parseInt($('#groupInfo .active').attr('groupno')) : 0;;
  q3d_PluginObj.loadFabric(drapefabUrl, groupOrderNumber, parseFloat(width), parseFloat(height), function () {
    stopBuffer();
  });

  $('.last_drap_fab').text(designName);
  saveClickOnFabricInfo(designName);
  lastFabricInfoSave(drapefabUrl, width, height, designName);
}

export function tryonSaveImagedata(response) {
  let url = response[0].thumbImagePath;
  let designSize = response[0].designSize.split(',')
  let width = designSize[0];
  let height = designSize[1];
  let designName = response[0].designAdvName;
  lastFabricInfoSave(url, width, height, designName);
}
//tanmay Added GetznerImp
function checkGetznerlogin() {
  let domainName = window.location.origin;
  domainName = (domainName.split('//')[1]).split('.')[0];
  // let domainName = "getznercf"
  let domainNameList = ["getzner", "getznercf", "getznermtm", "getznertech"];
  if (domainNameList.includes(domainName)) {
    if (domainName.toLowerCase() == "getzner") {
      getznerData = getzner
    } else if (domainName.toLowerCase() == "getznercf") {
      getznerData = getznercf
      document.getElementById("season_name").textContent = "comfort Collection";
    } else if (domainName.toLowerCase() == "getznermtm") {
      getznerData = getznermtm
      document.getElementById("season_name").textContent = "made to measure Collection";
    } else if (domainName.toLowerCase() == "getznertech") {
      getznerData = getznertech
      document.getElementById("season_name").textContent = "technics Collection";
    }
    //console.log(domainName)
  }
}

function openFabricSheet(sheetTypeN) {
  var sheetPdfName = false;
  switch (sheetTypeN) {
    case "achim":
      sheetPdfName = 'Achim_ST_art.702.pdf';
      break;
    case "alan":
      sheetPdfName = 'Alan_ST_ELX_art.390.pdf';
      break;
    case "aldo":
      sheetPdfName = 'Aldo_ST_art.795.pdf';
      break;
    case "aletta":
      sheetPdfName = 'Aletta_ST_art.301.pdf';
      break;
    case "arik":
      sheetPdfName = 'Arik ST_ELX_art.396.pdf';
      break;
    case "arosa":
      sheetPdfName = 'Arosa_art.706.pdf';
      break;
    case "bolton":
      sheetPdfName = 'BoltonTEN_art.395.pdf';
      break;
    case "bristol":
      sheetPdfName = 'Bristol_TEN_art.393.pdf';
      break;
    case "colonel":
      sheetPdfName = 'Colonel_ST_art. 328.pdf';
      break;
    case "don":
      sheetPdfName = 'Don_ST_art.581.pdf';
      break;
    case "ellis":
      sheetPdfName = 'Ellis_ORG_art.576.pdf';
      break;
    case "ferrara":
      sheetPdfName = 'Ferrara_ST_art.323.pdf';
      break;
    case "fides":
      sheetPdfName = 'Fides_ST_COL_art.471.pdf';
      break;
    case "guido":
      sheetPdfName = 'Guido_ORG_art.645.pdf';
      break;
    case "hendrik":
      sheetPdfName = 'Hendrik_art.330.pdf';
      break;
    case "h":
      sheetPdfName = 'Herning_I_art.561.pdf';
      break;
    case "jamie":
      sheetPdfName = 'Jamie_ST_art.333.pdf';
      break;
    case "kampala":
      sheetPdfName = 'Kampala_ST_art.309.pdf';
      break;
    case "kenos":
      sheetPdfName = 'Kenos_ST_art.300.pdf';
      break;
    case "kuiper":
      sheetPdfName = 'Kuiper_ST_art.347.pdf';
      break;
    case "maarten":
      sheetPdfName = 'Maarten COS_art.519.pdf';
      break;
    case "manto":
      sheetPdfName = 'Manto_ST_art.346.pdf';
      break;
    case "master":
      sheetPdfName = 'Master ST_ DAF art.715.pdf';
      break;
    case "matthias":
      sheetPdfName = 'Matthias_ORG_art.718 COL.pdf';
      break;
    case "padua":
      sheetPdfName = 'Padua_ELX_art.359.pdf';
      break;
    case "percy":
      sheetPdfName = 'Percy_art.324.pdf';
      break;
    case "pescara":
      sheetPdfName = 'Pescara_ST_art.335.pdf';
      break;
    case "pierrot":
      sheetPdfName = 'Pierrot_CLA_art.641.pdf';
      break;
    case "pisa":
      sheetPdfName = 'Pisa_art.357.pdf';
      break;
    case "roddy":
      sheetPdfName = 'Roddy_ST_art.310.pdf';
      break;
    case "sapporo":
      sheetPdfName = 'Sapporo SCL_art.759.pdf';
      break;
    case "scout":
      sheetPdfName = 'Scout_ST_art.337.pdf';
      break;
    case "smart200":
      sheetPdfName = 'Smart200_ST_art.348.pdf';
      break;
    case "smartcel":
      sheetPdfName = 'Smartcel_ST_art.334.pdf';
      break;
    case "triest":
      sheetPdfName = 'Triest_I_art.345.pdf';
      break;
    case "tristan":
      sheetPdfName = 'Tristan_art.585.pdf';
      break;
    case "turin":
      sheetPdfName = 'Turin_art.741.pdf';
      break;
    case "udine":
      sheetPdfName = 'Udine_art.755.pdf';
      break;
    case "udo":
      sheetPdfName = 'Udo_art.783.pdf';
      break;
    case "ulf":
      sheetPdfName = 'Ulf_art.791.pdf';
      break;
    case "venus":
      sheetPdfName = 'Venus_ST_art.306.pdf';
      break;
    default:
      sheetPdfName = false;
      break;
  }
  return sheetPdfName;
}

function saveFabCount(data, isData) {
  const payload = new Object();
  payload.td_organisation_id = !qrScan ? JSON.parse(sessionStorage.qrScanDataAuth).organisationId : JSON.parse(sessionStorage.jsonString).organisationId;
  payload.td_render_count = isData ? 0 : data.count;
  payload.td_QrScanCount = isData ? data.qrcount : 0;
  const MethodUrl = serviceUrl + '/api/Configuration/' + 'SaveRenderData';
  try {
    $.ajax({
      url: MethodUrl,
      type: "POST",
      contentType: 'application/json',
      data: JSON.stringify(payload),
      async: true,
    }).done(function (r) {
      if (r) {
        currentFabricDrapeCount = 0
        ModelwiseDrapeCount = {}
        //console.log(r)
        if (r.remainingCount < 0) {

          // $('#common_notification').show();
          // $('#common_notification').text('Fabric Rendering count exceeded. Kindly upgrade your subscription plan!!');

          setTimeout(() => {
            $('#common_notification').hide();
          }, 3000);

        }
      }
      else {
        sweetalert_error("failed to save Drape count")
      }
    }).fail(function (jqXhr, textStatus, errorThrown) {
      console.log("error while Save Drape Count");
    });
  } catch (err) {
    console.log(err);
  }
}

function lastFabricInfoSave(faburl, width, height, designCode) {

  lastFabricInfo = {};
  lastFabricInfo = new Object();
  lastFabricInfo.t_fabUrl = faburl.replaceAll('/t/', '/t/').replaceAll('t.jpg', 't.jpg');
  lastFabricInfo.b_fabUrl = faburl.replaceAll('/t/', '/b/').replaceAll('t.jpg', 'b.jpg');
  lastFabricInfo.z_fabUrl = faburl.replaceAll('/t/', '/z/').replaceAll('t.jpg', 'z.jpg');
  lastFabricInfo.width = width;
  lastFabricInfo.height = height;  // 3. Store fabric dimensions
  lastFabricInfo.designCode = designCode;
  window.lastFabricInfo = lastFabricInfo;    // Make it globally accessible


}

function isMobile() {
  if (window.screen.width < 576) {
    return true;
  }
}

function setPositonScrollbar() {
  let totalFab = $('#appendFabricList li').length
  let activeFab = $('#appendFabricList li.active').attr('index');
  let className = document.getElementById('appendFabricList');
  let clientHeight, scrollHeight, totalScrollHeight, oneFabricSizeAllow, scrollTopPos = 0
  if (!isdeskStop()) {
    if ($('.fabric_exp_red').length > 0) {
      clientHeight = className.clientHeight;
      scrollHeight = className.scrollHeight;
      totalScrollHeight = scrollHeight - clientHeight;
      oneFabricSizeAllow = totalScrollHeight / totalFab;
      scrollTopPos = oneFabricSizeAllow * Number(activeFab);
      $('#appendFabricList').scrollTop(scrollTopPos);
    } else {
      clientHeight = className.clientWidth;
      scrollHeight = className.scrollWidth;
      totalScrollHeight = scrollHeight - clientHeight;
      oneFabricSizeAllow = totalScrollHeight / totalFab;
      scrollTopPos = oneFabricSizeAllow * Number(activeFab);
      $('#appendFabricList').scrollLeft(scrollTopPos);
    }
  } else {
    clientHeight = className.clientHeight;
    scrollHeight = className.scrollHeight;
    totalScrollHeight = scrollHeight - clientHeight;
    oneFabricSizeAllow = totalScrollHeight / totalFab;
    scrollTopPos = oneFabricSizeAllow * Number(activeFab);
    $('#appendFabricList').scrollTop(scrollTopPos);
  }
}

function drapOnFabricSelectedGroup() {
  if (configuration.q3d_drape_first_fabric) {
    if ($('#appendFabricList li.active').length == 0) {
      $('#appendFabricList li.active').removeClass('active');
      $('#appendFabricList li:first').addClass('active');
    }
    resetSlider();
    //resetTextureoperation();
    q3d_getProductFeature(Number($('#appendFabricList li.active .fabric_thumb_wrap').attr('designid')));
    const groupOrderNumber = configuration.q3d_display_groups ? parseInt($('#groupInfo .active').attr('groupno')) : 0;
    let designUrl = $('#appendFabricList li.active .fabric_img').attr('data-src');
    if (designUrl) {

      designUrl = q3dDrapingFile(designUrl);
      const designData = $('#appendFabricList li.active .fabric_img').attr('designsize').split(',');
      const designheight = designData[1];
      const designwidth = designData[0];
      const designCode = $('#appendFabricList li.active .fabric_img').attr('id');
      lastFabricInfoSave($('#appendFabricList li.active .fabric_img').attr('data-src'), designwidth, designheight, designCode);

      q3d_PluginObj.loadFabric(designUrl, groupOrderNumber, parseFloat(designwidth), parseFloat(designheight), function () {
        stopBuffer();
      });

      $('.last_drap_fab').text(designCode);
      const ThreeDImageId = $('.style_thumb li.active').attr('id');
      const fabName = $('#appendFabricList li.active .fabric_img').attr('id');
      fabName ? saveFabricDrapeCount(ThreeDImageId, fabName) : '';
    } else {
      stopBuffer();
    }
  } else {
    stopBuffer();
  }
}

function fabViseSelectionNumber(fabName) {
  for (let i = 0; i < $('#fabricList li').length; i++) {
    if ($($('#fabricList li')[i]).children().text().toLowerCase() == fabName.toLowerCase()) {
      return i;
    }
  }
}

function updatePasswordPayload() {
  let data = new Object();
  data.state = 2;
  data.user_id = JSON.parse(sessionStorage.jsonString).userid;
  data.password_hash = $('#inputPassword2').val().trim();
  return data;
}

function validatePassword() {
  if ($('#inputPassword1').val().trim() == JSON.parse(sessionStorage.currentUserPass).trim()) {
    if ($('#inputPassword2').val().trim() != "" && $('#inputPassword3').val().trim() != "") {
      if ($('#inputPassword2').val().trim() == $('#inputPassword3').val().trim()) {
        return true;
      } else {
        $('.currentpass').show();
        return false;
      }
    } else {
      $('.newpass').show();
    }
  } else {
    $('.oldpass').show();
    return false;
  }
}

function validateprofileData(data) {

  var res = true;
  var emailFlag = '.invalid';
  var mobileFlag = '.invalid';
  var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; //emailid pattern
  var mobilePattern = /^[6-9]\d{9}$/;  // Indian mobile number pattern

  (data.user_id != "" && res != false) ? res = true : res = false;
  (data.first_name != "" && res != false) ? res = true : res = false;
  (data.last_name != "" && res != false) ? res = true : res = false;

  //functio generated by seema console.log('test'+q3d_PluginObj.accessRightAll(34));
  if (!emailPattern.test(data.email)) {
    res = false;
    emailFlag = '.invalid-email';
  }
  if (!mobilePattern.test(data.mobile)) {
    res = false;
    mobileFlag = '.invalid-mobile';
  }

  let dataRes = [
    res,
    emailFlag,
    mobileFlag
  ];

  return dataRes;
}

function payloadProfiledata() {
  let data = new Object();
  data.user_id = JSON.parse(sessionStorage.jsonString).userid.toString();
  data.first_name = $('#validationDefault01').val();
  data.last_name = $('#validationDefault02').val();
  data.email = $('#validationDefault04').val();
  data.mobile = $('#validationDefault05').val();
  data.org_id = JSON.parse(sessionStorage.jsonString).organisationId;
  data.org_user_imagebyte = $('.profile_img > img').attr('src').split(',')[1];
  return data;
}

function saveClickOnFabricInfo(designName) {
  $('#appendFabricList li.active').removeClass('active')
  const fabName = $('.last_drap_fab').text();//$('.fab_features_name').text() == "" ? $('.last_drap_fab').text() :  $('.last_drap_fab').text();
  const Element = document.querySelector('[id="' + fabName.trim() + '"]');
  Element ? Element.parentElement.parentElement.classList.add('active') : '';
}

function saveSelectionClickOnFab() {
  $('#q3dLiteappendFabricList li.active').removeClass('active')
  const fabName = $('.last_drap_fab').text();
  const Element = document.querySelector('[id="' + fabName.trim() + '"]');
  Element ? Element.parentElement.classList.add('active') : '';
}

function displayNextPrevBtn(index, fabWrapper = $('#appendFabricList li')) {

  if (parseInt(index) + 1 == 1 && parseInt(index) + 1 == fabWrapper.length)    //Together → This condition is true only if there is exactly one fabric in the list. 
  {
    if ($('#fabric_fullview').css('display') == 'block') {
      $('.fullview_next_fabric').css('visibility', 'hidden'); // if only one fabric is available, hide the "Next" and "Previous" buttons because navigation is pointless.
      $('.fullview_prev_fabric').css('visibility', 'hidden');
    } else {
      $('.next_fabric').css('visibility', 'hidden');
      $('.prev_fabric').css('visibility', 'hidden');
    }

  } else if (parseInt(index) + 1 > 1 && parseInt(index) + 1 < fabWrapper.length) {
    if ($('#fabric_fullview').css('display') == 'block') {
      $('.fullview_next_fabric').css('visibility', 'visible');  //Both Next and Prev buttons are set to visible, so user can move in both directions.
      $('.fullview_prev_fabric').css('visibility', 'visible');
    } else {
      $('.next_fabric').css('visibility', 'visible');
      $('.prev_fabric').css('visibility', 'visible');
    }
  } else if (parseInt(index) + 1 > 1 && parseInt(index) + 1 >= fabWrapper.length) {
    if ($('#fabric_fullview').css('display') == 'block') {
      $('.fullview_next_fabric').css('visibility', 'hidden');
      $('.fullview_prev_fabric').css('visibility', 'visible');
    } else {
      $('.next_fabric').css('visibility', 'hidden');
      $('.prev_fabric').css('visibility', 'visible');
    }
  } else if (parseInt(index) + 1 == 1 && parseInt(index) + 1 < fabWrapper.length) {
    if ($('#fabric_fullview').css('display') == 'block') {
      $('.fullview_next_fabric').css('visibility', 'visible');
      $('.fullview_prev_fabric').css('visibility', 'hidden');
    } else {
      $('.next_fabric').css('visibility', 'visible');
      $('.prev_fabric').css('visibility', 'hidden');
    }
  }

}

//service Api call
function getProductFeature(designId) {
  var res = undefined;
  var url = serviceUrl + '/api/Configuration/GetConfigureThumbDisplayParameters?DesignId=' + designId;
  return new Promise((resolve) => {
    $.ajax({
      url: url,
      type: "GET",
      dataType: "json",
      async: true,
    }).done(function (r) {
      resolve(r);
    }).fail(function (jqXhr, textStatus, errorThrown) {
      console.log("error while getProductFeatures");
    });
  })
}

function getQrScanDesignData(designName, supplierId) {
  const payload = {
    "supplierId": supplierId,
    "deviceloginId": getUniqueId(),
    "c": "b",
    "designNames": [designName.replaceAll("%20", " ")],
    "isGetzner": serviceUrl.includes('gpv') ? true : false
  }

  var url = serviceUrl + '/api/Configuration/QRScan_Q3D';
  return new Promise((resolve) => {
    $.ajax({
      url: url,
      type: "POST",
      contentType: 'application/json',
      data: JSON.stringify(payload),
      async: true,
    }).done(function (r) {
      resolve(r);
    }).fail(function (jqXhr, textStatus, errorThrown) {
      console.log("error while getQrScanDesignData");
    });
  })
}
function fullviewAppendProductFeature(productFeaturedata) {
  let length = Object.keys(productFeaturedata).length;
  let productFeature = "";
  productFeature = `<div class="fabric_properties_name"> <h5>${$('#appendFabricList li.active .fabric_name').text()}</h5> </div>`
  productFeature += `<table class="table">`
  productFeature += `<tbody>`
  Object.keys(productFeaturedata).forEach((index, value) => {
    productFeature += `<tr>`
    productFeature += `<th>${index}</th>`
    productFeature += `<td>`
    productFeature += `<div class="value_wrap">`
    productFeature += `<span></span>${productFeaturedata[Object.keys(productFeaturedata)[value]]}`
    productFeature += `</div>`
    productFeature += `</td>`
    productFeature += `</tr>`
  });
  productFeature += `</tbody>`
  productFeature += `</table>`

  $('.fabric_properties_body').empty().append(productFeature);
}

function uniqueImageLoad(previousDesign, currentDesign) {
  const current = []
  var checkReapet = false;
  for (let i = 0; i < currentDesign.length; i++) { //
    for (let j = 0; j < Object.keys(previousDesign).length; j++) {
      if (previousDesign[j].designId == currentDesign[i].designId) {
        checkReapet = true;
      }
    }
    if (!checkReapet) {
      current.push(currentDesign[i]);
    } else {
      checkReapet = false;
    }
  }
  return current;
}

function qrScanTextSearch(url) {
  startBuffer();
  let deviceloginId = getUniqueId();
  let MethodUrl = serviceUrl + "/api/Configuration/QRScan_Q3D"
  let suppAndDesignName = getSupplierIdDesignName(url);
  var data1 = {
    "supplierId": suppAndDesignName.supp_id,
    "deviceloginId": deviceloginId,
    "c": "b",
    "designNames": suppAndDesignName.des_Name,
    "isGetzner": serviceUrl.includes('gpv') ? true : false
  }

  $.ajax({
    url: MethodUrl,
    type: "POST",
    contentType: 'application/json',
    data: JSON.stringify(data1),
    async: false,
  }).done(function (r) {
    if (r.loadProductsByFabricResponseDto !== null) {
      resetTextSearch();
      q3d_QrScanData(r.loadProductsByFabricResponseDto);
      appendProductFeature(r.loadProductsByFabricResponseDto[0].designFeature);
      if (r.loadProductsByFabricResponseDto.length >= 1 && $('#appendFabricList li').length > 1) {
        let index = Number($('#appendFabricList li.active').attr('index'));
        displayNextPrevBtn(index);
      }
      qrScanFabricDrapeOnModel();
      $('.fab_close3').css('display', 'none');
      $('.fab_search_icon3').css('display', 'block');
      $('.fab_search_input3').val('');
    } else {
      sweetalert_error('Design not found');
      $('.fab_close3').css('display', 'none');
      $('.fab_search_icon3').css('display', 'block');
      $('.fab_search_input3').val('');
      stopBuffer();
      // sessionStorage.removeItem('userLog');
      // var domainName = window.location.origin;
      // window.history.pushState('','',domainName);
      // window.location.reload();
    }
  }).fail(function (jqXhr, textStatus, errorThrown) {
    console.error();
    sweetalert_error('Design not found');
    $('.fab_close3').css('display', 'none');
    $('.fab_search_icon3').css('display', 'block');
    $('.fab_search_input3').val('');
    stopBuffer();
  });
}

function qrScanFabricDrapeOnModel() {
  if ($('body').hasClass('q3dlite')) {
    let ActiveImage = q3dDrapingFile($("#q3dLiteappendFabricList li.active .fab_img").attr('data-src'));
    let ActiveGroupNumber = configuration.q3d_display_groups ? parseInt($('#groupInfo .active').attr('groupno')) : 0;
    let ActiveImageSize = $("#q3dLiteappendFabricList li.active .fabric_list_wrap").attr('designsize').split(',');
    let imageWidth = ActiveImageSize[0];
    let imageHeight = ActiveImageSize[1];
    const designCode = $("#q3dLiteappendFabricList li.active .fabric_list_wrap").attr('id');
    lastFabricInfoSave(ActiveImage, imageWidth, imageHeight, designCode);
    q3d_PluginObj.loadFabric(ActiveImage, ActiveGroupNumber, parseFloat(imageWidth), parseFloat(imageHeight), function () {
      stopBuffer();
    });
    $('.last_drap_fab').text($("#q3dLiteappendFabricList li.active .fabric_list_wrap").attr('id'));
    // const ThreeDImageId = $('.style_thumb li.active').attr('id');
    // const fabName = $("#appendFabricList li.active .fabric_list_wrap").attr('id');
    // fabName ? saveFabricDrapeCount(ThreeDImageId,fabName, true) : '' ;
    // $('.fabric_count span').text(`Count : ${$('#appendFabricList li').length}`);
  } else {
    let ActiveImage = q3dDrapingFile($("#appendFabricList li.active .fabric_img").attr('data-src'));
    let ActiveGroupNumber = configuration.q3d_display_groups ? parseInt($('#groupInfo .active').attr('groupno')) : 0;
    let ActiveImageSize = $("#appendFabricList li.active .fabric_img").attr('designsize').split(',');
    let imageWidth = ActiveImageSize[0];
    let imageHeight = ActiveImageSize[1];
    const designCode = $('#appendFabricList li.active .fabric_img').attr('id');
    lastFabricInfoSave(ActiveImage, imageWidth, imageHeight, designCode);
    q3d_PluginObj.loadFabric(ActiveImage, ActiveGroupNumber, parseFloat(imageWidth), parseFloat(imageHeight), function () {
      stopBuffer();
    });
    $('.last_drap_fab').text($('#appendFabricList li.active .fabric_img').attr('id'));
    const ThreeDImageId = $('.style_thumb li.active').attr('id');
    const fabName = $('#appendFabricList li.active .fabric_img').attr('id');
    fabName ? saveFabricDrapeCount(ThreeDImageId, fabName, true) : '';
    $('.fabric_count span').text(`Count : ${$('#appendFabricList li').length}`);
  }

}

function qrScanAppendFabric(allQrScanDesign) {
  let FabricImgTxt = "";
  let index = 0;
  allQrScanDesign.forEach((index, value) => {
    index = $('#appendFabricList li').length == 0 ? value : $('#appendFabricList li').length + value//TO Do Working
    FabricImgTxt += `<li index="${index}">`
    FabricImgTxt += `<div class="fabric_thumb_wrap" designId=${allQrScanDesign[value].designId}>`
    FabricImgTxt += `<div class="fabric_img" id ="${allQrScanDesign[value].designAdvName}"
                      data-src = "${allQrScanDesign[value].thumbImagePath.replaceAll(' ', '%20').replaceAll('(', '%28').replaceAll(')', '%29')}" designSize=${allQrScanDesign[value].designSize}> </div>`
    FabricImgTxt += `<div class="fabric_info" id=${allQrScanDesign[value].designAdvName}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                      class="bi bi-info-circle" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                      <path
                      d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                      </svg> 
                    <!-- <img class=lazy loading="lazy" data-src="https://dam3d.in/q3d/images/info_Icon.png" alt="fabric info image">-->
                    </div>`
    FabricImgTxt += `<div class="fabric_name">${allQrScanDesign[value].designAdvName}</div>`
    FabricImgTxt += `</div>`
    FabricImgTxt += `</li>`
  });
  $('#appendFabricList').append(FabricImgTxt);
  $('#appendFabricList li.active').removeClass('active');
  $('#appendFabricList li').eq(qrScanActiveImageIndex()).addClass('active');

}

function filterSearchData(filterDataObj) {
  fabricPluginObj.filterSearch(filterDataObj).then((res) => {
    $('#appendFabricList').empty();
    if (res.totalCount != 0) {
      if (res.designMaster.length > 1) {
        $('.next_fabric').css('visibility', 'visible');
      } else {
        $('.next_fabric').css('visibility', 'hidden');
        $('.prev_fabric').css('visibility', 'hidden');
      }
      filterSearchFab = true;
      textSearchD = '';
      AllFabricData = res['totalCount'];
      $('.fabric_count span').text(`Count : ${AllFabricData}`);
      startAppendFabric(res);
      lazyLoadImg();
      getLastImageDrape();
    } else {
      // alert('Design Not Found');
      q3d_resetFilter()
    }
  })
}

function q3d_fabric_to_modelChange() {
  for (let index = 0; index < $(".style_lib li").length; index++) {
    if ($($(".style_lib li")[index]).attr('fab-product').toLowerCase() == $('#fabricList li.active').children().text().toLowerCase())
      $($(".style_lib li")[index]).click();
  }
}

function appendProdutAndGroupList(ptpgData) {
  let ptpgtext = "";
  let ptpg = ptpgData.allDesignTypesByRoles;
  ptpg.forEach((index, value) => {
    ptpg[value].getDesignGroupsByRoleListDto.forEach((index1, value1) => {
      ptpgtext += `<li design_type_id="${ptpg[value].design_type_id}" design_groups_id=${ptpg[value].getDesignGroupsByRoleListDto[value1].design_groups_id}>`
      ptpgtext += `<a class="dropdown-item" groupName= "${ptpg[value].getDesignGroupsByRoleListDto[value1].design_groups_name}" href="#">${ptpg[value].design_type_name}-${ptpg[value].getDesignGroupsByRoleListDto[value1].design_groups_name}</a>`
      ptpgtext += `</li>` //design_groups_name

    });
  });
  $('.group_by_dropdown ul').empty().append(ptpgtext);
  $('.group_by_dropdown ul li:first').addClass('active');
  //Working in Progress 03-08-2024 
  if ($('.group_by_dropdown ul li').length == 1) {
    $('.sorting_dropdown').css('display', 'none');
    $('.single_sort_search').addClass('active');
  }
}

function qrScanActiveImageIndex() {
  let count = 0
  if (isCheckDesignExist)
    for (let index = 0; index < Object.keys(allQrDesignData).length; index++) {
      if (allQrDesignData[index].designId == qrDesignRespData[0].designId) {
        count = index;
        return count;
      }
    } else {
    count = allQrDesignData.length - allQrScanDesign.length
    return count;
  }
}

function resetTextSearch() {
  if (!isredirect) {
    if ($('body').hasClass('q3dlite')) {
      $('#q3dLiteappendFabricList').empty();
      getFabricImageNameQ3dLite('q3dlite', 'resetTextSearch');
    } else {
      $('#appendFabricList').empty();
      const activeDesignListName = $('.btn_fabric_lib b').text();
      appendFabric(activeDesignListName, {});
    }

  } else {
    $('.fab_search').val('');
    $('.fab_close').css('display', 'none');
    $('.fab_search1').css('display', 'block');
  }

}

function textSearch(result) {
  fabricPluginObj.textSearch(result).then((resp) => {
    if (resp.designMaster.length != 0) {
      if (resp.designMaster.length > 1) {
        $('.next_fabric').css('visibility', 'visible');
      } else {
        $('.next_fabric').css('visibility', 'hidden');
        $('.prev_fabric').css('visibility', 'hidden');
      }
      if ($('body').hasClass('q3dlite')) {
        $('#q3dLiteappendFabricList').empty()
        let dynamicUrl = resp.cachePath;
        appendQ3dLiteFabric(resp.designMaster, dynamicUrl, undefined, "q3dLite");
      } else {
        startAppendFabric(resp);
        $('.fabric_count span').text(`Count : ${resp.totalCount}`);
        lazyLoadImg();
        getLastImageDrape();
      }
    } else {
      $('.fabric_count span').text(`Count : ${0}`);
      sweetalert_error('Design Not Found');
    }


  })
}

function getFeatureTypeAppend(featureData) {
  let featurelist = '';
  featureData.forEach((index, value) => {
    featurelist += `<div class="filter_wrap">`
    featurelist += `<div class="col-md-12 header_options">`
    featurelist += `<div class="option_name">${featureData[value].design_feature_name}</div>`
    featurelist += `<div class="option_arrow">`
    featurelist += `<div class="arrow_down">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0  1 0-.708" />
                      </svg>
                    </div>`
    featurelist += `<div class="arrow_up">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-up" viewBox="0 0 16 16" >
                        <path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z" />
                      </svg>
                    </div>`
    featurelist += `</div>`
    featurelist += `</div>`
    featurelist += `<div class="col-md-12 options_body">`
    featureData[value].featureTypeList.forEach((num1, num2) => {

      featurelist += `<div class="form-check">
                      <input class="form-check-input" type="checkbox" value="${featureData[value].featureTypeList[num2].design_featuretype_name}" key="${featureData[value].design_feature_name}" id="${featureData[value].design_feature_name}-${featureData[value].featureTypeList[num2].design_featuretype_id}"/>
                      <label class="form-check-label" for="${featureData[value].design_feature_name}-${featureData[value].featureTypeList[num2].design_featuretype_id}"> ${featureData[value].featureTypeList[num2].design_featuretype_name} </label>
                    </div>`
    })
    featurelist += `</div>`
    featurelist += `</div>`
  });
  $('#filter_popup .filter_body .row').empty().append(featurelist);


}

function clientLogoCalc(canvasWidth, canvasheight, logoWidth, logoHeight) {

  let A4SizeW = 8.25 // standard print page width a4 size in inch
  let A4SizeH = 11.69 // standard print page height a4 size in inch

  //let canvasWidth = c.width;
  // let canvasheight = c.height;

  let canvasDpi = Math.max(canvasWidth, canvasheight) / Math.max(A4SizeH, A4SizeW)

  let minLogoSize = Math.min(logoWidth, logoHeight)

  let MinRequieredLogo = 0.50  // minimum logo size in inch  

  let logoDpi = logoHeight / MinRequieredLogo;
  let aspRat = logoWidth / logoHeight
  if (logoHeight > logoWidth) {
    var newLogoW = MinRequieredLogo
    var newLogoH = newLogoW / aspRat;
  }

  else {
    var newLogoH = MinRequieredLogo
    var newLogoW = newLogoH * aspRat;
  }
  // let newLogoW = ( logoWidth / logoHeight ) * MinRequieredLogo;
  //  let newLogoH = (logoHeight / minLogoSize) * MinRequieredLogo
  let newLogoWpx = canvasDpi * newLogoW;
  let newLogoHpx = canvasDpi * newLogoH

  return [newLogoWpx, newLogoHpx]
}

function appendProductGroup(id) {   // This function is responsible for building and displaying product groups (like sleeves, collars, pockets, etc.)

  if (configuration.q3d_display_groups) { //configuration.q3d_display_groups

    let groupList = q3d_PluginObj.getGroups(id);  //retrieves all groups for the given model ID.
    let updateGroupList = groupAppend(groupList);
    let groupText = "";

    for (let group_data in updateGroupList) {
      groupText += `<div  class="group" groupNo=${group_data} g_ProductName="${updateGroupList[group_data].ProductName
        }"  groupName="${updateGroupList[group_data].name}"  data-bs-toggle="tooltip" data-bs-placement="right" title=${updateGroupList[group_data].name}>`;
      groupText += `<img class="group_img" src="${updateGroupList[group_data].imgsrc.replaceAll(" ", "%20")}" alt="product-group-image">`
      groupText += `</div>`
    }

    $('#groupInfo').empty().append(groupText);

    if (updateGroupList !== undefined) {
      if ($('.style_thumb ul li.active').attr('defaultgroup') == undefined) {
        let productName = "";
        if (!qrScan) {
          if (configuration.q3d_is_show_product) {
            productName = q3d_PluginObj.getProducts()[0].name
          } else {
            //productName = configuration.q3d_product_name == ""? q3d_PluginObj.getProducts()[0].name : configuration.q3d_product_name;
            productName = q3d_PluginObj.getProducts()[0].name;
          }
        } else {
          //productName = configuration.q3d_product_name == ""? q3d_PluginObj.getProducts()[0].name : configuration.q3d_product_name;
          productName = q3d_PluginObj.getProducts()[0].name;
        }
        //let productName = configuration.q3d_product_name == ""? q3d_PluginObj.getProducts()[0].name : configuration.q3d_product_name;
        let groupindex = 0; //capitalizeFirstLetter(q3d_PluginObj.getGroups(id)[0].ProductName)
        if (q3d_PluginObj.getThreeDImages(productName)) {
          groupindex = q3d_PluginObj.getThreeDImages(productName)[0].displayGroupIndex;
        } else {
          groupindex = 0;
        }

        if ($("#groupInfo").children().length >= 2 && groupindex >= 2) {
          $('#groupInfo > div').eq(groupindex - 1).addClass('active');
        } else {
          $('#groupInfo > div').eq(0).addClass('active');
        }
      } else if (parseInt($('.style_thumb ul li.active').attr('defaultgroup')) >= 2) {
        $('#groupInfo > div').eq(groupOrderNumber(parseInt($('.style_thumb ul li.active').attr('defaultgroup')))).addClass('active');
      } else {
        $('#groupInfo > div').eq(0).addClass('active');
      }
    }
  }
}

function drapFabricOnModel(selectedData) { //TODO 01-08

  q3d_getProductFeature(Number($('#appendFabricList li.active .fabric_thumb_wrap').attr('designid')));
  const groupOrderNumber = configuration.q3d_display_groups ? parseInt($('#groupInfo .active').attr('groupno')) : 0;
  let designUrl = selectedData.children().attr('data-src');
  designUrl = q3dDrapingFile(designUrl);

  if (designUrl) {
    fabricDrapeOnModel = true;
  }
  const designData = selectedData.children().attr('designsize').split(',');
  const designheight = designData[1];
  const designwidth = designData[0];
  $('.last_drap_fab').text($('#appendFabricList li.active .fabric_img').attr('id'));
  const designCode = $('#appendFabricList li.active .fabric_img').attr('id');
  lastFabricInfoSave(selectedData.children().attr('data-src'), designwidth, designheight, designCode);
  q3d_PluginObj.loadFabric(designUrl, groupOrderNumber, parseFloat(designwidth), parseFloat(designheight), function () {
    stopBuffer();
  });
  const ThreeDImageId = $('.style_thumb li.active').attr('id');
  const fabName = $('#appendFabricList li.active .fabric_img').attr('id');
  fabName ? saveFabricDrapeCount(ThreeDImageId, fabName) : '';
}

function groupNameChange(C_grpName, grpNum) {
  if ($("#groupInfo").children().length >= 2) {
    if (grpNum == 0) {
      return 'ungrouped';
    } else {
      return C_grpName
    }
  } else {
    return C_grpName;
  }
}

function groupAppend(groupList) {
  let updateGroupList = [];
  updateGroupList[0] = groupList[0];
  if (groupList.length > 1) {
    for (let i = 1; i < groupList.length; i++) {
      if (groupList[0].name == groupList[i].name) {
        break;
      } else {
        updateGroupList[i] = groupList[i];
      }
    }
  } else {
    updateGroupList = groupList;
  }
  return updateGroupList;
}

function capitalizeFirstLetter(str) {
  return str.replace(str.charAt(0), str.charAt(0).toLocaleUpperCase())
};

function groupOrderNumber(grpNumber) {
  if (grpNumber == $("#groupInfo").children().length) {
    return grpNumber - 1;
  } else if (grpNumber > $("#groupInfo").children().length) {
    if (threeDImage_selection_2ndgroup) {
      if ($("#groupInfo").children().length == 1) {
        return 0;
      } else {
        return 1;
      }
    } else {
      return 0;
    }
  } else {
    return grpNumber - 1;
  }
}

function changeStyleModel(s_data, modelchange) { //todo Working 01-08 

  const ModelThreedImageId = $('.style_thumb ul.active li.active').attr('id');
  appendProductGroup(ModelThreedImageId);

  if ($('#fabricList li.active').attr('id') == 'myUpd' && modelchange) {
    $(".fab_search_filter").find("*").prop("disabled", true);
    $(".sorting_dropdown").find("*").prop("disabled", true);
    uploadViewFabricDrapeOnModel();
  } else {
    $(".fab_search_filter").find("*").prop("disabled", false);
    $(".sorting_dropdown").find("*").prop("disabled", false);
    if (loadAllFabricName) {
      if (changeFabricLi() && configuration.q3d_display_groups) {
        changeFabricLibrary(modelchange);
      } else {
        loadModelAndDrapeFabric(modelchange);
      }
    } else if (!qrScan) {
      loadModelAndDrapeFabric(modelchange);
    } else {
      if (changeFabricLi() && configuration.q3d_display_groups) {
        changeFabricLibrary(modelchange);
      } else {
        loadModelAndDrapeFabric(modelchange);
      }
    }
  }

}

function changeFabricLibrary(modelchange) {  //todo Working 01-08
  const groupProductName = $('#groupInfo .active').attr('g_productname');  //Get the currently active product group
  if (groupProductName.toLowerCase() !== $('.btn_fabric_lib b').text().toLowerCase()) {
    //prevGroupProductName = groupProductName
    for (let index = 0; index < $('#fabricList li').length; index++) {
      if ($($('#fabricList li span')[index]).text().toLowerCase() == groupProductName.toLowerCase()) {
        styleModelChange = true;
        $($('#fabricList li')[index]).click();
      }
    }
  } else {
    // console.log('load fabric');
    loadModelAndDrapeFabric(modelchange);
  }
}

function loadModelAndDrapeFabric(modelchange) {
  const ModelThreedImageId = $('.style_thumb ul.active li.active').attr('id');
  if (configuration.q3d_drape_first_fabric) {
    if ($('#appendFabricList li.active').length == 0) {
      $('#appendFabricList li:first').addClass('active');
    }
    if (!modelchange) {
      if ($('#appendFabricList li.active').length >= 1) {
        q3d_getProductFeature(Number($('#appendFabricList li.active .fabric_thumb_wrap').attr('designid')));//fabric_name
        modelchange = false;
      } else {
        $('.fab_features_body').empty();
      }
    }
    //console.log('load fabric image');
    drapeFabricImage();
  } else {
    if (!configuration.q3d_drape_first_fabric) {
      if (!qrScan) {
        if (configuration.q3d_is_show_product) {
          drapeFabricImage();
        } else {
          q3d_PluginObj.loadThreeDImage(ModelThreedImageId, undefined, undefined, undefined, undefined, function () {
            stopBuffer();
          });
        }
      } else {
        q3d_PluginObj.loadThreeDImage(ModelThreedImageId, undefined, undefined, undefined, undefined, function () {
          stopBuffer();
        });
      }
    } else {
      q3d_PluginObj.loadThreeDImage(ModelThreedImageId, undefined, undefined, undefined, undefined, function () {
        stopBuffer();
      });
    }
  }
}

function drapeFabricImage() {
  const ModelThreedImageId = $('.style_thumb ul.active li.active').attr('id');
  let activeFab = $('#appendFabricList li.active .fabric_img').attr('data-src');
  if (activeFab) {
    activeFab = q3dDrapingFile(activeFab);
    const activeFabDesignSize = $('#appendFabricList li.active .fabric_img').attr('designSize').split(',')
    const activeFabHeight = activeFabDesignSize[1];
    const activeFabWidth = activeFabDesignSize[0];
    const activeGroupName = configuration.q3d_display_groups ? groupNameChange($('#groupInfo .active').attr('groupname'), parseInt($('#groupInfo .active').attr('groupno'))) : undefined;
    getLastImageDrape();
    const designCode = $('#appendFabricList li.active .fabric_img').attr('id');
    displayNextPrevBtn($('#appendFabricList li.active').attr('index'));
    lastFabricInfoSave($('#appendFabricList li.active .fabric_img').attr('data-src'), activeFabWidth, activeFabHeight, designCode);
    alreadtDrapefab = $('#appendFabricList li.active .fabric_img').attr('id');
    q3d_PluginObj.loadThreeDImage(ModelThreedImageId, activeFab, activeFabWidth, activeFabHeight, activeGroupName, function () {
      stopBuffer();
    });
    $('.last_drap_fab').text(designCode)
    const ThreeDImageId = ModelThreedImageId;
    const fabName = $('#appendFabricList li.active .fabric_img').attr('id');
    fabName ? saveFabricDrapeCount(ThreeDImageId, fabName) : '';
  } else {
    q3d_PluginObj.loadThreeDImage(ModelThreedImageId, undefined, undefined, undefined, undefined, function () {
      stopBuffer();
    });
  } //todo Working 01-08
}
function changeFabricLi() {  //todo Working 01-08
  if (configuration.q3d_model_to_fabric && !configuration.q3d_fabric_to_model) {
    return true;
  } else if (configuration.q3d_model_to_fabric && configuration.q3d_fabric_to_model) {
    return true;
  } else if (!configuration.q3d_model_to_fabric && configuration.q3d_fabric_to_model) {
    return false;
  } else {
    return false;
  }
}

// tanmay Added Imp Working
function fabricListSelection(fabName) {
  const fabProdListLeng = $('#fabricList li').length
  let prodPositionCount = 0;
  for (let index = 0; index < fabProdListLeng; index++) {
    if ($($('#fabricList li span')[index]).text().toLowerCase() === fabName) {
      return index;
    }
  }
}

function startAppendFabric(AllFabData) {
  let FabricImgTxt = "";
  let index1 = 0;
  let basePath = AllFabData['tempPath'] != undefined ? AllFabData['tempPath'] : AllFabData['cachePath'];
  FabricData = AllFabData.designMaster;
  window.FabricData = FabricData;
  console.log(FabricData);
  let version = Date.now();
  FabricData.forEach((index, value) => { //style="background-image: url(${FabricData[value].tPath.replaceAll(' ', '%20')});"
    FabricData[value].tPath = basePath + 't/' + FabricData[value].designCode + 't.jpg' + `?v=${version}`;
    FabricData[value].bPath = basePath + 'b/' + FabricData[value].designCode + 'b.jpg' + `?v=${version}`;
    FabricData[value].zPath = basePath + 'z/' + FabricData[value].designCode + 'z.jpg' + `?v=${version}`;
    index = $('#appendFabricList li').length == 0 ? value : $('#appendFabricList li').length + value//TO Do Working
    FabricImgTxt += `<li index="${index}">`
    FabricImgTxt += `<div class="fabric_thumb_wrap" designId = ${FabricData[value].designId}>`
    FabricImgTxt += `<div class="fabric_img" id ="${FabricData[value].designCode}" 
                      data-src = "${FabricData[value].tPath.replaceAll(' ', '%20').replaceAll('(', '%28').replaceAll(')', '%29')}" designSize=${FabricData[value].designSize}> </div>`
    FabricImgTxt += `<div class="fabric_info" id=${FabricData[value].designCode}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                      class="bi bi-info-circle" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                      <path
                      d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                      </svg> 
                    <!--  <img class=lazy loading="lazy" data-src="https://dam3d.in/q3d/images/info_Icon.png" alt="fabric info image"> -->
                    </div>`
    FabricImgTxt += `<div class="fabric_name">${FabricData[value].designCode}</div>`
    FabricImgTxt += `</div>`
    FabricImgTxt += `</li>`

  });
  $('#appendFabricList').append(FabricImgTxt);
  ($('.fabric').hasClass("desk_fab_fullview")) ? hasHScrollBar() : null;
  if (internalTextSearch || fabListchange || scrollGetFabric || filterSearchFab || sortFilter) {
    // $('#appendFabricList li:first').addClass('active');
    internalTextSearch = false;
    filterSearchFab = false;
    fabListchange = false;
    scrollGetFabric = false;
    sortFilter = false;
  } else {
    // $('#appendFabricList li:first').addClass('active');
  }
  // console.log(FabricData);
}

// function appendFabricProductList(res, initialProduct, domain, addnewFeatureList) {
//   //passing RoleId but not mandetory tanmay Added Working: 18-07-2024
//   if (checkClientDomain() === "getzner") { }
//   if (res.length == 0) return false;
//   let fabListTxt = '';
//   // fabStart = 0;

//   let merged = [
//     ...res[0],
//     ...res[1].map(x => ({ name: x }))
//   ];
//   console.log(merged)
//   if (addnewFeatureList) {
//     (res[0].featureTypeList).forEach(element => {
//       fabListTxt += `<li><span id="collection">${domain ? element.design_featuretype_name : element}</span></li>`;
//     });
//   } else {
//     merged.forEach(element => {

//       // CASE 1 → element is a string
//       if (typeof element === "string") {
//         fabListTxt += `<li id="${element}"><span>${element}</span></li>`;
//         return;
//       }
//       // CASE 2 → element is object with featureTypeList
//       let idValue = element.name.design_feature_name || "";
//       element.name.featureTypeList.forEach(item => {
//         fabListTxt += `<li id="${idValue}"><span>${item.design_featuretype_name}</span></li>`;
//       });
//     });
//     //  res.forEach(element => {
//     //     fabListTxt += `<li><span>${domain ? element.design_groups_name : element}</span></li>`;
//     //   });
//   }

//   if (addnewFeatureList == "featureAppend") {
//     $('.fabric_lib #fabricList').append(`${fabListTxt}`);
//   } else {
//     $('.fabric_lib').empty().append(`<ul id='fabricList'>${fabListTxt}</ul>`);
//   }

//   // $('.fabric_lib').css('display', 'block');
//   //$('#fabricList li:first').addClass('active'); //add temporary 
//   if (configuration.q3d_display_groups) { //configuration.q3d_display_groups 
//     const fabricSelectionN = fabricListSelection($('#groupInfo .active').attr('g_productName'))
//     $('#fabricList li').eq(fabricSelectionN).addClass('active');
//     prevFabListName = $('#fabricList li.active span').text();
//     $('.btn_fabric_lib b').text($('#groupInfo .active').attr('g_productName'));
//   } else {
//     $('#groupInfo').css('display', 'none');
//     $('#fabricList li').eq(0).addClass('active');
//     prevFabListName == $('#fabricList li.active span').text()
//     $('.btn_fabric_lib b').text($('#fabricList li:first span').text().toLocaleLowerCase());
//   }

// }

function appendFabricProductList(res, initialProduct, domain, addnewFeatureList) {
  if (res.length == 0) return false;
  let fabListTxt = '';
  if (addnewFeatureList) {
    (res[0].featureTypeList).forEach(element => {
      fabListTxt += `<li><span>${domain ? element.design_featuretype_name : element}</span></li>`;
    });
  } else {
    res.forEach(element => {
      fabListTxt += `<li><span>${domain ? element.design_groups_name : element}</span></li>`;
    });
  }

  if (addnewFeatureList == "featureAppend") {
    $('.fabric_lib #fabricList').append(`${fabListTxt}`);
  } else {
    $('.fabric_lib').empty().append(`<ul id='fabricList'>${fabListTxt}</ul>`);
  }

  // $('.fabric_lib').css('display', 'block');
  //$('#fabricList li:first').addClass('active'); //add temporary 
  if (configuration.q3d_display_groups) { //configuration.q3d_display_groups 
    const fabricSelectionN = fabricListSelection($('#groupInfo .active').attr('g_productName'))
    $('#fabricList li').eq(fabricSelectionN).addClass('active');
    prevFabListName = $('#fabricList li.active span').text();
    $('.btn_fabric_lib b').text($('#groupInfo .active').attr('g_productName'));
  } else {
    $('#groupInfo').css('display', 'none');
    $('#fabricList li').eq(0).addClass('active');
    prevFabListName == $('#fabricList li.active span').text()
    $('.btn_fabric_lib b').text($('#fabricList li:first span').text().toLocaleLowerCase());
  }

}

function getLastImageDrape() {
  if ($('#appendFabricList li.active').length == 0) {
    // 2. Get the last draped fabric name from .last_drap_fab element
    let desingName = $('.last_drap_fab').text().trim();
    if (desingName == '') {     //  If no fabric name is stored, stop here

      return
    } else {
      // if(styleModelChange){
      saveClickOnFabricInfo(desingName);        //  Otherwise, save the last fabric info for reference

      // }
      let index = Number($('#appendFabricList li.active').attr('index'));       // Get the index of the (would-be) active fabric

      if (index) {
        displayNextPrevBtn(index);
      }
    }
  }
  //setPositonScrollbar();
}

function lazyLoadImg(id) {
  let className = id ? id : '.fabric_img';
  const lazyImages = document.querySelectorAll(className);
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const div = entry.target;
        div.style.backgroundImage = `url(${div.dataset.src})`;
        observer.unobserve(div);
      }
    });
  });

  lazyImages.forEach(img => {
    observer.observe(img);
  });
}

function q3dDrapingFile(imgUrl) {
  let draping_File = configuration.q3d_draping_file;
  /* this is the old url */
  // let newUrl = imgUrl.replace("/t/", "/z/").replace("t.jpg", "z.jpg");
  //console.log(newUrl);
  return imgUrl.replaceAll('/t/', `/${draping_File}/`).replaceAll('t.jpg', `${draping_File}.jpg`);
  //return newUrl;
}

function q3dFullviewImage(imgUrl) {
  let draping_File = configuration.q3d_fullview_image;
  /* this is the old url */
  return imgUrl.replaceAll('/t/', `/${draping_File}/`).replaceAll('t.jpg', `${draping_File}.jpg`);
  //return imgUrl;
}

function getSupplierIdDesignName(data) {
  let urldata = {};
  let designC = "&t="
  let supplierC = "?k="
  let supp_id = ""
  let des_Name = ""
  if (data.includes(designC) && data.includes(supplierC)) {
    let url = new URL(data);
    url.search = url.search.replace("%26", "&");
    if (url.searchParams.get("k") != null && url.searchParams.get("k") != "") {
      supp_id = url.searchParams.get("k");
      supp_id = parseInt(supp_id, 16);
    }
    if (url.searchParams.get("t") != null && url.searchParams.get("t") != "") {
      des_Name = url.search.substring((url.search.lastIndexOf("&t=") + 3), url.search.length);
      des_Name = des_Name.replace("&", "%26");
      des_Name = des_Name.replaceAll("%20", " ");
      des_Name = des_Name.split(",");

    }
    urldata.supp_id = supp_id;
    urldata.des_Name = des_Name;

  } else {
    des_Name = data.replaceAll('%20', " ").split(",");
    supp_id = qrScan ? parseInt(JSON.parse(sessionStorage.getItem('jsonString')).org_type_id) : Number((sessionStorage.qrSupplierId));
    urldata.supp_id = supp_id;
    urldata.des_Name = des_Name;
  }

  return urldata;
}

function getUniqueId() {

  var e = document.createElement("canvas"),
    t = e.getContext("2d"),
    r = "Textronic Design System";
  (t.textBaseline = "top"),
    (t.font = "14px 'Arial'"),
    (t.textBaseline = "alphabetic"),
    (t.fillStyle = "#f60"),
    t.fillRect(125, 1, 62, 20),
    (t.fillStyle = "#069"),
    t.fillText(r, 2, 15),
    (t.fillStyle = "rgba(102, 204, 0, 0.7)"),
    t.fillText(r, 4, 17);
  var n = e.toDataURL().replace("data:image/png;base64,", "");
  return (function (e) {
    for (var t, r = [], n = 0; n < 256; n++) {
      t = n;
      for (var i = 0; i < 8; i++) t = 1 & t ? 3988292384 ^ (t >>> 1) : t >>> 1;
      r[n] = t;
    }
    for (var o = -1, a = 0; a < e.length; a++) o = (o >>> 8) ^ r[255 & (o ^ e.charCodeAt(a))];
    return (-1 ^ o) >>> 0;
  })(atob(n).slice(-16, -12))
    .toString(16)
    .toUpperCase();
}

function resetAllTextSearch() {
  $('.fab_search_input1').val('');
  $('.fab_search_input2').val('');
  $('.fab_search_input3').val('');
  $('.fab_close1').css('display', 'none');
  $('.fab_search_icon1').css('display', 'block');
  $('.fab_close2').css('display', 'none');
  $('.fab_search_icon2').css('display', 'block');
  $('.fab_close3').css('display', 'none');
  $('.fab_search_icon3').css('display', 'block');
  textSearchD = '';
}

function q3dTotemScanDrapeOnModel(totemScanImage) {

  if ($('#appendFabricList li.active').length > 0) {
    saveClickOnFabricInfo(totemScanImage[0].designAdvName);
    displayNextPrevBtn(parseInt($('#appendFabricList li.active').attr('index')));
    if ($('.fab_features').css('display') == "block") {
      appendProductFeature(totemScanImage[0].designFeature, totemScanImage[0].designAdvName);
    }
  }
  const groupOrderNumber = configuration.q3d_display_groups ? parseInt($('#groupInfo .active').attr('groupno')) : 0;
  let newUrl = `${totemScanImage[0].thumbImagePath}/t/${totemScanImage[0].designAdvName}t.jpg`
  let designUrl = `${totemScanImage[0].thumbImagePath}/t/${totemScanImage[0].designAdvName}t.jpg`;
  designUrl = q3dDrapingFile(designUrl.replaceAll(' ', '%20').replaceAll('(', '%28').replaceAll(')', '%29'));
  const designData = totemScanImage[0].designSize.split(',');
  const designheight = designData[1];
  const designwidth = designData[0];
  const designCode = (totemScanImage[0].designAdvName).trim();//$('#appendFabricList li.active .fabric_img').attr('id');
  lastFabricInfoSave(newUrl, designwidth, designheight, designCode);
  q3d_PluginObj.loadFabric(designUrl, groupOrderNumber, parseFloat(designwidth), parseFloat(designheight), function () {
    stopBuffer();
  });
  $('.last_drap_fab').text(designCode);
  if ($('body').hasClass('q3dlite')) {
    saveSelectionClickOnFab();
  } else {
    saveClickOnFabricInfo(totemScanImage[0].designAdvName);
    const ThreeDImageId = $('.style_thumb li.active').attr('id');
    const fabName = $('#appendFabricList li.active .fabric_img').attr('id');
    fabName ? saveFabricDrapeCount(ThreeDImageId, fabName, true) : '';
  }

}

function q3d_TotemQrScan(url) {

  let deviceloginId = getUniqueId();
  let MethodUrl = serviceUrl + "/api/Configuration/QRScan_Q3D"
  let suppAndDesignName = getSupplierIdDesignName(url);
  var data1 = {
    "supplierId": JSON.parse(sessionStorage.jsonString).org_type_id,
    "deviceloginId": deviceloginId,
    "c": "b",
    "designNames": suppAndDesignName.des_Name,
    "isGetzner": serviceUrl.includes('gpv') ? true : false
  }

  $.ajax({
    url: MethodUrl,
    type: "POST",
    contentType: 'application/json',
    data: JSON.stringify(data1),
    async: false,
  }).done(function (r) {
    if (r.loadProductsByFabricResponseDto !== null) {
      q3dTotemScanDrapeOnModel(r.loadProductsByFabricResponseDto);
    } else {
      // sweetalert_error('design not Found');
      sweetalert_error('Upload a fabric to preview it on the available models.');
      stopBuffer();//shubham Added purpose: To stop loader when design not found
    }
  }).fail(function (jqXhr, textStatus, errorThrown) {
    console.log(error());
  });
}
// function openCamera(){
//   codeReader.decodeFromVideoDevice(undefined,document.getElementById("barcode-scan"), (result, error) => {
//         if (result) {
//             //console.log("Barcode detected: ", result.getText());
//             QrscanResult(result.getText());
//             codeReader.reset(); // Stop scanning after detection
//         }
//         if (error) {
//             console.warn("No barcode detected:", error);
//             //codeReader.reset();
//         }
//     }
//   ).catch((err) => console.error("Error listing video devices:", err));
// }
//let scanner = null;
//let scanner = "";
//old working code here*/

let scanner = new QrScanner(document.getElementById("Qr-scan"),
  result => allDataFunction(result), {
  onDecodeError: error => {
    //  camQrResult.textContent = error;
    //  camQrResult.style.color = 'inherit';
  },
  highlightScanRegion: true,
  highlightCodeOutline: true,
  returnDetailedScanResult: true
});

function startScanner() {
  scanner.start().then(() => {
    // Wait a moment for the video stream to be active
    // setTimeout(() => {
    const track = scanner.$video.srcObject?.getVideoTracks()[0];
    if (!track) {
      console.warn("No video track found.");
      return;
    }
    const capabilities = track.getCapabilities();
    if (capabilities.zoom) {
      const zoomLevel = Math.min(2.5, capabilities.zoom.max);
      track.applyConstraints({ advanced: [{ zoom: zoomLevel }] })
        .then(() => {
          console.log("Zoom applied:", zoomLevel);

        })
        .catch(err => {
          console.warn("Zoom failed:", err);
        });
    } else {
      console.log("Zoom not supported.");
    }
  });
}

/*function startScanner(){
  scanner.start();
  const videoElem = document.getElementById("Qr-scan");
// Define camera constraints, requesting environment (rear) camera
  const constraints = {
    video: {
      facingMode: { exact: "environment" }
    }
  };

  navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
      videoElem.srcObject = stream;
      videoElem.play();
      // Get the video track to check for zoom support
      const track = stream.getVideoTracks()[0];
      if (!track) {
        console.warn("No video track found.");
        return;
      }
      // Check if zoom is supported
      const capabilities = track.getCapabilities();
      if (capabilities.zoom) {
        // Apply zoom level (e.g., max 2.5 or less)
        const zoomLevel = Math.min(2.5, capabilities.zoom.max);
        track.applyConstraints({ advanced: [{ zoom: zoomLevel }] })
          .then(() => {
            console.log("Zoom applied:", zoomLevel);
          })
          .catch(err => {
            console.warn("Zoom failed:", err);
          });
      } else {
        console.log("Zoom not supported.");
      }
  });
}*/
/* end working code here*/
/*} catch(ex){
  console.log(ex.message)
}*/

// const videoElement = $('#barcode-scan');
// const brscanner = new BarcodeScanner({
//   video: videoElement,
//   onScan(result) {
//       console.log('Scanned barcode:', result);
//   },
//   onError(error) {
//       console.error('Error scanning barcode:', error);
//   }
// });

// const barcodeScanner = new BarcodeScanner(videoElement);
// const hints = new Map();
// hints.set('POSSIBLE_FORMATS', [
//   BarcodeFormat.QR_CODE,
//   BarcodeFormat.CODE_128,
//   BarcodeFormat.EAN_13,
//   BarcodeFormat.CODE_39,
//   BarcodeFormat.CODE_11,
// ]);
// const codeReader = new BrowserMultiFormatReader();

// BrowserMultiFormatReader.listVideoInputDevices()
// .then((videoInputDevices) => {
// const selectedDeviceId = videoInputDevices[0].deviceId;
// }).catch((err) => {
//   //console.error('camera device not found.'); //OPT
// });

function openCamera() {
  /*Quagga.init(
        {
            inputStream: {
                name: "Live",
                type: "LiveStream",
                target: document.querySelector('.barcode_popup'), // The element to show the camera feed
            },
            decoder: {
              //readers: [ "code_128_reader", "ean_reader", "ean_8_reader", "upc_reader"]
              readers: [
            "code_128_reader", // For Code128 barcodes
            "ean_reader",      // For EAN-13 barcodes
            "upc_reader"       // For UPC-A barcodes
            ], // You can add more barcode readers here , "ean_reader", "ean_8_reader", "qr_reader", "datamatrix_reader", "pdf417_reader", "upc_reader"
            },
            debug: {
                drawBoundingBox: true,
                showFrequency: true,
                drawScanline: true,
                showPattern: true    // Disable pattern visualization
            },
        },
        (err) => {
            if (err) {
                console.error('Error initializing Quagga:', err);
                return;
            }
            console.log('Quagga initialized');
            Quagga.start();
            //isScannerRunning = true;
            
        }
      );
      Quagga.offDetected();
      Quagga.onDetected((data) => {
        let str = data.codeResult.code;//"F27845230423951185530001010325";
        let arr = str.split('');        // Convert the string to an array
        let spliced = arr.splice(14, 10); // Splice from index 15 to 24 (10 characters)
        let result = spliced.join('');  // Join the array back into a string
        // Insert '-' at the 6th index of the result string (position 5 in the array)
        let resultArray = result.split('');  // Convert the result string to an array
        resultArray.splice(6, 0, '-');      // Insert '-' at the 6th index
        let finalResult = resultArray.join('');  // Convert the array back into a string
        //console.log(finalResult);  // Output will be '118553-0001'
        QrscanResult(finalResult);
        Quagga.stop();
      });*/
  Quagga.init(
    {
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector('.barcode_popup'), // Camera preview container
        constraints: {
          width: { min: 640 },
          height: { min: 480 },
          facingMode: "environment", // Use rear camera if available
        },
      },
      decoder: {
        readers: [
          "code_128_reader",
          "ean_reader",
          "upc_reader"
        ],
      },
      debug: {
        drawBoundingBox: true,
        showFrequency: true,
        drawScanline: true,
        showPattern: true,
      },
    },
    (err) => {
      if (err) {
        console.error('Error initializing Quagga:', err);
        return;
      }
      console.log('Quagga initialized');
      Quagga.start();

      // Add zoom if supported
      /*Quagga.CameraAccess.request(null, Quagga.CameraAccess.getActiveTrack())
        .then(track => {
          const capabilities = track.getCapabilities();
          if (capabilities.zoom) {
            const zoomLevel = Math.min(capabilities.zoom.max, 10); // Zoom to 2x or max
            track.applyConstraints({
              advanced: [{ zoom: zoomLevel }]
            }).then(() => {
              console.log("Zoom applied:", zoomLevel);
            }).catch(err => {
              console.warn("Failed to apply zoom:", err);
            });
          } else {
            console.log("Zoom not supported on this device");
          }
      });*/

    }

  );

  // Clear previous listeners and add a new detection handler
  Quagga.offDetected();
  Quagga.onDetected((data) => {
    let str = data.codeResult.code;
    let arr = str.split('');
    let spliced = arr.splice(14, 10);
    let result = spliced.join('');
    let resultArray = result.split('');
    resultArray.splice(6, 0, '-');
    let finalResult = resultArray.join('');
    QrscanResult(finalResult);
    Quagga.stop();
  });
}

$("body").on('click', '#scan_btn', function () {
  $(".camera_popup").css("display", "block");
  // scanner.start();
  startScanner();
});
$("body").on('click', ".cross_btn", function () {
  $(".camera_popup ").css("display", "none");
  scanner.stop();
  //resetScanner();
})

$('body').on('click', '#barcode_scn', async function () {
  $('.barcode_popup').css("display", "block");
  openCamera();
});
//   
$('body').on('click', '.barcode_cross_btn', function () {
  $('.barcode_popup').css("display", "none");
  Quagga.stop();
  // brscanner.stop();
  // //barcodeScanner.stop(); // Stop the scanner
  // // isScannerRunning = false;
  //codeReader.reset();
  // const video = document.getElementById("barcode-scan");
  // const stream = video?.srcObject;
  // if (stream && stream.getTracks) {
  //   stream.getTracks().forEach((track) => track.stop());
  //   video.srcObject = null;
  // }
})

//Shubham added below purpose: upload design
//var src1 = 'https://s3.ap-south-1.amazonaws.com/aws.tds/tds_textronics/1833265648/t/109-4t.jpg'
function upd_appendViewFabric(src, size, designName) {

  $("#fabricList li").removeClass('active')
  const myUpload = $("#myUpd")
  let FabricImgTxt = ''
  if (!myUpload?.length) {
    $("#fabricList").prepend("<li class='active' id='myUpd'><span> My Upload</span></li> ")
  } else {
    myUpload.addClass('active')
  }
  const totalUploadedFab = $('#myuploadFabric li').length
  let index = totalUploadedFab == 0 ? 0 : totalUploadedFab // let index = totalUploadedFab == 0  ?  0 :  totalUploadedFab + 1
  FabricImgTxt += `<li index="${index}">`
  FabricImgTxt += `<div class="fabric_thumb_wrap" index="${index}" designId = ${0} designSize=${size} designName ="${designName}" >`
  FabricImgTxt += `<div class="fabric_img" id ="${designName}" 
                   data-src=${src} > </div>`
  // FabricImgTxt += `<div class="fabric_info" id=${designName}>
  //                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
  //                   class="bi bi-info-circle" viewBox="0 0 16 16">
  //                   <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
  //                   <path
  //                   d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
  //                   </svg> 
  //                 <!--  <img class=lazy loading="lazy" data-src="https://dam3d.in/q3d/images/info_Icon.png" alt="fabric info image"> -->
  //                 </div>`
  FabricImgTxt += `<div class="fabric_name">${designName}</div>`
  FabricImgTxt += `</div>`
  FabricImgTxt += `</li>`

  $("#myuploadFabric").append(FabricImgTxt)
  const _size = size?.split(",")
  upd_drapeUplodedFabric(index, src, _size[0], _size[1], designName)
  upd_openMyUpload()
  lazyLoadImg()
  displayNextPrevBtn(parseInt($('#myuploadFabric li.active').attr('index')));
  //08-1-2024
  // $("#myuploadFabric li:last .fabric_thumb_wrap").click()
}
export function upd_drapeUplodedFabric(index, designUrl, designwidth, designheight, designName) {
  startBuffer()
  $('.last_drap_fab').text(designName)
  appendProductFeature({}, designName)
  let groupOrderNumber = parseInt($('#groupInfo .active').attr('groupno'))
  displayNextPrevBtn(index, $("#myuploadFabric li"))
  q3d_PluginObj.loadFabric(designUrl, groupOrderNumber, parseFloat(designwidth), parseFloat(designheight), function () {
    stopBuffer();
  });
}
export function upd_openMyUpload() {
  $("#fabricList li").removeClass('active')
  $("#myuploadFabric li.active").removeClass('active')
  $("#myUpd").addClass('active')
  $(".fab_search_filter").find("*").prop("disabled", true);
  $(".sorting_dropdown").find("*").prop("disabled", true);
  const currentDrapedFab = $("div.fab_features_name h5").text()
  const isDrapedFromUploaded = $("#myuploadFabric li div[id='" + currentDrapedFab + "']")
  if (isDrapedFromUploaded.length) {
    isDrapedFromUploaded.parent().parent().addClass('active')
  }

  $('.btn_fabric_lib b').text("My Upload")
  prevFabListName = "My Upload"
  $('#myuploadFabric').css("display", "flex")
  $('#appendFabricList').empty().hide()
  $('.next_fabric').css('visibility', 'hidden');
  $('.prev_fabric').css('visibility', 'hidden');
  const totalUploadedFab = $('#myuploadFabric li').length
  $('.fabric_count span').text(`Count : ${totalUploadedFab}`);
}
function upd_onViewCrop(imgBase64, imgSize, imgName) {
  // console.log(imgBase64,imgSize,imgName)
  upd_appendViewFabric(imgBase64, imgSize, imgName)
}
export function upd_InitiateUpload() {
  //console.log("upload initiated")
  fabricPluginObj.loadCrop();
}
//Shubham working end

//akash changes 
//  export function hasHScrollBar() {
//   var element = document.getElementById("appendFabricList");
//  (element.scrollHeight > element.clientHeight) ? null : checkScrollBarPos();
// }

export function hasHScrollBar() {
  var element = document.getElementById("appendFabricList");
  let totalCount = sessionStorage.getItem("totalcount");
  let checkscrollbar = (element.scrollHeight > element.clientHeight)
  let fabric_count = ($("#appendFabricList li").length < totalCount)
  if (!checkscrollbar) {
    fabric_count ? checkScrollBarPos() : null;
  }
  else {
    null;
  }
}


