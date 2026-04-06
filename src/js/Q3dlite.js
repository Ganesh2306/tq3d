
//const url = window.location.href //
//@ Q3d_lite 16-05-2024 v1.0 @tanmay @shubham @akash//

console.log("Q3d_lite 05-06-2024 v2.3");

import $ from 'jquery';

// import QrScanner from 'qr-scanner';
// import './swipe';
import { sweetalert_success, sweetalert_error, sweetalert_warning } from './sweetalert'
import { SaveFabDrapeCount, getdata, isFabExist }  from './controller';
import PinchZoom from './pinch-zoom';
// import * as Tds from './Tds';
import { serviceUrl } from './config.js'
import './canvasFingerPrint.js';
import { changeStyleModel, downloadQ3dModel, drapFabricOnModel, clickOnModelPrevBtn, clickOnModelNextBtn, textureOperation } from './q3dFunction.js'
// import * from '../draco'

let searchStringUrl = "?k"
let allFabData = {}
let catchepath = "";
let gltfPath = "";
let data = {}
let fabData = {}
let urlDesignName = "";
let supplier_id = 0
let currentFabData = {}
let pinchZoomObj = null;
let isQrScan = false;
let q3d_Plugin = '';

if ((window.location.search).includes(searchStringUrl) || (window.location.search).includes(searchStringUrl)) {
   let url_string = window.location.href;
   let url = new URL(url_string);
  
   let fabID = "";
   url.search = url.search.replace("%26", "&");
   if(url.searchParams.get("t") != null && url.searchParams.get("t") != "") {
   fabID = url.search.substring((url.search.lastIndexOf("&t=") + 3), url.search.length);
   fabID = fabID.replace("&", "%26");
   fabID = fabID.replaceAll("%20", " ");
   urlDesignName = fabID.split(",");
  
   } else {
     fabID = url.search.substring((url.search.lastIndexOf("&T=") + 3), url.search.length);
     fabID = fabID.replace("&", "%26");
     fabID = fabID.replaceAll("%20", " ");
     urlDesignName = fabID.split(",");
     
   }
   if (url.searchParams.get("k") != null && url.searchParams.get("k") != "") {
      supplier_id = url.searchParams.get("k");
      supplier_id = parseInt(supplier_id, 16);
   }
   $('body').addClass("q3dlite");
   getdata(urlDesignName, supplier_id).then((data)=>{
      allFabData = data;
      isQrScan = true;
      AppnedData(allFabData, urlDesignName);

   });
   

} else {
   sweetalert_error("Design Name Not Found");
   
}

