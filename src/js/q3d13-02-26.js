console.log('Q3d_Appplication V7.9 07-07-2025');
import { serviceUrl, darcoPath } from './config.js';
import './canvasFingerPrint.js';
import { model_height } from './Q3d_ui.js'
import { setConfiguration } from './configuration.js'
import { appnedStyleImage, q3d_changeStyleModel, q3d_resetFilter, openFullviewApplyBtn, q3d_openFullView, clickOnFullviewPrevBtn, clickOnFullviewNextBtn, q3d_clickOnFullviewCloseBtn, q3d_QrScanData, q3d_CopyLink, q3d_getProductFeature, downloadQ3dModel, q3d_ptpgFilter, q3d_SortingFilter, prevdrapFabricOnModel, clickOnModelPrevBtn, q3d_clickOnFilterBtn, q3d_textSearch, q3d_Filter, q3d_resetTextSearch, clickOnModelNextBtn, textureOperation, q3d_appendFabric, checkScrollBarPos, isdeskStop, q3d_switchOnGroupBtn, q3d_UpdateProfile, q3d_changeUserProfilePhoto, q3d_myProfile, q3d_clickOnLichangePassword, q3d_changePassword, q3d_logout, startBuffer, stopBuffer, getznerPopupDownload, tryonSaveImagedata, clickOnGetznerInfoBtn, downloadPDF, saveFabricDrapeCount, getznerAppendInfo, q3d_TotemtextSearch, getznerTechnicalSheet, upd_InitiateUpload, q3dLiteChangeModel, q3dLiteChangeFabric, q3dLiteOpenFullview, q3dLiteCheckScrollBarPos, upd_openMyUpload, upd_drapeUplodedFabric, hasHScrollBar, shareOnWhatsApp } from './q3dFunction.js'
import { startTryon } from './TryOn.js';
import { error } from 'jquery';
import { appendProductFeature } from './q3dFunction.js'
import { loadTryonUi } from './loginPage.js'
import { h_style_panel, h_fabric_panel, d_portrait } from './Q3d_ui.js';
import { sweetalert_error, sweetalert_warning } from './sweetalert.js';
import { getcredits_remaining, deduct_credits, hasCredits, checkClientDomain } from './login.js';
let searchStringUrl = "?k";
let q3d_Plugin = "";
let configuration = "";
let isLogin = false;
let _pluginConfigureData = "";
let FirstModelCount = 0;
let clickCounter = 0;
let qrSupplierId = "";
let qrRoleID = "";
let loadAllfabric = false;
let urlstring = window.location.search;
let pluginInitialized = false;
let pluginInitializing = false;
// import QrScanner from 'qr-scanner';
model_height();
startBuffer();
let supplierName = sessionStorage.getItem('supplierName');
if (supplierName != null && supplierName != undefined && supplierName != '') {
    switch (supplierName) {
        case 'Getznercollection0':
            document.getElementById("season_name").textContent = "Spring/Summer 2022";
            break;
        case 'Getznercollection1':
            document.getElementById("season_name").textContent = "Autumn/Summer 2022";
            break;
        case 'Getznercollection2':
            document.getElementById("season_name").textContent = "Autumn/Winter 2022";
            break;
        case 'Getznercollection3':
            document.getElementById("season_name").textContent = "Summer 2023";
            break;
        case 'Getznercollection4':
            document.getElementById("season_name").textContent = "Autumn/Winter 2023-2024";
            break;
        case 'Getznercollection5':
            document.getElementById("season_name").textContent = "Summer 2024";
            break;
        case 'Getznercollection6':
            document.getElementById("season_name").textContent = "Autumn/Winter 2024/25";
            break;
        case 'Getznercollection7':
            document.getElementById("season_name").textContent = "Summer 2025";
            break;
        case 'Getznercollection8':
            document.getElementById("season_name").textContent = "Autumn/Winter 2025/26";
            break;
        case 'Getznercollection9':
            document.getElementById("season_name").textContent = "Summer 2026";
            break;
        case 'getznercollection10':
            document.getElementById("season_name").textContent = "Autumn/Winter 2026/27";
            break;
        case 'getznercollection11':
            document.getElementById("season_name").textContent = "Summer2027";
            break;
        default:
            sessionStorage.setItem('supplierName', 'Getznercollection0');
            break;
    }
}
if (urlstring.includes(searchStringUrl)) {
    let qrDesignName = "";

    //loadAllfabric = false; // Tanmay added Change Purpose : Added for load all fabric 08-05-2025
    let url_string = window.location.href;
    let url = new URL(url_string);
    if (url.searchParams.get("t") != null && url.searchParams.get("t") != "") {
        qrDesignName = url.searchParams.get("t");//url.search.substring(url.search.lastIndexOf("&t=") + 3,url.search.length);
        qrDesignName = qrDesignName.replace("&", "%26");
        qrDesignName = qrDesignName.replaceAll("%20", " ");
        qrDesignName = qrDesignName.split(",");
    }
    if (url.searchParams.get("k") != null && url.searchParams.get("k") != "") {
        qrSupplierId = url.searchParams.get("k");
        qrSupplierId = parseInt(qrSupplierId, 16);
    }
    if (url.searchParams.get("p")?.toLowerCase() == "ecom") {
        loadAllfabric = true;
    }
    $("body").addClass("visit_demo");
    startBuffer();
    let deviceloginId = getUniqueId();
    let MethodUrl = serviceUrl + "/api/Configuration/QRScan_Q3D";
    var data1 = {
        "supplierId": qrSupplierId,
        "deviceloginId": deviceloginId,
        "c": "b",
        "designNames": qrDesignName,
        "isGetzner": serviceUrl.includes('gpv') ? true : false
    }
    $.ajax({
        url: MethodUrl,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(data1),
        async: false,
    }).done(function (r) {
        if (r.loadProductsByFabricResponseDto !== null) {
            if (!loadAllfabric)
                $('.fabric').addClass('link_qr');

            if (!isdeskStop()) {
                if (JSON.parse(r.loginOrgResponse.jsonString)[0].q3d_is_q3d_lite) {
                    $('body').addClass('q3dlite');
                }
            }
            // if(!loadAllfabric)
            // {

            // check and manage for getzner
            q3d_QrScanData(r.loadProductsByFabricResponseDto, r.loginOrgResponse);
            // appendProductFeature(r.loadProductsByFabricResponseDto[0].designFeature);
            // tryonSaveImagedata(r.loadProductsByFabricResponseDto);
            // }
            qrRoleID = r.loginOrgResponse.roleId != null ? r.loginOrgResponse.roleId : undefined;
            if (r.loadProductsByFabricResponseDto.length > 1) {
                $('.next_fabric').css('visibility', 'visible');
            } else {
                $('.next_fabric').css('visibility', 'hidden');
                $('.prev_fabric').css('visibility', 'hidden');
            }
            sessionStorage.setItem('qrSupplierId', JSON.stringify(qrSupplierId));
            _pluginConfigureData = pluginConfigureData(r.loadProductsByFabricResponseDto);
            configuration = setConfiguration(false);
            isLogin = false;
            if ($('body').hasClass('q3dlite')) {
                $('.last_drap_fab').text($('#appendFabricList li.active .fabric_list_wrap').attr('id'));
            } else {
                $('.last_drap_fab').text($('#appendFabricList li.active .fabric_img').attr('id'));
            }

            $('.fabric_count span').text(`Count : ${(r.loadProductsByFabricResponseDto).length}`);
            loadPlugin(isLogin, loadAllfabric, qrSupplierId, qrRoleID);
            $(".client_logo").empty().append('<img class="client_logo_img" src=' + r.loginOrgResponse.org_logoImg_url + ">");
            let domainName = checkClientDomain();
            if (domainName == 'getznertech') {
                let loginbtn_wrap = $('.loginbtn_wrap');
                loginbtn_wrap.css('display', 'none');
                let desk_userdropdown = $('.desk_userdropdown');
                desk_userdropdown.css('display', 'block');
                configuration = setConfiguration(true);
                isLogin = true;
                $(".user_name").empty().text((JSON.parse(sessionStorage.jsonString).userName).toLowerCase());

                var avatarImg = '';
                var avatarImg1 = (JSON.parse(sessionStorage.jsonString).org_userImg_url).replace('var/www/html/textronics/services/tdb/', '');
                var avatarImg2 = $('.profile_img img').attr('src');
                var userName = JSON.parse(sessionStorage.jsonString).userName;

                $(".user_name").html(userName);
                if (avatarImg1) {
                    avatarImg = imageLoad(avatarImg1, userName);
                } else {
                    avatarImg = imageLoad(avatarImg2, userName);
                }
            }
        } else {
            sweetalert_error('Design not found', true);
            //   var domainName = window.location.origin + window.location.pathname;
            //   window.history.pushState('','',domainName);
            //   window.location.reload();
        }
    }).fail(function (jqXhr, textStatus, errorThrown) {
        stopBuffer();
        console.log(error());
    });

} else {

    configuration = setConfiguration(true);
    //console.log(sessionStorage.getItem('jsonString'));
    isLogin = true;
    $(".user_name").empty().text((JSON.parse(sessionStorage.jsonString).userName).toLowerCase());

    var avatarImg = '';
    var avatarImg1 = (JSON.parse(sessionStorage.jsonString).org_userImg_url).replace('var/www/html/textronics/services/tdb/', '');
    var avatarImg2 = $('.profile_img img').attr('src');
    var userName = JSON.parse(sessionStorage.jsonString).userName;

    // $(".user_name").html(userName.charAt(0).toUpperCase() + userName.slice(1));
    $(".user_name").html(userName);
    if (avatarImg1) {
        avatarImg = imageLoad(avatarImg1, userName);
    } else {
        avatarImg = imageLoad(avatarImg2, userName);
    }

    /* $(".user_img")
         .empty()
         .append(
             "<img src=" + (JSON.parse(sessionStorage.jsonString).org_userImg_url).replace('var/www/html/textronics/services/tdb/','') + ">"
         );*/
    $(".client_logo")
        .empty()
        .append(
            '<img class="client_logo_img" src=' +
            (JSON.parse(sessionStorage.jsonString).org_logoImg_url).replace('var/www/html/textronics/services/tdb/', '') +
            ">"
        );
    loadPlugin(isLogin);
}
function loadPlugin(isLogin, loadAllfabric, qrSupplierId, qrRoleID) {
    let u_OrganisationId = "";
    if (isLogin) {
        u_OrganisationId = JSON.parse(
            sessionStorage.getItem("jsonString")
        ).organisationId;
    } else {
        u_OrganisationId = JSON.parse(sessionStorage.qrScanDataAuth).organisationId;
    }
    const firstAppendProduct = undefined;
    setconfigurationWiseContent(configuration);
    // debugger
    q3d_Plugin = new Tds.DotNetQ3d({
        ServiceUrl: serviceUrl,
        OrganisationId: u_OrganisationId,
        data: sessionStorage.getItem("data") ?? undefined,
        texture: isLogin ? undefined : qrRenderImage(),
        defaultThreeDImage: loadAllfabric ? undefined : isLogin ? undefined : _pluginConfigureData.threeDImageId ? _pluginConfigureData.threeDImageId : undefined,
        isRedirect: isLogin ? false : _pluginConfigureData.threeDImageId ? true : false,
        container: "modelbox",
        //   dracoPath: 'https://www.gstatic.com/draco/versioned/decoders/1.5.5/',
        dracoPath: darcoPath,
        isShowProduct: isLogin ? false : _pluginConfigureData.isShowProduct ? true : false,
        twidth: isLogin ? undefined : parseFloat(_pluginConfigureData.designSize.split(',')[0]),
        theight: isLogin ? undefined : parseFloat(_pluginConfigureData.designSize.split(',')[1]),
        isQ3d: true,
        debug: true,
        designProductName: isLogin ? undefined : _pluginConfigureData.designProductName,
        CursorZoom: configuration.q3d_double_click_zoom,
        rotationWithPan: configuration.q3d_rotation_with_pan,
        productName: undefined,//isLogin ? configuration.q3d_product_name ? configuration.q3d_product_name : undefined : _pluginConfigureData.productName ? _pluginConfigureData.productName : undefined,
        onConfigLoad: function () {
            //console.log("onConfigLoad")
        },
        OnObjectVisible: function () {
            // console.log("OnObjectVisible")
        },
        onImageChange: function () {
            appendDownloadOptions();
            if (FirstModelCount == 1) {
                stopBuffer();
                const ThreeDImageId = $('.style_thumb li.active').attr('id');
                const fabName = $('#appendFabricList li.active .fabric_img').attr('id');
                fabName ? saveFabricDrapeCount(ThreeDImageId, fabName, true) : '';
                //stopBuffer();
            }
            FirstModelCount++;
        },
        onObjectClick: function (name, orderNo, modelFlag) {
            // const element = $("#groupInfo").children();
            // for (let i = 0; i < element.length; i++) {
            //     const elname = element[i].attributes[3].value.toLowerCase();
            //     if (elname === name.toLowerCase()) {
            //         element[i].click();
            //         break;
            //     }
            // }
        },
        onTextureChange: function () {
            // console.log("onTextureChange");
        },
        onDataLoad: function () {
            if (isLogin) {
                appnedStyleImage(
                    u_OrganisationId,
                    q3d_Plugin,
                    configuration.q3d_product_name,
                    isLogin,
                    loadAllfabric,
                    qrSupplierId,
                    qrRoleID
                );
            } else {
                appnedStyleImage(
                    u_OrganisationId,
                    q3d_Plugin,
                    _pluginConfigureData.productName,
                    isLogin,
                    loadAllfabric,
                    qrSupplierId,
                    qrRoleID
                );
                //stopBuffer();
            }
        },
    });
}

