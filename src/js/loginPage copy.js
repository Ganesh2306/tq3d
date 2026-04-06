export function loginPage() {
  return ` <div class="container-fluid login-page-container">
  <!-- user login popup -->
  <div class="user_container" id="login_popup" style="display:block;">
    <h3 class="text-center">Login</h3>
    <form class="row g-3">
      <div class="col-md-12">
        <label for="inputEmail4" class="form-label">Username</label>
        <input
          type="text"
          class="form-control"
          id="inputEmail4"
          autofocus
          autocomplete="off"
          required
        />
        <div class="invalid-feedback" id="UserLoginId">
          Please enter user Id
        </div>
      </div>
      <div class="col-md-12 user_pass">
        <label for="loginPagepass" class="form-label">Password</label>
        <input
          type="password"
          class="form-control"
          id="loginPagepass"
          autocomplete="off"
          required
        />
        <div class="user_pass_eye">
          <img
            alt="password hide icon"
            class="pass_eye_show"
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItZXllIj48cGF0aCBkPSJNMSAxMnM0LTggMTEtOCAxMSA4IDExIDgtNCA4LTExIDgtMTEtOC0xMS04eiI+PC9wYXRoPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjMiPjwvY2lyY2xlPjwvc3ZnPg=="
          />
          <img
            alt="password show icon"
            class="pass_eye_hide"
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItZXllLW9mZiI+PHBhdGggZD0iTTE3Ljk0IDE3Ljk0QTEwLjA3IDEwLjA3IDAgMCAxIDEyIDIwYy03IDAtMTEtOC0xMS04YTE4LjQ1IDE4LjQ1IDAgMCAxIDUuMDYtNS45NE05LjkgNC4yNEE5LjEyIDkuMTIgMCAwIDEgMTIgNGM3IDAgMTEgOCAxMSA4YTE4LjUgMTguNSAwIDAgMS0yLjE2IDMuMTltLTYuNzItMS4wN2EzIDMgMCAxIDEtNC4yNC00LjI0Ij48L3BhdGg+PGxpbmUgeDE9IjEiIHkxPSIxIiB4Mj0iMjMiIHkyPSIyMyI+PC9saW5lPjwvc3ZnPg=="
          />
        </div>
        <div class="invalid-feedback" id="UserPassWord">
          Please enter password
        </div>
      </div>
      <div class="col-12 remember_me">
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="gridCheck" />
          <label class="form-check-label" for="gridCheck">
            Remember Me
          </label>
        </div>
      </div>
      <div class="col-12 mt-1 login_btn">
        <button type="button" class="btn btn-primary login_button">
          LOGIN
        </button>
      </div>
       <div class="col-12 mt-1 request_btn">
        <button type="button" class="btn btn-primary request_button_bottom" id="viewRequestForm">
         Don't have an account? <span class="highlight"> Request Access</span>
        </button>
      </div>
      <div class="col-6 mt-2 for_pass">
        <b class="forgetpw redirect_link" id='gotoForgetPage'>Forgot Password?</b>
      </div>
      <div class="col-6 text-end mt-2 visit_demo">
        <b class="demouser"> Visit Demo</b>
      </div>
    </form>
  </div>
<!--Request access form -->
  <div class="user_container" id="request_popup" style="display:none;">
    <h3 class="text-center">Customer Request</h3>
    <form class="row g-3">
      <div class="col-md-12">
        <label for="nameinput" class="form-label">Name</label>
        <input
         type="nameinput"   
          class="form-control"
          id="nameinput"
          autofocus
          autocomplete="off"
          required
        />
        <div class="invalid-feedback" id="nameinfo">
          Please enter Name
        </div>
      </div>

       <div class="col-md-12">
        <label for="companyname" class="form-label">Company Name</label>
        <input
          name ="companyname"
          type="text"
          class="form-control"
          id="companyname"
          autofocus
          autocomplete="off"
          required
        />
        <div class="invalid-feedback" id="companyinfo">
          Please enter Company Name
        </div>
      </div>
    <div class="col-md-12">
        <label for="custemail" class="form-label">Email</label>
        <input
          name = "email"
          type="custemail"
          class="form-control"
          id="custemail"
          autofocus
          autocomplete="off"
          required
        />
        <div class="invalid-feedback" id="mailinfo">
          Please enter Company Email
        </div>
      </div>
     

      <div class="col-12 mt-1 request_btn_send">
        <button type="button" class="btn btn-primary request_button_send">
          REQUEST ACCESS
        </button>
      </div>
       <div class="col-12 mt-1 request_btn">
        <button type="button" class="btn btn-primary request_button_bottom" id="backFromRequest">
         Already a User? <span class="highlight"> Login</span>
        </button>
      </div>
      
    </form>
  </div>

  <!--  forgot password popup-->
   <div class="user_container" id="forgot_pass_popup" style="display:none">
    <h3 class="text-center">Forgot Password?</h3>
    <p class="mb-2 mt-2"> Please Enter Your Registered Email </p>
    <form class="row g-3">
      <div class="col-md-12">
        <label for="forgetUserId" class="form-label">User Id</label>
        <input
          type="text"
          class="form-control"
          id="forgetUserId"
          autofocus
          autocomplete="off"
          required
        />
        <div class="invalid-feedback" id='forgetUserIdLabel'>
          Please enter user Id
        </div>
      </div>
      <div class="col-md-12">
        <label for="forgetEmail" class="form-label">Registered Email</label>
        <input
          type="text"
          class="form-control"
          id="forgetEmail"
          autocomplete="off"
          required
        />
        <div class="invalid-feedback" id="forgetRegisterMail">
         Please enter registered email
        </div>
      </div>
      <div class="col-12">
        <button type="button" class="btn btn-primary fs-5 next_button">
         Next
        </button>
      </div>
      <div class="col-12 mt-2 mb-2">
        <b class="back_to_login redirect_link ml-3" id="backTOLogin">Back to Login</b>
      </div>
    </form>
  </div>

  <!--  otp popup -->
   <div class="user_container" id="otp_popup" style="display:none">
    <h3 class="text-center">Enter One Time Password</h3>
    <p class="mb-3 mt-2"> Plesase enter the OTP send to your Email </p>
    <form class="row g-3">
      <div class="col-md-12">
        <input
          type="password"
          class="form-control"
          id="getOtpPassword"
          autocomplete="off"
          required
        />
        <div class="invalid-feedback" id="otpLabel">
         Please enter valid Otp
        </div>
      </div>
      <div class="col-12 otp_btn">
        <button type="button" class="btn btn-primary fs-5 Verify_button">
        Verify
        </button>
               <button type="button" class="btn btn-primary fs-5 Resend_button">
         Resend OTP
        </button>
      </div>
      <div class="col-12 mt-2 mb-2 ps-2">
        <b class="back_to_login redirect_link ml-3" id="otp_backTOLogin">Back to Login</b>
      </div>
    </form>
  </div>

    <!-- Reset Password popup -->
  <div class="user_container" id="reset_Pass_popup" style="display:none;">
    <h3 class="text-center">Reset Password</h3>
    <form class="row g-3">
      <div class="col-md-12 new_pass">
        <label for="u_newPassword" class="form-label">Type New Password</label>
        <input
          type="password"
          class="form-control"
          id="u_newPassword"
          autocomplete="off"
          required
        />
        <div class="new_pass_eye">
          <img
            alt="password hide icon"
            class="pass_eye_show"
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItZXllIj48cGF0aCBkPSJNMSAxMnM0LTggMTEtOCAxMSA4IDExIDgtNCA4LTExIDgtMTEtOC0xMS04eiI+PC9wYXRoPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjMiPjwvY2lyY2xlPjwvc3ZnPg=="
          />
          <img
            alt="password show icon"
            class="pass_eye_hide"
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItZXllLW9mZiI+PHBhdGggZD0iTTE3Ljk0IDE3Ljk0QTEwLjA3IDEwLjA3IDAgMCAxIDEyIDIwYy03IDAtMTEtOC0xMS04YTE4LjQ1IDE4LjQ1IDAgMCAxIDUuMDYtNS45NE05LjkgNC4yNEE5LjEyIDkuMTIgMCAwIDEgMTIgNGM3IDAgMTEgOCAxMSA4YTE4LjUgMTguNSAwIDAgMS0yLjE2IDMuMTltLTYuNzItMS4wN2EzIDMgMCAxIDEtNC4yNC00LjI0Ij48L3BhdGg+PGxpbmUgeDE9IjEiIHkxPSIxIiB4Mj0iMjMiIHkyPSIyMyI+PC9saW5lPjwvc3ZnPg=="
          />
        </div>
        <div class="invalid-feedback">
          Please enter password
        </div>
      </div>
            <div class="col-md-12 Confirm_pass">
        <label for="u_newPasswordRe" class="form-label">Confirm Password</label>
        <input
          type="password"
          class="form-control"
          id="u_newPasswordRe"
          autocomplete="off"
          required
        />
        <div class="Confirm_pass_eye">
          <img
            alt="password hide icon"
            class="pass_eye_show"
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItZXllIj48cGF0aCBkPSJNMSAxMnM0LTggMTEtOCAxMSA4IDExIDgtNCA4LTExIDgtMTEtOC0xMS04eiI+PC9wYXRoPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjMiPjwvY2lyY2xlPjwvc3ZnPg=="
          />
          <img
            alt="password show icon"
            class="pass_eye_hide"
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItZXllLW9mZiI+PHBhdGggZD0iTTE3Ljk0IDE3Ljk0QTEwLjA3IDEwLjA3IDAgMCAxIDEyIDIwYy03IDAtMTEtOC0xMS04YTE4LjQ1IDE4LjQ1IDAgMCAxIDUuMDYtNS45NE05LjkgNC4yNEE5LjEyIDkuMTIgMCAwIDEgMTIgNGM3IDAgMTEgOCAxMSA4YTE4LjUgMTguNSAwIDAgMS0yLjE2IDMuMTltLTYuNzItMS4wN2EzIDMgMCAxIDEtNC4yNC00LjI0Ij48L3BhdGg+PGxpbmUgeDE9IjEiIHkxPSIxIiB4Mj0iMjMiIHkyPSIyMyI+PC9saW5lPjwvc3ZnPg=="
          />
        </div>
        <div class="invalid-feedback" id="passwordMatchlabel">
          Enter password Not Match
        </div>
      </div>
      <div class="col-12">
        <button type="button" class="btn btn-primary rest_pass_button">
          Submit
        </button>
      </div>
      <div class="col-12 mt-2">
        <b class="back_to_login redirect_link" id="reset_backToLogin">Back to Login</b>
      </div>
    </form>
  </div>

   <!-- Success popup-->
   <div class="user_container" id="success_popup" style="display:none">
    <h3 class="text-center">Success</h3>
    <div class="success_line"> Password is successfully reset</div>
    <p class="mb-4 mt-3"> You can now login with your new password </p>
    <form class="row g-4">
      <div class="col-12">
        <button type="button" class="btn btn-primary fs-5 redirect_btn" id="finalbackToLogin">
       Back to Login
        </button>
      </div>
    </form>
  </div>


</div>
`;
}

