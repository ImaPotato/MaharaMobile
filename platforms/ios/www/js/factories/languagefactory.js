angular.module('Mahara').factory('LanguageService', function(SettingsService) {

  function contructLanguageObject(){

  }

  return {
    getLanguageForPage: function(page) {
        $.getJSON( "language/english.json", function( data ) {

      });
    }
  }
});
