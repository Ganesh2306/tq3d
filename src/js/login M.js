import './Q3d_ui';
import "../css/common.css";
import "../css/update.css";
import '../css/style.css';
import '../css/jquery-ui.css';
import '../css/tryon.css';
import '../css/client.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js'
import '../css/login.css';
import './canvasFingerPrint.js';
import $, { error, get } from 'jquery';
// window.$ = window.jQuery = $;
import { loginPage, Homepage, updatedPlansHome,viewPlans, viewContactUs, SignUp} from './loginPage.js'
import { serviceUrl, saasurl, getznertech, getznermtm, getznercf } from './config.js'
import { loginPayload } from './configuration.js'
import CryptoJS from 'crypto-js';
import { sweetalert_error, sweetalertForceLogout, sweetalert_warning, sweetalertRequestSuccess, sweetalert_success } from './sweetalert.js'
// import { startBuffer } from './q3dFunction.js';
var searchingString = "?k="
var getznersearch = "?t="
var validateOtp = 0;
let domainName = "";
export let bannerImage = ""
let q3dUserId = ''
let urlstring = window.location.search;
let plansData = [];
let selectedPlan = {};
let userData = {};
let decoded = {};
//https://plugin.dam3d.in/q3d/v1/Tds.min.js
//const TdsScripts = ["https://plugin.dam3d.in/q3d/v1/Tds.min.js?v4.3"]; //https://plugin.dam3d.in/dev/Tds.js?v1.1 
//const TdsScripts = ["https://q3ddev.textronic.info/Tds.js?1.3.25.0.2.3"]; //https://q3ddev.textronic.info/Tds.js?1.3.25.0.2.3

// Global variables for email verification
let verificationEmail = '';
let otpTimeout = null;
let timerInterval = null;
let generatedOTP = null;
let emailVerified = false;
//

domainName = checkClientDomain();
// domainName = 'getznertech'; // for testing

let isfirsttimelogin = sessionStorage.getItem('isfirsttimelogin');

if (isfirsttimelogin == false || isfirsttimelogin == 'false') {
  urlstring = urlstring.replace(/(^\?|&)?k=[^&]*&?/, '$1');
}
if ((urlstring).includes(searchingString)) {
  if (domainName == 'getznertech') {
    $('#root').empty().append(loginPage());

    renderlandingPage();
    sessionStorage.setItem('isfirsttimelogin', false);
  } else {
$('#root').empty();
$('#root').append(Homepage());
loadPlansPage();
$('#root').append(viewPlans());
$('#root').append(viewContactUs());
$('#root').append(SignUp());

    startBuffer();
    $('body').attr('id', domainName);
    renderlandingPage();
    loadDataAllForOrg();
    setBrandLogo();
    let creditbtn = document.getElementById('showCredit');
    creditbtn.style.display = 'none';

  }
}
else {
  if (sessionStorage.userLog == "true") {
    $('#root').empty().append(Homepage());
    loadPlansPage();
    $('#root').append(viewPlans());
    $('#root').append(viewContactUs());
    $('#root').append(SignUp());
    

    if (!isdeskStop()) {
      if (JSON.parse(JSON.parse(sessionStorage.jsonString).jsonString)[0].q3d_is_q3d_lite) {
        $('body').addClass('q3dlite');
      }
    }
    domainName = checkClientDomain();
    $('body').attr('id', domainName);
    renderlandingPage();

    if (sessionStorage.getItem("clickOnVisitDemo") == "true") {
      $('body').addClass('visit_demo');
      if (!isdeskStop()) {
        if (JSON.parse(JSON.parse(sessionStorage.jsonString).jsonString)[0].q3d_is_q3d_lite) {
          $('body').addClass('q3dlite');
        }
      }
    }
    loadDataAllForOrg();
    setBrandLogo();
    let userType = sessionStorage.getItem('userType');
    let creditbtn = document.getElementById('showCredit');
    if (userType == 0 || userType == '0') {
      if (creditbtn) {
        creditbtn.style.display = 'none';
      }
    } else {
      creditbtn.style.display = 'block';
    }

  } else {
    //renderlandingPage();
$('#root').empty();
$('#root').append(loginPage());
$('#root').append(updatedPlansHome());
$('#root').append(viewPlans());
$('#root').append(viewContactUs());
$('#root').append(SignUp());
    renderlandingPage();
    let user = getCookie("q3duser");
    if (user != "") {
      let pass = getCookie("q3dpass");
      if (localStorage.getItem("checkbox")) {
        $('#inputEmail4').val(user);
        $('#loginPagepass').val(decryptPassword(pass));
        $('#gridCheck').prop('checked', true);
      }
    }
  }
}

$('.login_button').unbind('click');

$('body').on('click', '.login_button', function () {
  const userId = $('#inputEmail4').val();
  const password = $('#loginPagepass').val();
  if (userId != "" && password != "") {
    const isLoginShow = 'show'
    const otherData = getOtherData(userId, password, "normal");
    const l_payload = loginPayload(otherData);
    loginOrgUser(l_payload);
  } else {
    if (userId == "" && password != "") {
      $('#UserLoginId').show();
      $('#UserPassWord').show();
      $('#loginPagepass').val('');
    } if (userId != "" && password == "") {
      $('#UserLoginId').hide();
      $('#UserPassWord').show();
    } else if (userId == "") {
      $('#UserLoginId').show();
    }
    if (password == "") {
      $('#UserPassWord').show();
    }
  }
});
$('.request_button_send').unbind('click');
$('body').on('click', '.request_button_send', function () {
  const nameId = $('#nameinput').val().trim();
  const companyname = $('#companyname').val().trim();
  const companyemail = $('#custemail').val().trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // ? All valid
  if (nameId !== "" && companyname !== "" && companyemail !== "" && emailPattern.test(companyemail)) {
    console.log("All inputs are valid. Proceed with submit.");
    $('#nameinfo').hide();
    $('#companyinfo').hide();
    $('#mailinfo').hide();
    // disable the button to prevent multiple submissions
    $('.request_button_send').prop('disabled', true);
    requestAccessUser();

    return;
  }

  if (nameId === "") {
    $('#nameinfo').show();
  } else {
    $('#nameinfo').hide();
  }

  if (companyname === "") {
    $('#companyinfo').show();
  } else {
    $('#companyinfo').hide();
  }

  if (companyemail === "" || !emailPattern.test(companyemail)) {
    $('#mailinfo').show().text('Please enter a valid email address');
  } else {
    $('#mailinfo').hide();
  }
});


$('.demouser').unbind('click');

$('body').on('click', '.demouser', function () {
  const userId = 'tanmayt'
  const password = '12341234'
  const isLoginShow = 'show'
  const otherData = getOtherData(userId, password);
  silentLoginOrgUser(userId, password);
});


// $('body').on('click', '.title_menu_list', function() {

//   // $('#login_side_panel').modal('hide');
//     $('#login_side_panel').show()
    
//   $('#login_side_panel').css('display', 'block');
// });

$('body').on('click', '#gotoForgetPage', function () {
  $('#login_popup').css('display', 'none');
  $('#forgot_pass_popup').css('display', 'block');
});

$('body').on('click', '#viewRequestForm', function () {
  $('#login_popup').css('display', 'none');
  $('#request_popup').css('display', 'block');
})
$('body').on('click', '#backFromRequest', function () {
  $('#login_popup').css('display', 'block');
  $('#request_popup').css('display', 'none');
});
$('body').on('click', '#backTOLogin', function () {
  $('#login_popup').css('display', 'block');
  $('#forgot_pass_popup').css('display', 'none');
});


$('body').on('click', '.next_button', function () {

  $('#forgetUserIdLabel').hide();
  $('#forgetRegisterMail').hide();

  if ($('#forgetUserId').val() != '' && $('#forgetEmail').val() != '') {

    if (sendOtpMail($('#forgetUserId').val(), $('#forgetEmail').val())) {
      $('#forgetUserIdLabel').hide();
      $('#forgetRegisterMail').hide();
      $('#forgot_pass_popup').css('display', 'none');
      $('#otp_popup').css('display', 'block');
    } else {
      $('#forgetUserId').val('');
      $('#forgetEmail').val('');
      sweetalert_error('invalid Info');
    }

  } else {

    if ($('#forgetUserId').val() == '') {
      $('#forgetUserIdLabel').show();
    }

    if ($('#forgetEmail').val() == '') {
      $('#forgetRegisterMail').show();
    }
  }
});
$("body").on("click", "#userMenuBar li", function () {
  $("#userMenuBar li .dropdown-item.active").removeClass("active");
  $(this).children().addClass("active");
  if ($(this).attr("id") == "myProfile") {
    //q3d_myProfile, q3d_changePassword, q3d_logout
    q3d_myProfile();
  } else if ($(this).attr("id") == "changePass") {
    q3d_clickOnLichangePassword();
  } else if ($(this).attr("id") == "logout") {
    q3d_logout();
  } else if ($(this).attr("id") == "myPlanView") {
    $('#user_plan').addClass('show').css('display', 'block');
   
  }
});
$("body").on("click", "#closeMyplan", function(){
        $("#user_plan").hide();
  
})