/* the code added by @Seema*/
function imageLoad(imageUrl, userName) {
    var imageUrl = imageUrl;
    const firstLetter = userName.charAt(0).toUpperCase();
    var img = new Image();
    img.onload = function () {
        $('.user_img img').attr('src', imageUrl);
    };
    img.onerror = function () {
        $('.user_img img').css('display', 'none');
        $('.user_img').append('<span><b>' + firstLetter + '</b><span>');
    };
    // Start loading the image
    img.src = imageUrl;
}

function setconfigurationWiseContent(configuration) {
    if (!configuration.q3d_share_option) {
        //All Share option
        // $('.share_btn').css('display', 'none')
    } else {
        if (!configuration.q3d_download_option) {
            $("#downloadButton").css("display", "none");
        }
    }
    if (!configuration.q3d_drape_option) {
        $("#drape_option").css("display", "none");
    }
    if (!configuration.q3d_tryon_visible) {
        if (isTotem()) {
            $('.tryon_btn_wrap').css('display', 'none');
        }
    }
    if (configuration.q3d_upload_fabrics) {

        $('.upload_btn').css('display', 'flex');
    } else {
        if (!isLogin) {
            $('#uploadBtn').css('display', 'none');
        }
    }

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
        for (var o = -1, a = 0; a < e.length; a++)
            o = (o >>> 8) ^ r[255 & (o ^ e.charCodeAt(a))];
        return (-1 ^ o) >>> 0;
    })(atob(n).slice(-16, -12))
        .toString(16)
        .toUpperCase();
}
function qrRenderImage() {
    let faburl = "";
    if (configuration.q3d_draping_file) {
        faburl = _pluginConfigureData.thumbImagePath
            .replaceAll("/t/", `/${configuration.q3d_draping_file}/`)
            .replaceAll("t.jpg", `${configuration.q3d_draping_file}.jpg`);
    }
    return faburl;
}
function getDesignUrl(basePath, designName) {
    let fabUrl = [];
    fabUrl[0] = basePath;
    fabUrl[1] = basePath.replaceAll("/t/", "/b/").replaceAll("t.jpg", "b.jpg");
    fabUrl[2] = basePath.replaceAll("/t/", "/z/").replaceAll("t.jpg", "z.jpg");
    return fabUrl;
}
function pluginConfigureData(fabricdata) {
    let _fabdata = fabricdata[0];
    let designUrl = getDesignUrl(_fabdata.thumbImagePath, _fabdata.designAdvName);
    let pluginConfData = new Object();
    pluginConfData.threeDImageId = _fabdata.threeDImageId;
    pluginConfData.designAdvName = _fabdata.designAdvName;
    pluginConfData.productName = _fabdata.productName;
    pluginConfData.isShowProduct = _fabdata.isShowProduct;
    pluginConfData.designSize = _fabdata.designSize;
    pluginConfData.designProductName = _fabdata.designProductName;
    pluginConfData.thumbImagePath = designUrl[0];
    pluginConfData.zoomImagePath = designUrl[1];
    pluginConfData.bestFitImage = designUrl[2];
    return pluginConfData;
}
function isTotem() {
    if (window.screen.width == 1080 && window.screen.height == 1920) {
        return true;
    } else {
        return false;
    }
}
//getzner Purpose : Added Dynamic Image size 
function appendDownloadOptions() {
    setTimeout(function () {
        var threeDImagesWH = q3d_Plugin.getThreeDImageSize();
        var op = '<option value="1" width="' + threeDImagesWH.width + '" height="' + (threeDImagesWH.height) + '">' + threeDImagesWH.width + ' x ' + (threeDImagesWH.height) + ' (x 1.0)</option>';
        op += '<option value="1.5" width="' + (threeDImagesWH.width * 1.5) + '" height="' + (threeDImagesWH.height * 1.5) + '">' + (threeDImagesWH.width * 1.5) + ' x ' + (threeDImagesWH.height * 1.5) + ' (x 1.5)</option>';
        op += '<option value="2" width="' + (threeDImagesWH.width * 2) + '" height="' + (threeDImagesWH.height * 2) + '">' + (threeDImagesWH.width * 2) + ' x ' + (threeDImagesWH.height * 2) + ' (x 2.0)</option>';
        op += '<option value="2.5" width="' + (threeDImagesWH.width * 2.5) + '" height="' + (threeDImagesWH.height * 2.5) + '">' + (threeDImagesWH.width * 2.5) + ' x ' + (threeDImagesWH.height * 2.5) + ' (x 2.5)</option>';
        $('#downloadWH').empty().append(op);
    }, 300);
}
// q3dLite Working Event 18-10-2024
$('body').on('click', '.fab_fullview', function () {
    q3dLiteOpenFullview();
})
// $('body').on('click', '#apply_button', function(){
// })
$('body').on('click', '.fabric_list_wrap', function () {
    if ($('#appendFabricList li.active .fab_thumb_name').text().toLowerCase() != $($(this).children()[2]).text())
        q3dLiteChangeFabric($(this));
});
$('body').on('click', '.style_list_wrap', function () {
    if ($('#AppendAllStyle li.active .style_list_wrap .style_thumb_name').text().toLowerCase() != $($(this).children()[1]).text().toLowerCase()) {
        q3dLiteChangeModel($(this));
    }
});
//getzner Purpose : added Event 
$('body').on('click', '#resetModel', function () {
    q3d_Plugin.resetModel();
});

