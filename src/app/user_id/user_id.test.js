const crypto = require("crypto");
const cookie = require("cookie");
import MPID from "../user_id/user_id";

describe("Test new user class constructor", () => {
  let user = new MPID();

  it("user obj should be instance of MPID", () => {
    expect(user).toBeInstanceOf(MPID);
  })

  xit("new user cookie should be set", () => {
    
  })

  it("checkDocumentCookie should return a boolean", () => {
    expect(user.checkDocumentCookie(document)).not.toBeNull();
  })

});