function AppnedData (allFabData, urlDesignName) {
      deserializeData(allFabData);
      catchepath = allFabData.catchepath;
      gltfPath = allFabData.gltfPath;
      //designPath = allFabData.designPath
      if(allFabData.designsDto.length == 0) {
         sweetalert_error("design data Not Found");
      }
      AppendFinalModel(urlDesignName,allFabData.designsDto[0].productNamesDtos[0].threedImageName[0],allFabData.designsDto[0].productNamesDtos[0].productName,allFabData["supplier_id"]); //styleName
      AppendFabric();
      AppendStyles(urlDesignName[0]); 
}
function AppendFinalModel (urlDesignName, styleName, productName,supplier_id) {
   urlDesignName = urlDesignName[0];
   const ModelUrlCreate = `${catchepath}${supplier_id}/${urlDesignName}/${productName}/${styleName}/${urlDesignName}.jpg`
   $(".model_img_box img").attr("src", ModelUrlCreate);
   $(".drap_fabric_name").text(urlDesignName.replaceAll('%20', " "));

   if(!pinchZoomObj){
      let el = document.querySelector('.model_img_box');
      pinchZoomObj = new PinchZoom(el, { minZoom:1, animationDuration:600, draggableUnzoomed:false});
   }else{
      //shuhbam added purpose : set Model to center position
      pinchZoomObj.zoomFactor = 1
      pinchZoomObj.lastScale = 1;
      pinchZoomObj.offset = {
         x: 0,
         y: 0
     };
     pinchZoomObj.update()
   }
  // SaveFabDrapeCount(supplier_id,1)
}
function isMobile(){ 
   if (window.screen.width <= 1024 || window.screen.width == 1080 && window.screen.height == 1920) {
      return true;
    } else {
      return false;
    }
   
}
function AppendFabric(){
   if(isMobile()){
      let loopCount = 1;
   let activeFab = ''
   for (let element in currentFabData) {
      let appendFabricString = ""
      let id = `${currentFabData[element]['supplier_id']}-${element}`.replaceAll(" ","")
       if(loopCount === 1) activeFab = `[id='${id}']`
       loopCount++
      let isFabExist = document.getElementById(id)
      if (!isFabExist){
            appendFabricString += `<li id=${id} supplierId=${currentFabData[element]['supplier_id']}>
            <div class="fabric_list_wrap">
              <div class="fab_img" designName=${element.replaceAll(" ", "%20")} style="background-image: url('${currentFabData[element][0]}/t/${element}t.jpg');">
              </div>
              <div class="fabric_info">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                  fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                  <path
                     d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                  </svg>
               </div>
              <div class="fab_thumb_name">${element}</div>
            </div>
          </li>`
         $(".fabric_thumb_list ul#appendFabricList").append(appendFabricString);
      }
   }
   $(".fab_thumb_name span").html(`(count:<strong>${$("#appendFabricList li").length}</strong>)`);
   addRemoveActiveClass([activeFab],[".fabric_thumb_list li"])
   } else {
   let loopCount = 1;
   let activeFab = ''
   for (let element in currentFabData) {
      let appendFabricString = ""
      let id = `${currentFabData[element]['supplier_id']}-${element}`.replaceAll(" ","")
       if(loopCount === 1) activeFab = `[id='${id}']`
       loopCount++
      let isFabExist = document.getElementById(id)
      if (!isFabExist){
            appendFabricString += `<li id=${id} supplierId=${currentFabData[element]['supplier_id']}> 
                                 <div class="fabric_thumb_wrap">
                                    <div class ="fabric_img" designName=${element.replaceAll(" ", "%20")} style="background-image: url('${currentFabData[element][0]}/t/${element}t.jpg');"></div>
                                    <div class="fabric_info" data-bs-toggle="modal" data-bs-target="#fabric_fullview">
                                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                          fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                          <path
                                             d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                                       </svg>
                                    </div>
                                    <div class = "fabric_name">${element}</div>
                                    </div>
                                 </li>`
         $(".fabric_thumb ul#appendFabricList").append(appendFabricString);
      }
   }
   $(".fabric_count span").html(`(count:<strong>${$("#appendFabricList li").length}</strong>)`);
   addRemoveActiveClass([activeFab],[".fabric_thumb li"])
}
}

