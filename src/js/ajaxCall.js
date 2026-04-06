import $ from "jquery";

export const getData = (url)=>{
    return new Promise((res,reject) =>{
        if(!url) return 
        $.ajax(
           {
           url,
           async: true,
           success: function(result){
              if(result){
                res(result)
              }
         },
         
         error : function(err){
              console.error(err)
            alert(`Error occured While Http request`)
         }
        });
    })
    
    
}

export const PostData = (url,data,isASync=false)=>{
    if(!(url)) return
    $.ajax({
      headers:{
        "access-control-allow-origin": "*",
      },
      url,
      async:isASync,
      contentType: "application/json",
      dataType :"json",
      method :"POST",
      data,
      success:function(result){

      }

    })
}
