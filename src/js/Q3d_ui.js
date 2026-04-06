import $, { error } from 'jquery';
import { renderlandingPage, ismobile, isTotem, isIpad, bannerImage } from './login.js'
//tryon
$("body").on("click", "#share_fav_btn", function (event) {
  $("#QR_popup").addClass("show");
  $("#QR_popup").css("display", "block");
});

// set dpi popup
$("body").on("click", ".setdpi_btn", function (event) {
  ($('#Setdpi_popup').addClass("setdpi_overlay"));
  if($('#Setdpi_popup').hasClass("setdpi_overlay")){
$(".modal-backdrop.fade").css("opacity", "0.6");
  }
});

$("body").on("click", ".setdpi_close", function (event) {
  $(".modal-backdrop.fade.show").css("opacity", "");
  });

export function d_portrait() {
  return (
    window.innerWidth <= 1024 ||
    (window.screen.width == 1080 && window.screen.height == 1920)
  );
}

export function h_style_panel() {
  if(!d_portrait()){
  let h_style_thumb =  $(".style").height() - $(".btn_style_lib").height();
  $(".style_thumb ul").css("height", `${h_style_thumb}px`);
  $(".style_thumb ul").css("padding-bottom", `20px`);
  $(".style_thumb ul").css("box-sizing", "border-box");
  }else{
    $(".style").css("height", "");
    $(".style_thumb ul").css("height", "");
    $(".style_thumb ul").css("padding-bottom", ``);
    $(".style_thumb ul").css("box-sizing", "");
  }
}

export function h_fabric_panel() {
  if(!d_portrait()){
  let h_fabric_thumb =  $(".fabric").height() - ( $(".fab_features_wrap").height() +  $(".fabric_count").height())
  // $(".fabric_thumb ul").css("height", `${h_fabric_thumb}px`);
  $(".fabric_thumb ul").css("max-height", `${h_fabric_thumb}px`);
  $(".fabric_thumb ul").css("padding-bottom", `10px`);
  $(".fabric_thumb ul").css("box-sizing", "border-box");
  }else{
     $(".fabric").css("height", "");
    $(".fabric_thumb ul").css("max-height", "");
    $(".fabric_thumb ul").css("height", "");
    $(".fabric_thumb ul").css("padding-bottom", ``);
    $(".fabric_thumb ul").css("box-sizing", "");
  }
}

$("body").on("click", ".desk_userdropdown", function (event) {
  if($('#filter_popup').css('display') == 'block'){
    $('#filter_popup').css('display', 'none');
    $('#filter_popup').removeClass("show");
  }
  // if($('#fabric_fullview').css('display') == 'block' && $(".fabric").hasClass("desk_fab_fullview") ){
  //   $('#fabric_fullview').css('display', 'none');
  //   $('#fabric_fullview').removeClass("show");
  // }
   if($('#fabric_fullview').css('display') == 'block'){
    $('#fabric_fullview').css('display', 'none');
    $('#fabric_fullview').removeClass("show");
  }
});
$("body").on("click", "#form-id label", function (event) {
  $(this).siblings()[0].click();
}) 
$("body").on("focus", ".fab_search_input1", function (event) {
  if (d_portrait()) {
    $("#q_main").addClass("input_resize");
  }
});

// filter popup

$("body").on("click", ".fab_fillter", function (event) {
  $(".modal-backdrop").css("display", "none");
  $("#filter_popup").addClass("show");
  $("#filter_popup").css("display", "block");
  if(!d_portrait()){
    let h_model = $(".model").height();
    $("#filter_popup").css("height", `${h_model}px`);
    }
});

$("body").on("click", ".filter_close", function (event) {
  $("#filter_popup").removeClass("show");
  $("#filter_popup").css("display", "none");
});

// switch menu starts

$("body").on("click", ".show-check", function (event) {
  var w_Width = $(window).width();
  if ($(this).prop("checked") && w_Width < 768) {
    $(this).parents(".myproduct").find(".settings_window").fadeIn("slow");
    $(".sbutton.socialbt").css({ display: "none" });
    $(".icon_set_b").hide();
  } else if ($(this).prop("checked")) {
    $(this).parents(".myproduct").find(".settings_window").fadeIn("slow");
    $(".icon_set_b").hide();
  } else {
    $(this).parents(".myproduct").find(".settings_window").fadeOut("slow");
    $(".icon_set_b").show();
  }
  if($("body").hasClass("q3dlite")){
    $(".fab_fullview").toggle();
    $(".product_group").toggle();
  }else{
    $(".prev_fabric").toggle();
    $(".next_fabric").toggle();
  }
});

// switch menu select option starts

$("body").on("click", "#form-id input[type='radio']", function (event) {
  var inputValue = $(this).attr("value");
  var targetBox = $("." + inputValue);
  $(".box").not(targetBox).hide();
  $(targetBox).show();
});

// resize style and fabric panel
function allFabrics_resize() {
  let fabric_expand_mode =
    window.innerHeight -
    ($(".menu_buttons").height() +
      $(".btn_fabric_group").height() +
      $(".fabric_count").height() +
      $(".fab_features_wrap").height());
  $(".fabric").hasClass("fabric_exp_red")
    ? $(".fabric_thumb").css("height", fabric_expand_mode)
    : $(".fabric_thumb").css("height", "");
}

