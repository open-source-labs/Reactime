const crypto = require("crypto");
const cookie = require("cookie");

class MPID{
  constructor(){
    this.cookie = null;
    this.hasCookie = false;    
  }

  setCookie(){
    console.log(" Set Cookie ");
    //create a string of random data    
    this.cookie = crypto.randomBytes(64).toString('hex');
    return this.cookie;
  }

  getCookie(){
    console.log(" get Cookie");    
    return this.cookie;
  }
}


export default MPID;

//example:
// 1. User opens app. 
    //let user = new MPID(document.cookie);
    //if usercookie exists
// 2. document.cookie to check if any cookies are available. 
// 3. pass to getCookie
// 4. if we id a cookie as ours.
// 5. use that for mixpanel tracking. 