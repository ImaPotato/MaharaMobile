angular.module('Mahara').factory('UserService', function() {

  return {

    getUser: function(){
      var user = JSON.parse(localStorage.getItem('user'));
      var u = {};
      if (user != null && user != '') {
        u.login = {
          username: user.login.username,
          token: user.login.token,
          url: user.login.url
        };
      }
      return u;
    },
    saveUser: function(login){

      // cool, we can now update the users login settings
      var user = {
        'login': {
          'username': login.username,
          'token': login.token.toLowerCase(),
          'url': login.url.toLowerCase()
        }
      };

      // store everything
      localStorage.setItem('user', JSON.stringify(user));

    },
    removeUser: function(){

    },
    resetUser: function(){

    }

  }

});