$('body').on('click', '#modelFabricRefreshBtn', function () {
    const activeGroupNumber = parseInt($('#groupInfo .active').attr('groupno'));
    q3d_Plugin.resetTexture(activeGroupNumber);
    $('.last_drap_fab').text();
    $('#appendFabricList li.active').removeClass('active');
    //Tailoriconfig.resetTexture(group['orderNo'])
});
//getzner purpose: added event info label
$('body').on('click', '.g_info_head', function () {

    if ($($(this).children()[0]).text() != $('.info_wrap.active .g_info_name').text()) {
        $('.info_wrap').removeClass('active');//g_info_head
        $(this).parent().addClass('active');
    } else {
        $('.info_wrap').removeClass('active');
    }
})
//getzner purpose: added event download btn 
$('body').on('click', '.download_pdf_info', function () {
    downloadPDF($(this));
})

$('body').on('click', '.info_download_btn input', function () {
    let id = $(this).attr('id');
    if ($("div[id='" + id + "'] .g_info_body input").prop('checked')) {
        $("div[id='" + id + "'] .g_info_body input").prop('checked', false);
    } else {
        $("div[id='" + id + "'] .g_info_body input").prop('checked', true);
    }
})
$('body').on('click', '#fabricList li', function (event) {

    if (event.currentTarget.id == 'myUpd') {
        upd_openMyUpload()
        $(".fab_search_filter").find("*").prop("disabled", true);
        $(".sorting_dropdown").find("*").prop("disabled", true);

    } else {
        $(".fab_search_filter").find("*").prop("disabled", false);
        $(".sorting_dropdown").find("*").prop("disabled", false);
        $("#myuploadFabric li").removeClass('active')
        $("#myuploadFabric").hide()
        $("#appendFabricList").css("display", "flex")
        q3d_appendFabric($(this));
    }

});
$("body").on("click", "#shareButton", function () {
    // $('.share_btn').toggleClass("active");//css("display", "none");
    if (configuration.q3d_share_option) {
        $(".share_btn").toggleClass("active");
    }
});
$("body").on("click", ".btn_fabric_lib", function (e) {
    e.stopPropagation();
    $(".fabric_lib").toggle("active");
    $(".group_by_dropdown ul").hasClass("show") ? $(".group_by_dropdown ul").removeClass("show") : null;
    //TODO Working
    // $('#productTypeGroup').removeClass('show');
    // $('#productTypeGroup').css('display', 'none');
    // $('#sortByDropdown').removeClass('show');
    // $('#sortByDropdown').css('display', 'none');
});
//click on model drape fabric
$("body").on("click", "#myuploadFabric .fabric_thumb_wrap", function (event) {
    $("#myuploadFabric li").removeClass('active')
    $('#appendFabricList li').removeClass('active')
    const target = event.currentTarget
    const designUrl = target.firstChild.style.backgroundImage.split('"')[1] || undefined
    const size = target.attributes?.designSize?.value?.split(",") || [1, 1]
    const index = target.attributes?.index?.value
    const designName = target.attributes?.designName?.value
    target.parentElement.classList.add("active")

    upd_drapeUplodedFabric(index, designUrl, parseFloat(size[0]), parseFloat(size[1]), designName)
});