export function Homepage() {
  return ` <div class="container-fluid outer-container">

  <nav class="navbar navbar-expand-lg">

         <!--<div id="count_header">
     
    <div class="countlabel">Credits:</div><div id="credit-count">         </div>
    </div>-->
 
    <div class="container-fluid">
     
      <div class="title">
        <div class="title_menu">
          <div
            class="title_menu_list"
            data-bs-toggle="modal"
            data-bs-target="#login_side_panel"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-list"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
              />
            </svg>
          </div>
          <div class="title_menu_logo">
            <a href="#">
              <img
                id="brand-logo"
                loading="lazy"
                src=""
                alt="Q3d_logo"
              />
            </a>
          </div>
        </div>
         <div class="barcode-scn" id="barcode_scn">                
            <div class="icon_scan bar">
              <img loading="lazy" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPQAAADOCAMAAAA+EN8HAAAAb1BMVEX///8AAABoaGja2trf398HBwdQUFCSkpL7+/tUVFSNjY3y8vKampr29vbR0dHNzc23t7cYGBjAwMCnp6cvLy8fHx9ycnLk5OSxsbHGxsZ6enphYWEjIyMoKCjq6upaWlpJSUmAgIA8PDyFhYURERFJL+toAAAE5klEQVR4nO2d23qqMBBGg1oKgkestbbiob7/M26tuzUyEQYmhqb869Ivnc4yIUQdEqXOJFk4C2oy26W5ao083dXPOMySa4S07p9/M2xJORo2zTj9jvDeNEIQxElpcg8iCZtn3Iu+QiybRwiCbeTeOdpKMl6eQ0wlEa7jxSGNr8YL01OID1mIjfPZLN8IM1ZqIotweeOcIhyaQTCRjpUgWLuWXkszTmXT2JnYtXQszXgpDxE6do4E96sLsRKH2DqWVqIb1plQLu18VdZ4NWZR+s219Fv70jvnS7Jo17q0846Wd7VYuoVVqHgdKpVuxVlqLZMOx+04KzUWpW2S7rHYp/22lM/00z0vT6Z0my72YUq38L3A44ggDWlIQ9p3IA1pSEPaeyANaUhD2nsgDWlIQ9p7IA1pSEPaex4hnbwOBq+VrfLBYFBZRZqcGlVX4p3/X52CVPvS/fXh1P4YpmVpjLL4XKW8WJb+xjleLk6NZnE2KmmUpOHx1Oqw5v92aF36WvKymd9tNDn8tNrfFRrtfxodJndDza8FkuzyHsvStyXT2Z1WN0WN4R3r0U0W9wovM73ROzdLu9KFckVzX49vG72bQxUqzs3Xwfy2EbM80650sdxlYerFUTH8yhRqVczKGGpRaMUr8bEqTQubTPUnpGL3xRA8eim2Mg1wUmfCK+ayKt1/orEotPjBME3R6uueIRRJ9Ik1hVuVplXXR3q/TopDMgieaahn0mhBb4GvR9KKVWluVdpQ1TQgjQY00yUNRauvDe9fn/4/Vj2XUdrwqA5LmnZPQIfbgFwDppFLr4En+v4ZpA2DhiX9rj7Jay+cWN5IKzJLBp/kdmGeRTyWptFXKje89qekaa/mdBr54K1NvJGOis9gnafSYlczHznyRprcXL8+vr41ieSRdCHV/6vXiTbBsWuZPZLW1xQvPyvCfHgZ98ce/8O5T9Kq37uskj6G+lczyXw1zKbV3/tc8Ur6tIqdZsPVXPrgs2fSdoA0pDUgDWkdSENaA9KQdgikIa0BaUjrQBrSGpCGtEMgDWkNSENaB9KQ1oA0pB0CaUhrQBrSOpCGtAakIe0QSENaA9KQ1oE0pDUgDWmHQBrSGpCGtA6kIa0BaUg7BNKQ1oA0pHUgDWkNSEPaIZCGtAakIa0DaUhrQBrSDvkD0h3cxqeLGzZ1cWuuSaNIHknfpvpl3cnt9rq4sWInt9Ds5GapndwWt5MbIHdyq2tsal5Dmm5fHxta0ZFrOHnBn+3rf8FBBZw0cSSFXLqTh49085iZTh4opH6Ojoo5R0cdWEdHbX/90VGqpUPCyt6XIjgODtKQhrT3QBrSkIa090Aa0pCGtPdAGtKQhrT3QBrSkIa090C6RLrtPO3ClO6x2Kf8X9EeQD/d8/JkSrMJS3+HfCRjUdoi6RqV0nYx1HM5lG7HWuYsl2aWu1ilWOLjXnrn/AZHi7mcS7vvamlH25Bml7zYYlid08Olt66lt3LpWB7CLZG4m2JD3XHtEI4Rd9NSes9jlyvaY12dUzmpoe64JsxHmuxBK81rMlFqJouwqa53s0y+qc6qjJkyPcJTixbWocIr8qv62vDhi8+2hW8cItFN6/LUQGR4YIdLXFnx+QgSwQTe++6lxuPF+Wrsm8arMu1qTC7VybWY7VLnc9iVPN3VzzjOLgPzH/lzepxx+bclAAAAAElFTkSuQmCC" alt="scan_image">
            </div>
          </div>
        <div class="title_box">
          <input
            class="fab_search_input3"
            type="text"
            id="q_search"
            placeholder="Search Fabric"
            autocomplete="off"
            name="q_search"
            autofocus="false"
            incremental="false"
          />
          <div class="title_box_icon_wrap">
            <div class="icon_clear fab_close3">
              <img
                loading="lazy"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABBUlEQVR4nO3ZTQqDMBAF4HeKPOkV2+MWbE9jKXUhRcQk8xeZt3Il8xFNZgiQyWQyV8odwORdBH41fGtpygPAAmB2xkxrDctaU3UKgOf6gjeAG+zDTQ2vnho8MZRCeGIojfDAUAthiaE2wgJjhtDEmCM0MG4ISYw7QgITBtGDCYdowYRF1GDCI85ghkEcYYZD7M0Q899zhEGteWWGW4lttp+T53DWlUt8Wtz5sSOMzVU52p2GwfDEFhsew4pzIiyGDYddOAw7TuwwGAq0He4YCvZObhgqNIDmGCp2sWYYi1a8aGMs54mihfEYioo0xnOyK1KYCONpkcBc5urtMpehmUwmg3D5AAklyc9YEtl/AAAAAElFTkSuQmCC"
                alt="clear_image"
              />
            </div>
            <div class="icon_search fab_search_icon3">
              <img
                loading="lazy"
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmkgYmktc2VhcmNoIiB2aWV3Qm94PSIwIDAgMTYgMTYiPgogIDxwYXRoIGQ9Ik0xMS43NDIgMTAuMzQ0YTYuNSA2LjUgMCAxIDAtMS4zOTcgMS4zOThoLS4wMDFxLjA0NC4wNi4wOTguMTE1bDMuODUgMy44NWExIDEgMCAwIDAgMS40MTUtMS40MTRsLTMuODUtMy44NWExIDEgMCAwIDAtLjExNS0uMXpNMTIgNi41YTUuNSA1LjUgMCAxIDEtMTEgMCA1LjUgNS41IDAgMCAxIDExIDAiLz4KPC9zdmc+"
                alt="search_image"
              />
            </div>
            <div class="vline"></div>
            <div class="icon_scan" id="scan_btn">
              <img
                loading="lazy"
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmkgYmktcXItY29kZS1zY2FuIiB2aWV3Qm94PSIwIDAgMTYgMTYiPgogIDxwYXRoIGQ9Ik0wIC41QS41LjUgMCAwIDEgLjUgMGgzYS41LjUgMCAwIDEgMCAxSDF2Mi41YS41LjUgMCAwIDEtMSAwem0xMiAwYS41LjUgMCAwIDEgLjUtLjVoM2EuNS41IDAgMCAxIC41LjV2M2EuNS41IDAgMCAxLTEgMFYxaC0yLjVhLjUuNSAwIDAgMS0uNS0uNU0uNSAxMmEuNS41IDAgMCAxIC41LjVWMTVoMi41YS41LjUgMCAwIDEgMCAxaC0zYS41LjUgMCAwIDEtLjUtLjV2LTNhLjUuNSAwIDAgMSAuNS0uNW0xNSAwYS41LjUgMCAwIDEgLjUuNXYzYS41LjUgMCAwIDEtLjUuNWgtM2EuNS41IDAgMCAxIDAtMUgxNXYtMi41YS41LjUgMCAwIDEgLjUtLjVNNCA0aDF2MUg0eiIvPgogIDxwYXRoIGQ9Ik03IDJIMnY1aDV6TTMgM2gzdjNIM3ptMiA4SDR2MWgxeiIvPgogIDxwYXRoIGQ9Ik03IDlIMnY1aDV6bS00IDFoM3YzSDN6bTgtNmgxdjFoLTF6Ii8+CiAgPHBhdGggZD0iTTkgMmg1djVIOXptMSAxdjNoM1Yzek04IDh2MmgxdjFIOHYxaDJ2LTJoMXYyaDF2LTFoMnYtMWgtM1Y4em0yIDJIOVY5aDF6bTQgMmgtMXYxaC0ydjFoM3ptLTQgMnYtMUg4djF6Ii8+CiAgPHBhdGggZD0iTTEyIDloMlY4aC0yeiIvPgo8L3N2Zz4="
                alt="scan_image"
              />
            </div>
          </div>
        </div>
      </div>
         <button class="open-popup-btn" id="showCredit">My Credits</button>
      <div class="loginbtn_wrap">
        <h6>To View More, please</h6>
        <button type="button" class="btn btn-dark login desk_login_btn">
          LOGIN
        </button>
      </div>
      <div class="desk_userdropdown">
        <button
          class="btn"
          type="button"
          id="dropdownMenuButton1"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <span class="user_name"></span>
          <div class="user_img">
            <img
              src=""
              alt="user avtaar"
            />
          </div>
        </button>
        <ul class="dropdown-menu" id="userMenuBar" aria-labelledby="dropdownMenuButton1">
          <li class="desk_setdpi_btn"><a class="dropdown-item setdpi_btn" href="https://sadmin.dam3d.in/Admin" target="_blank">Fabric & 3D Studio</a></li>
          <li class="desk_setdpi_btn"><a class="dropdown-item setdpi_btn" href="https://sa.textronic.online/login" target="_blank">Plan Insights</a></li>
          <li class="desk_setdpi_btn"><a class="dropdown-item setdpi_btn" data-bs-toggle="modal" data-bs-target="#Setdpi_popup" href="#">Set DPI</a></li>
          <li class="about_btn"><a class="dropdown-item" onclick="window.open('https://s3.ap-south-1.amazonaws.com/aws.tds/dam/q3d/help.pdf')">About</a></li>
          <li id='myProfile'><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#user_profile" > My Profile </a></li>
          <li id='changePass'><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#user_change_pass">Change Password</a ></li>

          <li id='logout'><a class="dropdown-item" href="#" id="Logout"> Logout</a></li>
        </ul>
      </div>
    </div>
  </nav>
  <div class="container-fluid p-0 home_page" id="q_main">
    <div class="row mobile_view gx-0">
      <div class="p-0 style">
        <div class="btn_style_group">
          <button class="btn style_expand">
            <strong
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-chevron-up"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"
                /></svg
            ></strong>
            <span class="style_exp">Expand</span>
            <span class="style_red">Reduce</span>
          </button>
          <button class="btn style_close" id="crossButton">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-x"
              viewBox="0 0 16 16"
            >
              <path
                d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"
              />
            </svg>
          </button>
        </div>
        <div
          class="btn_style_lib active"
          data-bs-toggle="tooltip"
          data-bs-placement="right"
          title="Style Libery Button"
        >
          <div class="lib_head">
            <span>Product</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-caret-down-fill"
              viewBox="0 0 16 16"
            >
              <path
                d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"
              />
            </svg>
          </div>
          <b></b>
        </div>
        <div class="style_lib">
          <!-- <ul>
                                                <li class="active">
                                                  <span>Shirt</span>
                                                </li>
                                                <li><span> Suit</span></li>
                                                <li><span>Sherwani</span></li>
                                                <li><span>Women dress</span></li>
                                                <li><span> Suit</span></li>
                                                <li><span>School uniform</span></li>
                                                <li><span>Women dress</span></li>
                                              </ul> -->
        </div>
        <div class="style_thumb">
          <!-- <ul>
                                                <li>
                                                  <div class="style_thumb_wrap">
                                                    <div class="style_img">
                                                      <img class="img-thumbnail"
                                                        src="https://s3.ap-south-1.amazonaws.com/aws.tds/tds_textronics/threedimages/shirt-01/shirt-01t.jpg"
                                                        loading="lazy" alt="thumb" />
                                                    </div>
                                                    <div class="style_name">CHESTER-0007-4</div>
                                                  </div>
                                                </li>
                                                <li>
                                                  <div class="style_thumb_wrap">
                                                    <div class="style_img">
                                                      <img class="img-thumbnail"
                                                        src="https://s3.ap-south-1.amazonaws.com/aws.tds/tds_textronics/threedimages/shirt-02/shirt-02t.jpg"
                                                        loading="lazy" alt="thumb" />
                                                    </div>
                                                    <div class="style_name">CHESTER-0007-4</div>
                                                  </div>
                                                </li>
                                                <li>
                                                  <div class="style_thumb_wrap">
                                                    <div class="style_img">
                                                      <img class="img-thumbnail"
                                                        src="https://s3.ap-south-1.amazonaws.com/aws.tds/tds_textronics/threedimages/tds_shirt_143_WBG_BTN/tds_shirt_143_WBG_BTNt.jpg"
                                                        loading="lazy" alt="thumb" />
                                                    </div>
                                                    <div class="style_name">CHESTER-0007-4</div>
                                                  </div>
                                                </li>
                                                <li>
                                                  <div class="style_thumb_wrap">
                                                    <div class="style_img">
                                                      <img class="img-thumbnail"
                                                        src="https://s3.ap-south-1.amazonaws.com/aws.tds/tds_textronics/threedimages/tds_shirt_014_WBG_BTN/tds_shirt_014_WBG_BTNt.jpg"
                                                        loading="lazy" alt="thumb" />
                                                    </div>
                                                    <div class="style_name">CHESTER-0007-4</div>
                                                  </div>
                                                </li>
                                                <li>
                                                  <div class="style_thumb_wrap">
                                                    <div class="style_img">
                                                      <img class="img-thumbnail"
                                                        src="https://s3.ap-south-1.amazonaws.com/aws.tds/tds_textronics/threedimages/tds_shirt_014_WBG_BTN/tds_shirt_014_WBG_BTNt.jpg"
                                                        loading="lazy" alt="thumb" />
                                                    </div>
                                                    <div class="style_name">CHESTER-0007-4</div>
                                                  </div>
                                                </li>
                                                <li>
                                                  <div class="style_thumb_wrap">
                                                    <div class="style_img">
                                                      <img class="img-thumbnail"
                                                        src="https://s3.ap-south-1.amazonaws.com/aws.tds/tds_textronics/threedimages/tds_shirt_098_WBG_BTN/tds_shirt_098_WBG_BTNt.jpg"
                                                        loading="lazy" alt="thumb" />
                                                    </div>
                                                    <div class="style_name">CHESTER-0007-4</div>
                                                  </div>
                                                </li>
                                              </ul> -->
        </div>
      </div>
      <div class="col model"> 
      <!-- getzner 360 button -->
      <div class="view_threed_model">
      <img loading="lazy" src="https://s3.ap-south-1.amazonaws.com/aws.tds/dam/q3d/images/three_d1.gif.gif" alt="360 gif">
      <p class="">View 360</p>
      </div>   
      <!-- getzner season name  -->
        <div class="season_name"><span id="season_name"></span></div> 
        <!-- fabric features -->
        <div class="fab_features">
          <div class="fab_features_head">
            <h5>Fabric Details</h5>
            <button type="button" class="btn features_close">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-x-lg"
                viewBox="0 0 16 16"
              >
                <path
                  d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"
                ></path>
              </svg>
            </button>
          </div>
          <div class="fab_features_body">
          </div>
        </div>
        <!-- client logo src="https://s3.ap-south-1.amazonaws.com/aws.tds/tds_textronics/Org_Img/organisation/2601748836.jpg" alt="client logo image" -->
        <div class="client_logo">
          <img
            class="client_logo_img"
            
            
          />
        </div>
        <div class="modal_spinner">
          <div class="spinner-border text-danger"></div>
          <span class="sr-only text-danger">Loading...</span>
        </div>
        <!-- togggle Render MD-->
        <div class="myproduct" id="drape_option">
        <!-- getzner features -->
        <div class="g_features">
        <div class="features_btn" id="resetModel" data-bs-toggle="tooltip" data-bs-placement="left" title="Reset Model">
        <i class="fa fa-compress" aria-hidden="true"></i>
        </div>
        <div class="features_btn" id="modelFabricRefreshBtn" data-bs-toggle="tooltip" data-bs-placement="left" title="Refresh Fabric">
        <i class="fa fa-refresh" aria-hidden="true"></i>
        </div>
        <div class="features_btn" id="designInfoBtnG" data-bs-toggle="tooltip" data-bs-placement="left" title="Fabric Info">
        <i class="fa fa-info" aria-hidden="true"></i>
        </div>
        <div class="features_btn" data-bs-toggle="modal" data-bs-target="#download_popup" id="g_downloadButton" data-bs-toggle="tooltip" data-bs-placement="left" title="Save Image">
        <i class="fa fa-download" aria-hidden="true"></i>
        </div>
        <div class="features_btn" id="technicalSheetBtn" data-bs-toggle="tooltip" data-bs-placement="left" title="Technical Data Sheet">
        <i class="fa fa-file-text " aria-hidden="true"></i>
        </div>
        </div>
        <!-- upload button -->
        <div class="upload_data" id="uploadBtn">
          <button type="button" class="btn upload_btn">
          <img src="https://s3.ap-south-1.amazonaws.com/aws.tds/dam/q3d/images/upload-fab.png" alt="upload image" loading="lazy">
          Fabric 
          </button>
         </div>
              <!-- tryon button -->
              <div class="tryon_btn_wrap">
      <button type="button" class="tryonbt" id="tryonbt">
              <span>Let's TryOn</span>
              <div class="circle">
                <img src="https://s3.ap-south-1.amazonaws.com/aws.tds/dam/q3d/tryon_img/t_logo.png" loading="lazy">
              </div>
       </button>
       </div>
          <div id="Render_Adjust_Options">
            <label class="switch">
              <input type="checkbox" class="show-check" />
              <span class="slider round"></span>
            </label>
          </div>
          <div class="settings_window">
            <div class="switch_menu">
              <form id="form-id">
                <div class="options_wrap">
                  <input
                    type="radio"
                    id="scale"
                    name="customize"
                    value="panel_scale"
                    checked=""
                  />
                  <label for="scale">Scale</label>
                </div>
                <!--  <br> -->
                <!--14-02-2025-->
                  	 <div class="options_wrap">
                  <input
                    type="radio"
                    id="color"
                    name="customize"
                    value="panel_Color"
                  />
                  <label for="color">Color</label>
                </div>
                <!--  <br> -->
                <div class="options_wrap">
                  <input
                    type="radio"
                    id="rotate"
                    name="customize"
                    value="panel_rotate"
                  />
                  <label for="rotate">Rotate</label>
                  <!--  <br> -->
                </div>
                <div class="options_wrap">
                  <input
                    type="radio"
                    id="offset"
                    name="customize"
                    value="panel_offset"
                  />
                  <label for="offset">Offset</label>
                  <!--  <br> -->
                </div>
              </form>
            </div>
            <div
              class="control_box panel_scale box show_mobile"
              id=""
              readonly=""
              style="display: block;"
            >
              <div class="controler_a">
                <input
                  id="slide-scale"
                  class="slido"
                  type="range"
                  min="1"
                  max="500"
                  step="1"
                  value="100"
                />
                <div class="input-amount">
                  <label for= "input-scale" class="input_label">S</label>
                  <input
                    id="input-scale"
                    type="number"
                    name="price"
                    min="1"
                    max="500"
                    value="100"
                    class="valuebox"
                    orient="vertical"
                  />
                </div>
              </div>
            </div>
            <div class="control_box panel_rotate box" id="">
              <div class="controler_a">
                <input
                  id="slide-rotate"
                  class="slido"
                  type="range"
                  min="-180"
                  max="180"
                  step="1"
                  value="0"
                />
                <div class="input-amount">
                  <label class="input_label">R</label>
                  <input
                    id="input-rotate"
                    type="number"
                    name="price"
                    min="-180"
                    max="180"
                    step="1"
                    value="0"
                    class="valuebox"
                    orient="vertical"
                  />
                </div>
              </div>
            </div>
            <div class="control_box panel_offset box" id="">
              <div class="controler_a">
                <input
                  id="slide-offset"
                  class="slido"
                  type="range"
                  min="-1"
                  max="1"
                  step="0.1"
                  value="0"
                />
                <div class="input-amount">
                  <label class="input_label">X</label>
                  <input
                    id="input-offset"
                    type="number"
                    name="price"
                    min="-1"
                    max="1"
                    value="0"
                    class="valuebox"
                    orient="vertical"
                  />
                </div>
              </div>
              <div class="controler_a">
                <input
                  id="slide-offset-b"
                  class="slido"
                  type="range"
                  min="-1"
                  max="1"
                  step="0.1"
                  value="0"
                />
                <div class="input-amount">
                  <label class="input_label">Y</label>
                  <input
                    id="input-offset-b"
                    type="number"
                    name="price"
                    min="-1"
                    max="1"
                    value="0"
                    class="valuebox"
                    orient="vertical"
                  />
                </div>
              </div>
            </div>
             <!--14-02-2025-->
            <div class="control_box panel_Color box" id="">
              <div class="controler_a">
                <input id="hue" class="slido" type="range" min="0" max="360" step="1" value="0" style="font-size: 16px;">
                <div class="input-amount">
                  <label class="input_label">c</label>
                  <input id="input-hue" type="number" name="price" min="0" max="360" step="1" value="0" class="valuebox" orient="vertical" style="font-size: 16px;">
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- toggle Render ends MD -->
        <!-- share buttons-->
        <div class="share_btn" style="display: block;">
          <div
            class="s_btn fab_info_btn"
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            title="Fabric Info"
          >
            <img
              loading="lazy"
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmkgYmktaW5mby1jaXJjbGUiIHZpZXdCb3g9IjAgMCAxNiAxNiI+CiAgPHBhdGggZD0iTTggMTVBNyA3IDAgMSAxIDggMWE3IDcgMCAwIDEgMCAxNG0wIDFBOCA4IDAgMSAwIDggMGE4IDggMCAwIDAgMCAxNiIvPgogIDxwYXRoIGQ9Im04LjkzIDYuNTg4LTIuMjkuMjg3LS4wODIuMzguNDUuMDgzYy4yOTQuMDcuMzUyLjE3Ni4yODguNDY5bC0uNzM4IDMuNDY4Yy0uMTk0Ljg5Ny4xMDUgMS4zMTkuODA4IDEuMzE5LjU0NSAwIDEuMTc4LS4yNTIgMS40NjUtLjU5OGwuMDg4LS40MTZjLS4yLjE3Ni0uNDkyLjI0Ni0uNjg2LjI0Ni0uMjc1IDAtLjM3NS0uMTkzLS4zMDQtLjUzM3pNOSA0LjVhMSAxIDAgMSAxLTIgMCAxIDEgMCAwIDEgMiAwIi8+Cjwvc3ZnPg=="
              alt="download"
            />
          </div>
          <div
            class="s_btn Whatsapp"
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            title="Whatsapp"
          >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-whatsapp" id="shareOnWhatsApp" viewBox="0 0 16 16">
            <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
            </svg>
          </div>
          <div
            class="s_btn download"
            id="downloadButton"
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            title="Download"
          >
            <img
              loading="lazy"
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48IS0tIUZvbnQgQXdlc29tZSBGcmVlIDYuNS4xIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlL2ZyZWUgQ29weXJpZ2h0IDIwMjQgRm9udGljb25zLCBJbmMuLS0+PHBhdGggZmlsbD0iI2ZmZmZmZiIgZD0iTTI4OCAzMmMwLTE3LjctMTQuMy0zMi0zMi0zMnMtMzIgMTQuMy0zMiAzMlYyNzQuN2wtNzMuNC03My40Yy0xMi41LTEyLjUtMzIuOC0xMi41LTQ1LjMgMHMtMTIuNSAzMi44IDAgNDUuM2wxMjggMTI4YzEyLjUgMTIuNSAzMi44IDEyLjUgNDUuMyAwbDEyOC0xMjhjMTIuNS0xMi41IDEyLjUtMzIuOCAwLTQ1LjNzLTMyLjgtMTIuNS00NS4zIDBMMjg4IDI3NC43VjMyek02NCAzNTJjLTM1LjMgMC02NCAyOC43LTY0IDY0djMyYzAgMzUuMyAyOC43IDY0IDY0IDY0SDQ0OGMzNS4zIDAgNjQtMjguNyA2NC02NFY0MTZjMC0zNS4zLTI4LjctNjQtNjQtNjRIMzQ2LjVsLTQ1LjMgNDUuM2MtMjUgMjUtNjUuNSAyNS05MC41IDBMMTY1LjUgMzUySDY0em0zNjggNTZhMjQgMjQgMCAxIDEgMCA0OCAyNCAyNCAwIDEgMSAwLTQ4eiIvPjwvc3ZnPg=="
              alt="download"
            />
          </div>
          <div
            class="s_btn copylink"
            id="copyLinkButton"
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            title="CopyLink"
          >
            <img
              loading="lazy"
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NDAgNTEyIj48IS0tIUZvbnQgQXdlc29tZSBGcmVlIDYuNS4xIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlL2ZyZWUgQ29weXJpZ2h0IDIwMjQgRm9udGljb25zLCBJbmMuLS0+PHBhdGggZmlsbD0iI2ZmZmZmZiIgZD0iTTU3OS44IDI2Ny43YzU2LjUtNTYuNSA1Ni41LTE0OCAwLTIwNC41Yy01MC01MC0xMjguOC01Ni41LTE4Ni4zLTE1LjRsLTEuNiAxLjFjLTE0LjQgMTAuMy0xNy43IDMwLjMtNy40IDQ0LjZzMzAuMyAxNy43IDQ0LjYgNy40bDEuNi0xLjFjMzIuMS0yMi45IDc2LTE5LjMgMTAzLjggOC42YzMxLjUgMzEuNSAzMS41IDgyLjUgMCAxMTRMNDIyLjMgMzM0LjhjLTMxLjUgMzEuNS04Mi41IDMxLjUtMTE0IDBjLTI3LjktMjcuOS0zMS41LTcxLjgtOC42LTEwMy44bDEuMS0xLjZjMTAuMy0xNC40IDYuOS0zNC40LTcuNC00NC42cy0zNC40LTYuOS00NC42IDcuNGwtMS4xIDEuNkMyMDYuNSAyNTEuMiAyMTMgMzMwIDI2MyAzODBjNTYuNSA1Ni41IDE0OCA1Ni41IDIwNC41IDBMNTc5LjggMjY3Ljd6TTYwLjIgMjQ0LjNjLTU2LjUgNTYuNS01Ni41IDE0OCAwIDIwNC41YzUwIDUwIDEyOC44IDU2LjUgMTg2LjMgMTUuNGwxLjYtMS4xYzE0LjQtMTAuMyAxNy43LTMwLjMgNy40LTQ0LjZzLTMwLjMtMTcuNy00NC42LTcuNGwtMS42IDEuMWMtMzIuMSAyMi45LTc2IDE5LjMtMTAzLjgtOC42Qzc0IDM3MiA3NCAzMjEgMTA1LjUgMjg5LjVMMjE3LjcgMTc3LjJjMzEuNS0zMS41IDgyLjUtMzEuNSAxMTQgMGMyNy45IDI3LjkgMzEuNSA3MS44IDguNiAxMDMuOWwtMS4xIDEuNmMtMTAuMyAxNC40LTYuOSAzNC40IDcuNCA0NC42czM0LjQgNi45IDQ0LjYtNy40bDEuMS0xLjZDNDMzLjUgMjYwLjggNDI3IDE4MiAzNzcgMTMyYy01Ni41LTU2LjUtMTQ4LTU2LjUtMjA0LjUgMEw2MC4yIDI0NC4zeiIvPjwvc3ZnPg=="
              alt="copylink"
            />
          </div>
          <div
            class="s_btn share"
            id="shareButton"
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            title="Share"
          >
            <img
              loading="lazy"
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NDggNTEyIj48IS0tIUZvbnQgQXdlc29tZSBGcmVlIDYuNS4xIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlL2ZyZWUgQ29weXJpZ2h0IDIwMjQgRm9udGljb25zLCBJbmMuLS0+PHBhdGggZmlsbD0iI2ZmZmZmZiIgZD0iTTM1MiAyMjRjNTMgMCA5Ni00MyA5Ni05NnMtNDMtOTYtOTYtOTZzLTk2IDQzLTk2IDk2YzAgNCAuMiA4IC43IDExLjlsLTk0LjEgNDdDMTQ1LjQgMTcwLjIgMTIxLjkgMTYwIDk2IDE2MGMtNTMgMC05NiA0My05NiA5NnM0MyA5NiA5NiA5NmMyNS45IDAgNDkuNC0xMC4yIDY2LjYtMjYuOWw5NC4xIDQ3Yy0uNSAzLjktLjcgNy44LS43IDExLjljMCA1MyA0MyA5NiA5NiA5NnM5Ni00MyA5Ni05NnMtNDMtOTYtOTYtOTZjLTI1LjkgMC00OS40IDEwLjItNjYuNiAyNi45bC05NC4xLTQ3Yy41LTMuOSAuNy03LjggLjctMTEuOXMtLjItOC0uNy0xMS45bDk0LjEtNDdDMzAyLjYgMjEzLjggMzI2LjEgMjI0IDM1MiAyMjR6Ii8+PC9zdmc+"
              alt="share"
            />
          </div>
        </div>
        <!-- company logo footer-->
        <div class="brand_footer">
          <a href="https://www.textronic.com" target="_blank">
            <div class="company_name_logo">
              <img
                loading="lazy"
                id="tdsLogo"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADcAAAA3CAYAAACo29JGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NUE4Qzc3NThGNTQzMTFFRDhBMDlDM0M3M0IwRTFGQTIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NUE4Qzc3NTlGNTQzMTFFRDhBMDlDM0M3M0IwRTFGQTIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1QThDNzc1NkY1NDMxMUVEOEEwOUMzQzczQjBFMUZBMiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1QThDNzc1N0Y1NDMxMUVEOEEwOUMzQzczQjBFMUZBMiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Ph58f/UAAAjtSURBVHja7FlrbBTX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"
                alt="brand_logo"
              />
              <span>Powered by Textronics</span>
              <span class="g_copyright">&nbsp|&nbsp © Getzner</span>
            </div>
          </a>
        </div>
        <!-- fabric name-->
        <div class="drap_fabric_name"></div>

        <!-- fabric full view button -->
        <div
          class="fab_fullview"
          data-bs-toggle="modal" 
          data-bs-target="#fabric_fullview"
        >
          <button class="btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-info-circle"
              viewBox="0 0 16 16"
            >
              <path
                d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"
              />
              <path
                d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"
              />
            </svg>
          </button>
        </div>

        <!-- filter button-->
        <div
          class="filter_btn"
          data-bs-toggle="modal"
          data-bs-target="#filter_popup"
        >
          <button class="btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-filter"
              viewBox="0 0 16 16"
            >
              <path
                d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"
              />
            </svg>
          </button>
        </div>

        <!--style_group-->
        <div class="product_group" id="groupInfo">
          <!-- dynamically Code here -->
        </div>

        <!-- Notification message -->
 <div class="alert alert-light" id="common_notification" role="alert">
 Link copied successfully
</div> 

        <!-- drap model image-->
        <div class="model_img_box" id="modelbox">
          <div id="notification"></div>
          <img id="modelImage" loading="lazy" />
          <!-- <div class="fabric_change"> -->
          <!-- fabric change arrow  -->
        <div class="loader-container" id="New_loader_css" style="display:block">
        <div class="loader-circle"></div>
        <div class="loader-image"><img src="https://s3.ap-south-1.amazonaws.com/aws.tds/dam/q3d/images/spinner_img.png" ></div>
        <div class="waiting"></div>
        </div>
          <div
            class="prev_fabric"
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            title="Previous Fabric"
          ></div>
          <div
            class="next_fabric"
            data-bs-toggle="tooltip"
            data-bs-placement="left"
            title="Next Fabric"
          ></div>
          <!--  </div> -->
        </div>
      </div>
      <!--("fabric_lib_hide") fabric libery hide-->
      <!--("desk_fab_fullview") desktop fabric panel fullview -->
      <!--("link_qr") show login box and search -->
      <div class="p-0 fabric">
      <!-- After copylink or QR login strip  and search -->
      <div class="fabric_view_login">
      <div class="login_strip"> Please <h6 class="redirect_login"> Login to View Fabrics </h6></div>
     <div class="fab_search_box">
                  <input class="form-control mr-sm-2 fab_search fab_search_input2" type="text" placeholder="Search...." aria-label="Search">
                  <div class="fab_close_search">
                    <div class="fab_close2">
                      <img loading="lazy" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABBUlEQVR4nO3ZTQqDMBAF4HeKPOkV2+MWbE9jKXUhRcQk8xeZt3Il8xFNZgiQyWQyV8odwORdBH41fGtpygPAAmB2xkxrDctaU3UKgOf6gjeAG+zDTQ2vnho8MZRCeGIojfDAUAthiaE2wgJjhtDEmCM0MG4ISYw7QgITBtGDCYdowYRF1GDCI85ghkEcYYZD7M0Q899zhEGteWWGW4lttp+T53DWlUt8Wtz5sSOMzVU52p2GwfDEFhsew4pzIiyGDYddOAw7TuwwGAq0He4YCvZObhgqNIDmGCp2sWYYi1a8aGMs54mihfEYioo0xnOyK1KYCONpkcBc5urtMpehmUwmg3D5AAklyc9YEtl/AAAAAElFTkSuQmCC" alt="clear_image">
                    </div>
                    <div class="fab_search_icon2">
                      <img loading="lazy" src="data:image/png;base64,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" alt="clear_image">
                    </div>
                  </div>
                </div>
      </div> 
      <!-- desktop fabric expand button -->
      <div class="desk_fab_expand" title="Expand"> </div>
        <!-- Expand and close button-->
        <div class="btn_fabric_group">
          <!-- fabric expand and reduce add class("fabric_reduce") to class ("fabric") -->
          <button class="btn fabric_expand">
            <strong
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-chevron-up"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"
                /></svg
            ></strong>
            <span class="fab_exp">Expand</span>
            <span class="fab_red">Reduce</span>
          </button>
          <button class="btn fabric_close" id="crossButton1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-x"
              viewBox="0 0 16 16"
            >
              <path
                d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"
              />
            </svg>
          </button>
        </div>
        <div class="fab_features_wrap">
          <div class="fab_new_warp">
            <!-- destktop , tab and  ipad landscape libery head -->
            <div
            class="btn_fabric_lib"
            >
            <div class="lib_wrap"
            data-bs-toggle="tooltip"
            data-bs-placement="bottom"
            title="Fabric Library Button"
            >
              <div class="lib_head">
                <span>Product</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-caret-down-fill"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"
                  />
                </svg>
              </div>
              <b></b>
              </div>
              <div class="g_btn_info" data-bs-toggle="modal" data-bs-target="#layout_info_popup"> info </div>
            </div>
            <!-- main libery list -->
            <div class="fabric_lib">
              <ul>
                
              </ul>
            </div>
            <!--fabric search and fillter-->
            <div class="fab_search_filter">
              <!--"single_sort_search" add active show sortby -->
              <div class="single_sort_search">
                <div class="fab_search_box">
                  <input
                    class="form-control mr-sm-2 fab_search fab_search_input1"
                    type="text"
                    placeholder="Search...."
                    aria-label="Search"
                    name="a"
                  />
                  <div class="fab_close_search">
                    <div class="fab_close1">
                      <img
                        loading="lazy"
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABBUlEQVR4nO3ZTQqDMBAF4HeKPOkV2+MWbE9jKXUhRcQk8xeZt3Il8xFNZgiQyWQyV8odwORdBH41fGtpygPAAmB2xkxrDctaU3UKgOf6gjeAG+zDTQ2vnho8MZRCeGIojfDAUAthiaE2wgJjhtDEmCM0MG4ISYw7QgITBtGDCYdowYRF1GDCI85ghkEcYYZD7M0Q899zhEGteWWGW4lttp+T53DWlUt8Wtz5sSOMzVU52p2GwfDEFhsew4pzIiyGDYddOAw7TuwwGAq0He4YCvZObhgqNIDmGCp2sWYYi1a8aGMs54mihfEYioo0xnOyK1KYCONpkcBc5urtMpehmUwmg3D5AAklyc9YEtl/AAAAAElFTkSuQmCC"
                        alt="clear_image"
                      />
                    </div>
                    <div class="fab_search_icon1">
                      <img
                        loading="lazy"
                        src="data:image/png;base64,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"
                        alt="clear_image"
                      />
                    </div>
                  </div>
                </div>
                <!-- single sort_by and group_by hide -->
                <div class="sort_by_dropdown">
                  <button
                    class="btn dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton2"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-sort-down-alt"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M3.5 3.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 12.293zm4 .5a.5.5 0 0 1 0-1h1a.5.5 0 0 1 0 1zm0 3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 0 1zm0 3a.5.5 0 0 1 0-1h5a.5.5 0 0 1 0 1zM7 12.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5"
                      ></path>
                    </svg>
                  </button>
                  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton2">
                    <li value= "IsNameAsc"><a class="dropdown-item" href="#">Name ASC</a></li>
                        <li value='IsNameDesc'><a class="dropdown-item" href="#">Name DESC</a></li>
                        <li value='IsDateAsc'><a class="dropdown-item" href="#">Latest ASC</a></li>
                        <li class="active" value='IsDateDesc'><a class="dropdown-item" href="#">Latest DESC</a></li>
                  </ul>
                </div>
              </div>
              <div
                class="fab_fillter"
              >
                <button type="button" class="btn Filters">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-filter"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"
                    /></svg
                  >Filters
                </button>
              </div>
            </div>
          </div>
          <!--sort by and group by-->
          <div class="sorting_dropdown">
            <div class="group_by_dropdown">
              <button
                class="btn dropdown-toggle"
                type="button"
                id="dropdownMenuButton3"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-grid-3x2-gap-fill"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M1 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zM1 9a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1z"
                  />
                </svg>
                Select Group
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton3" id="productTypeGroup">
                <li class="active">
                  <a class="dropdown-item" href="#">test-Suiting</a>
                </li>
                <li>
                  <a class="dropdown-item" href="#">Apparel-Shirting</a>
                </li>
                <li>
                  <a class="dropdown-item" href="#">Apparel-Suiting</a>
                </li>
              </ul>
            </div>
            <div class="sort_by_dropdown">
              <button
                class="btn dropdown-toggle"
                type="button"
                id="dropdownMenuButton4"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-sort-down-alt"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M3.5 3.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 12.293zm4 .5a.5.5 0 0 1 0-1h1a.5.5 0 0 1 0 1zm0 3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 0 1zm0 3a.5.5 0 0 1 0-1h5a.5.5 0 0 1 0 1zM7 12.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5"
                  />
                </svg>
                Sort By
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton4" id="sortByDropdown">
                  <li value= "IsNameAsc"><a class="dropdown-item" href="#">Name ASC</a></li>
                        <li value='IsNameDesc'><a class="dropdown-item" href="#">Name DESC</a></li>
                        <li value='IsDateAsc'><a class="dropdown-item" href="#">Latest ASC</a></li>
                        <li class="active" value='IsDateDesc'><a class="dropdown-item" href="#">Latest DESC</a></li>
              </ul>
            </div>
          </div>
        </div>
        <!-- fabric count -->
        <div class="fabric_count">
          <span></span>
        </div>
        <div class="last_drap_fab" style="display:none"> </div>
        <!-- <div class="single_fabric"></div>  -->
        <!--fabric thumbnail list-->
        <div class="fabric_thumb">
        <ul id ="myuploadFabric" style="display:none"></ul>
          <ul id="appendFabricList">
            <!--     <li class="active">
                                <div class="fabric_thumb_wrap">
                                  <div
                                    class="fabric_img"
                                    style="
                                      background-image: url('https://s3.ap-south-1.amazonaws.com/aws.tds/tds_textronics/1833265648/t/864-3t.jpg');
                                    "
                                    data-src="https://s3.ap-south-1.amazonaws.com/aws.tds/tds_textronics/1833265648/t/864-3t.jpg"
                                  ></div>
                                  <div class="fabric_info">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      fill="currentColor"
                                      class="bi bi-info-circle"
                                      viewBox="0 0 16 16"
                                    >
                                      <path
                                        d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"
                                      />
                                      <path
                                        d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"
                                      />
                                    </svg>
                                  </div>
                                  <div class="fabric_name">CHESTER-0007-4t</div>
                                  
                                </div>
                              </li> -->
                              
          </ul>
        
        </div>
        <!-- Load more button -->
      <!--  <div class="load_more">
        <button type="button" class="btn btn-dark">Load More....</button>
        </div> -->
      </div>
      <!-- fabric & style buttons -->
      <div class="p-0 menu_buttons">
      <!-- getzner info menu button -->
        <button type="button" class="btn menu_btn_info" data-bs-toggle="modal" data-bs-target="#layout_info_popup">
        <i class="fa fa-info-circle" aria-hidden="true"></i> 
     <!-- <img src="https://s3.ap-south-1.amazonaws.com/aws.tds/dam/q3d/images/info_detail.png" alt="info button image" loading="lazy"> -->
        </button>
        <div class="btn_vline g_vline"></div>
        <button type="button" id="fabricButton" class="btn menu_btn_fabric">
          Fabric
        </button>
        <div class="btn_vline"></div>
        <button type="button" id="styleButton" class="btn menu_btn_style">
          Style
        </button>
      </div>
      <!-- fabric & style panel with single button -->
      <div class="container_outer_panel">
        <div class="fabric_style_panel">
          <!--single button for the style and fabric-->
          <div class="fab_style_btn_box">
            <button class="fabric_style_btn btn">
              <img
                class="fabric_btn_img img-thumbnail"
                id="fabricImage"
                src="data:image/png;base64,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"
                alt="fabric_image"
              />
              <img
                class="style_btn_img img-thumbnail active"
                id="styleImage"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAABYCAMAAABGS8AGAAACslBMVEUAAAAA//+AgP9Vqv+Av/9mmf+Aqv9ttv+An/9xqv+As/90uf+Aqv92sf+Atv93qv+Ar/94tP+Aqv95rv+As/95qv+Arv96sf+Aqv96rf+Asf97qv+Arf97sP+Aqv97rf+Ar/98sv+Arf98r/+Asf98rP95rv95rP98rv95sP99rP96rv99sP96rP99rv96r/99rP96rf99r/97rP99rf97r/99sP97rf99rv97sP99rf97rv99sP97rf99rv98r/t+rft8rvt+r/t8rft+rvt8r/t+rPt8rvt6r/x8rPx6rfx8rvx7sPx8rfx7rvx8r/x7rfx8rvx7r/x8rfx7rvx9r/x7rfx9rvx7r/x9rfx9r/x7rfx9rvx7rvx9rvx8r/x9rfx9r/18rf19rv18r/19rf18rv19r/18rf17rv18r/17rf18rv18rf17rv17r/18rv17rv18rv17r/18rf17rv18r/18rf18r/19rf18rv19rv18rv19rf18r/19rv18rv19r/18rv19rv18r/17rf18rv17r/18rf17rv18rv17rf18rv17rv18rf17rv18rv17rf18rv18rv18r/18rv18rv18r/18rv18rv18r/18rv19rv59rf58rv59rv58rf59rv58rv59rf58rv59rv58r/57rv58rv57r/58rv57rv58r/57rv58rv57rv58rvx8rvx8rvx8rvx8rfx8rvx8rfx8rvx8rvx8r/x8rv18r/18rv18rv18rv18rv19rv18rv19rv18rv19rv17rf18rv17rv18rv18r/18rv18rv18rv18rv18rv18rv18rv18rv18rv18rv18rv18rv18rv18rv18rv18rf18rv18rv18rv18rv18rv18rv18rv18rv18rv18rv18rv3///8UKJoqAAAA5HRSTlMAAQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiMkJSYoKSorLC0uLzAxMjM0NTY3ODk6Ozw9Pj9AQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpcXV5fYmNkZmdoaWprbG1ub3Bxc3R2d3h7fH1+f4CCg4SHiImMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqrK2ur7CxsrO0tba3uLm6u7y9vsDCw8TFx8jJysvMzs/Q0tTV1tfY2dvc3+Dh4uTn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7lVIWrAAAAAWJLR0TlWGULvwAABPdJREFUGBmdwYlDDXYAB/Dv6x2VvQ5pqVcjIUnOJE2hLDNyrKURpibDXGloszZjjpnm2OxgLTNmZq6xI7OJMNZaqrdEUq/e9w/Zu7pe7+dnv88Hjxde2kzPyuOgbCAQ1E6RSGCMDgpmn22PBC5T4Cbg01BVqMf/E5CA4+QG4FUKrAEyyetI7YMnF/Tmv1eQSf5pgE81HSxmlxY61BuB82SBV80/657CkwkpbiSt4d615Cogiw7n4XKYDjnADLLFFE/yboERcqZtTbTbgFVkbX/gAO1+jnI5QbvPAd8Kcit20K6u0B+PZ3yrmU5VOn0leUEHw9fs5aQ3cJCsDfS7RyfzpgCI6fOr2SkPqW3kLg0MJXRz0AdYQzIHG9mpdrkOAi/eZDd1wVhHcp8WmHuH3VRlASgkuR2RD9nNtenwJPp79nRUg0MkvzMB+sUXWulguZhrAPz3kzyt019gTydj0EvsI7orgnYPSfNSHQDj1IWr1+SkBQDQzKkiWeaNHXRnSYY7QwPdWQuAN9pJ/rU2FJ36Lq2gzU6t5h320hqEXg6zt/f0SKygXcXu9Uuyshavff9yG21up8P3AHs7i97m04PyaBjWVdFNzWYjRl2jB8vhLiTZt4EePNoWDF32t43s1HRmqQ9MJRZ60BI8NhI97f0AH9Gje7vjAF1i/uZdR0p3F61I8QYSDjykR8dQVIYeAu7f1iRRJBc9FFJkDsotEegun0xCOQVqApBW4DIR4Q8ocMtrqJWb0N0P5JdYQJF3EWOhw30TPqXICuwif0c3fo/ItjhtBQVaorGDDoVItFKgynfAQ9IagS7zaHNWk0GREwiqp80dX80vFHkFR2iThy4ltFuGYxRJxyraZGMRRS56ZdLuKLrcoN2DUf1rKHBNp79OXtIY/6bAvaioetrVadAhxEqH26ETmiiwEjPYHo8tFGhND7xKp1h0yKRLZVhyDT2r74dTHyOymZ41zAwsp0s+Omxnhxthpr30bCe8DSilZ4ejAsvZ4Qt0uMROf0BLzyyxQAoFwnCanW6hg1/edbqYoaPAOXj9RoEwVNKluigYLlrAK+OMlXZm6CmSkUuRcFTS4adsPaCF04xzkwHEfthE0gwDReobKRKBSpIth+IBjD++BE455I+zNEDQ+js0w5sKnkElq4tCAaSeItfCaTVtKvN8AG3mN/ChggH4bJEB0Odcoc3bcNpCh7vFJtj4UsFA2Pi/XkWHEjjlt9KpuSQG6EMFkcCg7Y10at8Il8GfWOhk3QcjFUShuI1O7WUj0CWsqJ4OF+FHBVEoo8P9vcPRkzH3V9ochz8VDMF+2lxdGQgPYorr+BUCqGAI9rC5dBpE+izZgEAqiMZry/zxeH2pIBpyQVQwDHL9qCAGck9TwXDIhVBBLOT6U8EIyIVSQRzkwqhgJORMVDAacuFUMAZyEVQwFnIDqGAc5AZSQTzkIqlgPOQGUUEC5KKoYALkBlPBRMgNoYIkyA2lgmchF00FkyA3jAqSIRdDBSmQG04FkyEXSwVTIDeCClIhF0cFaZAbSQXTIDeKCp6D3GgqSIfcWCqYDrlxVPA85OKp4AXIjaeCmZBLoIJZkJtABRmQS6SC2ZCbSAVzIJdEBXMhN4kK5kEumQoyIZdCBS9BbjIVZEFuChXMh9xUKsiGXCoVvAy5NCpYALlpVLAQclPNLnwCDWan+XD3H/Glt2d8maHIAAAAAElFTkSuQmCC"
                alt="style_image"
              />
            </button>
          </div>
          <div class="thumb_list_wrap">
            <!--style list-->
            <div class="style_thumb_list active">
            
            </div>
            <!--Fabric list-->
            <div class="fabric_thumb_list">
              <ul id="q3dLiteappendFabricList">
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Notification success -->
<div class="alert alert-success" id="sucessToolTip" role="alert">
  Welcome to Q3d. Your login was successful.
   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>
</div>

<!-- qr popup -->
<div class="container-fluid camera_popup" style="display: none;">
  <div class="row">
    <div class="col-sm-12 p-0">
      <header>
        <h5>Scan Fabric & Get 3D</h5>
        <div class="cross_btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-x"
            viewBox="0 0 16 16"
          >
            <path
              d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"
            />
          </svg>
        </div>
      </header>
    </div>
    <div class="col-sm-12 p-0">
      <div class="gallery_img">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-images"
          viewBox="0 0 16 16"
        >
          <path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
          <path
            d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2M14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1M2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1z"
          />
        </svg>
      </div>
      <div class="content_body">
        <video id="Qr-scan" style="width: 100%; max-width: 600px;"></video>
      </div>
    </div>
  </div>
</div>
<!-- barcode popup --> 
<div class="container-fluid barcode_popup" style="display: none;">
  <div class="row">
    <div class="col-sm-12 p-0">
      <header>
        <h5>Scan Barcode Fabric & Get 3D</h5>
        <div class="barcode_cross_btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-x"
            viewBox="0 0 16 16"
          >
            <path
              d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"
            />
          </svg>
        </div>
      </header>
    </div>
    <div class="col-sm-12 p-0">
      <div class="gallery_img">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-images"
          viewBox="0 0 16 16"
        >
          <path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
          <path
            d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2M14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1M2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1z"
          />
        </svg>
      </div>
      <div class="content_body">
      </div>
    </div>
  </div>
</div>
<!-- Fullview fabric desigen popup-->
<div
  class="modal fade"
  id="fabric_fullview"
  tabindex="-1"
  aria-labelledby="fabric_fullviewLabel"
  aria-hidden="true"
>
  <div class="modal-dialog modal-fullscreen">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="fabric_fullviewLabel">
          Fabric Details
        </h5>
        <button
          type="button"
          class="btn fullviewCloseBtn"
          data-bs-dismiss="modal"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-x-lg"
            viewBox="0 0 16 16"
          >
            <path
              d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"
            ></path>
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <div
          class="fabric_fullview_img"
        >
                <button
          type="button"
          class="btn btn_close"
          data-bs-dismiss="modal"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-x-lg"
            viewBox="0 0 16 16"
          >
            <path
              d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"
            ></path>
          </svg>
        </button>
          <div
            class="fullview_prev_fabric"
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            title="Previous Fabric"
          ></div>
          <div
            class="fullview_next_fabric"
            data-bs-toggle="tooltip"
            data-bs-placement="left"
            title="Next Fabric"
            style="visibility: visible;"
          ></div>
        </div>
        <div class="fabric_properties_box">
          <div class="fabric_properties_body">
          <div class="show_more"><span>Show More</span></div>
          </div>
          <div class="apply_button" id="apply_button"><button type="button" class="btn">Apply</button></div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- fabric filter popup -->
<div
  class="modal fade"
  id="filter_popup"
  tabindex="-1"
  role="dialog"
  aria-labelledby="filter_popup"
  aria-hidden="true"
>
  <div class="modal-dialog modal-fullscreen" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-6" id="exampleModalLabel">
          fabric filter
        </h1>
        <button
          type="button"
          class="btn closefilterModel filter_close"
          data-bs-dismiss="modal"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-x-lg"
            viewBox="0 0 16 16"
          >
            <path
              d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"
            />
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <div class="container-fluid">
          <div class="row">
            <div
              class="col-md-12 d-flex flex-row-reverse reset_wrap"
              style="background-color: #f3f3f3;"
              data-bs-dismiss="modal"
            >
              <button type="button" class="btn fabric_reset">Reset</button>
            </div>
            <div class="col-md-12 filter_body">
              <div class="row">
                <!-- <div class="filter_wrap">
                       <div class="col-md-12 header_options">
                          <div class="option_name">colors</div>
                          <div class="option_arrow">
                            <div class="arrow_down">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="bi bi-chevron-down"
                                viewBox="0 0 16 16"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"
                                />
                              </svg>
                            </div>
                            <div class="arrow_up">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="bi bi-chevron-up"
                                viewBox="0 0 16 16"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"
                                />
                              </svg>
                            </div>
                            <div></div>
                          </div>
                        </div>
                        <div class="col-md-12 options_body">
                          <div class="form-check">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              value=""
                              id="flexCheckDefault"
                            />
                            <label class="form-check-label" for="flexCheckDefault">
                              Brown
                            </label>
                          </div>
                          <div class="form-check">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              value=""
                              id="flexCheckChecked"
                              checked
                            />
                            <label class="form-check-label" for="flexCheckChecked">
                              Green
                            </label>
                          </div>
                          <div class="form-check">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              value=""
                              id="flexCheckDefault"
                            />
                            <label class="form-check-label" for="flexCheckDefault">
                              Brown
                            </label>
                          </div>
                          <div class="form-check">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              value=""
                              id="flexCheckChecked"
                              checked
                            />
                            <label class="form-check-label" for="flexCheckChecked">
                              Green
                            </label>
                          </div>
                          <div class="form-check">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              value=""
                              id="flexCheckDefault"
                            />
                            <label class="form-check-label" for="flexCheckDefault">
                              Brown
                            </label>
                          </div>
                          <div class="form-check">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              value=""
                              id="flexCheckChecked"
                              checked
                            />
                            <label class="form-check-label" for="flexCheckChecked">
                              Green
                            </label>
                          </div>
                        </div>
                      </div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button
          type="button"
          class="btn btn-secondary filter_result w-100"
          data-bs-dismiss="modal"
        >
          SHOW RESULTS
        </button>
      </div>
    </div>
  </div>
</div>

<!-- login side panel for the portrait view modal -->
<div
  class="modal fade"
  id="login_side_panel"
  tabindex="-1"
  aria-labelledby="exampleModalLabel"
  aria-hidden="true"
>
  <div class="modal-dialog modal-fullscreen">
    <div class="modal-content">
      <div class="modal-header">
        <button
          type="button"
          class="btn loginCrossBtn"
          aria-label="Close"
          data-bs-dismiss="modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-x-lg"
            viewBox="0 0 16 16"
          >
            <path
              d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"
            ></path>
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <button type="button" id='silent_Login_button' class="btn login sidebar_loginbtn btn-dark">
          LOGIN
        </button>
        <div class="sidebar_userprofile_menu">
          <button class="btn sidebar_login_btn" type="button">
            <span class="user_name">textronic</span>
            <div class="user_img">
              <img
                src=""
                alt="user avtaar"
              />
            </div>
          </button>
          <ul class="list-group list-group-flush">
            <li class="list-group-item p_setdpi_btn" data-bs-toggle="modal" data-bs-target="#Setdpi_popup">Set DPI</li>
            <li class="list-group-item p_about" onclick="window.open('https://s3.ap-south-1.amazonaws.com/aws.tds/help.pdf')">About</li>
            <li class="list-group-item" id ="myProfile" data-bs-toggle="modal" data-bs-target="#user_profile" > My Profile </li>
            <li class="list-group-item" id ='changePass' data-bs-toggle="modal" data-bs-target="#user_change_pass" > Change Password </li>
             <li id='showCredit' class="list-group-item totem"><a class="dropdown-item" href="#" >My Credits</a ></li>
            <li class="list-group-item" id="Logout" >Logout</li>
          </ul>
        </div>
      </div>
<!--      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
          Close
        </button>
      </div> -->
    </div>
  </div>
</div>

<!-- User profile form popup Modal -->
<div
  class="modal fade"
  id="user_profile"
  tabindex="-1"
  aria-labelledby="exampleModalLabel"
  aria-hidden="true"
>
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <div class="header_wrap">
          <h5 class="modal-title" id="exampleModalLabel">My Profile</h5>
        </div>
        <button
          type="button"
          class="btn"
          data-bs-dismiss="modal"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-x-lg"
            viewBox="0 0 16 16"
          >
            <path
              d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"
            ></path>
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <form class="row g-2">
          <div class="col-md-12">
            <label for="validationDefault01" class="form-label"
              >First name</label
            >
            <input
              type="text"
              class="form-control"
              id="validationDefault01"
              value=""
              placeholder="First_name"
              required
            />
             <div class="invalid-firstname"> Enter valid first name </div>
          </div>
          <div class="col-md-12">
            <label for="validationDefault02" class="form-label"
              >Last name</label
            >
            <input
              type="text"
              class="form-control"
              id="validationDefault02"
              placeholder="Last_name"
              value=""
              required
            />
            <div class="invalid-lastname"> Enter valid last name </div>
          </div>
          <div class="col-md-12">
            <label for="validationDefault03" class="form-label">User Id</label>
            <input
              type="text"
              class="form-control user_id"
              id="validationDefault03"
              placeholder="User_Id"
              value=""
              required
              readonly
            />
          </div>
          <div class="col-md-12">
            <label for="validationDefault04" class="form-label">Email</label>
            <input
              type="email"
              class="form-control"
              id="validationDefault04"
              placeholder="Email"
              value=""
              required
              maxlength="150"
            />
           <div class="invalid-email"> Enter valid email Id</div>
          </div>
          <div class="col-md-12">
            <label for="validationDefault05" class="form-label">Mobile</label>
            <input
              type="tel"
              class="form-control"
              id="validationDefault05"
              value=""
              placeholder="Mobile number"
              maxlength="10"
              pattern="[1-9]{1}[0-9]{9}"
              required
            />
            <div class="invalid-mobile"> Enter valid mobile number</div>
          </div>
          <div class="col-12">
            <label for="myfile" class="form-label">Profile</label>
            <div class="edit_wrap">
              <div class="profile_img">
                <img
                  src=""
                  alt="user image"
                />
              </div>
              <div class="profile_change_btn"> 
              <button class="btn btn-info change" id="changeUserProfilePhoto" type="button">
                Change
              </button>
              <input type="file" id="myfile" name="myfile">
              </div>
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button
          id="updateProfile"
          type="button"
          class="btn btn-secondary update"
        >
          Update
        </button>
      </div>
    </div>
  </div>
</div>

<!-- user change password popup Modal -->
<div
  class="modal fade"
  id="user_change_pass"
  tabindex="-1"
  aria-labelledby="exampleModalLabel"
  aria-hidden="true"
>
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <div class="header_wrap">
          <h5 class="modal-title">Change Password</h5>
        </div>
        <button
          type="button"
          class="btn"
          data-bs-dismiss="modal"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-x-lg"
            viewBox="0 0 16 16"
          >
            <path
              d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"
            ></path>
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <form class="row g-2">
          <div class="col-md-12 Old_Pass">
            <label for="inputPassword1" class="form-label">Old Password</label>
            <input
              type="password"
              class="form-control"
              id="inputPassword1"
              required=""
              placeholder="Old Password"
            />
            <div class="pass_Old_eye">
              <img
                alt="password change_pass_hide icon"
                class="change_eye_show"
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItZXllIj48cGF0aCBkPSJNMSAxMnM0LTggMTEtOCAxMSA4IDExIDgtNCA4LTExIDgtMTEtOC0xMS04eiI+PC9wYXRoPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjMiPjwvY2lyY2xlPjwvc3ZnPg=="
              />
              <img
                alt="password change_pass_show icon"
                class="change_eye_hide"
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItZXllLW9mZiI+PHBhdGggZD0iTTE3Ljk0IDE3Ljk0QTEwLjA3IDEwLjA3IDAgMCAxIDEyIDIwYy03IDAtMTEtOC0xMS04YTE4LjQ1IDE4LjQ1IDAgMCAxIDUuMDYtNS45NE05LjkgNC4yNEE5LjEyIDkuMTIgMCAwIDEgMTIgNGM3IDAgMTEgOCAxMSA4YTE4LjUgMTguNSAwIDAgMS0yLjE2IDMuMTltLTYuNzItMS4wN2EzIDMgMCAxIDEtNC4yNC00LjI0Ij48L3BhdGg+PGxpbmUgeDE9IjEiIHkxPSIxIiB4Mj0iMjMiIHkyPSIyMyI+PC9saW5lPjwvc3ZnPg=="
              />
            </div>
            <div class="invalid-feedback oldpass">
              Enter Valid Old Password
            </div>
          </div>
          <div class="col-md-12 New_Pass">
            <label for="inputPassword2" class="form-label">New Password</label>
            <input
              type="password"
              class="form-control"
              id="inputPassword2"
              required=""
              placeholder="New Password"
            />
            <div class="pass_new_eye">
              <img
                alt="password change_pass_hide icon"
                class="change_eye_show"
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItZXllIj48cGF0aCBkPSJNMSAxMnM0LTggMTEtOCAxMSA4IDExIDgtNCA4LTExIDgtMTEtOC0xMS04eiI+PC9wYXRoPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjMiPjwvY2lyY2xlPjwvc3ZnPg=="
              />
              <img
                alt="password change_pass_show icon"
                class="change_eye_hide"
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItZXllLW9mZiI+PHBhdGggZD0iTTE3Ljk0IDE3Ljk0QTEwLjA3IDEwLjA3IDAgMCAxIDEyIDIwYy03IDAtMTEtOC0xMS04YTE4LjQ1IDE4LjQ1IDAgMCAxIDUuMDYtNS45NE05LjkgNC4yNEE5LjEyIDkuMTIgMCAwIDEgMTIgNGM3IDAgMTEgOCAxMSA4YTE4LjUgMTguNSAwIDAgMS0yLjE2IDMuMTltLTYuNzItMS4wN2EzIDMgMCAxIDEtNC4yNC00LjI0Ij48L3BhdGg+PGxpbmUgeDE9IjEiIHkxPSIxIiB4Mj0iMjMiIHkyPSIyMyI+PC9saW5lPjwvc3ZnPg=="
              />
            </div>
            <div class="invalid-feedback newpass">
              Please enter new password
            </div>
          </div>
          <div class="col-md-12 Confirm_Pass">
            <label for="inputPassword3" class="form-label"
              >Confirm Password</label
            >
            <input
              type="password"
              class="form-control"
              id="inputPassword3"
              required=""
              placeholder="Confirm Password"
            />
            <div class="pass_confirm_eye">
              <img
                alt="password change_pass_hide icon"
                class="change_eye_show"
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItZXllIj48cGF0aCBkPSJNMSAxMnM0LTggMTEtOCAxMSA4IDExIDgtNCA4LTExIDgtMTEtOC0xMS04eiI+PC9wYXRoPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjMiPjwvY2lyY2xlPjwvc3ZnPg=="
              />
              <img
                alt="password change_pass_show icon"
                class="change_eye_hide"
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItZXllLW9mZiI+PHBhdGggZD0iTTE3Ljk0IDE3Ljk0QTEwLjA3IDEwLjA3IDAgMCAxIDEyIDIwYy03IDAtMTEtOC0xMS04YTE4LjQ1IDE4LjQ1IDAgMCAxIDUuMDYtNS45NE05LjkgNC4yNEE5LjEyIDkuMTIgMCAwIDEgMTIgNGM3IDAgMTEgOCAxMSA4YTE4LjUgMTguNSAwIDAgMS0yLjE2IDMuMTltLTYuNzItMS4wN2EzIDMgMCAxIDEtNC4yNC00LjI0Ij48L3BhdGg+PGxpbmUgeDE9IjEiIHkxPSIxIiB4Mj0iMjMiIHkyPSIyMyI+PC9saW5lPjwvc3ZnPg=="
              />
            </div>
            <div class="invalid-feedback currentpass">
              Password and Confirm Password does not match
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button
          type="button"
          class="btn btn-secondary change_save"
        >
          save
        </button>
      </div>
    </div>
  </div>
</div>

<!------- Setdpi Modal popup --------->
  <div
      class="modal fade"
      id="Setdpi_popup"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-fullscreen">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" id="Setdpi">Screen DPI Setup</h4>
            <button
              type="button"
              class="btn setdpi_close"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-x-lg"
                viewBox="0 0 16 16"
              >
                <path
                  d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"
                ></path>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-7 fabric_desigen"></div>
              <div class="col-md-4 setdpi_value">
                <form>
                  <div class="row mt-1 screen_resolution">
                    <span class="heading">Screen Resolution</span>
                    <div class="radio_input_wrap">
                    <div class="col-md-6 input_wrap mt-3">
                      <label for="validationCustom01" class="form-label"
                        >Horizontal</label
                      >
                      <input
                        id="validationCustom01"
                        type="text"
                        class="form-control"
                        value=""
                        readonly="readonly"
                      />
                      <div class="valid-feedback">
                        Looks good!
                      </div>
                    </div>
                    <div class="col-md-6 input_wrap mt-3">
                      <label for="validationCustom02" class="form-label"
                        >Vertical</label
                      >
                      <input
                        type="text"
                          id="validationCustom02"
                        class="form-control"
                        value=""
                        readonly="readonly"
                      />
                      <div class="valid-feedback">
                        Looks good!
                      </div>
                    </div>
                  </div>
                  </div>
                  <div class="row mt-4 screen_size">
                    <span class="heading">Screen Size</span>
                    <div class="radio_input_wrap">
                    <div class="col-md-6 mt-3">
  <div class="form-check">
    <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
    <label class="form-check-label" for="flexRadioDefault1">
      Inch
    </label>
  </div>
</div>
<div class="col-md-6 mt-3">
  <div class="form-check">
    <input
      class="form-check-input"
      type="radio"
      name="flexRadioDefault"
      checked
      id="flexRadioDefault2"
    />
    <label class="form-check-label" for="flexRadioDefault2">
      Centimeter
    </label>
  </div>
</div>
</div>
<div class="radio_input_wrap">
                    <div class="col-md-6 input_wrap mt-4">
                      <label for="validationCustom01" class="form-label"
                        >Width</label
                      >
                      <input
                        type="text"
                        class="form-control"
                        value=""
                      />
                      <div class="valid-feedback">
                        Looks good!
                      </div>
                    </div>
                    <div class="col-md-6 input_wrap mt-4">
                      <label for="validationCustom03" class="form-label"
                        >Height</label
                      >
                      <input
                        id="validationCustom03"
                        type="text"
                        class="form-control"
                        value=""
                      />
                    </div>
                  </div>
                  </div>
                  <div class="row mt-3 density">
                    <span class="heading mt-3">Horizontal Density</span>
                    <div class="col-md-12 input_btn_wrap mt-3">
                    <button type="button" class="btn"> - </button>
                      <input
                        type="text"
                        class="form-control"
                        value=""
                      />
                       <button type="button" class="btn"> + </button>
                    </div>
                    <span class="heading mt-3">Vertical Density</span>
                    <div class="col-md-12 input_btn_wrap mt-3">
                    <button type="button" class="btn"> - </button>
                      <input
                        type="text"
                        class="form-control"
                        value=""
                      />
                       <button type="button" class="btn"> + </button>
                    </div>
                  </div>
                  <div class="row aspect_ratio">
                  <div class="col-md-12">
                  <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                  <label class="form-check-label" for="flexCheckDefault">
                  Aspect Ratio
                  </label>
                  </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary setdpi_btn"
              data-bs-dismiss="modal"
            >
              Save DPI Setting
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!--- getzner info popup -->
    <div class="modal fade" id="layout_info_popup" tabindex="-1" aria-labelledby="layout_info_popup" aria-hidden="true">
  <div class="modal-dialog modal-fullscreen">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Information</h5>
       <button type="button" class="btn layout_info_close" data-bs-dismiss="modal" aria-label="Close">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"></path>
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <div class="container-fluid">
        <div class="row gx-0" id="getznerInfo">
        </div>
      </div>
      </div>
    </div>
  </div>
</div>

<!--- getzner download popup -->

<!-- Modal -->
<div class="modal fade" id="download_popup" tabindex="-1" aria-labelledby="download_popup" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title" id="download_popup">Download Image</h1>
        <button type="button" class="btn d_popup_close" data-bs-dismiss="modal" aria-label="Close">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"></path>
          </svg>
        </button>
      </div>
      <div class="modal-body">  
      <div class="list_wrap">
        <label for="downloadWH" class="form-label">Image Size</label>
       <select class="form-select" aria-label="Default select example" id="downloadWH">
       </select>
</div>
 <div class="list_wrap img_type">
       <input type="checkbox" class="form-check-input" id="no_bg" value = "true" checked> 
       <label for="no_bg" class="form-label">Background Image</label>
       <select id="imgFormat" class="form-select" aria-label="Default select example">
       <option value="jpeg" selected>JPEG</option>
       <option value ="png">PNG</option>
       <option value ="webp">WEBP</option>
       </select>
</div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-dark d_btn" data-bs-dismiss="modal" id="getznerPopupDownload"> Download </button>
      </div>
    </div>
  </div>
</div>

<!--credits popup-->
<div class="creditpopup-overlay" id="creditsPopup">
    <div class="countpopup">
      <button class="close-btn">×</button>
      <h2>Credit Usage</h2>
      <table class="credits-table">
        <tr>
          <td><strong>Fabric Credits Used</strong></td>
          <td class="fabric-used">--</td>
        </tr>
        <tr>
          <td><strong>Fabric Credits Balance</strong></td>
          <td class="fabric-balance">--</td>
        </tr>
        <tr>
          <td><strong>Download Credits Used</strong></td>
          <td class="download-used">--</td>
        </tr>
        <tr>
          <td><strong>Download Credits Balance</strong></td>
          <td class="download-balance">--</td>
        </tr>
      </table>
    </div>
  </div>

    `;
}