function deserializeData(allFabData) {
   //let FabAllData = []
  let supplier_id = allFabData?.supplier_id
  data[supplier_id] = data[supplier_id] || {}
  fabData[supplier_id] = fabData[supplier_id] || {}
  currentFabData = {}
   allFabData.designsDto.forEach(element => {
      data[supplier_id][(element.designName).toLowerCase()] = element.productNamesDtos
      fabData[supplier_id][(element.designName).toLowerCase()] = {0:element.designPath,supplier_id}
      currentFabData[(element.designName).toLowerCase()] = {0:element.designPath,supplier_id}
      // fabData[element.designName]['supplier_id'] = supplier_id
   });

   
//return FabAllData[urlDesignName]
}
function AppendStyles(fabName){
   fabName = fabName?.toLowerCase()
   let supplier_id = $("#appendFabricList li.active").attr("supplierid")
   let tempFab = `${supplier_id}-${fabName}`.replaceAll(" ","")
   if(!data[supplier_id][fabName]) return
      const destructureObj = data[supplier_id]

      try{
         if(isMobile()){
            AppendStylesWithOutProducts(destructureObj,fabName,supplier_id)
            return
         }
         let  styleLibraryStr = '';
         let styleLibId = `${tempFab}-Stylelib`
         let isStyleExist = document.getElementById(styleLibId)
         
   if(!isStyleExist){
      Object.keys(destructureObj[fabName]).forEach((key) => {
            const {threedImageName,productName} = destructureObj[fabName][key]
            let suppFabProductCombo = `${tempFab}-${productName}`.replaceAll(" ","")
            styleLibraryStr +=`<li fab-product=${suppFabProductCombo}><span>${productName} </span></li>`
            let styleThumbString =`<ul id = ${suppFabProductCombo}>` 

      threedImageName.forEach((modelName) => {
               styleThumbString += `<li> <div modelName=${modelName.replaceAll(" ","%20")} product=${productName.replaceAll(" ","%20")} class = style_thumb_wrap> 
                                       <div class = "style_img">
                                       <img class=img-thumbnail loading="lazy" src="${gltfPath}${modelName}/${modelName}t.jpg" alt="thumb">
                                     </div><div class = "style_name">
                                          ${modelName}
                                         </div>
                                         </div>
                                          </li>`
                                  })
          styleThumbString +=`</ul>`
          $(".style_thumb").append(styleThumbString)
      })
      
     
      $(".style_lib").append(`<ul id=${styleLibId}>${styleLibraryStr} </ul>`)
   }

   let selectedFabProduct = `${tempFab}-${destructureObj[fabName][0]?.productName}`.replaceAll(" ","")
   let addActiveList = [`[id='${selectedFabProduct}'] li`,`.style_lib ul[id='${styleLibId}']`,`.style_lib ul[id='${styleLibId}'] li`]
   let removeActiveList = [".style_thumb li",".style_lib ul",".style_lib ul li"]

         addRemoveActiveClass(addActiveList,removeActiveList)
         changeStyleProduct(selectedFabProduct)
      }catch(err){
         throw (err)
      }
}