$("#appendFabricList li.fabric_img").unbind("click");
$("body").on("click", "#appendFabricList .fabric_thumb_wrap", function () {
    prevdrapFabricOnModel($(this));
});

//style dropdown selected
$(".style_lib").on("click", "li", function (e) {
    e.stopPropagation();
    q3d_changeStyleModel($(this));
});

//without portait mode display fabric button
$("#fabricButton").unbind("click");
$("#fabricButton").on("click", function () {
    $(".fabric").toggle();
    $(".style").css("display", "none");
    h_fabric_panel();
});

//without portait mode display style button
$(".menu_buttons").on("click", "#styleButton", function () {
    $(".style").toggle();
    $(".fabric").css("display", "none");
    $("#styleThumbImageList").addClass("active");
    h_style_panel();
    //addRemoveActiveClass(["#styleButton"],["#fabricButton"])
});

$("body").on("click", ".Filters", function () {
    if ($('#filter_popup input[type="checkbox"]').length == 0) {
        q3d_Filter();
    }
});
$("body").on("click", ".fabric_reset", function () {
    q3d_resetFilter();
});
$("body").on("click", ".group_by_dropdown ul li", function () {
    q3d_ptpgFilter($(this));
});
$("body").on("click", ".filter_result", function () {
    q3d_clickOnFilterBtn(); //$('#filter_popup input[type="checkbox"]:checked')
    $("#filter_popup").removeClass("show");
    $("#filter_popup").css("display", "none");
});

$(".fabric_style_btn").unbind("click");
$("body").on("click", ".fabric_style_btn", function () {
    $(".fabric_style_btn img").toggleClass("active");
    $(".thumb_list_wrap div").toggleClass("active");
});

//getzner click on technical sheet btn Events
$('body').on('click', '#technicalSheetBtn', function () {
    getznerTechnicalSheet();
})
$('body').on('click', '#designInfoBtnG', function () {
    clickOnGetznerInfoBtn();
});

$('body').on("click", ".s_btn.Whatsapp", function () {
    shareOnWhatsApp();
})
// $("body").on("click", ".features_close", function (event) {
//     $(".fab_features").css("display", "none");
//   })

/*********************************************************************/
$("body").on("click", ".fab_info_btn", function () {
    $(".fab_features").toggle();
    q3d_getProductFeature();
});
/*********************************************************************/
$("body").on("click", ".style_thumb_wrap", function () {
    q3d_changeStyleModel($(this), true);
});