$("body").on("click", ".list-group-flush li", function () {
  $(".list-group-flush li.active").removeClass("active");
  $(this).addClass("active");
  if ($(this).attr("id") == "myProfile") {
    //q3d_myProfile, q3d_changePassword, q3d_logout
    q3d_myProfile();
  } else if ($(this).attr("id") == "changePass") {
    q3d_clickOnLichangePassword();
  } else if ($(this).attr("id") == "Logout") {
    q3d_logout();
  }
});
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
function loadDataAllForOrg() {
  if (typeof sessionStorage.jsonString === 'string' && sessionStorage.jsonString !== "undefined") {
    var orgId = JSON.parse(sessionStorage.jsonString).organisationId;
    $.ajax({
      url: serviceUrl + '/api/Configuration/GetFullViewImageConfigurations?OrganisationId=' + orgId + '&IsRedirect=false&ProductName=undefined&IsLoadImage=false',
      type: "GET",
      dataType: "json",
      async: true,
    }).done(function (r) {
      sessionStorage.setItem('data', JSON.stringify(r));
      if (r.products.length > 0) {
        const TdsScripts = ["https://plugin.dam3d.in/q3d/v1/Tds.min.js?v6.2"]; 
        // const TdsScripts = ["https://plugin.dam3d.in/q3d/v1/Tds.min.js?v5.7"];
        //const TdsScripts = ["https://plugin.dam3d.in/q3d/v2/Tds.min.js?v5.7"]; // For test
        //const TdsScripts = ["./src/js/Tds.min.js?v4,3"];
        //const TdsScripts = ["./src/js/Tdsunmini.js"]; //local
        loadScripts(TdsScripts).then(() => {
          import("./q3d.js").then((Module) => {
          });
        });

      } else {
        sweetalert_warning('Upload a fabric and add models to preview the fabric renders.');
        if ($('.style_thumb ul li').length === 0 && $('.fabric_count .no-fabrics-msg').length === 0) {
          $('.model_img_box').append('<div class="no-fabrics-model-msg" style="position:absolute; bottom:10px; left:0; right:0; color:red; font-style:italic; text-align:center;">Upload a fabric and add models to preview the fabric renders.</div>');
        }
        $('#New_loader_css').css('display', 'none');
      }

    }).fail(function (jqXhr, textStatus, errorThrown) {
      console.log(error());
    });

  } else {
    const TdsScripts = ["https://plugin.dam3d.in/q3d/v1/Tds.min.js?v6.2"]
    // const TdsScripts = ["https://plugin.dam3d.in/q3d/v1/Tds.min.js?v5.7"];
   // const TdsScripts = ["https://plugin.dam3d.in/q3d/v2/Tds.min.js?v5.7"]; // For test
    //const TdsScripts = ["./src/js/Tds.min.js?v4,3"];
    // const TdsScripts = ["./src/js/Tdsunmini.js"]; //local
    loadScripts(TdsScripts).then(() => {
      import("./q3d.js").then((Module) => {
      });
    });
  }
}
// Pravesh Changes added for credit deduction
function get_token(organisationId, emailid) {
  const payload = {
    email: emailid,
    organisation_id: String(organisationId)
  };

  fetch(saasurl + '/get-token', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
    .then(response => response.json())
    .then(data => {
      if (data.status === "success") {
        const token = data.api_token;
        const customer_id = data.customer_id;
        sessionStorage.setItem('api_token', token);
        sessionStorage.setItem('customer_id', customer_id)
        getcredits_remaining();
      } else {
        throw new Error("Failed to get token");
      }
    })
    .catch(error => {
      console.error("Error:", error);
    });
}

$('body').on('click', '.Verify_button', function () {
  if ($('#getOtpPassword').val() != '') {
    if ($('#getOtpPassword').val() == validateOtp) {//
      $('#otpLabel').hide();
      $('#reset_Pass_popup').css('display', 'block');
      $('#forgot_pass_popup').css('display', 'none');
    } else {
      $('#otpLabel').show()
    }
  }
});

$('body').on('click', '.Resend_button', function () {
  $('#otpLabel').hide();
  $('.next_button').click();
});

$('body').on('click', '#reset_backToLogin', function () {
  $('#otp_popup').css('display', 'none');
  $('#forgot_pass_popup').css('display', 'none');
  $('#reset_Pass_popup').css('display', 'none');
  $('#login_popup').css('display', 'block');
});

$('body').on('click', '.rest_pass_button', function () {
  if ($('#u_newPassword').val() != '' && $('#u_newPasswordRe').val() != '') {
    if ($('#u_newPassword').val() == $('#u_newPasswordRe').val()) {
      if (updatePassword($('#u_newPassword').val())) {
        $('#passwordMatchlabel').hide();
        $('#reset_Pass_popup').css('display', 'none');
        $('#otp_popup').css('display', 'none');
        $('#forgot_pass_popup').css('display', 'none');
        $('#success_popup').css('display', 'block');
      } else {
        $('#passwordMatchlabel').show();
      }
    } else {
      $('#passwordMatchlabel').show();
    }
  }
});


$('body').on('click', '#finalbackToLogin', function () {
  $('#reset_Pass_popup').css('display', 'none');
  $('#otp_popup').css('display', 'none');
  $('#forgot_pass_popup').css('display', 'none');
  $('#success_popup').css('display', 'none');
  $('#login_popup').css('display', 'block');
});

$('body').on('click', '.new_pass_eye', function () {
  $('.new_pass_eye').toggleClass('active');
  let pass = document.getElementById('u_newPassword');
  if ($('.new_pass_eye').hasClass('active')) {
    if (pass.type === "password") {
      pass.type = "text";
    } else {
      pass.type = "password";
    }
  } else {
    if (pass.type === "password") {
      pass.type = "text";
    } else {
      pass.type = "password";
    }
  }
})

$('body').on('click', '.Confirm_pass_eye', function () {
  $('.Confirm_pass_eye').toggleClass('active');
  let pass = document.getElementById('u_newPasswordRe');
  if ($('.Confirm_pass_eye').hasClass('active')) {
    if (pass.type === "password") {
      pass.type = "text";
    } else {
      pass.type = "password";
    }
  } else {
    if (pass.type === "password") {
      pass.type = "text";
    } else {
      pass.type = "password";
    }
  }
})
$('body').on('click', '.user_pass_eye', function () {
  $('.user_pass_eye').toggleClass('active');
  let pass = document.getElementById('loginPagepass');
  if ($('.new_pass_eye').hasClass('active')) {
    if (pass.type === "password") {
      pass.type = "text";
    } else {
      pass.type = "password";
    }
  } else {
    if (pass.type === "password") {
      pass.type = "text";
    } else {
      pass.type = "password";
    }
  }
})
$('body').on('click', '.user_pass_eye_signup', function () {
  $('.user_pass_eye_signup').toggleClass('active');
  let pass = document.getElementById('onboardPassword');
  if ($('.user_pass_eye_signup').hasClass('active')) {
    if (pass.type === "password") {
      pass.type = "text";
    } else {
      pass.type = "password";
    }
  } else {
    if (pass.type === "password") {
      pass.type = "text";
    } else {
      pass.type = "password";
    }
  }
})
$('body').on('click', '.swal2-confirm', function () {
  forceLogout(q3dUserId);
});
// $('body').on('click', '.swal2-deny', function(){
// });
$('body').on('click', '.desk_login_btn', function () {
  sessionStorage.removeItem('userLog');
  let domainName = window.location.origin;
  let pathname = window.location.pathname;
  window.history.pushState('', '', domainName + pathname);
  window.location.reload();
});

$('body').on('click', "#silent_Login_button", function () {
  sessionStorage.removeItem('userLog');
  let domainName = window.location.origin;
  let pathname = window.location.pathname;
  window.history.pushState('', '', domainName + pathname);
  window.location.reload();
});

$('body').unbind('keyup');
$("body").on("keyup", function (e) {
  if (e.keyCode == 13 && $('#login_popup').is(':visible')) {
    if ($('#login_popup').is(':visible')) {
      $('.login_button').click();
    }
  }
});

function startBuffer() {
  $('.overlay').css('display', 'block');
  $('#New_loader_css').css('display', 'block');
}
export function renderlandingPage() {
  domainName = checkClientDomain();
  let link = $('<link>', { rel: "icon", href: `https://s3.ap-south-1.amazonaws.com/aws.tds/dam/q3d/clients/${domainName}/favicona.ico` });
  $('head').append(link);
  if (ismobile()) {
    bannerImage = "https://s3.ap-south-1.amazonaws.com/aws.tds/dam/q3d/clients/" + `${domainName}` + "/mobile_bg.jpg"; //textronic_logo.png
  } else if (isIpad()) {
    bannerImage = "https://s3.ap-south-1.amazonaws.com/aws.tds/dam/q3d/clients/" + `${domainName}` + "/totem_ipadPortrait.jpg";
  } else if (isTotem()) {
    bannerImage = "https://s3.ap-south-1.amazonaws.com/aws.tds/dam/q3d/clients/" + `${domainName}` + "/totem-bg.jpg";
  } else if (isIpadLandscape()) {
    bannerImage = "https://s3.ap-south-1.amazonaws.com/aws.tds/dam/q3d/clients/" + `${domainName}` + "/ipad_Landscape.jpg";
  } else {
    bannerImage = "https://s3.ap-south-1.amazonaws.com/aws.tds/dam/q3d/clients/" + `${domainName}` + "/desktop_Landscape.jpg";
  }

  $('body').attr('id', domainName);  //$('body').attr('id', domainName); $('body').attr('id', ) "getznertech"
  $('.login-page-container').css('background-image', 'url(' + bannerImage + ')');
}
export function ismobile() {
  if (window.innerWidth < 576 && window.matchMedia("(orientation: Portrait)").matches) {
    return true
  } else {
    return false;
  }
}
export function isIpad() {
  if ((window.innerWidth > 576 && window.innerWidth < 1024) && window.matchMedia("(orientation: Portrait)").matches) {
    return true
  } else {
    return false;
  }
}
export function isTotem() {
  if ((window.screen.width == 1080 && window.screen.height == 1920) && window.matchMedia("(orientation: Portrait)").matches) {
    return true
  } else {
    return false;
  }
}

export function isIpadLandscape() {
  if ((window.innerWidth >= 1024 && window.innerWidth < 1366) && window.matchMedia("(orientation: landscape)").matches) {
    return true;
  } else {
    return false;
  }
}

export function getcredits_remaining() {
  if (sessionStorage.getItem('api_token') != null && sessionStorage.getItem('api_token') != undefined) {
    const token = sessionStorage.getItem('api_token');
    const userType = sessionStorage.getItem('userType');
    var email = '';
    if (userType == 2 || userType == '2') {
      email = sessionStorage.getItem('userName');
    } else {
      email = sessionStorage.getItem('emailid');
    }
    const url = saasurl + '/check-subscription';
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-TOKEN": token
      },
      body: JSON.stringify({
        email: email,
        organisation_id: String(sessionStorage.getItem('organisationid')),
        api_token: sessionStorage.getItem('api_token')
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === "active") {
          sessionStorage.setItem('remaining_download', data.remaining_download);
          sessionStorage.setItem('used_download', data.used_download);
          sessionStorage.setItem('remaining_render', data.remaining_render);
          sessionStorage.setItem('used_render', data.used_render);
          sessionStorage.setItem('remaining_fabric_upload', data.remaining_credits);
          sessionStorage.setItem('used_fabric_upload', data.used_fabric_upload);
        } else {
          console.error("Failed to get credits remaining");
          return false;
        }
      })
      .catch(error => {
        console.error("Error fetching credits remaining:", error);
      });
  }
}

