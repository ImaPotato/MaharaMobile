angular.module('Mahara').factory('MimeGenerator', function() {
  return {
    generateForm: function(data, uuid) {
      var form = "";

      $.each(data, function(index, value) {
        form += uuid + "\n" + value.contentdisposition + "\n" +
          value.contenttype + "\n" + value.contenttransfer + "\n\n" +
          value.value + "\n";
      })

      form += uuid + "--"

      return form;
    }
  };
});