let lastKeyTime = 0;
let currentTime = 0
let isBarcodeScan = false;
let counter = 0;
//*********************************************************************/
$('body').on('click', '.fab_search_icon2', function () {
    if ($('.fab_search_input2').val() != "") {
        $('.fab_close2').css('display', 'block');
        $('.fab_search_icon2').css('display', 'none');
        q3d_textSearch($('.fab_search_input2').val());
    } else {
        sweetalert_warning('plaese Enter Fabric Name');
    }
});

$("body").on("click", ".fab_close2", function () {
    $(".fab_close2").css("display", "none");
    $(".fab_search_icon2").css("display", "block");
    $(".fab_search_input2").val("");
    q3d_resetTextSearch();
});

$('body').on('keyup', '.fab_search_input2', function (e) {
    if (counter == 0) {
        currentTime = new Date().getTime();
        counter++
    }


    if (e.keyCode == 13) {
        $('.fab_close2').css('display', 'block');
        $('.fab_search_icon2').css('display', 'none');
        lastKeyTime = new Date().getTime();
        const timeDiff = lastKeyTime - currentTime;
        if (timeDiff < 1000) { // 50ms is the threshold for determining manual input
            isBarcodeScan = true;
            counter = 0;
            lastKeyTime = 0
            currentTime = 0
        } else {
            counter = 0;
            lastKeyTime = 0
            currentTime = 0
        }
        if ($('.fab_search_input2').val() != '') {
            q3d_textSearch($('.fab_search_input2').val(), isBarcodeScan);
            isBarcodeScan = false;
            $('.fab_search_input2').val('');
            $('.fab_close2').css('display', 'none');
            $('.fab_search_icon2').css('display', 'block');
        } else {
            sweetalert_warning('plaese Enter Fabric Name');
        }
    } else if (e.keyCode == 8) {
        if ($(".fab_search_input2").val() == "") {
            $(".fab_close2").css("display", "none");
            $(".fab_search_icon2").css("display", "block");
            q3d_resetTextSearch();
        }
    }
});
//*********************************************************************/
$("body").on("click", ".fab_search_icon3", function () {


    if ($(".fab_search_input3").val() != "") {
        $(".fab_close3").css("display", "block");
        $(".fab_search_icon3").css("display", "none");
        if (isTotem()) {
            q3d_TotemtextSearch($(".fab_search_input3").val());
        } else {
            q3d_textSearch($(".fab_search_input3").val());
        }

    } else {
        sweetalert_warning('plaese Enter Fabric Name');
    }
});

$("body").on("click", ".fab_close3", function () {
    $(".fab_close3").css("display", "none");
    $(".fab_search_icon3").css("display", "block");
    $(".fab_search_input3").val("");
    $(".fab_search_input3").focus();
    if (!isTotem()) {
        q3d_resetTextSearch();
    }
});

$("body").on("keyup", ".fab_search_input3", function (e) {
    e.preventDefault();
    if (counter == 0) {
        currentTime = new Date().getTime();
        counter++
    }

    if (e.keyCode == 13) {
        $(".fab_close3").css("display", "block");
        $(".fab_search_icon3").css("display", "none");
        lastKeyTime = new Date().getTime();
        const timeDiff = lastKeyTime - currentTime;
        if (timeDiff < 1000) { // 50ms is the threshold for determining manual input
            isBarcodeScan = true;
            counter = 0;
            lastKeyTime = 0
            currentTime = 0
        } else {
            counter = 0;
            lastKeyTime = 0
            currentTime = 0
        }
        if ($(".fab_search_input3").val() != "") {
            if (isTotem()) {
                q3d_TotemtextSearch($(".fab_search_input3").val(), isBarcodeScan);
                isBarcodeScan = false
            } else {
                q3d_textSearch($(".fab_search_input3").val(), isBarcodeScan);
                isBarcodeScan = false;
            }

        } else {
            sweetalert_warning('plaese Enter Fabric Name');
        }
    } else if (e.keyCode == 8) {
        if ($(".fab_search_input3").val() == "") {
            $(".fab_close3").css("display", "none");
            $(".fab_search_icon3").css("display", "block");
            if (!isTotem()) {
                q3d_resetTextSearch();
            }
        }
    } else {
        if (isTotem()) {
            $(".fab_close3").css("display", "block");
        }
    }
});

//*********************************************************************/
$('body').on('click', '.fab_search_icon1', function () {

    if ($('.fab_search_input1').val() != "") {
        $('.fab_close1').css('display', 'block');
        $('.fab_search_icon1').css('display', 'none');
        q3d_textSearch($('.fab_search_input1').val());
    } else {
        sweetalert_warning('plaese Enter Fabric Name');
    }
});

$("body").on("click", ".fab_close1", function () {
    $(".fab_close1").css("display", "none");
    $(".fab_search_icon1").css("display", "block");
    $(".fab_search_input1").val("");
    q3d_resetTextSearch();
    $("#q_main").removeClass("input_resize");
});

$("body").on("keyup", ".fab_search_input1", function (e) {
    if (counter == 0) {
        currentTime = new Date().getTime();
        counter++
    }

    if (e.keyCode == 13) {
        $(".fab_close1").css("display", "block");
        $(".fab_search_icon1").css("display", "none");
        lastKeyTime = new Date().getTime();
        const timeDiff = lastKeyTime - currentTime;
        if (timeDiff < 1000) { // 50ms is the threshold for determining manual input
            isBarcodeScan = true;
            counter = 0;
            lastKeyTime = 0
            currentTime = 0
        } else {
            counter = 0;
            lastKeyTime = 0
            currentTime = 0
        }
        if ($(".fab_search_input1").val() != "") {
            q3d_textSearch($(".fab_search_input1").val(), isBarcodeScan);
            isBarcodeScan = false;
            // $('.fab_search_input1').val('');
            // $('.fab_close1').css('display', 'none');
            // $('.fab_search_icon1').css('display', 'block');
        } else {
            sweetalert_warning('plaese Enter Fabric Name');
        }
    } else if (e.keyCode == 8) {
        if ($(".fab_search_input1").val() == "") {
            $(".fab_close1").css("display", "none");
            $(".fab_search_icon1").css("display", "block");
            q3d_resetTextSearch();
        }
    }
});
//*********************************************************************/

