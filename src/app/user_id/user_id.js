const crypto = require("crypto");
const cookie = require("cookie");
const mixpanel = require("mixpanel").init("12fa2800ccbf44a5c36c37bc9776e4c0", {
  debug: true,
  protocol: "https"
});
class MPID{
  constructor(){
    this.cookie = null;    
    this.distinct_id = null;
    this.debug = false;    
  }

  setCookie(){
    console.log(" Set Cookie ");
    //create a string of random data        
    this.cookie = cookie.serialize("reactime", crypto.randomBytes(64).toString('hex') );
    this.distinct_id = this.cookie?.reactime?.slice(0, 20);
    
    if(this.cookie){
      return this.cookie;    
    }else{
      throw new Error("Unable to set cookie. Cookie is falsey");
    }

  }

  getCookie(){
    console.log(" get Cookie");
    
    if(this.cookie){   
      return this.cookie;
    }else{
      throw new Error("Cookie truthy, but unreturnable");
    }
  
  }

  checkDocumentCookie(doc){
    console.log(" Check Document Cookie ", cookie.parse( doc.cookie ));
    let parsedCookie = cookie.parse(doc.cookie);
    
    if( parsedCookie?.reactime ){      
      console.log( "reactime cookie found" );
      this.cookie = parsedCookie?.reactime;
      
      if(!this.distinct_id){
        console.log(" set dId");
        this.distinct_id = parsedCookie?.reactime?.slice(0, 20);
      }    
    }else{
      console.log("No reactime cookie found. Attempting setCookie");
      this.setCookie();
      return false;
    }
  }

  get_dId(){
    try{
      if(this.distinct_id ) {        
        return this.distinct_id;
      }
    }catch( e ){
      throw new Error(`unable to set cookie. Reason: ${e}. `);
    }
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