function sync($q, UuidGenerator) {

  this.send = function(settings) {

    var q = $q.defer();
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
        q.resolve(parse(xhr.responseText, settings));
      }
    }

    var data = [];
    data.push(getFormPart('username', settings.connection.username));
    data.push(getFormPart('token', settings.connection.token));
    var notifications = [];
    if (settings != null) {
      if (settings.notification.user) notifications.push('usermessages');
      if (settings.notification.feedback) notifications.push('feedback');
      if (settings.notification.posts) notifications.push('newpost');
      if (settings.notification.mahara) notifications.push('maharamessage');
    }
    data.push(getFormPart('notifications', notifications.join(", ")));
    data.push(getFormPart('lastsync', settings.advanced.lastsynctime));
    var bound = UuidGenerator.generate()
    xhr.open("POST", settings.connection.maharauri + settings.connection.syncuri, true);
    xhr.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + bound);
    xhr.send(generateForm(data, '--' + bound));

    return q.promise;
  }

  function parse(response, settings){
    response = JSON.parse(response.substring(1, response.length - 1)); // don't ask...
    if (response.error != null && response.error != '') // cause who needs curly brackets right?!
      return false;
    else if (response.fail != null && response.fail != '')
      return false;
    else {
      settings.connection.token = response.success;
      if(response.sync != null){
        if(response.sync.blogposts != null)
          settings.blogposts = response.sync.blogposts;
        if(response.sync.blogs != null)
          settings.blogs = response.sync.blogs;
        if(response.sync.folders != null)
          settings.folders = response.sync.folders;
        if(response.sync.tags != null){
          settings.tags = response.sync.tags;
        }
        if(response.sync.time != null)
          settings.advanced.lastsynctime = response.sync.time;
      }

      return true;
    }
  }

  function getFormPart(name, value) {
    return {
      contentdisposition: 'Content-Disposition: form-data; charset=UTF-8; name="' + name + '"',
      contenttype: "Content-Type: text/plain; charset=UTF-8",
      contenttransfer: "Content-Transfer-Encoding: 8bit",
      value: value
    }
  }

  function generateForm(data, uuid) {
    var form = "";
    $.each(data, function(index, value) {
      form += uuid + "\n" + value.contentdisposition + "\n" +
        value.contenttype + "\n" + value.contenttransfer + "\n\n" +
        value.value + "\n";
    })
    return form += uuid + "--"
  }

}
