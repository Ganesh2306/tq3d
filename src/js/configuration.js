export function setConfiguration(islogin){
    let allConfigData = "";
    if(islogin) {
        allConfigData = JSON.parse(JSON.parse(sessionStorage.jsonString).jsonString);
    } else {
        allConfigData = JSON.parse(JSON.parse(sessionStorage.qrScanDataAuth).jsonString);
    }
    let configuration = new Object();
    configuration.q3d_show_fabrics = allConfigData[0].q3d_show_fabrics;//Done
    configuration.q3d_background_image = allConfigData[0].q3d_background_image; //inprogress
    configuration.q3d_draping_file = allConfigData[0].q3d_draping_file  //Done
    configuration.q3d_display_groups = allConfigData[0].q3d_display_groups  //Done
    configuration.q3d_double_click_zoom = allConfigData[0].q3d_double_click_zoom  //Done
    configuration.q3d_download_option = allConfigData[0].q3d_download_option  //Done
    configuration.q3d_drape_count = allConfigData[0].q3d_drape_count  //inprogress pending
    configuration.q3d_drape_first_fabric = allConfigData[0].q3d_drape_first_fabric  //inprogress imp
    configuration.q3d_drape_option = allConfigData[0].q3d_drape_option //Done
    configuration.q3d_fabric_to_model = allConfigData[0].q3d_fabric_to_model //inprogress imp
    configuration.q3d_fullview_image = allConfigData[0].q3d_fullview_image //inprogress
    configuration.q3d_idealtime = allConfigData[0].q3d_idealtime //inprogress
    configuration.q3d_is_q3d_lite = allConfigData[0].q3d_is_q3d_lite//Done
    configuration.q3d_is_custom_download = allConfigData[0].q3d_is_custom_download//Done
    configuration.q3d_is_show_product = allConfigData[0].q3d_is_show_product //inprogress
    configuration.q3d_model_to_fabric = allConfigData[0].q3d_model_to_fabric //inprogress imp 
    configuration.q3d_password = allConfigData[0].q3d_password //Done --
    configuration.q3d_product_name = allConfigData[0].q3d_product_name || "" //Done shubham added purpose: To avoid exceptions when null or undefined value is passed
    configuration.q3d_profileimgsize = allConfigData[0].q3d_profileimgsize //inprogress not more important
    configuration.q3d_rotation_with_pan = allConfigData[0].q3d_rotation_with_pan //Done
    configuration.q3d_second_group_selection = allConfigData[0].q3d_second_group_selection //inprogress not in Working 
    configuration.q3d_share_option = allConfigData[0].q3d_share_option //Done
    configuration.q3d_tryon_visible = allConfigData[0].q3d_tryon_visible //inprogress
    configuration.q3d_upload_fabrics = allConfigData[0].q3d_upload_fabrics //inprogress
    configuration.q3d_user_id = allConfigData[0].q3d_user_id //Done --
   // configuration.org_type_id = allConfigData[0].org_type_id //Done --
    return configuration;

}

export function loginPayload(payloadData){

    let loginpayload = new Object();
      loginpayload['userName'] = payloadData.userName;
      loginpayload['password'] = payloadData.password;
      loginpayload['googleToken'] = payloadData.googleToken || "0";
      loginpayload['product'] = "q3d";
      loginpayload['fingureprint'] = {}
      loginpayload['fingureprint']['device_Login_Id'] = payloadData.fingureprint.device_Login_Id;
      loginpayload['fingureprint']['device_Type']= payloadData.fingureprint.device_Type;
      loginpayload['fingureprint']['device_Description']= payloadData.fingureprint.device_Description;
      loginpayload['fingureprint']['device_Browser']= payloadData.fingureprint.device_Browser;
      loginpayload['fingureprint']['device_Ip']= payloadData.fingureprint.device_Ip;
      loginpayload['fingureprint']['device_Location']= payloadData.fingureprint.device_Location;
      loginpayload['fingureprint']['is_Device_Active']= payloadData.fingureprint.is_Device_Active;
      loginpayload['saveDeviceDetailsRequestDto'] = {};
      loginpayload['saveDeviceDetailsRequestDto']['device_detail_id'] = payloadData.saveDeviceDetailsRequestDto.device_detail_id;
      loginpayload['saveDeviceDetailsRequestDto']['system_User_Id'] = payloadData.saveDeviceDetailsRequestDto.system_User_Id;
      loginpayload['saveDeviceDetailsRequestDto']['device_Fingure_Print_Id']= payloadData.saveDeviceDetailsRequestDto.device_Fingure_Print_Id;
      loginpayload['saveDeviceDetailsRequestDto']['mac_Address']= payloadData.saveDeviceDetailsRequestDto.mac_Address;
      loginpayload['saveDeviceDetailsRequestDto']['screen_X_Resolution']= payloadData.saveDeviceDetailsRequestDto.screen_X_Resolution;
      loginpayload['saveDeviceDetailsRequestDto']['screen_Y_Resolution']= payloadData.saveDeviceDetailsRequestDto.screen_Y_Resolution;
      loginpayload['saveDeviceDetailsRequestDto']['screen_X_DPI']= payloadData.saveDeviceDetailsRequestDto.screen_X_DPI;
      loginpayload['saveDeviceDetailsRequestDto']['screen_Y_DPI']= payloadData.saveDeviceDetailsRequestDto.screen_Y_DPI;
      loginpayload['saveDeviceDetailsRequestDto']['dpi_Unit']= payloadData.saveDeviceDetailsRequestDto.dpi_Unit;
      loginpayload['saveDeviceDetailsRequestDto']['is_Active']= payloadData.saveDeviceDetailsRequestDto.is_Active;
      loginpayload['saveDeviceDetailsRequestDto']['is_Color_Profile']= payloadData.saveDeviceDetailsRequestDto.is_Color_Profile;
      loginpayload['saveDeviceDetailsRequestDto']['color_Profile_Name']= payloadData.saveDeviceDetailsRequestDto.color_Profile_Name;
    return loginpayload;
}