export function loadTryonUi() {
  return `<!--tryon page-->
<div class="tryon_page container-fluid p-0">
  <div class="tryon_video" id="tryon_video">
  <div class="tryon-page-container">
    <header class="tryon_header">
      <div class="left_box">
        <button type="button" class="btn btn-dark t_back_btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-arrow-left"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
            />
          </svg>
        </button>
        <button type="button" class="btn t_cam" id="tryOnImageCapture">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-camera-fill"
            viewBox="0 0 16 16"
          >
            <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
            <path
              d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0"
            />
          </svg>
        </button>
        <button type="button" class="btn btn-dark t_reset" id='tryOnResetBtn'>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-arrow-clockwise"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"
            />
            <path
              d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"
            />
          </svg>
        </button>
      </div>
      <div class="middle_box">
        <a href="#">
          <img
            loading="lazy"
            src="https://s3.ap-south-1.amazonaws.com/aws.tds/tds_textronics/Org_Img/organisation/2601748836.jpg"
            alt="Q3d tryon logo"
          />
        </a>
      </div>
      <div class="right_box active">
        <!-- search box-->
        <div class="tryon_search_box">
          <input type="text" name="tryon_search" placeholder="Search..." />
          <div class="icon_warp">
            <div class="clear_icon" id="TryonClearIcon">
              <img
                loading="lazy"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABBUlEQVR4nO3ZTQqDMBAF4HeKPOkV2+MWbE9jKXUhRcQk8xeZt3Il8xFNZgiQyWQyV8odwORdBH41fGtpygPAAmB2xkxrDctaU3UKgOf6gjeAG+zDTQ2vnho8MZRCeGIojfDAUAthiaE2wgJjhtDEmCM0MG4ISYw7QgITBtGDCYdowYRF1GDCI85ghkEcYYZD7M0Q899zhEGteWWGW4lttp+T53DWlUt8Wtz5sSOMzVU52p2GwfDEFhsew4pzIiyGDYddOAw7TuwwGAq0He4YCvZObhgqNIDmGCp2sWYYi1a8aGMs54mihfEYioo0xnOyK1KYCONpkcBc5urtMpehmUwmg3D5AAklyc9YEtl/AAAAAElFTkSuQmCC"
                alt="clear_icon_image"
              />
            </div>
            <div class="search_icon" id="TryOnSearch">
              <img
                loading="lazy"
                src="https://s3.ap-south-1.amazonaws.com/aws.tds/dam/q3d/tryon_img/search2.png"
                alt="search_icon_image"
              />
            </div>
          </div>
        </div>
        <button type="button" class="btn t_share btn-dark" id="tryOnShareBtn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-share-fill"
            viewBox="0 0 16 16"
          >
            <path
              d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5"
            />
          </svg>
        </button>
        <button type="button" class="btn t_search btn-dark" id="searchIconBtn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-search"
            viewBox="0 0 16 16"
          >
            <path
              d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"
            />
          </svg>
        </button>
        <div class="dropdown">
          <button
            class="btn t_profile btn-dark dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-person-fill"
              viewBox="0 0 16 16"
            >
              <path
                d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"
              />
            </svg>
          </button>
          <ul class="dropdown-menu" id='myFavBtn'>
            <li><a class="dropdown-item" href="#">My Favourites </a></li>
          </ul>
        </div>
      </div>
    </header>
    <!-- ("t_bottom, t_fullset" adjust the tryon thumbnails) -->
    <div class="tryon_body">
      <!-- tryon model -->
      <div class="t_model_box containerDiv" id="containerDiv">
      <!--  <img class="t_model" alt="tryon modal" src="" /> -->
      <!--  tryon loader -->
       <div class="loader-container" id="New_loader_css1">
        <div class="loader-circle"></div>
        <div class="loader-image"><img src="https://s3.ap-south-1.amazonaws.com/aws.tds/dam/q3d/images/spinner_img.png" ></div>
        <div class="waiting"></div>
        </div> 
      </div>
      <!-- style right panel -->
      <div class="t_style_panel">
        <!-- <div class="t_style_box">
          <div class="t_style_img">
            <img
              src="https://s3.ap-south-1.amazonaws.com/aws.tds/tds_textronics/threedimages/Full_Shirt_Try/Full_Shirt_Tryt.jpg"
              alt="tryon style img"
              loading="lazy"
            />
            <div class="marked">
              <img
                src="https://s3.ap-south-1.amazonaws.com/aws.tds/dam/q3d/images/selected.svg"
                alt="marked image"
                loading="lazy"
              />
            </div>
          </div>
          <div class="t_style_name">shirt 1</div>
        </div> -->
      </div>
      <!-- cam photo captured gif -->
      <div
        class="time_gif"
        style="
          z-index: 99;
          position: absolute;
          top: 0;
          display: none;
          height: 1920px;
          width: 1083px;
        "
      >
        <img src="" />
      </div>

      <!-- favourite button -->
      <div class="next_bt zoombt imageFull" style="display: flex;" id="switchbt" data-toggle="tooltip" title="ZOOM">
      <img src="https://m2mtailor.s3.ap-south-1.amazonaws.com/tailori/plugin/images/maximize_q3d.svg">
      </div>
      <div class="add_fav" id = "addFavBtn">
        <img
          loading="lazy"
          class="heart"
          src="https://s3.ap-south-1.amazonaws.com/aws.tds/dam/images/heart.svg"
          alt="favourite icon"
        />
        <img
          loading="lazy"
          class="h_selected"
          src="https://s3.ap-south-1.amazonaws.com/aws.tds/dam/images/heart-selected.svg"
          alt="favourite icon"
        />
      </div>

      <!-- tryon  zoom img -->
      <div
        class="fabric_zoom"
      >
        <div class="zoom_icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-zoom-in"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11M13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0"
            />
            <path
              d="M10.344 11.742q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1 6.5 6.5 0 0 1-1.398 1.4z"
            />
            <path
              fill-rule="evenodd"
              d="M6.5 3a.5.5 0 0 1 .5.5V6h2.5a.5.5 0 0 1 0 1H7v2.5a.5.5 0 0 1-1 0V7H3.5a.5.5 0 0 1 0-1H6V3.5a.5.5 0 0 1 .5-.5"
            />
          </svg>
        </div>
        <div class="t_fabric_img">
          <img loading="lazy" src="" alt="zoom icon" />
        </div>
        <div class="instruction">Press F10 to zoom</div>
      </div>
      <!-- swipe hand to change garment -->
      <div class="change_garment">
        <img
          src="https://s3.ap-south-1.amazonaws.com/aws.tds/dam/q3d/tryon_img/swipe2.gif"
          loading="lazy"
        />
      </div>
    </div>
    <footer class="tryon_footer">
      <div class="tryon_name">
        <div class="tryon_fabric_name">
          <p>Fabric Name: <span class="t_fab_name"> abac</span></p>
        </div>
        <div class="tryon_style_name">
          <p>Style Name: <span class="tfoot_style_name"> shirt </span></p>
        </div>
      </div>
      <div class="tryon_logo">
        <img
          src="https://s3.ap-south-1.amazonaws.com/aws.tds/dam/q3d/images/tryon.png"
          loading="lazy"
        />
      </div>
    </footer>
  </div>
</div>

<! -----  wishlist sharepdf -->
 <iframe id="temp111" width="1064" height="1790" style="display:none;"></iframe>

<!-- tryon My Favourites modal popup -->
<div
  class="modal fade"
  id="my_favourite"
  tabindex="-1"
  aria-labelledby="exampleModalLabel"
  aria-hidden="true"
  data-bs-backdrop="static" 
  data-bs-keyboard="false"
>
  <div class="modal-dialog modal-fullscreen">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">My Favourites</h5>
        <button
          type="button"
          class="btn"
          data-bs-dismiss="modal"
          aria-label="Close"
          id="myFavPopupCloseBtn"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-x-lg"
            viewBox="0 0 16 16"
          >
            <path
              d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"
            ></path>
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <div class="action_container">
          <div class="selection_msg">
            <div class="form-check" id='allCheckBoxSelectWishList'>
              <input class="form-check-input" type="checkbox" value="" />
            </div>
            <h5 class="msg"></h5>
          </div>
          <div class="group_button">
            <button type="button" class="btn" id="removeWishlistBtn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-trash"
                viewBox="0 0 16 16"
              >
                <path
                  d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"
                />
                <path
                  d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"
                /></svg
              >Remove
            </button>
            <button type="button" class="btn" id="share_fav_btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-share-fill"
                viewBox="0 0 16 16"
              >
                <path
                  d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5"
                />
              </svg>
              Share Wishlist
            </button>
          </div>
        </div>
        <div class="fav_product" id="myFevList">
        </div>
      </div>
    </div>
  </div>
</div>

<!-- tryon Qr modal popup -->

<div class="modal fade" id="QR_popup" tabindex="-1" aria-labelledby="#QR_popupLabel" aria-hidden="true">
  <div class="modal-dialog  modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-body">
      <button type="button" class="btn btn-secondary qr_close">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"></path>
          </svg>
        </button>
       <div class="qr_details">
       <div class="qr_img">
       <div class="qr_loader">
       <img loading="lazy" src="" alt="">
       </div>
       </div>
       <div class="qr_text">
       <h1> SCAN QR</h1>
       <p>to have your photos</p>
       </div>
       </div> 
      </div>
    <!--  <div class="modal-footer">
        <button type="button" class="btn btn-secondary" id="TryOnQrDoneBtn"> Done! </button>
      </div> -->
    </div>
  </div>
</div>

<!-- tryon zoom fabric popup -->
<div
  class="modal fade"
  id="zoom_fabric"
  tabindex="-1"
  aria-labelledby="exampleModalLabel"
  aria-hidden="true"
>
  <div class="modal-dialog modal-fullscreen">
    <div class="modal-content">
      <div class="modal-header">
        <div class="header_warp">
          <img
            loading="lazy"
            src="https://s3.ap-south-1.amazonaws.com/aws.tds/dam/q3d/images/client.png"
            alt="brand logo image"
          />
        </div>
        <button
          type="button"
          class="btn"
          data-bs-dismiss="modal"
          aria-label="Close"
          id="tryOnFullScreenBtn"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-x-lg"
            viewBox="0 0 16 16"
          >
            <path
              d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"
            ></path>
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <img loading="lazy" id="fullImageView" alt="tryon fabric image" src="" />
      </div>
    </div>
  </div>
  </div>

  <!-- Notification message -->
<div class="alert t_notification alert-light" role="alert">
 Successfully Added in Favourite
</div>

</div>`;
}
// 
// 
