import { getData,PostData } from './ajaxCall';
import { serviceUrl } from './config';
import { sweetalert_error } from './sweetalert';
let fabAgainstSupp = {}

export const getdata = async (urlDesignName, supplier_id) => {
    const ApiCallUrl = `${serviceUrl}/api/Configuration/GetdrapingImages?SupplierId=${supplier_id}&DesignName=${urlDesignName.join()}`
     let data = await getData(ApiCallUrl);

     if (typeof data === 'object'){
        data['supplier_id'] = supplier_id
        storeFabricAgainstSupplier(supplier_id,urlDesignName)
        return data
    }
    else {
        sweetalert_error(data)
      }
 }
    // return await getData(ApiCallUrl); 
export const SaveFabDrapeCount = (td_supplier_id,td_QrScanCount) => {
    let renderCountObj = JSON.stringify({
        td_supplier_id,
        td_QrScanCount,
        td_organisation_id : 0
    })
    
     const url= `${serviceUrl}/api/Configuration/SaveRenderData`
      PostData(url,renderCountObj,true)
}
 const storeFabricAgainstSupplier = (supplier,fabName) => {
        if(supplier in fabAgainstSupp){
            for(let fName of fabName){
                fabAgainstSupp[supplier].add(fName?.toLowerCase())
                fabAgainstSupp[supplier].add(fName?.toLowerCase())
            }
        }
        else{
            fabName = fabName.join(",").toLowerCase().split(',') // store values in lowercase to avoid duplication
            fabAgainstSupp[supplier] = new Set(fabName) 
        }
}

export const getSupplierAgainstfab = (fabName) => {
    let result = []
    fabName = fabName?.toLowerCase()
    Object.keys(fabAgainstSupp).forEach((value) => {
       if(fabAgainstSupp[value].has(fabName.toLowerCase())) result.push(value)
    })
    return result
}

export const isFabExist = (supplier_id, fabName) => {
    fabName = fabName.toLowerCase();
    if (fabAgainstSupp[supplier_id].has(fabName)) {
      return true;
    } else {
      return false;
    }
  };