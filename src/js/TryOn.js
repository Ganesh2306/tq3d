/* @ tanmay 02-09-2024*/
console.log("Q3d_Appplication_Tryon V2.4 27-02-2026");
import { serviceUrl, darcoPath } from "./config.js";
import { rediretTryonToQ3dDrapeFabric, stopBuffer, startBuffer } from "./q3dFunction.js"
import QRCode from "qrcode";
import html2pdf from "html2pdf.js";
import { lib } from "crypto-js";
let param = {};
let TdsPluginObj = "";
let details = [];
let TryOnConfig, searchDesignData = undefined;
let isBarcodeScan = false;
let currentInjectedClothingType;
let counter = 0;
let startTime = 0;
let tryonProduct = ['women dress', 'school uniform', 'hijab', 'kurta', 'suit', 'ethnic', 'sherwani']
let Gender,
  tryonThreedimage,
  Tproduct,
  tryonThreedCol, backBtnClickDesignData = undefined;
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
  startBufferLoader();
  $("video")[0].play();
  let libraryName = $("#styleThumbImageList li.active")
    .attr("fab-product")
    .toLowerCase();
     const TOP_WEAR = ["shirt", "jacket"];
     const BOTTOM_WEAR = ["trouser"];
     const FULL_WEAR = ["suit"];

if (FULL_WEAR.includes(libraryName)) {
  currentInjectedClothingType = "Fullset_Clothing";
}
else if (BOTTOM_WEAR.includes(libraryName)) {
  currentInjectedClothingType = "Bottom_Clothing";
}
else if (TOP_WEAR.includes(libraryName)) {
  currentInjectedClothingType = "Top_Clothing";
}else {
  console.warn("Unknown clothing type:", libraryName);
  currentInjectedClothingType = null;
}
    window.selectedVariantInfo ={currentInjectedClothingType,currentInjectedCategoryName: libraryName};
  //let libraryName = $('#groupInfo .active').attr('groupname').toLowerCase();
  tryonThreedCol = getTryonImageConfiguration();
    let externalProductJson = tryonThreedCol;
 let productname = libraryName;
  tryonThreedimage = tryonThreedCol.filter((pname) => {
    return pname.productName.toLowerCase() == libraryName;
  });
  if (tryonThreedimage == "") {
    alert("There is no tryon images for this style");
    $(".tryon_page").css("display", "none");
    stopBuffer();
  }
  
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
  let threed_length = tryonThreedimage[0].images.length <= 1 ? tryonThreedimage[0].images.length : 1;
  Gender = "men";
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
         const garmentImageUrl = data.Modal; 
        stopBufferLoader();
        details.push(data.Modal);
        q3d_Plugin.stopAnimation(true);
       let category = selectedVariantInfo.currentInjectedCategoryName;
        let clothingType = selectedVariantInfo.currentInjectedClothingType;
         startPluginLoader()
          try {
            await waitForTryOnReady();
            await _tdstryoncore.loadExternalProductData(externalProductJson , productname);

            tryOnFromGarmentImage(garmentImageUrl, Gender ,category,clothingType);
            _tdstryoncore.setViewMode("_VIDEO");
          // restrict plugin UI to injected variant only
          setTimeout(() => {
            applyTryonUIRestriction();
            if (selectedVariantInfo.currentInjectedCategoryName !== "shirt") {
              activatePluginCategory(
                selectedVariantInfo.currentInjectedCategoryName.charAt(0).toUpperCase() +
                selectedVariantInfo.currentInjectedCategoryName.slice(1)
        );
      }
          addCategoryClassFromActiveThumbnail();
            //activateFirstVariantFromInjectedCategory();
    }, 0);
        $("#root .tryon-frame").css("visibility", "visible");
        stopPluginLoader();
    } catch (err) {
        console.error("TryOn API not ready", err);
        stopBufferLoader();
    }
        function addCategoryClassFromActiveThumbnail() {
          if (!document.getElementById("q3d_dynamic_css")) {
                const style = document.createElement("style");
                style.id = "q3d_dynamic_css";
                style.innerHTML = `
                    img[class^="q3d_suit"] {
                        height: 100%;
                        object-fit: contain;
                        background-color: white;
                        transform: translateY(-25px);
                    }
                        img[class^="q3d_"] {
                        transform: translateY(-30px);
                    }
                        img[class^="q3d_trouser"] {
                        transform: translateY(-145px);
                    }
                `;
                document.head.appendChild(style);
            }
            const category = $("#styleThumbImageList li.active").attr("fab-product");
            if (!category) return;
            const normalizedCategory = category.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
            $(".totem_category .styleme_product").each(function () {
                const img = $(this).find("figure.product_img img");
                if (img.length) {
                    img.removeClass(function (index, className) {
                        return (className.match(/(^|\s)q3d_\S+/g) || []).join(' ');
                    });
                    img.addClass(`q3d_${normalizedCategory}`);
                }
            });
        }
        // Waits until TryOn API is ready before calling tryOnFromGarmentImage
        function waitForTryOnReady({ maxRetry = 10, delay = 300 } = {}) {
            return new Promise((resolve, reject) => {
                let retry = 0;
                const check = () => {
                    if (
                        _tdstryoncore &&
                        appState?.isInitialized === true &&
                        typeof tryOnFromGarmentImage === "function"
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
      }
      $(".tryon_page").css("display", "block");
      if(counter == 1){
        $('#New_loader_css1').css('display', 'block');        
        setTimeout(()=>{
          stoploader();
        }, 8000);
      }
    },
  });
  //appendTryonStyle(tryonThreedimage);
  // checkItemFavWishlist();
}

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
  $('.overlay').css('display', 'none');
  $('#New_loader_css').css('display', 'none');
  $('#New_loader_css1').css('display', 'none');
}
function startBufferLoader(){
  $('.overlay').css('display', 'block');
  $('#New_loader_css1').show();
} 
function stopBufferLoader(){
  $('.overlay').css('display', 'none');
  $('#New_loader_css1').hide();
}

