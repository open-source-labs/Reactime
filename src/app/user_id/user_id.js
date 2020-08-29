const crypto = require("crypto");
const cookieParser = require("cookie-parser");


class MPID{
  constructor(cookies){
    this.cookies = cookies;
    this.user = null;
    this.hasCookie = false; 
  }

  getCookie(){
      //if they have a cookie use it as mixpanel id. 
      //use this id      
      this.user = cookieParser.JSONCookie(this.user);
  }

  setCookie(){
    //create a string of random data    
    this.user = crypto.randomBytes(128).toString('hex');
    //if hasCookie is false create a cookie.
    document.cookie = this.user;    
  }
  
}

//example:
// 1. User opens app. 
    //let user = new MPID(document.cookie);
    //if usercookie exists
// 2. document.cookie to check if any cookies are available. 
// 3. pass to getCookie
// 4. if we id a cookie as ours.
// 5. use that for mixpanel tracking. 