export function deduct_credits(activity) {
  // const email = sessionStorage.getItem("emailid");
  const userType = sessionStorage.getItem('userType');
  var email = '';
  if (userType == 2 || userType == '2') {
    email = sessionStorage.getItem('userName');
  } else {
    email = sessionStorage.getItem('emailid');
  }
  const organisation_id = String(sessionStorage.getItem("organisationid"));
  const token = sessionStorage.getItem("api_token");
  const deductUrl = saasurl + "/deduct-credit";

  if (!token) {
    console.error("API token not found in sessionStorage.");
    return;
  }

  const activityConfig = {
    Download: { api: "DownloadImage", storageKey: "download" },
    Render: { api: "Render", storageKey: "render" },
    DownloadImage: { api: "DownloadImage", storageKey: "download" }
  };

  const config =
    activityConfig[activity] || {
      api: activity,
      storageKey: activity.toLowerCase()
    };

  const payload = {
    email,
    organisation_id,
    activity: config.api,
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
  })
    .then(response => response.json())
    .then(result => {
      if (result.status === "success") {
        const remainingKey = `remaining_${config.storageKey}`;
        const usedKey = `used_${config.storageKey}`;

        const newRemaining = result[remainingKey];
        const newUsed = result[usedKey];

        if (typeof newRemaining !== "undefined") {
          sessionStorage.setItem(remainingKey, newRemaining);
        }

        if (typeof newUsed !== "undefined") {
          sessionStorage.setItem(usedKey, newUsed);
        }
      } else {
        console.error("Failed to deduct credit:", result.message);
      }
    })
    .catch(error => {
      console.error("Error deducting credit:", error);
    });
}


export function hasCredits(activity) {
  const key = `remaining_${activity.toLowerCase()}`;
  let creditCount = parseInt(sessionStorage.getItem(key), 10) || 0;
  return creditCount > 0;
}


export function checkClientDomain() {
  let domainName = window.location.origin;
  domainName = (domainName.split('//')[1]).split('.')[0];
  if (domainName == 'dam3d') //domainName.includes('localhost')
  {
    domainName = 'textronics';//'textronics' //textronics
  }
  /* else {
     domainName = 'getznercf'; //getznercf
   }*/
  sessionStorage.setItem('clientDomain', domainName);
// return domainName; 
   return 'sq3d'; // for testing
}

function isdeskStop() {
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
function loginOrgUser(l_payLoad) {
  const url = serviceUrl + '/api/Configuration/LoginOrgUser'
  $.ajax({
    url: url,
    type: "POST",
    contentType: 'application/json',
    data: JSON.stringify(l_payLoad),
    async: false,
  }).done(function (response) {
    if (response.isLogin) {
      if (!isdeskStop()) {
        if (JSON.parse(response.jsonString)[0].q3d_is_q3d_lite) {
          $('body').addClass('q3dlite');
        }
      }
      $('#UserLoginId').show();
      $('#UserPassWord').show();
      sessionStorage.setItem('currentUserPass', JSON.stringify($('#loginPagepass').val().trim()));
      sessionStorage.setItem('userLog', JSON.stringify(true));
      sessionStorage.setItem('qrScanDataAuth', JSON.stringify(""));
      sessionStorage.setItem('jsonString', JSON.stringify(response));
      localStorage.setItem("checkbox", $('#gridCheck').is(':checked'));
      sessionStorage.setItem('clickOnVisitDemo', JSON.stringify(false));
      sessionStorage.setItem('visit_demo', JSON.stringify(false));
      sessionStorage.setItem('organisationid', response.organisationId);
      sessionStorage.setItem('emailid', response.emailid);
      sessionStorage.setItem('userName', response.userName);
      sessionStorage.setItem('userType', response.userType);
      sessionStorage.setItem('supplierName', response.supplierName);
      sessionStorage.setItem('SupplierId', response.org_type_id);
      sessionStorage.setItem('isGroupWorking', true);
      //window.visit_demo = false;
      if ($('#gridCheck').is(':checked')) {
        storedata(l_payLoad.userName, l_payLoad.password);
      }
      $('#root').empty().append(Homepage());
      loadPlansPage();
      $('#root').append(viewPlans());
      $('#root').append(viewContactUs());
      $('#root').append(SignUp());
      $('#sucessToolTip').show();
      /*loadScripts(TdsScripts).then(()=>{
        import("./q3d.js").then((Module)=>{
        });
      })*/
      //  0 -> normal user
      //  1 -> saas user
      //  2 -> trial user
      let creditbtn = document.getElementById('showCredit');
      if (response.userType == 2 || response.userType == '2') {
        get_token(response.organisationId, response.userName);
        creditbtn.style.display = 'block';
      } else if (response.userType == 1 || response.userType == '1') {
        get_token(response.organisationId, response.emailid);
        creditbtn.style.display = 'block';
      } else if (response.userType == 0 || response.userType == '0') {
        creditbtn.style.display = 'none';
      }
      loadDataAllForOrg();
      setBrandLogo();
      // import("./q3d.js").then((Module)=>{
      // });
      setTimeout(function () {
        $('#sucessToolTip').hide();
      }, 2000);
    } else {
      if (response.loginMessage == "User is already logged into another device. Do you want to log out that user ?") {
        //sweetalert_error('userAlready Login can u force Login');
        q3dUserId = response.userid;
        sweetalertForceLogout();
      } else if (response.message == 'The Username or Password you entered is incorrect ...') {
        sweetalert_error(response.message);
        $('#UserLoginId').hide();
        $('#UserPassWord').hide();
        // openPlanfromHome(); 
       
      } else if(response.message == 'No account is linked to this Google email.Please purchase a plan to continue.'){
         //sweetalert_warning(response.message);
        $('#UserLoginId').hide();
        $('#UserPassWord').hide();
        openPlanfromHome(); 
      }else {
        // $('#UserLoginId').hide();
        // $('#UserPassWord').hide();
        $('#root').empty().append(loginPage());
        renderlandingPage();
      }
    }

  }).fail(function (jqXhr, textStatus, errorThrown) {
    console.log(error());
  });
}
function requestAccessUser() {
  const nameId = $('#nameinput').val().trim();
  const companyname = $('#companyname').val().trim();
  const companyemail = $('#custemail').val().trim();
  const url = serviceUrl + '/api/Configuration/Sendemail_getzner'
  $.ajax({
    url: url,
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({
      customerName: nameId,
      companyName: companyname,
      email: companyemail
    }),
    success: function (response) {
      $('#nameinput').val('');
      $('#companyname').val('');
      $('#custemail').val('');
      sweetalertRequestSuccess();
    },
    error: function (xhr, status, error) {
      console.error('Failed to send email:', error);
      alert('Failed to send email. Please try again.');
    }
  });
}
function silentLoginOrgUser(userName, password) {
  let payload = new Object();
  payload.userName = userName;
  payload.Password = password;
  payload.googleToken = "0";
  payload.product = "q3d";
  const url = serviceUrl + '/api/Configuration/Q3dLoginOrgUser'
  $.ajax({
    url: url,
    type: "POST",
    contentType: 'application/json',
    data: JSON.stringify(payload),
    async: false,
  }).done((response) => {
    if (!isdeskStop()) {
      if (JSON.parse(response.jsonString)[0].q3d_is_q3d_lite) {
        $('body').addClass('q3dlite');
      }
    }
    sessionStorage.setItem('currentUserPass', JSON.stringify($('#loginPagepass').val().trim()));
    sessionStorage.setItem('userLog', JSON.stringify(true));
    sessionStorage.setItem('qrScanDataAuth', JSON.stringify(""));
    sessionStorage.setItem('jsonString', JSON.stringify(response));
    localStorage.setItem("checkbox", $('#gridCheck').is(':checked'));
    sessionStorage.setItem('clickOnVisitDemo', JSON.stringify(true));
    sessionStorage.setItem('visit_demo', JSON.stringify(true));
    sessionStorage.setItem('organisationid', response.organisationId);
    sessionStorage.setItem('emailid', response.emailid);
    //window.visit_demo = true;
    $('#root').empty().append(Homepage());
    loadPlansPage();
    $('#root').append(viewPlans());
    $('#root').append(viewContactUs());
    $('#root').append(SignUp());
    $('body').addClass('visit_demo');
    /*loadScripts(TdsScripts).then(()=>{
      import("./q3d.js").then((Module)=>{
      });
    })*/
    loadDataAllForOrg();
    setBrandLogo();
    /* import("./q3d.js").then((Module)=>{
      });*/
  }).fail((jqXhr, textStatus, errorThrown) => {
    console.log(jqXhr.responseText);
  })
}
function decryptPassword(encryptedPassword) {
  // const bytes = CryptoJS.AES.decrypt(JSON.stringify(encryptedPassword),
  // 'TdsData');
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, 'TdsData');
    const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedPassword) {
      throw new Error('Decryption failed or data is malformed');
    }
    return decryptedPassword;
  } catch (error) {
    console.error('Error decrypting data:', error);
    return null;  // Handle error appropriately
  }

}
function storedata(userName, password) {
  let cipher = CryptoJS.AES.encrypt(password, 'TdsData').toString();
  setCookie('q3duser', userName, '10');
  setCookie('q3dpass', cipher, '10');
}
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
export function forceLogout() {
  let payload = new Object();
  payload.userId = q3dUserId;
  const url = serviceUrl + '/api/Configuration/ForceLogoutOrgUser';
  $.ajax({
    url: url,
    type: "POST",
    contentType: 'application/json',
    data: JSON.stringify(payload),
  }).done(function (r) {
    if (r != '') {
      $('.login_button').click();
    }
  }).fail(function (jqXhr, textStatus, errorThrown) {
    console.log("error while force logout");
  });
};