function AppendStylesWithOutProducts(obj,fabName,supplier_id){
      let styleListId = `${supplier_id}-${fabName}-Style`.replaceAll(" ","")
      let isStyleExist = document.getElementById(styleListId)
      let counter = 0   
      if(!isStyleExist){
         let styleThumbString =`<ul id = ${styleListId}>` 
         obj[fabName].forEach((value) => {
               const {threedImageName,productName} = value
               threedImageName.forEach((modelName) => {
                  counter++
                  styleThumbString +=    ` <li>
                                       <div modelName=${modelName} product=${productName.replaceAll(" ","%20")} class="style_list_wrap">
                                          <div class="style_list_img" styleIndex=${counter}>
                                            <img class="img-thumbnail" src="${gltfPath}/${modelName}//${modelName}t.jpg" alt="thumb">
                                          </div>
                                           <div class="style_thumb_name"> ${modelName}
                                              </div>
                                       </div>
                                   </li>`
                               })         
                
          })
          styleThumbString +=`</ul>`
          $(".style_thumb_list").append(styleThumbString)
      }
   let addActiveList = [`[id='${styleListId}']`,".style_thumb_list ul.active li"]
      addRemoveActiveClass(addActiveList,[".style_thumb_list ul.active",".style_thumb_list ul li.active"])
}
function QrscanResult (url) {

   if(!url){
      return
   } else {
      if((url).includes("?k" && "&t")) {
         $(".camera_popup").css("display","none");
         scanner.stop();
         const urldata = getSupplierIdDesignName(url);
         QrAppendData(urldata);
      } else {
         $(".camera_popup").css("display","none");
         scanner.stop();
         sweetalert_error("Fabric Name Not Found");
      }
      
   }
   
}
function QrAppendData(urldata) {
   
      getdata(urldata.des_Name, urldata.supp_id).then((data)=>{
         allFabData = {}
         allFabData = data;
         AppnedData(allFabData, urldata.des_Name);
      });
  // }
}
function getSupplierIdDesignName(data) {
   let urldata = {};
   let supp_id = ""
   let des_Name = ""
   let url = new URL(data);
   url.search = url.search.replace("%26", "&");
   if (url.searchParams.get("k") != null && url.searchParams.get("k") != "") {
      supp_id = url.searchParams.get("k");
      supp_id = parseInt(supp_id, 16);
   }
   if(url.searchParams.get("t") != null && url.searchParams.get("t") != "") {
      des_Name = url.search.substring((url.search.lastIndexOf("&t=") + 3), url.search.length);
      des_Name = des_Name.replace("&", "%26");
      des_Name = des_Name.replaceAll("%20", " ");
      des_Name = des_Name.split(",");
     
   }
   // if( supp_id !== supplier_id ) {
   //    alert("fabric Not found")
   //    return 
   // }
   //isFabExist(urldata.supp_id, urldata.des_Name)
   urldata.supp_id = supp_id;
   urldata.des_Name = des_Name;
   // if()
   return urldata;
}
function renderFabricFirstModel(design_Name,supplier_id) {
   for(const value in data[supplier_id] ){
      if(value == design_Name) {
         return data[supplier_id][value]
      }
   }
}
// const scanner = new QrScanner(document.getElementById("Qr-scan"), 
// result => QrscanResult(result.data), {
//    onDecodeError: error => {
//       //  camQrResult.textContent = error;
//       //  camQrResult.style.color = 'inherit';
//    },
//    highlightScanRegion: true,
//    highlightCodeOutline: true,
// });
$("#fabricButton").unbind("click");
$("#fabricButton").on("click", function(){
   $(".fabric ").toggle();
   addRemoveActiveClass(["#fabricButton"],["#styleButton"]);
   // $(".fabric_lib").css("display", "none")
   $(".style").css("display", "none")
   $(".fabric_count span").html(`(count:<strong>${$("#appendFabricList li").length}</strong>)`);
});

$("body").on('click','#barcode_scn', function() {
   $(".camera_popup").css("display","block");
   scanner.start();
})
$("body").on('click','#scan_btn', function() {
   $(".camera_popup").css("display","block");
   scanner.start();
})
$("body").on('click', ".close_scanpopup", function() {
   $(".camera_popup").css("display","none");
   scanner.stop();
})
// $("#crossButton").unbind("click");
$("#crossButton").on("click", function (){
   $(".fabric").css("display", "none")
   $(".style").css("display", "none")
});
$("#crossButton1").on("click", function (){
   $(".fabric").css("display", "none")
   $(".style").css("display", "none")
});
// $("#qrscanButton").on("click", function (){
//    $(".outer-container").css("display", "none");
   
// });

$("#appendFabricList li.fabric_img").unbind('click');
$("body").on("click", ".fabric_thumb_wrap",function (){
   if(isQrScan) {
      $(".fabric_thumb li.active").removeClass("active")
      $(this).parent().addClass("active")
      AppendStyles($(this).children().attr("designName").replaceAll("%20", " "))
      let supplier_id = $(this).parent().attr("supplierId")
      const FabricFirstModeldata = renderFabricFirstModel($(this).children().attr("designName").replaceAll("%20", " "),supplier_id)
      AppendFinalModel($(this).children().attr("designName").replace("%20", " ").split(","), FabricFirstModeldata[0].threedImageName[0], FabricFirstModeldata[0].productName,supplier_id)
      $(`.style_thumb_list ul.active`).scrollLeft = 0
   } 
});