function allStyles_resize() {
  let style_expand_mode =
    window.innerHeight -
    ($(".menu_buttons").height() +
      $(".btn_style_group").height() +
      $(".style_lib").height());
  $(".style").hasClass("style_exp_red")
    ? $(".style_thumb").css("height", style_expand_mode)
    : $(".style_thumb").css("height", "");
}
// tanmay Added Working

$("body").on("click", ".fabric_expand", function (event) {
  $(".fabric").toggleClass("fabric_exp_red");
  allFabrics_resize();
  !$(".fabric").hasClass("fabric_exp_red")
    ? $("#q_main").removeClass("input_resize")
    : null;
});

$("body").on("click", ".style_expand", function (event) {
  $(".style").toggleClass("style_exp_red");
  allStyles_resize();
});

// resize model
export function model_height() {
  let model_container = document.querySelector(".model");
  let navbar = document.querySelector(".navbar");
  let menu_buttons = document.querySelector(".menu_buttons");
  let fab_style = document.querySelector(".fabric_style_panel");
  let q3dlite = document.querySelector(".q3dlite");
  let fabric_panel = document.querySelector(".fabric");
  let style_panel = document.querySelector(".style");
  let filter_panel = document.querySelector("#filter_popup");
  let fabric_fullview_panel = document.querySelector("#fabric_fullview");
  let window_height =
    window.innerHeight - (navbar.offsetHeight + menu_buttons.offsetHeight);
  //console.log(window_height);
  // Q3d fabric and style button panels
  //debugger
  if (
    window.innerWidth <= 1024 ||
    (window.screen.width == 1080 && window.screen.height == 1920)
  ) {
    // Q3dlite single fabric and style button panels
    if (document.body.contains(q3dlite) && window.innerWidth <= 1024) {
      model_container.style.height =
        window.innerHeight -
        (navbar.offsetHeight + fab_style.offsetHeight) +
        "px";
    } else if (
      document.body.contains(q3dlite) &&
      window.screen.width == 1080 &&
      window.screen.height == 1920
    ) {
      model_container.style.height =
        window.innerHeight - navbar.offsetHeight + "px";
    } else {
      //fabric & style menubutton
      model_container.style.height = window_height + "px";
      resize_panels(
        fabric_panel,
        style_panel,
        filter_panel,
        fabric_fullview_panel
      );

      // desktop fabric panel class("") remove from dom
      fabric_panel.style.display = "none";
      style_panel.style.display = "none";
      if (
        $(".model").hasClass("desk_fab_fullview") &&
        $(".fabric").hasClass("desk_fab_fullview") &&
        $("#fabric_fullview").hasClass("desk_fab_fullview")
      ) {
        $(".fabric").removeClass("desk_fab_fullview");
        $(".model").removeClass("desk_fab_fullview");
        $("#fabric_fullview").removeClass("desk_fab_fullview");
      }
    }
  } else {
    //desktop screen and landscape view
    model_container.style.height = window.innerHeight - navbar.offsetHeight + "px";
    if(($(".style_thumb ul").length) && (!d_portrait())){
      style_panel.style.height = window.innerHeight - navbar.offsetHeight + "px";
      h_style_panel();
    }else{
        null;
    }
    if(!d_portrait()){
      fabric_panel.style.height = window.innerHeight - navbar.offsetHeight + "px";
      h_fabric_panel();
    }else{
      null;
    }
    ($(".style_thumb ul").length) && (!d_portrait()) ? h_style_panel() : null ;
    fabric_panel.style.display = "block";
    style_panel.style.display = "block";
    resize_panels(
      fabric_panel,
      style_panel,
      filter_panel,
      fabric_fullview_panel
    );
  }
}

function resize_panels(
  fabric_panel,
  style_panel,
  filter_panel,
  fabric_fullview_panel
) {
  // debugger
  // resize the fabric panel for small desktop and tab and ipad landscap view
  //let user_profile = document.getElementById("user_profile");
  if (
    window.innerWidth <= 1300 &&
    window.innerWidth >= 1024 &&
    !(window.screen.width == 1080 && window.screen.height == 1920)
  ) {
    fabric_panel.classList.add("fabric_resize");
    style_panel.classList.add("style_resize");
    filter_panel.classList.add("filter_resize");
    fabric_fullview_panel.classList.add("fabric_fullview_resize");
    // user_profile.classList.add("user_profile_resize");
  } else {
    fabric_panel.classList.remove("fabric_resize");
    style_panel.classList.remove("style_resize");
    filter_panel.classList.remove("filter_resize");
    fabric_fullview_panel.classList.remove("fabric_fullview_resize");
    // user_profile.classList.remove("user_profile_resize");
  }
}

window.addEventListener("resize", (event) => {
  // ($(".style_thumb ul").length) && (!d_portrait()) ? h_style_panel() : null ;
  //debugger;
  if ($("#q_main").hasClass("home_page")) {
    if (!$("#q_main").hasClass("input_resize")){
    model_height();
    }
    let fabric_panel = document.querySelector(".fabric");
    let style_panel = document.querySelector(".style");
    if (fabric_panel.classList.contains("fabric_exp_red")) {
      allFabrics_resize();
    } else if (style_panel.classList.contains("style_exp_red")) {
      allStyles_resize();
    }
  } else {
    renderlandingPage();
  }
});

window.addEventListener("load", (event) => {
  if($("#q_main").hasClass("home_page")){
    model_height()
  }
  //  ?  : renderlandingPage();
});