// function getOtherData(userId, password) {
//   var cf = new CanvasFingerprint.Config();
//   var data = {
//     "userName": userId,
//     "password": password,
//     "fingureprint": {
//       "device_Fingure_Print_Id": 0,
//       "device_Login_Id": getUniqueId(),
//       "device_Type": cf.getDeviceType().toString(),
//       "device_Description": null,
//       "device_Browser": cf.getBrowser().toString(),
//       "device_Ip": null,
//       "device_Location": null,
//       "is_Device_Active": false
//     },
//     "saveDeviceDetailsRequestDto": {
//       "device_detail_id": '0',
//       "system_User_Id": 0,
//       "device_Fingure_Print_Id": getUniqueId(),
//       "mac_Address": null,
//       "screen_X_Resolution": screen.width,
//       "screen_Y_Resolution": screen.height,
//       "screen_X_DPI": 100,
//       "screen_Y_DPI": 100,
//       "dpi_Unit": false,
//       "is_Active": false,
//       "is_Color_Profile": false,
//       "color_Profile_Name": null
//     }
//   }
//   return data;
// }
function getOtherData(userId, password, loginType = "normal", googleToken = null) {

  var cf = new CanvasFingerprint.Config();

  var data = {
    "loginType": loginType,

    "userName": loginType === "normal" ? userId : userId,
    "password": loginType === "normal" ? password : "",
    "googleToken": loginType === "google" ? googleToken : decoded.sub,

    "fingureprint": {
      "device_Fingure_Print_Id": 0,
      "device_Login_Id": getUniqueId(),
      "device_Type": cf.getDeviceType().toString(),
      "device_Description": null,
      "device_Browser": cf.getBrowser().toString(),
      "device_Ip": null,
      "device_Location": null,
      "is_Device_Active": false
    },

    "saveDeviceDetailsRequestDto": {
      "device_detail_id": '0',
      "system_User_Id": 0,
      "device_Fingure_Print_Id": getUniqueId(),
      "mac_Address": null,
      "screen_X_Resolution": screen.width,
      "screen_Y_Resolution": screen.height,
      "screen_X_DPI": 100,
      "screen_Y_DPI": 100,
      "dpi_Unit": false,
      "is_Active": false,
      "is_Color_Profile": false,
      "color_Profile_Name": null
    }
  }

  return data;
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
function sendOtpMail(userId, email) {
  let result = '';
  let url = serviceUrl + '/api/Configuration/Sendemail'
  let payload = sendOtpMailpayload(userId, email);
  $.ajax({
    url: url,
    type: "POST",
    contentType: 'application/json',
    data: JSON.stringify(payload),
    async: false,
  }).done(function (r) {
    if (!isNaN(r)) {
      validateOtp = r;
      result = true;
    } else {
      result = false;
    }

  }).fail(function (jqXhr, textStatus, errorThrown) {
    result = false;
  });
  return result;
}
function sendOtpMailpayload(userId, email) {
  let data = new Object();
  data.username = userId;
  data.emailTo = email;
  return data
}
function updatePassword(password) {
  const url = serviceUrl + '/api/Configuration/UpdatePassword';
  let result = false;
  let payload = updatePasswordPalyload(password);
  $.ajax({
    url: url,
    type: "POST",
    contentType: 'application/json',
    data: JSON.stringify(payload),
    async: false,
  }).done(function (r) {
    if (r) {
      result = true;
    } else {
      result = false;
    }
  }).fail(function (jqXhr, textStatus, errorThrown) {
    result = false;
    console.log("error while changePassword");
  });
  return result;
}
function updatePasswordPalyload(password) {
  const data = new Object()
  data.email = $('#forgetEmail').val();
  data.login_id = $('#forgetUserId').val();
  data.password_hash = password
  return data;
}
function loadScripts(scriptUrls) {
  const promises = scriptUrls.map(src => document.querySelector('script[src="' + src + '"]') || document.querySelector('link[href="' + src + '"]') ? new Promise((resolve) => { resolve() }) : appendScript(src));
  return Promise.all(promises);
}
function appendScript(src) {
  return new Promise((resolve, reject) => {

    const script = document.createElement('script');
    script.src = src;
    script.addEventListener('load', resolve);
    script.addEventListener('error', reject);
    document.head.appendChild(script);
  });

}
$('body').on('click', '#showCredit', function () {
  $('#creditsPopup').css('display', 'flex');
  $('.fabric-used').text(sessionStorage.getItem('used_fabric_upload'));
  $('.fabric-balance').text(sessionStorage.getItem('remaining_fabric_upload'));
  $('.download-used').text(sessionStorage.getItem('used_download'));
  $('.download-balance').text(sessionStorage.getItem('remaining_download'));
updateNavbarCredits();
})
$(document).ready(function () {
  updateNavbarCredits();
});
function updateNavbarCredits() {
  $('#nav-fabric-used').text(sessionStorage.getItem('used_fabric_upload') || 0);
  $('#nav-fabric-balance').text(sessionStorage.getItem('remaining_fabric_upload') || 0);
 
}
$('body').on('click', '.close-btn', function () {
  $('.creditpopup-overlay').fadeOut(); $('#creditsPopup').css('display', 'none');
})

function setBrandLogo() {
  let domainName = sessionStorage.getItem('clientDomain');
  let domainNameList = ["getzner", "getznercf", "getznermtm", "getznertech"];
  const logo = document.getElementById("brand-logo");

  if (domainNameList.includes(domainName)) {
    logo.src = "https://s3.ap-south-1.amazonaws.com/aws.tds/dam/q3d/clients/getzner/brand_logo.png";
  } else {
    logo.src = "https://s3.ap-south-1.amazonaws.com/aws.tds/dam/q3d/clients/q3d/brand_logo.png";
  }
}


function initNavSectionToggle() {
  // ============ DESKTOP (unchanged) ============
  $(document).on("click", ".nav-link", function () {
    const section = $(this).data("section");
    $(".nav-link").removeClass("active");
    $(this).addClass("active");
    $("#viewContact, #myplans, #signUpform").hide();

    if (section === "contact") {
      $("#viewContact").css("display", "block");
      $("#myplans").css("display", "none");
    }
    if (section === "plans") {
      $("#myplans").css("display", "block");
    }

    if (section === "signup") {
 
      $("#signUpform").css("display", "flex");
      $("#login_popup").css("display", "none");
    }
  });

  $(document).on('click', '.closeView', function(){
    $("#login_popup").css("display", "block");
    $("#signUpform").css("display", "none");
    $("#viewContact").css("display", "none");
    $("#myplans").css("display", "none");
  })

  $(document).on("click", "#loginFirst", function () {
    $("#login_popup").css("display", "block");
    $("#signUpform").css("display", "none");
    $("#viewContact").css("display", "none");
    $("#myplans").css("display", "none");
  });
  $(document).on("click", ".back-btnMobile", function () {
    $("#login_popup").hide();
    $("#signUpform").hide();
    $("#viewContact, #myplans, #signup").css('display','none');
    $('#signUpform').hide()
    
  });

    $(document).on("click", "#loginSignup", function () {
    $("#signUpform").css("display", "flex");
    $("#login_popup").hide();
  });

  // ============ MOBILE ============
  $(document).on("click", ".mobile-link", function () {
    const section = $(this).data("section");

    // close drawer
    $("#mobile-nav").removeClass("open");
    $("#hamburger-btn").removeClass("open");
    $("#mobile-nav-overlay").removeClass("open");

    // hide sections
    $("#viewContact, #myplans, #signUpform").hide();

    // show selected section
    if (section === "contact") {
      $("#viewContact").css("display", "block");
      $("#myplans").css("display", "none");
    }

    if (section === "plans") {
      $("#myplans").css("display", "block");
    }

      if (section === "signup") {
      $("#signUpform").css('display','flex');
      $('#login_popup').css('display', 'none');
    }
  });

  // ============ HAMBURGER TOGGLE ============
  $(document).on("click", "#hamburger-btn", function () {
    const isOpen = $("#mobile-nav").toggleClass("open").hasClass("open");
    $("#hamburger-btn").toggleClass("open", isOpen);
    $("#mobile-nav-overlay").toggleClass("open", isOpen);
  });

  // close on overlay click
  $(document).on("click", "#mobile-nav-overlay", function () {
    $("#mobile-nav").removeClass("open");
    $("#hamburger-btn").removeClass("open");
    $("#mobile-nav-overlay").removeClass("open");
  });

  /* BACK TO HOME BUTTON */
  $(document).on("click",".backToHome", function () {

    // remove active from nav buttons
    $(".nav-link").removeClass("active");
    // hide both sections
    $("#viewContact, #myplans, #signup").css('display','none');
    $('#login_popup').css('display', 'block');    
    $('#login_popup').show();
    $('#signUpform').hide()
    
  });

  //  $("#signup_popup").on("click", '.backToHome', function () { 

  //   $(".nav-link").removeClass("active");
  //   // hide both sections
  //   $("#viewContact, #myplans, #signup").hide();
  //   $('#login_popup').css('display', 'block');    
  //   $('#login_popup').show();
  //   $('#signUpform').hide()

  // });

}

$(document).ready(function () {
  initNavSectionToggle();
});



// test from here +++++++++++++++++++++++++++++++++++++


/**
 *
 * Google Sign-In flow (Google Identity Services / GIS):
 * 1. Google calls window.handleGoogleSignIn(response) after the user clicks
 *    the Google button and grants access.
 * 2. response.credential is a signed JWT issued by Google.
 * 3. decodeGoogleJWT() splits that JWT, base64-decodes the payload, and
 *    returns a plain object with fields like: name, email, picture, sub, etc.
 * 4. processGoogleLogin() takes those fields and updates the UI (navbar,
 *    dropdown, avatar) then shows the app shell.
 *
 * IMPORTANT: In production you MUST verify the JWT on your server before
 * trusting its contents. Never trust client-side JWT decoding alone.
 */

/* ── 1. Google Sign-In callback (called by GIS SDK after user authenticates) ── */

/**
 * Called by Google Identity Services after a successful sign-in.
 * @param {Object} response - GIS credential response
 * @param {string} response.credential - Signed JWT from Google
 */


function handleGoogleSignIn(response) {
  if (!response || !response.credential) {
    showToast('⚠️ Google sign-in failed. Please try again.');
    return;
  }

  try {
    var userInfo = decodeGoogleJWT(response.credential);
    processGoogleLogin(userInfo);
  } catch (err) {
    console.error('JWT decode error:', err);
    showToast('⚠️ Could not read sign-in data. Please try again.');
  }
}

// expose globally
//window.handleGoogleSignIn = handleGoogleSignIn;
/**
 * Decodes the payload section of a Google JWT (base64url → JSON).
 *
 * Fixes from original code:
 *  - tokenParts was never used (token.split('.') result was discarded)
 *  - base64Url variable was undefined (payload part was never assigned)
 *  - decoded variable was never assigned the JSON.parse result
 *  - nothing was returned
 *
 * @param  {string} token - The full JWT string (header.payload.signature)
 * @returns {Object} Decoded payload object
 */

function decodeGoogleJWT(token) {

  let parts = token.split('.');                         // ["header","payload","sig"]

  if (parts.length !== 3) {
    throw new Error('Invalid JWT format');
  }

  let base64Url = parts[1];                             // payload is the second part

  // Convert base64url → standard base64
  let base64 = base64Url
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  // Pad to a multiple of 4 characters (required by atob)
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }

  // Decode and parse
  let jsonStr  = atob(base64);
   decoded  = JSON.parse(jsonStr);
 // return decoded; 
 
 let googleToken = decoded.sub;
 let userName = decoded.email;
    const otherData = getOtherData(userName, "", "google", googleToken);
     const l_payload = loginPayload(otherData); 
    loginOrgUser(l_payload);
  //loginOrgUser(l_payload);
  //   let loginbtn = sessionStorage.getItem('loginbtn');
  // let signbtn = sessionStorage.getItem('signbtn')
  // if(loginbtn == true || loginbtn == "true"){
  //    const otherData = getOtherData(userName, "", "google", googleToken);
  // const l_payload = loginPayload(otherData); 
  //   loginOrgUser(l_payload);
  //   sessionStorage.setItem('loginbtn',false);
  //   setTimeout(function () {
  //       sessionStorage.removeItem('loginbtn');
  //   }, 2000);
  // }
  // if(signbtn == true || signbtn == "true"){
  //   openPlanSection();
  //   setTimeout(function () {
  //       sessionStorage.removeItem('signbtn');
  //   }, 2000);
  // }

   openPlanfromHome() 
    $("#login_popup").hide();
    $("#myplans").css('display', 'block');
  return decoded;                             
}
// $(document).on("click", ".google_signin", function () {
//   sessionStorage.setItem('signbtn',true)
//   // openSignupSection();
// });
// $(document).on("click", ".google_login", function () {
//   sessionStorage.setItem('loginbtn',true)
//   // openLoginSection()
// });