//getzner Working Added 
$("#no_bg").unbind('change');
$('#no_bg').change(function () {
    if (!$(this).is(":checked")) {
        $('#imgFormat option').eq(1).prop('selected', 'true');
        $('#imgFormat option').eq(0).prop('disabled', true);
    } else {
        $('#imgFormat option').eq(0).prop('disabled', false);
    }
})


$("body").on("click", ".sort_by_dropdown ul li", function () {
    q3d_SortingFilter($(this));
    $('.sort_by_dropdown ul li').removeClass('active');
    $(this).addClass('active');
})
$('body').on('click', '.header_options', function () {

    // $(this).parent().toggleClass('active');
    if ($($(this).children()[0]).text() != $('.filter_wrap.active .option_name').text()) {
        $('.filter_wrap').removeClass("active");
        $(this).parent().addClass('active');
    } else {
        $('.filter_wrap').removeClass("active");
    }
})
// $('body').on('click', '.filter_wrap', function(){
//     $(this).toggleClass('active');
// })
$('body').on('click', '.apply_button', function () {
    openFullviewApplyBtn();
})

$('#getznerPopupDownload').unbind('click');
$('body').on('click', '#getznerPopupDownload', function () {
    getznerPopupDownload(q3d_Plugin);
});

$('#downloadButton').unbind('click');
$("body").on('click', "#downloadButton", function () {
    if (sessionStorage.visit_demo == 'false') {
        const userType = sessionStorage.getItem('userType');
        if (!hasCredits('Download') && userType == 1 && userType == 2) {
            $('#common_notification').text('No more download credits left!');
            $('#common_notification').show();
            setTimeout(() => { $('#common_notification').hide(); }, 2000);
            return; // ? exit early
        }
        if (configuration.q3d_is_custom_download) { //configuration.q3d_is_custom_download
            $('#download_popup').addClass('show');
            $('#download_popup').css('display', 'block');
        } else {
            let clearTime = null;
            q3d_Plugin.resetModel();
            clearTimeout(clearTime);
            clearTime = setTimeout(() => {
                downloadQ3dModel(q3d_Plugin);
            }, 2000);
        }
    } else {
        $('#common_notification').text('Please login to download the file');
        $('#common_notification').show();
        setTimeout(() => {
            $('#common_notification').hide();
        }, 3000);
    }

});
$('body').on('click', ".d_popup_close", function () {
    $('#download_popup').removeClass('show');
    $('#download_popup').css('display', 'none');
})
$('#copyLinkButton').unbind('click');
$("body").on('click', "#copyLinkButton", function () {
    q3d_CopyLink();
    //$tempInput.remove();
});

$("#crossButton").on("click", function () {
    $(".fabric").css("display", "none");
    $(".style").css("display", "none");
});

$("#crossButton1").on("click", function () {
    $(".fabric").css("display", "none");
    $(".style").css("display", "none");
});

$("body").on("click", ".btn_style_lib", function (e) {
    $(".style_lib").animate({
        height: "toggle",
        width: "toggle",
    });
    $(".style_lib").toggleClass("active");
    e.stopPropagation();
});

// $('body').on('click', '#tryonbt', function() {
//     import("../css/tryon.css").then((Module)=>{
//     });
//     q3d_initializeTron();
//    // console.log(tryon_body);
// });

$("body").on("click", ".fabric_info", function (event) {
    if ($('#fabric_fullview').css('display') == 'none') {
        $('#fabric_fullview').css('display', 'block');
        $(".modal-backdrop").css("visibility", "hidden");
        $('#fabric_fullview').addClass('show');
        $('#filter_popup').removeClass('show');
        $('#filter_popup').css('display', 'none');

        if (!d_portrait()) {
            let h_model = $(".model").height();
            $("#fabric_fullview").css("height", `${h_model}px`);
        }
        event.stopImmediatePropagation();
        q3d_openFullView($(this));
    } else {
        event.stopImmediatePropagation();
        q3d_openFullView($(this));
    }
});

$("body").on("click", ".show_more", function (event) {
    $(".fab_row").toggleClass("active");
});
$("body").on("click", ".features_close", function (event) {
    $(".fab_features").css("display", "none");
});

$("body").on("click", "#groupInfo > div", function (e) {
    q3d_switchOnGroupBtn($(this));
});

// $('body').on('click', '.loginCrossBtn', function(){
//     $('#login_side_panel').removeClass('show');
// })
//working IN ToDo Dont Remove
$("#appendFabricList").unbind("scroll");
$("#appendFabricList").on("scroll", function (e) {
    e.stopImmediatePropagation();
    let className = document.getElementById("appendFabricList");
    let clientHeight,
        scrollCurrentPos,
        scrollHeight = 0;
    if (!isdeskStop()) {
        if ($(".fabric_exp_red").length > 0) {
            clientHeight = className.clientHeight;
            scrollHeight = className.scrollHeight;
            scrollCurrentPos = $("#appendFabricList").scrollTop();
        } else {
            clientHeight = className.clientWidth;
            scrollHeight = className.scrollWidth;
            scrollCurrentPos = $("#appendFabricList").scrollLeft();
        }
    } else {
        clientHeight = className.clientHeight;
        scrollHeight = className.scrollHeight;
        scrollCurrentPos = $("#appendFabricList").scrollTop();
    }

    let totalScrollHeight = scrollHeight - clientHeight;
    console.log(totalScrollHeight, "----------", scrollCurrentPos);

    if (
        (totalScrollHeight == Math.floor(scrollCurrentPos) &&
            totalScrollHeight != 0) ||
        (totalScrollHeight == Math.floor(scrollCurrentPos) + 1 &&
            totalScrollHeight != 0)
    ) {
        console.log(
            totalScrollHeight < Math.round(scrollCurrentPos) + 3 &&
            totalScrollHeight != 0
        );
        //e.stopPropagation();
        checkScrollBarPos();
    }
});
$("#q3dLiteappendFabricList").unbind("scroll");
$('#q3dLiteappendFabricList').on('scroll', function (e) {
    e.stopImmediatePropagation();
    let className = document.getElementById('q3dLiteappendFabricList');
    let clientHeight, scrollCurrentPos, scrollHeight = 0
    if (!isdeskStop()) {
        if (isTotem()) {
            clientHeight = className.clientHeight;
            scrollHeight = className.scrollHeight;
            scrollCurrentPos = $('#q3dLiteappendFabricList').scrollTop();
        } else {
            clientHeight = className.clientWidth;
            scrollHeight = className.scrollWidth;
            scrollCurrentPos = $('#q3dLiteappendFabricList').scrollLeft();
        }
    } else {
        // clientHeight = className.clientHeight;
        // scrollHeight = className.scrollHeight;
        // scrollCurrentPos = $('#appendFabricList').scrollTop();
    }

    let totalScrollHeight = scrollHeight - clientHeight;
    console.log(totalScrollHeight, "----------", scrollCurrentPos);

    if ((totalScrollHeight == (Math.floor(scrollCurrentPos)) && totalScrollHeight != 0) || (totalScrollHeight == (Math.floor(scrollCurrentPos) + 1) && totalScrollHeight != 0)) {
        console.log(totalScrollHeight < (Math.round(scrollCurrentPos) + 3) && totalScrollHeight != 0);
        //e.stopPropagation();
        q3dLiteCheckScrollBarPos();
    }
});