$("#appendFabricList li.fab_img").unbind('click');
$("body").on("click", ".fabric_list_wrap",function (){
   //console.log($(this).attr('designName'))
   $(".fabric_thumb_list li.active").removeClass("active")
   $(this).parent().addClass("active")
   AppendStyles($(this).children().attr("designName").replaceAll("%20", " "))
   let supplier_id = $(this).parent().attr("supplierId")
   const FabricFirstModeldata = renderFabricFirstModel($(this).children().attr("designName").replaceAll("%20", " "),supplier_id)
   AppendFinalModel($(this).children().attr("designName").replace("%20", " ").split(","), FabricFirstModeldata[0].threedImageName[0], FabricFirstModeldata[0].productName,supplier_id)
   $(`.style_thumb_list ul.active`).scrollLeft = 0
});

$('#modelImage').unbind('click');
$("#modelImage").on("error",function(e){
       if(e.currentTarget?.src !== '' )  sweetalert_error("cache not found.")
         //alert("cache not found.")
});

$('.fabric_style_btn').unbind('click');
$('body').on("click", ".fabric_style_btn", function(){
   $('.fabric_style_btn img').toggleClass('active');
   $(".thumb_list_wrap div").toggleClass('active');
});

$(".style_lib").on("click", "li", function(e){
e.stopPropagation()
if(isQrScan){
let selectedFabProduct = $(this).attr("fab-product") || ''
addRemoveActiveClass([`[fab-product='${selectedFabProduct}']`],[".style_lib ul li.active",".style_lib"])
changeStyleProduct(selectedFabProduct)
} 

})

$('body').on('click', "#shareButton", function(){
   $('#downloadButton').toggle();//css("display", "none");
   $('#copyLinkButton').toggle();//css("display", "none");

})

$("body").on("click",".style_thumb_wrap",function(){
   if(isQrScan) {
   $(".style_thumb li.active").removeClass("active")
   let currentTarget = $(this)
   currentTarget.parent().addClass("active")
   let selectedModel = currentTarget.attr("modelName")
   let activeProduct = currentTarget.attr("product")
   let activeDesign = document.querySelector("#appendFabricList li.active .fabric_img").attributes.designname.value
   let supplier_id = $("#appendFabricList li.active").attr("supplierid")
   AppendFinalModel([activeDesign],selectedModel,activeProduct,supplier_id)
   }
})

$(".style_list_wrap,.style_thumb_wrap").unbind('click')
$(".style_list_wrap,.style_thumb_wrap").click(function(e){
      console.log(e.currentTarget)
})

$("body").on("click",".btn_style_lib",function(e){
      $(".style_lib").toggleClass('active')
      e.stopPropagation();
})
$("body").on("click",function(){
   $(".style_lib.active")?.removeClass('active')
})
$("body").on("click",".style_list_wrap",function(){
   $(".style_thumb_list li.active").removeClass("active")
   let currentTarget = $(this)
   currentTarget.parent().addClass("active")
   let selectedModel = currentTarget.attr("modelName")
   let activeProduct = currentTarget.attr("product")
   let activeDesign = document.querySelector("#appendFabricList li.active .fab_img").attributes.designname.value
   let supplier_id = $("#appendFabricList li.active").attr("supplierid")
   AppendFinalModel([activeDesign],selectedModel,activeProduct,supplier_id)
})

$(".menu_buttons").on("click",'#styleButton',function(){
   $(".style").toggle()
   $(".fabric").css("display", "none")
   $('#styleThumbImageList').addClass('active');
   addRemoveActiveClass(["#styleButton"],["#fabricButton"])
});

$(".cross_btn").unbind('click');
$(".cross_btn").on('click', function() {
   $(".camera_popup").css("display","none");
   scanner.stop();
});
var timeout
$("body").on("input","#q_search",function(e){
  clearTimeout(timeout)
    timeout = setTimeout(()=>{
      // console.log(e.currentTarget.value)
      let searchedValue = e.currentTarget.value
      if(searchedValue.includes("?k=" && "&t=")){
         e.currentTarget.value = ''
         QrscanResult(searchedValue)
      }
   },500)
})

