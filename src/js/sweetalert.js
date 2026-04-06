import Swal from 'sweetalert2'
import { forceLogout } from "./login.js";
export function sweetalert_success(massage) {
    Swal.fire({
        //title: "Good job!",
        text: massage,
        icon: "success",
        allowOutsideClick: false
    });
}

export function sweetalert_error(massage, isredirectlogin = false) {
    Swal.fire({
        //title: "Good job!",
        text: massage,
        icon: "error",
        imageHeight: 80, 
        imageWidth: 80,       
        imageClass:'img-responsive rounded-circle',
        allowOutsideClick: false,
    }).then((result)=>{
        if (result.isConfirmed && isredirectlogin) {
            // forceLogout();
            var domainName = window.location.origin + window.location.pathname;
            window.history.pushState('','',domainName);
            window.location.reload();
          }
      });
}

export function sweetalert_warning(massage) {
    Swal.fire({
        //title: "Good job!",
        text: massage,
        icon: "warning",
        allowOutsideClick: false,
    });
}

export function sweetalertForceLogout() {
    Swal.fire({
        title: 'Do You Want Force Login',
        showDenyButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: 'No',
        allowOutsideClick: false,
      }).then((result)=>{
        if (result.isConfirmed) {
            forceLogout();
          }
      })
}
export function sweetalertRequestSuccess() {
     const msg = "Request Sent Successfully! Our Team Will Get Back To You Shortly.";
 Swal.fire({
    icon: 'success',
    title: 'Thank You',
     html: `<div class="request-popup-content">${msg}</div>`,
    customClass: {
      title: 'request-popup-title',
      content: 'request-popup-content'
    },

    confirmButtonText: 'OK'
  }).then((result) => {
    if(result.isConfirmed){ 
    
      $('#request_popup').hide();
      $('#login_popup').show(); // if you want to go back to login
    }
  });
}