function showSignup() {
  if (section === "signup") {
      $("#signUpform").css("display", "flex");
      $("#login_popup").css("display", "none");
    }
}
function openPlanfromHome() {
  $('[data-section="plans"]').addClass("active");
  $("#login_popup").hide();
   $('#signUpform').hide();
  $("#myplans").css('display', 'block');
  // $("#signUpform").css("display", "flex");

}
function openSignUpPage() {
  $('[data-section="signup"]').addClass("active");
  $("#login_popup").hide();
  $("#myplans").hide();
  $("#signUpform").css("display", "flex");
  $('[data-section="plans"]').removeClass("active");
}

/**
 * Takes the decoded Google profile and updates the entire app UI.
 * @param {Object} userInfo - Decoded JWT payload
 */
function processGoogleLogin(userInfo) {
  /* ── Extract fields from Google JWT payload  */
  let fullName  = userInfo.name        || 'User';
  let email     = userInfo.email       || '';
  let picture   = userInfo.picture     || '';
  let firstName = userInfo.given_name  || fullName.split(' ')[0];

  // Build initials fallback (e.g. "Alex Johnson" → "AJ")
  let initials = fullName
    .split(' ')
    .filter(function (w) { return w.length > 0; })
    .slice(0, 2)
    .map(function (w) { return w[0].toUpperCase(); })
    .join('');

  /* ── Populate navbar ── */
  setAvatar('#nav-avatar', '#nav-avatar-img', '#nav-avatar-initials', picture, initials);
  $('#nav-name').text(firstName);

  /* ── Populate dropdown ── */
  setAvatar('#drop-avatar', '#drop-avatar-img', '#drop-avatar-initials', picture, initials);
  $('#drop-name').text(fullName);
  $('#drop-email').text(email);

  /* ── Hide loading indicator, show app ── */
  $('#google-signin-loading').hide();

  $('#login-page').fadeOut(380, function () {
    $('#app-shell').fadeIn(380);
    switchSection('home');
    showToast('👋 Welcome, ' + firstName + '!');
  });
}

/**
 * Renders a user avatar element.
 * Shows the Google profile picture if available, otherwise shows initials.
 *
 * @param {string} wrapSel     - Avatar wrapper selector
 * @param {string} imgSel      - <img> selector inside the wrapper
 * @param {string} initSel     - <span> initials selector inside the wrapper
 * @param {string} pictureUrl  - Google profile photo URL (may be empty)
 * @param {string} initials    - Two-letter fallback (e.g. "AJ")
 */
function setAvatar(wrapSel, imgSel, initSel, pictureUrl, initials) {
  if (pictureUrl) {
    $(imgSel).attr('src', pictureUrl).show();
    $(initSel).hide();
  } else {
    $(imgSel).hide();
    $(initSel).text(initials).show();
  }
}

const BASE_URL = "https://sa.textronic.online/api/q3d";

export async function apiCall(endpoint, body = {}) {

  try {

    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();

    return { success: true, data };

  } catch (error) {

    console.error(`API Error [${endpoint}]`, error.message);

    return { success: false, error: error.message };

  }

}

async function loadPlansPage() {
  const result = await apiCall("get-plan", {
    p_name: "q3d"
  });

  if (!result.success) {
    console.error("Plan API failed");
    return;
  }

  const plans = result.data.plans;
  plansData = plans;

  // Replace the entire #myplans container, not its innerHTML
  const existing = document.getElementById('myplans');
  if (existing) {
    existing.outerHTML = viewPlans(plans);
  }

  // Re-bind back button since DOM was replaced 
  $(".backToHome").on("click", function () {
    // remove active from nav buttons
    $(".nav-link").removeClass("active");
    // hide both sections
    $("#viewContact, #myplans, #signup").hide();
    $('#login_popup').css('display', 'block');    
    $('#login_popup').show();
   $('#signUpform').hide()
  });
}
loadPlansPage();

window.onload = function () {

  google.accounts.id.initialize({
    client_id: "321411570807-8cfo2tgu2v2mqb2rf9st10c5u6vq0ia4.apps.googleusercontent.com",
    callback: handleGoogleSignIn
  });

  document.querySelectorAll(".g_id_signin").forEach(function(el) {
    google.accounts.id.renderButton(el, {
      type: "standard",
      size: "large",
      theme: "outline",
      text: "continue_with"
    });
  });
   document.querySelectorAll("#customGoogleBtn, #customGoogleBtnB")
  .forEach(btn => {
    btn.addEventListener("click", function () {
      const googleBtn = document.querySelector(".g_id_signin div[role=button]");

      if (googleBtn) {
        googleBtn.click();
      } else {
        google.accounts.id.prompt();
      }
    });
  });

};

// $('body').on('click', '#signuphere', async function () {
//       userData = {

//         email: $('#onboardEmail').val(),
//         phone: $('#onboardPhone').val(),
//         company: $('#company').val(),
//         firstName: $('#firstName').val(),
//         lastName: $('#lastName').val(),
//         website: $('#website').val(),
//         address: $('#address').val(),
//         country: $('#country').val(),
//         state: $('#state').val(),
//         city: $('#city').val(),
//         pincode: $('#pincode').val(),
//         password: $('#onboardPassword').val()

//     };
//     if (userData.email && userData.firstName && userData.lastName && userData.password) {
//       $('[data-section="plans"]').addClass("active");
//         $("#signUpform").css('display','none');
//         $('[data-section="signup"]').removeClass("active");
//         $("#myplans").css('display','block');
//     }
//     // $('[data-section="plans"]').addClass("active");
//     // $("#signUpform").css('display','none');
//     // $('[data-section="signup"]').removeClass("active");
//     // $("#myplans").css('display','block');

//     // await Payment({

//     //     amount: 1,

//     //     plan_id: 12,
//     //     name: userData.firstName + " " + userData.lastName,
//     //     email: userData.email,
//     //     phone: userData.phone,

//     //     user: userData,

//     //     success: function (res) {

//     //         console.log("Payment Completed", res);

//     //         createCustomer(userData);

//     //     },

//     //     failed: function () {

//     //         alert("Payment failed");

//     //     }

//     // });

// });
// $('body').on('click', '#signuphere', async function () {

//   let isValid = true;

//   // clear old errors
//   $('.error-msg').remove();
//   $('input').removeClass('input-error');

//   function showError(input, message) {
//     input.addClass('input-error');
//     input.after(`<span class="error-msg">${message}</span>`);
//     isValid = false;
//   }

//   // collect data
//    userData = {
//     email: $('#onboardEmail').val().trim(),
//     phone: $('#onboardPhone').val().trim(),
//     company: $('#company').val(),
//     firstName: $('#firstName').val().trim(),
//     lastName: $('#lastName').val().trim(),
//     website: $('#website').val(),
//     address: $('#address').val(),
//     country: $('#country').val(),
//     state: $('#state').val(),
//     city: $('#city').val(),
//     pincode: $('#pincode').val(),
//     password: $('#onboardPassword').val().trim()
//   };

//   if (!userData.firstName) {
//     showError($('#firstName'), "First name is required");
//   }

//   if (!userData.lastName) {
//     showError($('#lastName'), "Last name is required");
//   }

//   validateEmail(userData.email);

//   if (!userData.phone) {
//     showError($('#onboardPhone'), "Phone number is required");
//   } else if (!/^[0-9]{10}$/.test(userData.phone)) {
//     showError($('#onboardPhone'), "Enter valid 10-digit number");
//   }

//   if (!userData.password) {
//     showError($('#onboardPassword'), "Password is required");
//   } 
//   else if (userData.password.length < 8) {
//     showError($('#onboardPassword'), "Minimum 8 characters required");
//   } 
//   else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(userData.password)) {
//     showError($('#onboardPassword'), 
//       "Password must include uppercase, lowercase, number, and special character");
//   }
//    if (userData.email && userData.firstName && userData.lastName && userData.password && userData.password.length >= 8 && userData.phone.length < 11) {
//       $('[data-section="plans"]').addClass("active");
//         $("#signUpform").css('display','none');
//         $('[data-section="signup"]').removeClass("active");
//         $("#myplans").css('display','block');
//   }

//   // stop if invalid
//   if (!isValid) return;


// });
// function validateEmail(email) {
//   const value = email.trim().toLowerCase();

//   // 1. Required
//   if (!value) {
//     return "Email is required";
//   }

//   // 2. Basic format (only one @, proper structure)
//   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/;
//   if (!emailRegex.test(value)) {
//     return "Enter a valid email address";
//   }

//   // 3. Prevent multiple @ (extra safety)
//   if ((value.match(/@/g) || []).length > 1) {
//     return "Email cannot contain multiple @ symbols";
//   }

//   // 4. Optional: Only allow Gmail
//   if (!value.endsWith("@gmail.com")) {
//     return "Only Gmail addresses are allowed";
//   }

//   return null; // ✅ valid
// }
// $('body').on('click', '#signuphere', async function () {
//    openEmailVerification();
//   let isValid = true;

//   // clear old errors
//   $('.error-msg').remove();
//   $('input').removeClass('input-error');

//   function showError(input, message) {
//     input.addClass('input-error');
//     input.after(`<span class="error-msg">${message}</span>`);
//     isValid = false;
//   }

//   userData = {
//     email: $('#onboardEmail').val().trim(),
//     phone: $('#onboardPhone').val().trim(),
//     company: $('#company').val(),
//     firstName: $('#firstName').val().trim(),
//     lastName: $('#lastName').val().trim(),
//     website: $('#website').val(),
//     address: $('#address').val(),
//     country: $('#country').val(),
//     state: $('#state').val(),
//     city: $('#city').val(),
//     pincode: $('#pincode').val(),
//     password: $('#onboardPassword').val().trim()
//   };
//   if (!userData.firstName) {
//     showError($('#firstName'), "First name is required");
//   }
//   if (!userData.lastName) {
//     showError($('#lastName'), "Last name is required");
//   }
//   const emailError = validateEmail(userData.email);
//   if (emailError) {
//     showError($('#onboardEmail'), emailError);
//   }
//   if (!userData.phone) {
//     showError($('#onboardPhone'), "Phone number is required");
//   } else if (!/^[6-9]\d{9}$/.test(userData.phone)) {
//     showError($('#onboardPhone'), "Enter valid 10-digit phone number");
//   }
//   if (!userData.password) {
//     showError($('#onboardPassword'), "Password is required");
//   } 
//   else if (userData.password.length < 8) {
//     showError($('#onboardPassword'), "Minimum 8 characters required");
//   } 
//   else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(userData.password)) {
//     showError($('#onboardPassword'), 
//       "Password must include uppercase, lowercase, number, and special character");
//   }
//   if (!isValid) return;