$('#q_search').unbind('click');
$("body").on("keyup","#q_search",function(e){
   let searchedValue = e.currentTarget.value
   if (e.keyCode === 13 && !(searchedValue.includes("?k=" && "&t="))) {
      TextSearch()
   }
});
var clearTime = null;
$('#downloadButton').unbind('click');
$("body").on('click', "#downloadButton", function(){
   
   if(isQrScan) {
      let canvas = document.createElement('canvas');
      var imageDiv = document.getElementById('modelImage');
      let ctx = canvas.getContext('2d');
      canvas.style.border = '1px solid #000';
      //var imageDiv = document.getElementById('modelImage');
   
      
      var img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img,0,0, canvas.width, canvas.height); // Draw image at position (50, 50) with width 200 and height 200
            downloadCanvas();
      };
      img.src = imageDiv.attributes.src.value.replaceAll(" ", "%20"); // Provide the path to the image
   }


   // Function to download the canvas as an image
   function downloadCanvas() {
      // alert("clickme 1")
      try {
      var imageDiv = document.getElementById('modelImage');
       var link = document.createElement('a');
       let downloadImageName = imageDiv.attributes.src.value.split("/");
       downloadImageName = downloadImageName[downloadImageName.length - 1]
       downloadImageName = downloadImageName.replaceAll("%20"," ");
       link.download = `${(downloadImageName.split(".")[0]).toUpperCase() + ".jpg"}`;
      link.href = canvas.toDataURL('image/jpeg', 0.7);
      link.click();
      } 
      catch (error) {
         sweetalert_error(error)
      }
   }

});

$('#copyLinkButton').unbind('click');
$("body").on('click', "#copyLinkButton", function(){
   const baseUrl = window.location.href.split("?")[0];
   let supplierID =  $("#appendFabricList li.active").attr("supplierid");
   supplierID = parseInt(supplierID).toString(16);
   let designName = "";
   if(isQrScan) {
   designName = isMobile() ? $("#appendFabricList li.active .fab_img").attr("designname") : $("#appendFabricList li.active .fabric_img").attr("designname")
   } else {
   designName = isMobile() ? $("#appendFabricList li.active .fab_img").attr("designname") : $("#appendFabricList li.active .fabric_img").attr("designname")
   }
   const link = baseUrl.split('#')[0] + "?k=" + supplierID + "&t=" + designName;
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
      //$tempInput.remove();
});

$(".title_box_icon_wrap").on("click",".icon_search",function(e){
      TextSearch()
})

function changeStyleProduct(selectedFabProd){
   $(".style_thumb ul").hide()
   $(`[id='${selectedFabProd}']`).show()
   let selectedProduct = $(".style_lib li.active span")[0]?.innerText
      selectedProduct && ($(".btn_style_lib b")[0].innerText = selectedProduct)
}

function addRemoveActiveClass(addList,removeList){
   try{
      removeList?.forEach((selector)=>{
         let detectType = selector[0]
        // if(detectType === '#') document.getElementById(`${selector}.active`).classList.remove('active')
         $(`${selector}.active`).removeClass("active")
      })

      addList?.forEach((selector) => {
         $($(selector)[0])?.addClass("active")
      })
   }catch(err){
      console.error(err)
   }
}

function TextSearch(){
   let supp_id = $("#appendFabricList li.active").attr("supplierid")
   let inputBoxTarget = $("#q_search")[0]
   let searchedValue = inputBoxTarget?.value?.trim()
   if(!(searchedValue)) {
      setTimeout(()=>{
         sweetalert_warning("Enter Fabric Name")
      }, 0)
      inputBoxTarget.value = ''
      return
   }
   let des_Name = [searchedValue]
   let obj = { supp_id, des_Name}
   if(isFabExist(supp_id,des_Name[0])){
      $(`li[supplierid=${supp_id}] .fabric_thumb_wrap [designname='${des_Name[0].replaceAll(" ","%20")}']`).click()
      // $("#q_search")[0]?.value = ''
      inputBoxTarget.value = ''
      sweetalert_warning("fabric already Exist");
      return 
      }
      inputBoxTarget.value = ''
   obj.des_Name && obj.supp_id && QrAppendData(obj)
}