$('body').on('click', '.prev_fabric', function () {
    // console.log("click to prev")
    clickOnModelPrevBtn();
});

$("body").on("click", ".next_fabric", function () {
    // console.log("click to next");
    clickOnModelNextBtn();
});
$("body").on("click", ".fullview_prev_fabric", function () {
    // console.log("click to prev");
    clickOnFullviewPrevBtn();
});

$("body").on("click", ".fullview_next_fabric", function () {
    // console.log("click to next");
    clickOnFullviewNextBtn();
});

$("body").on("click", ".btn_close", function () {
    q3d_clickOnFullviewCloseBtn();
});
$("#slide-offset").on("input", function () {
    var newVal = $(this).val();
    $("#input-offset").val(newVal);
    textureOperation();
});
$("#input-offset").on("input", function () {
    $("#slide-offset").val($(this).val());
    textureOperation();
});

$("#slide-offset-b").on("input", function () {
    var newValb = $(this).val();
    $("#input-offset-b").val(newValb);
    textureOperation();
});
$("#input-offset-b").on("input", function () {
    //console.log($(this).val())
    $("#slide-offset-b").val($(this).val());
    textureOperation();
});

// rotate slider starts
$("#slide-rotate").on("input", function () {
    var newValb = $(this).val();
    $("#input-rotate").val(newValb);
    textureOperation();
});
$('#hue').on("input", function () {
    var newValb = $(this).val();
    // newValb = parseFloat(newValb / 100);
    $('#input-hue').val(newValb);
    textureOperation();
}) //input-hue
$('#input-hue').on("input", function () {
    var newValb = $(this).val();
    // newValb = parseFloat(newValb / 100);
    $('#hue').val(newValb);
    $('#input-hue').val(newValb);
    textureOperation();
})
$("#input-rotate").on("input", function () {
    //console.log($(this).val())
    $("#slide-rotate").val($(this).val());
    textureOperation();
});

$("#slide-scale").on("input", function () {
    var newValb = $(this).val();

    $("#input-scale").blur();
    $("#input-scale").val(newValb);
    $("#input-scale").blur();
    textureOperation();
});
$("#input-scale").on("input", function () {
    //console.log($(this).val())
    $("#slide-scale").val($(this).val());
    textureOperation();
});

$(".login_strip").unbind("click");
$("body").on("click", ".login_strip", function () {
    sessionStorage.removeItem("userLog");
    let domainName = window.location.origin + window.location.pathname;
    window.history.pushState("", "", domainName);
    window.location.reload();
});

// $("body").on("click", "#userMenuBar li", function () {
//     $("#userMenuBar li .dropdown-item.active").removeClass("active");
//     $(this).children().addClass("active");
//     if ($(this).attr("id") == "myProfile") {
//         //q3d_myProfile, q3d_changePassword, q3d_logout
//         q3d_myProfile();
//     } else if ($(this).attr("id") == "changePass") {
//         q3d_clickOnLichangePassword();
//     } else if ($(this).attr("id") == "logout") {
//         q3d_logout();
//     }
// });

// $("body").on("click", ".list-group-flush li", function () { 
//     $(".list-group-flush li.active").removeClass("active");
//     $(this).addClass("active");
//     if ($(this).attr("id") == "myProfile") {
//         //q3d_myProfile, q3d_changePassword, q3d_logout
//         q3d_myProfile();
//     } else if ($(this).attr("id") == "changePass") {
//         q3d_clickOnLichangePassword();
//     } else if ($(this).attr("id") == "Logout") {
//         q3d_logout();
//     }
// });

$("body").on("click", ".change_save", function () {
    q3d_changePassword();
});
$("body").on("click", function () {
    if (isdeskStop()) {
        if ($(".style_lib").hasClass("active")) {
            $(".btn_style_lib").click();
        }
        if ($(".fabric_lib ").css("display") == "block") {
            $(".fabric_lib ").css("display", "none");
        }
    }
});

$("body").on("change", "#myfile", function () {
    q3d_changeUserProfilePhoto(this);
});
$("body").on("click", "#updateProfile", function () {
    q3d_UpdateProfile();
});