//   //  Success (move to next step)
//   $('[data-section="plans"]').addClass("active");
//   $("#signUpform").hide();
//   $('[data-section="signup"]').removeClass("active");
//   $("#myplans").show();

// });
$('body').on('click', '#signuphere', async function () {
    // First validate all fields except email verification
    let isValid = true;
    
    // clear old errors
    $('.error-msg').remove();
    $('input').removeClass('input-error');
    
    function showError(input, message) {
        input.addClass('input-error');
        input.after(`<span class="error-msg">${message}</span>`);
        isValid = false;
    }
    
    // Get form data
     userData = {
        email: $('#onboardEmail').val().trim(),
        phone: $('#onboardPhone').val().trim(),
        company: $('#company').val(),
        firstName: $('#firstName').val().trim(),
        lastName: $('#lastName').val().trim(),
        website: $('#website').val(),
        address: $('#address').val(),
        country: $('#country').val(),
        state: $('#state').val(),
        city: $('#city').val(),
        pincode: $('#pincode').val(),
        password: $('#onboardPassword').val().trim()
    };
    
    // Validate all fields
    if (!userData.firstName) {
        showError($('#firstName'), "First name is required");
    }
    if (!userData.lastName) {
        showError($('#lastName'), "Last name is required");
    }
    
    const emailError = validateEmail(userData.email);
    if (emailError) {
        showError($('#onboardEmail'), emailError);
    }
    
    if (!userData.phone) {
        showError($('#onboardPhone'), "Phone number is required");
    } else if (!/^[6-9]\d{9}$/.test(userData.phone)) {
        showError($('#onboardPhone'), "Enter valid 10-digit phone number");
    }
    
    if (!userData.password) {
        showError($('#onboardPassword'), "Password is required");
    } else if (userData.password.length < 8) {
        showError($('#onboardPassword'), "Minimum 8 characters required");
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(userData.password)) {
        showError($('#onboardPassword'), "Password must include uppercase, lowercase, number, and special character");
    }
    
    if (!isValid) return;
    
    // Store validated data temporarily
    sessionStorage.setItem('tempSignupData', JSON.stringify(userData));
    
    // Open email verification popup (this will auto-send OTP)
   // const opened = await EmailVerification();
   const otpSent = await sendOTP(userData.email);
    if (!otpSent) return;
});

// async function checkEmailExists(email) {
//     try {
//         const res = await fetch("https://sa.textronic.online/api/q3d/check-email", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({ email })
//         });

//         const data = await res.json();
//         return data;

//     } catch (err) {
//         console.error("Email check failed", err);
//         return { status: "error" };
//     }
// }
function validateEmail(email) {
    const value = email.trim().toLowerCase();
    if (!value) {
        return "Email is required";
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/;
    if (!emailRegex.test(value)) {
        return "Enter a valid email address";
    }
    if ((value.match(/@/g) || []).length > 1) {
        return "Email cannot contain multiple @ symbols";
    }
    // Remove the Gmail restriction if you want to allow all emails
    // if (!value.endsWith("@gmail.com")) {
    //     return "Only Gmail addresses are allowed";
    // }
    return null;
}

$('body').on('click', '.q3dp-cta', async function () {
  const loggedIn = isUserLoggedIn();
  if(!loggedIn && !userData.email && !decoded.email){
     openSignUpPage();
  }else {
     const card = $(this).closest('.q3dp-card');
     const planId = parseInt(card.attr("id"));

     selectedPlan = plansData.find(p => p.plan_id == planId);
     if (isUserLoggedIn()) {
    selectedPlan.isRenew = true;
  

    } else {
        selectedPlan.isRenew = false;
    }

    if(!selectedPlan){
        alert("Plan not found");
        return;
    }

    if (selectedPlan.price === 0) {
       openInterestPopup(selectedPlan);
         if (selectedPlan.isRenew) {        
          //renewPlanData(selectedPlan, planId);
          selectedPlan.payment_id = "Free Trial";
          selectedPlan.order_id = "Free Trial";
          selectedPlan.signature = "Free Trial";
          renewSubscription(selectedPlan);
       } else {  

          selectedPlan.payment_id = "Free Trial";
          selectedPlan.order_id = "Free Trial";
          selectedPlan.signature = "Free Trial";
          createCustomer(selectedPlan);
      }

     } else
      {
         openInterestPopup(selectedPlan);
      // await productSelection(selectedPlan);
    //  await Payment({

    //     amount: selectedPlan.price,

    //     plan_id: selectedPlan.plan_id,

    //     planName: selectedPlan.plan_name,

    //     productName: selectedPlan.product_name,
    //     name: (userData.firstName + " " + userData.lastName) || decoded.given_name,
    //     email: userData.email || decoded.email,
    //     phone: userData.phone || "9876543210",
    //     success: function (res) {
    //         selectedPlan.payment_id = res.razorpay_payment_id;
    //         if (selectedPlan.isRenew){
    //          // renewPlanData(selectedPlan, planId);
    //           renewSubscription(selectedPlan);
    //         }else{
    //         createCustomer(selectedPlan);
    //         }

    //     },
        
    //     failed: function () {
    //         alert("Payment failed");
    //     }
    //  });
    }
  }
});
 $(document).on('click', '#q3dStartBtn', async function () {
    if (!q3dPendingPlan) return;
    q3dPendingPlan.selected_interests = Object.entries(q3dSelected)
      .flatMap(([tab, set]) =>
        [...set].map(id => Q3D_CATALOG[tab].find(i => i.id === id)?.label).filter(Boolean)
      );
    closeInterestPopup();
    await proceedToPayment(q3dPendingPlan);
  });
async function proceedToPayment(plan) {

 if (plan.price === 0) {
    plan.payment_id = 'Free Trial';
    plan.order_id   = 'Free Trial';
    plan.signature  = 'Free Trial';
    plan.isRenew ? renewSubscription(plan) : createCustomer(plan);
    return;
  }
  
  await Payment({
    amount:      plan.price,
    plan_id:     plan.plan_id,
    planName:    plan.plan_name,
    productName: plan.product_name,
    name:        (userData.firstName + ' ' + userData.lastName) || decoded.given_name,
    email:       userData.email  || decoded.email,
    phone:       userData.phone  || '9876543210',
    success: function (res) {
      plan.payment_id = res.razorpay_payment_id;
      plan.isRenew ? renewSubscription(plan) : createCustomer(plan);
    },
    failed: function () {
      alert('Payment failed');
    },
  });
}

/* ── 3. Popup state ── */
// below all related to product selection after plans selections

$(function () {

    q3dRenderControls();
    q3dRenderGrid();
    q3dUpdateFooter();

  // Tab switch
    $(document).on('click', '.q3d-tab', function () {
    q3dCurrentTab = $(this).data('tab');
    q3dRenderControls();
    q3dRenderGrid();
    q3dUpdateFooter();
   });
  // Toggle card
  $(document).on('click', '.q3d-card', function () {
    const id  = $(this).data('id');
    const set = q3dSelected[q3dCurrentTab];
    set.has(id) ? set.delete(id) : set.add(id);
    $(this).toggleClass('q3d-sel', set.has(id));
    q3dUpdateFooter();
  });
  // Select / deselect all
  $(document).on('click', '#q3dSelAll', function () {
    const items  = Q3D_CATALOG[q3dCurrentTab];
    const set    = q3dSelected[q3dCurrentTab];
    const allSel = items.every(i => set.has(i.id));
    allSel ? set.clear() : items.forEach(i => set.add(i.id));
    q3dRenderGrid();
    q3dUpdateFooter();
  });
  // Close
  $(document).on('click', '#q3dCloseBtn', closeInterestPopup);
  $(document).on('click', '#q3d-interest-overlay', function (e) {
    if ($(e.target).is('#q3d-interest-overlay')) closeInterestPopup();
  });
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape') closeInterestPopup();
  });

  // START & PAY

  // CTA click
});
/* ── 2. Catalog ── */
// const Q3D_CATALOG = {
//   Men: [
//     { id: 'm1', label: 'Suit',          icon: 'suit'     },
//     { id: 'm2', label: 'Shirt',         icon: 'shirt'    },
//     { id: 'm3', label: 'Jacket',        icon: 'jacket'   },
//     { id: 'm4', label: 'Safety Jacket', icon: 'safety'   },
//     { id: 'm5', label: 'Trousers',      icon: 'trousers' },
//     { id: 'm6', label: 'T-Shirt',       icon: 'tshirt'   },
//     { id: 'm7', label: 'Shorts',        icon: 'shorts'   },
//     { id: 'm8', label: 'Blazer',        icon: 'blazer'   },
//   ],
//   Women: [
//     { id: 'w1', label: 'Dress',   icon: 'dress'    },
//     { id: 'w2', label: 'Top',     icon: 'top'      },
//     { id: 'w3', label: 'Skirt',   icon: 'skirt'    },
//     { id: 'w4', label: 'Jacket',  icon: 'jacket'   },
//     { id: 'w5', label: 'Kurti',   icon: 'kurti'    },
//     { id: 'w6', label: 'Blazer',  icon: 'blazer'   },
//   ]
// };
const Q3D_CATALOG = {
  Men: [
    { id: 'm1',  label: 'Suit',          icon: 'suit'         },
    { id: 'm2',  label: 'Shirt',         icon: 'shirt'        },
    { id: 'm3',  label: 'Jacket',        icon: 'jacket'       },
    { id: 'm4',  label: 'Trousers',      icon: 'trouser'      },
    { id: 'm5',  label: 'T-Shirt',       icon: 'shirt'        },
    { id: 'm6',  label: 'Shorts',        icon: 'trouser'      },
    { id: 'm7',  label: 'Blazer',        icon: 'jacket'       },
    { id: 'm8',  label: 'Ethnic Kurta',  icon: 'ethnicKurta'  },
    { id: 'm9', label: 'Kurta',         icon: 'ethnicKurta'  },
  ],
  Women: [
    { id: 'w1', label: 'Dress',          icon: 'womanDress'    },
    { id: 'w2', label: 'Top',            icon: 'shirt'         },
    { id: 'w3', label: 'Skirt',          icon: 'womanDress'    },
    { id: 'w4', label: 'Jacket',         icon: 'jacket'        },
    { id: 'w5', label: 'Kurti',          icon: 'kurti'         },
    { id: 'w6', label: 'Blazer',         icon: 'jacket'        },
    { id: 'w7', label: 'Hijab',          icon: 'hijab'         },
    { id: 'w8', label: 'School Uniform', icon: 'schoolUniform' },
  ],
  Home: [
    { id: 'h1', label: 'Carpet',  icon: 'carpet'  },
    { id: 'h2', label: 'Bed',     icon: 'bed'     },
    { id: 'h3', label: 'Towel',   icon: 'towel'   },
    { id: 'h4', label: 'Curtain', icon: 'curtain' },
  ]
};
// const Q3D_ICONS = {
//   suit:     `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3 7 8l7 3 7-3-3-5"/><path d="M14 11v14"/><path d="M7 8C5 9 3 12 3 25h22c0-13-2-16-4-17"/><path d="M11 3l1 4h4l1-4"/></svg>`,
//   shirt:    `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3 6 7l4 2v15h8V9l4-2-4-4"/><path d="M10 3c0 2.2 1.8 4 4 4s4-1.8 4-4"/></svg>`,
//   jacket:   `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3 6 9 3 25h22L22 9l-4-6"/><path d="M10 3c1 3 3 5 4 5s3-2 4-5"/><path d="M14 8v17"/><path d="M6 13h4M18 13h4"/></svg>`,
//   safety:   `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 9l3-5h12l3 5v14H5z"/><path d="M14 4v19"/><path d="M5 15h18"/><path d="M5 11h6M17 11h6"/></svg>`,
//   trousers: `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h16v5l-4 17h-4l-1-11-1 11H8L4 8V3z"/></svg>`,
//   tshirt:   `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 4 6 8l4 2v13h8V10l4-2-4-4"/><path d="M10 4c0 2.2 1.8 4 4 4s4-1.8 4-4"/></svg>`,
//   shorts:   `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h20v5l-3 14h-5l-2-8-2 8H7L4 9V4z"/></svg>`,
//   blazer:   `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3 6 8 3 25h22L22 8l-4-5"/><path d="M10 3c1 2.5 2.5 4.5 4 4.5S17.5 5.5 18 3"/><path d="M14 7.5V25M9 14l5-2 5 2"/></svg>`,
//   dress:    `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M11 3c-.5 2-1 4-3 6l-4 16h20L20 9c-2-2-2.5-4-3-6"/><path d="M11 3h6"/><path d="M8 15h12"/></svg>`,
//   top:      `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 4 6 8l4 2v9h8V10l4-2-4-4"/><path d="M10 4c0 2.2 1.8 4 4 4s4-1.8 4-4"/><path d="M10 14h8"/></svg>`,
//   skirt:    `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4h12v5L24 25H4L8 9V4z"/><path d="M6 14h16"/></svg>`,
//   kurti:    `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3 6 8l4 2v15h8V10l4-2-4-5"/><path d="M10 3c0 2.5 1.8 4.5 4 4.5S18 5.5 18 3"/><path d="M12 13h4M12 17h4"/></svg>`,
//   uniform:  `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3 6 8l4 2v14h8V10l4-2-4-5"/><path d="M10 3c0 2.2 1.8 4 4 4s4-1.8 4-4"/><rect x="12" y="12" width="4" height="3" rx="1"/></svg>`,
// };

