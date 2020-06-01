var UserProfile = (function() {
    var firstName = "";
    var lastName = "";
    var email = "";
    var token = '';
  
    var getfirstName = function() {
      return firstName;    // Or pull this from cookie/localStorage
    };
  
    var setfirstName = function(name) {
      firstName = name;     
      // Also set this in cookie/localStorage
    };
    var getLastName = function() {
        return lastName;    // Or pull this from cookie/localStorage
    };

    var setLastName = function(name) {
        lastName = name;     
    // Also set this in cookie/localStorage
    };
    var getEmail = function() {
        return email;    // Or pull this from cookie/localStorage
    };

    var setEmail = function(emailString) {
        email = emailString;     
    // Also set this in cookie/localStorage
    };
    var getToken = function() {
        return token;    // Or pull this from cookie/localStorage
    };

    var setToken = function(tokenString) {
        token = tokenString;     
    // Also set this in cookie/localStorage
    };
  
    return {
        getfirstName: getfirstName,
        setfirstName: setfirstName,
        getLastName: getLastName,
        setLastName: setLastName,
        getEmail: getEmail,
        setEmail: setEmail,
        getToken: getToken,
        setToken: setToken,
    }
  
  })();
  
  export default UserProfile;