$("body").on("click", ".pass_Old_eye", function () {
    $(".pass_Old_eye").toggleClass("active");
    let pass = document.getElementById("inputPassword1"); //$('#inputPassword1');
    if ($(".pass_Old_eye").hasClass("active")) {
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
});
$("body").on("click", ".pass_new_eye", function () {
    $(".pass_new_eye").toggleClass("active");
    let pass = document.getElementById("inputPassword2");
    if ($(".pass_new_eye").hasClass("active")) {
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
});
$("body").on("click", ".pass_confirm_eye", function () {
    $(".pass_confirm_eye").toggleClass("active");
    let pass = document.getElementById("inputPassword3");
    if ($(".pass_confirm_eye").hasClass("active")) {
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
});
$("body").on("click", ".fullviewCloseBtn", function () {
    q3d_clickOnFullviewCloseBtn();
})
// Added Working Getzner Only : purpose : show info Dynamically
$('body').on('click', '.g_btn_info', function () {
    getznerAppendInfo();
});

export function stopAllCameras() {
    if (window.currentStream) {
        window.currentStream.getTracks().forEach(track => {
            track.stop();
            // console.log('Stopped track:', track.kind);
        });
        window.currentStream = null;
        // console.log("All camera streams stopped.");
    } else {
        // console.log("No active camera stream to stop.");
    }
}

// const DOMAIN_NAME = "https://dam3d.in/q3d/";
// const SECRET_KEY = "123456"; 
// Provided constants
const DOMAIN_NAME = "https://dam3d.in/q3d/";
const SECRET_KEY = "123456"; 

function loadTryonPlugin(domainName, secretkey) {
    return $.ajax({
        url: "https://ta.textronic.online/pluginauth",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ domainName, secretkey })
    });
}
window.loadTryonPlugin = loadTryonPlugin;

async function loadThemeJs(url) {
    return new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[src="${url}"]`);
        if (existing) {
            console.log("theme.js already loaded");
            resolve();
            return;
        }
        const script = document.createElement("script");
        script.src = url;
        script.async = true;

        script.onload = () => { 
            console.log(" theme.js loaded");

            setTimeout(() => {
                if (
                    typeof window.initTryOnPlugin === "function" ||
                    typeof window._tdstryoncore !== "undefined"
                ) {
                    resolve();
                } else {
                    reject(new Error("TryOn globals not found after loading theme.js"));
                }
            }, 500);
        };
        script.onerror = () =>
            reject(new Error(`Failed to load theme.js from ${url}`));

        document.head.appendChild(script);
    });
}

async function authenticate() {
    const res = await window.loadTryonPlugin(DOMAIN_NAME, SECRET_KEY);
    return res;
}

async function initializePlugin() {

    if (pluginInitialized) {
        console.log("TryOn already initialized");
        return true;
    }

    if (pluginInitializing) {
        console.log("TryOn initialization in progress");
        return false;
    }

    pluginInitializing = true;

    try {
        const authData = await authenticate();
        const themeJsUrl = authData.fileUrl;
        const vendorname = authData.vendorname;
        window.vendorname = vendorname;
        if (!themeJsUrl) {
            throw new Error("fileUrl missing in authentication response");
        }

        await loadThemeJs(themeJsUrl);
        if (window._tdstryoncore && typeof window.initTryOnPlugin !== "function") {
            console.log(" Auto-initialized by theme.js");
            window.secretkey = SECRET_KEY;
            pluginInitialized = true;
            pluginInitializing = false;
            return true;
        }

        if (typeof window.initTryOnPlugin === "function") {
            console.log(" Initializing TryOn manually...");
            const result = await window.initTryOnPlugin(
                "tryonModal",
                DOMAIN_NAME,
                SECRET_KEY,
                vendorname
            );
            if (result === false) {
                throw new Error("TryOn init returned false");
            }
            pluginInitialized = true;
            pluginInitializing = false;
            console.log(" TryOn initialized successfully");
            return true;
        }
        throw new Error("TryOn SDK did not initialize");

    } catch (error) {
        pluginInitializing = false;
        console.error(" TryOn initialization failed:", error);
        alert(`TryOn initialization failed: ${error.message}`);
        return false;
    }
}

$("body").on("click", "#tryonbt", async function () {

    stopAllCameras();
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cams = devices.filter(d => d.kind === "videoinput");

    if (!cams.length) {
        sweetalert_error("Please check camera connectivity!");
        return;
    }

    // Login check
        if (!(isLogin || loadAllfabric)) {
            $("#common_notification")
                .text("Please login to use TryOn")
                .show();

            setTimeout(() => $("#common_notification").hide(), 3000);
            return;
        }
        startBuffer();
        if ($("#root .tryon-frame").length === 0) {
            $("#root").append(loadTryonUi());
        }
        $("#root .tryon-frame")
            .show()
            .css("visibility", "hidden");
        loadScripts(TryonScripts).then(() => {
            tryonObj();
            clickCounter++;
        let lastdrapeDesignData = window.lastFabricInfo;

    if (lastdrapeDesignData) {
        let designUrl = lastdrapeDesignData.t_fabUrl;
                        let designWidth = parseFloat(lastdrapeDesignData.width);
                        let designHeight = parseFloat(lastdrapeDesignData.height);
                        let designCode = lastdrapeDesignData.designCode;
                        startTryon(q3d_Plugin, designUrl, designWidth, designHeight, designCode, clickCounter);

                        } else {
                            stopBuffer();
                        }
                    }).catch(err => {
                        console.error('loadScripts failed', err);
                        stopBuffer();
                    });
                        // INIT TRYON
                        const ready = await initializePlugin();
                        if (!ready) {
                            stopBuffer();
                            return;
                        }
            });

        function loadScripts(themeJsUrl) {
            const promises = themeJsUrl.map((src) =>
                document.querySelector('script[src="' + src + '"]') ||
                    document.querySelector('link[href="' + src + '"]')
                    ? new Promise((resolve) => {
                        resolve();
                    })
                    : appendScript(src)
            );
            return Promise.all(promises);
            
        }
 const TryonScripts = ["https://plugin.dam3d.in/tryon/v1/tdsInit.js?3.7"]; 
//const TryonScripts = ["http://172.16.10.51/project_2026/Tryon/Plugin/FavorateWorking/virtual_tryon_core/dist/tryon_core_min.js"];

function appendScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.addEventListener("load", resolve);
        script.addEventListener("error", reject);
        document.head.appendChild(script);
    });
}
function tryonObj() {
    window.TdsTryon = Tds;
}

$("body").on("click", ".desk_fab_expand", function (event) {
    $('#filter_popup').removeClass('show');
    $('#filter_popup').css('display', 'none');
    $(".fabric").toggleClass("desk_fab_fullview");
    $(".model").toggleClass("desk_fab_fullview");
    $("#fabric_fullview").toggleClass("desk_fab_fullview");
    hasHScrollBar();
});

//Shubham changes
$("body").on("click", "#uploadBtn", function (event) {
    const userType = sessionStorage.getItem('userType');
    if (!hasCredits('fabric_upload') && userType == 1 && userType == 2) {
        $('#common_notification').text('No more Fabric Upload credits left!');
        $('#common_notification').show();
        setTimeout(() => { $('#common_notification').hide(); }, 2000);
        return; // ? exit early
    }
    $('#filter_popup').removeClass('show');
    $('#filter_popup').css('display', 'none');
    upd_InitiateUpload()
})