const Q3D_ICONS = {
  // Existing / Updated
  shirt: `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3 6 7l4 2v15h8V9l4-2-4-4"/><path d="M10 3c0 2.2 1.8 4 4 4s4-1.8 4-4"/></svg>`,
  suit: `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3 7 8l7 3 7-3-3-5"/><path d="M14 11v14"/><path d="M7 8C5 9 3 12 3 25h22c0-13-2-16-4-17"/><path d="M11 3l1 4h4l1-4"/></svg>`,
  trouser: `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h16v5l-4 17h-4l-1-11-1 11H8L4 8V3z"/></svg>`,
  jacket: `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3 6 9 3 25h22L22 9l-4-6"/><path d="M10 3c1 3 3 5 4 5s3-2 4-5"/><path d="M14 8v17"/><path d="M6 13h4M18 13h4"/></svg>`,
  // New Icons
  ethnicKurta: `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3 7 8v17h14V8l-3-5"/><path d="M10 3c0 2.5 1.8 4.5 4 4.5S18 5.5 18 3"/><path d="M14 7.5V14"/><path d="M11 13h6"/><path d="M10 18h8M10 22h8"/></svg>`,
  kurti: `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3 6 8l4 2v15h8V10l4-2-4-5"/><path d="M10 3c0 2.5 1.8 4.5 4 4.5S18 5.5 18 3"/><path d="M12 13h4M12 17h4"/></svg>`,
  womanDress: `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M11 3c-.5 2-1 4-3 6l-4 16h20L20 9c-2-2-2.5-4-3-6"/><path d="M11 3h6"/><path d="M8 15h12"/></svg>`,
  hijab: `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="14" cy="11" rx="6" ry="7"/><path d="M8 11c-2 1-4 3-4 6 0 4 4 8 10 8s10-4 10-8c0-3-2-5-4-6"/><path d="M10 14c0 2 1.8 3.5 4 3.5s4-1.5 4-3.5"/></svg>`,
  schoolUniform: `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3 6 7l4 2v6h8V9l4-2-4-4"/><path d="M10 3c0 2.2 1.8 4 4 4s4-1.8 4-4"/><path d="M14 7v8"/><path d="M12 9l2 2 2-2"/><path d="M8 15h12v10H8z"/><path d="M14 15v10"/></svg>`,
  carpet: `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="22" height="16" rx="1"/><path d="M3 10h22M3 18h22"/><path d="M9 6v16M19 6v16"/><path d="M5 22v3M9 22v2M14 22v3M19 22v2M23 22v3"/><path d="M5 6V3M9 6V4M14 6V3M19 6V4M23 6V3"/></svg>`,
  bed: `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 14v8h22v-8"/><path d="M3 14V9a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v5"/><path d="M6 14v-3h5v3M17 14v-3h5v3"/><path d="M3 22v3M25 22v3"/></svg>`,
  towel: `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h16v16a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V4z"/><path d="M6 4c0-1 1-2 3-2h10c2 0 3 1 3 2"/><path d="M10 8h8M10 12h8M10 16h8"/></svg>`,
  curtain: `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h22v2H3z"/><path d="M5 5c0 8 3 12 3 20"/><path d="M8 5c0 6 2 10 2 15"/><path d="M11 5v20"/><path d="M17 5v20"/><path d="M20 5c0 6-2 10-2 15"/><path d="M23 5c0 8-3 12-3 20"/><circle cx="8" cy="9" r="1.5"/><circle cx="20" cy="9" r="1.5"/></svg>`,
};
let q3dCurrentTab = 'Men';
let q3dSelected   = { Men: new Set(), Women: new Set(), Home: new Set() };
let q3dPendingPlan = null; 

function openInterestPopup(plan){
   $('#q3d-interest-overlay').addClass('q3d-open');
  q3dPendingPlan = plan;
  q3dSelected    = { Men: new Set(), Women: new Set(), Home: new Set() };
  q3dCurrentTab  = 'Men';

  q3dRenderControls();
  q3dRenderGrid();
  q3dUpdateFooter();
 
}
/* ── 5. Render helpers ── */
function q3dRenderControls() {
  const tabs  = Object.keys(Q3D_CATALOG);
  const html  = tabs.map(t =>
    `<button class="q3d-tab${t === q3dCurrentTab ? ' q3d-active' : ''}"
             data-tab="${t}">${t}</button>`
  ).join('');
  const selAll = `<button class="q3d-sel-all" id="q3dSelAll">Select all</button>`;
  $('#q3dControls').html(html + selAll);
  q3dUpdateSelAll();
}

function q3dRenderGrid() {
  const items = Q3D_CATALOG[q3dCurrentTab];
  const html  = items.map(item => {
    const on = q3dSelected[q3dCurrentTab].has(item.id);
    return `
      <div class="q3d-card${on ? ' q3d-sel' : ''}" data-id="${item.id}">
        <div class="q3d-icon-wrap">
          ${Q3D_ICONS[item.icon] || Q3D_ICONS.shirt}
        </div>
        <span class="q3d-label">${item.label}</span>
        <div class="q3d-dot">
          <svg viewBox="0 0 12 10" fill="none">
            <path d="M1 5l3.5 3.5L11 1"
                  stroke="#fff" stroke-width="2.4"
                  stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>`;
  }).join('');
  $('#q3dGrid').html(html);
  q3dUpdateSelAll();
}

function q3dUpdateSelAll() {
  const btn  = $('#q3dSelAll');
  if (!btn.length) return;
  const items  = Q3D_CATALOG[q3dCurrentTab];
  const allSel = items.every(i => q3dSelected[q3dCurrentTab].has(i.id));
  btn.text(allSel ? 'Deselect all' : 'Select all').toggleClass('q3d-all', allSel);
}
function closeInterestPopup() {
  $('#q3d-interest-overlay').removeClass('q3d-open');
}
function q3dUpdateFooter() {
  const total = Object.values(q3dSelected).reduce((a, s) => a + s.size, 0);
  $('#q3dBadge').text(total);
  $('#q3dCount').html(`<strong>${total}</strong> selected`);
  $('#q3dStartBtn').prop('disabled', total === 0);
  q3dUpdateSelAll();
}
/* ── 6. Popup events ── */
// function bindPopupEvents() {
//   // Tab switch
//   $(document).on('click', '.q3d-tab', function () {
//     q3dCurrentTab = $(this).data('tab');
//     q3dRenderControls();
//     q3dRenderGrid();
//     q3dUpdateFooter();
//   });

//   // Toggle card
//   $(document).on('click', '.q3d-card', function () {
//     const id  = $(this).data('id');
//     const set = q3dSelected[q3dCurrentTab];
//     set.has(id) ? set.delete(id) : set.add(id);
//     $(this).toggleClass('q3d-sel', set.has(id));
//     q3dUpdateFooter();
//   });

//   // Select all
//   $(document).on('click', '#q3dSelAll', function () {
//     const items = Q3D_CATALOG[q3dCurrentTab];
//     const set   = q3dSelected[q3dCurrentTab];
//     const allSel = items.every(i => set.has(i.id));
//     allSel ? set.clear() : items.forEach(i => set.add(i.id));
//     q3dRenderGrid();
//     q3dUpdateFooter();
//   });

//   // Close button & overlay click
//   $(document).on('click', '#q3dCloseBtn', closeInterestPopup);
//   $(document).on('click', '#q3d-interest-overlay', function (e) {
//     if ($(e.target).is('#q3d-interest-overlay')) closeInterestPopup();
//   });

//   // ESC key
//   $(document).on('keydown', function (e) {
//     if (e.key === 'Escape') closeInterestPopup();
//   });

//   // START & PAY — proceed to payment gateway
//   $(document).on('click', '#q3dStartBtn', async function () {
//     if (!q3dPendingPlan) return;

