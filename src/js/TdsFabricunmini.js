// v1 - initial plugin deploy | TdsFabric.min.js
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 359:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ Utils)
/* harmony export */ });
function Utils(errorOutputId) {
  // eslint-disable-line no-unused-vars
  var self = this;
  this.errorOutput = document.getElementById(errorOutputId);
  var OPENCV_URL = 'opencv.js';
  this.loadOpenCv = function (onloadCallback) {
    var script = document.createElement('script');
    script.setAttribute('async', '');
    script.setAttribute('type', 'text/javascript');
    script.addEventListener('load', function () {
      onloadCallback();
    });
    script.addEventListener('error', function () {
      self.printError('Failed to load ' + OPENCV_URL);
    });
    script.src = OPENCV_URL;
    var node = document.getElementsByTagName('script')[0];
    node.parentNode.insertBefore(script, node);
  };
  this.createFileFromUrl = function (path, url, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = function (ev) {
      if (request.readyState === 4) {
        if (request.status === 200) {
          var data = new Uint8Array(request.response);
          cv.FS_createDataFile('/', path, data, true, false, false);
          callback();
        } else {
          self.printError('Failed to load ' + url + ' status: ' + request.status);
        }
      }
    };
    request.send();
  };
  this.loadImageToCanvas = function (url, cavansId) {
    var canvas = document.getElementById(cavansId);
    var ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    var img = new Image();
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.height, img.width);
    };
    img.src = url;
  };
  this.executeCode = function (textAreaId) {
    try {
      this.clearError();
      var code = document.getElementById(textAreaId).value;
      eval(code);
    } catch (err) {
      this.printError(err);
    }
  };
  this.clearError = function () {
    this.errorOutput.innerHTML = '';
  };
  this.printError = function (err) {
    if (typeof err === 'undefined') {
      err = '';
    } else if (typeof err === 'number') {
      if (!isNaN(err)) {
        if (typeof cv !== 'undefined') {
          err = 'Exception: ' + cv.exceptionFromPtr(err).msg;
        }
      }
    } else if (typeof err === 'string') {
      var ptr = Number(err.split(' ')[0]);
      if (!isNaN(ptr)) {
        if (typeof cv !== 'undefined') {
          err = 'Exception: ' + cv.exceptionFromPtr(ptr).msg;
        }
      }
    } else if (err instanceof Error) {
      err = err.stack.replace(/\n/g, '<br>');
    }
    this.errorOutput.innerHTML = err;
  };
  this.loadCode = function (scriptId, textAreaId) {};
  this.addFileInputHandler = function (fileInputId, canvasId) {
    var inputElement = document.getElementById(fileInputId);
    inputElement.addEventListener('change', function (e) {
      var files = e.target.files;
      if (files.length > 0) {
        var imgUrl = URL.createObjectURL(files[0]);
        self.loadImageToCanvas(imgUrl, canvasId);
      }
    }, false);
  };
  function onVideoCanPlay() {
    if (self.onCameraStartedCallback) {
      self.onCameraStartedCallback(self.stream, self.video);
    }
  }
  ;
  this.startCamera = function (resolution, callback, videoId) {
    var constraints = {
      'qvga': {
        width: {
          exact: 320
        },
        height: {
          exact: 240
        }
      },
      'vga': {
        width: {
          exact: 640
        },
        height: {
          exact: 480
        }
      }
    };
    var video = document.getElementById(videoId);
    if (!video) {
      video = document.createElement('video');
    }
    var videoConstraint = constraints[resolution];
    if (!videoConstraint) {
      videoConstraint = true;
    }
    navigator.mediaDevices.getUserMedia({
      video: videoConstraint,
      audio: false
    }).then(function (stream) {
      video.srcObject = stream;
      video.play();
      self.video = video;
      self.stream = stream;
      self.onCameraStartedCallback = callback;
      video.addEventListener('canplay', onVideoCanPlay, false);
    })["catch"](function (err) {
      self.printError('Camera Error: ' + err.name + ' ' + err.message);
    });
  };
  this.stopCamera = function () {
    if (this.video) {
      this.video.pause();
      this.video.srcObject = null;
      this.video.removeEventListener('canplay', onVideoCanPlay);
    }
    if (this.stream) {
      this.stream.getVideoTracks()[0].stop();
    }
  };
}
;

/***/ }),

/***/ 82:
/***/ (() => {

var ImageName;
var g = document.createElement('div');
g.setAttribute("id", "mainDivId");
document.body.append(g);
var CropWidthInch = 0;
var CropHeightInch = 0;
var cropDiv = document.getElementById('cropDiv');
if (cropDiv) cropDiv.append(g);else {
  cropDiv = document.createElement("div");
  cropDiv.id = "cropDiv";
  cropDiv.className = "blackTds";
  cropDiv.append(g);
  document.body.append(cropDiv);
}
$("#cropDiv").css("display", "none");
$('#mainDivId').css("display", "none");
$('#mainDivId').css("position", "absolute");
$('#mainDivId').css("z-index", "9999999999");
$('#mainDivId').css("width", "100%");
$('#mainDivId').css("top", "0");
$('#mainDivId').css("right", "0");
var homepageHtml = '<div id="bodyDiv"><header>' + '         <div class="tab tab-header">' + '            <div class="ci-header_text"><h4 id="title"></h4></div>            ' + '<div class="nav gallery" id="gallery-btn" style="float: left;" title="select image">  <label for="imageUp" class="imgup"> <img class="size gallery" src="" alt="Select Image" loading="lazy"><span>Import</span> </label>' + '<input id="imageUp" type="file" accept="image/*" style="display:none;"></div> ' + '  <a class="btn btn-primary" id="download-dpi-btn" style="float: right;" title="Save Image"><img class="downloadcss" src=""><span>Download</span></a>' + '  <div class="login-downloadbt">' + '     <a class="btn btn-primary" id="login_btn" style="float: right;" title="login button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16"> <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/></svg><span>Login</span>' + '    </a>' + '   </div>' + '  <hr style="border: none; border-left: 1px solid #fff; height: 28px;position: absolute"></hr>' + '  <div class="afterUserlogged" style="display:none">' + '     <a class="btn"  id="login_logout" style="float: right;" title="login button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16"> <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/></svg>Hi, <span id="show_myuser">username</span>' + '     </a>' + '  <div id="user-menu" style="display:none">' + '      <button>Logout </button>' + '  </div>' + '</div>' + '    <div id="closeapp"><img class="closecss" src="" ></div>' + '      </header>' + '       <div class="custom_display" id="custom_browse" style="float: left;" title="select image"><div class="inner_upload_box" ><img class="size gallery" src="" loading="lazy"><span>Browse Fabric</span></div></div>' + '      <div id="_maxDiv"  style="width: 200px;height: 200px;"><canvas id=\'_max\' width=100 height=100></canvas></div>' + '      <div class="window" id="editor">' + '         <div class="maincropimg" >            ' + '            <img id="old" >    ' + '            <img id="cropdimg" src="" style="display: none;" crossorigin="Anonymous">       ' + '            <canvas id="new"></canvas> <!-- class="panzoom" -->' + '            <canvas  id="cropCanvas" class="zooming" style="display: none;"></canvas>                    ' + '            <canvas id=\'_cv\' width=500 height=500 style="display: none;"></canvas>' + '            <canvas id="_imageResult" style="right: 5%;position: absolute; display: none;"></canvas>' + '         </div>' + '         <div id="menuTabs" >     ' + '            <div class="back" id="prevID" name="prev"><div class="newNext"><img class="back-icon" src="" loading="lazy"><span>Previous</span></div></div>     ' + '         ' + '         <ul class="setting setting-2" id="c-settings">' + '            <li class="item" id="newcrop-item"><img class="circular lo-pulse newcropimg"  src="" loading="lazy"><small class="ci-label">Crop</small></li>' + '            <li class="item" id="rotation-item" ><img class="circular lo-pulse rotationimg"  src="" loading="lazy"><small class="ci-label">Rotation</small></li>' + '            <li class="item" id="flip-item"><img class="circular lo-pulse flipimg"  src="" loading="lazy"><small class="ci-label">Flip</small></li>' + '         </ul>' + '         <ul class="setting setting-2" id="filters">                      ' + '         <li class="item" id="rgb-item"><img class="circular lo-pulse rgbimg" src="" loading="lazy"><small class="ci-label">Rgb</small></li><li class="item" id="brightness-item"><img class="circular lo-pulse brightness"  src="" loading="lazy"><small class="ci-label">Brightness</small></li>' + '         <li class="item" id="contrast-item"><img class="circular lo-pulse contrast"  src="" loading="lazy"><small class="ci-label">Contrast</small></li>' + '         <li class="item" id="saturation-item"><img class="circular lo-pulse saturation"  src="" loading="lazy"><small class="ci-label">Saturation</small></li>' + '         <li class="item" id="sharpen-item"><img class="circular lo-pulse sharpen"  src="" loading="lazy"><small class="ci-label">Sharpen</small></li>' + '         </ul>           ' + '         <ul class="setting setting-2 lock" id="settings">       ' + '                   <div class="optionForm">' + '                   <span class="customlabel" for="Units">Unit</span>' + '                  <select name="" class="dropdownUnits" id="UnitsId">' + '                   <option id="inches" value="Inches">Inch</option>' + '                   <option id="cm"value="Cm">Cm</option>' + '                  </select> ' + '                   </div>' + '                   <div class="optionForm">' + '                  <span for="width" class="customlabel">Width</span>' + '                  <input type="number" placeholder="value" class="customInputBx" id="cwidth" name="fwidth" autocomplete="off" min="1" max="20" inputmode="decimal">' + '                   </div>' + '                   <div class="optionForm compress">' + '                    <span class="imglock"><img class="lockimg" src="" loading="lazy"></span>' + '                    <span class="imgunlock"><img class="unlockimg" src="" loading="lazy"></span>' + '                    <input type="checkbox" class="checkBoxC" id="aspectCheckId" >' + '                   </div>' + '                   <div class="optionForm">' + '                  <span for="height" class="customlabel">Height</span>' + '                  <input type="number" placeholder="value" class="customInputBx" id="cheight" name="fheight" autocomplete="off" min="1" max="20" inputmode="decimal">' + '                    </div>' + '                   <div class="optionForm scale">' + '                    <input id="apply_btn" class="ci_nBtn scale bt1 nomobile" type="button" value="Apply">' + '                     <div class="mobile-icon apply_btn1" id="apply_btn" ><img class="mobileapply" src=""></div>' + '                    </div>' + '                   <div id="reset-size" class="optionForm" style="min-width:auto">' + '                    <div id="reset_btn_settings" class="back action_bt innerback showgrey nomobile">Reset</div>' + '                    <div class="mobile-icon" id="reset_btn_settings"><img class="refreshbtn" src=""></div>' + '                    </div>' +
//'                 <a class="newNext" id="export-btn" name="next"><img class="next-icon" src="https://res.cloudinary.com/tdscloudcdn/DAM/crop/img/next1.svg"><span>Next</span></a>'+

'                  <div class="next-wrapp"><a class="next_save" id="saveNext-btn" name="next"><img class="next-icon" src=""><span>Next</span></a></div>' + '         </ul>   ' + '         <div class="next_save next_" id="nextID" name="next"><div class="newNext"><span>Next</span><img class="next-icon" src="" loading="lazy"></div></div>' + '         </div>' + '         <ul class="setting" id="newCrop">' + '           <div class="innerbuttons">' + '            <div class="back showgrey showdone cancelCrop">Cancel</div>' + '             <input id="crop_btn" class="ci_btn cropcc action_bt" type="button" value="Crop">' + '           </div>' + '         </ul>' + '         <ul class="setting" id="rotation">' + '           <div class="innerbuttons">' + '            <input class="ci_btn rotatecc showgrey " type="button" value="Rotate" id="rotateimg">' + '            <div class="back action_bt done_btn" id="rotate_done">Apply</div>' + '             </div>' + '         </ul>' + '         <ul class="setting" id="flip">' + '           <div class="innerbuttons">' + '             <div class="flip-btns">' + '            <input id="flip_H" class="ci_btn flipH showgrey" type="button" value="Flip Horizontal ">' + '            <input id="flip_V" class="ci_btn flipV showgrey" type="button" value="Flip Vertical">' + '             </div>' + '            <div class="ci_btn back action_bt done_btn" id="flipDone">Apply</div>' + '             </div>' + '         </ul>' + '         <ul class="setting" id="brightness">' + '           <div class="innerbuttons">' + '            <div class="back action_bt fback">Back<img class="back-icon" src="" style="display:none"></div>' + '            <li class="item" id="rgb-item"><input class="range filter-range" id="b-range" type="range" min="-100" max="100" value="0" step="1">' + '            <small class="clable brightness" style="position: absolute;transform: translateX(-69px);left: 52.5%;margin-left: 0;">Brightness</small></li>' + '             <div id ="brightness_btn" class="back action_bt innerback"><img class="back-icon" src="" style="display:none">Apply</div>' + '            <div id="reset_btnBrighness" class="back action_bt innerback showgrey resetbt reset_btn"><img class="back-icon" src="" style="display:none">Reset</div>' + '             </div>' + '         </ul>' + '         <ul class="setting" id="contrast">' + '           <div class="innerbuttons">' + '           <div class="back action_bt fback">Back<img class="back-icon" src="" style="display:none"></div>' + '            <li class="item" id="rgb-item"><input class="range filter-range" id="c-range" type="range" min="-100" max="100" value="0" step="1">' + '            <small class="clable contrast" style="position: absolute;transform: translateX(-69px);left: 52.5%;margin-left: 0;">Contrast</small></li>' + '             <div id ="contrast_btn" class="back action_bt innerback"><img class="back-icon" src="" style="display:none">Apply</div>' + '            <div id="reset_btnContrast" class="back action_bt innerback showgrey resetbt reset_btn"><img class="back-icon" src="" style="display:none">Reset</div>' + '              </div>' + '         </ul>' + '         <ul class="setting" id="saturation">' + '           <div class="innerbuttons">' + '           <div class="back action_bt fback" id="">Back<img class="back-icon" src="" style="display:none"></div>' + '            <li class="item" id="rgb-item"><input class="range filter-range" id="s-range" type="range" min="0" max="2" value="1" step="0.1">' + '            <small class="clable saturation" style="position: absolute;transform: translateX(-69px);left: 52.5%;margin-left: 0;">Saturation</small></li>' + '            <div id="saturation_btn" class="back action_bt innerback"><img class="back-icon" src=""style="display:none">Apply</div>' + '            <div id="reset_btnSaturate" class="back action_bt innerback showgrey resetbt reset_btn"><img class="back-icon" src="" style="display:none">Reset</div>' + '               </div>' + '         </ul>        ' + '         <ul class="setting" id="sharpen">' + '           <div class="innerbuttons">' + '           <div class="back action_bt fback" id="">Back<img class="back-icon" src="" style="display:none"></div>' + '            <li class="item" id="rgb-item"><input class="range filter-range" id="sharpen-range" type="range" min="0" max="1" value="0" step="0.01">' + '            <small class="clable sharpen" style="position: absolute;transform: translateX(-69px);left: 53%;margin-left: 0;">Sharpen</small></li>' + '            <div id="sharpen_btn"class="back action_bt innerback"><img class="back-icon" src="" style="display:none">Apply</div>' + '            <div id="reset_btnSharpen" class="back action_bt innerback showgrey resetbt reset_btn"><img class="back-icon" src="" style="display:none">Reset</div>' + '           </div>' + '         </ul>         ' + '         <ul class="setting" id="rgb">' + '            <div class="innerbuttons">' + '            <div class="back action_bt fback" id="">Back<img class="back-icon" src="" style="display:none"></div>' + '            <li class="item" id="rgb-item"><input class="range filter-range" id="rgb-r-range" type="range" min="0" max="255" value="0" step="1"style="margin-right: 10px;">' + '               <small class="clable red" style="position: absolute;transform: translateX(-69px);left: 31%;margin-left: 0;">Red</small></li>' + '            <li class="item" id="rgb-item">' + '               <input class="range filter-range" id="rgb-g-range" type="range" min="0" max="255" value="0" step="1" style="margin-right: 10px;"><small class="clable green" style="position: absolute;transform: translateX(-69px);left: 53%;margin-left: 0;">Green</small></li>' + '            <li class="item" id="rgb-item"><input class="range filter-range" id="rgb-b-range" type="range" min="0" max="255" value="0" step="1">' + '            <small class="clable blue" style="position: absolute;transform: translateX(-69px);left: 75%;margin-left: 0;">Blue</small></li>' + '            <div id="rgb_btn" class="back action_bt innerback"><img class="back-icon" src="" style="display:none">Apply</div>' + '            <div id="reset_btnRgb" class="back action_bt innerback showgrey resetbt reset_btn"><img class="back-icon" src="" style="display:none">Reset</div>' + '           </div>' + '         </ul>' + '     ' + '         <div class="back" id="back"><img class="back-icon" src="" style="display:none" loading="lazy"></div>' + '         <div class="back" id="c-back"><img class="back-icon" src="" loading="lazy"></div>' + '         <footer>' + '            <div class="tab tab-footer" id="footerTabs" style="display: none;">' + '               <a class="interaction" id="filters-icon"><span>Color</span></a>' + '               <a class="interaction" id="package-icon"><span>Edit</span></a>' + '               <a class="interaction" id="setting-icon"><span>Measure</span></a>                                  ' + '            </div>             ' + '         </footer>' + '      </div>' + '   ' + '      <div class="overlay" id="popup4">' + '         <div class="popup">' + '            <h2>Formats</h2>' + '            <a class="close" href="#">X</a>' + '            <div class="content"><a class="ext png" onclick="window.setType(\'png\')" data-type="png">PNG File</a><a class="ext jpg active-link" onclick="window.setType(\'jpeg\')" data-type="jpeg">JPEG File</a></div>' + '            <br>' + '            <h2>Dimensions</h2>' + '            <div class="content"><a class="dim" data-size="100">100%</a><a class="dim" data-size="90">90%</a><a class="dim" data-size="70">70%</a><a class="dim" data-size="50">50%</a><a class="dim" data-size="30">30%</a><a class="dim" data-size="10">10%</a></div>' + '         </div>' + '      </div>' + '   ' + '      <div class="uil-ripple-css" id="loading" style="-webkit-transform:scale(0.6);">' + '         <div></div>' + '         <div></div>' + '      </div>' + '  <div class="ciloader" id="save_fabric_loader" style="display: block;position: absolute; margin: auto;top: 0;left: 0;bottom: 0;right: 0; width: 100px;height: 100px;z-index: 9999;">' + '           <div class="loader-container loader_Old" id="New_loader_css" style="display: block;">' + '                   <div class="loader-circle"></div> ' + '                    <div class="loader-image"> ' + '                           <img src="https://s3.ap-south-1.amazonaws.com/aws.tds/dam/q3d/images/spinner_img.png" >' + '                     </div>' + '            </div>' + '  </div>' + '    </div>' +
//new3
'<div class="confirmPopupOverlay" id="confirmPopupOverlay" style="display:none">' + '<div class="confirmPopup" >' + '   <div id="close-header" class="close-header">' + '    <img class= "closecss" src="" loading="lazy">' + '  </div>' + ' <div>' + '           <div class="text-message" id="popupMessage"  >' +
//    '         Do you Want to Save this Fabric? or just View temporarily ?'+
'           </div>' + '           <div class="buttonGroup ">' + '               <button class="confirmPopupbt" id="designExists-yesbtn">Yes</button>' + '               <button class="confirmPopupbt" id="designExists-nobtn">No</button>' + '               <button class="confirmPopupbt" id="lossData-yesbtn">Yes</button>' + '               <button class="confirmPopupbt" id="lossData-nobtn">No</button>' + '               <button class="confirmPopupbt" id="applyFilter">Yes</button>' + '               <button class="confirmPopupbt" id="resetFilter">No</button>' + '              <input id="save-design" class="confirmPopupbt confirmok" type="button" title="Save Image"  value="Save"  style="display:none">' + '              <button  id="view-design" class="confirmPopupbt confirmview" style="float: right;display:none" title="View Image" style="display:none"><span>View</span></button>' + '              <button class="confirmPopupbt" id="showQrpopup"> Ok </button>' + '              <button class="confirmPopupbt" id="showcurrent_page"> Ok </button>' + '           </div>' + '  </div>' + '</div>' + '</div>' + '<div class="toast" id="toastMessage" style="position: absolute; top: 20px; right: 20px; display: none;">' + '      <button type="button" class="ml-2 mb-1 close" data-bs-dismiss="toast" aria-label="Close">' + '         <span aria-hidden="true">&times;</span>' + '       </button>' + '   <div class="toast-body" id="toastBody">' + '      This is a toast message!' + ' </div>' + '</div>' + '<div class="window theme" id="package">' + '           <div class="maincidiv">' + '       <header>' + '         <div class="tab tab-header">' + '            <div class="ci-header_text">' + '                   <h4 id="savetitle">Save Design</h4>' + '               </div>' + '            <img id="closeB" class="closecss" src="" style="filter: none;" loading="lazy">' + '         </div>' + '      </header>' + ' <div class="container" style="border: none" id="container_data">' + '        <form>' + '          <div class="designs">' + '            <div class="form_box">' + '              <label class="field_name">Design Name</label>' + '             <div class="input_field">' + '               <input type="text" id="designNameId" class="dname" name="dname" maxlength = "32">' + '                <div id="fabNameError"class="invalid-feedback"></div>' + '            </div>' + '       </div>' + '   </div>' + '  <div class="product_grp">' + '    <div class="form_box ">' + '       <label class="field_name">Design Group</label>' + '       <div class="input_field">' + '        <select name="Group" class="pgcs form-select" id="ProductPtPGForSave" >' + '        </select>' + '       </div>' + '   </div>' + '  </div> ' + "<div class=\"subgroup1\"><div class=\"form_box\"><label class=\"field_name\">Product<span style=\"color:red\"> *</span></label><div class=\"input_field required\"><select id = \"Product\" class=\"seteditable mainProduct form-select\" name=\"Product\" required=\"\"></select><input type=\"text\" class=\"productInput material_input_box\" style=\"visibility:hidden\"  maxlength=\"45\" autocomplete=\"off\"> </div></div></div>\n     <div class=\"subgroup\" id=\"product_ft\">" + '</div>' + '</div>' + '  </form>' + '      <ul class="saveFinalImg" >' + '         <div class="buttonGroup">' + '              <input type="button" value="Save" id="saveFinalImgId" class="ci_nBtn action_bt" >' +
//  '              <input type="button" value="toast messege" id="temporary" class="ci_nBtn action_bt" style="margin-left:1rem">' +
'           </div>' + '         </ul>' + '</div>' + ' </div>' +
// Scan QR Code popup
'<div class="modal fade" id="scan_popup" tabindex="-1" aria-labelledby="scan_popup_ModalLabel" aria-hidden="true">' + '<div class="modal-dialog modal-fullscreen">' + '<div class="modal-content">' + '<div class="modal-header">' + '<h5 class="modal-title" id="scan_popup_ModalLabel">Scan QR Code</h5>' + '<button type="button" class="btn fullviewCloseBtn" data-bs-dismiss="modal" aria-label="Close">' + '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">' + '<path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z">' + '</path>' + '</svg>' + '</button>' + '</div>' + '<div class="modal-body">' + '<div class="qr-link">' + '<div class="qr_img" id="">' + '<canvas id="qrCode"></canvas>' + '</div>' + '<div class="design_name"></div>' + '<div class="design_link">' + '<textarea name="lastname" placeholder="Q3dlink" disabled="" type="text" class="form-control" id="copyToLink" value="">' + '</textarea>' + '</div>' + '<div class="alert alert-dark copy_notification"  role="alert"> Link copied successfully </div>' + '</div>' + '</div>' + '<div class="modal-footer">' + '<button type="button" class="btn" id="copyLinkBtn">Copy Link</button>' + '<button type="button" class="btn" id="downloadBtn">Download</button>' + '<button type="button" class="btn redirect_q3d" id="redirectBtn">Q3D</button>' + '</div>' + '</div>' + '</div>' + '</div>' +
// // login popup
' <div class="modal fade" id="login_popup"  style="display:none">' + '<div class="modal-dialog modal-dialog-centered" role="document">' + '<div class="modal-content">' + '<div class="modal-header">' + '<h3 class="modal-title">Log in</h3>' + '<div class="close_login">' + '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/></svg>' + '</div>' + '</div>' + '<div class="modal-body">' + '<form class="row g-2">' + '<div class="col-md-12 u_user_id">' + '<label for="inputEmail4" class="form-label">Username</label>' + '<input type="text" class="form-control" id="inputEmail4" autofocus="" autocomplete="off" required="" tabindex="1">' + '<div class="invalid-feedback">' + 'Please enter valid user Id' + '</div>' + '</div>' + '<div class="col-md-12 u_user_pass">' + '<label for="loginPagepass" class="form-label">Password</label>' + ' <input type="password" class="form-control" id="loginPagepass" autocomplete="off" required=""  tabindex="2">' + '<div class="u_user_pass_eye">' + '<img alt="password hide icon">' + '</div>' + '<div class="invalid-feedback">' + ' Please enter valid password' + '</div>' + '</div>' + '<div class="col-12 login_wrap">' + '<button type="button" class="btn btn-primary u_login_button"  tabindex="3">' + 'Login' + '</button>' + '</div>' + '</form>';
'</div>' + '</div>' + '</div>' + ' </div>' + '</div>';
var elm = document.getElementById('mainDivId');
elm.innerHTML = homepageHtml;
// function checkWidthHeight(e) {
//    if(e.value > 20) {
//       e.value = null;
//    }
// }

/***/ }),

/***/ 174:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(417);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(607), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `:root{
	--sx-gray-25: #111;
	--btn-primary:#555be7;
	--btn-primary-hover:#464bd3;
	--btn-secondary-hover:#4f9d2f;
	--btn-secondary:#54b52c;
	--btn-grey:#777777;
	--radius-5:0rem;
	--f875:.875rem;	
	--f775:.775rem;
	--f675:.675rem;
	--f975: 0.985rem;
	--header:#fff;
	--text-black:#000;
}	
:host {
    display: block;
    
}
a:active {
	color: #464bd3;
}
select#UnitsId {
    -webkit-appearance: auto;
} 
  input[type="number"] {
    -moz-appearance: textfield; /* Hides the spin buttons in Firefox */
}
input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none; /* Hide for WebKit */
    margin: 0;
}

input[type="number"]::-moz-inner-spin-button {
    display: none; /* Hide for Firefox */
}
input.es-inputci:focus, .dname:focus, .input_field select:focus {
    border-color: #000!important;
    outline: 0;
    box-shadow:none!important;
}
div#package input:focus 
#login_popup .form-label {
    font-size: var(--f975);
    margin-bottom: .4rem !important;
    font-weight: 400;
    color: rgb(24, 23, 23) !important;
}
#login_popup .form-control:focus {
    color: #212529;
    background-color: #fff;
    border-color: #000000;
    outline: 0;    
	box-shadow: none;
}
 #toastMessage{
	position:absolute;
	z-index: 9999;
	top: 50%!important;
    display: block;
    transform: translate(-50%, -50%)!important;;
    left: 50%!important;;
    color: #fff;
    background-color: #000000;
	padding: 1.5rem 1rem;
 }
 div#toastMessage .close {   
    right: .5rem;
    border: 0;
    top: .8rem;
    font-size: 1rem;
    font-weight: 600;
    background: none;
    position: absolute;
}
div#toastMessage span {
    color: #fff;
    font-size: 1.5rem;
}
.login_wrap{
	margin-top: 2rem !important;
}
button, select {
    text-transform: none;
    -webkit-appearance: none;
	
}
button{
	border: 0;
}
option:focus-visible {
	-webkit-appearance: none;
	border-radius: var(--radius-5);
}
input:focus-visible, select:focus-visible {
	 outline: 1px solid #111; 
	outline-offset: 0px solid #111;
	border-radius: 0px;
	outline-color: #111;
  }
  
/* .blackTds div#package input,   .blackTds div#package select {
	min-height: 40px;
} */
.blackTds input.confirmPopupbt{
	background-color: var(--btn-primary)!important;
}

.blackTds .tab-header {
    background-color: var(--header);
}
.blackTds .setting{
	background-color: #fff;
	border-top: 1px solid #e5e5e5;
}
.blackTds #filters, .blackTds #c-settings, .blackTds #settings{
	justify-content: center;
	
}
.blackTds .maincropimg {
    background: whitesmoke;
	margin-top: 60px;
}
.blackTds #nextID,.blackTds a#saveNext-btn{
	background: none;
	min-width: 5.5rem;

}
#settings a#export-btn{
	background: none;
	min-width: 5rem;
}
.blackTds.setting img{
	opacity: 1;
}
.blackTds a#download-dpi-btn{ 
    border:none;
    font-size: var(--f875);
	background-color:var(--btn-primary);
	border-radius: var(--radius-5);
	padding: 0rem 1rem;
    cursor: pointer;
    height: 2.5rem;
	width: auto;
	margin-right: 0.5rem;
}
.blackTds label.imgup{ 
    border:none;
    font-size: var(--f875);
	background-color:var(--btn-secondary);
	/* background-color:var(--btn-primary); */
	border-radius: var(--radius-5);
	padding: 0rem 1rem;
    cursor: pointer;
    margin: .5rem;
    height: 2.5rem;
	width: auto;
	left: .5rem;
	position: absolute;
    top: .1rem;
}
.blackTds a#download-dpi-btn:hover{
	background-color: var(--btn-primary-hover);
}
 .blackTds label.imgup{
	background-color: var(--btn-secondary);
}

.blackTds label.imgup:hover {
    background-color:var(--btn-secondary-hover);
}
.blackTds img#closeB{
	padding: .5rem;
}
.blackTds .newNext{
	border-radius: var(--radius-5);
    border: 1px solid var(--btn-primary);
    padding: 0.4rem .8rem;
    font-size: var(--f875);
	display: flex;
	align-items: center;
    min-width: 5.5rem;
    width: 5.5rem;
	justify-content: center;
	background-color: var(--btn-primary);
	color: #fff;
	cursor: pointer;
	height: 2.5rem;
}
/* .blackTds .next_save{
	border-radius: var(--radius-5);
    border: 1px solid var(--btn-primary);
    padding: 0.4rem .8rem;
    font-size: var(--f875);
	display: flex;
	align-items: center;
    min-width: 5.5rem;
    width: 5.5rem;
	justify-content: center;
	background-color: var(--btn-primary);
	color: #fff;
	cursor: pointer;
	height: 2.5rem;
} */
.blackTds .newNext:hover { 
    background: #464bd3;
    color: #fff;
}
.blackTds button#yesbtn{
    background: #464bd3;
    color: #fff;
}
.blackTds button#yesbtn:active{
    background: var(--btn-primary-hover);
   
}
.blackTds button#nobtn{
    background: #000;
    color: #fff;
}
.blackTds .next-icon {
    width: 26px;
    height: 26px;
    color: #000000;
    background: none!important;
    border-radius: 50%;	
	margin-left: 0;
	opacity: 1;
	padding-left: 0 !important;
    padding-right: 0 !important;
}
.blackTds .back-icon {
    width: 26px;
    height: 26px;
    color: #000000;
    background: none!important;
    border-radius: 50%;	
	opacity: 1;
    padding-left: 0 !important;
    padding-right: 0 !important;
}
.blackTds .setting img{
	filter: invert(1);
}
 .fback img{
	filter: none!important;
}

.blackTds .back-icon:hover, .blackTds .next-icon:hover{
	background: #464bd3;
}
.blackTds .tab-header{
	height: 60px;
	display: flex;
    align-items: center;
	justify-content: right;
	padding: 0 1rem;
	padding-right: 60px;
}
.blackTds #prevID{
	background: none;
}
.blackTds .customInputBx,.blackTds  .dropdownUnits{
	box-shadow: none;
    border: 0;
	border-radius: var(--radius-5);
	border: none;
}
.blackTds .ci_btn{
	border-radius: var(--radius-5);
	margin-top: 0!important;	
}
.blackTds .innerbuttons {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
	/* width: 100vw; */
}

.innerbuttons .showgrey {
    position: static!important;
	transform: none !important;
	background-color: #5d5d5d !important;
	
}
div#reset_btn_settings.nomobile {
    min-width: 6rem;
    height: 2rem;
    margin-top: 1rem;
    transform: none;
}
.blackTds .back.showgrey {
    padding: 0.5rem 1rem;
    height: auto;  
    background-color: #5d5d5d !important;
    border-radius: var(--radius-5);
    color: #fff;
	cursor: pointer;
	justify-content: center;
    font-family: 'Poppins', sans-serif;
    font-size: var(--f875);
	min-width: 120px;
	margin-right: 1rem;
	top: 50%;
    transform: translate(-50%, -50%);
}

.blackTds .action_bt {  
	background-color: var(--btn-primary) !important;
    color: #fff;
    cursor: pointer;
    justify-content: center;
    font-family: 'Poppins', sans-serif;
    font-size: var(--f875);
    min-width: 120px;
    padding: 0.5rem 1rem;
    height: auto;
	position: static;
	border-radius: var(--radius-5);
}
.blackTds .fback {  
	background-color: #5d5d5d !important; 
}
.blackTds .fback:hover{  
	background-color:var(--btn-primary-hover); 
}
.blackTds .action_bt:hover{
	background-color: var(--btn-primary-hover)!important;
}

.blackTds .clable, .blackTds .customlabel{
	color: #000!important;
	font-size: .7rem;
}
.blackTds .rotatecc {
	/* background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8IS0tIENyZWF0b3I6IENvcmVsRFJBVyBYNiAtLT4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iOC41aW4iIGhlaWdodD0iMTFpbiIgdmVyc2lvbj0iMS4xIiBzdHlsZT0ic2hhcGUtcmVuZGVyaW5nOmdlb21ldHJpY1ByZWNpc2lvbjsgdGV4dC1yZW5kZXJpbmc6Z2VvbWV0cmljUHJlY2lzaW9uOyBpbWFnZS1yZW5kZXJpbmc6b3B0aW1pemVRdWFsaXR5OyBmaWxsLXJ1bGU6ZXZlbm9kZDsgY2xpcC1ydWxlOmV2ZW5vZGQiDQp2aWV3Qm94PSIwIDAgODUwMCAxMTAwMCINCiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+DQogPGRlZnM+DQogIDxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQogICA8IVtDREFUQVsNCiAgICAuZmlsMCB7ZmlsbDpub25lfQ0KICAgIC5maWwxIHtmaWxsOiNGRUZFRkV9DQogICBdXT4NCiAgPC9zdHlsZT4NCiA8L2RlZnM+DQogPGcgaWQ9IkxheWVyX3gwMDIwXzEiPg0KICA8bWV0YWRhdGEgaWQ9IkNvcmVsQ29ycElEXzBDb3JlbC1MYXllciIvPg0KICA8cmVjdCBjbGFzcz0iZmlsMCIgd2lkdGg9Ijg1MDAiIGhlaWdodD0iMTEwMDAiLz4NCiAgPHBhdGggY2xhc3M9ImZpbDEiIGQ9Ik0xMTg4IDcxOWMyOTMsMTEgNTIyLDI1NyA1MTEsNTUxbC01MiAxNDAxYzcxOSwtNTU3IDE2MjIsLTg5MCAyNjAyLC04OTAgMjM0NywwIDQyNTAsMTkwMyA0MjUwLDQyNTAgMCwyMzQ3IC0xOTAzLDQyNTAgLTQyNTAsNDI1MCAtMjM0NywwIC00MjUwLC0xOTAzIC00MjUwLC00MjUwIDAsLTI5MyAyMzgsLTUzMSA1MzEsLTUzMSAyOTMsMCA1MzEsMjM4IDUzMSw1MzEgMCwxNzYwIDE0MjcsMzE4OCAzMTg4LDMxODggMTc2MCwwIDMxODgsLTE0MjcgMzE4OCwtMzE4OCAwLC0xNzYwIC0xNDI3LC0zMTg3IC0zMTg4LC0zMTg3IC04MzksMCAtMTYwMywzMjQgLTIxNzIsODU1bDE4MDkgMjExYzI5MSwzNCA1MDAsMjk4IDQ2Niw1ODkgLTM0LDI5MSAtMjk4LDUwMCAtNTg5LDQ2NmwtMjc2MiAtMzIzYy0yNzUsLTMyIC00ODAsLTI3MCAtNDY5LC01NDdsMTA2IC0yODY1YzExLC0yOTMgMjU3LC01MjIgNTUxLC01MTF6Ii8+DQogPC9nPg0KPC9zdmc+DQo=);	 */
	background-size: 14px;
    background-repeat: no-repeat;
    background-position: 14px;	
}
.blackTds #title{
	color:var(--text-black)
}
.blackTds a#saveNext-btn {
    height: auto;
    bottom: auto;
    width: 5.5rem;
	align-items: center;
    width: 5.5rem;
    justify-content: center;
	color: #fff;
	text-decoration: none;
	background-color:var(--btn-primary);
	font-family: 'Poppins', sans-serif;
    font-size: var(--f875);
	padding: 8px;
	border-radius: var(--radius-5);
	top: auto;
    position: fixed;
    right: 9.5rem;
}
#settings a#export-btn {
    height: auto;
    bottom: auto;
    width: 5rem;
	align-items: center;
    width: 5rem;
    justify-content: center;
	color: #fff;
	text-decoration: none;
	background-color:var(--btn-primary);
	font-family: 'Poppins', sans-serif;
    font-size: var(--f875);
	padding: 8px;
	border-radius: var(--radius-5);
	top: auto;
    position: fixed;
    right: 9.5rem;
}
.blackTds a#saveNext-btn{
	background-color: var(--btn-primary-hover);
	right: 10%;
}
#settings a#export-btn{
	background-color: var(--btn-primary);
	right: 10%;
	border: 1px solid var(--btn-primary);
	
}

.blackTds a#saveNext-btn:hover{
	background-color: var(--btn-primary-hover);
	cursor: pointer;
}
#settings a#export-btn:hover{
	background-color: var(--btn-primary-hover);
	cursor: pointer;
}
.blackTds .confirmPopup{
	border-radius:.5rem;
}
input[type="range"] {
	-webkit-appearance: none;	
	background: #434343 !important; /* Track color */
	
  }
  
  /* Style the thumb (the draggable part) */
  input[type="range"]::-webkit-slider-thumb {
	-webkit-appearance: none;
	width: 20px; /* Adjust as needed */
	height: 20px; /* Adjust as needed */
	background: var(--btn-primary); /* Thumb color */
	cursor: pointer;
	border-radius: 50%;
  }
  .blackTds .setting [type="range"]{
    margin-top: 0;
	margin-bottom: 1rem;
  }
  .blackTds .clable{
    margin-top: 25px;
  }
  .blackTds .maincidiv .tab-header {
    background: #545ae4;
    color: #fff;  
	margin-bottom: 0;
}
/* ul#settings.lock #cheight {
    color: #595959;
} */
.close-header .fa-close {
    margin-top: .5rem;
    margin-right: -0.5rem;
    display: block;
}
div#close-header img {
    width: 36px;
    height: 36px;
    padding: .5rem;
}
.blackTds .text-message {
    font-weight: 600;
    margin-bottom: 1.4rem;
}
input.ci_nBtn.scale.bt1{
	display: flex;
}
input.ci_nBtn.scale.bt2{
	display: none;
    background-size: 20px;
    background-position: center;
    background-repeat: no-repeat;
	background-image: url(${___CSS_LOADER_URL_REPLACEMENT_0___});		
}
div#closeapp {
    position: absolute;
    width:  2.5rem;   
	height:  2.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer; 
    z-index: 999;	
      top: 0.6rem;
    right: .6rem;
	/* background-color: #000; */
}
div#closeapp:hover {
    background: var(--btn-primary-hover);
}
div#closeapp:hover img {
    filter: invert(100%) !important;
}
div#closeapp img {
    width: 50%;
    opacity: 1;
    /* filter: invert(250%); */
}
@media (min-width:1000px){
	.newNext img, .next_save img{
		display: none;
	}
	#nextID, .back, #prevID {			
		/* min-width:120px!important; */
		min-width:6rem!important;
		max-width: 6rem;
		width: 6rem !important;
	}
	.blackTds .fback{
		margin-right: 2rem;
	}
}
@media(max-width:768.99px){
	.blackTds #filters, .blackTds #c-settings, .blackTds #settings{
		justify-content: left;
	}
	a#saveNext-btn span {
		display: none;
	}
	.blackTds #filters, .blackTds #c-settings, .blackTds #settings{
		justify-content: left;
	}
	.next-wrapp {
		background: #fff !important;
		min-width: 4rem !important;
		
		max-width: 4rem;
		width: 4rem !important;
		position: fixed;
		background: #fff;
		height: 70px;
		display: flex;
		align-items: center;
		right: -1px;
		z-index: 9;
	}
	input.ci_nBtn.scale.bt1{
		display: none;
	}
	input.ci_nBtn.scale.bt2{
		display: flex;
		height: 30px;
   		 width: 30px;
	}
	.optionForm.scale {
		min-width: 30px !important;
		width: 30px !important;
		height: 30px !important;
	}
	#rgb li, #sharpen li, #brightness li, #contrast li, #saturation li{
		min-width: 70px;
	}
	ul#rgb .innerbuttons, ul#sharpen .innerbuttons, ul#brightness .innerbuttons, ul#contrast .innerbuttons, ul#saturation .innerbuttons {
		justify-content: flex-start;
	}
	ul#rgb, ul#sharpen, ul#brightness, ul#contrast, ul#saturation {
		padding: 0rem 0 !important;
	}
	div#package input {
		min-height: 38px;
		font-size: var(--f875);
		height: 38px;
		font-weight: 400;	
	}
	ul.saveFinalImg input {
		width: 100%;
	}
	 div#package select {
		min-height: 38px;
		font-size: var(--f875);
		height: 40px;
		font-weight: 400;
	}
	.blackTds label.imgup{
		right: 4rem
	}
	.back.showgrey.innerback {
		left: 3rem;
	}
	.back.showgrey.innerback.nomobile {
		display:none
	}
	.blackTds .newNext img{
		display: block;
	}
	
	.blackTds .newNext span{
		display: none;
	}
	.blackTds .next-wrapp span {
		display: none;
	}

	.blackTds .next-wrapp .next_save span{
		display: none;
	}
	.blackTds .newNext{
		width: 2rem;
        height: 2rem;
        min-width: 2rem;
	}
	.blackTds .next-icon{
		padding: 0.4rem .8rem;
		filter: none !important;
	}
	.blackTds a#download-dpi-btn, .blackTds label.imgup{
		width: 2.5rem;
		height: 2.5rem;
		min-width: 2.5rem;
		
	}
	.blackTds label.imgup{
		right: 6rem !important;
    
	}
	.blackTds a#saveNext-btn{
		position: fixed;
		top: .65rem;
		right: 4rem;	
		z-index: 9999999;	
	}
	#nextID, .back, #prevID {     
        background: #fff !important;
		min-width: 4rem!important;
		max-width: 4rem;
		width: 4rem!important;
    }
	#nextID{
		right: 0!important;
	}
	#prevID{
		left: 0!important;
	}
	.fback{
		margin-left: 1rem;
	}

}
@media(max-width:578.99){
	.blackTds a#saveNext-btn{		
		right: 8px;		
	}
	#nextID, .back, #prevID {     
        background: #fff !important;
		min-width: 4rem!important;
		max-width: 4rem;
		width: 4rem!important;
    }
	ul#settings{
		justify-content: left!important;
	}
}
@media only screen and (min-device-width:768px) and (max-device-width:1024px) and (orientation:portrait){
	#nextID, .back, #prevID {			
		min-width: 6.5rem !important;
		max-width: 6.5rem;
		width: 6.5rem !important;
	}
	.next-wrapp {
		display: flex;
		align-items: center;
	}
	.blackTds #filters, .blackTds #c-settings, .blackTds #settings{
		justify-content: center;
	}
}
@media only screen and (min-device-width:820px) and (max-device-width:1120px) and (orientation:portrait) {
	.blackTds #filters, .blackTds #c-settings, .blackTds #settings{
		justify-content: center;
	}
		.blackTds label.imgup{
			right: 12rem;
		}
		.blackTds .maincidiv{
			width: 100%!important;
		}
		.blackTds a#saveNext-btn{		
			right: 4.5rem;	
		}
		#nextID, .back, #prevID {			
			min-width: 6.5rem !important;
			max-width: 6.5rem;
			width: 6.5rem !important;
		}
		.blackTds #container_data{
			width: 100%;
		}
		#nextID{
			justify-content: right!important;
		}
		#prevID {
			padding-left: 0;
		}
}
@media (min-width: 1200px) {
	.blackTds .h4, .blackTds h4 {
        font-size: 1.2rem;
    }
}

div#user-menu {
    font-size: .875rem;
	display: flex;
	position: absolute;
	flex-direction: column;
	left: 0;
	background: #fff;
	top: 3.6rem;
	text-align: left;
	align-items: baseline;
	gap: .5rem;
	min-width: 100%;
}
.afterUserlogged {
	position: relative;
  }
div#user-menu button {
	white-space: nowrap;
    background: none;
    width: 100%;
    text-align: left;
    padding: .5rem 1rem;
}
div#user-menu button:hover {
    background: #f3ecec;
}
div#user-icon {
    position: relative;
	width: 40px;
    height: 40px;
    background: #fff;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center
}
div#user-icon img{
	width: 100%;
	padding: .875rem;
}
.resetbt {
    margin-left: 1rem;
}
.u_user_pass_eye:hover { 
    background: #e5e5e5;
}
div#toastMessage.hide{
	z-index: 99!important;
}
h4#savetitle{
	margin-bottom: 0;
}
.modal-dialog-centered{
	justify-content: center;
}
.toast-body{
	text-align: center;
}
.company_logo {
    left: 0;
    position: absolute;
    top: 14px;
    right: 21px;
	width: 180px;
}

.company_logo img{
	width: 100%;
	height: auto;
}
footer#crop_footer {
    text-align: center;
    position: fixed;
    bottom: 0;
	font-size: .875rem;
}
 .browse_pic {
    background: #f2f2f2;
    width: 10rem;
    height: 10rem;
    padding: 1rem;
	font-size: 1rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    align-items: center;
    color: var(--btn-primary);
    overflow: hidden;
    cursor: pointer !important;
}
.browse_pic:hover{
	background-color: var(--btn-primary-hover);
	color: #fff;
}
.browse_pic:hover path {
    fill: #fff!important;
}
.pic_upload_section {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
	gap: .5rem;
}
.u_user_pass {
    margin-top: 1.3rem;
}

#select-file-div h1 {
    background-color: #2a31ed;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}



/* cam video upload css */
	#videoModal .videoHeader h6 {
	font-size: 1rem;
	}
   	#videoModal {
	display: none; /* Hidden by default */
	position: fixed; /* Stay in place */
	z-index: 1; /* Sit on top */
	left: 0;
	top: 0;
	width: 100vw; /* Full width of the viewport */
	height: 100vh; /* Full height of the viewport */
	overflow: hidden; /* Disable scroll */
	background-color: rgba(0, 0, 0, 0.8); /* Black background with transparency */
	justify-content: center; /* Center modal content */            
	align-items: center; /* Center modal content */
	justify-content: center;
	align-items: center;
	flex-direction: column;
	z-index: 99;
	}
	#videoModal .can_video_box {       
	left: 0;
	top: 0;
	width: 100vw; /* Full width of the viewport */
	height: 100vh; /* Full height minus footer and any header height */
	display: flex;
	justify-content: center; /* Center content horizontally */
	align-items: center; /* Center content vertically */
	touch-action: none; /* Prevent touch actions that can cause movement */
	overflow: hidden; /* Hide overflow */
	top: 60px;
	}
	#videoModal #video {
	width: 100%;
    height: 100%;
    object-fit: cover;
    border: 0;
	}
	#videoModal #canvas {
	/*width: 100%; */ /* Full width */
	/*height: calc(100vh - 60px);*/ /* Full height */
        margin-top: 60px;
	object-fit: cover; /* Maintain aspect ratio */
	}
  
  
	#videoModal .videoFooter {
	height: 70px;
	display: flex;
	flex-direction: row;
	width: 100%;
	display: flex;
	justify-content: center;
	background-color: #fff;
	border-top: 1px solid #e5e5e5;
	align-items: center;
	gap: 1rem;
  
	} 
   
	#videoModal .ci-header_text {
	  font-size: 1.2rem !important;
	  padding: 1rem;
	  justify-content: center;
	  display: flex;
	}
	#videoModal .videoHeader {
	position: absolute;     
	left: 0;
	top: 0;      
	padding: .5rem 1rem;
	display: block;  
	display: flex;
	padding: 1rem 1.5rem;
	justify-content: left;
	align-items: center;
	} 
	#videoModal .videoHeaderIn{
	  height: 60px;
	  width: 100%;
	  position: absolute;
	  top: 0;
	  left:0;
	  background: #fff;
	  color: #000;
	}
	#videoModal span#videoback img {
		width: 100%;
	}
	#videoModal #videoback {
	  padding: 1rem;
  width: 4rem;
  height: 4rem;
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  z-index: 9;
  background:none!important;
  margin: 0 !important;
  	}
  	#videoModal button#capture {
	width: 4.5rem;
	height: 4.5rem;
	border-radius: 100%;
	border: 0;
	background: #464bd3;
	position: absolute;
	bottom: 1.5rem;
	}
	#videoModal button#capture img {
	width: 100%;
	padding: .8rem;
	}
	#videoModal .close {
	  position: absolute;
	  top: 0;
	  right: 0;
	  color: #ffffff;
	  font-size: 30px;
	  cursor: pointer;
	  opacity: 1;
	  text-shadow: none;
	  width: 4rem;
	  height: 4rem;
	  background-color: #000;
	  justify-content: center;
	  display: flex;
	  align-items: center;
	  justify-content: center;
	}
	#videoModal span#closeModal img {
	  width: 100%;
	  height: 100%;
	  padding: 1rem;
	  filter: invert(250%);
	}
	#videoModal .close:hover {
	color: #fff;
	text-decoration: none;
	text-shadow:none
	}
	#videoModal .btn-footer {
	border: 0;
  padding: 0.5rem 1rem;        
	color: #000000;
	font-size: .875rem;
	border-radius: 0;
	min-width: 6rem;
	width: 6rem;
	font-family: 'Poppins', sans-serif;
	}
	#videoModal button#discard {
	background-color: #5d5d5d ;
	border: 1px solid #fff;
	color: #fff;
	justify-content: center;
	display: flex;
	align-items: center;
	}
	#videoModal button#save{
	background: #464bd3;
	color: #fff;
	}
	#videoModal #canvas {
	display: none;
	}`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 852:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(417);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(717), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_1___ = new URL(/* asset import */ __webpack_require__(66), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_2___ = new URL(/* asset import */ __webpack_require__(501), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_3___ = new URL(/* asset import */ __webpack_require__(834), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_4___ = new URL(/* asset import */ __webpack_require__(934), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_5___ = new URL(/* asset import */ __webpack_require__(983), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_6___ = new URL(/* asset import */ __webpack_require__(336), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
var ___CSS_LOADER_URL_REPLACEMENT_1___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_1___);
var ___CSS_LOADER_URL_REPLACEMENT_2___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_2___);
var ___CSS_LOADER_URL_REPLACEMENT_3___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_3___);
var ___CSS_LOADER_URL_REPLACEMENT_4___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_4___);
var ___CSS_LOADER_URL_REPLACEMENT_5___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_5___);
var ___CSS_LOADER_URL_REPLACEMENT_6___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_6___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* @import url(blacktheme.css); */
:root {
  --sx-gray-25: #111;
  --btn-primary: #555be7;
  --btn-primary-hover: #464bd3;
  --btn-secondary-hover: #4f9d2f;
  --btn-secondary: #54b52c;
  --radius-5: 0rem;
  --f875: 0.875rem;
  --f775: 0.775rem;
  --f675: 0.675rem;
  --f975: 0.975rem;
  --header: #fff;
  --text-black: #000;
}

html {
  font-family: "Poppins", sans-serif;
  -webkit-text-size-adjust: 100%;
}

* {
  box-sizing: border-box;
}

/* ol,
ul {
  padding: 0 !important;
} */
#cropDiv ol,
#cropDiv ul {
  /* padding: 0 !important; */
}

body {
  user-select: none;
  font-family: "Poppins", sans-serif;
  text-transform: capitalize;
}

#bodyDiv nav {
  background-color: #111;
}

a#download-dpi-btn {
  background-color: #0d6efd;
  border-color: #0d6efd;
  padding: 0rem 0.5rem;
  cursor: pointer;
  height: 2.2rem;
  width: 6.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.8rem;
}

/* loader  */
#cropDiv .loader-container {
  position: absolute;
  width: 90px;
  height: 90px;
  z-index: 6;
  top: 50%;
  left: 50%;
  z-index: 8;
  transform: translate(-50%, -50%);
  display: none;
}

#cropDiv .loader-circle {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 5px solid #fff;
    border-top-color: #084c7f;
    animation: loader-rotate 2s linear infinite;
    background: #ffffffc4;
}

#cropDiv .loader-image {
    width: inherit;
    height: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
}

#cropDiv .loader-image img {
    width: 3rem;
    margin: auto;
    padding: 0;
    z-index: 2;
    position: relative;
}

@keyframes loader-rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

a#download-dpi-btn img {
  filter: none !important;
  display: block;
  width: 28px !important;
  padding-left: 0 !important;
  padding: 13px;
  padding-right: 0;
  margin-right: 0.5rem;
}

div#cropDiv {
  position: fixed;
  right: 0;
  width: 100vw;
  /* width: 520px; */
  z-index: 99;
  overflow: hidden;
  display: none;
  top: 0;
  touch-action: none;
}

.tab {
  background-color: #222;
}

/* #saveNext-btn{
	position: fixed;
    right: 0;
    bottom: 19px;
    padding-right: 8px;
} */
img#downloadImg {
  padding: 6px;
}

.zoomControls {
  position: absolute;
  bottom: 70px;
  width: 100%;
  height: 50px;
  background: #ececec;
}

.tab-footer {
  background-color: #111;
}

.confirmPopupOverlay {
  position: absolute;
  z-index: 999999;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
  width: 100%;
  height: 100%;
  padding: 2rem;
  background: #00000045;
}

.confirmPopup {
  width: 60%;
  position: absolute;
  z-index: 99999;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
  width: 400px;
  height: auto;
  padding: 1rem;
  background: #ffffff;
  text-align: center;
}

.buttonGroup {
  display: flex;
  justify-content: center;
  margin: 1rem;
}

input.confirmPopupbt {
  background: #cf0a2c;
  padding: 0.5rem 1rem;
  text-align: center;
  color: #fff;
  border-radius: var(--radius-5);
  display: block;
  cursor: pointer;
  border: 0;
  margin: 0 0.2rem;
  width: 80px;
}

button.confirmPopupbt {
  background: var(--btn-primary);
  padding: 0.5rem 1rem;
  text-align: center;
  color: #fff;
  border-radius: var(--radius-5);
  display: block;
  cursor: pointer;
  border: 0;
  margin: 0 0.2rem;
  width: 80px;
}

button.confirmPopupbt.confirmview {
  background: #000;
  padding: 0.5rem 1rem;
  text-align: center;
  color: #fff;
  border-radius: var(--radius-5);
  display: block;
  cursor: pointer;
  border: 0;
  margin: 0 0.2rem;
  width: 80px;
}

.downloadDesign {
  position: absolute;
  background: #094c80;
  padding: inherit;
  text-align: center;
  color: #fff;
  border-radius: var(--radius-5);
  cursor: pointer;
  margin-top: 0.5rem;
  border: 0;
  margin: 0 0.2rem;
  padding: 0.4rem;
  right: 40px;
  top: 6px;
  z-index: 9;
  text-decoration: none;
  height: auto !important;
  display: none;
}

.downloadDesign:hover {
  color: #fff;
  background: #000;
  text-decoration: none;
}

button.confirmPopupbt.cancel {
  background: #000000;
  width: 80px;
  height: auto;
  font-family: "Poppins", sans-serif;
  font-size: inherit;
  padding: 0 1rem;
}

/*.theme {
	background-color: #111;
}*/

.theme b,
.theme p {
  color: #ddd;
}

@-webkit-keyframes uil-ripple {
  0% {
    width: 0;
    height: 0;
    opacity: 0;
    margin: 0 0 0 0;
  }

  33% {
    width: 44%;
    height: 44%;
    margin: -22% 0 0 -22%;
    opacity: 1;
  }

  100% {
    width: 88%;
    height: 88%;
    margin: -44% 0 0 -44%;
    opacity: 0;
  }
}

@-webkit-keyframes uil-ripple {
  0% {
    width: 0;
    height: 0;
    opacity: 0;
    margin: 0 0 0 0;
  }

  33% {
    width: 44%;
    height: 44%;
    margin: -22% 0 0 -22%;
    opacity: 1;
  }

  100% {
    width: 88%;
    height: 88%;
    margin: -44% 0 0 -44%;
    opacity: 0;
  }
}

@-moz-keyframes uil-ripple {
  0% {
    width: 0;
    height: 0;
    opacity: 0;
    margin: 0 0 0 0;
  }

  33% {
    width: 44%;
    height: 44%;
    margin: -22% 0 0 -22%;
    opacity: 1;
  }

  100% {
    width: 88%;
    height: 88%;
    margin: -44% 0 0 -44%;
    opacity: 0;
  }
}

@-ms-keyframes uil-ripple {
  0% {
    width: 0;
    height: 0;
    opacity: 0;
    margin: 0 0 0 0;
  }

  33% {
    width: 44%;
    height: 44%;
    margin: -22% 0 0 -22%;
    opacity: 1;
  }

  100% {
    width: 88%;
    height: 88%;
    margin: -44% 0 0 -44%;
    opacity: 0;
  }
}

@-moz-keyframes uil-ripple {
  0% {
    width: 0;
    height: 0;
    opacity: 0;
    margin: 0 0 0 0;
  }

  33% {
    width: 44%;
    height: 44%;
    margin: -22% 0 0 -22%;
    opacity: 1;
  }

  100% {
    width: 88%;
    height: 88%;
    margin: -44% 0 0 -44%;
    opacity: 0;
  }
}

@-webkit-keyframes uil-ripple {
  0% {
    width: 0;
    height: 0;
    opacity: 0;
    margin: 0 0 0 0;
  }

  33% {
    width: 44%;
    height: 44%;
    margin: -22% 0 0 -22%;
    opacity: 1;
  }

  100% {
    width: 88%;
    height: 88%;
    margin: -44% 0 0 -44%;
    opacity: 0;
  }
}

@-o-keyframes uil-ripple {
  0% {
    width: 0;
    height: 0;
    opacity: 0;
    margin: 0 0 0 0;
  }

  33% {
    width: 44%;
    height: 44%;
    margin: -22% 0 0 -22%;
    opacity: 1;
  }

  100% {
    width: 88%;
    height: 88%;
    margin: -44% 0 0 -44%;
    opacity: 0;
  }
}

@keyframes uil-ripple {
  0% {
    width: 0;
    height: 0;
    opacity: 0;
    margin: 0 0 0 0;
  }

  33% {
    width: 44%;
    height: 44%;
    margin: -22% 0 0 -22%;
    opacity: 1;
  }

  100% {
    width: 88%;
    height: 88%;
    margin: -44% 0 0 -44%;
    opacity: 0;
  }
}

@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(359deg);
    transform: rotate(359deg);
  }
}

@keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(359deg);
    -ms-transform: rotate(359deg);
    transform: rotate(359deg);
  }
}

@-webkit-keyframes pulse {
  0% {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }

  50% {
    -webkit-transform: scale(0.8);
    transform: scale(0.8);
  }

  100% {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
}

@keyframes pulse {
  0% {
    -webkit-transform: scale(1.1);
    -ms-transform: scale(1.1);
    transform: scale(1.1);
  }

  50% {
    -webkit-transform: scale(0.8);
    -ms-transform: scale(0.8);
    transform: scale(0.8);
  }

  100% {
    -webkit-transform: scale(1.1);
    -ms-transform: scale(1.1);
    transform: scale(1.1);
  }
}

@-webkit-keyframes burst {
  0% {
    opacity: 0.6;
  }

  50% {
    -webkit-transform: scale(1.8);
    transform: scale(1.8);
    opacity: 0;
  }

  100% {
    opacity: 0;
  }
}

@keyframes burst {
  0% {
    opacity: 0.6;
  }

  50% {
    -webkit-transform: scale(1.8);
    -ms-transform: scale(1.8);
    transform: scale(1.8);
    opacity: 0;
  }

  100% {
    opacity: 0;
  }
}

.lo-burst:hover {
  -webkit-animation: burst 2s infinite linear;
  animation: burst 2s infinite linear;
}

.lo-pulse:hover {
  -webkit-animation: pulse 2s linear infinite;
  animation: pulse 2s linear infinite;
}

.lo-spin:hover,
.lo-spin.animated {
  -webkit-animation: spin 1.5s linear infinite;
  animation: spin 1.5s linear infinite;
}

#rotation-item {
  display: inline;
}

#flip-item {
  display: inline;
}

#brightness-item {
  display: inline;
}

#contrast-item {
  display: inline;
}

#saturation-item {
  display: inline;
}

#noise-item {
  display: inline;
}

#sharpen-item {
  display: inline;
}

#blur-item {
  display: inline;
}

#frameblur-item {
  display: inline;
}

#vignette-item {
  display: inline;
}

#effects-item {
  display: inline;
}

#rgb-item {
  display: inline-block !important;
  position: relative;
}

#newcrop-item {
  display: inline;
}

#frames-item {
  display: inline;
}

#textures-item {
  display: inline;
}

#special-item {
  display: inline;
}

#logo-item {
  display: inline;
}

/* @font-face {
	font-family:'share-buttons';src:url("https://res.cloudinary.com/tdscloudcdn/raw/upload/v1611125575/ImageCropEditor/assets/fonts/share-buttons.woff?gpra60") format("woff");font-weight:normal;font-style:normal;
}

@font-face {
	font-family:'Oswald';src:url("https://res.cloudinary.com/tdscloudcdn/raw/upload/v1611125575/ImageCropEditor/assets/fonts/Oswald-Regular.ttf") format("truetype");font-weight:normal;font-style:normal;
}

@font-face {
	font-family:'Oswald';src:url("https://res.cloudinary.com/tdscloudcdn/raw/upload/v1611125575/ImageCropEditor/assets/fonts/Oswald-Medium.ttf") format("truetype");font-weight:bold;font-style:normal;
} */
#bodyDiv {
  margin: 0px;
  padding: 0px;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

/* body {
	margin: 0px;
	padding: 0px;
	width: 100%;
	height: 100vh;	
	overflow: hidden;
	
} */

ul {
  list-style-type: none;
  padding: 0px;
  margin: 0px !important;
}

/* a:link,a:visited {
	color: #222;
	text-decoration: none;
} */

/* html {
	visibility: hidden;
} */

#check,
#old,
.theme,
.setting {
  display: none;
}

/* #video {
	visibility: hidden;
	position: fixed;
	z-index: -10;
	left: 0;
	top: 0;
} */

#new,
#old {
  position: fixed;
  top: 50%;
  left: 50%;
  overflow: hidden;
  max-width: 100%;
}

canvas#new.mobile {
  max-width: none !important;
}

div#editor {
  position: relative;
}

a#export-btn .next-icon {
  background: #cf0a2c;
  opacity: 1;
  padding: 6px;
}

/* vaibhavi */
#_maxDiv {
  width: 50px;
  height: 50px;
  position: absolute;
  z-index: 999;
  visibility: hidden;
  /*bottom: 150px;*/
  /* right: 75px;
   left: 75px; */
  /*margin: 19px 19px 19px 19px; */
  /* background: rgb(0, 0, 0); */
  /* text-align: center; */
}

video#video1 {
  opacity: 0;
  display: none;
}

.maincropimg {
  /* height: calc(100vh - 120px); */
  margin-top: 50px;
  position: relative;
}

/* #cropCanvas {
	position: absolute;
	top: 49.6%;
	left: 26.5%;
	transform: translate(-50%, -50%)
  } */

img#closeB {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 35px;
  height: auto;
  display: block;
  cursor: pointer;
  filter: invert(100%) !important;
}

.theme {
  font-family: "Poppins", sans-serif;
  /*opacity: 0.9;*/
  position: absolute;
  top: 0px;
  /*bottom: 40px !important;*/
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99999;
  height: calc(100vh - 70px);
  overflow: hidden;
}

.theme .list-item {
  padding: 30px;
}

#search-package {
  position: fixed;
  top: 105px;
  left: 50%;
  margin-left: -157px;
}

#package-list {
  margin-top: 60px;
}

.animated-search-filter .hidden {
  opacity: 0;
  pointer-events: none;
  position: absolute;
}

header,
footer {
  position: absolute;
  width: 100%;
  z-index: 2;
}

nav {
  position: inherit;
  top: 0;
  width: 100%;
}

#title {
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  text-align: center;
  margin: 15px;
  color: #151414 !important;
}

.tab {
  position: inherit;
  display: table;
  width: 100%;
}

.tab-header {
  /*top: 42px;*/
  top: 0px;
  height: 50px;
  /* background-color: #fdfdfd!important; */
  border-bottom: 1px solid #e7e7e7 !important;
  /* background-color: #084c7f!important; */
}

.tab-footer {
  bottom: 0;
  height: 40px;
}

.tab-footer a {
  display: table-cell;
  text-align: center;
  font-size: 25px;
  padding: 0;
  width: 16.5%;
}

.tab-footer img {
  vertical-align: middle;
}

.ciactive {
  background-color: #111;
}

#mainDivId .nav {
  height: inherit;

  /*cursor: pointer;*/
}

#mainDivId .nav img {
  opacity: 1;
  width: 44px;
  transition: all 0.3s ease;
  vertical-align: middle;
}

img.size.gallery {
  filter: none !important;
  display: block;
  width: 20px !important;
  padding: 0;
}

img.size.refreshbtn {
  filter: invert(100%) !important;
}

#mainDivId .nav img:hover {
  opacity: 1;
}

#mainDivId .nav .size:hover {
  width: 55px;
}

.setting {
  /* position: absolute; */
  position: absolute;
  text-align: center;
  /*bottom: 0px;*/
  left: 0px;
  right: 0px;
  height: 70px;
  background-color: #222;
  white-space: nowrap;
  /* overflow: hidden; */
  overflow: auto;
  overflow-y: hidden;
  width: calc(100vw);
  left: 0 !important;
  bottom: 0;
  right: 0 !important;
  padding: 0rem 4rem !important;
  z-index: 99;
}

.setting11 {
  position: absolute;
  /* position: fixed; */
  text-align: center;
  bottom: 0px;
  left: 0px;
  right: 0px;
  height: 70px;
  background-color: #222;
  white-space: nowrap;
  overflow: hidden;
}

img#export {
  filter: invert(100%) !important;
}

.setting-2 {
  height: 70px;
  /* border-top: 1px solid #084c7f; */
  padding: 0px 40px;
}

.menuTabs {
  position: relative;
  height: 70px;
}

.saveFinalImg {
  height: 70px;
  left: 0;
  right: 0px;
  position: absolute;
  text-align: center;
  bottom: 0;
  white-space: nowrap;
  display: flex;
  justify-content: center;
  background-color: #efefef;
}

.setting-3 {
  height: 90px;
}

.setting img {
  margin-left: 3px;
  margin-top: 1px;
  opacity: 0.75;
  transition: all 0.3s ease;
}

.circular {
  width: 50px;
  height: 50px;
  border-radius: var(--radius-5);
  -webkit-border-radius: var(--radius-5);
  -moz-border-radius: var(--radius-5);
}

.filter-img {
  width: 50px;
  height: 50px;
  -webkit-filter: grayscale(0);
  filter: grayscale(0);
  -webkit-transition: 0.3s ease-in-out;
  transition: 0.3s ease-in-out;
  opacity: 1 !important;
}

.filter-img:hover {
  -webkit-filter: grayscale(100%);
  filter: grayscale(100%);
}

.ci-label {
  position: absolute;
  margin-top: 42px;
  margin-left: -65px;
  width: 80px;
  text-align: center;
  font-family: "Poppins", sans-serif;
  color: #000;
  z-index: 2;
  cursor: pointer;
  /* font-size: small; */
  font-size: 0.7rem;
  font-weight: 500;
}

.label-2 {
  margin-top: 58px;
}

.square {
  width: 50px;
  height: 50px;
}

.setting img:hover {
  opacity: 1;
}

.setting li {
  display: inline;
  margin: 0px 12px;
}

.setting [type="range"] {
  margin-top: 28px;
  border-radius: var(--radius-5);
  background: #434343;
  width: 20%;
  height: 8px;
}

input#b-range {
  width: calc(100% - 75px);
}

#rgb [type="range"] {
  width: 20%;
}

li#rgb-item .clable {
  left: 50% !important;
  transform: translateX(-50%) !important;
}

#rgb input[type="range"] {
  width: 100% !important;
}

input#b-range,
input#c-range,
input#s-range,
input#sharpen-range {
  width: 100% !important;
}

.toright {
  margin-left: 36px !important;
}

#filters {
  display: block;
}

#filters {
  left: 0px;
  right: 35px;
}

div#menuTabs {
  position: relative;
  height: 70px;
  background-color: #fff;
}

#c-settings {
  /* left:35px; */
  right: 35px;
}

#settings {
  left: 0px;
  right: 0px;
}

#prevID {
  padding-left: 8px;
  bottom: 0px;
  z-index: 999;
  position: absolute;
  background: #222;
  border: none;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  justify-content: left;
  width: 70px;
}

#saveback {
  position: fixed;
  z-index: 99;
  bottom: 0px;
  background: #222;
  border: none;
}

#nextID {
  bottom: 0px;
  position: absolute;
  z-index: 99;
  right: 0px;
  background: #222;
  cursor: pointer;
  border: none;
  display: flex;
  padding: 8px;
  justify-content: center;
  align-items: center;
  text-decoration: none;
}

a#saveNext-btn {
  height: 70px;
  position: absolute;
}

.back {
  padding-left: 8px;
  position: absolute;
  display: flex;
  align-items: center;
  height: 70px;
  float: left;
  border-right: 1px solid #333;
  border: none;
}

.next_ {
  height: 70px;
  float: right;
  border-left: 1px solid #333;
  border: none;
}

.next-icon {
  padding: 5px;
  width: 30px;
  height: 30px;
  color: #000000;
  background: #cf0a2c;
  /* background: #0075cd; */
  border-radius: var(--radius-5);
  opacity: 0.5;
  transition: all 0.3s ease;
  border: none;
  margin-left: 1rem;
}

img.next-icon:hover {
  /* background: #ffffff; */
  color: #fff;
  filter: none !important;
  background: #cf0a2c;
  opacity: 1;
  cursor: pointer;
}

.back-icon {
  padding: 5px;
  width: 30px;
  height: 30px;
  color: #fff;
  background: #cf0a2c;
  border-radius: var(--radius-5);
  opacity: 0.5;
  transition: all 0.3s ease;
  cursor: pointer;
}

img.back-icon:hover {
  /* background: #ffffff; */
  filter: none !important;
  background: #cf0a2c;
  opacity: 1;
}

.back:hover .back-icon {
  opacity: 1;
}

#back,
#c-back {
  display: none;
  position: fixed;
  bottom: 40px;
  left: 0px;
  margin-top: 6px;
  background-color: #222;
}

#back .back-icon {
  margin-top: 12px !important;
}

img.back-icon {
  padding: 5px !important;
}

.list-item,
.nav img,
.setting img,
.tab-footer a {
  cursor: pointer;
  /* padding: 8px; */
  padding: 13px;
}

img#closeimg {
  filter: none !important;
}

.ci_btn {
  cursor: pointer;
  width: 120px;
  height: auto;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  color: #eee;
  background-color: #333;
  border: 2px solid #444;

  /*margin-left: -40px;*/
  margin-right: 10px;
  background-color: #084c7f !important;
  color: #fff !important;
  border: 0 !important;
  border-radius: var(--radius-5);
}

a#applyimg span {
  display: block;
  padding: 4px;
  background: #ffffff;
  padding: 0.4rem;
  background-color: #ffffff !important;
  color: #000 !important;
  border: 0 !important;
  border-radius: var(--radius-5);
  color: #fff;
  width: 60px;
  height: 30px;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
}

.ci_btn:active {
  margin-top: 14px;
}

.image_box {
  overflow: hidden;
}

.search-box {
  -webkit-transition: width 0.6s, border-radius 0.6s, background 0.6s,
    box-shadow 0.6s;
  transition: width 0.6s, border-radius 0.6s, background 0.6s, box-shadow 0.6s;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  background: #ebebeb;
}

.search-box:hover {
  color: white;
  background: #c8c8c8;
  box-shadow: 0 0 0 5px #3d4752;
}

.search-box:focus {
  -webkit-transition: width 0.6s cubic-bezier(0, 1.22, 0.66, 1),
    border-radius 0.6s, background 0.6s;
  transition: width 0.6s cubic-bezier(0, 1.22, 0.66, 1), border-radius 0.6s,
    background 0.6s;
  border: none;
  outline: none;
  box-shadow: none;
  padding-left: 15px;
  cursor: text;
  width: 300px;
  border-radius: auto;
  background: #ebebeb;
  color: black;
}

.search-box:not(:focus) {
  text-indent: -5000px;
}

.search-icon {
  position: relative;
  left: -36px;
  bottom: -11px;
  cursor: pointer;
}

.overlay {
  font-family: "Poppins", sans-serif;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  transition: opacity 500ms;
  visibility: hidden;
  opacity: 0;
  z-index: 999;
}

.overlay:target {
  visibility: visible;
  opacity: 1;
}

.popup {
  margin: 70px auto;
  padding: 20px;
  background: #fff;
  border-radius: var(--radius-5);
  width: 40%;
  position: relative;
  transition: all 5s ease-in-out;
}

.popup h2 {
  margin-top: 0;
  color: #333;
  font-family: "Poppins", sans-serif;
}

.popup .close {
  position: absolute;
  top: 20px;
  right: 30px;
  transition: all 200ms;
  font-size: 30px;
  font-weight: bold;
  text-decoration: none;
  cursor: pointer;
  color: #333;
}

.popup .close:hover {
  color: #ec5f8b;
}

.popup .dim,
.popup .pos,
.popup .ext {
  transition: all 200ms;
  font-size: 20px;
  font-weight: normal;
  text-decoration: none;
  color: #333;
  margin-right: 15px;
  cursor: pointer;
}

.popup .dim:hover,
.popup .pos:hover,
.popup .ext:hover {
  color: #ec5f8b;
}

.popup .ext {
  font-weight: bold;
}

.popup .active-link {
  color: #ec5f8b;
}

.popup .content {
  max-height: 30%;
  overflow: auto;
}

button#saveimage {
  position: absolute;
  z-index: 9;
  top: 5px;
  right: 5px;
  padding: 0.2rem 0.5rem;
  background: #49a900;
  border: 0;
  border-radius: var(--radius-5);
  font-size: 0.8rem;
  display: none;
}

a#applyimg {
  /* background: #084c7f; */
  color: #fff;
  cursor: pointer;
}

.inner_upload_box {
  position: absolute;
  width: 130px;
  height: 130px;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
  z-index: 9;
  background: #ffffff;
}

/* div#custom_browse{
    position: absolute;
    display: flex;
    flex-direction: column;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
    z-index: 9;
	background: #f5f5f5;
    color: #000;
    text-align: center;
} */
div#custom_browse {
  position: absolute;
  display: flex;
  flex-direction: column;
  background: #f1f1f1;
  color: #000;
  text-align: center;
  width: 100%;
  margin-top: 50px;
  height: calc(100vh - 59px);
  z-index: 9999;
  left: 50%;
}

input.material_input_box {
  font-size: var(--f875);
  font-family: inherit;
  color: #000;
  padding: 0.375rem 2.25rem 0.375rem 0.75rem;
  position: absolute;
  left: 1px;
  top: 1px;
  width: 80%;
  margin: 0;
  border: 0;
  min-height: 27px;
  /* max-height: 27px; */
  height: 32px !important;
  bottom: 1px;
}

/* manisha zoom slide css */
#slide-scaleZoom.slido {
  appearance: none !important;
  -moz-appearance: none !important;
  -webkit-appearance: none !important;
  width: 100vh;
  height: 6px;
  border-radius: var(--radius-5);
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;
  transform: none;
  -ms-transform: none;
  -webkit-transform: none;
}

.zoomControls .controler_a {
  position: absolute;
  transform: translate(-35%, -50%);
  left: 50%;
  top: 50%;
  width: 100%;
  /* padding: 0 11%; */
}

.zoomControls .input-amount {
  position: absolute;
  right: 0;
  top: -5px;
  transform: none;
  right: 90px !important;
  left: auto;
}

#yesbtn:hover {
  background-color: #ef0303e3;
}

#nobtn:hover {
  background-color: #ef0303e3;
}

.messageClose:hover {
  background-color: #ef0303e3;
}

/* login popup */
#login_popup {
  display: none;
  background: #00000045;
}

#login_popup .modal-content {
  /* border-radius: 0rem; */
  padding: 1rem;
  width: 400px;
}

#login_popup .modal-header {
  justify-items: center;
  justify-content: center;
  padding: 0.3rem;
  border-bottom: none;
}

#login_popup.h3 {
  font-size: 1rem;
}

#login_popup .modal-body {
  padding: 0.5rem 0.5rem;
}

#login_popup .form-control {
  border-radius: 0rem;
}

#login_popup .form-check-input {
  border-radius: 0rem;
}

#login_popup input[type="text"],
#login_popup input[type="password"] {
  height: 2.8rem;
  font-size: var(--f875);
}

.u_user_pass {
  position: relative;
}

#login_popup .invalid-feedback {
  font-size: 0.675em;
}

.u_user_pass_eye {
  display: flex;
  height: 2.65rem;
  padding: 0.875rem;
  position: absolute;
  top: 1.95rem;
  right: 0.3rem;
  border-left: 1px solid silver;
  cursor: pointer;
}

.u_user_pass_eye.active .u_pass_eye_show {
  display: block;
}

.remember_me {
  margin-top: 0.5rem;
}

.login_wrap {
  margin-top: 0.5rem;
}

#login_popup .u_login_button {
  width: 100%;
  background-color: var(--btn-primary);
  border-radius: 0rem;
  font-weight: 600;
  padding: 0.5rem;
  font-size: 1.1rem;
}

#login_popup .u_login_button:hover {
  background-color: var(--btn-primary-hover);
}

/* login popup invoke button akash*/

#login_btn {
  position: relative;
  border-radius: 0rem;
  display: flex;
  align-items: center;
  margin-right: 1rem;
  height: 2.5rem;
  gap: 0.5rem;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  background-color: var(--btn-primary);
}

#login_logout {
  position: relative;
  border-radius: 0rem;
  display: flex;
  align-items: center;
  margin: 0.5rem;
  height: 2.5rem;
  gap: 0.5rem;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  margin-left: 1rem;
  background-color: none;
  color: var(--text-black);
  padding-left: 0;
}

#login_btn:hover {
  background-color: var(--btn-primary-hover);
}

#login_btn svg {
  width: 1.25rem;
  height: 1.25rem;
}

.close_login {
  width: 2.25rem;
  height: 2.25rem;
  padding: 0.4rem;
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;
  cursor: pointer;
}

.close_login:hover {
  background-color: var(--btn-primary-hover);
}

.close_login:hover svg {
  color: #fff;
}

.close_login svg {
  height: 100%;
  width: 100%;
  color: #000;
}

.subgroup .input_field {
  display: flex;
}

.subgroup {
  max-height: calc(100vh - 270px);
}

.subgroup::-webkit-scrollbar {
  width: 5px;
}

.subgroup::-webkit-scrollbar-thumb {
  background: #888;
}

#product_ft input:focus-visible {
  outline: none;
}

.nomobile {
  display: block;
}

@media screen and (max-width: 700px) {
  #prevID {
    left: 8px;
  }

  #settings a#export-btn {
    right: 8px;
  }

  #nextID,
  a#saveNext-btn,
  .back {
    right: 0;
  }

  #saveNext-btn {
    position: fixed;
  }

  .ci-header_text {
    left: 50% !important;
  }

  #title {
    font-size: 1.2rem !important;
  }

  .box,
  .popup {
    width: 80%;
  }

  .saveFinalImg {
    position: fixed;
  }

  .customlabel {
    font-size: 0.6rem;
    margin-right: 2px;
  }

  .customInputBx {
    width: 35px;
    font-size: 0.6rem;
    margin-right: 4px;
  }

  .dropdownUnits {
    cursor: pointer;
    height: 30px;
    width: 35px;
    margin-right: 4px;
  }

  .dropdownUnits {
    cursor: pointer;
    height: 30px;
    width: 35px;
  }
}

.share-btn-icon {
  font-family: "share-buttons";
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.share-btn-email .share-btn-icon:before {
  content: "\\e945";
}

.share-btn-more .share-btn-icon:before {
  content: "\\ea82";
}

.share-btn-googleplus .share-btn-icon:before {
  content: "\\ea88";
}

.share-btn-facebook .share-btn-icon:before {
  content: "\\ea8c";
}

.share-btn-twitter .share-btn-icon:before {
  content: "\\ea91";
}

.share-btn-github .share-btn-icon:before {
  content: "\\eab4";
}

.share-btn-tumblr .share-btn-icon:before {
  content: "\\eabb";
}

.share-btn-reddit .share-btn-icon:before {
  content: "\\eac7";
}

.share-btn-linkedin .share-btn-icon:before {
  content: "\\eac8";
}

.share-btn-delicious .share-btn-icon:before {
  content: "\\eacc";
}

.share-btn-stumbleupon .share-btn-icon:before {
  content: "\\eace";
}

.share-btn-pinterest .share-btn-icon:before {
  content: "\\ead0";
}

.share-btn {
  box-sizing: border-box;
  box-sizing: border-box;
  position: relative;
  display: inline-block;
  height: 24px;
  margin: 5px;
  padding: 2px 8px;
  line-height: 1.53;
  letter-spacing: 0.04em;
  vertical-align: top;
  font-size: 12px;
  font-weight: bold;
  font-family: "Poppins", sans-serif;
  color: #111;
  background: #e0e0e0;
  border: 1px solid #c7c7c7;
  border-radius: 2px;
  text-decoration: none;
  -webkit-transition: all 0.2s ease;
  transition: all 0.2s ease;
}

.share-btn * {
  box-sizing: border-box;
  box-sizing: border-box;
}

.share-btn *:before,
.share-btn *:after {
  box-sizing: border-box;
}

.share-btn:hover,
.share-btn:focus {
  background: #d3d3d3;
  border-color: #bababa;
  text-decoration: none;
  color: #111;
}

.share-btn:active {
  background: #c7c7c7;
  border-color: #adadad;
  text-decoration: none;
  color: #111;
}

.share-btn.share-btn-sm {
  height: 20px;
  font-size: 10px;
  padding: 0 8px;
  line-height: 1.6;
}

.share-btn.share-btn-lg {
  height: 28px;
  font-size: 16px;
  line-height: 1.4;
}

.share-btn .share-btn-text-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

.share-btn.share-btn-branded {
  color: #fff;
}

.share-btn.share-btn-branded.share-btn-twitter {
  background: #55acee;
  border-color: #3ea1ec;
}

.share-btn.share-btn-branded.share-btn-twitter:hover,
.share-btn.share-btn-branded.share-btn-twitter:focus {
  background: #3ea1ec;
  border-color: #2795e9;
}

.share-btn.share-btn-branded.share-btn-twitter:active {
  background: #2795e9;
  border-color: #1689e0;
}

.share-btn.share-btn-branded.share-btn-facebook {
  background: #3b5998;
  border-color: #344e86;
}

.share-btn.share-btn-branded.share-btn-facebook:hover,
.share-btn.share-btn-branded.share-btn-facebook:focus {
  background: #344e86;
  border-color: #2d4373;
}

.share-btn.share-btn-branded.share-btn-facebook:active {
  background: #2d4373;
  border-color: #263961;
}

.share-btn.share-btn-branded.share-btn-googleplus {
  background: #dd4b39;
  color: #fff;
  border-color: #d73925;
}

.share-btn.share-btn-branded.share-btn-googleplus:hover,
.share-btn.share-btn-branded.share-btn-googleplus:focus {
  background: #d73925;
  border-color: #c23321;
}

.share-btn.share-btn-branded.share-btn-googleplus:active {
  background: #c23321;
  border-color: #ac2d1e;
}

.share-btn.share-btn-branded.share-btn-tumblr {
  background: #35465c;
  color: #fff;
  border-color: #2c3a4c;
}

.share-btn.share-btn-branded.share-btn-tumblr:hover,
.share-btn.share-btn-branded.share-btn-tumblr:focus {
  background: #2c3a4c;
  border-color: #222d3c;
}

.share-btn.share-btn-branded.share-btn-tumblr:active {
  background: #222d3c;
  border-color: #19212b;
}

.share-btn.share-btn-branded.share-btn-reddit {
  background: #ff4500;
  color: #fff;
  border-color: #e63e00;
}

.share-btn.share-btn-branded.share-btn-reddit:hover,
.share-btn.share-btn-branded.share-btn-reddit:focus {
  background: #e63e00;
  border-color: #cc3700;
}

.share-btn.share-btn-branded.share-btn-reddit:active {
  background: #cc3700;
  border-color: #b33000;
}

.share-btn.share-btn-branded.share-btn-linkedin {
  background: #0976b4;
  color: #fff;
  border-color: #08669c;
}

.share-btn.share-btn-branded.share-btn-linkedin:hover,
.share-btn.share-btn-branded.share-btn-linkedin:focus {
  background: #08669c;
  border-color: #075683;
}

.share-btn.share-btn-branded.share-btn-linkedin:active {
  background: #075683;
  border-color: #05466b;
}

.share-btn.share-btn-branded.share-btn-delicious {
  background: #3399ff;
  color: #fff;
  border-color: #198cff;
}

.share-btn.share-btn-branded.share-btn-delicious:hover,
.share-btn.share-btn-branded.share-btn-delicious:focus {
  background: #198cff;
  border-color: #007fff;
}

.share-btn.share-btn-branded.share-btn-delicious:active {
  background: #007fff;
  border-color: #0073e5;
}

.share-btn.share-btn-branded.share-btn-stumbleupon {
  background: #eb4924;
  color: #fff;
  border-color: #e13b15;
}

.share-btn.share-btn-branded.share-btn-stumbleupon:hover,
.share-btn.share-btn-branded.share-btn-stumbleupon:focus {
  background: #e13b15;
  border-color: #ca3412;
}

.share-btn.share-btn-branded.share-btn-stumbleupon:active {
  background: #ca3412;
  border-color: #b22e10;
}

.share-btn.share-btn-branded.share-btn-pinterest {
  background: #cc2127;
  color: #fff;
  border-color: #b61d23;
}

.share-btn.share-btn-branded.share-btn-pinterest:hover,
.share-btn.share-btn-branded.share-btn-pinterest:focus {
  background: #b61d23;
  border-color: #a01a1f;
}

.share-btn.share-btn-branded.share-btn-pinterest:active {
  background: #a01a1f;
  border-color: #8a161a;
}

.share-btn.share-btn-inverse {
  color: #eeeeee;
  background: #1f1f1f;
  border-color: #050505;
}

.share-btn.share-btn-inverse:hover,
.share-btn.share-btn-inverse:focus {
  background: #121212;
  border-color: #000000;
  color: #eeeeee;
}

.share-btn.share-btn-inverse:active {
  background: #050505;
  border-color: #000000;
  color: #eeeeee;
}

.share-btn.share-btn-twitter .share-btn-icon,
.share-btn.share-btn-googleplus .share-btn-icon,
.share-btn.share-btn-tumblr .share-btn-icon,
.share-btn.share-btn-linkedin .share-btn-icon,
.share-btn.share-btn-pinterest .share-btn-icon,
.share-btn.share-btn-stumbleupon .share-btn-icon,
.share-btn.share-btn-delicious .share-btn-icon {
  position: relative;
  top: 1px;
}

.share-btn.share-btn-more .share-btn-icon {
  position: relative;
  top: 1px;
}

.share-btn.share-btn-more.share-btn-lg .share-btn-icon {
  top: 2px;
}

.share-btn .share-btn-text {
  padding-left: 2px;
}

@-moz-document url-prefix() {
  .share-btn.share-btn-twitter .share-btn-icon,
  .share-btn.share-btn-googleplus .share-btn-icon,
  .share-btn.share-btn-tumblr .share-btn-icon,
  .share-btn.share-btn-linkedin .share-btn-icon,
  .share-btn.share-btn-pinterest .share-btn-icon,
  .share-btn.share-btn-stumbleupon .share-btn-icon,
  .share-btn.share-btn-delicious .share-btn-icon,
  .share-btn.share-btn-more .share-btn-icon {
    top: 0;
  }
}

.uil-ripple-css {
  background: none;
  position: fixed;
  left: 50%;
  top: 50%;
  width: 200px;
  height: 200px;
  margin-left: -100px;
  margin-top: -100px;
  z-index: 1000;
  display: none;
}

.uil-ripple-css div {
  position: absolute;
  top: 50%;
  left: 50%;
  margin: 0;
  width: 0;
  height: 0;
  opacity: 0;
  border-radius: 50%;
  border-width: 12px;
  border-style: solid;
  -ms-animation: uil-ripple 2s ease-out infinite;
  -moz-animation: uil-ripple 2s ease-out infinite;
  -webkit-animation: uil-ripple 2s ease-out infinite;
  -o-animation: uil-ripple 2s ease-out infinite;
  animation: uil-ripple 2s ease-out infinite;
}

.uil-ripple-css div:nth-of-type(1) {
  border-color: #afafb7;
}

.uil-ripple-css div:nth-of-type(2) {
  border-color: #5cffd6;
  -ms-animation-delay: 1s;
  -moz-animation-delay: 1s;
  -webkit-animation-delay: 1s;
  -o-animation-delay: 1s;
  animation-delay: 1s;
}

.upload-button {
  text-decoration: none;
  text-transform: uppercase;
  color: #444 !important;
  letter-spacing: 3px;
  font-weight: normal;
  font-size: 14px;
  display: inline-block;
  padding: 10px 15px;
  position: relative;
  z-index: 1;
  overflow: hidden;
  -webkit-transition: all 0.4s cubic-bezier(0.25, 0.1, 0.2, 1);
  transition: all 0.4s cubic-bezier(0.25, 0.1, 0.2, 1);
}

.upload-button:before,
.upload-button:after {
  position: absolute;
  content: "";
  display: block;
}

.upload-button:before {
  top: -120px;
  left: 50px;
  z-index: -1;
  width: calc(100% + 140px);
  height: 100px;
  -webkit-transition: all 0.4s cubic-bezier(0.25, 0.1, 0.2, 1);
  transition: all 0.4s cubic-bezier(0.25, 0.1, 0.2, 1);
  -webkit-transform: skew(70deg);
  transform: skew(70deg);
  background: #ec5f8b;
}

.upload-button:after {
  top: 0;
  left: 0;
  z-index: -2;
  width: calc(100% - 2px);
  height: calc(100% - 2px);
  border: 1px solid #888;
}

.upload-button:hover:before {
  left: -50px;
  top: -20px;
}

/*pratik*/

div#mainDivId {
  position: fixed;
  z-index: 9999;
  width: 100%;
}

.savetheme {
  font-family: "Poppins", sans-serif;
  position: absolute;
  top: 0px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  z-index: 999;
}

.tab-footer a {
  display: table-cell;
  text-align: center;
  font-size: 25px;
  padding: 0;
  width: 100%;
  color: #fff;
  background: #000;
}

.tab-footer {
  bottom: 0;
  height: 40px;
  color: #fff;
}

button.next {
  position: absolute;
  width: 40px;
  height: 40px;
  background: none;
  right: 0;
  padding: 0px 5px;
  font-size: 24px;
  box-shadow: none;
  border: none;
}

button.previous {
  position: absolute;
  width: 40px;
  height: 40px;
  background: none;
  left: 0;
  padding: 0px 5px;
  font-size: 24px;
  box-shadow: none;
  border: none;
}

.customlabel {
  margin-top: 17px;
  width: 20px;
  text-align: center;
  font-family: "Poppins", sans-serif;
  color: #fff !important;
  z-index: 2;
  cursor: pointer;
  margin-right: 5px;
  /* font-size: initial; */
  font-size: 0.7rem;
  font-weight: 500;
}

.dropdownUnits {
  cursor: pointer;
  height: 35px;
  font-family: "Poppins", sans-serif;
  font-size: var(--f775);
  color: #eee;
  background-color: #333;
  margin-top: 17px;
  margin-right: 15px;
  text-align: center;
  text-align-last: center;
  box-shadow: inset 0 0 2px 2px #ededed;
  border: 1px solid rgb(51 51 51) !important;
}

.customInputBx {
  cursor: pointer;
  width: 45px;
  height: 2rem;
  font-family: "Poppins", sans-serif;
  font-size: 0.7rem;
  color: #eee;
  background-color: #333;
  border: 2px solid #444;
  margin-top: 17px;
  text-align: center;
  margin-right: 15px;
  box-shadow: inset 0 0 2px 2px #ededed;
  border: 1px solid rgb(51 51 51) !important;
  border-radius: var(--radius-5);
}

.ci_nBtn {
  cursor: pointer;
  width: 60px;
  height: auto;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  background-color: #084c7f !important;
  color: #fff !important;
  /* background-color: #333; */
  border: 1px solid #444;
  /* background-color: #bc333f!important; */
  color: #fff !important;
  border: 0 !important;
  border-radius: var(--radius-5);
  text-align: center;
}

input.ci_nBtn.scale {
  padding: 0.2rem 0.5rem;
  text-align: center;
  width: auto;
  min-width: 6rem;
  height: 2rem;
  margin-top: 1rem;
  margin-left: 1rem;
  background-color: var(--btn-secondary) !important;
}

input.ci_nBtn.scale:hover {
  background-color: var(--btn-secondary-hover) !important;
}

.setting input.ci_btn {
  height: auto;
  padding: 0.5rem 1rem;
  margin-top: 20px;
  height: auto;
}

.close-header {
  display: block;
  text-align: right;
  cursor: pointer;
  /* font-size: 4rem; */
  padding: 0.2rem;
}

.close-header i.fa.fa-times.fa-close {
  font-size: 1rem !important;
  margin-top: -0.5rem;
  margin-right: -0.5rem;
}

button#closeB {
  width: 60px;
  height: 30px;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  background-color: #333;
  border: 1px solid #444;
  margin-top: 12px;
  background-color: #ffffff !important;
  color: #000 !important;
  border: 0 !important;
  border-radius: var(--radius-5);
}

.checkBoxC {
  height: 21px;
  width: 21px;
  /* margin-right: 15px; */
  position: relative;
  top: 7px;
  left: 3px;
  cursor: pointer;
}

.clable {
  position: absolute;
  margin-top: 44px;
  /* margin-left: -116px; */
  width: 100%;
  text-align: center;
  font-family: "Poppins", sans-serif;
  color: #fff !important;
  z-index: 2;
  cursor: pointer;
  font-size: small;
}

#filters-icon span,
#setting-icon span {
  position: absolute;
  top: 0;
  left: 37px;
  right: 0;
  bottom: 0;
  margin: 0 auto;
}

/*manisha css*/

.ci-header_text {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  top: 50%;
}

/* loader  */

.ciloader {
  display: none;
}

/*.loader-container {
  position: absolute;
  width: 4rem;
  height: 4rem;
  z-index: 6;
  top: 50%;
  left: 50%;
  z-index: 1;
  transform: translate(-50%, -50%);
  display: none;
}

.loader-circle {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 5px solid #fff;
  border-top-color: #084c7f;
  animation: loader-rotate 2s linear infinite;
  background: #ffffffc4;
}

@keyframes loader-rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.loader-image {
  width: inherit;
  height: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader-image img {
  width: 4.5rem;
  margin: auto;
  padding: 0;
  z-index: 2;
  position: relative;
}

.waiting {
  font-size: 1.2rem;
  white-space: nowrap;
  color: #084c7f;
  font-weight: 700;
}
*/
@media only screen and (max-width: 600px) {
  /* #yesbtn:active{
		background-color: #ef0303e3!important;
	  }
	#nobtn:active{
	  background-color: #ef0303e3!important;
	 }
	 .messageClose:active{
		background-color: #ef0303e3!important;
	 } */
  #webcam_upload {
    display: flex !important;
  }

  .maincidiv {
    width: -webkit-fill-available !important;
  }

  .customlabel {
    font-size: 0.6rem;
    margin-right: 2px;
  }

  .customInputBx {
    width: 35px;
    font-size: var(--f775);
    margin-right: 4px;
  }

  .dropdownUnits {
    cursor: pointer;
    height: 30px;
    width: 35px;
    margin-right: 4px;
  }

  .dropdownUnits {
    cursor: pointer;
    height: 30px;
    width: 35px;
  }

  .saveFinalImg {
    position: fixed;
  }

  .theme {
    height: 100vh;
  }

  small.clable.red {
    left: 34% !important;
  }

  small.clable.green {
    left: 64% !important;
  }

  small.clable.blue {
    left: 95% !important;
  }

  small.clable.brightness {
    left: 64.5% !important;
  }

  small.clable.contrast {
    left: 63.5% !important;
  }

  small.clable.saturation {
    left: 64.5% !important;
  }

  small.clable.sharpen {
    left: 64% !important;
  }
}

@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) {
  /* scan qrcode popup */
  #scan_popup .modal-content {
    width: 100%;
    position: relative;
    max-width: 100% !important;
    left: 0;
    padding: 0rem !important;
  }

  #scan_popup .qr_img {
    width: 300px !important;
    height: 300px !important;
  }

  #scan_popup .qr_img img {
    display: none;
    scale: 0.98;
  }

  #scan_popup .design_link textarea {
    height: 20px;
  }

  #yesbtn:active {
    /* background-color: #ef0303e3!important; */
  }

  #nobtn:active {
    /* background-color: #ef0303e3!important; */
  }

  .messageClose:active {
    /* background-color: #ef0303e3!important; */
  }

  .theme {
    height: 100vh;
  }

  .saveFinalImg {
    position: fixed;
  }

  small.clable.red {
    left: 32% !important;
  }

  small.clable.green {
    left: 57% !important;
  }

  small.clable.blue {
    left: 82% !important;
  }

  small.clable.brightness {
    left: 56.5% !important;
  }

  small.clable.contrast {
    left: 57% !important;
  }

  small.clable.saturation {
    left: 56.5% !important;
  }

  small.clable.sharpen {
    left: 57% !important;
  }
}

/*save img*/
/* .subgroup
         {
         height:auto;
         overflow-y: auto;
         min-height: 100px;
         max-height: 335px;
         padding: 10px 20px;
         }*/
.subgroup {
  height: auto;
  overflow-y: auto !important;
  min-height: 100px;
  /* max-height: 335px; */
  padding: 10px 20px;
  overflow-x: hidden;
}

.subgroup1 {
  padding: 10px 20px;
}

/* .maincidiv {
    position: relative;
    top: 0;
    width: 100%;
    height: 100%;
} */
/* new addition in */
.maincidiv {
  height: 100%;
  width: 600px;
  position: fixed;
  right: 0;
  background: #fff;
}

.window.theme {
  background: #0005;
}

#container_data {
  position: absolute;
  margin: 0 auto;
  padding-left: 0;
  padding-right: 0;
  top: 70px;
  width: 100%;
  color: #fff;
  font-family: "Poppins", sans-serif;
}

.product_grp,
.designs {
  border-bottom: 1px solid #ccc;
  padding: 10px 20px;
}

/* ::-webkit-scrollbar {
width: 7px;
} */
/* ::-webkit-scrollbar-track {
box-shadow: inset 0 0 5px grey; 
border-radius: 10px;
}
::-webkit-scrollbar-thumb {
background: grey; 
border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
background: grey; 
} */
.input_field {
  flex: 0 0 58.333333%;
  max-width: 58.333333%;
  position: relative;
}

.form_box {
  box-sizing: content-box !important;
  -ms-flex: 0 0 100%;
  flex: 0 0 100%;
  max-width: 100%;
  display: inline-flex;
  padding: 0 0px;
  width: 100%;
}

.field_name {
  -ms-flex: 0 0 41.666667%;
  flex: 0 0 41.666667%;
  max-width: 41.666667%;
  color: #000;
  font-size: var(--f875) !important;
  font-weight: 400;
  padding-top: 5px;
}

input.es-inputci,
.dname,
.input_field select {
  padding: 0.375rem 2.25rem 0.375rem 0.75rem;
  background-size: 16px 12px;
  border: 1px solid #ced4da;
  width: 100%;
  /* width: calc(195px - 34px); */
  color: #000000;
  background-color: #fff;
  padding-right: 5px !important;
  border-radius: var(--radius-5);
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  font-size: 0.875rem;
  font-weight: 400;
  word-wrap: normal;
  cursor: pointer;
}

.subgroup select,
.subgroup .input_field {
  margin-bottom: 0.5rem;
}

.subgroup input.dname {
  margin-bottom: 0.5rem;
}

input.es-inputci:focus,
.dname:focus,
.input_field select:focus {
  border-color: #86b7fe;
  outline: 0;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.es-listci {
  color: #000;
}

#ProductPtPGForSave {
  width: 100%;
}

.dname {
  width: 100%;
  cursor: auto !important;
}

input.es-inputci:focus,
.dname:focus,
#default:focus {
  outline: none !important;
}

/* qr code popup */
#scan_popup {
  background-color: #0000003d;
}

#scan_popup .modal-content {
  max-width: 600px;
  position: fixed;
  right: 0;
  left: unset;
}

#scan_popup .modal-fullscreen {
  width: auto;
}

#scan_popup .modal-header {
  background: #545ae4;
  color: #fff;
  padding: 0.5rem 1rem;
  display: flex;
  justify-content: center;
  height: 60px;
}

#scan_popup .modal-header h5 {
  font-size: 1.25rem;
  font-weight: 600;
  text-transform: capitalize;
}

#scan_popup .modal-header .btn {
  padding: 0rem;
  border-radius: 0rem;
  color: #fff;
  padding: 0.1rem;
  position: absolute;
  right: 1rem;
  cursor: pointer;
}

#scan_popup .modal-header svg {
  width: 1.7rem;
  height: 1.7rem;
}

#scan_popup .modal-body {
  padding: 0rem;
}

#scan_popup .qrscan_warp {
  width: 100%;
  height: 100%;
}

#scan_popup .qr-link {
  /* border: 1px solid red; */
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  row-gap: 0.8rem;
}

#scan_popup .qr_img {
  width: 300px;
  height: 300px;
}

#scan_popup .qr_img img {
  display: none !important;
}

#scan_popup .design_link {
  width: 70%;
}

#scan_popup .qr_img {
  display: flex;
  justify-content: center;
}

#scan_popup .design_name {
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  width: 70%;
  overflow: hidden;
  word-break: break-all;
}

#scan_popup .design_link textarea {
  text-align: center;
  border-radius: 0rem;
  font-size: 0.8rem !important;
  word-wrap: break-word;
  resize: none;
  height: 20px;
}

#scan_popup .modal-footer {
  background-color: #efefef;
  justify-content: center;
  height: 70px;
}

#scan_popup .modal-footer .btn {
  background: #545ae4;
  color: #fff;
  border-radius: 0rem;
  text-transform: capitalize;
}

#scan_popup .redirect_q3d {
  padding: 0.35rem 1.9rem;
}

#scan_popup .copy_notification {
  position: absolute;
  top: 90%;
  border-radius: 0rem;
  padding: 0.5rem;
  display: none;
}

@media only screen and (max-width: 600px) {
  /* scan qrcode popup */
  #scan_popup .modal-content {
    width: 100%;
    position: relative;
    max-width: 100% !important;
    left: 0;
    padding: 0rem !important;
  }

  #scan_popup .qr-link {
    row-gap: 0.6rem;
  }

  #scan_popup .qr_img {
    height: 300px;
    width: 300px;
  }

  #scan_popup .design_link {
    width: 75%;
  }

  #scan_popup .qr_img img {
    scale: 0.9;
  }

  #scan_popup .design_link textarea {
    height: auto;
  }

  #webcam_upload {
    display: flex !important;
  }

  .theme {
    height: 100vh;
  }

  .designs > div,
  .product_grp > div,
  .subgroup > div {
    display: flex;
    flex-wrap: nowrap;
  }

  #container_data {
    margin: 0;
    width: 92%;
    /* transform: translate(-54%,-63%); */
    max-height: calc(100vh);
    height: auto;
  }

  .subgroup {
    /* max-height: 335px;*/
    max-height: 390px;
    min-height: 60px;
    overflow-y: auto !important;
  }

  .dname {
    width: 100%;
    font-size: 16px;
    font-weight: 100;
  }

  #ProductPtPGForSave {
    width: 100%;
  }

  input.es-inputci,
  .dname,
  .input_field select {
    width: 100%;
  }

  .input_field {
    width: 100%;
  }
}

@media (min-width: 1080px) and (max-width: 1920px) and (orientation: portrait) {
  /* scan qrcode popup */
  #scan_popup .modal-content {
    width: 100%;
    position: relative;
    max-width: 100% !important;
    left: 0;
    padding: 0rem !important;
  }

  #scan_popup .modal-header {
    padding: 1.2rem 1.4rem;
    height: auto;
  }

  #scan_popup .modal-header h5 {
    font-size: 2rem;
  }

  #scan_popup .modal-header svg {
    width: 3rem;
    height: 3rem;
  }

  #scan_popup .qr-link {
    row-gap: 1.5rem;
  }

  #scan_popup .qr_img {
    width: 500px;
    height: 500px;
  }

  #scan_popup .design_link {
    width: 70%;
  }

  #scan_popup .qr_img img {
    scale: 1;
    display: none;
  }

  #scan_popup .design_link textarea {
    font-size: 1.1rem !important;
    padding: 0.6rem 0.5rem;
    min-height: 50px;
  }

  #scan_popup .modal-footer {
    padding: 1rem 1.8rem;
    height: auto;
  }

  #scan_popup .modal-footer .btn {
    padding: 0.9rem 1.5rem;
    font-size: 1.5rem;
    font-weight: 700;
  }

  .maincidiv {
    width: 100%;
  }

  input.ci_btn {
    background-size: 12% !important;
    background-position: 32px !important;
  }

  #prevID,
  .back {
    left: 30px !important;
  }

  /* .tab-header{
		height: 100px;
	} */
  #nextID,
  a#saveNext-btn {
    right: 30px !important;
  }

  #yesbtn:active {
    background-color: #ef0303e3 !important;
  }

  #nobtn:active {
    background-color: #ef0303e3 !important;
  }

  .messageClose:active {
    background-color: #ef0303e3 !important;
  }

  .setting input.ci_btn {
    margin-top: 48px;
  }

  .saveFinalImg {
    position: fixed;
  }

  .theme {
    height: 100vh;
  }

  img#closeB {
    position: absolute;
    top: 18px;
    right: 18px;
    width: 60px;
  }

  #container_data {
    top: 100px !important;
  }

  .container form {
    width: 100vw;
  }

  input.es-inputci {
    width: calc(10vw - 34px) !important;
  }

  input.es-inputci,
  .dname,
  .input_field select {
    font-size: 1.5rem;
  }

  .field_name {
    font-size: 1.5rem;
  }

  span#export {
    margin-top: 12px;
    width: 150px;
    font-size: 1.7rem;
    height: 74px;
    padding: 1rem;
  }

  .saveFinalImg {
    height: 148px !important;
    margin-top: 36px;
  }

  a#applyimg span {
    width: 150px;
    height: 74px;
    font-size: 1.7rem;
    padding: 1rem;
  }

  /* akasht.25 */
  .circular {
    width: 100px;
    height: auto;
    padding: 2rem !important;
  }

  .customlabel {
    font-size: 1.4rem !important;
  }

  .setting li {
    display: inline;
    /* margin: 0px 65px; */
  }

  .clable {
    bottom: 1rem;
    left: 0rem;
  }

  #mainDivId .nav {
    height: 50px !important;
    /* margin-top: 36px!important; */
  }

  a#applyimg {
    margin-top: 36px !important;
  }

  .ci-label {
    position: absolute;
    margin-left: -105px;
    width: 100px;
    margin-top: 88px !important;
    font-size: 1.4rem !important;
  }

  .dropdownUnits {
    width: 100px;
    height: 50px !important;
    font-size: 1.1rem;
    margin-top: 36px;
  }

  .customInputBx {
    width: 100px;
    height: 50px;
    margin-right: 15px;
    font-size: 1.1rem;
  }

  .checkBoxC {
    height: 25px;
    width: 25px;
    top: 7px;
  }

  .ci_nBtn {
    margin-top: 36px !important;
    width: 150px;
    font-size: 1.7rem;
    height: 74px;
  }

  input.ci_nBtn.scale {
    min-width: 9rem;
    height: 3.5rem;
  }

  #saveFinalImgId {
    margin-top: 20px !important;
  }

  .downloadDesign {
    padding: 0.5rem;
    right: 6rem;
    top: 1.5rem;
  }

  button.confirmPopupbt,
  button.confirmPopupbt.cancel {
    width: 125px;
  }

  input.confirmPopupbt,
  button.confirmPopupbt.confirmview {
    width: 125px;
  }

  .setting {
    height: 150px;
    padding-top: 0px;
  }

  ul#rgb li,
  ul#brightness #rgb-item,
  ul#contrast #rgb-item,
  ul#saturation #rgb-item,
  ul#sharpen #rgb-item {
    padding-top: 45px;
  }

  #saveNext-btn {
    position: absolute;
    bottom: 0;
    height: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .confirmPopup {
    width: 500px;
    font-size: 1.5rem;
    padding: 2rem 2.5rem;
  }

  .maincidiv {
    width: 100%;
  }

  .close-header i.fa.fa-times.fa-close {
    font-size: 2rem !important;
  }

  .theme {
    height: calc(100vh);
  }

  .ci_btn {
    margin-top: 40px;
    width: 270px;
    font-size: 1.7rem;
    height: 74px;
  }

  .back {
    height: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  div#menuTabs {
    height: 150px;
    position: relative;
  }

  .next_ {
    height: 150px;
  }

  .back-icon {
    width: 50px;
    height: 50px;
  }

  .next-icon {
    width: 50px;
    height: 50px;
  }
}

@media (min-width: 1000px) {
  input.ci_btn {
    background-size: 18px;
    background-repeat: no-repeat;
    background-position: 14px 7px;
  }

  .nomobile {
    display: flex;
  }

  .mobile-icon {
    display: none;
  }

  #prevID,
  .back {
    left: 10%;
    z-index: 999;
  }

  .next-wrapp {
    position: absolute;
    right: 10%;
    z-index: 999;
  }

  #nextID,
  a#saveNext-btn,
  .next-wrapp {
    right: 10%;
    height: 100%;
    align-items: center;
    display: flex;
  }

  /* .next-wrapp{
  bottom: 0px;
    position: absolute;
    z-index: 99;
    right: 0px; 
    cursor: pointer;
    border: none;
    display: flex;
    padding: 8px;
    padding-top: 8px;
    padding-right: 8px;
    padding-bottom: 8px;
    padding-left: 8px;
    justify-content: center;
  
} */
  .next-wrapp .next-save {
    border: 1px solid var(--btn-primary);
    padding: 0.4rem 0.8rem;
    font-size: var(--f875);
    display: flex;
    align-items: center;
    min-width: 5.5rem;
    width: 5.5rem;
    justify-content: center;
    background-color: var(--btn-primary);
    color: #fff;
    cursor: pointer;
    height: 2.5rem;
  }

  img.size.gallery {
    padding: 0;
    width: 20px !important;
    margin-right: 0.5rem;
    padding-right: 0;
    margin-right: 0.5rem;
  }

  ul#settings {
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }

  .optionForm {
    display: flex;
    flex-direction: column;
    min-width: 38px;
    justify-content: center;
    align-items: center;
  }

  .optionForm:first-child {
    margin-right: 1rem;
  }

  .dropdownUnits {
    margin-top: 0 !important;
    height: 2rem;
    margin-right: 0;
    min-width: 80px;
    border-radius: var(--radius-5);
  }

  .customInputBx {
    margin-top: 0 !important;
    min-width: 80px;
    margin-right: 0;
  }

  .customlabel {
    margin-top: 0 !important;
    width: 100%;
  }

  .imglock,
  .imgunlock {
    display: none;
    width: 30px;
    height: 30px;
    position: absolute;
    z-index: 9999999;
  }

  .optionForm img {
    padding: 0;
    opacity: 1;
    width: 38px;
    height: 38px;
  }

  .optionForm.customInputBx,
  .optionForm.lock .customInputBx {
    margin-top: 0 !important;
    min-width: 80px;
    margin-right: 0;
    background-color: #bbb;
    box-shadow: inset 0 0 2px 2px #bbb;
  }

  .optionForm.customInputBx,
  .optionForm.lock .customInputBx {
    margin-top: 0 !important;
    min-width: 80px;
    margin-right: 0;
    box-shadow: inset 0 0 2px 2px #bbb !important;
  }

  .checkBoxC {
    opacity: 0;
    z-index: 9999999;
  }
}

@media (max-width: 999.98px) {
  div#package input {
    min-height: 38px !important;
  }

  input.material_input_box {
    height: 27px !important;
    min-height: 27px !important;
  }

  /* login popup invoke button */
  #login_btn span {
    display: none;
  }

  #reset_btn_settings span {
    display: none;
  }

  #login_btn {
    height: 2.5rem;
    min-width: 2.5rem;
    padding: 4px;
    display: block;
  }

  #login_btn svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  .close_login {
    right: 1.4rem;
  }

  .blackTds .newNext {
    width: 2rem;
    height: 2rem;
    min-width: 2rem;
  }

  .blackTds .newNext#export-btn {
    width: 2rem !important;
    height: 2rem !important;
    min-width: 2rem !important;
  }

  .mobile-icon {
    width: 2rem;
    height: 2rem;
    min-width: 2rem;
    display: flex;
    margin-top: 1rem;
    justify-content: center;
    align-items: center;
  }

  .mobile-icon img {
    width: 1rem !important;
    filter: none !important;
  }

  div#apply_btn.mobile-icon {
    background: var(--btn-secondary);
  }

  div#reset_btn_settings.mobile-icon {
    margin-left: 0.5rem;
    background: #333;
  }

  .nomobile {
    display: none;
  }

  .blackTds .newNext span {
    display: none;
  }

  .blackTds .next-wrapp span {
    display: none;
  }

  .blackTds .newNext img {
    display: block;
  }

  .blackTds .next-icon {
    padding: 0.4rem 0.8rem;
    filter: none !important;
  }

  input.ci_nBtn.scale.bt1 {
    display: flex;
  }

  input.ci_nBtn.scale.bt1.nomobile {
    display: none;
  }

  input.ci_nBtn.scale.bt2 {
    display: flex;
    height: 30px;
    width: 30px;
  }

  .maincidiv {
    width: 100%;
  }

  .blackTds label.imgup {
    right: 4rem;
  }

  #container_data {
    width: 100%;
    max-width: 100%;
  }

  .blackTds a#saveNext-btn {
    right: 1rem;
    margin-top: 0;
    min-width: 2rem;
    height: 2rem;
    position: fixed;
    top: auto !important;
    width: 2rem;
    display: flex;
  }

  a#download-dpi-btn,
  label.imgup {
    width: 2.5rem !important;
  }

  a#download-dpi-btn {
    position: absolute;
    left: 4.4rem;
  }

  #login_logout {
    padding: 0.5rem 0rem;
  }

  a#download-dpi-btn img,
  label.imgup img {
    margin-right: 0rem !important;
  }

  label.imgup span,
  #download-dpi-btn span {
    display: none;
  }

  .setting input.ci_btn {
    font-size: var(--f875);
  }

  .optionForm.compress {
    height: 72px !important;
    width: 38px !important;
    min-width: 20px;
  }

  ul#settings {
    align-items: center;
    gap: 0.2rem;
  }

  .optionForm {
    display: flex;
    flex-direction: column;
    min-width: 74px;
    justify-content: center;
    align-items: center;
  }

  .optionForm:first-child {
    margin-right: 1rem;
  }

  .dropdownUnits {
    margin-top: 0 !important;
    height: 2rem;
    margin-right: 0;
    min-width: 70px;
  }

  .customInputBx {
    margin-top: 0 !important;
    min-width: 70px;
    margin-right: 0;
  }

  .customlabel {
    margin-top: 0 !important;
    width: 100%;
  }

  .imglock,
  .imgunlock {
    display: none;
    width: 30px;
    height: 30px;
    position: absolute;
    z-index: 9999999;
  }

  .optionForm img {
    padding: 0;
    opacity: 1;
    width: 38px;
    height: 38px;
  }

  .checkBoxC {
    opacity: 0;
    z-index: 9999999;
  }

  input.ci_nBtn.scale {
    width: 100%;
    min-width: 100%;
    margin-left: 0;
    height: 100%;
    border: 1px solid var(--btn-secondary) !important;
    background-color: var(--btn-secondary) !important;
  }

  .optionForm.scale {
    min-width: 30px !important;
    width: 30px;
    height: 30px;
    margin-left: 0.4rem;
  }

  .optionForm:first-child {
    margin-right: 0;
  }
}

/* ul#settings.lock .customInputBx#cheight{
	background-color:#c7c0c0 !important;
	box-shadow: inset 0 0 2px 2px #c7c0c0;
	
} */
ul#settings.lock .imglock {
  display: flex;
  justify-content: center;
}

ul#settings.unlock .imgunlock {
  display: flex;
}

.cancelCrop {
  background-image: url(${___CSS_LOADER_URL_REPLACEMENT_0___}) !important;
  background-size: 18px !important;
  background-repeat: no-repeat !important;
  background-position: 14px 7px !important;
  min-width: 120px !important;
}

input.ci_btn.cropcc {
  background-image: url(${___CSS_LOADER_URL_REPLACEMENT_1___});
}

input.ci_btn.rotatecc {
  background-image: url(${___CSS_LOADER_URL_REPLACEMENT_2___});
}

input.flipH {
  background-image: url(${___CSS_LOADER_URL_REPLACEMENT_3___});
  background-position: 6px 7px !important;
  padding-left: 1.8rem !important;
}

input.flipV {
  background-image: url(${___CSS_LOADER_URL_REPLACEMENT_4___});
  background-position: 6px 7px !important;
}

input.ci_btn {
  background-size: 18px;
  background-repeat: no-repeat;
  background-position: 14px 7px;
}

input.ci_btn.flipH,
input.ci_btn.flipV {
  min-width: 135px;
}

label.imgup {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #0d6efd;
  border-color: #0d6efd;
  padding: 0rem 0.5rem;
  cursor: pointer;
  margin: 0.5rem;
  height: 2.2rem;
  width: 6.5rem;
  border-radius: var(--radius-5);
  font-size: 0.8rem;
  color: #fff;
}

label.imgup:hover,
a#download-dpi-btn:hover {
  background: #0a60df;
}

ul#settings {
  justify-content: center;
}

@media only screen and (max-width: 480px) {
  ul#settings {
    justify-content: left;
  }

  .optionForm.compress {
    width: 45px;
    height: 72px !important;
    width: 45px !important;
    min-width: 45px;
  }
}

/* shubham Added below purpose: show * for mandatory fields */
.field_name > span.active {
  color: red;
}

span.inactive {
  display: none;
}

#product_ft .form_box {
  margin-bottom: 20px;
}

.subgroup select,
.subgroup .input_field {
  margin-bottom: 0;
}

div#package input {
  min-height: 38px;
}

div#package select {
  min-height: 40px;
}

.u_user_pass_eye img.u_pass_eye_show {
  content: url(${___CSS_LOADER_URL_REPLACEMENT_5___});
}

.u_user_pass_eye img {
  content: url(${___CSS_LOADER_URL_REPLACEMENT_6___});
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 314:
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ 417:
/***/ ((module) => {

"use strict";


module.exports = function (url, options) {
  if (!options) {
    options = {};
  }
  if (!url) {
    return url;
  }
  url = String(url.__esModule ? url.default : url);

  // If url is already wrapped in quotes, remove them
  if (/^['"].*['"]$/.test(url)) {
    url = url.slice(1, -1);
  }
  if (options.hash) {
    url += options.hash;
  }

  // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls
  if (/["'() \t\n]|(%20)/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
  }
  return url;
};

/***/ }),

/***/ 601:
/***/ ((module) => {

"use strict";


module.exports = function (i) {
  return i[1];
};

/***/ }),

/***/ 680:
/***/ (function(module) {

/*
 * QRious v4.0.2
 * Copyright (C) 2017 Alasdair Mercer
 * Copyright (C) 2010 Tom Zerucha
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
(function (global, factory) {
   true ? module.exports = factory() :
  0;
}(this, (function () { 'use strict';

  /*
   * Copyright (C) 2017 Alasdair Mercer, !ninja
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   */

  /**
   * A bare-bones constructor for surrogate prototype swapping.
   *
   * @private
   * @constructor
   */
  var Constructor = /* istanbul ignore next */ function() {};
  /**
   * A reference to <code>Object.prototype.hasOwnProperty</code>.
   *
   * @private
   * @type {Function}
   */
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  /**
   * A reference to <code>Array.prototype.slice</code>.
   *
   * @private
   * @type {Function}
   */
  var slice = Array.prototype.slice;

  /**
   * Creates an object which inherits the given <code>prototype</code>.
   *
   * Optionally, the created object can be extended further with the specified <code>properties</code>.
   *
   * @param {Object} prototype - the prototype to be inherited by the created object
   * @param {Object} [properties] - the optional properties to be extended by the created object
   * @return {Object} The newly created object.
   * @private
   */
  function createObject(prototype, properties) {
    var result;
    /* istanbul ignore next */
    if (typeof Object.create === 'function') {
      result = Object.create(prototype);
    } else {
      Constructor.prototype = prototype;
      result = new Constructor();
      Constructor.prototype = null;
    }

    if (properties) {
      extendObject(true, result, properties);
    }

    return result;
  }

  /**
   * Extends the constructor to which this method is associated with the <code>prototype</code> and/or
   * <code>statics</code> provided.
   *
   * If <code>name</code> is provided, it will be used as the class name and can be accessed via a special
   * <code>class_</code> property on the child constructor, otherwise the class name of the super constructor will be used
   * instead. The class name may also be used string representation for instances of the child constructor (via
   * <code>toString</code>), but this is not applicable to the <i>lite</i> version of Nevis.
   *
   * If <code>constructor</code> is provided, it will be used as the constructor for the child, otherwise a simple
   * constructor which only calls the super constructor will be used instead.
   *
   * The super constructor can be accessed via a special <code>super_</code> property on the child constructor.
   *
   * @param {string} [name=this.class_] - the class name to be used for the child constructor
   * @param {Function} [constructor] - the constructor for the child
   * @param {Object} [prototype] - the prototype properties to be defined for the child
   * @param {Object} [statics] - the static properties to be defined for the child
   * @return {Function} The child <code>constructor</code> provided or the one created if none was given.
   * @public
   */
  function extend(name, constructor, prototype, statics) {
    var superConstructor = this;

    if (typeof name !== 'string') {
      statics = prototype;
      prototype = constructor;
      constructor = name;
      name = null;
    }

    if (typeof constructor !== 'function') {
      statics = prototype;
      prototype = constructor;
      constructor = function() {
        return superConstructor.apply(this, arguments);
      };
    }

    extendObject(false, constructor, superConstructor, statics);

    constructor.prototype = createObject(superConstructor.prototype, prototype);
    constructor.prototype.constructor = constructor;

    constructor.class_ = name || superConstructor.class_;
    constructor.super_ = superConstructor;

    return constructor;
  }

  /**
   * Extends the specified <code>target</code> object with the properties in each of the <code>sources</code> provided.
   *
   * if any source is <code>null</code> it will be ignored.
   *
   * @param {boolean} own - <code>true</code> to only copy <b>own</b> properties from <code>sources</code> onto
   * <code>target</code>; otherwise <code>false</code>
   * @param {Object} target - the target object which should be extended
   * @param {...Object} [sources] - the source objects whose properties are to be copied onto <code>target</code>
   * @return {void}
   * @private
   */
  function extendObject(own, target, sources) {
    sources = slice.call(arguments, 2);

    var property;
    var source;

    for (var i = 0, length = sources.length; i < length; i++) {
      source = sources[i];

      for (property in source) {
        if (!own || hasOwnProperty.call(source, property)) {
          target[property] = source[property];
        }
      }
    }
  }

  var extend_1 = extend;

  /**
   * The base class from which all others should extend.
   *
   * @public
   * @constructor
   */
  function Nevis() {}
  Nevis.class_ = 'Nevis';
  Nevis.super_ = Object;

  /**
   * Extends the constructor to which this method is associated with the <code>prototype</code> and/or
   * <code>statics</code> provided.
   *
   * If <code>name</code> is provided, it will be used as the class name and can be accessed via a special
   * <code>class_</code> property on the child constructor, otherwise the class name of the super constructor will be used
   * instead. The class name may also be used string representation for instances of the child constructor (via
   * <code>toString</code>), but this is not applicable to the <i>lite</i> version of Nevis.
   *
   * If <code>constructor</code> is provided, it will be used as the constructor for the child, otherwise a simple
   * constructor which only calls the super constructor will be used instead.
   *
   * The super constructor can be accessed via a special <code>super_</code> property on the child constructor.
   *
   * @param {string} [name=this.class_] - the class name to be used for the child constructor
   * @param {Function} [constructor] - the constructor for the child
   * @param {Object} [prototype] - the prototype properties to be defined for the child
   * @param {Object} [statics] - the static properties to be defined for the child
   * @return {Function} The child <code>constructor</code> provided or the one created if none was given.
   * @public
   * @static
   * @memberof Nevis
   */
  Nevis.extend = extend_1;

  var nevis = Nevis;

  var lite = nevis;

  /**
   * Responsible for rendering a QR code {@link Frame} on a specific type of element.
   *
   * A renderer may be dependant on the rendering of another element, so the ordering of their execution is important.
   *
   * The rendering of a element can be deferred by disabling the renderer initially, however, any attempt get the element
   * from the renderer will result in it being immediately enabled and the element being rendered.
   *
   * @param {QRious} qrious - the {@link QRious} instance to be used
   * @param {*} element - the element onto which the QR code is to be rendered
   * @param {boolean} [enabled] - <code>true</code> this {@link Renderer} is enabled; otherwise <code>false</code>.
   * @public
   * @class
   * @extends Nevis
   */
  var Renderer = lite.extend(function(qrious, element, enabled) {
    /**
     * The {@link QRious} instance.
     *
     * @protected
     * @type {QRious}
     * @memberof Renderer#
     */
    this.qrious = qrious;

    /**
     * The element onto which this {@link Renderer} is rendering the QR code.
     *
     * @protected
     * @type {*}
     * @memberof Renderer#
     */
    this.element = element;
    this.element.qrious = qrious;

    /**
     * Whether this {@link Renderer} is enabled.
     *
     * @protected
     * @type {boolean}
     * @memberof Renderer#
     */
    this.enabled = Boolean(enabled);
  }, {

    /**
     * Draws the specified QR code <code>frame</code> on the underlying element.
     *
     * Implementations of {@link Renderer} <b>must</b> override this method with their own specific logic.
     *
     * @param {Frame} frame - the {@link Frame} to be drawn
     * @return {void}
     * @protected
     * @abstract
     * @memberof Renderer#
     */
    draw: function(frame) {},

    /**
     * Returns the element onto which this {@link Renderer} is rendering the QR code.
     *
     * If this method is called while this {@link Renderer} is disabled, it will be immediately enabled and rendered
     * before the element is returned.
     *
     * @return {*} The element.
     * @public
     * @memberof Renderer#
     */
    getElement: function() {
      if (!this.enabled) {
        this.enabled = true;
        this.render();
      }

      return this.element;
    },

    /**
     * Calculates the size (in pixel units) to represent an individual module within the QR code based on the
     * <code>frame</code> provided.
     *
     * Any configured padding will be excluded from the returned size.
     *
     * The returned value will be at least one, even in cases where the size of the QR code does not fit its contents.
     * This is done so that the inevitable clipping is handled more gracefully since this way at least something is
     * displayed instead of just a blank space filled by the background color.
     *
     * @param {Frame} frame - the {@link Frame} from which the module size is to be derived
     * @return {number} The pixel size for each module in the QR code which will be no less than one.
     * @protected
     * @memberof Renderer#
     */
    getModuleSize: function(frame) {
      var qrious = this.qrious;
      var padding = qrious.padding || 0;
      var pixels = Math.floor((qrious.size - (padding * 2)) / frame.width);

      return Math.max(1, pixels);
    },

    /**
     * Calculates the offset/padding (in pixel units) to be inserted before the QR code based on the <code>frame</code>
     * provided.
     *
     * The returned value will be zero if there is no available offset or if the size of the QR code does not fit its
     * contents. It will never be a negative value. This is done so that the inevitable clipping appears more naturally
     * and it is not clipped from all directions.
     *
     * @param {Frame} frame - the {@link Frame} from which the offset is to be derived
     * @return {number} The pixel offset for the QR code which will be no less than zero.
     * @protected
     * @memberof Renderer#
     */
    getOffset: function(frame) {
      var qrious = this.qrious;
      var padding = qrious.padding;

      if (padding != null) {
        return padding;
      }

      var moduleSize = this.getModuleSize(frame);
      var offset = Math.floor((qrious.size - (moduleSize * frame.width)) / 2);

      return Math.max(0, offset);
    },

    /**
     * Renders a QR code on the underlying element based on the <code>frame</code> provided.
     *
     * @param {Frame} frame - the {@link Frame} to be rendered
     * @return {void}
     * @public
     * @memberof Renderer#
     */
    render: function(frame) {
      if (this.enabled) {
        this.resize();
        this.reset();
        this.draw(frame);
      }
    },

    /**
     * Resets the underlying element, effectively clearing any previously rendered QR code.
     *
     * Implementations of {@link Renderer} <b>must</b> override this method with their own specific logic.
     *
     * @return {void}
     * @protected
     * @abstract
     * @memberof Renderer#
     */
    reset: function() {},

    /**
     * Ensures that the size of the underlying element matches that defined on the associated {@link QRious} instance.
     *
     * Implementations of {@link Renderer} <b>must</b> override this method with their own specific logic.
     *
     * @return {void}
     * @protected
     * @abstract
     * @memberof Renderer#
     */
    resize: function() {}

  });

  var Renderer_1 = Renderer;

  /**
   * An implementation of {@link Renderer} for working with <code>canvas</code> elements.
   *
   * @public
   * @class
   * @extends Renderer
   */
  var CanvasRenderer = Renderer_1.extend({

    /**
     * @override
     */
    draw: function(frame) {
      var i, j;
      var qrious = this.qrious;
      var moduleSize = this.getModuleSize(frame);
      var offset = this.getOffset(frame);
      var context = this.element.getContext('2d');

      context.fillStyle = qrious.foreground;
      context.globalAlpha = qrious.foregroundAlpha;

      for (i = 0; i < frame.width; i++) {
        for (j = 0; j < frame.width; j++) {
          if (frame.buffer[(j * frame.width) + i]) {
            context.fillRect((moduleSize * i) + offset, (moduleSize * j) + offset, moduleSize, moduleSize);
          }
        }
      }
    },

    /**
     * @override
     */
    reset: function() {
      var qrious = this.qrious;
      var context = this.element.getContext('2d');
      var size = qrious.size;

      context.lineWidth = 1;
      context.clearRect(0, 0, size, size);
      context.fillStyle = qrious.background;
      context.globalAlpha = qrious.backgroundAlpha;
      context.fillRect(0, 0, size, size);
    },

    /**
     * @override
     */
    resize: function() {
      var element = this.element;

      element.width = element.height = this.qrious.size;
    }

  });

  var CanvasRenderer_1 = CanvasRenderer;

  /* eslint no-multi-spaces: "off" */



  /**
   * Contains alignment pattern information.
   *
   * @public
   * @class
   * @extends Nevis
   */
  var Alignment = lite.extend(null, {

    /**
     * The alignment pattern block.
     *
     * @public
     * @static
     * @type {number[]}
     * @memberof Alignment
     */
    BLOCK: [
      0,  11, 15, 19, 23, 27, 31,
      16, 18, 20, 22, 24, 26, 28, 20, 22, 24, 24, 26, 28, 28, 22, 24, 24,
      26, 26, 28, 28, 24, 24, 26, 26, 26, 28, 28, 24, 26, 26, 26, 28, 28
    ]

  });

  var Alignment_1 = Alignment;

  /* eslint no-multi-spaces: "off" */



  /**
   * Contains error correction information.
   *
   * @public
   * @class
   * @extends Nevis
   */
  var ErrorCorrection = lite.extend(null, {

    /**
     * The error correction blocks.
     *
     * There are four elements per version. The first two indicate the number of blocks, then the data width, and finally
     * the ECC width.
     *
     * @public
     * @static
     * @type {number[]}
     * @memberof ErrorCorrection
     */
    BLOCKS: [
      1,  0,  19,  7,     1,  0,  16,  10,    1,  0,  13,  13,    1,  0,  9,   17,
      1,  0,  34,  10,    1,  0,  28,  16,    1,  0,  22,  22,    1,  0,  16,  28,
      1,  0,  55,  15,    1,  0,  44,  26,    2,  0,  17,  18,    2,  0,  13,  22,
      1,  0,  80,  20,    2,  0,  32,  18,    2,  0,  24,  26,    4,  0,  9,   16,
      1,  0,  108, 26,    2,  0,  43,  24,    2,  2,  15,  18,    2,  2,  11,  22,
      2,  0,  68,  18,    4,  0,  27,  16,    4,  0,  19,  24,    4,  0,  15,  28,
      2,  0,  78,  20,    4,  0,  31,  18,    2,  4,  14,  18,    4,  1,  13,  26,
      2,  0,  97,  24,    2,  2,  38,  22,    4,  2,  18,  22,    4,  2,  14,  26,
      2,  0,  116, 30,    3,  2,  36,  22,    4,  4,  16,  20,    4,  4,  12,  24,
      2,  2,  68,  18,    4,  1,  43,  26,    6,  2,  19,  24,    6,  2,  15,  28,
      4,  0,  81,  20,    1,  4,  50,  30,    4,  4,  22,  28,    3,  8,  12,  24,
      2,  2,  92,  24,    6,  2,  36,  22,    4,  6,  20,  26,    7,  4,  14,  28,
      4,  0,  107, 26,    8,  1,  37,  22,    8,  4,  20,  24,    12, 4,  11,  22,
      3,  1,  115, 30,    4,  5,  40,  24,    11, 5,  16,  20,    11, 5,  12,  24,
      5,  1,  87,  22,    5,  5,  41,  24,    5,  7,  24,  30,    11, 7,  12,  24,
      5,  1,  98,  24,    7,  3,  45,  28,    15, 2,  19,  24,    3,  13, 15,  30,
      1,  5,  107, 28,    10, 1,  46,  28,    1,  15, 22,  28,    2,  17, 14,  28,
      5,  1,  120, 30,    9,  4,  43,  26,    17, 1,  22,  28,    2,  19, 14,  28,
      3,  4,  113, 28,    3,  11, 44,  26,    17, 4,  21,  26,    9,  16, 13,  26,
      3,  5,  107, 28,    3,  13, 41,  26,    15, 5,  24,  30,    15, 10, 15,  28,
      4,  4,  116, 28,    17, 0,  42,  26,    17, 6,  22,  28,    19, 6,  16,  30,
      2,  7,  111, 28,    17, 0,  46,  28,    7,  16, 24,  30,    34, 0,  13,  24,
      4,  5,  121, 30,    4,  14, 47,  28,    11, 14, 24,  30,    16, 14, 15,  30,
      6,  4,  117, 30,    6,  14, 45,  28,    11, 16, 24,  30,    30, 2,  16,  30,
      8,  4,  106, 26,    8,  13, 47,  28,    7,  22, 24,  30,    22, 13, 15,  30,
      10, 2,  114, 28,    19, 4,  46,  28,    28, 6,  22,  28,    33, 4,  16,  30,
      8,  4,  122, 30,    22, 3,  45,  28,    8,  26, 23,  30,    12, 28, 15,  30,
      3,  10, 117, 30,    3,  23, 45,  28,    4,  31, 24,  30,    11, 31, 15,  30,
      7,  7,  116, 30,    21, 7,  45,  28,    1,  37, 23,  30,    19, 26, 15,  30,
      5,  10, 115, 30,    19, 10, 47,  28,    15, 25, 24,  30,    23, 25, 15,  30,
      13, 3,  115, 30,    2,  29, 46,  28,    42, 1,  24,  30,    23, 28, 15,  30,
      17, 0,  115, 30,    10, 23, 46,  28,    10, 35, 24,  30,    19, 35, 15,  30,
      17, 1,  115, 30,    14, 21, 46,  28,    29, 19, 24,  30,    11, 46, 15,  30,
      13, 6,  115, 30,    14, 23, 46,  28,    44, 7,  24,  30,    59, 1,  16,  30,
      12, 7,  121, 30,    12, 26, 47,  28,    39, 14, 24,  30,    22, 41, 15,  30,
      6,  14, 121, 30,    6,  34, 47,  28,    46, 10, 24,  30,    2,  64, 15,  30,
      17, 4,  122, 30,    29, 14, 46,  28,    49, 10, 24,  30,    24, 46, 15,  30,
      4,  18, 122, 30,    13, 32, 46,  28,    48, 14, 24,  30,    42, 32, 15,  30,
      20, 4,  117, 30,    40, 7,  47,  28,    43, 22, 24,  30,    10, 67, 15,  30,
      19, 6,  118, 30,    18, 31, 47,  28,    34, 34, 24,  30,    20, 61, 15,  30
    ],

    /**
     * The final format bits with mask (level << 3 | mask).
     *
     * @public
     * @static
     * @type {number[]}
     * @memberof ErrorCorrection
     */
    FINAL_FORMAT: [
      // L
      0x77c4, 0x72f3, 0x7daa, 0x789d, 0x662f, 0x6318, 0x6c41, 0x6976,
      // M
      0x5412, 0x5125, 0x5e7c, 0x5b4b, 0x45f9, 0x40ce, 0x4f97, 0x4aa0,
      // Q
      0x355f, 0x3068, 0x3f31, 0x3a06, 0x24b4, 0x2183, 0x2eda, 0x2bed,
      // H
      0x1689, 0x13be, 0x1ce7, 0x19d0, 0x0762, 0x0255, 0x0d0c, 0x083b
    ],

    /**
     * A map of human-readable ECC levels.
     *
     * @public
     * @static
     * @type {Object.<string, number>}
     * @memberof ErrorCorrection
     */
    LEVELS: {
      L: 1,
      M: 2,
      Q: 3,
      H: 4
    }

  });

  var ErrorCorrection_1 = ErrorCorrection;

  /**
   * Contains Galois field information.
   *
   * @public
   * @class
   * @extends Nevis
   */
  var Galois = lite.extend(null, {

    /**
     * The Galois field exponent table.
     *
     * @public
     * @static
     * @type {number[]}
     * @memberof Galois
     */
    EXPONENT: [
      0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1d, 0x3a, 0x74, 0xe8, 0xcd, 0x87, 0x13, 0x26,
      0x4c, 0x98, 0x2d, 0x5a, 0xb4, 0x75, 0xea, 0xc9, 0x8f, 0x03, 0x06, 0x0c, 0x18, 0x30, 0x60, 0xc0,
      0x9d, 0x27, 0x4e, 0x9c, 0x25, 0x4a, 0x94, 0x35, 0x6a, 0xd4, 0xb5, 0x77, 0xee, 0xc1, 0x9f, 0x23,
      0x46, 0x8c, 0x05, 0x0a, 0x14, 0x28, 0x50, 0xa0, 0x5d, 0xba, 0x69, 0xd2, 0xb9, 0x6f, 0xde, 0xa1,
      0x5f, 0xbe, 0x61, 0xc2, 0x99, 0x2f, 0x5e, 0xbc, 0x65, 0xca, 0x89, 0x0f, 0x1e, 0x3c, 0x78, 0xf0,
      0xfd, 0xe7, 0xd3, 0xbb, 0x6b, 0xd6, 0xb1, 0x7f, 0xfe, 0xe1, 0xdf, 0xa3, 0x5b, 0xb6, 0x71, 0xe2,
      0xd9, 0xaf, 0x43, 0x86, 0x11, 0x22, 0x44, 0x88, 0x0d, 0x1a, 0x34, 0x68, 0xd0, 0xbd, 0x67, 0xce,
      0x81, 0x1f, 0x3e, 0x7c, 0xf8, 0xed, 0xc7, 0x93, 0x3b, 0x76, 0xec, 0xc5, 0x97, 0x33, 0x66, 0xcc,
      0x85, 0x17, 0x2e, 0x5c, 0xb8, 0x6d, 0xda, 0xa9, 0x4f, 0x9e, 0x21, 0x42, 0x84, 0x15, 0x2a, 0x54,
      0xa8, 0x4d, 0x9a, 0x29, 0x52, 0xa4, 0x55, 0xaa, 0x49, 0x92, 0x39, 0x72, 0xe4, 0xd5, 0xb7, 0x73,
      0xe6, 0xd1, 0xbf, 0x63, 0xc6, 0x91, 0x3f, 0x7e, 0xfc, 0xe5, 0xd7, 0xb3, 0x7b, 0xf6, 0xf1, 0xff,
      0xe3, 0xdb, 0xab, 0x4b, 0x96, 0x31, 0x62, 0xc4, 0x95, 0x37, 0x6e, 0xdc, 0xa5, 0x57, 0xae, 0x41,
      0x82, 0x19, 0x32, 0x64, 0xc8, 0x8d, 0x07, 0x0e, 0x1c, 0x38, 0x70, 0xe0, 0xdd, 0xa7, 0x53, 0xa6,
      0x51, 0xa2, 0x59, 0xb2, 0x79, 0xf2, 0xf9, 0xef, 0xc3, 0x9b, 0x2b, 0x56, 0xac, 0x45, 0x8a, 0x09,
      0x12, 0x24, 0x48, 0x90, 0x3d, 0x7a, 0xf4, 0xf5, 0xf7, 0xf3, 0xfb, 0xeb, 0xcb, 0x8b, 0x0b, 0x16,
      0x2c, 0x58, 0xb0, 0x7d, 0xfa, 0xe9, 0xcf, 0x83, 0x1b, 0x36, 0x6c, 0xd8, 0xad, 0x47, 0x8e, 0x00
    ],

    /**
     * The Galois field log table.
     *
     * @public
     * @static
     * @type {number[]}
     * @memberof Galois
     */
    LOG: [
      0xff, 0x00, 0x01, 0x19, 0x02, 0x32, 0x1a, 0xc6, 0x03, 0xdf, 0x33, 0xee, 0x1b, 0x68, 0xc7, 0x4b,
      0x04, 0x64, 0xe0, 0x0e, 0x34, 0x8d, 0xef, 0x81, 0x1c, 0xc1, 0x69, 0xf8, 0xc8, 0x08, 0x4c, 0x71,
      0x05, 0x8a, 0x65, 0x2f, 0xe1, 0x24, 0x0f, 0x21, 0x35, 0x93, 0x8e, 0xda, 0xf0, 0x12, 0x82, 0x45,
      0x1d, 0xb5, 0xc2, 0x7d, 0x6a, 0x27, 0xf9, 0xb9, 0xc9, 0x9a, 0x09, 0x78, 0x4d, 0xe4, 0x72, 0xa6,
      0x06, 0xbf, 0x8b, 0x62, 0x66, 0xdd, 0x30, 0xfd, 0xe2, 0x98, 0x25, 0xb3, 0x10, 0x91, 0x22, 0x88,
      0x36, 0xd0, 0x94, 0xce, 0x8f, 0x96, 0xdb, 0xbd, 0xf1, 0xd2, 0x13, 0x5c, 0x83, 0x38, 0x46, 0x40,
      0x1e, 0x42, 0xb6, 0xa3, 0xc3, 0x48, 0x7e, 0x6e, 0x6b, 0x3a, 0x28, 0x54, 0xfa, 0x85, 0xba, 0x3d,
      0xca, 0x5e, 0x9b, 0x9f, 0x0a, 0x15, 0x79, 0x2b, 0x4e, 0xd4, 0xe5, 0xac, 0x73, 0xf3, 0xa7, 0x57,
      0x07, 0x70, 0xc0, 0xf7, 0x8c, 0x80, 0x63, 0x0d, 0x67, 0x4a, 0xde, 0xed, 0x31, 0xc5, 0xfe, 0x18,
      0xe3, 0xa5, 0x99, 0x77, 0x26, 0xb8, 0xb4, 0x7c, 0x11, 0x44, 0x92, 0xd9, 0x23, 0x20, 0x89, 0x2e,
      0x37, 0x3f, 0xd1, 0x5b, 0x95, 0xbc, 0xcf, 0xcd, 0x90, 0x87, 0x97, 0xb2, 0xdc, 0xfc, 0xbe, 0x61,
      0xf2, 0x56, 0xd3, 0xab, 0x14, 0x2a, 0x5d, 0x9e, 0x84, 0x3c, 0x39, 0x53, 0x47, 0x6d, 0x41, 0xa2,
      0x1f, 0x2d, 0x43, 0xd8, 0xb7, 0x7b, 0xa4, 0x76, 0xc4, 0x17, 0x49, 0xec, 0x7f, 0x0c, 0x6f, 0xf6,
      0x6c, 0xa1, 0x3b, 0x52, 0x29, 0x9d, 0x55, 0xaa, 0xfb, 0x60, 0x86, 0xb1, 0xbb, 0xcc, 0x3e, 0x5a,
      0xcb, 0x59, 0x5f, 0xb0, 0x9c, 0xa9, 0xa0, 0x51, 0x0b, 0xf5, 0x16, 0xeb, 0x7a, 0x75, 0x2c, 0xd7,
      0x4f, 0xae, 0xd5, 0xe9, 0xe6, 0xe7, 0xad, 0xe8, 0x74, 0xd6, 0xf4, 0xea, 0xa8, 0x50, 0x58, 0xaf
    ]

  });

  var Galois_1 = Galois;

  /**
   * Contains version pattern information.
   *
   * @public
   * @class
   * @extends Nevis
   */
  var Version = lite.extend(null, {

    /**
     * The version pattern block.
     *
     * @public
     * @static
     * @type {number[]}
     * @memberof Version
     */
    BLOCK: [
      0xc94, 0x5bc, 0xa99, 0x4d3, 0xbf6, 0x762, 0x847, 0x60d, 0x928, 0xb78, 0x45d, 0xa17, 0x532,
      0x9a6, 0x683, 0x8c9, 0x7ec, 0xec4, 0x1e1, 0xfab, 0x08e, 0xc1a, 0x33f, 0xd75, 0x250, 0x9d5,
      0x6f0, 0x8ba, 0x79f, 0xb0b, 0x42e, 0xa64, 0x541, 0xc69
    ]

  });

  var Version_1 = Version;

  /**
   * Generates information for a QR code frame based on a specific value to be encoded.
   *
   * @param {Frame~Options} options - the options to be used
   * @public
   * @class
   * @extends Nevis
   */
  var Frame = lite.extend(function(options) {
    var dataBlock, eccBlock, index, neccBlock1, neccBlock2;
    var valueLength = options.value.length;

    this._badness = [];
    this._level = ErrorCorrection_1.LEVELS[options.level];
    this._polynomial = [];
    this._value = options.value;
    this._version = 0;
    this._stringBuffer = [];

    while (this._version < 40) {
      this._version++;

      index = ((this._level - 1) * 4) + ((this._version - 1) * 16);

      neccBlock1 = ErrorCorrection_1.BLOCKS[index++];
      neccBlock2 = ErrorCorrection_1.BLOCKS[index++];
      dataBlock = ErrorCorrection_1.BLOCKS[index++];
      eccBlock = ErrorCorrection_1.BLOCKS[index];

      index = (dataBlock * (neccBlock1 + neccBlock2)) + neccBlock2 - 3 + (this._version <= 9);

      if (valueLength <= index) {
        break;
      }
    }

    this._dataBlock = dataBlock;
    this._eccBlock = eccBlock;
    this._neccBlock1 = neccBlock1;
    this._neccBlock2 = neccBlock2;

    /**
     * The data width is based on version.
     *
     * @public
     * @type {number}
     * @memberof Frame#
     */
    // FIXME: Ensure that it fits instead of being truncated.
    var width = this.width = 17 + (4 * this._version);

    /**
     * The image buffer.
     *
     * @public
     * @type {number[]}
     * @memberof Frame#
     */
    this.buffer = Frame._createArray(width * width);

    this._ecc = Frame._createArray(dataBlock + ((dataBlock + eccBlock) * (neccBlock1 + neccBlock2)) + neccBlock2);
    this._mask = Frame._createArray(((width * (width + 1)) + 1) / 2);

    this._insertFinders();
    this._insertAlignments();

    // Insert single foreground cell.
    this.buffer[8 + (width * (width - 8))] = 1;

    this._insertTimingGap();
    this._reverseMask();
    this._insertTimingRowAndColumn();
    this._insertVersion();
    this._syncMask();
    this._convertBitStream(valueLength);
    this._calculatePolynomial();
    this._appendEccToData();
    this._interleaveBlocks();
    this._pack();
    this._finish();
  }, {

    _addAlignment: function(x, y) {
      var i;
      var buffer = this.buffer;
      var width = this.width;

      buffer[x + (width * y)] = 1;

      for (i = -2; i < 2; i++) {
        buffer[x + i + (width * (y - 2))] = 1;
        buffer[x - 2 + (width * (y + i + 1))] = 1;
        buffer[x + 2 + (width * (y + i))] = 1;
        buffer[x + i + 1 + (width * (y + 2))] = 1;
      }

      for (i = 0; i < 2; i++) {
        this._setMask(x - 1, y + i);
        this._setMask(x + 1, y - i);
        this._setMask(x - i, y - 1);
        this._setMask(x + i, y + 1);
      }
    },

    _appendData: function(data, dataLength, ecc, eccLength) {
      var bit, i, j;
      var polynomial = this._polynomial;
      var stringBuffer = this._stringBuffer;

      for (i = 0; i < eccLength; i++) {
        stringBuffer[ecc + i] = 0;
      }

      for (i = 0; i < dataLength; i++) {
        bit = Galois_1.LOG[stringBuffer[data + i] ^ stringBuffer[ecc]];

        if (bit !== 255) {
          for (j = 1; j < eccLength; j++) {
            stringBuffer[ecc + j - 1] = stringBuffer[ecc + j] ^
              Galois_1.EXPONENT[Frame._modN(bit + polynomial[eccLength - j])];
          }
        } else {
          for (j = ecc; j < ecc + eccLength; j++) {
            stringBuffer[j] = stringBuffer[j + 1];
          }
        }

        stringBuffer[ecc + eccLength - 1] = bit === 255 ? 0 : Galois_1.EXPONENT[Frame._modN(bit + polynomial[0])];
      }
    },

    _appendEccToData: function() {
      var i;
      var data = 0;
      var dataBlock = this._dataBlock;
      var ecc = this._calculateMaxLength();
      var eccBlock = this._eccBlock;

      for (i = 0; i < this._neccBlock1; i++) {
        this._appendData(data, dataBlock, ecc, eccBlock);

        data += dataBlock;
        ecc += eccBlock;
      }

      for (i = 0; i < this._neccBlock2; i++) {
        this._appendData(data, dataBlock + 1, ecc, eccBlock);

        data += dataBlock + 1;
        ecc += eccBlock;
      }
    },

    _applyMask: function(mask) {
      var r3x, r3y, x, y;
      var buffer = this.buffer;
      var width = this.width;

      switch (mask) {
      case 0:
        for (y = 0; y < width; y++) {
          for (x = 0; x < width; x++) {
            if (!((x + y) & 1) && !this._isMasked(x, y)) {
              buffer[x + (y * width)] ^= 1;
            }
          }
        }

        break;
      case 1:
        for (y = 0; y < width; y++) {
          for (x = 0; x < width; x++) {
            if (!(y & 1) && !this._isMasked(x, y)) {
              buffer[x + (y * width)] ^= 1;
            }
          }
        }

        break;
      case 2:
        for (y = 0; y < width; y++) {
          for (r3x = 0, x = 0; x < width; x++, r3x++) {
            if (r3x === 3) {
              r3x = 0;
            }

            if (!r3x && !this._isMasked(x, y)) {
              buffer[x + (y * width)] ^= 1;
            }
          }
        }

        break;
      case 3:
        for (r3y = 0, y = 0; y < width; y++, r3y++) {
          if (r3y === 3) {
            r3y = 0;
          }

          for (r3x = r3y, x = 0; x < width; x++, r3x++) {
            if (r3x === 3) {
              r3x = 0;
            }

            if (!r3x && !this._isMasked(x, y)) {
              buffer[x + (y * width)] ^= 1;
            }
          }
        }

        break;
      case 4:
        for (y = 0; y < width; y++) {
          for (r3x = 0, r3y = (y >> 1) & 1, x = 0; x < width; x++, r3x++) {
            if (r3x === 3) {
              r3x = 0;
              r3y = !r3y;
            }

            if (!r3y && !this._isMasked(x, y)) {
              buffer[x + (y * width)] ^= 1;
            }
          }
        }

        break;
      case 5:
        for (r3y = 0, y = 0; y < width; y++, r3y++) {
          if (r3y === 3) {
            r3y = 0;
          }

          for (r3x = 0, x = 0; x < width; x++, r3x++) {
            if (r3x === 3) {
              r3x = 0;
            }

            if (!((x & y & 1) + !(!r3x | !r3y)) && !this._isMasked(x, y)) {
              buffer[x + (y * width)] ^= 1;
            }
          }
        }

        break;
      case 6:
        for (r3y = 0, y = 0; y < width; y++, r3y++) {
          if (r3y === 3) {
            r3y = 0;
          }

          for (r3x = 0, x = 0; x < width; x++, r3x++) {
            if (r3x === 3) {
              r3x = 0;
            }

            if (!((x & y & 1) + (r3x && r3x === r3y) & 1) && !this._isMasked(x, y)) {
              buffer[x + (y * width)] ^= 1;
            }
          }
        }

        break;
      case 7:
        for (r3y = 0, y = 0; y < width; y++, r3y++) {
          if (r3y === 3) {
            r3y = 0;
          }

          for (r3x = 0, x = 0; x < width; x++, r3x++) {
            if (r3x === 3) {
              r3x = 0;
            }

            if (!((r3x && r3x === r3y) + (x + y & 1) & 1) && !this._isMasked(x, y)) {
              buffer[x + (y * width)] ^= 1;
            }
          }
        }

        break;
      }
    },

    _calculateMaxLength: function() {
      return (this._dataBlock * (this._neccBlock1 + this._neccBlock2)) + this._neccBlock2;
    },

    _calculatePolynomial: function() {
      var i, j;
      var eccBlock = this._eccBlock;
      var polynomial = this._polynomial;

      polynomial[0] = 1;

      for (i = 0; i < eccBlock; i++) {
        polynomial[i + 1] = 1;

        for (j = i; j > 0; j--) {
          polynomial[j] = polynomial[j] ? polynomial[j - 1] ^
            Galois_1.EXPONENT[Frame._modN(Galois_1.LOG[polynomial[j]] + i)] : polynomial[j - 1];
        }

        polynomial[0] = Galois_1.EXPONENT[Frame._modN(Galois_1.LOG[polynomial[0]] + i)];
      }

      // Use logs for generator polynomial to save calculation step.
      for (i = 0; i <= eccBlock; i++) {
        polynomial[i] = Galois_1.LOG[polynomial[i]];
      }
    },

    _checkBadness: function() {
      var b, b1, h, x, y;
      var bad = 0;
      var badness = this._badness;
      var buffer = this.buffer;
      var width = this.width;

      // Blocks of same colour.
      for (y = 0; y < width - 1; y++) {
        for (x = 0; x < width - 1; x++) {
          // All foreground colour.
          if ((buffer[x + (width * y)] &&
            buffer[x + 1 + (width * y)] &&
            buffer[x + (width * (y + 1))] &&
            buffer[x + 1 + (width * (y + 1))]) ||
            // All background colour.
            !(buffer[x + (width * y)] ||
            buffer[x + 1 + (width * y)] ||
            buffer[x + (width * (y + 1))] ||
            buffer[x + 1 + (width * (y + 1))])) {
            bad += Frame.N2;
          }
        }
      }

      var bw = 0;

      // X runs.
      for (y = 0; y < width; y++) {
        h = 0;

        badness[0] = 0;

        for (b = 0, x = 0; x < width; x++) {
          b1 = buffer[x + (width * y)];

          if (b === b1) {
            badness[h]++;
          } else {
            badness[++h] = 1;
          }

          b = b1;
          bw += b ? 1 : -1;
        }

        bad += this._getBadness(h);
      }

      if (bw < 0) {
        bw = -bw;
      }

      var count = 0;
      var big = bw;
      big += big << 2;
      big <<= 1;

      while (big > width * width) {
        big -= width * width;
        count++;
      }

      bad += count * Frame.N4;

      // Y runs.
      for (x = 0; x < width; x++) {
        h = 0;

        badness[0] = 0;

        for (b = 0, y = 0; y < width; y++) {
          b1 = buffer[x + (width * y)];

          if (b === b1) {
            badness[h]++;
          } else {
            badness[++h] = 1;
          }

          b = b1;
        }

        bad += this._getBadness(h);
      }

      return bad;
    },

    _convertBitStream: function(length) {
      var bit, i;
      var ecc = this._ecc;
      var version = this._version;

      // Convert string to bit stream. 8-bit data to QR-coded 8-bit data (numeric, alphanumeric, or kanji not supported).
      for (i = 0; i < length; i++) {
        ecc[i] = this._value.charCodeAt(i);
      }

      var stringBuffer = this._stringBuffer = ecc.slice();
      var maxLength = this._calculateMaxLength();

      if (length >= maxLength - 2) {
        length = maxLength - 2;

        if (version > 9) {
          length--;
        }
      }

      // Shift and re-pack to insert length prefix.
      var index = length;

      if (version > 9) {
        stringBuffer[index + 2] = 0;
        stringBuffer[index + 3] = 0;

        while (index--) {
          bit = stringBuffer[index];

          stringBuffer[index + 3] |= 255 & (bit << 4);
          stringBuffer[index + 2] = bit >> 4;
        }

        stringBuffer[2] |= 255 & (length << 4);
        stringBuffer[1] = length >> 4;
        stringBuffer[0] = 0x40 | (length >> 12);
      } else {
        stringBuffer[index + 1] = 0;
        stringBuffer[index + 2] = 0;

        while (index--) {
          bit = stringBuffer[index];

          stringBuffer[index + 2] |= 255 & (bit << 4);
          stringBuffer[index + 1] = bit >> 4;
        }

        stringBuffer[1] |= 255 & (length << 4);
        stringBuffer[0] = 0x40 | (length >> 4);
      }

      // Fill to end with pad pattern.
      index = length + 3 - (version < 10);

      while (index < maxLength) {
        stringBuffer[index++] = 0xec;
        stringBuffer[index++] = 0x11;
      }
    },

    _getBadness: function(length) {
      var i;
      var badRuns = 0;
      var badness = this._badness;

      for (i = 0; i <= length; i++) {
        if (badness[i] >= 5) {
          badRuns += Frame.N1 + badness[i] - 5;
        }
      }

      // FBFFFBF as in finder.
      for (i = 3; i < length - 1; i += 2) {
        if (badness[i - 2] === badness[i + 2] &&
          badness[i + 2] === badness[i - 1] &&
          badness[i - 1] === badness[i + 1] &&
          badness[i - 1] * 3 === badness[i] &&
          // Background around the foreground pattern? Not part of the specs.
          (badness[i - 3] === 0 || i + 3 > length ||
          badness[i - 3] * 3 >= badness[i] * 4 ||
          badness[i + 3] * 3 >= badness[i] * 4)) {
          badRuns += Frame.N3;
        }
      }

      return badRuns;
    },

    _finish: function() {
      // Save pre-mask copy of frame.
      this._stringBuffer = this.buffer.slice();

      var currentMask, i;
      var bit = 0;
      var mask = 30000;

      /*
       * Using for instead of while since in original Arduino code if an early mask was "good enough" it wouldn't try for
       * a better one since they get more complex and take longer.
       */
      for (i = 0; i < 8; i++) {
        // Returns foreground-background imbalance.
        this._applyMask(i);

        currentMask = this._checkBadness();

        // Is current mask better than previous best?
        if (currentMask < mask) {
          mask = currentMask;
          bit = i;
        }

        // Don't increment "i" to a void redoing mask.
        if (bit === 7) {
          break;
        }

        // Reset for next pass.
        this.buffer = this._stringBuffer.slice();
      }

      // Redo best mask as none were "good enough" (i.e. last wasn't bit).
      if (bit !== i) {
        this._applyMask(bit);
      }

      // Add in final mask/ECC level bytes.
      mask = ErrorCorrection_1.FINAL_FORMAT[bit + (this._level - 1 << 3)];

      var buffer = this.buffer;
      var width = this.width;

      // Low byte.
      for (i = 0; i < 8; i++, mask >>= 1) {
        if (mask & 1) {
          buffer[width - 1 - i + (width * 8)] = 1;

          if (i < 6) {
            buffer[8 + (width * i)] = 1;
          } else {
            buffer[8 + (width * (i + 1))] = 1;
          }
        }
      }

      // High byte.
      for (i = 0; i < 7; i++, mask >>= 1) {
        if (mask & 1) {
          buffer[8 + (width * (width - 7 + i))] = 1;

          if (i) {
            buffer[6 - i + (width * 8)] = 1;
          } else {
            buffer[7 + (width * 8)] = 1;
          }
        }
      }
    },

    _interleaveBlocks: function() {
      var i, j;
      var dataBlock = this._dataBlock;
      var ecc = this._ecc;
      var eccBlock = this._eccBlock;
      var k = 0;
      var maxLength = this._calculateMaxLength();
      var neccBlock1 = this._neccBlock1;
      var neccBlock2 = this._neccBlock2;
      var stringBuffer = this._stringBuffer;

      for (i = 0; i < dataBlock; i++) {
        for (j = 0; j < neccBlock1; j++) {
          ecc[k++] = stringBuffer[i + (j * dataBlock)];
        }

        for (j = 0; j < neccBlock2; j++) {
          ecc[k++] = stringBuffer[(neccBlock1 * dataBlock) + i + (j * (dataBlock + 1))];
        }
      }

      for (j = 0; j < neccBlock2; j++) {
        ecc[k++] = stringBuffer[(neccBlock1 * dataBlock) + i + (j * (dataBlock + 1))];
      }

      for (i = 0; i < eccBlock; i++) {
        for (j = 0; j < neccBlock1 + neccBlock2; j++) {
          ecc[k++] = stringBuffer[maxLength + i + (j * eccBlock)];
        }
      }

      this._stringBuffer = ecc;
    },

    _insertAlignments: function() {
      var i, x, y;
      var version = this._version;
      var width = this.width;

      if (version > 1) {
        i = Alignment_1.BLOCK[version];
        y = width - 7;

        for (;;) {
          x = width - 7;

          while (x > i - 3) {
            this._addAlignment(x, y);

            if (x < i) {
              break;
            }

            x -= i;
          }

          if (y <= i + 9) {
            break;
          }

          y -= i;

          this._addAlignment(6, y);
          this._addAlignment(y, 6);
        }
      }
    },

    _insertFinders: function() {
      var i, j, x, y;
      var buffer = this.buffer;
      var width = this.width;

      for (i = 0; i < 3; i++) {
        j = 0;
        y = 0;

        if (i === 1) {
          j = width - 7;
        }
        if (i === 2) {
          y = width - 7;
        }

        buffer[y + 3 + (width * (j + 3))] = 1;

        for (x = 0; x < 6; x++) {
          buffer[y + x + (width * j)] = 1;
          buffer[y + (width * (j + x + 1))] = 1;
          buffer[y + 6 + (width * (j + x))] = 1;
          buffer[y + x + 1 + (width * (j + 6))] = 1;
        }

        for (x = 1; x < 5; x++) {
          this._setMask(y + x, j + 1);
          this._setMask(y + 1, j + x + 1);
          this._setMask(y + 5, j + x);
          this._setMask(y + x + 1, j + 5);
        }

        for (x = 2; x < 4; x++) {
          buffer[y + x + (width * (j + 2))] = 1;
          buffer[y + 2 + (width * (j + x + 1))] = 1;
          buffer[y + 4 + (width * (j + x))] = 1;
          buffer[y + x + 1 + (width * (j + 4))] = 1;
        }
      }
    },

    _insertTimingGap: function() {
      var x, y;
      var width = this.width;

      for (y = 0; y < 7; y++) {
        this._setMask(7, y);
        this._setMask(width - 8, y);
        this._setMask(7, y + width - 7);
      }

      for (x = 0; x < 8; x++) {
        this._setMask(x, 7);
        this._setMask(x + width - 8, 7);
        this._setMask(x, width - 8);
      }
    },

    _insertTimingRowAndColumn: function() {
      var x;
      var buffer = this.buffer;
      var width = this.width;

      for (x = 0; x < width - 14; x++) {
        if (x & 1) {
          this._setMask(8 + x, 6);
          this._setMask(6, 8 + x);
        } else {
          buffer[8 + x + (width * 6)] = 1;
          buffer[6 + (width * (8 + x))] = 1;
        }
      }
    },

    _insertVersion: function() {
      var i, j, x, y;
      var buffer = this.buffer;
      var version = this._version;
      var width = this.width;

      if (version > 6) {
        i = Version_1.BLOCK[version - 7];
        j = 17;

        for (x = 0; x < 6; x++) {
          for (y = 0; y < 3; y++, j--) {
            if (1 & (j > 11 ? version >> j - 12 : i >> j)) {
              buffer[5 - x + (width * (2 - y + width - 11))] = 1;
              buffer[2 - y + width - 11 + (width * (5 - x))] = 1;
            } else {
              this._setMask(5 - x, 2 - y + width - 11);
              this._setMask(2 - y + width - 11, 5 - x);
            }
          }
        }
      }
    },

    _isMasked: function(x, y) {
      var bit = Frame._getMaskBit(x, y);

      return this._mask[bit] === 1;
    },

    _pack: function() {
      var bit, i, j;
      var k = 1;
      var v = 1;
      var width = this.width;
      var x = width - 1;
      var y = width - 1;

      // Interleaved data and ECC codes.
      var length = ((this._dataBlock + this._eccBlock) * (this._neccBlock1 + this._neccBlock2)) + this._neccBlock2;

      for (i = 0; i < length; i++) {
        bit = this._stringBuffer[i];

        for (j = 0; j < 8; j++, bit <<= 1) {
          if (0x80 & bit) {
            this.buffer[x + (width * y)] = 1;
          }

          // Find next fill position.
          do {
            if (v) {
              x--;
            } else {
              x++;

              if (k) {
                if (y !== 0) {
                  y--;
                } else {
                  x -= 2;
                  k = !k;

                  if (x === 6) {
                    x--;
                    y = 9;
                  }
                }
              } else if (y !== width - 1) {
                y++;
              } else {
                x -= 2;
                k = !k;

                if (x === 6) {
                  x--;
                  y -= 8;
                }
              }
            }

            v = !v;
          } while (this._isMasked(x, y));
        }
      }
    },

    _reverseMask: function() {
      var x, y;
      var width = this.width;

      for (x = 0; x < 9; x++) {
        this._setMask(x, 8);
      }

      for (x = 0; x < 8; x++) {
        this._setMask(x + width - 8, 8);
        this._setMask(8, x);
      }

      for (y = 0; y < 7; y++) {
        this._setMask(8, y + width - 7);
      }
    },

    _setMask: function(x, y) {
      var bit = Frame._getMaskBit(x, y);

      this._mask[bit] = 1;
    },

    _syncMask: function() {
      var x, y;
      var width = this.width;

      for (y = 0; y < width; y++) {
        for (x = 0; x <= y; x++) {
          if (this.buffer[x + (width * y)]) {
            this._setMask(x, y);
          }
        }
      }
    }

  }, {

    _createArray: function(length) {
      var i;
      var array = [];

      for (i = 0; i < length; i++) {
        array[i] = 0;
      }

      return array;
    },

    _getMaskBit: function(x, y) {
      var bit;

      if (x > y) {
        bit = x;
        x = y;
        y = bit;
      }

      bit = y;
      bit += y * y;
      bit >>= 1;
      bit += x;

      return bit;
    },

    _modN: function(x) {
      while (x >= 255) {
        x -= 255;
        x = (x >> 8) + (x & 255);
      }

      return x;
    },

    // *Badness* coefficients.
    N1: 3,
    N2: 3,
    N3: 40,
    N4: 10

  });

  var Frame_1 = Frame;

  /**
   * The options used by {@link Frame}.
   *
   * @typedef {Object} Frame~Options
   * @property {string} level - The ECC level to be used.
   * @property {string} value - The value to be encoded.
   */

  /**
   * An implementation of {@link Renderer} for working with <code>img</code> elements.
   *
   * This depends on {@link CanvasRenderer} being executed first as this implementation simply applies the data URL from
   * the rendered <code>canvas</code> element as the <code>src</code> for the <code>img</code> element being rendered.
   *
   * @public
   * @class
   * @extends Renderer
   */
  var ImageRenderer = Renderer_1.extend({

    /**
     * @override
     */
    draw: function() {
      this.element.src = this.qrious.toDataURL();
    },

    /**
     * @override
     */
    reset: function() {
      this.element.src = '';
    },

    /**
     * @override
     */
    resize: function() {
      var element = this.element;

      element.width = element.height = this.qrious.size;
    }

  });

  var ImageRenderer_1 = ImageRenderer;

  /**
   * Defines an available option while also configuring how values are applied to the target object.
   *
   * Optionally, a default value can be specified as well a value transformer for greater control over how the option
   * value is applied.
   *
   * If no value transformer is specified, then any specified option will be applied directly. All values are maintained
   * on the target object itself as a field using the option name prefixed with a single underscore.
   *
   * When an option is specified as modifiable, the {@link OptionManager} will be required to include a setter for the
   * property that is defined on the target object that uses the option name.
   *
   * @param {string} name - the name to be used
   * @param {boolean} [modifiable] - <code>true</code> if the property defined on target objects should include a setter;
   * otherwise <code>false</code>
   * @param {*} [defaultValue] - the default value to be used
   * @param {Option~ValueTransformer} [valueTransformer] - the value transformer to be used
   * @public
   * @class
   * @extends Nevis
   */
  var Option = lite.extend(function(name, modifiable, defaultValue, valueTransformer) {
    /**
     * The name for this {@link Option}.
     *
     * @public
     * @type {string}
     * @memberof Option#
     */
    this.name = name;

    /**
     * Whether a setter should be included on the property defined on target objects for this {@link Option}.
     *
     * @public
     * @type {boolean}
     * @memberof Option#
     */
    this.modifiable = Boolean(modifiable);

    /**
     * The default value for this {@link Option}.
     *
     * @public
     * @type {*}
     * @memberof Option#
     */
    this.defaultValue = defaultValue;

    this._valueTransformer = valueTransformer;
  }, {

    /**
     * Transforms the specified <code>value</code> so that it can be applied for this {@link Option}.
     *
     * If a value transformer has been specified for this {@link Option}, it will be called upon to transform
     * <code>value</code>. Otherwise, <code>value</code> will be returned directly.
     *
     * @param {*} value - the value to be transformed
     * @return {*} The transformed value or <code>value</code> if no value transformer is specified.
     * @public
     * @memberof Option#
     */
    transform: function(value) {
      var transformer = this._valueTransformer;
      if (typeof transformer === 'function') {
        return transformer(value, this);
      }

      return value;
    }

  });

  var Option_1 = Option;

  /**
   * Returns a transformed value for the specified <code>value</code> to be applied for the <code>option</code> provided.
   *
   * @callback Option~ValueTransformer
   * @param {*} value - the value to be transformed
   * @param {Option} option - the {@link Option} for which <code>value</code> is being transformed
   * @return {*} The transform value.
   */

  /**
   * Contains utility methods that are useful throughout the library.
   *
   * @public
   * @class
   * @extends Nevis
   */
  var Utilities = lite.extend(null, {

    /**
     * Returns the absolute value of a given number.
     *
     * This method is simply a convenient shorthand for <code>Math.abs</code> while ensuring that nulls are returned as
     * <code>null</code> instead of zero.
     *
     * @param {number} value - the number whose absolute value is to be returned
     * @return {number} The absolute value of <code>value</code> or <code>null</code> if <code>value</code> is
     * <code>null</code>.
     * @public
     * @static
     * @memberof Utilities
     */
    abs: function(value) {
      return value != null ? Math.abs(value) : null;
    },

    /**
     * Returns whether the specified <code>object</code> has a property with the specified <code>name</code> as an own
     * (not inherited) property.
     *
     * @param {Object} object - the object on which the property is to be checked
     * @param {string} name - the name of the property to be checked
     * @return {boolean} <code>true</code> if <code>object</code> has an own property with <code>name</code>.
     * @public
     * @static
     * @memberof Utilities
     */
    hasOwn: function(object, name) {
      return Object.prototype.hasOwnProperty.call(object, name);
    },

    /**
     * A non-operation method that does absolutely nothing.
     *
     * @return {void}
     * @public
     * @static
     * @memberof Utilities
     */
    noop: function() {},

    /**
     * Transforms the specified <code>string</code> to upper case while remaining null-safe.
     *
     * @param {string} string - the string to be transformed to upper case
     * @return {string} <code>string</code> transformed to upper case if <code>string</code> is not <code>null</code>.
     * @public
     * @static
     * @memberof Utilities
     */
    toUpperCase: function(string) {
      return string != null ? string.toUpperCase() : null;
    }

  });

  var Utilities_1 = Utilities;

  /**
   * Manages multiple {@link Option} instances that are intended to be used by multiple implementations.
   *
   * Although the option definitions are shared between targets, the values are maintained on the targets themselves.
   *
   * @param {Option[]} options - the options to be used
   * @public
   * @class
   * @extends Nevis
   */
  var OptionManager = lite.extend(function(options) {
    /**
     * The available options for this {@link OptionManager}.
     *
     * @public
     * @type {Object.<string, Option>}
     * @memberof OptionManager#
     */
    this.options = {};

    options.forEach(function(option) {
      this.options[option.name] = option;
    }, this);
  }, {

    /**
     * Returns whether an option with the specified <code>name</code> is available.
     *
     * @param {string} name - the name of the {@link Option} whose existence is to be checked
     * @return {boolean} <code>true</code> if an {@link Option} exists with <code>name</code>; otherwise
     * <code>false</code>.
     * @public
     * @memberof OptionManager#
     */
    exists: function(name) {
      return this.options[name] != null;
    },

    /**
     * Returns the value of the option with the specified <code>name</code> on the <code>target</code> object provided.
     *
     * @param {string} name - the name of the {@link Option} whose value on <code>target</code> is to be returned
     * @param {Object} target - the object from which the value of the named {@link Option} is to be returned
     * @return {*} The value of the {@link Option} with <code>name</code> on <code>target</code>.
     * @public
     * @memberof OptionManager#
     */
    get: function(name, target) {
      return OptionManager._get(this.options[name], target);
    },

    /**
     * Returns a copy of all of the available options on the <code>target</code> object provided.
     *
     * @param {Object} target - the object from which the option name/value pairs are to be returned
     * @return {Object.<string, *>} A hash containing the name/value pairs of all options on <code>target</code>.
     * @public
     * @memberof OptionManager#
     */
    getAll: function(target) {
      var name;
      var options = this.options;
      var result = {};

      for (name in options) {
        if (Utilities_1.hasOwn(options, name)) {
          result[name] = OptionManager._get(options[name], target);
        }
      }

      return result;
    },

    /**
     * Initializes the available options for the <code>target</code> object provided and then applies the initial values
     * within the speciifed <code>options</code>.
     *
     * This method will throw an error if any of the names within <code>options</code> does not match an available option.
     *
     * This involves setting the default values and defining properties for all of the available options on
     * <code>target</code> before finally calling {@link OptionMananger#setAll} with <code>options</code> and
     * <code>target</code>. Any options that are configured to be modifiable will have a setter included in their defined
     * property that will allow its corresponding value to be modified.
     *
     * If a change handler is specified, it will be called whenever the value changes on <code>target</code> for a
     * modifiable option, but only when done so via the defined property's setter.
     *
     * @param {Object.<string, *>} options - the name/value pairs of the initial options to be set
     * @param {Object} target - the object on which the options are to be initialized
     * @param {Function} [changeHandler] - the function to be called whenever the value of an modifiable option changes on
     * <code>target</code>
     * @return {void}
     * @throws {Error} If <code>options</code> contains an invalid option name.
     * @public
     * @memberof OptionManager#
     */
    init: function(options, target, changeHandler) {
      if (typeof changeHandler !== 'function') {
        changeHandler = Utilities_1.noop;
      }

      var name, option;

      for (name in this.options) {
        if (Utilities_1.hasOwn(this.options, name)) {
          option = this.options[name];

          OptionManager._set(option, option.defaultValue, target);
          OptionManager._createAccessor(option, target, changeHandler);
        }
      }

      this._setAll(options, target, true);
    },

    /**
     * Sets the value of the option with the specified <code>name</code> on the <code>target</code> object provided to
     * <code>value</code>.
     *
     * This method will throw an error if <code>name</code> does not match an available option or matches an option that
     * cannot be modified.
     *
     * If <code>value</code> is <code>null</code> and the {@link Option} has a default value configured, then that default
     * value will be used instead. If the {@link Option} also has a value transformer configured, it will be used to
     * transform whichever value was determined to be used.
     *
     * This method returns whether the value of the underlying field on <code>target</code> was changed as a result.
     *
     * @param {string} name - the name of the {@link Option} whose value is to be set
     * @param {*} value - the value to be set for the named {@link Option} on <code>target</code>
     * @param {Object} target - the object on which <code>value</code> is to be set for the named {@link Option}
     * @return {boolean} <code>true</code> if the underlying field on <code>target</code> was changed; otherwise
     * <code>false</code>.
     * @throws {Error} If <code>name</code> is invalid or is for an option that cannot be modified.
     * @public
     * @memberof OptionManager#
     */
    set: function(name, value, target) {
      return this._set(name, value, target);
    },

    /**
     * Sets all of the specified <code>options</code> on the <code>target</code> object provided to their corresponding
     * values.
     *
     * This method will throw an error if any of the names within <code>options</code> does not match an available option
     * or matches an option that cannot be modified.
     *
     * If any value within <code>options</code> is <code>null</code> and the corresponding {@link Option} has a default
     * value configured, then that default value will be used instead. If an {@link Option} also has a value transformer
     * configured, it will be used to transform whichever value was determined to be used.
     *
     * This method returns whether the value for any of the underlying fields on <code>target</code> were changed as a
     * result.
     *
     * @param {Object.<string, *>} options - the name/value pairs of options to be set
     * @param {Object} target - the object on which the options are to be set
     * @return {boolean} <code>true</code> if any of the underlying fields on <code>target</code> were changed; otherwise
     * <code>false</code>.
     * @throws {Error} If <code>options</code> contains an invalid option name or an option that cannot be modiifed.
     * @public
     * @memberof OptionManager#
     */
    setAll: function(options, target) {
      return this._setAll(options, target);
    },

    _set: function(name, value, target, allowUnmodifiable) {
      var option = this.options[name];
      if (!option) {
        throw new Error('Invalid option: ' + name);
      }
      if (!option.modifiable && !allowUnmodifiable) {
        throw new Error('Option cannot be modified: ' + name);
      }

      return OptionManager._set(option, value, target);
    },

    _setAll: function(options, target, allowUnmodifiable) {
      if (!options) {
        return false;
      }

      var name;
      var changed = false;

      for (name in options) {
        if (Utilities_1.hasOwn(options, name) && this._set(name, options[name], target, allowUnmodifiable)) {
          changed = true;
        }
      }

      return changed;
    }

  }, {

    _createAccessor: function(option, target, changeHandler) {
      var descriptor = {
        get: function() {
          return OptionManager._get(option, target);
        }
      };

      if (option.modifiable) {
        descriptor.set = function(value) {
          if (OptionManager._set(option, value, target)) {
            changeHandler(value, option);
          }
        };
      }

      Object.defineProperty(target, option.name, descriptor);
    },

    _get: function(option, target) {
      return target['_' + option.name];
    },

    _set: function(option, value, target) {
      var fieldName = '_' + option.name;
      var oldValue = target[fieldName];
      var newValue = option.transform(value != null ? value : option.defaultValue);

      target[fieldName] = newValue;

      return newValue !== oldValue;
    }

  });

  var OptionManager_1 = OptionManager;

  /**
   * Called whenever the value of a modifiable {@link Option} is changed on a target object via the defined property's
   * setter.
   *
   * @callback OptionManager~ChangeHandler
   * @param {*} value - the new value for <code>option</code> on the target object
   * @param {Option} option - the modifable {@link Option} whose value has changed on the target object.
   * @return {void}
   */

  /**
   * A basic manager for {@link Service} implementations that are mapped to simple names.
   *
   * @public
   * @class
   * @extends Nevis
   */
  var ServiceManager = lite.extend(function() {
    this._services = {};
  }, {

    /**
     * Returns the {@link Service} being managed with the specified <code>name</code>.
     *
     * @param {string} name - the name of the {@link Service} to be returned
     * @return {Service} The {@link Service} is being managed with <code>name</code>.
     * @throws {Error} If no {@link Service} is being managed with <code>name</code>.
     * @public
     * @memberof ServiceManager#
     */
    getService: function(name) {
      var service = this._services[name];
      if (!service) {
        throw new Error('Service is not being managed with name: ' + name);
      }

      return service;
    },

    /**
     * Sets the {@link Service} implementation to be managed for the specified <code>name</code> to the
     * <code>service</code> provided.
     *
     * @param {string} name - the name of the {@link Service} to be managed with <code>name</code>
     * @param {Service} service - the {@link Service} implementation to be managed
     * @return {void}
     * @throws {Error} If a {@link Service} is already being managed with the same <code>name</code>.
     * @public
     * @memberof ServiceManager#
     */
    setService: function(name, service) {
      if (this._services[name]) {
        throw new Error('Service is already managed with name: ' + name);
      }

      if (service) {
        this._services[name] = service;
      }
    }

  });

  var ServiceManager_1 = ServiceManager;

  var optionManager = new OptionManager_1([
    new Option_1('background', true, 'white'),
    new Option_1('backgroundAlpha', true, 1, Utilities_1.abs),
    new Option_1('element'),
    new Option_1('foreground', true, 'black'),
    new Option_1('foregroundAlpha', true, 1, Utilities_1.abs),
    new Option_1('level', true, 'L', Utilities_1.toUpperCase),
    new Option_1('mime', true, 'image/png'),
    new Option_1('padding', true, null, Utilities_1.abs),
    new Option_1('size', true, 100, Utilities_1.abs),
    new Option_1('value', true, '')
  ]);
  var serviceManager = new ServiceManager_1();

  /**
   * Enables configuration of a QR code generator which uses HTML5 <code>canvas</code> for rendering.
   *
   * @param {QRious~Options} [options] - the options to be used
   * @throws {Error} If any <code>options</code> are invalid.
   * @public
   * @class
   * @extends Nevis
   */
  var QRious = lite.extend(function(options) {
    optionManager.init(options, this, this.update.bind(this));

    var element = optionManager.get('element', this);
    var elementService = serviceManager.getService('element');
    var canvas = element && elementService.isCanvas(element) ? element : elementService.createCanvas();
    var image = element && elementService.isImage(element) ? element : elementService.createImage();

    this._canvasRenderer = new CanvasRenderer_1(this, canvas, true);
    this._imageRenderer = new ImageRenderer_1(this, image, image === element);

    this.update();
  }, {

    /**
     * Returns all of the options configured for this {@link QRious}.
     *
     * Any changes made to the returned object will not be reflected in the options themselves or their corresponding
     * underlying fields.
     *
     * @return {Object.<string, *>} A copy of the applied options.
     * @public
     * @memberof QRious#
     */
    get: function() {
      return optionManager.getAll(this);
    },

    /**
     * Sets all of the specified <code>options</code> and automatically updates this {@link QRious} if any of the
     * underlying fields are changed as a result.
     *
     * This is the preferred method for updating multiple options at one time to avoid unnecessary updates between
     * changes.
     *
     * @param {QRious~Options} options - the options to be set
     * @return {void}
     * @throws {Error} If any <code>options</code> are invalid or cannot be modified.
     * @public
     * @memberof QRious#
     */
    set: function(options) {
      if (optionManager.setAll(options, this)) {
        this.update();
      }
    },

    /**
     * Returns the image data URI for the generated QR code using the <code>mime</code> provided.
     *
     * @param {string} [mime] - the MIME type for the image
     * @return {string} The image data URI for the QR code.
     * @public
     * @memberof QRious#
     */
    toDataURL: function(mime) {
      return this.canvas.toDataURL(mime || this.mime);
    },

    /**
     * Updates this {@link QRious} by generating a new {@link Frame} and re-rendering the QR code.
     *
     * @return {void}
     * @protected
     * @memberof QRious#
     */
    update: function() {
      var frame = new Frame_1({
        level: this.level,
        value: this.value
      });

      this._canvasRenderer.render(frame);
      this._imageRenderer.render(frame);
    }

  }, {

    /**
     * Configures the <code>service</code> provided to be used by all {@link QRious} instances.
     *
     * @param {Service} service - the {@link Service} to be configured
     * @return {void}
     * @throws {Error} If a {@link Service} has already been configured with the same name.
     * @public
     * @static
     * @memberof QRious
     */
    use: function(service) {
      serviceManager.setService(service.getName(), service);
    }

  });

  Object.defineProperties(QRious.prototype, {

    canvas: {
      /**
       * Returns the <code>canvas</code> element being used to render the QR code for this {@link QRious}.
       *
       * @return {*} The <code>canvas</code> element.
       * @public
       * @memberof QRious#
       * @alias canvas
       */
      get: function() {
        return this._canvasRenderer.getElement();
      }
    },

    image: {
      /**
       * Returns the <code>img</code> element being used to render the QR code for this {@link QRious}.
       *
       * @return {*} The <code>img</code> element.
       * @public
       * @memberof QRious#
       * @alias image
       */
      get: function() {
        return this._imageRenderer.getElement();
      }
    }

  });

  var QRious_1$2 = QRious;

  /**
   * The options used by {@link QRious}.
   *
   * @typedef {Object} QRious~Options
   * @property {string} [background="white"] - The background color to be applied to the QR code.
   * @property {number} [backgroundAlpha=1] - The background alpha to be applied to the QR code.
   * @property {*} [element] - The element to be used to render the QR code which may either be an <code>canvas</code> or
   * <code>img</code>. The element(s) will be created if needed.
   * @property {string} [foreground="black"] - The foreground color to be applied to the QR code.
   * @property {number} [foregroundAlpha=1] - The foreground alpha to be applied to the QR code.
   * @property {string} [level="L"] - The error correction level to be applied to the QR code.
   * @property {string} [mime="image/png"] - The MIME type to be used to render the image for the QR code.
   * @property {number} [padding] - The padding for the QR code in pixels.
   * @property {number} [size=100] - The size of the QR code in pixels.
   * @property {string} [value=""] - The value to be encoded within the QR code.
   */

  var index = QRious_1$2;

  /**
   * Defines a service contract that must be met by all implementations.
   *
   * @public
   * @class
   * @extends Nevis
   */
  var Service = lite.extend({

    /**
     * Returns the name of this {@link Service}.
     *
     * @return {string} The service name.
     * @public
     * @abstract
     * @memberof Service#
     */
    getName: function() {}

  });

  var Service_1 = Service;

  /**
   * A service for working with elements.
   *
   * @public
   * @class
   * @extends Service
   */
  var ElementService = Service_1.extend({

    /**
     * Creates an instance of a canvas element.
     *
     * Implementations of {@link ElementService} <b>must</b> override this method with their own specific logic.
     *
     * @return {*} The newly created canvas element.
     * @public
     * @abstract
     * @memberof ElementService#
     */
    createCanvas: function() {},

    /**
     * Creates an instance of a image element.
     *
     * Implementations of {@link ElementService} <b>must</b> override this method with their own specific logic.
     *
     * @return {*} The newly created image element.
     * @public
     * @abstract
     * @memberof ElementService#
     */
    createImage: function() {},

    /**
     * @override
     */
    getName: function() {
      return 'element';
    },

    /**
     * Returns whether the specified <code>element</code> is a canvas.
     *
     * Implementations of {@link ElementService} <b>must</b> override this method with their own specific logic.
     *
     * @param {*} element - the element to be checked
     * @return {boolean} <code>true</code> if <code>element</code> is a canvas; otherwise <code>false</code>.
     * @public
     * @abstract
     * @memberof ElementService#
     */
    isCanvas: function(element) {},

    /**
     * Returns whether the specified <code>element</code> is an image.
     *
     * Implementations of {@link ElementService} <b>must</b> override this method with their own specific logic.
     *
     * @param {*} element - the element to be checked
     * @return {boolean} <code>true</code> if <code>element</code> is an image; otherwise <code>false</code>.
     * @public
     * @abstract
     * @memberof ElementService#
     */
    isImage: function(element) {}

  });

  var ElementService_1 = ElementService;

  /**
   * An implementation of {@link ElementService} intended for use within a browser environment.
   *
   * @public
   * @class
   * @extends ElementService
   */
  var BrowserElementService = ElementService_1.extend({

    /**
     * @override
     */
    createCanvas: function() {
      return document.createElement('canvas');
    },

    /**
     * @override
     */
    createImage: function() {
      return document.createElement('img');
    },

    /**
     * @override
     */
    isCanvas: function(element) {
      return element instanceof HTMLCanvasElement;
    },

    /**
     * @override
     */
    isImage: function(element) {
      return element instanceof HTMLImageElement;
    }

  });

  var BrowserElementService_1 = BrowserElementService;

  index.use(new BrowserElementService_1());

  var QRious_1 = index;

  return QRious_1;

})));

//# sourceMappingURL=qrious.js.map

/***/ }),

/***/ 72:
/***/ ((module) => {

"use strict";


var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ 659:
/***/ ((module) => {

"use strict";


var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ 540:
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ 56:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ 825:
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ 113:
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),

/***/ 834:
/***/ ((module) => {

"use strict";
module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8IS0tIENyZWF0b3I6IENvcmVsRFJBVyBYNiAtLT4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iOC41aW4iIGhlaWdodD0iMTFpbiIgdmVyc2lvbj0iMS4xIiBzdHlsZT0ic2hhcGUtcmVuZGVyaW5nOmdlb21ldHJpY1ByZWNpc2lvbjsgdGV4dC1yZW5kZXJpbmc6Z2VvbWV0cmljUHJlY2lzaW9uOyBpbWFnZS1yZW5kZXJpbmc6b3B0aW1pemVRdWFsaXR5OyBmaWxsLXJ1bGU6ZXZlbm9kZDsgY2xpcC1ydWxlOmV2ZW5vZGQiDQp2aWV3Qm94PSIwIDAgODUwMCAxMTAwMCINCiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+DQogPGRlZnM+DQogIDxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQogICA8IVtDREFUQVsNCiAgICAuZmlsMCB7ZmlsbDojRkVGRUZFfQ0KICAgXV0+DQogIDwvc3R5bGU+DQogPC9kZWZzPg0KIDxnIGlkPSJMYXllcl94MDAyMF8xIj4NCiAgPG1ldGFkYXRhIGlkPSJDb3JlbENvcnBJRF8wQ29yZWwtTGF5ZXIiLz4NCiAgPGcgaWQ9Il80NDM4NjEyNjQiPg0KICAgPHBhdGggY2xhc3M9ImZpbDAiIGQ9Ik0xNTU5IDcwNjNjMCwtMTQ0IDExNywtMjYwIDI2MCwtMjYwbDQyNDUgMCAtNzUxIC03NzRjLTEwMCwtMTAzIC05OCwtMjY4IDUsLTM2OCAxMDMsLTEwMCAyNjgsLTk4IDM2OCw1bDExODAgMTIxNWM5OCwxMDEgOTgsMjYyIDAsMzYzbC0xMTgwIDEyMTVjLTEwMCwxMDMgLTI2NSwxMDYgLTM2OCw1IC0xMDMsLTEwMCAtMTA2LC0yNjUgLTUsLTM2OGw3NTEgLTc3MyAtNDI0NSAwYy0xNDQsMCAtMjYwLC0xMTcgLTI2MCwtMjYweiIvPg0KICAgPHBhdGggY2xhc3M9ImZpbDAiIGQ9Ik0xNjMzIDQxMTljLTk4LC0xMDEgLTk4LC0yNjIgMCwtMzYzbDExODAgLTEyMTVjMTAwLC0xMDMgMjY1LC0xMDYgMzY4LC01IDEwMywxMDAgMTA2LDI2NSA1LDM2OGwtNzUxIDc3MyA0MjQ1IDBjMTQ0LDAgMjYwLDExNyAyNjAsMjYwIDAsMTQ0IC0xMTcsMjYwIC0yNjAsMjYwbC00MjQ1IDAgNzUxIDc3M2MxMDAsMTAzIDk4LDI2OCAtNSwzNjggLTEwMywxMDAgLTI2OCw5OCAtMzY4LC01bC0xMTgwIC0xMjE1eiIvPg0KICA8L2c+DQogPC9nPg0KPC9zdmc+DQo=";

/***/ }),

/***/ 934:
/***/ ((module) => {

"use strict";
module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8IS0tIENyZWF0b3I6IENvcmVsRFJBVyBYNiAtLT4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iOC41aW4iIGhlaWdodD0iMTFpbiIgdmVyc2lvbj0iMS4xIiBzdHlsZT0ic2hhcGUtcmVuZGVyaW5nOmdlb21ldHJpY1ByZWNpc2lvbjsgdGV4dC1yZW5kZXJpbmc6Z2VvbWV0cmljUHJlY2lzaW9uOyBpbWFnZS1yZW5kZXJpbmc6b3B0aW1pemVRdWFsaXR5OyBmaWxsLXJ1bGU6ZXZlbm9kZDsgY2xpcC1ydWxlOmV2ZW5vZGQiDQp2aWV3Qm94PSIwIDAgODUwMCAxMTAwMCINCiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+DQogPGRlZnM+DQogIDxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQogICA8IVtDREFUQVsNCiAgICAuZmlsMCB7ZmlsbDojRkVGRUZFfQ0KICAgXV0+DQogIDwvc3R5bGU+DQogPC9kZWZzPg0KIDxnIGlkPSJMYXllcl94MDAyMF8xIj4NCiAgPG1ldGFkYXRhIGlkPSJDb3JlbENvcnBJRF8wQ29yZWwtTGF5ZXIiLz4NCiAgPGcgaWQ9Il80NDU3MDY5NTIiPg0KICAgPHBhdGggY2xhc3M9ImZpbDAiIGQ9Ik0yNjg3IDI4MDljMTQ0LDAgMjYwLDExNyAyNjAsMjYwbDAgNDI0NSA3NzQgLTc1MWMxMDMsLTEwMCAyNjgsLTk4IDM2OCw1IDEwMCwxMDMgOTgsMjY4IC01LDM2OGwtMTIxNSAxMTgwYy0xMDEsOTggLTI2Miw5OCAtMzYzLDBsLTEyMTUgLTExODBjLTEwMywtMTAwIC0xMDYsLTI2NSAtNSwtMzY4IDEwMCwtMTAzIDI2NSwtMTA2IDM2OCwtNWw3NzMgNzUxIDAgLTQyNDVjMCwtMTQ0IDExNywtMjYwIDI2MCwtMjYweiIvPg0KICAgPHBhdGggY2xhc3M9ImZpbDAiIGQ9Ik01NjMxIDI4ODNjMTAxLC05OCAyNjIsLTk4IDM2MywwbDEyMTUgMTE4MGMxMDMsMTAwIDEwNiwyNjUgNSwzNjggLTEwMCwxMDMgLTI2NSwxMDYgLTM2OCw1bC03NzMgLTc1MSAwIDQyNDVjMCwxNDQgLTExNywyNjAgLTI2MCwyNjAgLTE0NCwwIC0yNjAsLTExNyAtMjYwLC0yNjBsMCAtNDI0NSAtNzczIDc1MWMtMTAzLDEwMCAtMjY4LDk4IC0zNjgsLTUgLTEwMCwtMTAzIC05OCwtMjY4IDUsLTM2OGwxMjE1IC0xMTgweiIvPg0KICA8L2c+DQogPC9nPg0KPC9zdmc+DQo=";

/***/ }),

/***/ 501:
/***/ ((module) => {

"use strict";
module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8IS0tIENyZWF0b3I6IENvcmVsRFJBVyBYNiAtLT4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iOC41aW4iIGhlaWdodD0iMTFpbiIgdmVyc2lvbj0iMS4xIiBzdHlsZT0ic2hhcGUtcmVuZGVyaW5nOmdlb21ldHJpY1ByZWNpc2lvbjsgdGV4dC1yZW5kZXJpbmc6Z2VvbWV0cmljUHJlY2lzaW9uOyBpbWFnZS1yZW5kZXJpbmc6b3B0aW1pemVRdWFsaXR5OyBmaWxsLXJ1bGU6ZXZlbm9kZDsgY2xpcC1ydWxlOmV2ZW5vZGQiDQp2aWV3Qm94PSIwIDAgODUwMCAxMTAwMCINCiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+DQogPGRlZnM+DQogIDxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQogICA8IVtDREFUQVsNCiAgICAuZmlsMCB7ZmlsbDojRkVGRUZFfQ0KICAgXV0+DQogIDwvc3R5bGU+DQogPC9kZWZzPg0KIDxnIGlkPSJMYXllcl94MDAyMF8xIj4NCiAgPG1ldGFkYXRhIGlkPSJDb3JlbENvcnBJRF8wQ29yZWwtTGF5ZXIiLz4NCiAgPHBhdGggY2xhc3M9ImZpbDAiIGQ9Ik01OTM5IDgxOGMxNjMsLTE1OCA0MjMsLTE1NCA1ODIsOWwxODY0IDE5MTljMTU1LDE2MCAxNTUsNDEzIDAsNTczbC0xODY0IDE5MTljLTE1OCwxNjMgLTQxOSwxNjcgLTU4Miw5IC0xNjMsLTE1OCAtMTY3LC00MTkgLTksLTU4MmwxMTg2IC0xMjIyIC02NzA1IDBjLTIyNywwIC00MTEsLTE4NCAtNDExLC00MTEgMCwtMjI3IDE4NCwtNDExIDQxMSwtNDExbDY3MDUgMCAtMTE4NiAtMTIyMmMtMTU4LC0xNjMgLTE1NCwtNDIzIDksLTU4MnptLTMzNzcgNDkzNWMxNjMsMTU4IDE2Nyw0MTkgOSw1ODJsLTExODYgMTIyMiA2NzA1IDBjMjI3LDAgNDExLDE4NCA0MTEsNDExIDAsMjI3IC0xODQsNDExIC00MTEsNDExbC02NzA1IDAgMTE4NiAxMjIxYzE1OCwxNjMgMTU0LDQyMyAtOSw1ODIgLTE2MywxNTggLTQyMywxNTQgLTU4MiwtOWwtMTg2NCAtMTkxOWMtMTU1LC0xNjAgLTE1NSwtNDEzIDAsLTU3M2wxODY0IC0xOTE5YzE1OCwtMTYzIDQxOSwtMTY3IDU4MiwtOXoiLz4NCiA8L2c+DQo8L3N2Zz4NCg==";

/***/ }),

/***/ 66:
/***/ ((module) => {

"use strict";
module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8IS0tIENyZWF0b3I6IENvcmVsRFJBVyBYNiAtLT4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iOC41aW4iIGhlaWdodD0iMTFpbiIgdmVyc2lvbj0iMS4xIiBzdHlsZT0ic2hhcGUtcmVuZGVyaW5nOmdlb21ldHJpY1ByZWNpc2lvbjsgdGV4dC1yZW5kZXJpbmc6Z2VvbWV0cmljUHJlY2lzaW9uOyBpbWFnZS1yZW5kZXJpbmc6b3B0aW1pemVRdWFsaXR5OyBmaWxsLXJ1bGU6ZXZlbm9kZDsgY2xpcC1ydWxlOmV2ZW5vZGQiDQp2aWV3Qm94PSIwIDAgODUwMCAxMTAwMCINCiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayINCiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyI+DQogPGRlZnM+DQogIDxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQogICA8IVtDREFUQVsNCiAgICAuZmlsMCB7ZmlsbDojRkVGRUZFfQ0KICAgXV0+DQogIDwvc3R5bGU+DQogPC9kZWZzPg0KIDxnIGlkPSJMYXllcl94MDAyMF8xIj4NCiAgPG1ldGFkYXRhIGlkPSJDb3JlbENvcnBJRF8wQ29yZWwtTGF5ZXIiLz4NCiAgPGcgaWQ9IlBhZ2UtMSIgc2tldGNoOnR5cGU9Ik1TUGFnZSI+DQogICA8ZyBpZD0iSWNvbi1TZXQtRmlsbGVkIiBza2V0Y2g6dHlwZT0iTVNMYXllckdyb3VwIj4NCiAgICA8cGF0aCBpZD0iY3JvcCIgY2xhc3M9ImZpbDAiIGQ9Ik03ODk2IDc1ODNsLTUyMSAwIDAgLTM5MDYgLTEwNDIgMTA0MiAwIDI4NjUgLTM2NDYgMCA1MDAzIC01NDE2IC0zNjggLTM2OCAtNTE1NiA1NTI0IDAgLTM5MDYgMjYwNCAwIDEwMDUgLTEwNDIgLTM2MTAgMCAwIC01MjFjMCwtMjg4IC0yMzMsLTUyMSAtNTIxLC01MjEgLTI4NywwIC01MjEsMjMzIC01MjEsNTIxbDAgNTIxIC01MjEgMGMtMjg4LDAgLTUyMSwyMzMgLTUyMSw1MjEgMCwyODggMjMzLDUyMSA1MjEsNTIxbDUyMSAwIDAgNTIwOCA1MjA4IDAgMCA1MjFjMCwyODggMjMzLDUyMSA1MjEsNTIxIDI4NywwIDUyMSwtMjMzIDUyMSwtNTIxbDAgLTUyMSA1MjEgMGMyODgsMCA1MjEsLTIzMyA1MjEsLTUyMSAwLC0yODggLTIzMywtNTIxIC01MjEsLTUyMXoiIHNrZXRjaDp0eXBlPSJNU1NoYXBlR3JvdXAiLz4NCiAgIDwvZz4NCiAgPC9nPg0KIDwvZz4NCjwvc3ZnPg0K";

/***/ }),

/***/ 607:
/***/ ((module) => {

"use strict";
module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8IS0tIENyZWF0b3I6IENvcmVsRFJBVyBYNiAtLT4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iOC4yNjc3MmluIiBoZWlnaHQ9IjExLjY5MjlpbiIgdmVyc2lvbj0iMS4xIiBzdHlsZT0ic2hhcGUtcmVuZGVyaW5nOmdlb21ldHJpY1ByZWNpc2lvbjsgdGV4dC1yZW5kZXJpbmc6Z2VvbWV0cmljUHJlY2lzaW9uOyBpbWFnZS1yZW5kZXJpbmc6b3B0aW1pemVRdWFsaXR5OyBmaWxsLXJ1bGU6ZXZlbm9kZDsgY2xpcC1ydWxlOmV2ZW5vZGQiDQp2aWV3Qm94PSIwIDAgODI2OCAxMTY5MyINCiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+DQogPGRlZnM+DQogIDxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQogICA8IVtDREFUQVsNCiAgICAuZmlsMCB7ZmlsbDojRkVGRUZFfQ0KICAgXV0+DQogIDwvc3R5bGU+DQogPC9kZWZzPg0KIDxnIGlkPSJMYXllcl94MDAyMF8xIj4NCiAgPG1ldGFkYXRhIGlkPSJDb3JlbENvcnBJRF8wQ29yZWwtTGF5ZXIiLz4NCiAgPGcgaWQ9Il8yNTYzMzg4MzIiPg0KICAgPGcgaWQ9IlBhZ2UtMSI+DQogICAgPGcgaWQ9IkRyaWJiYmxlLUxpZ2h0LVByZXZpZXciPg0KICAgICA8ZyBpZD0iaWNvbnMiPg0KICAgICAgPHBvbHlnb24gaWQ9ImRvbmVfbWluaS1feDAwNWJfX3gwMDIzXzE0ODRfeDAwNWRfIiBjbGFzcz0iZmlsMCIgcG9pbnRzPSI3ODQzLDQyNzUgMzI3OCw4NDY2IDMyNzgsODQ2NSAzMjc4LDg0NjYgNDI0LDU4NDYgMTU2NSw0Nzk5IDMyNzgsNjM3MCA2NzAyLDMyMjcgIi8+DQogICAgIDwvZz4NCiAgICA8L2c+DQogICA8L2c+DQogIDwvZz4NCiA8L2c+DQo8L3N2Zz4NCg==";

/***/ }),

/***/ 717:
/***/ ((module) => {

"use strict";
module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8IS0tIENyZWF0b3I6IENvcmVsRFJBVyBYNiAtLT4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iOC4yNjc3MmluIiBoZWlnaHQ9IjExLjY5MjlpbiIgdmVyc2lvbj0iMS4xIiBzdHlsZT0ic2hhcGUtcmVuZGVyaW5nOmdlb21ldHJpY1ByZWNpc2lvbjsgdGV4dC1yZW5kZXJpbmc6Z2VvbWV0cmljUHJlY2lzaW9uOyBpbWFnZS1yZW5kZXJpbmc6b3B0aW1pemVRdWFsaXR5OyBmaWxsLXJ1bGU6ZXZlbm9kZDsgY2xpcC1ydWxlOmV2ZW5vZGQiDQp2aWV3Qm94PSIwIDAgODI2OCAxMTY5MyINCiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+DQogPGRlZnM+DQogIDxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQogICA8IVtDREFUQVsNCiAgICAuZmlsMCB7ZmlsbDojRkVGRUZFfQ0KICAgXV0+DQogIDwvc3R5bGU+DQogPC9kZWZzPg0KIDxnIGlkPSJMYXllcl94MDAyMF8xIj4NCiAgPG1ldGFkYXRhIGlkPSJDb3JlbENvcnBJRF8wQ29yZWwtTGF5ZXIiLz4NCiAgPHBhdGggY2xhc3M9ImZpbDAiIGQ9Ik03NDA1IDI1NzZjLTE0NiwtMTQ2IC0zODQsLTE0NiAtNTMxLDBsLTI3MzkgMjczOSAtMjczOSAtMjczOWMtMTQ2LC0xNDYgLTM4NCwtMTQ2IC01MzEsMCAtMTQ2LDE0NiAtMTQ2LDM4NCAwLDUzMWwyNzM5IDI3MzkgLTI3MzkgMjczOWMtMTQ2LDE0NiAtMTQ2LDM4NCAwLDUzMSAxNDYsMTQ2IDM4NCwxNDYgNTMxLDBsMjczOSAtMjczOSAyNzM5IDI3MzljMTQ2LDE0NiAzODQsMTQ2IDUzMSwwIDE0NiwtMTQ2IDE0NiwtMzg0IDAsLTUzMWwtMjczOSAtMjczOSAyNzM5IC0yNzM5YzE0NiwtMTQ2IDE0NiwtMzg0IDAsLTUzMXoiLz4NCiA8L2c+DQo8L3N2Zz4NCg==";

/***/ }),

/***/ 983:
/***/ ((module) => {

"use strict";
module.exports = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItZXllIj48cGF0aCBkPSJNMSAxMnM0LTggMTEtOCAxMSA4IDExIDgtNCA4LTExIDgtMTEtOC0xMS04eiI+PC9wYXRoPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjMiPjwvY2lyY2xlPjwvc3ZnPg==";

/***/ }),

/***/ 336:
/***/ ((module) => {

"use strict";
module.exports = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItZXllLW9mZiI+PHBhdGggZD0iTTE3Ljk0IDE3Ljk0QTEwLjA3IDEwLjA3IDAgMCAxIDEyIDIwYy03IDAtMTEtOC0xMS04YTE4LjQ1IDE4LjQ1IDAgMCAxIDUuMDYtNS45NE05LjkgNC4yNEE5LjEyIDkuMTIgMCAwIDEgMTIgNGM3IDAgMTEgOCAxMSA4YTE4LjUgMTguNSAwIDAgMS0yLjE2IDMuMTltLTYuNzItMS4wN2EzIDMgMCAxIDEtNC4yNC00LjI0Ij48L3BhdGg+PGxpbmUgeDE9IjEiIHkxPSIxIiB4Mj0iMjMiIHkyPSIyMyI+PC9saW5lPjwvc3ZnPg==";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			792: 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";

// UNUSED EXPORTS: default

;// CONCATENATED MODULE: ./controller.js
var getData = function getData(url) {
  var isAsync = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return new Promise(function (res, reject) {
    if (!url) return;
    try {
      fetch(url).then(function (response) {
        if (!response.ok) {
          throw new Error("Response status: ".concat(response.status));
        }
        return response.json();
      }).then(function (data) {
        res(data);
      });
    } catch (error) {
      console.error(error.message);
    }
  });
};
var PostData = function PostData(url, reqObj) {
  return new Promise(function (res, reject) {
    var statusCode = 404;
    fetch(url, {
      method: 'POST',
      headers: {
        //  'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reqObj)
    }).then(function (response) {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      statusCode = response.status;
      if (statusCode === 204) {
        console.log('No content returned (204)');
        return null; // or return a custom object if needed
      } else {
        return response.json();
      }
    }).then(function (data) {
      data.status = statusCode;
      res(data);
    })["catch"](function (error) {
      // Handle error
      console.error('There has been a problem with your fetch operation:', error);
      reject(error);
    });
  });

  /*$.ajax({
    url: url,
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(reqObj),
    success: function(response) {
      console.log('Success:', response);
      return response.json();
    },
    error: function(xhr, status, error) {
      console.error('Error:', error);
    }
  });*/
};
;// CONCATENATED MODULE: ./requestObj.js
var _uploadFabPayload;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var requestObj = {
  "FolderId": "",
  "DesignName": "",
  "ProductName": "",
  "IsNameDesc": false,
  "IsNameAsc": false,
  "IsDateDesc": false,
  "IsDateAsc": false,
  "OrgId": 1,
  "IsText": false,
  "IsSwatchQ3d": false,
  "IsSwatchQ3d_Sort": false,
  "IsFilterSearch": false,
  "FilterSearchRequestDto": {},
  "Start": 0,
  "End": 0
};
var uploadFabPayload = (_uploadFabPayload = {
  "state": 0,
  "dm_Id": 0,
  "dm_Design_Name": "",
  "dm_Design_Code": "",
  "dm_Article": "",
  "dm_Design": "",
  "dm_design_size": "",
  "dm_Variant": "",
  "dm_Supplier_Id": 0,
  "dm_Created_By": 0,
  "dm_Folder_Master_Id": 0,
  "dm_DesignType_Id": 0,
  "dm_Design_Group_Id": 0,
  "dm_Organisation_Id": 0,
  "dm_Is_Latest": true,
  "featureList": "",
  "features_Dic": "",
  "design_Base64": "",
  "dm_Design_Description": "null",
  "desigIds": "null",
  "isImageUpdate": true,
  "dm_DesignType": "null"
}, _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_uploadFabPayload, "dm_Design_Description", "null"), "dm_Article_Id", 0), "dm_Design_Id", 0), "dm_Variant_Id", 0), "dm_Variant_Index", 0), "dm_Variant_Count", 0), "dm_Version", 0), "dm_Created_On", "2023-08-05T11:42:21.034Z"), "dm_Modified_By", 0), "dm_Modified_On", "2023-08-05T11:42:21.034Z"), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_uploadFabPayload, "dm_Is_Deleted", false), "dm_Deleted_By", 0), "dm_Deleted_On", "2023-08-05T11:42:21.034Z"), "dm_Last_Reference_Dm_Id", 0), "dm_Source_Id", 0), "boardName", "null"), "cartName", "null"), "collectionId", 0), "seasonId", 0), "saveArticleMaster", {
  "da_artical_id": 0,
  "da_artical": "",
  "da_description": "null",
  "da_supplier_id": 0,
  "da_created_on": "2023-08-05T11:42:21.034Z",
  "da_created_by": 0
}), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_uploadFabPayload, "saveDesign", {
  "dd_design_id": 1,
  "dd_design": "",
  "dd_article": "",
  "dd_article_id": 0,
  "da_supplier_id": 0
}), "saveVarientMaster", {
  "dv_variant_id": 0,
  "dv_variant": "",
  "dv_design_id": 0,
  "dv_variant_index": 0,
  "da_supplier_id": 0
}), "saveInventoryDesignRequestDto", {
  "di_Inventory_Id": 1,
  "di_Design_Id": 0,
  "di_Design_Code": "",
  "di_Product": "",
  "di_Design_Start_Date": "2023-08-05T11:42:21.034Z",
  "di_Is_Hide": true,
  "di_State": "cad",
  "di_Tailori_Type": "Fabric",
  "di_Stock": 0,
  "di_Price": 0,
  "di_Credit": 0,
  "di_Rating": 0,
  "di_Modified_On": "2023-08-05T11:42:21.034Z",
  "di_Modified_By": 0
}), "saveSourceRequest", {
  "ds_source_id": 0,
  "ds_file_name": "null",
  "ds_mac_address": "null",
  "da_supplier_id": 0
}), "saveExclusiveDesignRequestDto", {
  "de_Exclusive_Id": 0,
  "de_Design_Id": 0,
  "de_Customer_Id": 0,
  "de_Is_Removed": false,
  "de_Removed_By": 0,
  "de_Removed_On": "2023-08-05T11:42:21.034Z"
}));
var storagePathDto = {
  "cdn_cdnpath": "string",
  "cdn_cloud_name": "string",
  "cdn_api_secret": "string",
  "cdn_api_key": "string",
  "cdn": false,
  "local": true,
  "drive_path": "{}",
  "ftp_store": true,
  "ftp_host": "string",
  "ftp_url_acces_user_id": "string",
  "ftp_url_access_password": "string"
};
/* harmony default export */ const requestObj_0 = (requestObj);

// EXTERNAL MODULE: ./CropDesign/js/domAppend.js
var domAppend = __webpack_require__(82);
// EXTERNAL MODULE: ./CropDesign/js/Utils.js
var Utils = __webpack_require__(359);
// EXTERNAL MODULE: ./node_modules/qrious/dist/qrious.js
var qrious = __webpack_require__(680);
var qrious_default = /*#__PURE__*/__webpack_require__.n(qrious);
;// CONCATENATED MODULE: ./CropDesign/js/operations.js
function operations_typeof(o) { "@babel/helpers - typeof"; return operations_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, operations_typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == operations_typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(operations_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }


// import QRious from './qriousWrapper.min.js';
// const QRious = require('qrious');

var AspectRatio;
var Unit; // combo box
var OrgWidthPx; // load from image
var OrgHeightPx; // load from image
var Dpi = 150;
var nowCIncrement = 0;
var cropCanvas1 = document.getElementById("cropCanvas");
var cImg_WidthInch;
var isPinch = false;
var distance = 0;
var lastDistance = 0;
var lastScale;
var minZoom = 0.1;
var maxZoom = 3;
var ctx, cvDefault, ctxCV, mag, ctxMag, callbackFn; //shubham
var isDown = false;
var HitID = null;
var isPanning = false;
var insideOffset = 50;
var scale = 1.0;
var increment = 0.05;
var isCrop = false;
var isMobileDevice = false;
var divs = $('#menuTabs>ul');
var CropWidthInch = 0;
var CropHeightInch = 0;
var design_Size;
var ImageName = '';
var key = localStorage.getItem('defaultkey');
var design = document.getElementById("cropdimg");
var sourcgrid = [];
var destgrid = [];
var Mesh = [];
var CropType = 1; // 0 = Rectangle / 1 = Corners Indivisual / 2 = All Points Indivisual
var jpegUrlN;
var canvasPer = document.getElementById('_imageResult');
var ctxRes = canvasPer.getContext("2d");
var isModified = false;
var cropScale = 1;
var minScale = 0;
var maxScale = 0;
var mouse = '';
var maxStep = 7;
var offsetX,
  offsetY = 0;
var maxOffsetX,
  maxOffsetY = 0;
window.tracker = {
  docPt: [{
    x: insideOffset,
    y: insideOffset
  }, {
    x: design.width - insideOffset,
    y: insideOffset
  }, {
    x: design.width - insideOffset,
    y: design.height - insideOffset
  }, {
    x: insideOffset,
    y: design.height - insideOffset
  }, {
    x: design.width / 2.0,
    y: insideOffset
  }, {
    x: design.width - insideOffset,
    y: design.height / 2.0
  }, {
    x: design.width / 2.0,
    y: design.height - insideOffset
  }, {
    x: insideOffset,
    y: design.height / 2.0
  }]
};
var scrollpos = {
  x: 0,
  y: 0
};
var ptPanStart = {
  x: 0,
  y: 0
};
var ptPanEnd = {
  x: 0,
  y: 0
};
var ptPanScroll = {
  x: 0,
  y: 0
};
var dstRect = {
  x: 0,
  y: 0,
  w: 0,
  h: 0
};
var scrRect = {
  x: 0,
  y: 0,
  w: 0,
  h: 0
};
function canvasPos() {
  $("#new").css('max-height', $(window).height() - 192);
  $("#new").css('margin-top', -$("#new").height() / 2 - 4);
  $("#new").css('margin-left', -$("#new").width() / 2);
  if ($('.cropper-container') != undefined) {
    $('.cropper-container').css('margin-top', $(window).height() / 2 - $('.cropper-container').height() / 2 - 4);
    $('.cropper-container').css('margin-left', $(window).width() / 2 - $('.cropper-container').width() / 2);
  }
}
function restore() {
  if (window.context != undefined) window.context.clearRect(0, 0, window.canvas.width, window.canvas.height);
  initCanvas();
  initTempCanvas();
  window.current = "Original";
  window.degrees = 0;
  $(".range").each(function () {
    $(this).val(0);
  });
  $('#s-range').val(1);
  saveCheckPoint();
  canvasPos();
  if (cImg_WidthInch != undefined) {
    Dpi = cImg_WidthInch;
  } else {
    Dpi = 150;
  }
  nowCIncrement = 0;
  if (isCrop) {
    CreateStructure();
  }
  InitializeScaling(window.canvas.width, window.canvas.height);
}
function initCanvas() {
  window.context = window.canvas.getContext('2d', {
    willReadFrequently: true
  });
  window.canvas.width = window.image.width;
  window.canvas.height = window.image.height;
  window.context.drawImage(window.image, 0, 0, window.image.width, window.image.height, 0, 0, window.canvas.width, window.canvas.height);
  canvasPos();
  saveCheckPoint();
}
function initTempCanvas() {
  window.tempCanvas = document.createElement('canvas');
  window.tempCanvas.width = window.canvas.width;
  window.tempCanvas.height = window.canvas.height;
  window.tempContext = window.tempCanvas.getContext('2d');
  //Shubham Change: -- 25-10-2024
  window.tempContext.imageSmoothingEnabled = true; // Enable smoothing
  window.tempContext.imageSmoothingQuality = 'high'; // Set quality to high
  window.canvas.getContext("2d").imageSmoothingEnabled = true; // Enable smoothing
  window.canvas.getContext("2d").imageSmoothingQuality = 'high'; // Set quality to high
  window.tempContext.drawImage(window.canvas, 0, 0);
}
function saveCheckPoint() {
  if (window.context != undefined) {
    window.checkPoint = window.context.getImageData(0, 0, window.canvas.width, window.canvas.height);
  }
}
function loadCheckPoint() {
  window.context.putImageData(window.checkPoint, 0, 0);
}
function applyRotation() {
  window.degrees += 90, window.degrees >= 360 && (window.degrees = 0), 0 === window.degrees || 180 === window.degrees ? (window.canvas.width = window.tempCanvas.width, window.canvas.height = window.tempCanvas.height, OrgWidthPx = window.canvas.width, OrgHeightPx = window.canvas.height) : (window.canvas.width = window.tempCanvas.height, window.canvas.height = window.tempCanvas.width, OrgWidthPx = window.tempCanvas.height, OrgHeightPx = window.tempCanvas.width), window.context.save(), window.context.translate(window.canvas.width / 2, window.canvas.height / 2), window.context.rotate(window.degrees * Math.PI / 180), window.context.drawImage(window.tempCanvas, .5 * -window.tempCanvas.width, .5 * -window.tempCanvas.height), window.context.restore(), canvasPos();
  // const width = $("#cwidth").val()
  // const height = $("#cheight").val()
  // $("#cwidth").val(height) 
  // $("#cheight").val(width)
  $("#cropdimg").attr("src", window.canvas.toDataURL("image/jpeg"));
}
function applyNewCrop() {
  SetUpApplyButton(function () {
    var img = new Image();
    img.onload = function () {
      window.context.clearRect(0, 0, window.canvas.width, window.canvas.height);
      var c = document.getElementById("new");
      c.width = img.width;
      c.height = img.height;
      window.context.drawImage(img, 0, 0, img.width, img.height, 0, 0, c.width, c.height);
      saveCheckPoint();
      SetClearRect(); //remove draw line circles
      canvasPos(); //set canvas position
      isCrop = false;
      initTempCanvas();
      $("#cropCanvas").hide();
      $("#new").show();
      $("#gallery-btn").show();
      $("#download-dpi-btn").show();
      InitializeScaling(img.width, img.height); //when crop img change the image size apply mesurment
      $("#cropdimg").attr("src", img.src);
      $(".ciloader").hide();
      $('#applyimg').show();
      //  $("#export-btn").show();manishaD v1:18-7-23
      $("#close-btn").hide();
      //  canvasPos();
      showCSettings();
    };
    img.src = jpegUrlN; //URL.createObjectURL(event.target.files[0]); 
    // $("#loading").css("display", "none"); 
  });
}
function applyFlipH() {
  window.context.save(), window.context.translate(window.canvas.width, 0), window.context.scale(-1, 1), window.context.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, 0, 0, window.canvas.width, window.canvas.height), window.context.restore();
  $("#cropdimg").attr("src", window.canvas.toDataURL("image/jpeg"));
}
function applyFlipV() {
  window.context.save(), window.context.translate(0, window.canvas.height), window.context.scale(1, -1), window.context.drawImage(window.canvas, 0, 0, window.canvas.width, window.canvas.height, 0, 0, window.canvas.width, window.canvas.height), window.context.restore();
  $("#cropdimg").attr("src", window.canvas.toDataURL("image/jpeg"));
}
function applyBrightness(adjustment) {
  adjustment = parseInt(adjustment, 10);
  window.brightnessV = adjustment;
  if (!window.isStreaming) loadCheckPoint();
  var imageData = window.context.getImageData(0, 0, window.canvas.width, window.canvas.height),
    rgba = imageData.data,
    length = rgba.length;
  for (var i = 0; i < length; i += 4) {
    rgba[i] += adjustment;
    rgba[i + 1] += adjustment;
    rgba[i + 2] += adjustment;
  }
  //imageData.data = rgba;
  try {
    Object.defineProperties(imageData, {
      'data': {
        value: rgba,
        writable: true,
        configurable: true,
        enumerable: true
      }
    });
  } catch (ex) {
    console.log(ex);
  }
  window.context.putImageData(imageData, 0, 0);
  // window.tempContext.putImageData(imageData, 0, 0);
}
function applyContrast(contrast) {
  contrast = parseInt(contrast, 10);
  window.contrastV = contrast;
  if (!window.isStreaming) loadCheckPoint();
  var imageData = window.context.getImageData(0, 0, window.canvas.width, window.canvas.height),
    rgba = imageData.data,
    length = rgba.length;
  var factor = 259 * (contrast + 255) / (255 * (259 - contrast));
  for (var i = 0; i < length; i += 4) {
    rgba[i] = factor * (rgba[i] - 128) + 128;
    rgba[i + 1] = factor * (rgba[i + 1] - 128) + 128;
    rgba[i + 2] = factor * (rgba[i + 2] - 128) + 128;
  }
  //imageData.data = rgba;
  try {
    Object.defineProperties(imageData, {
      'data': {
        value: rgba,
        writable: true,
        configurable: true,
        enumerable: true
      }
    });
  } catch (ex) {
    console.log(ex);
  }
  window.context.putImageData(imageData, 0, 0);
  //window.tempContext.putImageData(imageData, 0, 0);
}
function applySaturation(saturation) {
  saturation = parseFloat(saturation);
  window.saturationV = saturation;
  if (!window.isStreaming) loadCheckPoint();
  var imageData = window.context.getImageData(0, 0, window.canvas.width, window.canvas.height);
  var dA = imageData.data;
  var sv = saturation;
  var luR = 0.3086;
  var luG = 0.6094;
  var luB = 0.0820;
  var az = (1 - sv) * luR + sv;
  var bz = (1 - sv) * luG;
  var cz = (1 - sv) * luB;
  var dz = (1 - sv) * luR;
  var ez = (1 - sv) * luG + sv;
  var fz = (1 - sv) * luB;
  var gz = (1 - sv) * luR;
  var hz = (1 - sv) * luG;
  var iz = (1 - sv) * luB + sv;
  for (var i = 0; i < dA.length; i += 4) {
    var red = dA[i];
    var green = dA[i + 1];
    var blue = dA[i + 2];
    var saturatedRed = az * red + bz * green + cz * blue;
    var saturatedGreen = dz * red + ez * green + fz * blue;
    var saturateddBlue = gz * red + hz * green + iz * blue;
    dA[i] = saturatedRed;
    dA[i + 1] = saturatedGreen;
    dA[i + 2] = saturateddBlue;
  }
  //imageData.data = dA;
  try {
    Object.defineProperties(imageData, {
      'data': {
        value: dA,
        writable: true,
        configurable: true,
        enumerable: true
      }
    });
  } catch (ex) {
    console.log(ex);
  }
  window.context.putImageData(imageData, 0, 0);
  //window.tempContext.putImageData(imageData, 0, 0);
}
function applySharpen(mix) {
  loadCheckPoint();
  mix = parseFloat(mix);
  var w = window.canvas.width;
  var h = window.canvas.height;
  var weights = [0, -1, 0, -1, 5, -1, 0, -1, 0],
    katet = Math.round(Math.sqrt(weights.length)),
    half = katet * 0.5 | 0,
    dstData = window.context.createImageData(w, h),
    dstBuff = dstData.data,
    srcBuff = window.context.getImageData(0, 0, w, h).data,
    y = h,
    x;
  while (y--) {
    x = w;
    while (x--) {
      var sy = y,
        sx = x,
        dstOff = (y * w + x) * 4,
        r = 0,
        g = 0,
        b = 0;
      //a = 0;
      for (var cy = 0; cy < katet; cy++) {
        for (var cx = 0; cx < katet; cx++) {
          var scy = sy + cy - half;
          var scx = sx + cx - half;
          if (scy >= 0 && scy < h && scx >= 0 && scx < w) {
            var srcOff = (scy * w + scx) * 4;
            var wt = weights[cy * katet + cx];
            r += srcBuff[srcOff] * wt;
            g += srcBuff[srcOff + 1] * wt;
            b += srcBuff[srcOff + 2] * wt;
            //a += srcBuff[srcOff + 3] * wt;
          }
        }
      }
      dstBuff[dstOff] = r * mix + srcBuff[dstOff] * (1 - mix);
      dstBuff[dstOff + 1] = g * mix + srcBuff[dstOff + 1] * (1 - mix);
      dstBuff[dstOff + 2] = b * mix + srcBuff[dstOff + 2] * (1 - mix);
      dstBuff[dstOff + 3] = srcBuff[dstOff + 3];
    }
  }
  window.context.putImageData(dstData, 0, 0);
  //window.tempContext.putImageData(dstData, 0, 0);
}
function applyRGB() {
  var Rvalue = $("#rgb-r-range").val();
  var Gvalue = $("#rgb-g-range").val();
  var Bvalue = $("#rgb-b-range").val();
  Rvalue = parseInt(Rvalue, 10);
  Gvalue = parseInt(Gvalue, 10);
  Bvalue = parseInt(Bvalue, 10);
  loadCheckPoint();
  var imageData = window.context.getImageData(0, 0, window.canvas.width, window.canvas.height);
  var data = imageData.data;
  for (var i = 0; i < data.length; i += 4) {
    if (Rvalue > 0) data[i + 0] = 255 - (255 - data[i + 0]) * (255 - Rvalue * 1) / 255;
    if (Gvalue > 0) data[i + 1] = 255 - (255 - data[i + 1]) * (255 - Gvalue * 1) / 255;
    if (Bvalue > 0) data[i + 2] = 255 - (255 - data[i + 2]) * (255 - Bvalue * 1) / 255;
  }
  //imageData.data = data;
  try {
    Object.defineProperties(imageData, {
      'data': {
        value: data,
        writable: true,
        configurable: true,
        enumerable: true
      }
    });
  } catch (ex) {
    console.error(ex);
  }
  window.context.putImageData(imageData, 0, 0);
  //saveCheckPoint()
  //window.tempContext.putImageData(imageData, 0, 0);
}
//api
function getImgBase64() {
  var e = parseInt(100),
    t = window.canvas.width * e / 100,
    n = window.canvas.height * e / 100,
    i = document.createElement("canvas");
  i.width = t, i.height = n, i.getContext("2d").drawImage(window.canvas, 0, 0, t, n);
  var o = i.toDataURL("image/" + window.file_extension);
  return o;
}
function base64ToBlob(base64) {
  var mimeType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "image/png";
  var byteChars = atob(base64.split(",")[1]); // remove "data:image/png;base64,"
  var byteNumbers = new Array(byteChars.length);
  for (var i = 0; i < byteChars.length; i++) {
    byteNumbers[i] = byteChars.charCodeAt(i);
  }
  var byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], {
    type: mimeType
  });
}
function getImage(files, isbase64, base64Data) {
  if (isbase64 == true || files) {
    if (isbase64 != true) {
      var file = files[0];
      ImageName = file === null || file === void 0 ? void 0 : file.name.split(".")[0];
      var maxMb = 20;
      var kb = file.size / 1024; // convert the file size into byte to kb
      var mb = kb / 1024; // convert kb to mb
      if (mb > maxMb) {
        // if the file size is gratter than maxMb
        showMessageToast("Please make sure the design size is under 20 MB. The current size is beyond the limit.");
        return false;
      }
      window.image.src = window.URL.createObjectURL(file);
    } else {
      var blob = base64ToBlob(base64Data, "image/png");
      window.image.src = window.URL.createObjectURL(blob);
    }
    // window.image.src = window.URL.createObjectURL(file); pravesh 18/09/2025
    // Dpi=150;

    window.image.crossOrigin = "Anonymous", window.image.onload = function () {
      restore();
      // const orgBase = window.canvas.toDataURL("image/jpg");

      InitializeScaling(this.width, this.height);
      $("#cropdimg").attr("src", window.canvas.toDataURL("image/jpeg"));
      $(".ciloader").hide();
      $('#custom_browse').hide();
      setTimeout(function () {
        $("#cropDiv").css("display", "block");
        $("#newcrop-item").click(); //Shubham added purpose: show crop box while import image
      }, 100);
    };
  }
}
function getCaptureImage(captureUrl, width, height) {
  imageEditor.open({
    openPopup: "",
    cImg_WidthInch: undefined
  });
  window.startup();
  $('#videoModal').css('display', "none");
  window.image.src = captureUrl; //window.URL.createObjectURL(file),
  window.image.crossOrigin = "Anonymous", window.image.onload = function () {
    restore();
    InitializeScaling(width, height);
    $("#cropdimg").attr("src", window.canvas.toDataURL("image/jpeg"));
    $(".ciloader").hide();
    $('#custom_browse').hide();
    setTimeout(function () {
      $("#cropDiv").css("display", "block");
      $("#newcrop-item").click(); //Shubham added purpose: show crop box while import image
    }, 100);
  };
}
function captureFromcamera() {
  var capture = document.getElementById("captureImg");
  if (!capture) {
    capture = document.createElement("input");
    capture.id = 'captureImg';
    capture.type = 'file';
    capture.style.display = 'none';
    capture.setAttribute("capture", "environment");
    document.body.append(capture);
  }
  capture.click();
}
function upload() {
  var imageUp = document.getElementById("imageUp");
  if (imageUp) {
    imageUp.click();
  }
}
//Ui
function showRotation() {
  $(".setting").each(function () {
    $(this).hide();
  });
  $("#rotation").show();
  $("#title").text("Rotation");
  $('#undo').hide();
}
function resetAspectRatio() {
  AspectRatio = true;
  $("#settings").removeClass('unlock').addClass('lock');
  OnClickAspect();
}
function resetRange() {
  $(".filter-range").val(0);
  $("#s-range").val(1);
}
function applyFilter() {
  isModified = false;
  saveCheckPoint();
  initTempCanvas(); //Shubham Change: -- 25-10-2024
  resetRange();
  $("#cropdimg").attr("src", canvas.toDataURL("image/jpeg")); //set croped resulte canvas data to cropdimg img
}
function resetFilter() {
  isModified = false;
  initTempCanvas(); //Shubham Change: -- 25-10-2024
  loadCheckPoint();
  resetRange();
}
function showFilters() {
  $(".setting").each(function () {
    $(this).hide();
  });
  $(".theme").each(function () {
    $(this).hide();
  });
  $("#filters").show().css('display', 'flex');
  // $('.setting').perfectScrollbar('update');
  $("#prevID").show();
  $("#title").text("Filters");
  // $("#new").swipe("enable");
  $('#undo').show();
  $("#check").hide();
}
function showNewCrop() {
  var isImgPresetForCrop = $("#cropdimg").attr("src");
  if (isImgPresetForCrop == "") return;

  // c.default.canvasPos(),
  $(".setting").each(function () {
    $(this).hide();
  }), $("#newCrop").show(), $("#title").text("Crop"), $("#undo").hide(), $("#filters-icon").hide(), $("#package-icon").hide(), $("#setting-icon").hide(), $("#prevID").hide(), $("#nextID").hide(),
  //   $("#export-btn").show(),
  $("#new").hide(), $("#cropCanvas").show(), $("#gallery-btn").hide(), $("#download-dpi-btn").hide(), $("#upload-btn").hide(), $('#closeimg').show();
  $("#extenalSave-btn").show();
  // $("#cropCanvas").css("max-width","100%") //shubham pupose : fit crop canvas in mobile
  // $("#cropCanvas").css("max-height",$(window).height() - 130);
  CreateStructure();
  $("#cropCanvas").css("margin-left", $(window).width() / 2 - $("#cropCanvas").width() / 2); //vaibhavi more
  $("#cropCanvas").css("margin-top", ($(window).height() - 130) / 2 - $("#cropCanvas").height() / 2);
}
function showFlip() {
  $(".setting").each(function () {
    $(this).hide();
  });
  $("#flip").show();
  $("#title").text("Flip");
}
function showRgb() {
  $(".setting").each(function () {
    $(this).hide();
  });
  $("#rgb").show();
  $(".tab-footer a").css({
    "width": "20%",
    "display": "table-cell",
    "text-align": "center"
  });
  $("#prevID").hide();
  $("#check").show();
  $("#title").text("RGB");
}
function showContrast() {
  $("#b-range input").val(0);
  $(".setting").each(function () {
    $(this).hide();
  });
  $("#prevID").hide();
  $("#contrast").show();
  // $('.setting').perfectScrollbar('update');
  $("#title").text("Contrast");
}
function showSaturation() {
  $(".setting").each(function () {
    $(this).hide();
  });
  $("#prevID").hide();
  $("#saturation").show();
  // $('.setting').perfectScrollbar('update');
  $("#title").text("Saturation");
}
function showSharpen() {
  $(".setting").each(function () {
    $(this).hide();
  });
  $("#prevID").hide();
  $("#sharpen").show();
  $("#title").text("Sharpen");
}
function showBrightness() {
  $(".setting").each(function () {
    $(this).hide();
  });
  $("#prevID").hide();
  $("#brightness").show();
  // $('.setting').perfectScrollbar('update');
  $("#title").text("Brightness");
}
function showSettings() {
  saveCheckPoint();
  $(".setting").each(function () {
    $(this).hide();
  });
  $(".theme").each(function () {
    $(this).hide();
  });
  $("#settings").show().css('display', 'flex');
  $("#title").text("Settings");
  $("#back").hide();
  // $('.setting').perfectScrollbar('update');
  // $("#new").swipe("disable");
  initTempCanvas();
  $('#undo').show();
  $('#filters-icon').show();
  $('#package-icon').show();
  $('#setting-icon').show();
  $("#check").hide();
}
function showCSettings() {
  saveCheckPoint();
  $(".setting").each(function () {
    $(this).hide();
  });
  $(".theme").each(function () {
    $(this).hide();
  });
  $("#c-settings").show().css('display', 'flex');
  $("#title").text("Edit");
  $("#c-back").hide();
  $("#saveNext-btn").hide().css('display', 'none'), $("#package-icon").show(), $("#prevID").hide().css('display', 'none'), $("#nextID").show(), $("#gallery-btn").show(), $("#download-dpi-btn").show(), SetClearRect();
  initTempCanvas();
  isCrop = false;
  $("#cropCanvas").hide();
  $("#new").show();
  $("#closeimg").show();
  // $('.setting').perfectScrollbar('update');
  // $("#new").swipe("disable");
}
function OnUnitOpenScaleWindowInit(r) {
  if (OrgWidthPx == undefined || OrgHeightPx == undefined) return;
  var NewWidth = OrgWidthPx / Dpi;
  var NewHeight = OrgHeightPx / Dpi;
  Unit = r.toLowerCase();
  $("#cwidth").val(NewWidth.toFixed(2));
  $("#cheight").val(NewHeight.toFixed(2));
  $('#UnitsId  option[id="' + Unit + '"]').prop('selected', true);
  if (AspectRatio) {
    $("#aspectCheckId").prop('checked', true);
    OnClickAspect();
  }
}
function InitializeScaling(w, h) {
  AspectRatio = true;
  Unit = "inches"; // set in edit box
  Dpi = 300.0; //tanmay changes Added :Dpi Set 300 as compare 
  OrgWidthPx = w; // get from image
  OrgHeightPx = h; // get from image
  var NewWidth = OrgWidthPx / Dpi; // set in edit box
  var NewHeight = OrgHeightPx / Dpi; // set in edit box

  $("#cwidth").val(NewWidth.toFixed(2));
  $("#cheight").val(NewHeight.toFixed(2));
  $('#UnitsId  option[id="' + Unit + '"]').prop('selected', true);
  $("#aspectCheckId").prop('checked', true);
  if (isCrop) {
    CreateStructure();
  }
}
function OnUnitComboChange(r) {
  Unit = r.value.toLowerCase();
  var NewWidth = $("#cwidth").val();
  var NewHeight = $("#cheight").val();
  if (Unit == "cm")
    // previous would be inch
    {
      NewWidth *= 2.54;
      NewHeight *= 2.54;
    } else {
    NewWidth /= 2.54;
    NewHeight /= 2.54;
  }
  $("#cwidth").val(NewWidth.toFixed(2));
  $("#cheight").val(NewHeight.toFixed(2));
}
function resetWidth(unit) {
  var multiplier = unit == "inches" ? 1 : 2.54;
  var originalWidth = OrgWidthPx / Dpi * multiplier;
  $("#cwidth").val(originalWidth.toFixed(2));
  return originalWidth;
}
function resetHeight(unit) {
  var multiplier = unit == "inches" ? 1 : 2.54;
  var originalHeight = OrgHeightPx / Dpi * multiplier;
  $("#cheight").val(originalHeight.toFixed(2));
}
function OnEnterWidth() {
  var NewWidth = $("#cwidth").val();
  if (isNaN(NewWidth)) return;
  if (Unit == "inches") {
    if (parseFloat(NewWidth) > 20 || isNaN(NewWidth)) {
      NewWidth = resetWidth(Unit);
    }
    // NewWidthPx = NewWidth * Dpi;
    if (AspectRatio == true) {
      var ratio = OrgHeightPx / OrgWidthPx;
      var NewHeight = NewWidth * ratio;
      // NewHeightPx = NewHeight * Dpi;
      if (parseFloat(NewHeight) > 20) {
        resetHeight(Unit);
        resetWidth(Unit);
      } else $("#cheight").val(NewHeight.toFixed(2));
    }
  } else {
    //NewWidthPx = NewWidth / 2.54 * Dpi;
    if (parseFloat(NewWidth) > 50) {
      NewWidth = resetWidth(Unit);
    }
    if (AspectRatio == true) {
      var ratio = OrgHeightPx / OrgWidthPx;
      var _NewHeight = NewWidth * ratio;
      //    let NewHeightPx = NewHeight / 2.54 * Dpi;
      if (parseFloat(_NewHeight) > 50) {
        resetHeight(Unit);
        resetWidth(Unit);
      } else $("#cheight").val(_NewHeight.toFixed(2));
    }
  }
}
function OnEnterHeight() {
  var NewHeight = $("#cheight").val();
  if (isNaN(NewHeight)) return;
  if (Unit == "inches") {
    if (parseFloat(NewHeight) > 20) {
      NewHeight = resetHeight(Unit);
    }
    //NewHeightPx = NewHeight * Dpi;
    if (AspectRatio == true) {
      var ratio = OrgWidthPx / OrgHeightPx;
      var NewWidth = NewHeight * ratio;
      // NewWidthPx = NewWidth * Dpi;
      if (parseFloat(NewWidth) > 20) {
        resetWidth(Unit);
        resetHeight(Unit);
      } else $("#cwidth").val(NewWidth.toFixed(2));
    }
  } else {
    if (parseFloat(NewHeight) > 50) {
      NewHeight = resetHeight(Unit);
    }
    // NewHeightPx = NewHeight / 2.54 * Dpi;
    if (AspectRatio == true) {
      var ratio = OrgWidthPx / OrgHeightPx;
      var _NewWidth = NewHeight * ratio;
      // NewWidthPx = NewWidth / 2.54 * Dpi;
      if (parseFloat(_NewWidth) > 50) {
        resetWidth(Unit);
        resetHeight(Unit);
      } else $("#cwidth").val(_NewWidth.toFixed(2));
    }
  }
}
function OnClickAspect() {
  if (AspectRatio == true) {
    // var NewWidth = $("#cwidth").val();
    // var ratio = OrgHeightPx / OrgWidthPx;
    // var NewHeight = NewWidth * ratio;
    // $("#cheight").val(NewHeight.toFixed(2));
    OnEnterWidth();
  }
}
function initCustCanvas(width, height) {
  window.canvas.width = width, window.canvas.height = height, window.context.drawImage(window.tempCanvas, 0, 0, window.tempCanvas.width, window.tempCanvas.height, 0, 0, window.canvas.width, window.canvas.height), canvasPos(), saveCheckPoint();
  $("#cropdimg").attr("src", window.canvas.toDataURL("image/jpeg"));
}
function OnScaleApply() {
  $(".ciloader").show();
  var dwidth = $('#cwidth').val();
  var dheight = $('#cheight').val();
  if (dwidth == '' && dheight == '' || dwidth == 'NaN' || dheight == 'NaN' || dwidth <= 0 || dheight <= 0) {
    showMessageToast('Please enter valid size');
    $('#cwidth').val('0');
    $('#cheight').val('0');
    return false;
  }
  setTimeout(function () {
    if (OrgWidthPx != undefined && OrgHeightPx != undefined) {
      var NewWidth = $("#cwidth").val();
      var NewHeight = $("#cheight").val();
      if (Unit == "cm") {
        NewWidth /= 2.54;
        NewHeight /= 2.54;
      }
      var NewWidthPx = NewWidth * Dpi;
      var NewHeightPx = NewHeight * Dpi;
      initCustCanvas(NewWidthPx, NewHeightPx);
      OrgWidthPx = NewWidthPx;
      OrgHeightPx = NewHeightPx;
      getSize(NewHeight);
      $("#extenalSave-btn").show();
      $('#export-btn').show();
      $(".ciloader").hide();
    }
  }, 100);
  if ($(window).width() < 767.99 || window.matchMedia("(orientation:portrait)").matches) {
    $('#new').addClass('mobile');
    $('#new').css({
      'max-height': 'auto',
      'max-width': 'auto'
    });
  } else {
    $('#new').removeClass('mobile');
  }
}
function getSize(NewHeight) {
  CropWidthInch = OrgWidthPx / Dpi;
  CropHeightInch = NewHeight / Dpi;
  design_Size = Math.round(CropWidthInch * 1000) / 1000 + ',' + Math.round(CropHeightInch * 1000) / 1000;
}
function uploadDesign() {
  var uploadPaylod = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.uploadPaylod;
  $("#messageConfirm").hide();
  fabricJsObj.uploadDesign(uploadPaylod).then(function (response) {
    //console.log(response);
    if (response.isSave) {
      $("#save_fabric_loader").css("display", "none"), $("#New_loader_css").css("display", "none");
      GeneratedQrCodeAfterSaveDesign();
      confirmAction("Design saved successfully", "SaveDesign");
    } else {
      $('#save_fabric_loader').css('display', 'none');
      $('#New_loader_css').css('display', 'none');
      confirmAction("Design not saved.", "notSaveDesign");
    }
  })["catch"](function (error) {
    console.log(error);
    $('#save_fabric_loader').css('display', 'none');
    $('#New_loader_css').css('display', 'none');
    confirmAction("Design not saved.", "notSaveDesign");
  });
}
function GeneratedQrCodeAfterSaveDesign() {
  $('#scan_popup').addClass('show');
  $('#scan_popup').css('display', 'block');
  var designName = $('#designNameId').val();
  $('.design_name').text(designName);
  var supplierId = window.orgTypeId.toString(16);
  //let qrUrl = `${window.location.href}?k=${supplierId}&t=${designName}`; ///?k=eda35737&t=BK994-3 dam3d.in/q3d/
  var qrUrl = "".concat(window.domainUrl, "/?k=").concat(supplierId, "&t=").concat(designName); ///?k=eda35737&t=BK994-3 dam3d.in/q3d/
  var qr = new (qrious_default())({
    element: document.getElementById('qrCode'),
    value: qrUrl,
    size: $('.qr_img').width(),
    level: 'H'
  });
  $('#copyToLink').val(qrUrl);
}
function showLoginPopup() {
  hideConfirmPopup();
  $("#saveSkipConfirm").hide();
  $("#login_popup").show();
  $('#login_popup').addClass('show');
  document.getElementById('inputEmail4').focus();
}
function hideLoginPopup() {
  document.querySelector("#inputEmail4").value = '';
  document.querySelector("#loginPagepass").value = '';
  $("#login_popup").hide();
}
function CreateStructure() {
  insideOffset = 50;
  var calcInsideOffset = Math.min(design.width, design.height);
  if (calcInsideOffset < 200 && calcInsideOffset > 50) insideOffset = 5;
  if (calcInsideOffset <= 50 && calcInsideOffset > 0) insideOffset = 1;
  isCrop = true;
  increment = 0.05;
  design = document.getElementById("cropdimg");
  cropCanvas1 = document.getElementById("cropCanvas");
  ctx = cropCanvas1.getContext("2d");
  var margin = 130;
  if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
    isMobileDevice = true;
  } else {
    isMobileDevice = false;
  }
  var ScreenWidth = $(window).width();
  var ScreenHeight = $(window).height();
  cropCanvas1.width = ScreenWidth;
  cropCanvas1.height = ScreenHeight - margin;
  // cropCanvas1.width = design.width;
  // cropCanvas1.height = design.height 
  //  - margin;
  cvDefault = document.getElementById("_cv");
  ctxCV = cvDefault.getContext("2d");
  cvDefault.width = design.width;
  cvDefault.height = design.height;
  ctxCV.clearRect(0, 0, cvDefault.width, cvDefault.height);
  ctxCV.drawImage(design, 0, 0);
  mag = document.getElementById("_max");
  ctxMag = mag.getContext("2d");
  ctxMag.width = 200;
  ctxMag.height = 200;
  var utils = new Utils/* default */.A('errorMessage');
  isDown = false;
  HitID = null;
  isPanning = false;
  ctx.strokeStyle = "orange";
  ctx.lineWidth = 3;
  // zoom pan
  scrollpos = {
    x: 0,
    y: 0
  };
  ptPanStart = {
    x: 0,
    y: 0
  };
  ptPanEnd = {
    x: 0,
    y: 0
  };
  ptPanScroll = {
    x: 0,
    y: 0
  };
  dstRect = {
    x: 0,
    y: 0,
    w: 0,
    h: 0
  };
  scrRect = {
    x: 0,
    y: 0,
    w: 0,
    h: 0
  };
  // zoom pan end
  tracker = {
    docPt: [{
      x: insideOffset,
      y: insideOffset
    }, {
      x: design.width - insideOffset,
      y: insideOffset
    }, {
      x: design.width - insideOffset,
      y: design.height - insideOffset
    }, {
      x: insideOffset,
      y: design.height - insideOffset
    }, {
      x: design.width / 2.0,
      y: insideOffset
    }, {
      x: design.width - insideOffset,
      y: design.height / 2.0
    }, {
      x: design.width / 2.0,
      y: design.height - insideOffset
    }, {
      x: insideOffset,
      y: design.height / 2.0
    }]
  };
  // MeshCrop
  sourcgrid = {
    quad: [[{
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }], [{
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }], [{
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }], [{
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }], [{
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }], [{
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }], [{
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }], [{
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }], [{
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }], [{
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }], [{
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }], [{
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }], [{
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }], [{
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }], [{
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }], [{
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }]]
  };
  destgrid = {
    quad: [[{
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }], [{
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }], [{
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }], [{
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }], [{
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }], [{
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }], [{
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }], [{
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }], [{
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }], [{
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }], [{
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }], [{
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }], [{
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }], [{
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }], [{
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }], [{
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }]]
  };
  Mesh = {
    stroke: [{
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }]
  };
  FitToWindow();
  Draw();
}
function handleMouseDown(e) {
  if (e.type === "touchstart" && e.touches.length === 2) {
    isPinch = true;
    lastDistance = Math.sqrt((e.touches[0].clientX - e.touches[1].clientX) * (e.touches[0].clientX - e.touches[1].clientX) + (e.touches[0].clientY - e.touches[1].clientY) * (e.touches[0].clientY - e.touches[1].clientY));
    lastScale = scale;
  } else {
    isPinch = false;
    mouse = screentoclient(e);
    HitID = IsPointHover(mouse);
    if (HitID == null) {
      HitID = 9;
      isPanning = true;
      if (e.changedTouches != undefined) {
        ptPanStart.x = e.changedTouches[0].clientX;
        ptPanStart.y = e.changedTouches[0].clientY;
      } else {
        ptPanStart.x = e.clientX;
        ptPanStart.y = e.clientY;
      }
      ptPanScroll = GetScrollPos();
    }
    isDown = true;
    LoadCursor(HitID);
  }
}
function handleMouseMove(e) {
  if (isPinch) {
    pinchZoom(e);
  } else {
    isPinch = false;
    mouse = screentoclient(e);
    if (HitID == null) {
      var ID = IsPointHover(mouse);
      LoadCursor(ID);
      Draw();
    } else if (isPanning == true) {
      if (e.changedTouches != undefined) {
        ptPanEnd.x = e.changedTouches[0].clientX;
        ptPanEnd.y = e.changedTouches[0].clientY;
        isMobileDevice = true;
      } else {
        ptPanEnd.x = e.clientX;
        ptPanEnd.y = e.clientY;
        isMobileDevice = false;
      }
      var offset = OffsetPoint(ptPanScroll, GetOffsetPoint(ptPanEnd, ptPanStart));
      SetScrollPos(offset);
    } else {
      if (CropType == 1) {
        SetPoint(mouse);
      } else if (CropType == 2) SetPointCustom(mouse);else SetPointRect(mouse);
      DrawMagnifire(HitID);
      Draw();
    }
  }
}
function pinchZoom(e) {
  if (e.touches.length == 2) {
    distance = Math.sqrt((e.touches[0].clientX - e.touches[1].clientX) * (e.touches[0].clientX - e.touches[1].clientX) + (e.touches[0].clientY - e.touches[1].clientY) * (e.touches[0].clientY - e.touches[1].clientY));
    var zoom_point = screentoclientPinch(e);
    var zoom_target = {
      x: 0,
      y: 0
    };
    var pos = GetScrollPos();
    // determine the point on where the slide is zoomed in
    zoom_target = clienttodoc(zoom_point);

    // apply zoom
    var distanceRatio = distance / lastDistance;
    var zoom = scale * distanceRatio;
    if (zoom < minZoom) zoom = minZoom;
    if (zoom > 3.0) zoom = 3.0;
    scale = zoom;
    pos.x = zoom_target.x * scale - zoom_point.x;
    pos.y = zoom_target.y * scale - zoom_point.y;
    // Make sure the slide stays in its container area when zooming out
    SetScrollPos(pos);
    lastDistance = distance;
  }
}
//done
function handleMouseUp(e) {
  if (isPinch) {
    pinchZoom(e);
    isPinch = false;
  }
  if (isPanning == true) {
    isPanning = false;
  }
  HitID = null;
  LoadCursor(HitID);

  // $('#_maxDiv').css('visibility','hidden');
  $('#_maxDiv').css({
    "visibility": "none",
    "display": "none"
  });
  isDown = false;
}
function importOpenCv(_x) {
  return _importOpenCv.apply(this, arguments);
}
function _importOpenCv() {
  _importOpenCv = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(callback) {
    var script;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          if (window.cv) {
            callback();
          } else {
            // showMessageToast("")
            script = document.createElement("script"); // script.async = true
            script.src = "https://s3.ap-south-1.amazonaws.com/aws.tds/dam/crop/assets/opencv.js";
            script.onload = function () {
              callback();
            };
            script.error = function () {
              return console.log("error while load opencv");
            };
            // let cv = import("")
            document.body.append(script);
          }
        case 1:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return _importOpenCv.apply(this, arguments);
}
function SetUpApplyButton(callback) {
  var pointsArray = [];
  for (var i = 0; i < 4; i++) {
    pointsArray.push(parseInt(tracker.docPt[i].x));
    pointsArray.push(parseInt(tracker.docPt[i].y));
  }
  // setTimeout(() => {
  importOpenCv(function () {
    var src = cv.imread('_cv');
    var dst = new cv.Mat();
    var svgWidth = Math.max(pointsArray[2], pointsArray[4]) - Math.min(pointsArray[0], pointsArray[6]);
    var svgHeight = Math.max(pointsArray[5], pointsArray[7]) - Math.min(pointsArray[1], pointsArray[3]);
    var dsize = new cv.Size(svgWidth, svgHeight);
    var srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, pointsArray);
    var dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, svgWidth, 0, svgWidth, svgHeight, 0, svgHeight]);
    var M = cv.getPerspectiveTransform(srcTri, dstTri);
    cv.warpPerspective(src, dst, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
    ctxRes.clearRect(0, 0, canvasPer.width, canvasPer.height);
    cv.imshow('_imageResult', dst);
    jpegUrlN = canvasPer.toDataURL("image/jpeg");
    src["delete"]();
    dst["delete"]();
    M["delete"]();
    srcTri["delete"]();
    dstTri["delete"]();
    callback();
  });
  // }, 10)
}
function startup() {
  var isSelectImgFromGallary = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var wHeight = window.innerHeight;
  var wWidth = window.innerWidth;
  cropCanvas1.addEventListener('touchstart', handleMouseDown, false);
  cropCanvas1.addEventListener("touchend", handleMouseUp, false);
  cropCanvas1.addEventListener("touchcancel", handleMouseUp, false);
  cropCanvas1.addEventListener("touchmove", handleMouseMove, false);
  cropCanvas1.addEventListener("mouseleave", handleMouseUp, false);
  isSelectImgFromGallary ? upload() : captureFromcamera();
  $(".fullpage").hide();
  $(".loader-text").show();
  $(".Img-loader").hide();
  $("#New_loader_css").hide();
  if (wWidth === 1080 && wHeight === 1920) {
    $(".maincropimg").css('height', wHeight - 200 + 'px');
  } else {
    $(".maincropimg").css('height', wHeight - 130 + 'px');
  }
  $("#cropDiv").css('height', wHeight + 'px');
  $('body').css('overflow', 'hidden');
}
function appendFeatureOptions(ProductTypeGroupId) {
  var opt = '';
  // for(feature of mandatoryfeatures[ProductTypeGroupId]){
  Object.values(mandatoryfeatures[ProductTypeGroupId]).forEach(function (options) {
    var is_Mandatory = options.is_Mandatory,
      design_configuration_id = options.design_configuration_id,
      design_features_id = options.design_features_id,
      design_features_name = options.design_features_name,
      featureTypes = options.featureTypes;
    var isMandat = is_Mandatory ? 'active' : 'inactive';
    if (design_features_name != "Product") {
      opt += "<div class=\"form_box\"><label class=\"field_name\">".concat(design_features_name, "<span class=\"").concat(isMandat, "\"> \n    *</span></label><div class=\"input_field required=\"><select class=\"seteditable form-select\"  id=").concat(design_features_id, " required=").concat(is_Mandatory, " onchange=\"this.nextElementSibling.value=this.value\">\n    <option value=\"\"></option>");
      for (var option in featureTypes) {
        var _featureTypes$option = featureTypes[option],
          design_featuretype_id = _featureTypes$option.design_featuretype_id,
          design_featuretype_name = _featureTypes$option.design_featuretype_name;
        opt += "<option id = ".concat(design_featuretype_id, ">").concat(design_featuretype_name, "</option>");
      }
      opt += "</select><input type=\"text\" class=\"material_input_box\" name=".concat(design_features_name, " configid=").concat(design_configuration_id, " featureid=").concat(design_features_id, " maxlength=\"45\" value=\"\" autocomplete=\"off\" required=").concat(is_Mandatory, "></div></div>");
    } else {
      $(".productInput").attr({
        "name": design_features_name,
        "configid": design_configuration_id,
        "featureid": design_features_id
      });
    }
  });
  $("#product_ft").empty();
  $("#product_ft").append(opt);
}
function appendFeatures(_x2) {
  return _appendFeatures.apply(this, arguments);
}
function _appendFeatures() {
  _appendFeatures = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(ProductTypeGroupId) {
    var typeGroupFeatures, isHadFeatureTypes;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          typeGroupFeatures = mandatoryfeatures[ProductTypeGroupId];
          isHadFeatureTypes = Object.values(typeGroupFeatures).some(function (features) {
            return Object.hasOwn(features, "featureTypes");
          });
          if (!isHadFeatureTypes) {
            fabricJsObj.getFeatures().then(function (features) {
              var _iterator2 = _createForOfIteratorHelper(features),
                _step2;
              try {
                for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                  var feature = _step2.value;
                  var featureName = feature.design_feature_name;
                  if (typeGroupFeatures.hasOwnProperty(featureName)) {
                    typeGroupFeatures[featureName] = Object.assign(typeGroupFeatures[featureName], {
                      "featureTypes": feature.featureTypeList
                    });
                  }
                }
              } catch (err) {
                _iterator2.e(err);
              } finally {
                _iterator2.f();
              }
              appendFeatureOptions(ProductTypeGroupId);
            });
          } else appendFeatureOptions(ProductTypeGroupId);
        case 3:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return _appendFeatures.apply(this, arguments);
}
function appendProducts() {
  return _appendProducts.apply(this, arguments);
}
function _appendProducts() {
  _appendProducts = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
    var _$2;
    var products, target, index;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.t0 = window.products;
          if (_context6.t0) {
            _context6.next = 5;
            break;
          }
          _context6.next = 4;
          return fabricJsObj.getProductList();
        case 4:
          _context6.t0 = _context6.sent;
        case 5:
          products = _context6.t0;
          window.products = products;
          target = document.querySelector("select#Product");
          (_$2 = $(target)) === null || _$2 === void 0 || _$2.empty();
          index = 0;
          products && products.forEach(function (value) {
            if (index === 0) {
              target[index] = new Option(value, value, true, true);
              $(".productInput")[0].value = value;
            } else target[index] = new Option(value, value, false, false);
            index++;
          });
        case 11:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return _appendProducts.apply(this, arguments);
}
function appendTypeGroup(typeGroups) {
  var _$;
  var counter = 0;
  var target = document.querySelector("#ProductPtPGForSave");
  (_$ = $(target)) === null || _$ === void 0 || _$.empty();
  Object.keys(typeGroups).forEach(function (key) {
    if (counter == 0) {
      target["".concat(counter)] = new Option(typeGroups[key], key, true, true);
      var _key$split = key.split("-"),
        _key$split2 = _slicedToArray(_key$split, 2),
        typedId = _key$split2[0],
        groupId = _key$split2[1];
      fabricJsObj.setTypeGroup(typedId, groupId);
      appendFeatures(key);
    } else target[counter] = new Option(typeGroups[key], key, false, false);
    counter++;
  });
}
function OpenSaveDesign() {
  if (init.isShowLogin()) {
    callbackFn = OpenSaveDesign;
    showLoginPopup();
    return;
  }
  hideConfirmPopup();
  $("#fabNameError").hide();
  getSize(OrgHeightPx);
  $(".ciloader").show();
  $(".ciloader").css('z-index', '9999');
  setTimeout(function () {
    $('#package').show();
    $('#saveSkipConfirm').hide();
    $('#product_ft').empty();
    getPTPG_P(key);
    $(".ciloader").hide();
    $(".ciloader").css('z-index', '99999');
  }, 100);
  if (ImageName.length > 32) {
    ImageName = ImageName.slice(0, 32);
    $("#designNameId").val(ImageName);
  } else {
    $("#designNameId").val(ImageName);
  }
  validateDesignName(ImageName);
  OnUnitOpenScaleWindowInit("inches");
}
function getPTPG_P(key, callback) {
  //Apppend Type Group
  if (!window.typeGroups) {
    window.mandatoryfeatures = {};
    window.typeGroups = {};
    fabricJsObj.getProductTypeGroup().then(function (response) {
      var allDesignTypesByRoles = response.allDesignTypesByRoles;
      for (var _key in allDesignTypesByRoles) {
        var _allDesignTypesByRole = allDesignTypesByRoles[_key],
          getDesignGroupsByRoleListDto = _allDesignTypesByRole.getDesignGroupsByRoleListDto,
          design_type_name = _allDesignTypesByRole.design_type_name,
          design_type_id = _allDesignTypesByRole.design_type_id;
        var _iterator = _createForOfIteratorHelper(getDesignGroupsByRoleListDto),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var designGroup = _step.value;
            var groupName = designGroup.design_groups_name;
            var groupId = designGroup.design_groups_id;
            var productTypeGroup = "".concat(design_type_name, "-").concat(groupName);
            var ProductTypeGroupId = "".concat(design_type_id, "-").concat(groupId);
            // mandatoryfeatures[ProductTypeGroupId] = designGroup.getDesignFeaturesByRoleListDto
            // target[`${counter}`] = new Option(productTypeGroup,ProductTypeGroupId,true,true) 
            storeMandateFeatures(ProductTypeGroupId, designGroup.getDesignFeaturesByRoleListDto);
            storeProductTypeGroup(ProductTypeGroupId, productTypeGroup);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
      appendTypeGroup(typeGroups);
    })["catch"](function (exception) {
      console.log(exception);
    });
  } else {
    appendTypeGroup(window.typeGroups);
  }
  appendProducts();
}
function storeMandateFeatures(ProductTypeGroupId, obj) {
  mandatoryfeatures[ProductTypeGroupId] = {};
  obj.forEach(function (values) {
    var key = values["design_features_name"];
    mandatoryfeatures[ProductTypeGroupId][key] = {
      "design_features_id": values["design_features_id"],
      "design_configuration_id": values["design_configuration_id"],
      "design_features_name": values["design_features_name"],
      "is_Mandatory": values["is_Mandatory"]
    };
  });
}
function storeProductTypeGroup(ProductTypeGroupId, productTypeGroup) {
  window.typeGroups[ProductTypeGroupId] = productTypeGroup;
}
function FitToWindow() {
  var maxScale = 1.5; //
  var canWidth = cropCanvas1.width - 62;
  var canHeight = cropCanvas1.height - 62;
  if (design.width / canWidth < design.height / canHeight) {
    scale = canHeight / design.height;
  } else {
    scale = canWidth / design.width;
  }
  scale = Math.min(scale, maxScale);
  if (scale > 1.0) scale = 1.0;
  var pos = {
    x: (cropCanvas1.width - design.width * scale) / 2,
    y: (cropCanvas1.height - design.height * scale) / 2
  };
  SetScrollPos(pos);
  minZoom = scale;
}
function SetScrollPos(NewScrollPos) {
  if (NewScrollPos.x < 0) NewScrollPos.x = 0;
  if (NewScrollPos.x + cropCanvas1.width > design.width * scale) NewScrollPos.x = design.width * scale - cropCanvas1.width;
  if (NewScrollPos.y < 0) NewScrollPos.y = 0;
  if (NewScrollPos.y + cropCanvas1.height > design.height * scale) NewScrollPos.y = design.height * scale - cropCanvas1.height;
  var scrollxsize = design.width * scale - cropCanvas1.width;
  var scrollysize = design.height * scale - cropCanvas1.height;
  if (scrollxsize < 0) {
    scrollpos.x = scrollxsize / 2.0;
    scrRect.x = 0;
    scrRect.w = design.width;
    dstRect.x = Math.abs(scrollpos.x);
    dstRect.w = cropCanvas1.width - Math.abs(scrollxsize);
  } else {
    scrollpos.x = NewScrollPos.x;
    scrRect.x = scrollpos.x / scale;
    scrRect.w = cropCanvas1.width / scale;
    dstRect.x = 0;
    dstRect.w = cropCanvas1.width;
  }
  if (scrollysize < 0) {
    scrollpos.y = scrollysize / 2.0;
    scrRect.y = 0;
    scrRect.h = design.height;
    dstRect.y = Math.abs(scrollpos.y);
    dstRect.h = cropCanvas1.height - Math.abs(scrollysize);
  } else {
    scrollpos.y = NewScrollPos.y;
    scrRect.y = scrollpos.y / scale;
    scrRect.h = cropCanvas1.height / scale;
    dstRect.y = 0;
    dstRect.h = cropCanvas1.height;
  }
  Draw();
}
function Draw() {
  ctx.clearRect(0, 0, cropCanvas1.width, cropCanvas1.height);
  DrawImage();
  DrawPolygon(ctx);
  DrawControlPoints(ctx);
  DrawMeshPoints(ctx);
}
function DrawImage() {
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high'; //0,0,memory_canvas.width,memory_canvas.height,
  ctx.drawImage(design, scrRect.x, scrRect.y, scrRect.w, scrRect.h, dstRect.x, dstRect.y, dstRect.w, dstRect.h);
  ctx.imageSmoothingEnabled = false;
  ctx.imageSmoothingQuality = 'low'; //0,0,memory_canvas.width,memory_canvas.height,
}
function DrawPolygon(ctx) {
  var pt1, pt2;
  ctx.strokeStyle = '#FFF';
  ctx.beginPath();
  if (CropType == 2) {
    pt1 = GetClientPoint(0);
    pt2 = GetClientPoint(4);
    DrawLine(ctx, pt1, pt2);
    pt1 = GetClientPoint(1);
    DrawLine(ctx, pt2, pt1);
    pt2 = GetClientPoint(5);
    DrawLine(ctx, pt1, pt2);
    pt1 = GetClientPoint(2);
    DrawLine(ctx, pt2, pt1);
    pt2 = GetClientPoint(6);
    DrawLine(ctx, pt1, pt2);
    pt1 = GetClientPoint(3);
    DrawLine(ctx, pt2, pt1);
    pt2 = GetClientPoint(7);
    DrawLine(ctx, pt1, pt2);
    pt1 = GetClientPoint(0);
    DrawLine(ctx, pt2, pt1);
  } else {
    pt1 = GetClientPoint(0);
    pt2 = GetClientPoint(1);
    DrawLine(ctx, pt1, pt2);
    pt1 = GetClientPoint(2);
    DrawLine(ctx, pt2, pt1);
    pt2 = GetClientPoint(3);
    DrawLine(ctx, pt1, pt2);
    pt1 = GetClientPoint(0);
    DrawLine(ctx, pt2, pt1);
  }
  ctx.stroke();
}
function DrawLine(ctx, ptSt, ptEd) {
  ctx.moveTo(ptSt.x, ptSt.y);
  ctx.lineTo(ptEd.x, ptEd.y);
}
function DrawControlPoints(ctx) {
  DrawPoint(ctx, GetClientPoint(0));
  DrawPoint(ctx, GetClientPoint(1));
  DrawPoint(ctx, GetClientPoint(2));
  DrawPoint(ctx, GetClientPoint(3));
  DrawPoint(ctx, GetClientPoint(4));
  DrawPoint(ctx, GetClientPoint(5));
  DrawPoint(ctx, GetClientPoint(6));
  DrawPoint(ctx, GetClientPoint(7));
  //if(CropType !=2)                      
  DrawPoint(ctx, GetClientPoint(8));
}
function DrawPoint(ctx, pt) {
  ctx.beginPath();
  ctx.globalAlpha = 0.8;
  ctx.fillStyle = '#FFF';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.strokeStyle = '#000';
  ctx.beginPath();
  ctx.arc(pt.x, pt.y, 12, 0, 6.28);
  ctx.stroke();
  ctx.fill();
  ctx.globalAlpha = 1;
}
function DrawMeshPoints(ctx) {
  // Left to Right From top to bottom
  // stride 0
  if (CropType == 2 && isDrawMesh == true) {
    DrawMeshLines(ctx);
    for (var row = 0; row < NoOfParts; row++) {
      for (var col = 0; col < NoOfParts; col++) {
        DrawMeshControlPoint(ctx, GetClientMeshPoint(row, col));
      }
    }
  }
}
function DrawMeshLines(ctx) {
  ctx.strokeStyle = '#0F0';
  ctx.beginPath();
  var ptSt, ptEd;
  for (var row = 1; row < NoOfParts - 1; row++) {
    for (var col = 0; col < NoOfParts - 1; col++) {
      ptSt = GetClientMeshPoint(row, col);
      ptEd = GetClientMeshPoint(row, col + 1);
      DrawLine(ctx, ptSt, ptEd);
    }
  }
  for (var col = 1; col < NoOfParts - 1; col++) {
    for (var row = 0; row < NoOfParts - 1; row++) {
      ptSt = GetClientMeshPoint(row, col);
      ptEd = GetClientMeshPoint(row + 1, col);
      DrawLine(ctx, ptSt, ptEd);
    }
  }
  ctx.stroke();
}
function GetClientPoint(Index) {
  return doctoclient(GetDocPoint(Index));
}
function GetDocPoint(Index) {
  var ptdraw = {
    x: 0,
    y: 0
  };
  if (CropType == 0 || CropType == 1) {
    switch (Index) {
      case 0:
      case 1:
      case 2:
      case 3:
        ptdraw = tracker.docPt[Index];
        break;
      case 4:
        ptdraw.x = tracker.docPt[0].x + (tracker.docPt[1].x - tracker.docPt[0].x) / 2.0;
        ptdraw.y = tracker.docPt[0].y + (tracker.docPt[1].y - tracker.docPt[0].y) / 2.0;
        break;
      case 5:
        ptdraw.x = tracker.docPt[1].x + (tracker.docPt[2].x - tracker.docPt[1].x) / 2.0;
        ptdraw.y = tracker.docPt[1].y + (tracker.docPt[2].y - tracker.docPt[1].y) / 2.0;
        break;
      case 6:
        ptdraw.x = tracker.docPt[3].x + (tracker.docPt[2].x - tracker.docPt[3].x) / 2.0;
        ptdraw.y = tracker.docPt[3].y + (tracker.docPt[2].y - tracker.docPt[3].y) / 2.0;
        break;
      case 7:
        ptdraw.x = tracker.docPt[0].x + (tracker.docPt[3].x - tracker.docPt[0].x) / 2.0;
        ptdraw.y = tracker.docPt[0].y + (tracker.docPt[3].y - tracker.docPt[0].y) / 2.0;
        break;
      case 8:
        var x1, x2, y1, y2;
        x1 = tracker.docPt[0].x + (tracker.docPt[1].x - tracker.docPt[0].x) / 2.0;
        y1 = tracker.docPt[0].y + (tracker.docPt[1].y - tracker.docPt[0].y) / 2.0;
        x2 = tracker.docPt[3].x + (tracker.docPt[2].x - tracker.docPt[3].x) / 2.0;
        y2 = tracker.docPt[3].y + (tracker.docPt[2].y - tracker.docPt[3].y) / 2.0;
        ptdraw.x = x1 + (x2 - x1) / 2.0;
        ptdraw.y = y1 + (y2 - y1) / 2.0;
        break;
        break;
    }
  } else {
    switch (Index) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        ptdraw = tracker.docPt[Index];
        break;
      case 8:
        ptdraw = GetMeshPoint(2, 2);
        break;
    }
  }
  return ptdraw;
}
function doctoclient(mouse) {
  var pt = {
    x: 0,
    y: 0
  };
  pt.x = mouse.x * scale - scrollpos.x;
  pt.y = mouse.y * scale - scrollpos.y;
  return pt;
}
function clienttodoc(mouse) {
  var pt = {
    x: 0,
    y: 0
  };
  pt.x = (mouse.x + scrollpos.x) / scale;
  pt.y = (mouse.y + scrollpos.y) / scale;
  return pt;
}
function screentoclient(e) {
  var canvasOffset = $("#cropCanvas").offset();
  var pt = {
    x: 0,
    y: 0
  };
  if (e.changedTouches != undefined) {
    pt.x = parseInt(e.changedTouches[0].clientX - canvasOffset.left);
    pt.y = parseInt(e.changedTouches[0].clientY - canvasOffset.top);
    isMobileDevice = true;
  } else {
    var xPoints = e.clientX != undefined ? e.clientX : e.originalEvent.clientX;
    var yPoints = e.clientY != undefined ? e.clientY : e.originalEvent.clientY;
    pt.x = parseInt(xPoints - canvasOffset.left);
    pt.y = parseInt(yPoints - canvasOffset.top);
    isMobileDevice = false;
  }
  return pt;
}
function screentoclientPinch(e) {
  var _e$touches$, _e$touches$2;
  var canvasOffset = $("#cropCanvas").offset();
  var pt = {
    x: 0,
    y: 0
  };
  // var X = e.changedTouches[0].clientX + ((e.changedTouches[1]?.clientX - e.changedTouches[0].clientX) / 2);
  // var Y = e.changedTouches[0].clientY + ((e.changedTouches[1]?.clientY - e.changedTouches[0].clientY) / 2);
  //tanmay Added Changes :- touch Event 27-11-2024
  var X = e.touches[0].clientX + (((_e$touches$ = e.touches[1]) === null || _e$touches$ === void 0 ? void 0 : _e$touches$.clientX) - e.touches[0].clientX) / 2;
  var Y = e.touches[0].clientY + (((_e$touches$2 = e.touches[1]) === null || _e$touches$2 === void 0 ? void 0 : _e$touches$2.clientY) - e.touches[0].clientY) / 2;
  if (e.changedTouches != undefined) {
    pt.x = parseInt(X - canvasOffset.left);
    pt.y = parseInt(Y - canvasOffset.top);
    isMobileDevice = true;
  }
  return pt;
}
function LoadCursor(ID) {
  switch (ID) {
    case 0:
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
      if (isDown) $(cropCanvas1).css('cursor', 'crosshair');else $(cropCanvas1).css('cursor', 'crosshair');
      break;
    case 9:
      // cursor for panning
      $(cropCanvas1).css('cursor', 'crosshair');
      break;
    default:
      $(cropCanvas1).css('cursor', 'Default');
    // normal cursor
  }
}
function IsPointHover(pt) {
  var nHitPtID = null;
  var ClientPt;
  for (var i = 0; i < 9; i++) {
    ClientPt = GetClientPoint(i);
    if (IsPointInCircle(pt, ClientPt)) {
      nHitPtID = i;
      break;
    }
  }
  return nHitPtID;
}
function IsPointInCircle(a, b) {
  var nRadius = 40;
  if ((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y) < nRadius * nRadius) return true;else return false;
}
function GetOffsetPoint(pt, mouse) {
  var offset = {
    x: 0,
    y: 0
  };
  offset.x = mouse.x - pt.x;
  offset.y = mouse.y - pt.y;
  return offset;
}
function CorrectOffset(ptOffeset, ptMin, ptMax) {
  if (ptMax.x > design.width) ptOffeset.x = ptOffeset.x - (ptMax.x - design.width);
  if (ptMin.x < 0) ptOffeset.x = ptOffeset.x - ptMin.x;
  if (ptMax.y > design.height) ptOffeset.y = ptOffeset.y - (ptMax.y - design.height);
  if (ptMin.y < 0) ptOffeset.y = ptOffeset.y - ptMin.y;
  return ptOffeset;
}
function ErrorCheckOffset(ptOffeset, pt0, pt1, pt2, pt3) {
  if (pt0 != null) {
    if (pt1 == null) {
      ptOffeset = CorrectOffset(ptOffeset, pt0, pt0);
    } else {
      var ptMin, ptMax;
      if (pt2 != null && pt3 != null) {
        ptMin = Min(pt0, pt1);
        ptMin = Min(ptMin, pt2);
        ptMin = Min(ptMin, pt3);
        ptMax = Max(pt0, pt1);
        ptMax = Max(ptMax, pt2);
        ptMax = Max(ptMax, pt3);
        ptOffeset = CorrectOffset(ptOffeset, ptMin, ptMax);
      } else {
        ptMin = Min(pt0, pt1);
        ptMax = Max(pt0, pt1);
        ptOffeset = CorrectOffset(ptOffeset, ptMin, ptMax);
      }
    }
  }
  return ptOffeset;
}
function OffsetPoint(pt, offset) {
  var ptOff = {
    x: 0,
    y: 0
  };
  ptOff.x = pt.x + offset.x;
  ptOff.y = pt.y + offset.y;
  return ptOff;
}
function GetPointOnLine(side, len) {
  var DPt = {
    x: 0,
    y: 0
  };
  switch (side) {
    case 'top':
      var ptTL, ptTM, ptTR;
      ptTL = GetDocPoint(0);
      ptTM = GetDocPoint(4);
      ptTR = GetDocPoint(1);
      if (len < Distance(ptTL, ptTM)) {
        DPt = FindPointOnLine(ptTL, ptTM, len);
      } else {
        var lenTemp = len - Distance(ptTL, ptTM);
        DPt = FindPointOnLine(ptTM, ptTR, lenTemp);
      }
      break;
    case 'right':
      var ptRT, ptRM, ptRB;
      ptRT = GetDocPoint(1);
      ptRM = GetDocPoint(5);
      ptRB = GetDocPoint(2);
      if (len < Distance(ptRT, ptRM)) {
        DPt = FindPointOnLine(ptRT, ptRM, len);
      } else {
        var lenTemp = len - Distance(ptRT, ptRM);
        DPt = FindPointOnLine(ptRM, ptRB, lenTemp);
      }
      break;
    case 'bottom':
      var ptBL, ptBM, ptBR;
      ptBL = GetDocPoint(3);
      ptBM = GetDocPoint(6);
      ptBR = GetDocPoint(2);
      if (len < Distance(ptBL, ptBM)) {
        DPt = FindPointOnLine(ptBL, ptBM, len);
      } else {
        var lenTemp = len - Distance(ptBL, ptBM);
        DPt = FindPointOnLine(ptBM, ptBR, lenTemp);
      }
      break;
    case 'left':
      var ptLT, ptLM, ptLB;
      ptLT = GetDocPoint(0);
      ptLM = GetDocPoint(7);
      ptLB = GetDocPoint(3);
      if (len < Distance(ptLT, ptLM)) {
        DPt = FindPointOnLine(ptLT, ptLM, len);
      } else {
        var lenTemp = len - Distance(ptLT, ptLM);
        DPt = FindPointOnLine(ptLM, ptLB, lenTemp);
      }
      break;
  }
  return DPt;
}
function ConstructMeshPoints() {
  var Pt = {
    x: 0,
    y: 0
  };
  var part = 0;
  var ptSt, ptMd, ptEd, Len;

  // top side and direction left to right
  ptSt = GetDocPoint(0);
  ptMd = GetDocPoint(4);
  ptEd = GetDocPoint(1);
  Len = Distance(ptSt, ptMd) + Distance(ptMd, ptEd);
  part = Len / (NoOfParts - 1);
  for (var i = 0; i < NoOfParts; i++) {
    pt = GetPointOnLine('top', part * i);
    Mesh.stroke[i] = pt;
  }

  //right side and direction top to bottom
  ptSt = GetDocPoint(1);
  ptMd = GetDocPoint(5);
  ptEd = GetDocPoint(2);
  Len = Distance(ptSt, ptMd) + Distance(ptMd, ptEd);
  part = Len / (NoOfParts - 1);
  for (var i = 0; i < NoOfParts; i++) {
    pt = GetPointOnLine('right', part * i);
    Mesh.stroke[NoOfParts * i + (NoOfParts - 1)] = pt;
  }

  //bottom side and direction left to right
  ptSt = GetDocPoint(3);
  ptMd = GetDocPoint(6);
  ptEd = GetDocPoint(2);
  Len = Distance(ptSt, ptMd) + Distance(ptMd, ptEd);
  part = Len / (NoOfParts - 1);
  for (var i = 0; i < NoOfParts; i++) {
    pt = GetPointOnLine('bottom', part * i);
    Mesh.stroke[NoOfParts * 4 + i] = pt;
  }

  //left side and direction top to bottom
  ptSt = GetDocPoint(0);
  ptMd = GetDocPoint(7);
  ptEd = GetDocPoint(3);
  Len = Distance(ptSt, ptMd) + Distance(ptMd, ptEd);
  part = Len / (NoOfParts - 1);
  for (var i = 0; i < NoOfParts; i++) {
    pt = GetPointOnLine('left', part * i);
    Mesh.stroke[NoOfParts * i] = pt;
  }
  ConstructInsideMeshPoints();
  OnApplyTdsCrop();
}
function OnApplyTdsCrop() {
  var widthtop = 0,
    widthbottom = 0,
    heightleft = 0,
    heightright = 0;
  var ptSt, ptEd;
  for (var col = 0; col < NoOfParts - 1; col++) {
    ptSt = GetMeshPoint(0, col);
    ptEd = GetMeshPoint(0, col + 1);
    widthtop += Distance(ptSt, ptEd);
    ptSt = GetMeshPoint(4, col);
    ptEd = GetMeshPoint(4, col + 1);
    widthbottom += Distance(ptSt, ptEd);
  }
  for (var row = 0; row < NoOfParts - 1; row++) {
    ptSt = GetMeshPoint(row, 0);
    ptEd = GetMeshPoint(row + 1, 0);
    heightleft += Distance(ptSt, ptEd);
    ptSt = GetMeshPoint(row, 4);
    ptEd = GetMeshPoint(row + 1, 4);
    heightright += Distance(ptSt, ptEd);
  }
  var dstwidth = (widthtop + widthbottom) / 2;
  var dstheight = (heightleft + heightright) / 2;
  var dstWidthParts = dstwidth / (NoOfParts - 1);
  var dstHeightParts = dstheight / (NoOfParts - 1);
  var quadInd = 0;
  for (var row = 0; row < NoOfParts - 1; row++) {
    for (var col = 0; col < NoOfParts - 1; col++, quadInd++) {
      destgrid.quad[quadInd][0].x = col * dstWidthParts;
      destgrid.quad[quadInd][0].y = row * dstHeightParts;
      destgrid.quad[quadInd][1].x = (col + 1) * dstWidthParts;
      destgrid.quad[quadInd][1].y = row * dstHeightParts;
      destgrid.quad[quadInd][2].x = (col + 1) * dstWidthParts;
      destgrid.quad[quadInd][2].y = (row + 1) * dstHeightParts;
      destgrid.quad[quadInd][3].x = col * dstWidthParts;
      destgrid.quad[quadInd][3].y = (row + 1) * dstHeightParts;
      sourcgrid.quad[quadInd][0] = GetMeshPoint(row, col);
      sourcgrid.quad[quadInd][1] = GetMeshPoint(row, col + 1);
      sourcgrid.quad[quadInd][2] = GetMeshPoint(row + 1, col + 1);
      sourcgrid.quad[quadInd][3] = GetMeshPoint(row + 1, col);
    }
  }
}
function ConstructInsideMeshPoints() {
  var part = 0;
  var ptSt, ptEd, Len;
  var pt;
  // top side and direction left to right
  for (var col = 1; col < NoOfParts - 1; col++) {
    ptSt = GetMeshPoint(0, col);
    ptEd = GetMeshPoint(4, col);
    Len = Distance(ptSt, ptEd);
    part = Len / (NoOfParts - 1);
    for (var row = 1; row < NoOfParts - 1; row++) {
      pt = FindPointOnLine(ptSt, ptEd, part * row);
      Mesh.stroke[row * NoOfParts + col] = pt;
    }
  }
  var MeshRow = {
    stroke: [{
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }]
  };
  for (var row = 1; row < NoOfParts - 1; row++) {
    Len = 0;
    for (var col = 0; col < NoOfParts - 1; col++) {
      ptSt = GetMeshPoint(row, col);
      ptEd = GetMeshPoint(row, col + 1);
      Len += Distance(ptSt, ptEd);
    }
    part = Len / (NoOfParts - 1);
    for (var col = 1; col < NoOfParts - 1; col++) {
      pt = GetPointOnInsideLine(row, part * col);
      MeshRow.stroke[col] = pt;
    }
    for (var col = 1; col < NoOfParts - 1; col++) {
      Mesh.stroke[row * NoOfParts + col] = MeshRow.stroke[col];
    }
  }
}
function SetPoint(mouse) {
  mouse = clienttodoc(mouse);
  var offset = {
    x: 0,
    y: 0
  };
  switch (HitID) {
    case 0:
      offset = GetOffsetPoint(GetDocPoint(HitID), mouse);
      offset = ErrorCheckOffset(offset, OffsetPoint(tracker.docPt[HitID], offset), null, null, null);
      if (GetDocPoint(1).x > mouse.x && GetDocPoint(3).y > mouse.y) {
        tracker.docPt[HitID] = OffsetPoint(tracker.docPt[HitID], offset);
      } else {
        if (GetDocPoint(1).x < mouse.x && GetDocPoint(3).y > mouse.y) {
          tracker.docPt[HitID] = OffsetPoint(tracker.docPt[HitID], offset);
          tracker.docPt[HitID].x = GetDocPoint(1).x;
        } else if (GetDocPoint(3).y < mouse.y && GetDocPoint(1).x > mouse.x) {
          tracker.docPt[HitID] = OffsetPoint(tracker.docPt[HitID], offset);
          tracker.docPt[HitID].y = GetDocPoint(3).y;
        }
      }
      break;
    case 1:
      offset = GetOffsetPoint(GetDocPoint(HitID), mouse);
      offset = ErrorCheckOffset(offset, OffsetPoint(tracker.docPt[HitID], offset), null, null, null);
      if (GetDocPoint(0).x < mouse.x && GetDocPoint(2).y > mouse.y) {
        tracker.docPt[HitID] = OffsetPoint(tracker.docPt[HitID], offset);
      } else {
        if (GetDocPoint(0).x > mouse.x && GetDocPoint(2).y > mouse.y) {
          tracker.docPt[HitID] = OffsetPoint(tracker.docPt[HitID], offset);
          tracker.docPt[HitID].x = GetDocPoint(0).x;
        } else if (GetDocPoint(2).y < mouse.y && GetDocPoint(0).x < mouse.x) {
          tracker.docPt[HitID] = OffsetPoint(tracker.docPt[HitID], offset);
          tracker.docPt[HitID].y = GetDocPoint(2).y;
        }
      }
      break;
    case 2:
      offset = GetOffsetPoint(GetDocPoint(HitID), mouse);
      offset = ErrorCheckOffset(offset, OffsetPoint(tracker.docPt[HitID], offset), null, null, null);
      if (GetDocPoint(3).x < mouse.x && GetDocPoint(1).y < mouse.y) {
        tracker.docPt[HitID] = OffsetPoint(tracker.docPt[HitID], offset);
      } else {
        if (GetDocPoint(3).x > mouse.x && GetDocPoint(1).y < mouse.y) {
          tracker.docPt[HitID] = OffsetPoint(tracker.docPt[HitID], offset);
          tracker.docPt[HitID].x = GetDocPoint(3).x;
        } else if (GetDocPoint(1).y > mouse.y && GetDocPoint(3).x < mouse.x) {
          tracker.docPt[HitID] = OffsetPoint(tracker.docPt[HitID], offset);
          tracker.docPt[HitID].y = GetDocPoint(1).y;
        }
      }
      break;
    case 3:
      offset = GetOffsetPoint(GetDocPoint(HitID), mouse);
      offset = ErrorCheckOffset(offset, OffsetPoint(tracker.docPt[HitID], offset), null, null, null);
      if (GetDocPoint(2).x > mouse.x && GetDocPoint(0).y < mouse.y) {
        tracker.docPt[HitID] = OffsetPoint(tracker.docPt[HitID], offset);
      } else {
        if (GetDocPoint(2).x < mouse.x && GetDocPoint(0).y < mouse.y) {
          tracker.docPt[HitID] = OffsetPoint(tracker.docPt[HitID], offset);
          tracker.docPt[HitID].x = GetDocPoint(2).x;
        } else if (GetDocPoint(0).y > mouse.y && GetDocPoint(2).x > mouse.x) {
          tracker.docPt[HitID] = OffsetPoint(tracker.docPt[HitID], offset);
          tracker.docPt[HitID].y = GetDocPoint(0).y;
        }
      }
      break;
    case 4:
      offset = GetOffsetPoint(GetDocPoint(HitID), mouse);
      offset = ErrorCheckOffset(offset, OffsetPoint(tracker.docPt[0], offset), OffsetPoint(tracker.docPt[1], offset), null, null);
      tracker.docPt[0] = OffsetPoint(tracker.docPt[0], offset);
      tracker.docPt[1] = OffsetPoint(tracker.docPt[1], offset);
      break;
    case 5:
      offset = GetOffsetPoint(GetDocPoint(HitID), mouse);
      offset = ErrorCheckOffset(offset, OffsetPoint(tracker.docPt[1], offset), OffsetPoint(tracker.docPt[2], offset), null, null);
      tracker.docPt[1] = OffsetPoint(tracker.docPt[1], offset);
      tracker.docPt[2] = OffsetPoint(tracker.docPt[2], offset);
      break;
    case 6:
      offset = GetOffsetPoint(GetDocPoint(HitID), mouse);
      offset = ErrorCheckOffset(offset, OffsetPoint(tracker.docPt[2], offset), OffsetPoint(tracker.docPt[3], offset), null, null);
      tracker.docPt[2] = OffsetPoint(tracker.docPt[2], offset);
      tracker.docPt[3] = OffsetPoint(tracker.docPt[3], offset);
      break;
    case 7:
      offset = GetOffsetPoint(GetDocPoint(HitID), mouse);
      offset = ErrorCheckOffset(offset, OffsetPoint(tracker.docPt[3], offset), OffsetPoint(tracker.docPt[0], offset), null, null);
      tracker.docPt[3] = OffsetPoint(tracker.docPt[3], offset);
      tracker.docPt[0] = OffsetPoint(tracker.docPt[0], offset);
      break;
    case 8:
      offset = GetOffsetPoint(GetDocPoint(HitID), mouse);
      offset = ErrorCheckOffset(offset, OffsetPoint(tracker.docPt[0], offset), OffsetPoint(tracker.docPt[1], offset), OffsetPoint(tracker.docPt[2], offset), OffsetPoint(tracker.docPt[3], offset));
      tracker.docPt[0] = OffsetPoint(tracker.docPt[0], offset);
      tracker.docPt[1] = OffsetPoint(tracker.docPt[1], offset);
      tracker.docPt[2] = OffsetPoint(tracker.docPt[2], offset);
      tracker.docPt[3] = OffsetPoint(tracker.docPt[3], offset);
      break;
  }
}
function SetPointCustom(mouse) {
  mouse = clienttodoc(mouse);
  switch (HitID) {
    case 0:
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
      offset = GetOffsetPoint(GetDocPoint(HitID), mouse);
      offset = ErrorCheckOffset(offset, OffsetPoint(tracker.docPt[HitID], offset), null, null, null);
      tracker.docPt[HitID] = OffsetPoint(tracker.docPt[HitID], offset);
      break;
    case 8:
      offset = GetOffsetPoint(GetDocPoint(HitID), mouse);
      offset = ErrorCheckOffset(offset, OffsetPoint(tracker.docPt[0], offset), OffsetPoint(tracker.docPt[1], offset), OffsetPoint(tracker.docPt[2], offset), OffsetPoint(tracker.docPt[3], offset));
      offset = ErrorCheckOffset(offset, OffsetPoint(tracker.docPt[4], offset), OffsetPoint(tracker.docPt[5], offset), OffsetPoint(tracker.docPt[6], offset), OffsetPoint(tracker.docPt[7], offset));
      for (var i = 0; i < 8; i++) tracker.docPt[i] = OffsetPoint(tracker.docPt[i], offset);
      break;
  }
  ConstructMeshPoints();
}
function GetMeshPoint(row, col) {
  var Pt = {
    x: 0,
    y: 0
  };
  Pt = Mesh.stroke[row * NoOfParts + col];
  return Pt;
}
function GetScrollPos() {
  var ptPos = {
    x: 0,
    y: 0
  };
  ptPos.x = scrollpos.x;
  ptPos.y = scrollpos.y;
  return ptPos;
}
function SetClearRect() {
  if (isCrop) {
    ctx.clearRect(0, 0, cropCanvas1.width, cropCanvas1.height);
    ctx.drawImage(design, 0, 0);
  }
}
function Min(pt1, pt2) {
  var pt = {
    x: 0,
    y: 0
  };
  pt.x = Math.min(pt1.x, pt2.x);
  pt.y = Math.min(pt1.y, pt2.y);
  return pt;
}
function Max(pt1, pt2) {
  var pt = {
    x: 0,
    y: 0
  };
  pt.x = Math.max(pt1.x, pt2.x);
  pt.y = Math.max(pt1.y, pt2.y);
  return pt;
}
function DrawMagnifire() {
  if (HitID < 8) {
    var x, w, y, h, xC, yC;
    var MagRadius = window.innerWidth >= '1023px' ? 100 : 50;
    var ptDoc = {
      x: 0,
      y: 0
    };
    ptDoc = GetDocPoint(HitID);
    var ptClient = doctoclient(ptDoc);
    x = ptDoc.x - MagRadius;
    y = ptDoc.y - MagRadius;
    w = MagRadius * 2;
    h = MagRadius * 2;
    xC = MagRadius;
    yC = MagRadius;
    if (x < 0) {
      xC = xC + x;
      x = 0;
    } else if (x + MagRadius * 2 > design.width) {
      xC = xC + (x + MagRadius * 2 - design.width);
      x = design.width - MagRadius * 2;
    }
    if (y < 0) {
      yC = yC + y;
      y = 0;
    } else if (y + MagRadius * 2 > design.height) {
      yC = yC + (y + MagRadius * 2 - design.height);
      y = design.height - MagRadius * 2;
    }
    var isDrawElipse = false;
    ctxMag.clearRect(0, 0, mag.width, mag.height);
    ctxMag.save();
    ctxMag.beginPath();
    if (isDrawElipse) ctxMag.arc(MagRadius, MagRadius, MagRadius, 0, 2 * Math.PI, false);else ctxMag.rect(0, 0, MagRadius * 2, MagRadius * 2);
    ctxMag.clip();
    ctxMag.drawImage(design, x, y, w, h, 0, 0, MagRadius * 2, MagRadius * 2);
    ctxMag.restore();
    var depth = 2;
    var lineLength = 15;
    ctxMag.lineWidth = 1;
    // Draw horizontal 3D line
    for (var i = 0; i < depth; i++) {
      ctxMag.strokeStyle = i % 2 === 0 ? 'black' : 'white';
      ctxMag.beginPath();
      ctxMag.moveTo(xC - lineLength, yC + i);
      ctxMag.lineTo(xC + lineLength, yC + i);
      ctxMag.stroke();
      ctxMag.restore();
    }
    // Draw vertical 3D line
    for (var _i = 0; _i < depth; _i++) {
      ctxMag.strokeStyle = _i % 2 === 0 ? 'black' : 'white';
      ctxMag.beginPath();
      ctxMag.moveTo(xC + _i, yC - lineLength);
      ctxMag.lineTo(xC + _i, yC + lineLength);
      ctxMag.stroke();
      ctxMag.restore();
    }
    var top_header = 50;
    var finger_diameter = 25;
    var mag_width = mag.width;
    var mag_height = mag.height;
    var left = ptClient.x - mag_width / 2;
    var right = left + mag_height;
    var bottom = ptClient.y - finger_diameter;
    var top = bottom - mag_height;
    var doc_width = design.width;
    var doc_height = design.height;
    var ptTopLeft = {
      x: left,
      y: top
    };
    var ptBottomRight = {
      x: right,
      y: bottom
    };
    var doc_topleft = clienttodoc(ptTopLeft);
    var doc_bottomright = clienttodoc(ptBottomRight);
    if (top < top_header) {
      top = top_header;
      bottom = mag_height;
      left = ptClient.x + finger_diameter;
      right = left + mag_width;
      ptTopLeft = {
        x: left,
        y: top
      };
      ptBottomRight = {
        x: right,
        y: bottom
      };
      doc_topleft = clienttodoc(ptTopLeft);
      doc_bottomright = clienttodoc(ptBottomRight);
      if (doc_bottomright.x > doc_width) {
        doc_topleft = doctoclient(ptTopLeft);
        right = ptClient.x - finger_diameter;
        left = right - mag_width;
        ptTopLeft = {
          x: left,
          y: top
        };
        ptBottomRight = {
          x: right,
          y: bottom
        };
        doc_topleft = clienttodoc(ptTopLeft);
        doc_bottomright = clienttodoc(ptBottomRight);
      }
      if (doc_topleft.x < 0) {
        left = ptClient.x + finger_diameter;
        right = left + mag_width;
      }
    } else if (doc_bottomright.x > doc_width)
      // move to left
      {
        var ptclientTopRight = {
          x: doc_width,
          y: 0
        };
        ptclientTopRight = doctoclient(ptclientTopRight);
        right = ptclientTopRight.x;
        left = right - mag_width;
        ptTopLeft = {
          x: left,
          y: top
        };
        ptBottomRight = {
          x: right,
          y: bottom
        };
        doc_topleft = clienttodoc(ptTopLeft);
        doc_bottomright = clienttodoc(ptBottomRight);
      } else if (doc_topleft.x < 0)
      // move to right
      {
        var ptclientTopRight = {
          x: 0,
          y: 0
        };
        ptclientTopRight = doctoclient(ptclientTopRight);
        left = ptclientTopRight.x;
        right = left + mag_width;
      }
    $('#_maxDiv').css('width', mag_width);
    $('#_maxDiv').css('height', mag_height);
    $('#_maxDiv').css('top', top);
    $('#_maxDiv').css('left', left);
    //   $('#_maxDiv').css('visibility', 'visible');
    $('#_maxDiv').css({
      "visibility": "visible",
      "display": "block"
    });
  }
}
function confirmAction() {
  var textMessge = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var action = arguments.length > 1 ? arguments[1] : undefined;
  $('.confirmPopupbt').css('display', 'none');
  console.log(action);
  switch (action) {
    case 'saveOption':
      init.isDemoUser() ? $("#view-design").show() : $("#save-design,#view-design").show();
      break;
    case 'lossData':
      $("#lossData-yesbtn,#lossData-nobtn").show();
      break;
    case 'designExists':
      $("#designExists-yesbtn,#designExists-nobtn").show();
      break;
    case 'applyFilter':
      $("#applyFilter,#resetFilter").show();
      break;
    case "SaveDesign":
      $('#confirmPopupOverlay').css('display', 'block');
      $("#showQrpopup").show();
      $('#popupMessage').text(textMessge);
      break;
    case "notSaveDesign":
      $('#confirmPopupOverlay').css('display', 'block');
      $("#showcurrent_page").show();
      $('#popupMessage').text(textMessge);
      break;
    default:
      console.log("Invalid action");
  }
}
//Manisha
function showPopup(message) {
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var popupContent = document.getElementById("popupMessage");
  popupContent.innerText = message;
  // popupContent.setAttribute("action",action)
  confirmAction(message, action);
  var popup = document.getElementById('confirmPopupOverlay');
  popup.style.display = "block";
}
function hideConfirmPopup() {
  $('.confirmPopupOverlay').css('display', 'none');
  // $('.confirmPopupbt').css('display','none') 
}
function showMessageToast(message) {
  // $("#toastTitle").text(title);
  $("#toastBody").text(message);
  $('#toastMessage').toast({
    delay: 8000
  }); //tanmay Change Time to check entering width height below 20 09-10-2024 
  $('#toastMessage').toast('show').css('display', 'block'); // Show the toast
}
function toggleMenu() {
  var logoutMenu = $('#user-menu');
  logoutMenu.toggle();
}
function validateDesignName(dname) {
  var isValid = false;
  var message = '';
  var validationStr = /[&\\/#,+$~%.'"/`!;:*?<>{}]/;
  if ((dname === null || dname === void 0 ? void 0 : dname.trim()) == "") {
    message = "please fill the design name";
    $("#fabNameError").text(message).show();
  } else if (validationStr.test(dname)) {
    isValid = false;
    message = "Design Name contains special characters.";
    $("#fabNameError").text(message).show();
  } else isValid = true;
  return {
    isValid: isValid,
    message: message
  };
}
//events
$(document).ready(function () {
  divs.hide().first().show();
  $("#prevID").hide();
  $("div[name=next]").click(function (e) {
    initTempCanvas(); //Shubham Change: -- 25-10-2024
    divs.eq(nowCIncrement).hide();
    nowCIncrement = nowCIncrement + 1 < divs.length ? nowCIncrement + 1 : 0;
    divs.eq(nowCIncrement).show().css('display', 'flex'); // show next

    if (nowCIncrement == 0) {
      console.log('one');
      $("#package-icon").trigger("click");
      // $("#filters-icon").trigger("click");
    }
    if (nowCIncrement == 1) {
      console.log('two');
      $("#prevID").show().css('display', 'flex');
      $("#filters-icon").trigger("click");
      // $("#package-icon").trigger("click");
    }
    if (nowCIncrement == 2) {
      console.log('three');
      $("#nextID").hide();
      $("#saveNext-btn").show();
      resetAspectRatio();
      OnUnitOpenScaleWindowInit("inches");
      // $("#setting-icon").trigger("click");
    }
  });
  $("div[name=prev]").click(function (e) {
    // document.querySelector("#aspectCheckId").checked = true  
    // $('#aspectCheckId').click(); //tanamy Added 09-10-2024 :- purpose lock the width height button 
    initTempCanvas(); //Shubham Change: -- 25-10-2024
    divs.eq(nowCIncrement).hide();
    nowCIncrement = nowCIncrement > 0 ? nowCIncrement - 1 : divs.length - 1;
    divs.eq(nowCIncrement).show().css('display', 'flex'); // or .css('display','block');
    if (nowCIncrement == 0) {
      $("#prevID").hide();
      $("#nextID").show();
      $("#package-icon").trigger("click");
    }
    if (nowCIncrement == 1) {
      $("#prevID").show();
      $("#filters-icon").trigger("click");
      $("#nextID").show();
      // $("#package-icon").trigger("click");
    }
    if (nowCIncrement == 2) {
      resetAspectRatio();
      OnUnitOpenScaleWindowInit("inches");
      $("#setting-icon").trigger("click");
    }
  });
  $('#aspectCheckId').change(function () {
    if ($(this).is(":checked")) {
      AspectRatio = true;
      $(this).parent().parent().addClass('lock');
      $(this).parent().parent().removeClass('unlock');
      OnClickAspect();
    } else {
      AspectRatio = false;
      $(this).parent().parent().addClass('unlock');
      $(this).parent().parent().removeClass('lock');
    }
  });
  $(".close-header").on("click", function (event) {
    event.stopPropagation();
    hideConfirmPopup();
  });
  //Events
  $("#rotation-item").on("click", function (event) {
    event.stopPropagation();
    showRotation();
  });
  $("#rotation .rotatecc").on("click", function (event) {
    event.stopPropagation();
    applyRotation();
  });
  $("body").on("click", "#brightness_btn,#contrast_btn,#saturation_btn,#rgb_btn,#sharpen_btn,#filters-icon", function (event) {
    event.stopPropagation();
    isModified = false;
    applyFilter();
    showFilters();
  });
  $("body").on("click", ".reset_btn", function () {
    isModified = false;
    loadCheckPoint();
    resetRange();
  });
  $("#custom_browse").on("click", function (event) {
    event.stopPropagation();
    upload();
  });
  $("#newcrop-item").on("click", function (event) {
    event.stopPropagation();
    showNewCrop();
  });
  $("#flip-item").on("click", function (event) {
    event.stopPropagation();
    showFlip();
  });
  $("#apply_btn,.apply_btn1").on("click", function (event) {
    event.stopPropagation();
    OnScaleApply();
  });
  $("#rgb-item").on("click", function (event) {
    event.stopPropagation();
    showRgb();
  });
  $("#contrast-item").on("click", function (event) {
    event.stopPropagation();
    showContrast();
  });
  $("#saturation-item").on("click", function (event) {
    event.stopPropagation();
    showSaturation();
  });
  $("#sharpen-item").on("click", function (event) {
    event.stopPropagation();
    showSharpen();
  });
  $("#brightness-item").on("click", function (event) {
    event.stopPropagation();
    showBrightness();
  });
  $("#newCrop .cancelCrop").on("click", function (event) {
    event.stopPropagation();
    canvasPos();
    showCSettings();
  });
  $("#crop_btn").on("click", function (event) {
    event.stopPropagation();
    applyNewCrop();
    // canvasPos();
    // showCSettings()
  });
  $("#saveNext-btn").on("click", function (event) {
    event.stopPropagation();
    if (init.isQ3d()) {
      fabricJsObj.AuthUser();
      var saveDesign = "Do you Want to Save this Fabric? or just View temporarily ?";
      // $("#export-btn, #applyimg").css('display', 'block');
      showPopup(saveDesign, 'saveOption');
      //TdsImageCrop.saveSkipApp()
    } else {
      OpenSaveDesign();
    }
  });
  $("#view-design").on("click", function () {
    var imgdata = getImgBase64();
    var imgsize = "".concat(Number(OrgWidthPx / Dpi).toFixed(5), ",").concat(Number(OrgHeightPx / Dpi).toFixed(5)); //inches
    init.view(imgdata, imgsize, ImageName);
  });
  $("body").on("click", "#c-back,.done_btn,#package-icon,#setting-icon", function (event) {
    event.stopPropagation();
    showCSettings();
  });
  $("#back").on("click", function (event) {
    event.stopPropagation();
    showSettings();
  });
  $("#flip_H").on("click", function (event) {
    event.stopPropagation();
    applyFlipH();
  });
  $("#flip_V").on("click", function (event) {
    event.stopPropagation();
    applyFlipV();
  });
  $("#extenalClose-btn").on("click", function (event) {
    event.stopPropagation();
    init.closeExternalApp();
  });
  $("#export-btn").on("click", function (event) {
    event.stopPropagation();
    OpenSaveDesign();
  });
  $(".cancel").on("click", function (event) {
    event.stopPropagation();
    confirmMessageClose();
  });
  $("#closeB").on("click", function (event) {
    event.stopPropagation();
    $("#package").hide();
  });
  //Input Events
  $("#b-range").on("input", function (event) {
    event.stopPropagation();
    applyBrightness(this.value);
  });
  $("#c-range").on("input", function (event) {
    event.stopPropagation();
    applyContrast(this.value);
  });
  $("#s-range").on("input", function (event) {
    event.stopPropagation();
    applySaturation(this.value);
  });
  $("#sharpen-range").on("input", function (event) {
    event.stopPropagation();
    applySharpen(this.value);
  });
  $("#rgb-r-range").on("input", function (event) {
    event.stopPropagation();
    applyRGB();
  });
  $("#rgb-g-range").on("input", function (event) {
    event.stopPropagation();
    applyRGB();
  });
  $("#rgb-b-range").on("input", function (event) {
    event.stopPropagation();
    applyRGB();
  });
  $(".filter-range").on("input", function () {
    isModified = true;
  });
  //Change Events
  $(document).on("change", "#captureImg", function (event) {
    event.stopPropagation();
    getImage(this.files, this);
    this.value = '';
  });
  $("#imageUp").on("change", function (event) {
    event.stopPropagation();
    getImage(this.files, this);
    this.value = '';
  });
  $("#UnitsId").on("change", function (event) {
    event.stopPropagation();
    OnUnitComboChange(this);
  });
  $("#Product").on("change", function (event) {
    event.stopPropagation();
    this.nextElementSibling.value = this.value;
  });
  $('#cwidth').on('input', function () {
    var metaViewport = document.querySelector('meta[name="viewport"]');
    // Store the original viewport content
    var originalViewportContent = metaViewport.getAttribute('content');
    OnEnterWidth();
    controlZoom(metaViewport, originalViewportContent);
  });
  $('#cheight').on('input', function () {
    var metaViewport = document.querySelector('meta[name="viewport"]');
    // Store the original viewport content
    var originalViewportContent = metaViewport.getAttribute('content');
    OnEnterHeight();
    controlZoom(metaViewport, originalViewportContent);
  });
  $("#saveFinalImgId").on("click", function () {
    $(".ciloader").show();
    $('#closeB').click();
    $('#New_loader_css').css('display', 'block');
    $('#save_fabric_loader').css('display', 'block');
    var designCheckVal = sessionStorage.getItem('designNameCheck');
    var designName = $('#designNameId').val();
    if (designCheckVal == designName) {
      confirmAction("Design already exist.", "notSaveDesign");
    }
    var designNameCheck = sessionStorage.setItem('designNameCheck', designName);
    setTimeout(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var _$$;
      var o, desName, validation, features, Product, featureTypeList, featureNameList, base64result, DesignSize, state, designId;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            o = getImgBase64();
            desName = $('#designNameId').val();
            validation = validateDesignName(desName);
            if (validation.isValid) {
              _context.next = 6;
              break;
            }
            $(".ciloader").hide();
            return _context.abrupt("return");
          case 6:
            features = $(".material_input_box");
            Product = (_$$ = $(".productInput")[0]) === null || _$$ === void 0 ? void 0 : _$$.value;
            featureTypeList = [];
            featureNameList = [];
            features && features.each(function (index) {
              var _features$index;
              var _features$index$attri = features[index].attributes,
                featureid = _features$index$attri.featureid,
                name = _features$index$attri.name,
                configid = _features$index$attri.configid,
                required = _features$index$attri.required;
              if ((_features$index = features[index]) !== null && _features$index !== void 0 && (_features$index = _features$index.value) !== null && _features$index !== void 0 && _features$index.trim()) {
                var fList = {
                  "dd_details_id": 0,
                  "dd_dm_id": 0,
                  "dd_feature_id": featureid.value,
                  "dd_feature_type_id": 0,
                  "dd_feature_type_name": features[index].value,
                  "dd_design_configuration_id": configid.value
                };
                var fNameList = {
                  "Featurename": name.value,
                  "FeatureTypename": features[index].value
                };
                featureNameList.push(fNameList);
                featureTypeList.push(fList);
              } else if ((required === null || required === void 0 ? void 0 : required.value) === "true") {
                $(".ciloader").show();
                showMessageToast('Please fill mandatory fields');
                $(".ciloader").hide();
                throw new Error("Enter Mandatory Fields");
              }
            });
            base64result = o.split(',')[1];
            DesignSize = "".concat(Number(OrgWidthPx / Dpi).toFixed(5), ",").concat(Number(OrgHeightPx / Dpi).toFixed(5)); //inches
            state = 0;
            designId = 0;
            window.uploadPaylod = {
              "state": state,
              "dm_Id": designId,
              "dm_Design_Name": desName,
              "dm_design_size": DesignSize,
              "featureList": JSON.stringify(featureTypeList),
              "features_Dic": JSON.stringify(featureNameList),
              "design_Base64": base64result,
              "Product": Product
            };
            // const isExist = await fabricJsObj.IsDesignExist(desName);
            uploadDesign(window.uploadPaylod);

            // if(!isExist?.existingDesigns[desName]){
            /*  $('#save_fabric_loader').css('display', 'none');
              $('#New_loader_css').css('display','none');
              const designExists = "The Design name already exists!\n Do you want to overwrite it?";*/
            // const designId = isExist?.existingDesigns[desName].split(",")[0]
            // uploadPaylod.state = 1;
            //  uploadPaylod.dm_Id = 1;
            /* showPopup(designExists,"designExists")
             $("#yesCancel,#btn").css('display','block');*/
            // $("#messageConfirm").show()ManishaD
            // uploadDesign(window.uploadPaylod);
            /* }
             else{
                 uploadDesign(window.uploadPaylod)
             }*/
          case 17:
          case "end":
            return _context.stop();
        }
      }, _callee);
    })), 100);
  });
  $("body").on('click', '#download-dpi-btn', function () {
    // console.log('click')
    $("#download-dpi-btn").prop('disabled', true);
    var canvas = document.getElementById('new');
    var base64Image = canvas.toDataURL('image/jpeg');
    if (base64Image) {
      fetch('https://linux.q3d.in/navyasa_vertical/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image: base64Image
        })
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        console.log('Success:', data);
        var a = document.createElement('a');
        a.href = data.image;
        a.download = ImageName + '.jpeg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        $("#download-dpi-btn").prop('disabled', false);
      })["catch"](function (error) {
        console.log('Error:', error);
      });
    }
  });
  $(".close_login").on("click", function () {
    hideLoginPopup();
    callbackFn = null;
    $(".invalid-feedback").hide();
  });
  $("#login_btn").on("click", function () {
    showLoginPopup();
  });
  $(".login_wrap").on("click", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
    var _document$querySelect, _document$querySelect2;
    var username, password, _fabricJsObj, result, message, userid;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          username = (_document$querySelect = document.querySelector("#inputEmail4")) === null || _document$querySelect === void 0 || (_document$querySelect = _document$querySelect.value) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.trim();
          password = (_document$querySelect2 = document.querySelector("#loginPagepass")) === null || _document$querySelect2 === void 0 ? void 0 : _document$querySelect2.value.trim();
          if (!(/[A-Za-z][A-Za-z0-9_][0-9]{0,20}/.test(username) && password)) {
            _context2.next = 11;
            break;
          }
          $(".invalid-feedback").hide();
          //  const result = await  TdsImageCrop?.authenticateUser(username,password)
          _context2.next = 6;
          return (_fabricJsObj = fabricJsObj) === null || _fabricJsObj === void 0 ? void 0 : _fabricJsObj.loginUser(username, password);
        case 6:
          result = _context2.sent;
          message = result.message, userid = result.userid;
          if (!message && userid) {
            //manisha D    
            $('.login-downloadbt').hide();
            $('.afterUserlogged').show();
            $('#show_myuser').text(username);
            //manisha D
            hideLoginPopup();
            window.typeGroups = null;
            if (callbackFn) {
              callbackFn();
              callbackFn = null;
            }
          } else showMessageToast(result === null || result === void 0 ? void 0 : result.message);
          _context2.next = 12;
          break;
        case 11:
          $(".invalid-feedback").show();
        case 12:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  })));
  $(".u_user_pass_eye").on("click", function (event) {
    if (event.currentTarget) {
      $(event.currentTarget).children().toggleClass("u_pass_eye_show");
      var passwordInput = document.querySelector("#loginPagepass");
      passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
    }
  });
  $("#cropCanvas").mouseup(function (e) {
    if (isCrop) handleMouseUp(e);
  });
  $("#cropCanvas").mousemove(function (e) {
    if (isCrop) handleMouseMove(e);
  });
  $("#cropCanvas").mousedown(function (e) {
    if (isCrop) handleMouseDown(e);
  });
  $(cropCanvas1).on('wheel', function (event) {
    if (isCrop == false) return;
    var zoom_point = screentoclient(event);
    var zoom_target = {
      x: 0,
      y: 0
    };
    var pos = GetScrollPos();
    // determine the point on where the slide is zoomed in
    zoom_target = clienttodoc(zoom_point);

    // apply zoom
    var wheel = event.wheelDelta / 120; //n or -n

    if (event.wheelDelta == undefined) wheel = event.originalEvent.deltaY;
    var zoom = scale;
    if (wheel > 0) {
      zoom -= increment;
    } else {
      zoom += increment;
    }
    if (zoom < 0.1) zoom = 0.1;
    if (zoom > 20.0) zoom = 20.0;
    scale = zoom;

    // calculate x and y based on zoom
    pos.x = zoom_target.x * scale - zoom_point.x;
    pos.y = zoom_target.y * scale - zoom_point.y;

    // Make sure the slide stays in its container area when zooming out
    SetScrollPos(pos);

    //var cursor_position = doctoclient(zoom_target);
    //cursor_position = clienttoscreen(cursor_position);
  });
  window.addEventListener('resize', function () {
    var wHeight = window.innerHeight;
    var wWidth = window.innerWidth;
    if (wWidth === 1080 && wHeight === 1920) {
      $(".maincropimg").css('height', wHeight - 200 + 'px');
    } else {
      $(".maincropimg").css('height', wHeight - 130 + 'px');
      $("#cropDiv").css('height', wHeight + 'px');
    }
  });
  $('.confirmok').on('click', function () {
    document.getElementById('product_ft').innerHTML = "";
  });
  $('#ProductPtPGForSave').on('change', function (event) {
    $(".ciloader").show();
    var typeGrp = event.currentTarget.value.split("-");
    fabricJsObj.setTypeGroup(Number(typeGrp[0]), Number(typeGrp[1]));
    appendFeatures(event.currentTarget.value);
  });
});

//ManishaD
function controlZoom() {
  metaViewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
}

////////////////////////////////////////////////////////////////
$("#closeapp").on("click", function (event) {
  event.stopPropagation();
  var lossData = " Are you sure you want to Cancel? Changes you made may not be saved";
  showPopup(lossData, "lossData");
});
$("#designExists-yesbtn").on("click", function () {
  $('#save_fabric_loader').css('display', 'block');
  $('#New_loader_css').css('display', 'block');
  uploadDesign();
  hideConfirmPopup();
});
$("body").on("click", "#designExists-nobtn,#lossData-nobtn", function () {
  hideConfirmPopup();
});
$("#lossData-yesbtn").on("click", function () {
  init.close();
  hideConfirmPopup();
  showFilters();
});
$("#applyFilter").on("click", function () {
  applyFilter();
  hideConfirmPopup();
  showFilters();
});
$("#resetFilter").on("click", function () {
  resetFilter();
  hideConfirmPopup();
  showFilters();
});
$("#save-design").on("click", function () {
  OpenSaveDesign();
  hideConfirmPopup();
});
$('.afterUserlogged').on('click', function (event) {
  event.stopPropagation();
  toggleMenu();
});
$(".fback").on('click', function () {
  if (isModified) {
    showPopup("Do you want to apply modification", "applyFilter");
  } else showFilters();
});
$("#user-menu").on("click", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
  var _fabricJsObj2;
  var isLogout;
  return _regeneratorRuntime().wrap(function _callee3$(_context3) {
    while (1) switch (_context3.prev = _context3.next) {
      case 0:
        _context3.next = 2;
        return (_fabricJsObj2 = fabricJsObj) === null || _fabricJsObj2 === void 0 ? void 0 : _fabricJsObj2.logoutUser();
      case 2:
        isLogout = _context3.sent;
        if (isLogout.status == 200) {
          $(".afterUserlogged").hide();
          $(".login-downloadbt").show();
        }
      case 4:
      case "end":
        return _context3.stop();
    }
  }, _callee3);
})));
$("#reset-size").on("click", function () {
  resetWidth(Unit);
  resetHeight(Unit);
});
$("#inputEmail4,#loginPagepass").on("keyup", function (event) {
  if (event.keyCode === 13) $(".login_wrap").click();
});
document.addEventListener('click', function (event) {
  var loginLogutArea = document.getElementById("login_logout");
  var userMenu = document.getElementById("user-menu");
  if (!loginLogutArea.contains(event.target) && !userMenu.contains(event.target)) {
    userMenu.style.display = "none"; // Hide user menu
    loginLogutArea.style.display = "block"; // Show login button
  }
});
if (navigator.userAgent.match(/(iPhone|iPod|iPad)/)) {
  // iOS specific fixes
  // Enforce a minimum font size of 16px on input, textarea, and select to prevent zooming
  var formElements = document.querySelectorAll('input, textarea, select');
  formElements.forEach(function (element) {
    element.style.fontSize = '16px'; // Set font size to 16px to prevent zoom
  });

  // Prevent zoom on input, textarea, and select focus
  formElements.forEach(function (element) {
    element.addEventListener('focus', function () {
      document.body.style.zoom = '1'; // Reset zoom on focus
      // document.body.style.transform = 'scale(1)';
      console.log('1');
    });
    element.addEventListener('blur', function () {
      document.body.style.zoom = '1'; // Reset zoom when element loses focus
      // document.body.style.transform = 'scale(1)'; // Reset scale
      console.log('2');
    });
  });

  // Additional zoom prevention for `absolute` positioned inputs
  //    const absoluteInputs = document.querySelectorAll('input.material_input_box');
  //    absoluteInputs.forEach(function(input) {
  //        input.style.position = 'absolute'; // Ensure position is absolute for proper zoom handling
  //        input.style.touchAction = 'none'; // Prevent touch interactions that might cause zoom
  //        input.style.userSelect = 'none'; // Prevent text selection on touch interactions
  //    });
}
$("#designNameId").on('input', function (event) {
  var desName = event.currentTarget.value;
  var validation = validateDesignName(desName);
  if (!validation.isValid) {
    $(".ciloader").hide();
    $("#fabNameError").text(validation.message).show();
    return;
  } else {
    $("#fabNameError").hide();
  }
});
// Tanmay Added Working :- 28-11-2024
$('.fullviewCloseBtn').on('click', function () {
  $('#scan_popup').removeClass('show');
  $('#scan_popup').css('display', 'none');
});
$('#copyLinkBtn').on('click', function () {
  // console.log('click on copyLinkBtn');
  //         const linkField = $('#copyToLink')[0];
  //         linkField.select();
  //         try {
  //             document.execCommand('copy'); 
  //         } catch (err) {
  //             $('#copyStatus').text('Failed to copy link.');
  //             console.error('Error copying link:', err);
  //         }
  var link = $('#copyToLink').val();
  var $tempInput = $("<textarea> </textarea>");
  $("body").append($tempInput);
  $tempInput.val(link).select();
  $(".copy_notification").show();
  setTimeout(function () {
    $(".copy_notification").hide();
  }, 2000);
  try {
    document.execCommand("copy");
    $tempInput.remove();
  } catch (err) {
    console.error("Unable to copy link:", err);
  }
});
$('#downloadBtn').on('click', function () {
  var canvas = $('#qrCode')[0];
  var link = document.createElement('a');
  link.href = canvas.toDataURL("image/png");
  link.download = "qrcode.png";
  link.click();
});
$("#showQrpopup").on("click", function () {
  hideConfirmPopup(), function () {
    $("#scan_popup").addClass("show"), $("#scan_popup").css("display", "block");
    var canvas = $("#designNameId").val();
    $(".design_name").text(canvas);
    var link = window.orgTypeId.toString(16);
    var userMenu = "".concat(window.domainUrl, "/?k=").concat(link, "&t=").concat(canvas);
    var qr = new (qrious_default())({
      element: document.getElementById('qrCode'),
      value: userMenu,
      size: $('.qr_img').width(),
      level: 'H'
    });
    /* new (saveDesign())({
         element: document.getElementById("qrCode"),
         value: userMenu,
         size: $(".qr_img").width(),
         level: "H"
     }), */
    $("#copyToLink").val(userMenu);
  }();
});
$("#showcurrent_page").on("click", function () {
  hideConfirmPopup();
});
$('#redirectBtn').on('click', function () {
  var link = $('#copyToLink').val();
  window.open(link, '_blank');
});
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(72);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleDomAPI.js
var styleDomAPI = __webpack_require__(825);
var styleDomAPI_default = /*#__PURE__*/__webpack_require__.n(styleDomAPI);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertBySelector.js
var insertBySelector = __webpack_require__(659);
var insertBySelector_default = /*#__PURE__*/__webpack_require__.n(insertBySelector);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
var setAttributesWithoutAttributes = __webpack_require__(56);
var setAttributesWithoutAttributes_default = /*#__PURE__*/__webpack_require__.n(setAttributesWithoutAttributes);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertStyleElement.js
var insertStyleElement = __webpack_require__(540);
var insertStyleElement_default = /*#__PURE__*/__webpack_require__.n(insertStyleElement);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleTagTransform.js
var styleTagTransform = __webpack_require__(113);
var styleTagTransform_default = /*#__PURE__*/__webpack_require__.n(styleTagTransform);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./CropDesign/css/blacktheme.css?v1.1
var blackthemev1 = __webpack_require__(174);
;// CONCATENATED MODULE: ./CropDesign/css/blacktheme.css?v1.1

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());
options.insert = insertBySelector_default().bind(null, "head");
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()(blackthemev1/* default */.A, options);




       /* harmony default export */ const css_blackthemev1 = (blackthemev1/* default */.A && blackthemev1/* default */.A.locals ? blackthemev1/* default */.A.locals : undefined);

// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./CropDesign/css/build.min.css?v1.1
var build_minv1 = __webpack_require__(852);
;// CONCATENATED MODULE: ./CropDesign/css/build.min.css?v1.1

      
      
      
      
      
      
      
      
      

var build_minv1_options = {};

build_minv1_options.styleTagTransform = (styleTagTransform_default());
build_minv1_options.setAttributes = (setAttributesWithoutAttributes_default());
build_minv1_options.insert = insertBySelector_default().bind(null, "head");
build_minv1_options.domAPI = (styleDomAPI_default());
build_minv1_options.insertStyleElement = (insertStyleElement_default());

var build_minv1_update = injectStylesIntoStyleTag_default()(build_minv1/* default */.A, build_minv1_options);




       /* harmony default export */ const css_build_minv1 = (build_minv1/* default */.A && build_minv1/* default */.A.locals ? build_minv1/* default */.A.locals : undefined);

;// CONCATENATED MODULE: ./CropDesign/js/init.js
function init_typeof(o) { "@babel/helpers - typeof"; return init_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, init_typeof(o); }


// import config from '../../config.json' with {type:"json"}
 //with {type:'css'}
 //with {type:'css'}

console.log("Crop design 30-09-2024 v?1.1");
window.canvas = document.getElementById('new');
window.image = document.getElementById('old');
$('.back-icon').attr("src", "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8IS0tIENyZWF0b3I6IENvcmVsRFJBVyBYNiAtLT4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iOC41aW4iIGhlaWdodD0iMTFpbiIgdmVyc2lvbj0iMS4xIiBzdHlsZT0ic2hhcGUtcmVuZGVyaW5nOmdlb21ldHJpY1ByZWNpc2lvbjsgdGV4dC1yZW5kZXJpbmc6Z2VvbWV0cmljUHJlY2lzaW9uOyBpbWFnZS1yZW5kZXJpbmc6b3B0aW1pemVRdWFsaXR5OyBmaWxsLXJ1bGU6ZXZlbm9kZDsgY2xpcC1ydWxlOmV2ZW5vZGQiDQp2aWV3Qm94PSIwIDAgODUwMCAxMTAwMCINCiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+DQogPGRlZnM+DQogIDxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQogICA8IVtDREFUQVsNCiAgICAuZmlsMCB7ZmlsbDojRkVGRUZFfQ0KICAgXV0+DQogIDwvc3R5bGU+DQogPC9kZWZzPg0KIDxnIGlkPSJMYXllcl94MDAyMF8xIj4NCiAgPG1ldGFkYXRhIGlkPSJDb3JlbENvcnBJRF8wQ29yZWwtTGF5ZXIiLz4NCiAgPGcgaWQ9Il80NDUzMzM0MDAiPg0KICAgPGc+DQogICAgPHBhdGggY2xhc3M9ImZpbDAiIGQ9Ik0xOTg5IDQ5MDhjNDIsLTQyIDg4LC03OCAxMzYsLTEwOWwzMjMwIC0zMjMwYzMxNSwtMzE1IDgyNiwtMzE1IDExNDEsMCAzMTUsMzE1IDMxNSw4MjYgMCwxMTQxbC0yNzgyIDI3ODEgMjc5NiAyNzk2YzMxNSwzMTUgMzE1LDgyNiAwLDExNDEgLTE1OCwxNTcgLTM2NCwyMzYgLTU3MSwyMzYgLTIwNiwwIC00MTMsLTc5IC01NzEsLTIzNmwtMzI0NCAtMzI0NGMtNDgsLTMxIC05NCwtNjYgLTEzNiwtMTA5IC0xNjEsLTE2MSAtMjM5LC0zNzMgLTIzNSwtNTg1IC00LC0yMTEgNzQsLTQyNCAyMzUsLTU4NXoiLz4NCiAgIDwvZz4NCiAgPC9nPg0KIDwvZz4NCjwvc3ZnPg0K");
$('.next-icon').attr("src", "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8IS0tIENyZWF0b3I6IENvcmVsRFJBVyBYNiAtLT4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iOC41aW4iIGhlaWdodD0iMTFpbiIgdmVyc2lvbj0iMS4xIiBzdHlsZT0ic2hhcGUtcmVuZGVyaW5nOmdlb21ldHJpY1ByZWNpc2lvbjsgdGV4dC1yZW5kZXJpbmc6Z2VvbWV0cmljUHJlY2lzaW9uOyBpbWFnZS1yZW5kZXJpbmc6b3B0aW1pemVRdWFsaXR5OyBmaWxsLXJ1bGU6ZXZlbm9kZDsgY2xpcC1ydWxlOmV2ZW5vZGQiDQp2aWV3Qm94PSIwIDAgODUwMCAxMTAwMCINCiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+DQogPGRlZnM+DQogIDxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQogICA8IVtDREFUQVsNCiAgICAuZmlsMCB7ZmlsbDojRkVGRUZFfQ0KICAgXV0+DQogIDwvc3R5bGU+DQogPC9kZWZzPg0KIDxnIGlkPSJMYXllcl94MDAyMF8xIj4NCiAgPG1ldGFkYXRhIGlkPSJDb3JlbENvcnBJRF8wQ29yZWwtTGF5ZXIiLz4NCiAgPGcgaWQ9Il80NDU0NTM4MjQiPg0KICAgPGc+DQogICAgPHBhdGggY2xhc3M9ImZpbDAiIGQ9Ik02NTExIDQ5MDhjLTQyLC00MiAtODgsLTc4IC0xMzYsLTEwOWwtMzIzMCAtMzIzMGMtMzE1LC0zMTUgLTgyNiwtMzE1IC0xMTQxLDAgLTMxNSwzMTUgLTMxNSw4MjYgMCwxMTQxbDI3ODIgMjc4MSAtMjc5NiAyNzk2Yy0zMTUsMzE1IC0zMTUsODI2IDAsMTE0MSAxNTgsMTU3IDM2NCwyMzYgNTcxLDIzNiAyMDYsMCA0MTMsLTc5IDU3MSwtMjM2bDMyNDQgLTMyNDRjNDgsLTMxIDk0LC02NiAxMzYsLTEwOSAxNjEsLTE2MSAyMzksLTM3MyAyMzUsLTU4NSA0LC0yMTEgLTc0LC00MjQgLTIzNSwtNTg1eiIvPg0KICAgPC9nPg0KICA8L2c+DQogPC9nPg0KPC9zdmc+DQo=");
$('.gallery').attr("src", "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8IS0tIENyZWF0b3I6IENvcmVsRFJBVyBYNiAtLT4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iOC41aW4iIGhlaWdodD0iMTFpbiIgdmVyc2lvbj0iMS4xIiBzdHlsZT0ic2hhcGUtcmVuZGVyaW5nOmdlb21ldHJpY1ByZWNpc2lvbjsgdGV4dC1yZW5kZXJpbmc6Z2VvbWV0cmljUHJlY2lzaW9uOyBpbWFnZS1yZW5kZXJpbmc6b3B0aW1pemVRdWFsaXR5OyBmaWxsLXJ1bGU6ZXZlbm9kZDsgY2xpcC1ydWxlOmV2ZW5vZGQiDQp2aWV3Qm94PSIwIDAgODUwMCAxMTAwMCINCiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayINCiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA5MiA5MiI+DQogPGRlZnM+DQogIDxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQogICA8IVtDREFUQVsNCiAgICAuZmlsMCB7ZmlsbDojRkVGRUZFfQ0KICAgXV0+DQogIDwvc3R5bGU+DQogPC9kZWZzPg0KIDxnIGlkPSJMYXllcl94MDAyMF8xIj4NCiAgPG1ldGFkYXRhIGlkPSJDb3JlbENvcnBJRF8wQ29yZWwtTGF5ZXIiLz4NCiAgPGcgaWQ9Il80NDY2MTM5NTIiPg0KICAgPHBhdGggaWQ9IlhNTElEXzEzNDZfIiBjbGFzcz0iZmlsMCIgZD0iTTgxNDUgNjY1OWwwIDI0NjRjMCwyNTQgLTE5OSw0NTMgLTQ1Myw0NTNsLTY4ODQgMGMtMjU0LDAgLTQ1MywtMTk5IC00NTMsLTQ1M2wwIC0yNDY0YzAsLTI1NCAxOTksLTQ1MyA0NTMsLTQ1MyAyNTQsMCA0NTMsMTk5IDQ1Myw0NTNsMCAyMDExIDU5NzggMCAwIC0yMDExYzAsLTI1NCAxOTksLTQ1MyA0NTMsLTQ1MyAyNTQsMCA0NTMsMTk5IDQ1Myw0NTN6bS01MzgwIC0yNjE4bDEwMzMgLTEwNjAgMCAzOTIyYzAsMjU0IDE5OSw0NTMgNDUzLDQ1MyAyNTQsMCA0NTMsLTE5OSA0NTMsLTQ1M2wwIC0zOTEzIDEwMzMgMTA1MWM5MSw5MSAyMDgsMTM2IDMyNiwxMzYgMTE4LDAgMjI2LC00NSAzMTcsLTEyNyAxODEsLTE3MiAxODEsLTQ2MiA5LC02NDNsLTE4MTIgLTE4NDhjLTkxLC05MSAtMjA4LC0xMzYgLTMyNiwtMTM2IC0xMTgsMCAtMjM2LDQ1IC0zMjYsMTM2bC0xODAzIDE4NDhjLTE3MiwxODEgLTE3Miw0NjIgOSw2NDMgMTcyLDE3MiA0NjIsMTYzIDYzNCwtOXoiLz4NCiAgPC9nPg0KIDwvZz4NCjwvc3ZnPg0K");
$('.refreshbtn').attr("src", "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8IS0tIENyZWF0b3I6IENvcmVsRFJBVyBYNiAtLT4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iOC41aW4iIGhlaWdodD0iMTFpbiIgdmVyc2lvbj0iMS4xIiBzdHlsZT0ic2hhcGUtcmVuZGVyaW5nOmdlb21ldHJpY1ByZWNpc2lvbjsgdGV4dC1yZW5kZXJpbmc6Z2VvbWV0cmljUHJlY2lzaW9uOyBpbWFnZS1yZW5kZXJpbmc6b3B0aW1pemVRdWFsaXR5OyBmaWxsLXJ1bGU6ZXZlbm9kZDsgY2xpcC1ydWxlOmV2ZW5vZGQiDQp2aWV3Qm94PSIwIDAgODUwMCAxMTAwMCINCiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+DQogPGRlZnM+DQogIDxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQogICA8IVtDREFUQVsNCiAgICAuc3RyMCB7c3Ryb2tlOiNGRUZFRkU7c3Ryb2tlLXdpZHRoOjY5NC40NDU7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kfQ0KICAgIC5maWwwIHtmaWxsOm5vbmV9DQogICBdXT4NCiAgPC9zdHlsZT4NCiA8L2RlZnM+DQogPGcgaWQ9IkxheWVyX3gwMDIwXzEiPg0KICA8bWV0YWRhdGEgaWQ9IkNvcmVsQ29ycElEXzBDb3JlbC1MYXllciIvPg0KICA8cGF0aCBjbGFzcz0iZmlsMCBzdHIwIiBkPSJNNDI1MCA4OTY2Yy0xOTg2LDAgLTM1OTYsLTE1NTIgLTM1OTYsLTM0NjYgMCwtODg4IDM0NiwtMTY5NyA5MTYsLTIzMTBsMTA4MiAtMTE1NW0xNTk4IDBjMTk4NiwwIDM1OTYsMTU1MiAzNTk2LDM0NjYgMCw4ODggLTM0NiwxNjk3IC05MTYsMjMxMGwtMTA4MiAxMTU1bS01MTk0IC02OTMxbDE5OTggMG0wIDBsMCAxOTI1bTUxOTQgNTAwNmwtMTk5OCAwbTAgMGwwIC0xOTI1Ii8+DQogPC9nPg0KPC9zdmc+DQo=");
$('.rgbimg').attr("src", "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8IS0tIENyZWF0b3I6IENvcmVsRFJBVyBYNiAtLT4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iOC41aW4iIGhlaWdodD0iMTFpbiIgdmVyc2lvbj0iMS4xIiBzdHlsZT0ic2hhcGUtcmVuZGVyaW5nOmdlb21ldHJpY1ByZWNpc2lvbjsgdGV4dC1yZW5kZXJpbmc6Z2VvbWV0cmljUHJlY2lzaW9uOyBpbWFnZS1yZW5kZXJpbmc6b3B0aW1pemVRdWFsaXR5OyBmaWxsLXJ1bGU6ZXZlbm9kZDsgY2xpcC1ydWxlOmV2ZW5vZGQiDQp2aWV3Qm94PSIwIDAgODUwMCAxMTAwMCINCiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+DQogPGRlZnM+DQogIDxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQogICA8IVtDREFUQVsNCiAgICAuZmlsMCB7ZmlsbDojRkVGRUZFfQ0KICAgXV0+DQogIDwvc3R5bGU+DQogPC9kZWZzPg0KIDxnIGlkPSJMYXllcl94MDAyMF8xIj4NCiAgPG1ldGFkYXRhIGlkPSJDb3JlbENvcnBJRF8wQ29yZWwtTGF5ZXIiLz4NCiAgPGcgaWQ9Il8yNjA5ODM0MTYiPg0KICAgPGc+DQogICAgPGc+DQogICAgIDxwYXRoIGNsYXNzPSJmaWwwIiBkPSJNMzE1MyA0ODk4Yy0yMjgsMTE1IC00MzksMjY4IC02MjUsNDU0IC0yNzQsMjc1IC00NzUsNjAzIC01OTIsOTYyIDE2MSwzNCAzMjcsNTIgNDk3LDUyIDIxMiwwIDQyNSwtMjggNjMyLC04NCAyNTcsLTY5IDQ5MywtMTc3IDcwNCwtMzE1IC0yNzUsLTMxMSAtNDg1LC02NzQgLTYxNiwtMTA2N3oiLz4NCiAgICA8L2c+DQogICA8L2c+DQogICA8Zz4NCiAgICA8Zz4NCiAgICAgPHBhdGggY2xhc3M9ImZpbDAiIGQ9Ik01OTcxIDUzNTBjLTE4NiwtMTg2IC0zOTcsLTMzOCAtNjI1LC00NTMgLTEzMSwzOTMgLTM0MSw3NTcgLTYxNiwxMDY4IDIxMSwxMzkgNDQ3LDI0NiA3MDQsMzE1IDIwNyw1NSA0MTksODMgNjMxLDgzIDE3MCwwIDMzNywtMTggNDk4LC01MiAtMTE3LC0zNTggLTMxOCwtNjg3IC01OTMsLTk2MXoiLz4NCiAgICA8L2c+DQogICA8L2c+DQogICA8Zz4NCiAgICA8Zz4NCiAgICAgPHBhdGggY2xhc3M9ImZpbDAiIGQ9Ik00MjUxIDQ2MzhjLTE2OSwwIC0zMzYsMTcgLTQ5OCw1MSAxMDUsMzE4IDI3NSw2MTIgNDk3LDg2MSAyMjMsLTI1MCAzOTIsLTU0NCA0OTcsLTg2MiAtMTYyLC0zMyAtMzI4LC01MSAtNDk2LC01MXoiLz4NCiAgICA8L2c+DQogICA8L2c+DQogICA8Zz4NCiAgICA8Zz4NCiAgICAgPHBhdGggY2xhc3M9ImZpbDAiIGQ9Ik00Nzg2IDMyOTljLTEwMSwtMzc3IC0yODksLTcxNCAtNTM3LC05OTEgLTI0OCwyNzggLTQzNSw2MTQgLTUzNiw5OTIgLTY5LDI1NiAtOTMsNTE0IC03OSw3NjYgMjAxLC00MSA0MDcsLTYyIDYxNywtNjIgMjA5LDAgNDE1LDIxIDYxNSw2MSAxNCwtMjUyIC0xMSwtNTA5IC03OSwtNzY2eiIvPg0KICAgIDwvZz4NCiAgIDwvZz4NCiAgIDxnPg0KICAgIDxnPg0KICAgICA8cGF0aCBjbGFzcz0iZmlsMCIgZD0iTTgxNzIgMjcxMGMtMzI1LC01NjMgLTg1MCwtOTY2IC0xNDc5LC0xMTM0IC0yMDcsLTU1IC00MTksLTgzIC02MzEsLTgzIC00ODYsMCAtOTQ2LDE0NSAtMTMzMywzOTkgMzA5LDM0OCA1NDMsNzcwIDY2OSwxMjQyIDEwMSwzNzggMTI3LDc1OSA4NywxMTI3IDM0NCwxNTEgNjYwLDM2NyA5MzQsNjQwIDM0MywzNDMgNTk1LDc1MiA3NDMsMTE5OSA2MDMsLTMwNiAxMDY5LC04NTcgMTI1MywtMTU0MiAxNjgsLTYyOCA4MiwtMTI4NCAtMjQ0LC0xODQ3eiIvPg0KICAgIDwvZz4NCiAgIDwvZz4NCiAgIDxnPg0KICAgIDxnPg0KICAgICA8cGF0aCBjbGFzcz0iZmlsMCIgZD0iTTY2ODEgNjkzNmMtMjAwLDQxIC00MDUsNjMgLTYxNSw2MyAtMjY3LDAgLTUzNSwtMzUgLTc5NSwtMTA1IC0zNzksLTEwMSAtNzIyLC0yNzAgLTEwMjEsLTQ4OSAtMjk4LDIxOSAtNjQyLDM4OCAtMTAyMCw0OTAgLTI2MSw3MCAtNTI5LDEwNiAtNzk3LDEwNiAtMjA5LDAgLTQxNCwtMjEgLTYxMywtNjIgLTIsNDUgLTQsOTAgLTQsMTM2IDAsNjUwIDI1NCwxMjYyIDcxNCwxNzIxIDQ2MCw0NTkgMTA3MSw3MTMgMTcyMSw3MTMgNjUxLDAgMTI2MiwtMjUzIDE3MjIsLTcxNCA0NjAsLTQ2MCA3MTMsLTEwNzEgNzEzLC0xNzIyIDAsLTQ1IC0xLC05MSAtNCwtMTM2eiIvPg0KICAgIDwvZz4NCiAgIDwvZz4NCiAgIDxnPg0KICAgIDxnPg0KICAgICA8cGF0aCBjbGFzcz0iZmlsMCIgZD0iTTM3NjggMTg5M2MtMzg2LC0yNTMgLTg0NiwtMzk5IC0xMzMxLC0zOTkgLTIxMiwwIC00MjUsMjggLTYzMiw4NCAtMTI5NywzNDggLTIwNjgsMTY4NiAtMTcyMSwyOTgyIDE4NCw2ODUgNjUxLDEyMzYgMTI1MywxNTQyIDE0OCwtNDQ3IDQwMCwtODU3IDc0MywtMTE5OSAyNzQsLTI3NCA1OTAsLTQ4OSA5MzQsLTY0MSAtNDEsLTM2OCAtMTUsLTc0OSA4NiwtMTEyNyAxMjYsLTQ3MiAzNTksLTg5NCA2NjgsLTEyNDJ6Ii8+DQogICAgPC9nPg0KICAgPC9nPg0KICA8L2c+DQogPC9nPg0KPC9zdmc+DQo=");
$('.brightness').attr("src", "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8IS0tIENyZWF0b3I6IENvcmVsRFJBVyBYNiAtLT4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iOC41aW4iIGhlaWdodD0iMTFpbiIgdmVyc2lvbj0iMS4xIiBzdHlsZT0ic2hhcGUtcmVuZGVyaW5nOmdlb21ldHJpY1ByZWNpc2lvbjsgdGV4dC1yZW5kZXJpbmc6Z2VvbWV0cmljUHJlY2lzaW9uOyBpbWFnZS1yZW5kZXJpbmc6b3B0aW1pemVRdWFsaXR5OyBmaWxsLXJ1bGU6ZXZlbm9kZDsgY2xpcC1ydWxlOmV2ZW5vZGQiDQp2aWV3Qm94PSIwIDAgODUwMCAxMTAwMCINCiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+DQogPGRlZnM+DQogIDxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQogICA8IVtDREFUQVsNCiAgICAuZmlsMCB7ZmlsbDojRkVGRUZFfQ0KICAgXV0+DQogIDwvc3R5bGU+DQogPC9kZWZzPg0KIDxnIGlkPSJMYXllcl94MDAyMF8xIj4NCiAgPG1ldGFkYXRhIGlkPSJDb3JlbENvcnBJRF8wQ29yZWwtTGF5ZXIiLz4NCiAgPGcgaWQ9Il80NDU0NTIyMTYiPg0KICAgPGc+DQogICAgPHJlY3QgY2xhc3M9ImZpbDAiIHg9IjM5OTIiIHk9IjEyNTAiIHdpZHRoPSI1MTYiIGhlaWdodD0iMTIwMCIvPg0KICAgIDxyZWN0IGNsYXNzPSJmaWwwIiB4PSIzOTkyIiB5PSI4NTUwIiB3aWR0aD0iNTE2IiBoZWlnaHQ9IjEyMDAiLz4NCiAgICA8cmVjdCBjbGFzcz0iZmlsMCIgdHJhbnNmb3JtPSJtYXRyaXgoMC41ODc4IDAuODA5IC0wLjgwOSAwLjU4NzggMTk2MC42MyAxOTEwLjA0KSIgd2lkdGg9IjEyMDAiIGhlaWdodD0iNTE2Ii8+DQogICAgPHBvbHlnb24gY2xhc3M9ImZpbDAiIHBvaW50cz0iNTgzNCw4MTE5IDY1MzksOTA5MCA2OTU3LDg3ODcgNjI1MSw3ODE2ICIvPg0KICAgIDxwb2x5Z29uIGNsYXNzPSJmaWwwIiBwb2ludHM9IjEyOCw0NDMyIDEyNjksNDgwMyAxNDI5LDQzMTIgMjg4LDM5NDEgIi8+DQogICAgPHJlY3QgY2xhc3M9ImZpbDAiIHRyYW5zZm9ybT0ibWF0cml4KC0wLjk1MTEgLTAuMzA4OSAwLjMwODkgLTAuOTUxMSA4MjExLjk5IDcwNTkuMDUpIiB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI1MTYiLz4NCiAgICA8cG9seWdvbiBjbGFzcz0iZmlsMCIgcG9pbnRzPSIxMjgsNjU2OCAyODgsNzA1OSAxNDI5LDY2ODggMTI2OSw2MTk3ICIvPg0KICAgIDxwb2x5Z29uIGNsYXNzPSJmaWwwIiBwb2ludHM9IjgzNzIsNDQzMiA4MjEyLDM5NDEgNzA3MSw0MzEyIDcyMzEsNDgwMyAiLz4NCiAgICA8cG9seWdvbiBjbGFzcz0iZmlsMCIgcG9pbnRzPSIxNTQzLDg3ODcgMTk2MSw5MDkwIDI2NjYsODExOSAyMjQ5LDc4MTYgIi8+DQogICAgPHBvbHlnb24gY2xhc3M9ImZpbDAiIHBvaW50cz0iNTgzNCwyODgxIDYyNTIsMzE4NCA2OTU3LDIyMTQgNjUzOSwxOTEwICIvPg0KICAgIDxwYXRoIGNsYXNzPSJmaWwwIiBkPSJNMTc3MiA1NTAwYzAsMTM2OSAxMTA5LDI0NzcgMjQ3OCwyNDc4IDEzNjksMCAyNDc4LC0xMTA5IDI0NzgsLTI0NzggMCwtMTM2OSAtMTEwOSwtMjQ3NyAtMjQ3OCwtMjQ3OCAtMTM2OSwwIC0yNDc3LDExMDkgLTI0NzgsMjQ3OHptMjUyOSAtMTk1OWM1MjIsMTQgOTkxLDIyOCAxMzM1LDU3MiAzNTYsMzU1IDU3NSw4NDQgNTc1LDEzODcgMCw1NDMgLTIxOSwxMDMxIC01NzUsMTM4NyAtMzQ0LDM0NCAtODE0LDU1OCAtMTMzNSw1NzJsMCAtMzkxOHoiLz4NCiAgIDwvZz4NCiAgPC9nPg0KIDwvZz4NCjwvc3ZnPg0K");
$('.contrast').attr("src", "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8IS0tIENyZWF0b3I6IENvcmVsRFJBVyBYNiAtLT4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iOC41aW4iIGhlaWdodD0iMTFpbiIgdmVyc2lvbj0iMS4xIiBzdHlsZT0ic2hhcGUtcmVuZGVyaW5nOmdlb21ldHJpY1ByZWNpc2lvbjsgdGV4dC1yZW5kZXJpbmc6Z2VvbWV0cmljUHJlY2lzaW9uOyBpbWFnZS1yZW5kZXJpbmc6b3B0aW1pemVRdWFsaXR5OyBmaWxsLXJ1bGU6ZXZlbm9kZDsgY2xpcC1ydWxlOmV2ZW5vZGQiDQp2aWV3Qm94PSIwIDAgODUwMCAxMTAwMCINCiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+DQogPGRlZnM+DQogIDxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQogICA8IVtDREFUQVsNCiAgICAuZmlsMCB7ZmlsbDojRkVGRUZFfQ0KICAgXV0+DQogIDwvc3R5bGU+DQogPC9kZWZzPg0KIDxnIGlkPSJMYXllcl94MDAyMF8xIj4NCiAgPG1ldGFkYXRhIGlkPSJDb3JlbENvcnBJRF8wQ29yZWwtTGF5ZXIiLz4NCiAgPGcgaWQ9Il80NDYwMjcwMDAiPg0KICAgPGcgaWQ9IlBhZ2UtMSI+DQogICAgPGcgaWQ9IkRyaWJiYmxlLUxpZ2h0LVByZXZpZXciPg0KICAgICA8ZyBpZD0iaWNvbnMiPg0KICAgICAgPHBhdGggaWQ9ImNvbnRyYXN0LV94MDA1Yl9feDAwMjNfOTA3X3gwMDVkXyIgY2xhc3M9ImZpbDAiIGQ9Ik05MTcgNTUwMGMwLC0xODM4IDE0OTUsLTMzMzMgMzMzMywtMzMzM2wwIDY2NjdjLTE4MzgsMCAtMzMzMywtMTQ5NSAtMzMzMywtMzMzM20zMzMzIC00MTY3Yy0yMzAxLDAgLTQxNjcsMTg2NSAtNDE2Nyw0MTY3IDAsMjMwMSAxODY1LDQxNjcgNDE2Nyw0MTY3IDIzMDEsMCA0MTY3LC0xODY1IDQxNjcsLTQxNjcgMCwtMjMwMSAtMTg2NSwtNDE2NyAtNDE2NywtNDE2N3oiLz4NCiAgICAgPC9nPg0KICAgIDwvZz4NCiAgIDwvZz4NCiAgPC9nPg0KIDwvZz4NCjwvc3ZnPg0K");
$('.saturation').attr("src", "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8IS0tIENyZWF0b3I6IENvcmVsRFJBVyBYNiAtLT4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iOC41aW4iIGhlaWdodD0iMTFpbiIgdmVyc2lvbj0iMS4xIiBzdHlsZT0ic2hhcGUtcmVuZGVyaW5nOmdlb21ldHJpY1ByZWNpc2lvbjsgdGV4dC1yZW5kZXJpbmc6Z2VvbWV0cmljUHJlY2lzaW9uOyBpbWFnZS1yZW5kZXJpbmc6b3B0aW1pemVRdWFsaXR5OyBmaWxsLXJ1bGU6ZXZlbm9kZDsgY2xpcC1ydWxlOmV2ZW5vZGQiDQp2aWV3Qm94PSIwIDAgODUwMCAxMTAwMCINCiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+DQogPGRlZnM+DQogIDxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQogICA8IVtDREFUQVsNCiAgICAuZmlsMCB7ZmlsbDojRkVGRUZFfQ0KICAgXV0+DQogIDwvc3R5bGU+DQogPC9kZWZzPg0KIDxnIGlkPSJMYXllcl94MDAyMF8xIj4NCiAgPG1ldGFkYXRhIGlkPSJDb3JlbENvcnBJRF8wQ29yZWwtTGF5ZXIiLz4NCiAgPHBhdGggY2xhc3M9ImZpbDAiIGQ9Ik00MjQ4IDEyMDh6bTAgODU4M2MtMTk4MSwtMiAtMzYwNywtMTYyMCAtMzY4NSwtMzY2NCA2MDYsNTE5IDEzNjgsODAzIDIxNTYsODAzIDE4NjQsMCAzMzc2LC0xNTYyIDMzNzYsLTM0ODggMCwtMyAwLC02IDAsLTkgMCwtMjc0IC0zMywtNTQ4IC05NiwtODE1IDExOTUsNjY2IDE5MzksMTk1NSAxOTM5LDMzNTcgMCwyMTA2IC0xNjUyLDM4MTQgLTM2OTAsMzgxNWwwIDB6Ii8+DQogPC9nPg0KPC9zdmc+DQo=");
$('.sharpen').attr("src", "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8IS0tIENyZWF0b3I6IENvcmVsRFJBVyBYNiAtLT4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iOC41aW4iIGhlaWdodD0iMTFpbiIgdmVyc2lvbj0iMS4xIiBzdHlsZT0ic2hhcGUtcmVuZGVyaW5nOmdlb21ldHJpY1ByZWNpc2lvbjsgdGV4dC1yZW5kZXJpbmc6Z2VvbWV0cmljUHJlY2lzaW9uOyBpbWFnZS1yZW5kZXJpbmc6b3B0aW1pemVRdWFsaXR5OyBmaWxsLXJ1bGU6ZXZlbm9kZDsgY2xpcC1ydWxlOmV2ZW5vZGQiDQp2aWV3Qm94PSIwIDAgODUwMCAxMTAwMCINCiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+DQogPGRlZnM+DQogIDxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQogICA8IVtDREFUQVsNCiAgICAuZmlsMCB7ZmlsbDojRkVGRUZFfQ0KICAgXV0+DQogIDwvc3R5bGU+DQogPC9kZWZzPg0KIDxnIGlkPSJMYXllcl94MDAyMF8xIj4NCiAgPG1ldGFkYXRhIGlkPSJDb3JlbENvcnBJRF8wQ29yZWwtTGF5ZXIiLz4NCiAgPHBhdGggY2xhc3M9ImZpbDAiIGQ9Ik00MTg2IDg1ODdjMTI1LDE5MyAzMjIsMTkxIDQ0MiwtOWwzNTcxIC01OTUwYzExOSwtMTk4IDI1LC0zNTggLTE5OCwtMzU4bC03NTA3IDBjLTIyOCwwIC0zMTAsMTU4IC0xODYsMzQ5bDM4NzkgNTk2OXptMjI3IC00ODRsMzE2OCAtNTQxNyAtNjY2NyAwIDM0OTkgNTQxN3ptMCAtODMzbDAgLTQxNjcgLTI2NjYgMCAyNjY2IDQxNjd6Ii8+DQogPC9nPg0KPC9zdmc+DQo=");
$('.previmg').attr("src", "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8IS0tIENyZWF0b3I6IENvcmVsRFJBVyBYNiAtLT4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iOC41aW4iIGhlaWdodD0iMTFpbiIgdmVyc2lvbj0iMS4xIiBzdHlsZT0ic2hhcGUtcmVuZGVyaW5nOmdlb21ldHJpY1ByZWNpc2lvbjsgdGV4dC1yZW5kZXJpbmc6Z2VvbWV0cmljUHJlY2lzaW9uOyBpbWFnZS1yZW5kZXJpbmc6b3B0aW1pemVRdWFsaXR5OyBmaWxsLXJ1bGU6ZXZlbm9kZDsgY2xpcC1ydWxlOmV2ZW5vZGQiDQp2aWV3Qm94PSIwIDAgODUwMCAxMTAwMCINCiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+DQogPGRlZnM+DQogIDxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQogICA8IVtDREFUQVsNCiAgICAuZmlsMCB7ZmlsbDojRkVGRUZFfQ0KICAgXV0+DQogIDwvc3R5bGU+DQogPC9kZWZzPg0KIDxnIGlkPSJMYXllcl94MDAyMF8xIj4NCiAgPG1ldGFkYXRhIGlkPSJDb3JlbENvcnBJRF8wQ29yZWwtTGF5ZXIiLz4NCiAgPGcgaWQ9Il80NDUzMzM0MDAiPg0KICAgPGc+DQogICAgPHBhdGggY2xhc3M9ImZpbDAiIGQ9Ik0xOTg5IDQ5MDhjNDIsLTQyIDg4LC03OCAxMzYsLTEwOWwzMjMwIC0zMjMwYzMxNSwtMzE1IDgyNiwtMzE1IDExNDEsMCAzMTUsMzE1IDMxNSw4MjYgMCwxMTQxbC0yNzgyIDI3ODEgMjc5NiAyNzk2YzMxNSwzMTUgMzE1LDgyNiAwLDExNDEgLTE1OCwxNTcgLTM2NCwyMzYgLTU3MSwyMzYgLTIwNiwwIC00MTMsLTc5IC01NzEsLTIzNmwtMzI0NCAtMzI0NGMtNDgsLTMxIC05NCwtNjYgLTEzNiwtMTA5IC0xNjEsLTE2MSAtMjM5LC0zNzMgLTIzNSwtNTg1IC00LC0yMTEgNzQsLTQyNCAyMzUsLTU4NXoiLz4NCiAgIDwvZz4NCiAgPC9nPg0KIDwvZz4NCjwvc3ZnPg0K");
$('.nextimg').attr("src", "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8IS0tIENyZWF0b3I6IENvcmVsRFJBVyBYNiAtLT4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iOC41aW4iIGhlaWdodD0iMTFpbiIgdmVyc2lvbj0iMS4xIiBzdHlsZT0ic2hhcGUtcmVuZGVyaW5nOmdlb21ldHJpY1ByZWNpc2lvbjsgdGV4dC1yZW5kZXJpbmc6Z2VvbWV0cmljUHJlY2lzaW9uOyBpbWFnZS1yZW5kZXJpbmc6b3B0aW1pemVRdWFsaXR5OyBmaWxsLXJ1bGU6ZXZlbm9kZDsgY2xpcC1ydWxlOmV2ZW5vZGQiDQp2aWV3Qm94PSIwIDAgODUwMCAxMTAwMCINCiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+DQogPGRlZnM+DQogIDxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQogICA8IVtDREFUQVsNCiAgICAuZmlsMCB7ZmlsbDojRkVGRUZFfQ0KICAgXV0+DQogIDwvc3R5bGU+DQogPC9kZWZzPg0KIDxnIGlkPSJMYXllcl94MDAyMF8xIj4NCiAgPG1ldGFkYXRhIGlkPSJDb3JlbENvcnBJRF8wQ29yZWwtTGF5ZXIiLz4NCiAgPGcgaWQ9Il80NDU0NTM4MjQiPg0KICAgPGc+DQogICAgPHBhdGggY2xhc3M9ImZpbDAiIGQ9Ik02NTExIDQ5MDhjLTQyLC00MiAtODgsLTc4IC0xMzYsLTEwOWwtMzIzMCAtMzIzMGMtMzE1LC0zMTUgLTgyNiwtMzE1IC0xMTQxLDAgLTMxNSwzMTUgLTMxNSw4MjYgMCwxMTQxbDI3ODIgMjc4MSAtMjc5NiAyNzk2Yy0zMTUsMzE1IC0zMTUsODI2IDAsMTE0MSAxNTgsMTU3IDM2NCwyMzYgNTcxLDIzNiAyMDYsMCA0MTMsLTc5IDU3MSwtMjM2bDMyNDQgLTMyNDRjNDgsLTMxIDk0LC02NiAxMzYsLTEwOSAxNjEsLTE2MSAyMzksLTM3MyAyMzUsLTU4NSA0LC0yMTEgLTc0LC00MjQgLTIzNSwtNTg1eiIvPg0KICAgPC9nPg0KICA8L2c+DQogPC9nPg0KPC9zdmc+DQo=");
$('.newcropimg').attr("src", "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8IS0tIENyZWF0b3I6IENvcmVsRFJBVyBYNiAtLT4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iOC41aW4iIGhlaWdodD0iMTFpbiIgdmVyc2lvbj0iMS4xIiBzdHlsZT0ic2hhcGUtcmVuZGVyaW5nOmdlb21ldHJpY1ByZWNpc2lvbjsgdGV4dC1yZW5kZXJpbmc6Z2VvbWV0cmljUHJlY2lzaW9uOyBpbWFnZS1yZW5kZXJpbmc6b3B0aW1pemVRdWFsaXR5OyBmaWxsLXJ1bGU6ZXZlbm9kZDsgY2xpcC1ydWxlOmV2ZW5vZGQiDQp2aWV3Qm94PSIwIDAgODUwMCAxMTAwMCINCiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayINCiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyI+DQogPGRlZnM+DQogIDxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQogICA8IVtDREFUQVsNCiAgICAuZmlsMCB7ZmlsbDojRkVGRUZFfQ0KICAgXV0+DQogIDwvc3R5bGU+DQogPC9kZWZzPg0KIDxnIGlkPSJMYXllcl94MDAyMF8xIj4NCiAgPG1ldGFkYXRhIGlkPSJDb3JlbENvcnBJRF8wQ29yZWwtTGF5ZXIiLz4NCiAgPGcgaWQ9IlBhZ2UtMSIgc2tldGNoOnR5cGU9Ik1TUGFnZSI+DQogICA8ZyBpZD0iSWNvbi1TZXQtRmlsbGVkIiBza2V0Y2g6dHlwZT0iTVNMYXllckdyb3VwIj4NCiAgICA8cGF0aCBpZD0iY3JvcCIgY2xhc3M9ImZpbDAiIGQ9Ik03ODk2IDc1ODNsLTUyMSAwIDAgLTM5MDYgLTEwNDIgMTA0MiAwIDI4NjUgLTM2NDYgMCA1MDAzIC01NDE2IC0zNjggLTM2OCAtNTE1NiA1NTI0IDAgLTM5MDYgMjYwNCAwIDEwMDUgLTEwNDIgLTM2MTAgMCAwIC01MjFjMCwtMjg4IC0yMzMsLTUyMSAtNTIxLC01MjEgLTI4NywwIC01MjEsMjMzIC01MjEsNTIxbDAgNTIxIC01MjEgMGMtMjg4LDAgLTUyMSwyMzMgLTUyMSw1MjEgMCwyODggMjMzLDUyMSA1MjEsNTIxbDUyMSAwIDAgNTIwOCA1MjA4IDAgMCA1MjFjMCwyODggMjMzLDUyMSA1MjEsNTIxIDI4NywwIDUyMSwtMjMzIDUyMSwtNTIxbDAgLTUyMSA1MjEgMGMyODgsMCA1MjEsLTIzMyA1MjEsLTUyMSAwLC0yODggLTIzMywtNTIxIC01MjEsLTUyMXoiIHNrZXRjaDp0eXBlPSJNU1NoYXBlR3JvdXAiLz4NCiAgIDwvZz4NCiAgPC9nPg0KIDwvZz4NCjwvc3ZnPg0K");
$('.rotationimg').attr("src", "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8IS0tIENyZWF0b3I6IENvcmVsRFJBVyBYNiAtLT4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iOC41aW4iIGhlaWdodD0iMTFpbiIgdmVyc2lvbj0iMS4xIiBzdHlsZT0ic2hhcGUtcmVuZGVyaW5nOmdlb21ldHJpY1ByZWNpc2lvbjsgdGV4dC1yZW5kZXJpbmc6Z2VvbWV0cmljUHJlY2lzaW9uOyBpbWFnZS1yZW5kZXJpbmc6b3B0aW1pemVRdWFsaXR5OyBmaWxsLXJ1bGU6ZXZlbm9kZDsgY2xpcC1ydWxlOmV2ZW5vZGQiDQp2aWV3Qm94PSIwIDAgODUwMCAxMTAwMCINCiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+DQogPGRlZnM+DQogIDxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQogICA8IVtDREFUQVsNCiAgICAuZmlsMCB7ZmlsbDpub25lfQ0KICAgIC5maWwxIHtmaWxsOiNGRUZFRkV9DQogICBdXT4NCiAgPC9zdHlsZT4NCiA8L2RlZnM+DQogPGcgaWQ9IkxheWVyX3gwMDIwXzEiPg0KICA8bWV0YWRhdGEgaWQ9IkNvcmVsQ29ycElEXzBDb3JlbC1MYXllciIvPg0KICA8cmVjdCBjbGFzcz0iZmlsMCIgd2lkdGg9Ijg1MDAiIGhlaWdodD0iMTEwMDAiLz4NCiAgPHBhdGggY2xhc3M9ImZpbDEiIGQ9Ik0xMTg4IDcxOWMyOTMsMTEgNTIyLDI1NyA1MTEsNTUxbC01MiAxNDAxYzcxOSwtNTU3IDE2MjIsLTg5MCAyNjAyLC04OTAgMjM0NywwIDQyNTAsMTkwMyA0MjUwLDQyNTAgMCwyMzQ3IC0xOTAzLDQyNTAgLTQyNTAsNDI1MCAtMjM0NywwIC00MjUwLC0xOTAzIC00MjUwLC00MjUwIDAsLTI5MyAyMzgsLTUzMSA1MzEsLTUzMSAyOTMsMCA1MzEsMjM4IDUzMSw1MzEgMCwxNzYwIDE0MjcsMzE4OCAzMTg4LDMxODggMTc2MCwwIDMxODgsLTE0MjcgMzE4OCwtMzE4OCAwLC0xNzYwIC0xNDI3LC0zMTg3IC0zMTg4LC0zMTg3IC04MzksMCAtMTYwMywzMjQgLTIxNzIsODU1bDE4MDkgMjExYzI5MSwzNCA1MDAsMjk4IDQ2Niw1ODkgLTM0LDI5MSAtMjk4LDUwMCAtNTg5LDQ2NmwtMjc2MiAtMzIzYy0yNzUsLTMyIC00ODAsLTI3MCAtNDY5LC01NDdsMTA2IC0yODY1YzExLC0yOTMgMjU3LC01MjIgNTUxLC01MTF6Ii8+DQogPC9nPg0KPC9zdmc+DQo=");
$('.flipimg').attr("src", "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8IS0tIENyZWF0b3I6IENvcmVsRFJBVyBYNiAtLT4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iOC41aW4iIGhlaWdodD0iMTFpbiIgdmVyc2lvbj0iMS4xIiBzdHlsZT0ic2hhcGUtcmVuZGVyaW5nOmdlb21ldHJpY1ByZWNpc2lvbjsgdGV4dC1yZW5kZXJpbmc6Z2VvbWV0cmljUHJlY2lzaW9uOyBpbWFnZS1yZW5kZXJpbmc6b3B0aW1pemVRdWFsaXR5OyBmaWxsLXJ1bGU6ZXZlbm9kZDsgY2xpcC1ydWxlOmV2ZW5vZGQiDQp2aWV3Qm94PSIwIDAgODUwMCAxMTAwMCINCiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+DQogPGRlZnM+DQogIDxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQogICA8IVtDREFUQVsNCiAgICAuZmlsMCB7ZmlsbDojRkVGRUZFfQ0KICAgXV0+DQogIDwvc3R5bGU+DQogPC9kZWZzPg0KIDxnIGlkPSJMYXllcl94MDAyMF8xIj4NCiAgPG1ldGFkYXRhIGlkPSJDb3JlbENvcnBJRF8wQ29yZWwtTGF5ZXIiLz4NCiAgPHBhdGggY2xhc3M9ImZpbDAiIGQ9Ik01OTM5IDgxOGMxNjMsLTE1OCA0MjMsLTE1NCA1ODIsOWwxODY0IDE5MTljMTU1LDE2MCAxNTUsNDEzIDAsNTczbC0xODY0IDE5MTljLTE1OCwxNjMgLTQxOSwxNjcgLTU4Miw5IC0xNjMsLTE1OCAtMTY3LC00MTkgLTksLTU4MmwxMTg2IC0xMjIyIC02NzA1IDBjLTIyNywwIC00MTEsLTE4NCAtNDExLC00MTEgMCwtMjI3IDE4NCwtNDExIDQxMSwtNDExbDY3MDUgMCAtMTE4NiAtMTIyMmMtMTU4LC0xNjMgLTE1NCwtNDIzIDksLTU4MnptLTMzNzcgNDkzNWMxNjMsMTU4IDE2Nyw0MTkgOSw1ODJsLTExODYgMTIyMiA2NzA1IDBjMjI3LDAgNDExLDE4NCA0MTEsNDExIDAsMjI3IC0xODQsNDExIC00MTEsNDExbC02NzA1IDAgMTE4NiAxMjIxYzE1OCwxNjMgMTU0LDQyMyAtOSw1ODIgLTE2MywxNTggLTQyMywxNTQgLTU4MiwtOWwtMTg2NCAtMTkxOWMtMTU1LC0xNjAgLTE1NSwtNDEzIDAsLTU3M2wxODY0IC0xOTE5YzE1OCwtMTYzIDQxOSwtMTY3IDU4MiwtOXoiLz4NCiA8L2c+DQo8L3N2Zz4NCg==");
$('.exportimg').attr("src", "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8IS0tIENyZWF0b3I6IENvcmVsRFJBVyBYNiAtLT4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iOC41aW4iIGhlaWdodD0iMTFpbiIgdmVyc2lvbj0iMS4xIiBzdHlsZT0ic2hhcGUtcmVuZGVyaW5nOmdlb21ldHJpY1ByZWNpc2lvbjsgdGV4dC1yZW5kZXJpbmc6Z2VvbWV0cmljUHJlY2lzaW9uOyBpbWFnZS1yZW5kZXJpbmc6b3B0aW1pemVRdWFsaXR5OyBmaWxsLXJ1bGU6ZXZlbm9kZDsgY2xpcC1ydWxlOmV2ZW5vZGQiDQp2aWV3Qm94PSIwIDAgODUwMCAxMTAwMCINCiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+DQogPGRlZnM+DQogIDxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQogICA8IVtDREFUQVsNCiAgICAuZmlsMCB7ZmlsbDojRkVGRUZFfQ0KICAgXV0+DQogIDwvc3R5bGU+DQogPC9kZWZzPg0KIDxnIGlkPSJMYXllcl94MDAyMF8xIj4NCiAgPG1ldGFkYXRhIGlkPSJDb3JlbENvcnBJRF8wQ29yZWwtTGF5ZXIiLz4NCiAgPHBhdGggY2xhc3M9ImZpbDAiIGQ9Ik00MjUwIDIwMjhjLTE5MTcsMCAtMzQ3MiwxNTU2IC0zNDcyLDM0NzIgMCwxOTE3IDE1NTYsMzQ3MiAzNDcyLDM0NzIgMTkxNywwIDM0NzIsLTE1NTYgMzQ3MiwtMzQ3MiAwLC0xOTE3IC0xNTU2LC0zNDcyIC0zNDcyLC0zNDcyem0xODIzIDM1ODdjMCwxNDIgLTExOCwyNjAgLTI2MCwyNjAgLTE0MiwwIC0yNjAsLTExOCAtMjYwLC0yNjBsMCAtMTA0OSAtMjY4MSAyNjgxYy01Miw1MiAtMTE4LDc2IC0xODQsNzYgLTY2LDAgLTEzMiwtMjQgLTE4NCwtNzYgLTEwMSwtMTAxIC0xMDEsLTI2NyAwLC0zNjhsMjY4MSAtMjY4MSAtMTA0OSAwYy0xNDIsMCAtMjYwLC0xMTggLTI2MCwtMjYwIDAsLTE0MiAxMTgsLTI2MCAyNjAsLTI2MGwxNjc3IDBjMTQyLDAgMjYwLDExOCAyNjAsMjYwbDAgMTY3N3oiLz4NCiA8L2c+DQo8L3N2Zz4NCg==");
$('.closecss').attr("src", "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8IS0tIENyZWF0b3I6IENvcmVsRFJBVyBYNiAtLT4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iOC41aW4iIGhlaWdodD0iMTFpbiIgdmVyc2lvbj0iMS4xIiBzdHlsZT0ic2hhcGUtcmVuZGVyaW5nOmdlb21ldHJpY1ByZWNpc2lvbjsgdGV4dC1yZW5kZXJpbmc6Z2VvbWV0cmljUHJlY2lzaW9uOyBpbWFnZS1yZW5kZXJpbmc6b3B0aW1pemVRdWFsaXR5OyBmaWxsLXJ1bGU6ZXZlbm9kZDsgY2xpcC1ydWxlOmV2ZW5vZGQiDQp2aWV3Qm94PSIwIDAgODUwMCAxMTAwMCINCiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+DQogPGRlZnM+DQogIDxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQogICA8IVtDREFUQVsNCiAgICAuZmlsMCB7ZmlsbDojMjAxRTFFfQ0KICAgXV0+DQogIDwvc3R5bGU+DQogPC9kZWZzPg0KIDxnIGlkPSJMYXllcl94MDAyMF8xIj4NCiAgPG1ldGFkYXRhIGlkPSJDb3JlbENvcnBJRF8wQ29yZWwtTGF5ZXIiLz4NCiAgPHBhdGggY2xhc3M9ImZpbDAiIGQ9Ik04MzYyIDEzODhjLTE4NCwtMTg0IC00ODMsLTE4NCAtNjY4LDBsLTM0NDQgMzQ0NCAtMzQ0NCAtMzQ0NGMtMTg0LC0xODQgLTQ4MywtMTg0IC02NjgsMCAtMTg0LDE4NCAtMTg0LDQ4MyAwLDY2OGwzNDQ0IDM0NDQgLTM0NDQgMzQ0NGMtMTg0LDE4NCAtMTg0LDQ4MyAwLDY2OCAxODQsMTg0IDQ4MywxODQgNjY4LDBsMzQ0NCAtMzQ0NCAzNDQ0IDM0NDRjMTg0LDE4NCA0ODMsMTg0IDY2OCwwIDE4NCwtMTg0IDE4NCwtNDgzIDAsLTY2OGwtMzQ0NCAtMzQ0NCAzNDQ0IC0zNDQ0YzE4NCwtMTg0IDE4NCwtNDgzIDAsLTY2OHoiLz4NCiA8L2c+DQo8L3N2Zz4NCg==");
$('.savecss').attr("src", "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8IS0tIENyZWF0b3I6IENvcmVsRFJBVyBYNiAtLT4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iOC41aW4iIGhlaWdodD0iMTFpbiIgdmVyc2lvbj0iMS4xIiBzdHlsZT0ic2hhcGUtcmVuZGVyaW5nOmdlb21ldHJpY1ByZWNpc2lvbjsgdGV4dC1yZW5kZXJpbmc6Z2VvbWV0cmljUHJlY2lzaW9uOyBpbWFnZS1yZW5kZXJpbmc6b3B0aW1pemVRdWFsaXR5OyBmaWxsLXJ1bGU6ZXZlbm9kZDsgY2xpcC1ydWxlOmV2ZW5vZGQiDQp2aWV3Qm94PSIwIDAgODUwMCAxMTAwMCINCiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+DQogPGRlZnM+DQogIDxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQogICA8IVtDREFUQVsNCiAgICAuZmlsMCB7ZmlsbDojRkVGRUZFfQ0KICAgXV0+DQogIDwvc3R5bGU+DQogPC9kZWZzPg0KIDxnIGlkPSJMYXllcl94MDAyMF8xIj4NCiAgPG1ldGFkYXRhIGlkPSJDb3JlbENvcnBJRF8wQ29yZWwtTGF5ZXIiLz4NCiAgPGcgaWQ9Il80NDQyNjc5NzYiPg0KICAgPGcgaWQ9Iumhtemdoi0xIj4NCiAgICA8ZyBpZD0iRmlsZSI+DQogICAgIDxnIGlkPSJzYXZlX2ZpbGwiPg0KICAgICAgPHBhdGggaWQ9Ik1pbmdDdXRlIiBjbGFzcz0iZmlsMCIgZD0iTTg0MTcgMTMzM2wwIDgzMzMgLTgzMzMgMCAwIC04MzMzIDgzMzMgMHptLTM5NjEgODA3NmwtNCAxIC0yNSAxMiAtNyAxIDAgMCAtNSAtMSAtMjUgLTEyYy0zLC0xIC02LDAgLTgsMmwtMSA0IC02IDE0OCAyIDcgNCA0IDM2IDI2IDUgMSAwIDAgNCAtMSAzNiAtMjYgNCAtNiAwIDAgMSAtNiAtNiAtMTQ4Yy0xLC00IC0zLC02IC02LC02bDAgMHptOTIgLTM5bC01IDEgLTY0IDMyIC0zIDQgMCAwIC0xIDQgNiAxNDkgMiA0IDAgMCAzIDIgNzAgMzJjNCwxIDgsMCAxMCwtM2wxIC01IC0xMiAtMjEzYy0xLC00IC00LC03IC03LC03bDAgMHptLTI0OCAxYy0zLC0yIC03LC0xIC0xMCwybC0yIDUgLTEyIDIxM2MwLDQgMiw3IDYsOGw1IDAgNzAgLTMyIDMgLTMgMCAwIDEgLTQgNiAtMTQ5IC0xIC00IDAgMCAtMyAtMyAtNjQgLTMyeiIvPg0KICAgICAgPHBhdGggaWQ9IuW9oueKtiIgY2xhc3M9ImZpbDAiIGQ9Ik0yMTY3IDIwMjhjLTM4NCwwIC02OTQsMzExIC02OTQsNjk0bDAgNTU1NmMwLDM4NCAzMTEsNjk0IDY5NCw2OTRsNDE2NyAwYzM4NCwwIDY5NCwtMzExIDY5NCwtNjk0bDAgLTQ3MTdjMCwtMTg0IC03MywtMzYxIC0yMDMsLTQ5MWwtODM4IC04MzhjLTEzMCwtMTMwIC0zMDcsLTIwMyAtNDkxLC0yMDNsLTMzMjggMHptMzU1NSAzMDUzYzEzNiwtMTM2IDEzNiwtMzU1IDAsLTQ5MSAtMTM2LC0xMzYgLTM1NSwtMTM2IC00OTEsMGwtMTQ3MyAxNDczIC00OTEgLTQ5MWMtMTM2LC0xMzYgLTM1NSwtMTM2IC00OTEsMCAtMTM2LDEzNiAtMTM2LDM1NSAwLDQ5MWw3MTIgNzEyYzE0OSwxNDkgMzkxLDE0OSA1NDAsMGwxNjk0IC0xNjk0eiIvPg0KICAgICA8L2c+DQogICAgPC9nPg0KICAgPC9nPg0KICA8L2c+DQogPC9nPg0KPC9zdmc+DQo=");
$('.downloadcss').attr("src", "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8IS0tIENyZWF0b3I6IENvcmVsRFJBVyBYNiAtLT4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iOC41aW4iIGhlaWdodD0iMTFpbiIgdmVyc2lvbj0iMS4xIiBzdHlsZT0ic2hhcGUtcmVuZGVyaW5nOmdlb21ldHJpY1ByZWNpc2lvbjsgdGV4dC1yZW5kZXJpbmc6Z2VvbWV0cmljUHJlY2lzaW9uOyBpbWFnZS1yZW5kZXJpbmc6b3B0aW1pemVRdWFsaXR5OyBmaWxsLXJ1bGU6ZXZlbm9kZDsgY2xpcC1ydWxlOmV2ZW5vZGQiDQp2aWV3Qm94PSIwIDAgODUwMCAxMTAwMCINCiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+DQogPGRlZnM+DQogIDxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQogICA8IVtDREFUQVsNCiAgICAuZmlsMCB7ZmlsbDojRkVGRUZFfQ0KICAgXV0+DQogIDwvc3R5bGU+DQogPC9kZWZzPg0KIDxnIGlkPSJMYXllcl94MDAyMF8xIj4NCiAgPG1ldGFkYXRhIGlkPSJDb3JlbENvcnBJRF8wQ29yZWwtTGF5ZXIiLz4NCiAgPHBhdGggY2xhc3M9ImZpbDAiIGQ9Ik03NzggNTUwMGMwLC0xNjM3IDAsLTI0NTUgNTA4LC0yOTY0IDUwOCwtNTA4IDEzMjcsLTUwOCAyOTY0LC01MDggMTYzNywwIDI0NTUsMCAyOTY0LDUwOCA1MDksNTA4IDUwOSwxMzI3IDUwOSwyOTY0IDAsMTYzNyAwLDI0NTUgLTUwOSwyOTY0IC01MDgsNTA5IC0xMzI3LDUwOSAtMjk2NCw1MDkgLTE2MzcsMCAtMjQ1NSwwIC0yOTY0LC01MDkgLTUwOCwtNTA4IC01MDgsLTEzMjcgLTUwOCwtMjk2NHptMzQ3MiAtMTk5N2MxNDQsMCAyNjAsMTE3IDI2MCwyNjBsMCAxODAyIDU5NyAtNTk3YzEwMiwtMTAyIDI2NywtMTAyIDM2OCwwIDEwMiwxMDIgMTAyLDI2NyAwLDM2OGwtMTA0MiAxMDQyYy00OSw0OSAtMTE1LDc2IC0xODQsNzYgLTY5LDAgLTEzNSwtMjcgLTE4NCwtNzZsLTEwNDIgLTEwNDJjLTEwMiwtMTAyIC0xMDIsLTI2NyAwLC0zNjggMTAyLC0xMDIgMjY3LC0xMDIgMzY4LDBsNTk3IDU5NyAwIC0xODAyYzAsLTE0NCAxMTcsLTI2MCAyNjAsLTI2MHptLTEzODkgMzQ3MmMtMTQ0LDAgLTI2MCwxMTcgLTI2MCwyNjAgMCwxNDQgMTE3LDI2MCAyNjAsMjYwbDI3NzggMGMxNDQsMCAyNjAsLTExNyAyNjAsLTI2MCAwLC0xNDQgLTExNywtMjYwIC0yNjAsLTI2MGwtMjc3OCAweiIvPg0KIDwvZz4NCjwvc3ZnPg0K");
$('.unlockimg').attr("src", "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8IS0tIENyZWF0b3I6IENvcmVsRFJBVyBYNiAtLT4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iOC41aW4iIGhlaWdodD0iMTFpbiIgdmVyc2lvbj0iMS4xIiBzdHlsZT0ic2hhcGUtcmVuZGVyaW5nOmdlb21ldHJpY1ByZWNpc2lvbjsgdGV4dC1yZW5kZXJpbmc6Z2VvbWV0cmljUHJlY2lzaW9uOyBpbWFnZS1yZW5kZXJpbmc6b3B0aW1pemVRdWFsaXR5OyBmaWxsLXJ1bGU6ZXZlbm9kZDsgY2xpcC1ydWxlOmV2ZW5vZGQiDQp2aWV3Qm94PSIwIDAgODUwMCAxMTAwMCINCiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+DQogPGRlZnM+DQogIDxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQogICA8IVtDREFUQVsNCiAgICAuZmlsMCB7ZmlsbDojRkVGRUZFfQ0KICAgXV0+DQogIDwvc3R5bGU+DQogPC9kZWZzPg0KIDxnIGlkPSJMYXllcl94MDAyMF8xIj4NCiAgPG1ldGFkYXRhIGlkPSJDb3JlbENvcnBJRF8wQ29yZWwtTGF5ZXIiLz4NCiAgPHBhdGggY2xhc3M9ImZpbDAiIGQ9Ik0zOTAzIDI3MjJjLTE5MiwwIC0zNDcsMTU1IC0zNDcsMzQ3bDAgMTA0MiAxNzU5IDBjMzA4LDAgNTczLDAgNzg1LDI5IDIyOCwzMSA0NDYsMTAwIDYyMywyNzcgMTc3LDE3NyAyNDYsMzk1IDI3Nyw2MjMgMjksMjEyIDI5LDQ3OCAyOSw3ODVsMCAxNDM1YzAsMzA4IDAsNTczIC0yOSw3ODUgLTMxLDIyOCAtMTAwLDQ0NiAtMjc3LDYyMyAtMTc3LDE3NyAtMzk1LDI0NiAtNjIzLDI3NyAtMjEyLDI5IC00NzgsMjkgLTc4NSwyOWwtMjEyOSAwYy0zMDgsMCAtNTczLDAgLTc4NSwtMjkgLTIyOCwtMzEgLTQ0NiwtMTAwIC02MjMsLTI3NyAtMTc3LC0xNzcgLTI0NiwtMzk1IC0yNzcsLTYyMyAtMjksLTIxMiAtMjksLTQ3OCAtMjksLTc4NWwwIC0xNDM1YzAsLTMwOCAwLC01NzMgMjksLTc4NSAzMSwtMjI4IDEwMCwtNDQ2IDI3NywtNjIzIDE3NywtMTc3IDM5NSwtMjQ2IDYyMywtMjc3IDEzNCwtMTggMjg4LC0yNSA0NjEsLTI3bDAgLTEwNDNjMCwtNTc1IDQ2NiwtMTA0MiAxMDQyLC0xMDQybDcxNiAwYzQyMywwIDcyNywyNTAgODc4LDYxNyA1NCwxMzIgMjgsMjUzIC01MiwzMzYgLTE3NCwxODEgLTU0Miw0MiAtNjIwLC0xODUgLTU2LC00NiAtMTI4LC03NCAtMjA2LC03NGwtNzE2IDB6bTM0NyAzMTI1Yy0zODQsMCAtNjk0LDMxMSAtNjk0LDY5NCAwLDM4NCAzMTEsNjk0IDY5NCw2OTQgMzg0LDAgNjk0LC0zMTEgNjk0LC02OTQgMCwtMzg0IC0zMTEsLTY5NCAtNjk0LC02OTR6Ii8+DQogPC9nPg0KPC9zdmc+DQo=");
$('.lockimg').attr("src", "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8IS0tIENyZWF0b3I6IENvcmVsRFJBVyBYNiAtLT4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iOC41aW4iIGhlaWdodD0iMTFpbiIgdmVyc2lvbj0iMS4xIiBzdHlsZT0ic2hhcGUtcmVuZGVyaW5nOmdlb21ldHJpY1ByZWNpc2lvbjsgdGV4dC1yZW5kZXJpbmc6Z2VvbWV0cmljUHJlY2lzaW9uOyBpbWFnZS1yZW5kZXJpbmc6b3B0aW1pemVRdWFsaXR5OyBmaWxsLXJ1bGU6ZXZlbm9kZDsgY2xpcC1ydWxlOmV2ZW5vZGQiDQp2aWV3Qm94PSIwIDAgODUwMCAxMTAwMCINCiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+DQogPGRlZnM+DQogIDxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQogICA8IVtDREFUQVsNCiAgICAuZmlsMCB7ZmlsbDojRkVGRUZFfQ0KICAgXV0+DQogIDwvc3R5bGU+DQogPC9kZWZzPg0KIDxnIGlkPSJMYXllcl94MDAyMF8xIj4NCiAgPG1ldGFkYXRhIGlkPSJDb3JlbENvcnBJRF8wQ29yZWwtTGF5ZXIiLz4NCiAgPHBhdGggY2xhc3M9ImZpbDAiIGQ9Ik0yODYxIDMwNjlsMCAxMDQzYy0xNzMsMiAtMzI3LDkgLTQ2MSwyNyAtMjI4LDMxIC00NDYsMTAwIC02MjMsMjc3IC0xNzcsMTc3IC0yNDYsMzk1IC0yNzcsNjIzIC0yOSwyMTIgLTI5LDQ3OCAtMjksNzg1bDAgMTQzNWMwLDMwOCAwLDU3MyAyOSw3ODUgMzEsMjI4IDEwMCw0NDYgMjc3LDYyMyAxNzcsMTc3IDM5NSwyNDYgNjIzLDI3NyAyMTIsMjkgNDc4LDI5IDc4NSwyOWwyMTI5IDBjMzA4LDAgNTczLDAgNzg1LC0yOSAyMjgsLTMxIDQ0NiwtMTAwIDYyMywtMjc3IDE3NywtMTc3IDI0NiwtMzk1IDI3NywtNjIzIDI5LC0yMTIgMjksLTQ3OCAyOSwtNzg1bDAgLTE0MzVjMCwtMzA4IDAsLTU3MyAtMjksLTc4NSAtMzEsLTIyOCAtMTAwLC00NDYgLTI3NywtNjIzIC0xNzcsLTE3NyAtMzk1LC0yNDYgLTYyMywtMjc3IC0xMzQsLTE4IC0yODgsLTI1IC00NjEsLTI3bDAgLTEwNDNjMCwtNTc1IC00NjYsLTEwNDIgLTEwNDIsLTEwNDJsLTY5NCAwYy01NzUsMCAtMTA0Miw0NjYgLTEwNDIsMTA0MnptMTA0MiAtMzQ3Yy0xOTIsMCAtMzQ3LDE1NSAtMzQ3LDM0N2wwIDEwNDIgMTM4OSAwIDAgLTEwNDJjMCwtMTkyIC0xNTUsLTM0NyAtMzQ3LC0zNDdsLTY5NCAwem0zNDcgMzEyNWMtMzg0LDAgLTY5NCwzMTEgLTY5NCw2OTQgMCwzODQgMzExLDY5NCA2OTQsNjk0IDM4NCwwIDY5NCwtMzExIDY5NCwtNjk0IDAsLTM4NCAtMzExLC02OTQgLTY5NCwtNjk0eiIvPg0KIDwvZz4NCjwvc3ZnPg0K");
$('.mobileapply').attr("src", "data:image/svg+xml;base64, PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8IS0tIENyZWF0b3I6IENvcmVsRFJBVyBYNiAtLT4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iNi45NDVpbiIgaGVpZ2h0PSI2Ljk0NWluIiB2ZXJzaW9uPSIxLjEiIHN0eWxlPSJzaGFwZS1yZW5kZXJpbmc6Z2VvbWV0cmljUHJlY2lzaW9uOyB0ZXh0LXJlbmRlcmluZzpnZW9tZXRyaWNQcmVjaXNpb247IGltYWdlLXJlbmRlcmluZzpvcHRpbWl6ZVF1YWxpdHk7IGZpbGwtcnVsZTpldmVub2RkOyBjbGlwLXJ1bGU6ZXZlbm9kZCINCnZpZXdCb3g9IjAgMCA2OTQ1IDY5NDUiDQogeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPg0KIDxkZWZzPg0KICA8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KICAgPCFbQ0RBVEFbDQogICAgLmZpbDAge2ZpbGw6I0ZFRkVGRX0NCiAgIF1dPg0KICA8L3N0eWxlPg0KIDwvZGVmcz4NCiA8ZyBpZD0iTGF5ZXJfeDAwMjBfMSI+DQogIDxtZXRhZGF0YSBpZD0iQ29yZWxDb3JwSURfMENvcmVsLUxheWVyIi8+DQogIDxnIGlkPSJfNDc4ODcxNDI0Ij4NCiAgIDxnPg0KICAgIDxwYXRoIGNsYXNzPSJmaWwwIiBkPSJNNjI4NiAxMDAxYy0xMDYsLTEwNiAtMjgwLC0xMDYgLTM4NSwwbC0zMjA2IDMyMDYgLTE2NTEgLTE2NjNjLTEwNiwtMTA3IC0yNzgsLTEwNyAtMzg1LDBsLTU3OSA1NzhjLTEwNiwxMDYgLTEwNiwyNzkgMCwzODVsMjQyMSAyNDM3YzEwNiwxMDYgMjc4LDEwNiAzODUsMGwzOTc5IC0zOTc5YzEwNywtMTA2IDEwNywtMjgwIDAsLTM4N2wtNTc4IC01Nzd6Ii8+DQogICA8L2c+DQogIDwvZz4NCiA8L2c+DQo8L3N2Zz4NCg==");
$("#title").text("Color");
$("#prevID").hide();
function emptyAll() {
  if (window.context != undefined) {
    window.context.clearRect(0, 0, window.canvas.width, window.canvas.height);
  }
  $("#cropdimg").attr("src", "");
  $("#old").attr("src", "");
}
var TdsImageCrop1 = function TdsImageCrop1() {
  var instance = {
    getParams: function getParams() {
      return _lollipop.params;
    },
    setOptions: function setOptions(options) {
      _lollipop.extend(_lollipop.params, options);
      window.fabricJsObj = _lollipop.params.fabricJsObj;
      return this;
    },
    close: function close() {
      emptyAll();
      $("#confirmPopupOverlay").css("display", "none");
      $('#mainDivId').css("display", "none");
      $("#cropDiv").css("display", "none");
      $("#imageUp").val("");
      _lollipop.close();
    },
    closeConfirm: function closeConfirm() {
      emptyAll();
      $("#confirmPopupOverlay").css("display", "none");
      if (localStorage.getItem("openPopup") == "one") {
        $("#edit_Design").show();
      } else if (localStorage.getItem("openPopup") == "two") {
        $("#add_design").show();
      }
      $('.Count_upload').text('count:' + $('#allFabricListB').find('.fabric_column').length); //
      $('#mainDivId').css("display", "none");
      $("#cropDiv").css("display", "none");
      // cImg_WidthInch= undefined;
    },
    open: function open() {
      this.isShowLogin() ? $("#login_btn").show() : $("#login_btn").hide();
      $('#mainDivId').css("display", "block");
      $('#custom_browse').hide();
      canvasPos();
      $("#package-icon").trigger("click");
    },
    save: function save(data, extension, NewWidth, NewHeight) {
      $('#mainDivId').css("display", "none");
      $("#cropDiv").css("display", "none");
      _lollipop.params.onSave(data, extension, NewWidth.toFixed(5), NewHeight.toFixed(5));
    },
    view: function view(data, size, imgName) {
      this.close();
      _lollipop.view(data, size, imgName);
    },
    isShowLogin: function isShowLogin() {
      return _lollipop.isShowLogin();
    },
    isQ3d: function isQ3d() {
      return _lollipop.isQ3d();
    },
    isDemoUser: function isDemoUser() {
      return _lollipop.isDemoUser();
    }
  };
  return instance;
};
var _lollipop = {
  params: {
    fabricJsObj: {},
    isDemoUser: true,
    loginButtonVisible: false,
    canAuthenticateUser: function canAuthenticateUser() {
      return this.loginButtonVisible;
    },
    //config.loginButtonVisible || false,
    _isQ3d: function _isQ3d() {
      return !this.loginButtonVisible;
    },
    //!config.loginButtonVisible || false,
    onSave: function onSave(data, extension) {},
    onViewCrop: function onViewCrop() {},
    onCloseCrop: function onCloseCrop() {
      window.location.reload();
    }
  },
  cache: {},
  setOptions: function setOptions(options) {
    this.extend(_lollipop.params, options);
  },
  extend: function extend(out) {
    out = out || {};
    for (var i = 1; i < arguments.length; i++) {
      var obj = arguments[i];
      if (!obj) continue;
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (init_typeof(obj[key]) === 'object' && obj.constructor == Object) _lollipop.extend(out[key], obj[key]);else out[key] = obj[key];
        }
      }
    }
    return out;
  },
  close: function close() {
    _lollipop.opened = false;
    this.params.onCloseCrop();
  },
  container: undefined,
  opened: false,
  open: function open(options) {
    if (_lollipop.opened === true) {
      return;
    }
    _lollipop.opened = true;
    _lollipop.extend(_lollipop.params, options);
  },
  view: function view(data, size, imgName) {
    this.params.onViewCrop(data, size, imgName);
  },
  isShowLogin: function isShowLogin() {
    return this.params.canAuthenticateUser();
  },
  isQ3d: function isQ3d() {
    return this.params._isQ3d();
  },
  isDemoUser: function isDemoUser() {
    return this.params.isDemoUser;
  }
};
window.startup = function (isGetImgFromGallery) {
  return startup(isGetImgFromGallery);
};
window.getImage = function (files) {
  return getImage(files);
};
var TdsImageCrop = new TdsImageCrop1();
/* harmony default export */ const init = (TdsImageCrop);
;// CONCATENATED MODULE: ./TdsFabric.js
function TdsFabric_typeof(o) { "@babel/helpers - typeof"; return TdsFabric_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, TdsFabric_typeof(o); }
function TdsFabric_regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ TdsFabric_regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == TdsFabric_typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(TdsFabric_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function TdsFabric_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function TdsFabric_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { TdsFabric_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { TdsFabric_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || TdsFabric_unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return TdsFabric_arrayLikeToArray(r); }
function TdsFabric_slicedToArray(r, e) { return TdsFabric_arrayWithHoles(r) || TdsFabric_iterableToArrayLimit(r, e) || TdsFabric_unsupportedIterableToArray(r, e) || TdsFabric_nonIterableRest(); }
function TdsFabric_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function TdsFabric_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return TdsFabric_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? TdsFabric_arrayLikeToArray(r, a) : void 0; } }
function TdsFabric_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function TdsFabric_iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function TdsFabric_arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { TdsFabric_defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function TdsFabric_defineProperty(e, r, t) { return (r = TdsFabric_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function TdsFabric_toPropertyKey(t) { var i = TdsFabric_toPrimitive(t, "string"); return "symbol" == TdsFabric_typeof(i) ? i : i + ""; }
function TdsFabric_toPrimitive(t, r) { if ("object" != TdsFabric_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != TdsFabric_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
//`TdsFabric.js`
"Designed & developed By Shubham salunke 15/07/2024";
console.info("TdsFabric.js date :\"18/07/2025\" version : 2.7");



window.TdsFabric = function (options) {
  var settings = {
    ProductTypeId: 0,
    GroupId: 0,
    SortBy: options.SortBy || "IsNameAsc",
    MaxFabLimit: options.MaxFabLimit || 20,
    UserId: 0,
    storageLocation: "",
    emailid: options.emailid || "",
    token: options.token || "",
    // SupplierId:0,
    // RoleId:0,
    onUserAuthenticated: function onUserAuthenticated() {},
    onAuthenticationFailed: function onAuthenticationFailed() {},
    onCloseCrop: function onCloseCrop() {}
  };
  var cacheFolderId = {};
  // Merge default options with user-provided options\

  var payload = _objectSpread({}, requestObj_0);
  var uploadFab = _objectSpread({}, uploadFabPayload);
  function Init(options) {
    Object.keys(options).forEach(function (key) {
      if (requestObj_0.hasOwnProperty(key)) {
        payload[key] = options[key];
      }
      //else{
      settings[key] = options[key];
      //  }
    });
    if (options.userName && options.password) {
      onLoginUser(options.userName, options.password).then(function (result) {
        var message = result.message,
          userid = result.userid,
          status = result.status;
        if (userid) {
          settings.onUserAuthenticated();
        } else settings.onAuthenticationFailed(status, message);
      })["catch"](function (ex) {
        console.log(ex);
      });
    }
    //  const qr = new QRious({
    //     element: document.getElementById('qrCode'), 
    //     value: qrUrl,              
    //     size: $('.qr_img').width(),                
    //     level: 'H'
    // });
    // window.qrious = QRious;
  }
  //Private Methods 
  function updateProperty(propName, value) {
    payload[propName] = value;
  }
  function resetPayload(obj) {
    var _payload = payload,
      FolderId = _payload.FolderId,
      OrgId = _payload.OrgId,
      ProductName = _payload.ProductName;
    obj = _objectSpread(_objectSpread({}, obj), {
      "FolderId": FolderId,
      "OrgId": OrgId,
      "ProductName": ProductName,
      "End": settings.MaxFabLimit
    });
    payload = _objectSpread(_objectSpread({}, requestObj_0), obj);
    payload[settings.SortBy] = true;
  }
  function setADV(_ref) {
    var _ref2 = TdsFabric_slicedToArray(_ref, 3),
      artical = _ref2[0],
      design = _ref2[1],
      varient = _ref2[2];
    uploadFab.dm_Article = uploadFab.saveArticleMaster.da_artical = uploadFab.saveDesign.dd_article = artical;
    uploadFab.saveArticleMaster.da_artical_id = artical ? 1 : 0;
    uploadFab.saveVarientMaster.dv_variant_id = varient ? 1 : 0;
    uploadFab.dm_Design = uploadFab.saveDesign.dd_design = design;
    uploadFab.dm_Variant = uploadFab.saveVarientMaster.dv_variant = varient;
  }
  function ADVFormatter() {
    var designCode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    var ADV = designCode === null || designCode === void 0 ? void 0 : designCode.split("-");
    if (ADV.length >= 3) {
      var article = ADV.shift();
      var varient = ADV.pop();
      var design = ADV.join("-");
      return [article, design, varient];
    } else if (ADV.length == 2) return [''].concat(_toConsumableArray(ADV));else return [''].concat(_toConsumableArray(ADV), ['']);
  }
  // Generate request URL based on method name
  var generateGetRequest = function generateGetRequest(methodName) {
    var designName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var _payload2 = payload,
      OrgId = _payload2.OrgId,
      FolderId = _payload2.FolderId;
    var ServiceUrl = settings.ServiceUrl,
      RoleId = settings.RoleId,
      GroupId = settings.GroupId,
      ProductTypeId = settings.ProductTypeId,
      SupplierId = settings.SupplierId;
    var getUrl = null;
    switch (methodName) {
      case "GetProductList":
        getUrl = "".concat(ServiceUrl, "/api/Configuration/GetProductList?OrganisationId=").concat(OrgId);
        break;
      case "GetRoleDesignConfigurationByRole":
        getUrl = "".concat(ServiceUrl, "/api/Configuration/GetRoleDesignConfigurationByRole?RoleId=").concat(RoleId, "&IsAI=true");
        break;
      case "GetFolderIdByDesTypeIdDesSupId":
        getUrl = "".concat(ServiceUrl, "/api/Configuration/GetFolderIdByDesTypeIdDesSupId?DesignTypeId=").concat(ProductTypeId, "&DesignGroupId=").concat(GroupId, "&OrgId=").concat(OrgId, "&DesignSupplierId=").concat(SupplierId);
        break;
      case "GetFeatureTypeList_Q3D":
        getUrl = "".concat(ServiceUrl, "/api/Configuration/GetFeatureTypeList_Q3D?FolderId=").concat(FolderId);
        break;
      //upload fabric methods
      case "GetStorageLocation":
        getUrl = "".concat(ServiceUrl, "/api/Configuration/GetStorageLocation?organisationId=").concat(OrgId);
        break;
      case "IsDesignExist":
        getUrl = "".concat(ServiceUrl, "/api/Configuration/IsDesignExist?DesignName=").concat(designName, "&SupplierId=").concat(SupplierId);
        break;
      default:
        console.log("Invalid method name");
        break;
    }
    return getUrl;
  };
  var GetFabrics = /*#__PURE__*/function () {
    var _ref3 = TdsFabric_asyncToGenerator(/*#__PURE__*/TdsFabric_regeneratorRuntime().mark(function _callee() {
      var result, controllerUrl, folderId;
      return TdsFabric_regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            result = null;
            controllerUrl = "".concat(settings.ServiceUrl, "/api/Configuration/GetDesignSearch_Q3d");
            if (Number(payload.FolderId)) {
              _context.next = 14;
              break;
            }
            _context.next = 5;
            return getFolderId();
          case 5:
            folderId = _context.sent;
            payload.FolderId = "".concat(folderId === null || folderId === void 0 ? void 0 : folderId.folderId);
            cacheFolderId["".concat(settings.ProductTypeId, "-").concat(settings.GroupId)] = "".concat(folderId === null || folderId === void 0 ? void 0 : folderId.folderId);
            _context.next = 10;
            return PostData(controllerUrl, payload);
          case 10:
            result = _context.sent;
            return _context.abrupt("return", result);
          case 14:
            _context.next = 16;
            return PostData(controllerUrl, payload);
          case 16:
            result = _context.sent;
            return _context.abrupt("return", result);
          case 18:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function GetFabrics() {
      return _ref3.apply(this, arguments);
    };
  }();
  var uploadFabric = /*#__PURE__*/function () {
    var _ref4 = TdsFabric_asyncToGenerator(/*#__PURE__*/TdsFabric_regeneratorRuntime().mark(function _callee2(payload) {
      var controllerUrl, result, folderId;
      return TdsFabric_regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            //console.log(JSON.stringify(payload, null, 2));
            controllerUrl = "".concat(settings.ServiceUrl, "/api/Configuration/UploadQ3dFabric");
            result = null;
            if (Number(payload.dm_Folder_Master_Id)) {
              _context2.next = 15;
              break;
            }
            _context2.next = 5;
            return getFolderId();
          case 5:
            folderId = _context2.sent;
            payload.dm_Folder_Master_Id = folderId === null || folderId === void 0 ? void 0 : folderId.folderId;
            cacheFolderId["".concat(settings.ProductTypeId, "-").concat(settings.GroupId)] = "".concat(folderId === null || folderId === void 0 ? void 0 : folderId.folderId);
            _context2.next = 10;
            return PostData(controllerUrl, payload);
          case 10:
            result = _context2.sent;
            deduct_credits('UploadDesign');
            return _context2.abrupt("return", result);
          case 15:
            _context2.next = 17;
            return PostData(controllerUrl, payload);
          case 17:
            result = _context2.sent;
            deduct_credits('UploadDesign');
            return _context2.abrupt("return", result);
          case 20:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return function uploadFabric(_x) {
      return _ref4.apply(this, arguments);
    };
  }();
  var fetchGetRequest = /*#__PURE__*/function () {
    var _ref5 = TdsFabric_asyncToGenerator(/*#__PURE__*/TdsFabric_regeneratorRuntime().mark(function _callee3(methodName, designName) {
      var requestUrl, fabResult;
      return TdsFabric_regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            requestUrl = generateGetRequest(methodName, designName);
            _context3.next = 3;
            return getData(requestUrl);
          case 3:
            fabResult = _context3.sent;
            return _context3.abrupt("return", fabResult);
          case 5:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }));
    return function fetchGetRequest(_x2, _x3) {
      return _ref5.apply(this, arguments);
    };
  }();
  var getFolderId = /*#__PURE__*/function () {
    var _ref6 = TdsFabric_asyncToGenerator(/*#__PURE__*/TdsFabric_regeneratorRuntime().mark(function _callee4() {
      return TdsFabric_regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return fetchGetRequest("GetFolderIdByDesTypeIdDesSupId");
          case 2:
            return _context4.abrupt("return", _context4.sent);
          case 3:
          case "end":
            return _context4.stop();
        }
      }, _callee4);
    }));
    return function getFolderId() {
      return _ref6.apply(this, arguments);
    };
  }();
  var InitCrop = function InitCrop(callback) {
    if (init && !window.imageEditor) {
      window.imageEditor = init.setOptions({
        isDemoUser: settings.isDemoUser,
        fabricJsObj: Methods,
        loginButtonVisible: settings.loginButtonVisible,
        onViewCrop: settings.onViewCrop,
        onSave: function onSave(data, extension, widthInch, heightInch) {},
        onCloseCrop: settings.onCloseCrop
      });
    }
    callback(window.imageEditor);
  };
  var onFilterSearch = /*#__PURE__*/function () {
    var _ref7 = TdsFabric_asyncToGenerator(/*#__PURE__*/TdsFabric_regeneratorRuntime().mark(function _callee5(obj) {
      var resetParamObj, result;
      return TdsFabric_regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            if (!(TdsFabric_typeof(obj) === "object")) {
              _context5.next = 9;
              break;
            }
            resetParamObj = {
              "IsFilterSearch": true,
              "FilterSearchRequestDto": {
                "features": obj
              }
            };
            resetPayload(resetParamObj);
            _context5.next = 5;
            return GetFabrics();
          case 5:
            result = _context5.sent;
            return _context5.abrupt("return", result);
          case 9:
            return _context5.abrupt("return", "Invalid input");
          case 10:
          case "end":
            return _context5.stop();
        }
      }, _callee5);
    }));
    return function onFilterSearch(_x4) {
      return _ref7.apply(this, arguments);
    };
  }();
  var onSortBy = /*#__PURE__*/function () {
    var _ref8 = TdsFabric_asyncToGenerator(/*#__PURE__*/TdsFabric_regeneratorRuntime().mark(function _callee6(sortingOpt) {
      var sortingOpts;
      return TdsFabric_regeneratorRuntime().wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            sortingOpts = ["IsNameAsc", "IsNameDesc", "IsDateDesc", "IsDateAsc"];
            if (sortingOpts.includes(sortingOpt)) {
              payload = _objectSpread(_objectSpread({}, payload), {
                "IsNameAsc": false,
                "IsNameDesc": false,
                "IsDateDesc": false,
                "IsDateAsc": false,
                "Start": 0
              }); //reset all sorting options
              settings.SortBy = sortingOpt;
              updateProperty(sortingOpt, true);
            }
            _context6.next = 4;
            return GetFabrics();
          case 4:
            return _context6.abrupt("return", _context6.sent);
          case 5:
          case "end":
            return _context6.stop();
        }
      }, _callee6);
    }));
    return function onSortBy(_x5) {
      return _ref8.apply(this, arguments);
    };
  }();
  var ontextSearch = /*#__PURE__*/function () {
    var _ref9 = TdsFabric_asyncToGenerator(/*#__PURE__*/TdsFabric_regeneratorRuntime().mark(function _callee7(text) {
      var updatePayloadObj;
      return TdsFabric_regeneratorRuntime().wrap(function _callee7$(_context7) {
        while (1) switch (_context7.prev = _context7.next) {
          case 0:
            updatePayloadObj = {
              "IsText": true,
              "DesignName": text === null || text === void 0 ? void 0 : text.trim()
            };
            resetPayload(updatePayloadObj);
            _context7.next = 4;
            return GetFabrics();
          case 4:
            return _context7.abrupt("return", _context7.sent);
          case 5:
          case "end":
            return _context7.stop();
        }
      }, _callee7);
    }));
    return function ontextSearch(_x6) {
      return _ref9.apply(this, arguments);
    };
  }();
  var onSetTypeGroup = function onSetTypeGroup(typeId, groupId) {
    settings["ProductTypeId"] = typeId;
    settings["GroupId"] = groupId;
    // resetPayload({"FolderId" : "0"})
    var folderId = cacheFolderId["".concat(typeId, "-").concat(groupId)] || 0;
    updateProperty("FolderId", folderId.toString());
    // resetPayload({"FolderId" : folderId.toString()})
  };
  var onSetProductLibrary = /*#__PURE__*/function () {
    var _ref10 = TdsFabric_asyncToGenerator(/*#__PURE__*/TdsFabric_regeneratorRuntime().mark(function _callee8(productLib) {
      var isReturnFabric,
        result,
        resetParamObj,
        _args8 = arguments;
      return TdsFabric_regeneratorRuntime().wrap(function _callee8$(_context8) {
        while (1) switch (_context8.prev = _context8.next) {
          case 0:
            isReturnFabric = _args8.length > 1 && _args8[1] !== undefined ? _args8[1] : true;
            //updateProperty("filterSeproduct",productLib)
            result = '';
            resetParamObj = {
              "IsSwatchQ3d": true
            };
            payload.ProductName = productLib, resetPayload(resetParamObj);
            if (!isReturnFabric) {
              _context8.next = 10;
              break;
            }
            _context8.next = 7;
            return GetFabrics();
          case 7:
            result = _context8.sent;
            _context8.next = 11;
            break;
          case 10:
            result = true;
          case 11:
            return _context8.abrupt("return", result);
          case 12:
          case "end":
            return _context8.stop();
        }
      }, _callee8);
    }));
    return function onSetProductLibrary(_x7) {
      return _ref10.apply(this, arguments);
    };
  }();
  var onGetProductList = function onGetProductList(key) {
    return fetchGetRequest("GetProductList");
  };
  var onGetProductTypeGroup = function onGetProductTypeGroup() {
    return fetchGetRequest("GetRoleDesignConfigurationByRole");
  };
  var onGetFeatures = /*#__PURE__*/function () {
    var _ref11 = TdsFabric_asyncToGenerator(/*#__PURE__*/TdsFabric_regeneratorRuntime().mark(function _callee9() {
      var response, folderId, _folderId;
      return TdsFabric_regeneratorRuntime().wrap(function _callee9$(_context9) {
        while (1) switch (_context9.prev = _context9.next) {
          case 0:
            response = null;
            folderId = cacheFolderId["".concat(settings.ProductTypeId, "-").concat(settings.GroupId)];
            if (Number(folderId)) {
              _context9.next = 14;
              break;
            }
            _context9.next = 5;
            return getFolderId();
          case 5:
            _folderId = _context9.sent;
            payload.FolderId = "".concat(_folderId === null || _folderId === void 0 ? void 0 : _folderId.folderId);
            cacheFolderId["".concat(settings.ProductTypeId, "-").concat(settings.GroupId)] = _folderId === null || _folderId === void 0 ? void 0 : _folderId.folderId;
            _context9.next = 10;
            return fetchGetRequest("GetFeatureTypeList_Q3D", payload);
          case 10:
            response = _context9.sent;
            return _context9.abrupt("return", response);
          case 14:
            _context9.next = 16;
            return fetchGetRequest("GetFeatureTypeList_Q3D");
          case 16:
            response = _context9.sent;
            return _context9.abrupt("return", response);
          case 18:
          case "end":
            return _context9.stop();
        }
      }, _callee9);
    }));
    return function onGetFeatures() {
      return _ref11.apply(this, arguments);
    };
  }();
  var onLoadMoreData = /*#__PURE__*/function () {
    var _ref12 = TdsFabric_asyncToGenerator(/*#__PURE__*/TdsFabric_regeneratorRuntime().mark(function _callee10(index) {
      var result;
      return TdsFabric_regeneratorRuntime().wrap(function _callee10$(_context10) {
        while (1) switch (_context10.prev = _context10.next) {
          case 0:
            if (!index) {
              index = settings.MaxFabLimit + payload.Start;
            }
            updateProperty("Start", index);
            // updateProperty("End",index + settings.MaxFabLimit)
            _context10.next = 4;
            return GetFabrics();
          case 4:
            result = _context10.sent;
            return _context10.abrupt("return", result);
          case 6:
          case "end":
            return _context10.stop();
        }
      }, _callee10);
    }));
    return function onLoadMoreData(_x8) {
      return _ref12.apply(this, arguments);
    };
  }();
  var onGetStorageLocation = function onGetStorageLocation() {
    return fetchGetRequest("GetStorageLocation");
  };
  var checkIsDesignExist = function checkIsDesignExist(designName) {
    return fetchGetRequest("IsDesignExist", designName);
  };
  var onUploadDesign = /*#__PURE__*/function () {
    var _ref13 = TdsFabric_asyncToGenerator(/*#__PURE__*/TdsFabric_regeneratorRuntime().mark(function _callee11(obj) {
      var dm_Design_Name, Product, OrgId, UserId, SupplierId, ProductTypeId, GroupId, result;
      return TdsFabric_regeneratorRuntime().wrap(function _callee11$(_context11) {
        while (1) switch (_context11.prev = _context11.next) {
          case 0:
            dm_Design_Name = obj.dm_Design_Name, Product = obj.Product;
            OrgId = settings.OrgId, UserId = settings.UserId, SupplierId = settings.SupplierId, ProductTypeId = settings.ProductTypeId, GroupId = settings.GroupId;
            uploadFab = _objectSpread(_objectSpread({}, uploadFab), obj);
            uploadFab.dm_Design_Code = dm_Design_Name;
            uploadFab.saveInventoryDesignRequestDto.di_Design_Code = dm_Design_Name;
            uploadFab.saveInventoryDesignRequestDto.di_Product = Product;
            uploadFab.dm_Organisation_Id = OrgId;
            uploadFab.dm_Created_By = UserId;
            uploadFab.dm_Supplier_Id = SupplierId;
            uploadFab.dm_DesignType_Id = ProductTypeId;
            uploadFab.dm_Design_Group_Id = GroupId;
            uploadFab.dm_Folder_Master_Id = Number(cacheFolderId["".concat(ProductTypeId, "-").concat(GroupId)]) || 0;
            uploadFab.saveDesign.da_supplier_id = SupplierId;
            setADV(ADVFormatter(dm_Design_Name));
            if (storagePathDto.drive_path) {
              _context11.next = 19;
              break;
            }
            _context11.next = 17;
            return onGetStorageLocation();
          case 17:
            result = _context11.sent;
            storagePathDto.drive_path = result.data;
          case 19:
            _context11.next = 21;
            return uploadFabric({
              "designmasterDto": uploadFab,
              "storagePathDto": storagePathDto
            });
          case 21:
            return _context11.abrupt("return", _context11.sent);
          case 22:
          case "end":
            return _context11.stop();
        }
      }, _callee11);
    }));
    return function onUploadDesign(_x9) {
      return _ref13.apply(this, arguments);
    };
  }();
  var onLoginUser = /*#__PURE__*/function () {
    var _ref14 = TdsFabric_asyncToGenerator(/*#__PURE__*/TdsFabric_regeneratorRuntime().mark(function _callee12(userId, password) {
      var controllerUrl, data, deserializeResult, message, emailid, roleId, userid, organisationId, org_type_id, status, isLogin;
      return TdsFabric_regeneratorRuntime().wrap(function _callee12$(_context12) {
        while (1) switch (_context12.prev = _context12.next) {
          case 0:
            controllerUrl = "".concat(settings.ServiceUrl, "/api/Configuration/Q3dLoginOrgUser");
            data = {
              "userName": "".concat(userId),
              "password": "".concat(password)
            };
            _context12.next = 4;
            return PostData(controllerUrl, data);
          case 4:
            deserializeResult = _context12.sent;
            window.orgTypeId = deserializeResult.org_type_id; // tanmay Added Changes Temporary;
            window.domainUrl = JSON.parse(deserializeResult.jsonString)[0].q3d_domain_name;
            message = deserializeResult.message, emailid = deserializeResult.emailid, roleId = deserializeResult.roleId, userid = deserializeResult.userid, organisationId = deserializeResult.organisationId, org_type_id = deserializeResult.org_type_id, status = deserializeResult.status, isLogin = deserializeResult.isLogin;
            Init({
              "RoleId": roleId,
              "UserId": userid,
              "OrgId": organisationId,
              "SupplierId": org_type_id,
              "emailid": emailid
            });
            init.setOptions({
              canAuthenticateUser: function canAuthenticateUser() {
                return !isLogin;
              }
            });
            get_token(organisationId, emailid); // Pravesh Changes added for credit deduction
            return _context12.abrupt("return", {
              message: message,
              userid: userid,
              status: status
            });
          case 12:
          case "end":
            return _context12.stop();
        }
      }, _callee12);
    }));
    return function onLoginUser(_x10, _x11) {
      return _ref14.apply(this, arguments);
    };
  }();
  var onLogoutUser = /*#__PURE__*/function () {
    var _ref15 = TdsFabric_asyncToGenerator(/*#__PURE__*/TdsFabric_regeneratorRuntime().mark(function _callee13() {
      var controllerUrl, data, result;
      return TdsFabric_regeneratorRuntime().wrap(function _callee13$(_context13) {
        while (1) switch (_context13.prev = _context13.next) {
          case 0:
            controllerUrl = "".concat(settings.ServiceUrl, "/api/Configuration/ForceLogoutOrgUser");
            data = {
              "userId": settings.UserId
            };
            _context13.next = 4;
            return PostData(controllerUrl, data);
          case 4:
            result = _context13.sent;
            (result === null || result === void 0 ? void 0 : result.status) == 200 && init.setOptions({
              canAuthenticateUser: function canAuthenticateUser() {
                return true;
              }
            });
            return _context13.abrupt("return", result);
          case 7:
          case "end":
            return _context13.stop();
        }
      }, _callee13);
    }));
    return function onLogoutUser() {
      return _ref15.apply(this, arguments);
    };
  }();
  var onAuthUser = /*#__PURE__*/function () {
    var _ref16 = TdsFabric_asyncToGenerator(/*#__PURE__*/TdsFabric_regeneratorRuntime().mark(function _callee14() {
      return TdsFabric_regeneratorRuntime().wrap(function _callee14$(_context14) {
        while (1) switch (_context14.prev = _context14.next) {
          case 0:
            window.orgTypeId = JSON.parse(sessionStorage.jsonString).org_type_id;
            window.domainUrl = JSON.parse(JSON.parse(sessionStorage.jsonString).jsonString)[0].q3d_domain_name;
          case 2:
          case "end":
            return _context14.stop();
        }
      }, _callee14);
    }));
    return function onAuthUser() {
      return _ref16.apply(this, arguments);
    };
  }();
  var onSetOptions = function onSetOptions(opt) {
    Init(opt);
  };
  var onGetImgFromCamera = function onGetImgFromCamera() {
    InitCrop(function (imageEditor) {
      imageEditor.open({
        openPopup: "",
        cImg_WidthInch: undefined
      });
      window.startup(false);
    });
  };
  var onloadCrop = function onloadCrop() {
    InitCrop(function (imageEditor) {
      imageEditor.open({
        openPopup: "",
        cImg_WidthInch: undefined
      });
      window.startup(true);
    });
  };
  var onDestroy = function onDestroy() {
    //TODO 
  };
  // Pravesh Changes added for credit deduction
  var get_token = function get_token(organisationId, emailid) {
    var payload = {
      email: emailid,
      organisation_id: String(organisationId)
    };

    // Step 1: Get the token
    fetch("https://sa.textronic.online/api/get-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      if (data.status === "success") {
        var token = data.api_token;
        sessionStorage.setItem('api_token', token);
      } else {
        throw new Error("Failed to get token");
      }
    })["catch"](function (error) {
      console.error("Error:", error);
      document.getElementById("credits_remaining").innerText = "0";
    });
  };

  // Pravesh Changes added for credit deduction
  var deduct_credits = function deduct_credits(activity) {
    var email = settings.emailid || "archive@textronic.net";
    var organisation_id = String(settings.OrgId);
    var token = settings.token || sessionStorage.getItem('api_token');
    var deductUrl = "https://sa.textronic.online/api/deduct-credit";
    if (!token) {
      console.error("API token not found in sessionStorage.");
      return;
    }
    var payload = {
      email: email,
      organisation_id: organisation_id,
      activity: activity,
      deduct_credit: 1,
      api_token: token
    };
    fetch(deductUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-TOKEN": token
      },
      body: JSON.stringify(payload)
    }).then(function (response) {
      return response.json();
    }).then(function (result) {
      if (result.status === "success") {
        console.log("Credit deducted:", result);

        // ✅ Only update fabric upload credits in sessionStorage
        if (typeof result.remaining_fabric_upload !== "undefined") {
          sessionStorage.setItem("remaining_fabric_upload", result.remaining_fabric_upload);
        }
        if (typeof result.used_fabric_upload !== "undefined") {
          sessionStorage.setItem("used_fabric_upload", result.used_fabric_upload);
        }
      } else {
        console.error("Failed to deduct credit:", result.message);
      }
    })["catch"](function (error) {
      console.error("Error deducting credit:", error);
    });
  };
  Init(options);

  // Public methods
  var Methods = {
    "getProductList": function getProductList(key) {
      return onGetProductList(key);
    },
    "getProductTypeGroup": function getProductTypeGroup() {
      return onGetProductTypeGroup();
    },
    "setTypeGroup": function setTypeGroup(prouctTypeId, groupId) {
      // Implement type group change functionality
      onSetTypeGroup(prouctTypeId, groupId);
    },
    "getFeatures": function getFeatures() {
      return onGetFeatures();
    },
    "filterSearch": function filterSearch(obj) {
      // Implement filter search functionality
      return onFilterSearch(obj);
    },
    "textSearch": function textSearch(text) {
      // Implement text search functionality
      return ontextSearch(text);
    },
    "SortBy": function SortBy(sortingOpt) {
      // Implement sort functionality
      return onSortBy(sortingOpt);
    },
    "setProductLibrary": function setProductLibrary(productLib, isReturnFabric) {
      // Implement product library change functionality
      return onSetProductLibrary(productLib, isReturnFabric);
    },
    "loadMoreData": function loadMoreData(index) {
      //Load next fabrics 
      return onLoadMoreData(index);
    },
    "GetStorageLocation": function GetStorageLocation() {
      return onGetStorageLocation();
    },
    "IsDesignExist": function IsDesignExist(designName) {
      //check is design aleready exist 
      return checkIsDesignExist(designName);
    },
    "uploadDesign": function uploadDesign(obj) {
      //uploads design 
      return onUploadDesign(obj);
    },
    "AuthUser": function AuthUser() {
      // orgTYpeId = settings.dm_Supplier_Id;
      return onAuthUser();
    },
    "setOptions": function setOptions(opt) {
      //Reinitialize parameters
      return onSetOptions(opt);
    },
    "loadCrop": function loadCrop() {
      //Load crop plugin and dependencies of it
      return onloadCrop();
    },
    "loginUser": function loginUser(userid, password) {
      return onLoginUser(userid, password);
    },
    "logoutUser": function () {
      var _logoutUser = TdsFabric_asyncToGenerator(/*#__PURE__*/TdsFabric_regeneratorRuntime().mark(function _callee15() {
        return TdsFabric_regeneratorRuntime().wrap(function _callee15$(_context15) {
          while (1) switch (_context15.prev = _context15.next) {
            case 0:
              _context15.next = 2;
              return onLogoutUser();
            case 2:
              return _context15.abrupt("return", _context15.sent);
            case 3:
            case "end":
              return _context15.stop();
          }
        }, _callee15);
      }));
      function logoutUser() {
        return _logoutUser.apply(this, arguments);
      }
      return logoutUser;
    }(),
    "getImgFromCamera": function getImgFromCamera() {
      return onGetImgFromCamera();
    },
    getFrontImgFromCamera: function getFrontImgFromCamera() {
      return onGetImgFromCamera(false); // New method for front camera if needed
    },
    "destroy": function destroy() {
      //Todo
      onDestroy();
    }
  };
  return Methods;
};
/* harmony default export */ const TdsFabric_0 = ((/* unused pure expression or super */ null && (TdsFabric)));
})();

/******/ })()
;