function wrapGetModalpng(currentindex, videoF, gltfPath, thumbUrl) {
  startPluginLoader();
  let fabURL = param.myFab;
  if (fabURL == undefined) {
    let cacheObj = tryonThreedimage[0]["images"];
    for (let key in cacheObj) {
      if (cacheObj.hasOwnProperty(key)) {
        delete cacheObj[key].base64;
      }
    }
  }

  let tWidth = param.tWidth;
  let tHeight = param.tHeight;
  let modalURL = gltfPath;
  let modalImg = thumbUrl;
  modalImg = modalImg
    .replace("t.", "b.")
    .replace(".jpg", ".png")
    .replace(".jpeg", ".png");
    TdsPluginObj.getModalPng({
      fabURL,
      modalURL,
      tWidth,
      tHeight,
      dracoPath: darcoPath,
      callback: function (data) {
        stopPluginLoader();
        _tdstryoncore.TryonWrapImg(data.Modal, _tdstryoncore.getActiveClothingType());
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

function clearcache() {
  var cacheObj = tryonThreedimage[0]["images"];
  for (var key in cacheObj) {
    if (cacheObj.hasOwnProperty(key)) {
      delete cacheObj[key].base64;
    }
  }
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
  startPluginLoader();
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
    let imageUrl = tempDesignPath + "t/" + searchDesignData[0].designCode + "t.jpg";
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
    let threed_length = tryonThreedimage[0].images.length <= 1 ? tryonThreedimage[0].images.length : 1;
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
          stopPluginLoader();
          clearcache();
         let tryonImg = data.Modal;
          showActiveTotemProduct();
            _tdstryoncore.TryonWrapImg(tryonImg, _tdstryoncore.getActiveClothingType());
          stopPluginLoader();
        }
      },
    });
  } else {
    stopPluginLoader();
    alert("design Not Found");
  }

  console.log(searchDesignData);
}
function showActiveTotemProduct() {
  const $cards = $(".totem_category .styleme_product");
  $cards.removeClass("active")
        .find(".selectedPr")
        .hide();

  const $firstCard = $cards.first();
  $firstCard.addClass("active");
  $firstCard.find(".selectedPr").css("display", "flex");
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

document.addEventListener(
  "click",
  function (e) {
    const product = e.target.closest(".styleme_product");
    if (!product) return;
     if (product.classList.contains("active")) {
        return;
    }
    const container = product.closest(".totem_category");
    if (!container) return;
   
    const Index = parseInt(product.dataset.index);
    setTimeout(() => {
      const activeProduct = container.querySelector(".styleme_product.active");
      if (!activeProduct) return;
       const productId = activeProduct.dataset.productId;  
         if (
          !_tdstryoncore ||
          typeof _tdstryoncore.getProductData !== "function"
        ) {
          console.error("_tdstryoncore not ready");
          return null;
        }
      const productList = _tdstryoncore.getProductData()._Productlist;
      if (!Array.isArray(productList)) {
        console.error("_Productlist is not an array");
        return null;
      }

      const id = Number(productId); 
      const product = productList.find(p => Number(p.id) === id);
      if (!product || !Array.isArray(product.ProductVariant)) {
        return null;
      }
        let  gltfpath = product.ProductVariant[0]?.gltfPath;
        let thumb_url = product.ProductVariant[0]?.thumb_url;     
        wrapGetModalpng(Index, document.querySelector("video")?.paused, gltfpath, thumb_url);
        // checkItemFavWishlist();
    }, 0);
  },
  true
);

$("body").on("keydown click", ".search-input, #showSearch", function (e) {

  if (startTime === 0) {
    startTime = Date.now();
  }

  const isEnterKey = e.type === "keydown" && e.key === "Enter";
  const isSearchClick = e.type === "click" && e.target.closest("#showSearch");

  if (isEnterKey || isSearchClick) {
    e.preventDefault();
    const el = document.querySelector(".search-input");
    if (!el) return;
    const designName = el.value.trim();

    setTimeout(() => {
      if (!designName) {
        console.warn("? Empty captured value");
        return;
      }
      const endTime = Date.now();
      const timeDiff = endTime - startTime;
      isBarcodeScan = timeDiff < 300;
      tryOnDesignSearch(designName, isBarcodeScan);
      el.value = "";
      startTime = 0;
      isBarcodeScan = false;
    }, 0);
  } else if (e.type === "keydown") {
    $("#TryonClearIcon").show();
  }
});

function startPluginLoader() {
  const loader = document.getElementById("tryo-loader");
  if (!loader) {
    return;
  }
  loader.style.display = "flex";
  document.body.classList.add("ui-frozen");
}

function stopPluginLoader() {
  const loader = document.getElementById("tryo-loader");
  if (!loader) return;
  loader.style.display = "none";
  document.body.classList.remove("ui-frozen");
}
window.startPluginLoader = startPluginLoader;
window.stopPluginLoader = stopPluginLoader;

function highlightTotemProductByProductId(productId) {
  if (!productId) return;
  const cards = document.querySelectorAll(".totem_category .styleme_product");
  cards.forEach(card => {
    const pid = Number(card.dataset.productId);
    const isActive = pid === Number(productId);
    card.classList.toggle("active", isActive);

// ?? THIS WAS MISSING (UI VISIBILITY)
    const selectedPr = card.querySelector(".selectedPr");
    if (selectedPr) {
      selectedPr.style.display = isActive ? "flex" : "none";
    }
  });
}

(function waitForSwapProduct() {
  if (
    window._tdstryoncore &&
    typeof window._tdstryoncore.swapProduct === "function"
  ) {
    const originalSwapProduct = _tdstryoncore.swapProduct;
    let pluginLoaderTimer = null;
    _tdstryoncore.swapProduct = function (...args) {

      const swapDirection = args[1];
      startPluginLoader();
      clearTimeout(pluginLoaderTimer);
      pluginLoaderTimer = setTimeout(() => {
        stopPluginLoader();
      }, 3000);
        const product = $("#styleThumbImageList li.active").attr("fab-product");
        window._tdstryoncore.setActiveCategory(product);
       const productAll = _tdstryoncore.getProductData()._Productlist;
      const productList = productAll.filter(item => item.categoryname === product);
      let currentIdx = -1;
      const activeElBefore = document.querySelector(".totem_category .styleme_product.active"); 

      if (activeElBefore && productList?.length && activeElBefore.dataset?.productId) {
        const currentProductId = Number(activeElBefore.dataset.productId);
        currentIdx = productList.findIndex(
          p => Number(p.id) === currentProductId
        );
      }
      //originalSwapProduct.apply(this, args);

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
        if (!nextProduct) return;
        highlightTotemProductByProductId(nextProduct.id);
        let  gltfPath = nextProduct?.ProductVariant?.[0]?.gltfPath;
        let thumb_url = nextProduct?.ProductVariant?.[0]?.thumb_url;
        wrapGetModalpng(Index, document.querySelector("video")?.paused, gltfPath, thumb_url);
        //checkItemFavWishlist();
      }
    };
  } else {
    setTimeout(waitForSwapProduct, 50);
  }
})();