//     // Collect selected interests
//     const interests = Object.entries(q3dSelected).flatMap(([tab, set]) =>
//       [...set].map(id => Q3D_CATALOG[tab].find(i => i.id === id)?.label).filter(Boolean)
//     );

//     // Attach to plan so your backend can receive it
//     q3dPendingPlan.selected_interests = interests;

//     closeInterestPopup();
//     await proceedToPayment(q3dPendingPlan);
//   });
// }
// above all related to product selection

// async function Payment(config) {

//     try {
//        // STEP 1: Create Razorpay Order from backend
//         const orderResponse = await fetch(
//            // "https://spv.dam3d.in/api/Configuration/CreateRazorpayOrder",
//            "http://172.16.10.6:5002/api/Configuration/CreateRazorpayOrder",
//             {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify({
//                     amount: config.amount
//                 })
//             }
//         ); 

//         const orderData = await orderResponse.json();
//         console.log("Order response:", orderData);

//         const orderId = orderData.order_id;
//         selectedPlan.order_id = orderData.order_id;

//         var options = {

//             key: "rzp_live_SJTLOVJBj3VMvs",
//             order_id : orderId,

//             amount: orderData.amount,

//             currency: orderData.currency,

//             name: "Q3D",

//             description: "Subscription Payment" + " " + config.planName + " Plan",

//             prefill: {
//                 name: config.name,
//                 email: config.email,
//                 contact: config.phone
//             },

//             handler: function (response) {
//               selectedPlan.signature = response.razorpay_signature;
//               selectedPlan.payment_id = response.razorpay_payment_id;
//               selectedPlan.order_id = response.razorpay_order_id;
//                 console.log("Payment success", response);

//                 if (config.success)
//                     config.success(response);

//             },

//             modal: {
//                 ondismiss: function () {
//                     console.log("Payment popup closed");
//                 }
//             },

//             theme: {
//                 color: "#3399cc"
//             }

//         };

//         var rzp = new Razorpay(options);

//         rzp.open();

//     }
//     catch (error) {

//         console.error("Payment Error:", error);

//     }

// }


async function Payment(config) {

    const orderResponse = await fetch(
        //"http://172.16.10.6:5002/api/Configuration/CreateRazorpayOrder"
         serviceUrl + '/api/Configuration/CreateRazorpayOrder',
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                amount: config.amount
            })
        }
    );

    const orderData = await orderResponse.json();

    const orderId = orderData.order_id;

    var options = {

        key: "rzp_live_SJTLOVJBj3VMvs",

        order_id: orderId,

        amount: orderData.amount,

        currency: orderData.currency,

        name: "Q3D",

        description: "Subscription Payment",

        handler: function (response) {
            // HERE YOU GET THE SIGNATURE
              selectedPlan.signature = response.razorpay_signature;
              selectedPlan.payment_id = response.razorpay_payment_id;
              selectedPlan.order_id = response.razorpay_order_id;
             if (config.success) {
        config.success(response);
        }

        }
    };

    var rzp = new Razorpay(options);

    rzp.open();
}
async function createCustomer(selectedPlan) {

    const payload = {

        first_name: userData.firstName || decoded.given_name,
        last_name: userData.lastName || decoded.family_name || decoded.given_name,
        phone: userData.phone || "9876543210",
        email: userData.email || decoded.email,
        company_name: userData.company || "Textronic",
        website: userData.website || "https://dam3d.in/q3d/",
        address: userData.address || "EL-109 Mahape" ,
        country: userData.country || "India",
        state: userData.state || "Maharashtra",
        city: userData.city || "Navi Mumbai",
        pincode: userData.pincode || "400709",
        password: userData.password || "Admin@123",
        sub: decoded.sub || "0",
        amount: selectedPlan.price,
        plan_id: selectedPlan.plan_id,
        product_name: selectedPlan.product_name,
        payment_id: selectedPlan.payment_id,
        order_id : selectedPlan.order_id,
        signature : selectedPlan.signature,
        productNames : ["shirt", "suit"]
    };

    try {

        const res = await fetch(
            "https://sa.textronic.online/api/q3d/create-customer",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            }
        );

        const data = await res.json();
        if (data.status === "success") {
              userData.email = userData.email || decoded.email;
              userData.password = userData.password || "Admin@123";

            // AUTO LOGIN
            const otherData = getOtherData(userData.email, userData.password, "normal");

            const l_payload = loginPayload(otherData);

            loginOrgUser(l_payload);

        }else if (data.status === "error") {
          if (data.errors && data.errors.email) {
              sweetalert_warning(`Email error: ${data.errors.email[0]}`);
          } else {
              sweetalert_error(data.message || "Something went wrong");
          }
        }

    }
    catch (err) {

        console.error("Customer creation failed", err);

    }

}
function isUserLoggedIn() {
    try {
        const json = sessionStorage.getItem("jsonString");
        if (!json) return false;

        const user = JSON.parse(json);

        return user && user.accessToken; // true if token exists
    } catch (e) {
        return false;
    }
}
async function renewSubscription(selectedPlan) {

    try {
        const payload = {
            customer_id: sessionStorage.getItem('customer_id'),
            organisation_id: sessionStorage.getItem('organisationid'),
            supplier_id: sessionStorage.getItem('SupplierId'),
            email_id: sessionStorage.getItem('emailid'),
            plan_id: selectedPlan.plan_id,
            api_token: sessionStorage.getItem('api_token')
        };

        const res = await fetch(
            "https://sa.textronic.online/api/q3d/renew-subscription",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            }
        );

        //const data = await res.json();
                let data;

        if (res.ok) {
            data = await res.json();
        } else {
            // Try to extract backend error message
            try {
                const errData = await res.json();
                throw new Error(errData.message || `HTTP ${res.status}`);
            } catch {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
        }

        if (data.status === "success") {
          getcredits_remaining();
           // alert("Plan renewed successfully ✅");
           sweetalert_success("Plan renewed successfully");
            $(".backToHome").click();

            // OPTIONAL: refresh subscriptions
            // fetchUserSubscriptions();

        } else {
            alert("Renew failed");
        }

    } catch (err) {
        console.error("Renew error", err);
        alert("Something went wrong");
    }
}

// Function to close popup
function closeEmailVerification() {
    $('#emailVerificationPopup').css('display','none');
     $("#signUpform").css("display", "flex");
    if (timerInterval) clearInterval(timerInterval);
}

async function sendOTP(signupEmail) {
    try {
        const response = await fetch('https://sa.textronic.online/api/q3d/send-verification-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: signupEmail })
        });

        const data = await response.json();

        if (data.status === "success") {
            // Set the email in popup (read-only)
          $('#verifyEmailDisplay').val(signupEmail);
          verificationEmail = signupEmail;
          emailVerified = false;
          
          // Reset popup state
          $('#verificationStep').show();
          $('#otpCode').val('');
          $('#otpError').hide();
          $('#verifyOtpBtn').prop('disabled', false).text('Verify & Continue');
          $('#resendOtpBtn').prop('disabled', false).text('Resend Code');
          $('#emailVerifiedStatus').hide();
          
          // Clear any existing timer
          if (timerInterval) clearInterval(timerInterval);
          $("#signUpform").css("display", "none");

          // Show popup
          $('#emailVerificationPopup').css("display", "flex");
            sweetalert_success('OTP sent to your email');
            return true;
        } else {
            sweetalert_error(data.message || 'Failed to send OTP');
            return false;
        }

    } catch (error) {
        sweetalert_error('Network error');
        return false;
    }
    
}
// Verify OTP
async function verifyOTP(email, otp) {
    try {      
        const response = await fetch('https://sa.textronic.online/api/q3d/verify-verification-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                email: email, 
                otp: otp 
            })
        });
        
        const data = await response.json();
        
        if (data.status === "success") {
            return { success: true, message: 'Email verified successfully' };
        } else {
            return { success: false, message: data.message || 'Invalid verification code' };
        }
        
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return { success: false, message: 'Network error. Please try again.' };
    }
}

// Start timer for OTP resend
function startResendTimer(duration) {
    let timer = duration;
    $('#timerText').show();
    $('#resendOtpBtn').prop('disabled', true);
    
    timerInterval = setInterval(() => {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        $('#timerText').text(`Resend code available in ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
        
        if (--timer < 0) {
            clearInterval(timerInterval);
            $('#timerText').hide();
            $('#resendOtpBtn').prop('disabled', false);
        }
    }, 1000);
}

// Verify OTP button click
$('body').on('click', '#verifyOtpBtn', async function () {
    const otp = $('#otpCode').val().trim();
    
    if (!otp || otp.length !== 6) {
        $('#otpError').text('Please enter a valid 6-digit code').show();
        sweetalert_warning("Please enter a valid 6-digit code");
        return;
    }
    
    $('#otpError').hide();
    $(this).prop('disabled', true).text('Verifying...');
    
    const result = await verifyOTP(verificationEmail, otp);
    
    if (result.success) {
        emailVerified = true;
        
        // Show success status
        $('#emailVerifiedStatus').show();
        
        // Close popup after a short delay
        setTimeout(() => {
            closeEmailVerification();            
            // Retrieve stored signup data
           // const userData = JSON.parse(sessionStorage.getItem('tempSignupData'));
                // Clear temporary storage
                //sessionStorage.removeItem('tempSignupData');              
                sweetalert_success('Email verified successfully!');
                
                // Move to plans page
                $('[data-section="plans"]').addClass("active");
                $("#signUpform").hide();
                $('[data-section="signup"]').removeClass("active");
                $("#myplans").show();

        }, 1000);
        
    } else {
        sweetalert_error(result.message);
        $('#verifyOtpBtn').prop('disabled', false).text('Verify & Continue');
    }
});
$('body').on('click', '#closeVerification', function(){
       closeEmailVerification();
})

// Resend OTP
$('body').on('click', '#resendOtpBtn', async function () {
    $(this).prop('disabled', true).text('Sending...');
    
    const result = await sendOTP(verificationEmail);
    
    if (result) {
        // Reset timer
        if (timerInterval) clearInterval(timerInterval);
        startResendTimer(20);
    } else {
        $(this).prop('disabled', false).text('Resend Code');
    }
});


// Close popup when clicking outside
$('body').on('click', '.popup-overlay', function(e) {
    if ($(e.target).hasClass('popup-overlay')) {
        closeEmailVerification();
    }
});
$(document).on('keydown', function(e) {
    if (e.key === 'Escape' && $('#emailVerificationPopup').is(':visible')) {
        closeEmailVerification();
    }
});

// Auto-focus on OTP input when step 2 appears
$(document).on('click', '#sendVerificationCode, #resendOtpBtn', function() {
    setTimeout(() => {
        $('#otpCode').focus();
    }, 500);
});