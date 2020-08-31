const crypto = require("crypto");
const cookie = require("cookie");

class MPID{
  constructor(){
    this.cookie = null;    
    this.distinct_id = null;
    this.hasCookie = false;    
  }

  setCookie(doc){
    console.log(" Set Cookie ");
    //create a string of random data    
    this.cookie = cookie.serialize("reactime", crypto.randomBytes(64).toString('hex') );
    doc.cookie = this.cookie;
    console.log(" Check if Cookie set ", doc.cookie);
    return this.cookie;
  }

  getCookie(){
    console.log(" get Cookie");    
    return this.cookie;
  }

  checkDocumentCookie(doc){
    console.log(" Check Document Cookie ", cookie.parse( doc.cookie ));
    if( doc.cookie ){
      console.log( "doc cookie parsed: ", cookie.parse(doc.cookie)?.reactime );
      let a = cookie.parse(doc.cookie)?.reactime;
      if(a){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  }

  get_dId(){
    return this.cookie ? this.cookie.slice(0, 20) : null;
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