//  MAIN UI CONTROLLER (OUTSIDE PLUGIN)
function applyTryonUIRestriction() {
  const type = selectedVariantInfo.currentInjectedClothingType;
  if (!type) return;
  const leftPane = document.getElementById("apparel_window_top");
  const rightPane = document.getElementById("apparel_window_bottom");

  //  HANDLE PANES
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

  // FILTER CATEGORY DROPDOWN
  document.querySelectorAll(".category_menu li").forEach(li => {
    li.style.display =
      li.dataset.clothingType === type
        ? "block"
        : "none";
  });

  // FILTER VARIANTS
  document.querySelectorAll(".styleme_product").forEach(card => {
    card.style.display =
      card.dataset.clothingType === type
        ? "block"
        : "none";
  });

  // FORCE DROPDOWN TO MATCH INJECTED CATEGORY
(function syncCategoryDropdown() {
  const type = selectedVariantInfo.currentInjectedClothingType;
  const injectedCategory = selectedVariantInfo.currentInjectedCategoryName; 

  if (!injectedCategory) return;
  document.querySelectorAll(".category_menu li").forEach(li => {
    li.classList.remove("active");
  });
  // Activate the injected category
  const activeLi = document.querySelector(
    `.category_menu li[data-category-name="${injectedCategory.charAt(0).toUpperCase() + injectedCategory.slice(1)}"]`
  );

  if (activeLi) {
    activeLi.classList.add("active");
    const menu = activeLi.closest(".category_menu");
    const label = menu?.querySelector(".cat_name");
    if (label) {
      label.textContent = activeLi.dataset.categoryName;
    }
  }
})();
// FILTER VARIANT CARDS
document.querySelectorAll(".category_menu li").forEach(li => {
  li.style.display =
    li.dataset.categoryName ===
    selectedVariantInfo.currentInjectedCategoryName
      ? "block"
      : "none";
});
document.querySelectorAll(".styleme_product").forEach(card => {
  const sku = card.dataset.sku?.toLowerCase() || "";
  const name = card.dataset.name?.toLowerCase() || "";

  const isMatch =
    sku.includes(selectedVariantInfo.currentInjectedCategoryName) ||
    name.includes(selectedVariantInfo.currentInjectedCategoryName);
    card.style.display = isMatch ? "block" : "none";
    hidePluginCategoryDropdown();
});

}
function activatePluginCategory(categoryName) {
  if (!categoryName) return;
  const li = document.querySelector(`.category_menu li[data-category-name="${categoryName}"]`);
  if (!li) {
    return;
  }
  li.click();
}
function hidePluginCategoryDropdown() {
  document.querySelectorAll(".category_menu").forEach(menu => {
    menu.style.display = "none";
  });
}
$(document).ready(function () {
    $("body").on("click", "#btn_STYLEME_q3d", function () {
        stopBuffer();
        clearcache();
          let fabricUrl, designName, designId, designSize, designProduct = "";
          if(backBtnClickDesignData) {
            fabricUrl = backBtnClickDesignData.cachePath;
            designName = backBtnClickDesignData.designMaster1[0].designCode;
            designId = backBtnClickDesignData.designMaster1[0].designId;
            designSize = backBtnClickDesignData.designMaster1[0].designSize;
            designProduct = backBtnClickDesignData.designMaster1[0].products;
            backBtnClickDesignData = undefined;
            rediretTryonToQ3dDrapeFabric(designName, designProduct, fabricUrl, designId, designSize);
          } else {
            rediretTryonToQ3dDrapeFabric();
          }
    });
});