$("body").on('click','.fab_fullview', function() {
   let selected_list = $('ul#appendFabricList').find('li.active');
   let background_img = selected_list.children().children()[0].attributes.style.value;
   var url = background_img.match(/url\(['"]?([^'"]+)['"]?\)/)[1];
   $(".fabric_fullview_img").css({"background-image": "url(" + url + ")"});
   console.log(url);

})
$("body").on('click','.fabric_info', function(event) {
   event.stopPropagation();
   // console.log($(this));
   let background_img = $(this).parent().children()[0].attributes.style.value;
   var url = background_img.match(/url\(['"]?([^'"]+)['"]?\)/)[1];
   $(".fabric_fullview_img").css({"background-image": "url(" + url + ")"});
   console.log(url);

})
$('body').on('touchstart', ".model_img_box", function(event){
   event.stopPropagation();
   touchStart(event,true);
});

$('body').on('touchend', ".model_img_box", function(event){
   event.stopPropagation();
   touchEnd(event);
});

$('body').on('touchmove', ".model_img_box", function(event){
   event.stopPropagation();
   touchMove(event,true);
});
// $('body').on('click', ".model_img_box", function(event){
//    event.stopPropagation();
//    console.log(event);
//    touchMove(event,true);
// });
$('body').on('mousedown', ".pinch-zoom-container", function(event){
   event.stopPropagation();
   touchStart(event,false);
});

$('body').on('mouseup', ".pinch-zoom-container", function(event){
   event.stopPropagation();
   touchMove(event,false);
   touchEnd(event);
});

function previousSwap(){
   let styleListCount = $(".style_list_wrap").length ? $(".style_list_wrap").length : $(".style_thumb_wrap").length
   if(styleListCount < 1) {
      return
   } else {
      if(window.screen.width > 1080) {
         //style_thumb
         $($('.style_thumb li.active').prev('li')[0]).children().click();
      } else {
         $($('.style_thumb_list li.active').prev('li')[0]).children().click();
      }
      
   }
}

function nextSwap() {
   let styleListCount = $(".style_list_wrap").length ? $(".style_list_wrap").length : $(".style_thumb_wrap").length
   if(styleListCount <= 1) {
      return
   } else {
      if(window.screen.width > 1080) {
         $($('.style_thumb li.active').next('li')[0]).children().click();
      } else {
         $($('.style_thumb_list li.active').next('li')[0]).children().click();
      }
   }
}
var startingX , startingY , movingX , movingY = 0;
function touchStart(evt, istouch) {
   if(istouch)
   {
      startingX = evt.touches[0].clientX;
      startingY = evt.touches[0].clientY;
   }
   else
   {
      startingX = evt.offsetX;
      startingY = evt.offsetY;
   }
}
function touchMove(evt, istouch) {
   if(istouch)
   {
   movingX = evt.touches[0].clientX;
   movingY = evt.touches[0].clientY;
   }
   else
   {
      movingX = evt.offsetX;
      movingY = evt.offsetY;
   }  
}
function touchEnd() {
   if (startingX + 100 < movingX) {
      previousSwap();
   } else if (startingX - 100 > movingX) {
      nextSwap();
   }
}

$('body').on('click', '#groupInfo > div', function (e) {
   $('.group.active').removeClass('active');
   $(this).addClass('active');
})

// $('body').on('click', '.prev_fabric', function(){
//    console.log("click to prev")
//    clickOnModelPrevBtn();
// });

// $('body').on('click', '.next_fabric', function(){
//    console.log('click to next');
//    clickOnModelNextBtn();
// });



