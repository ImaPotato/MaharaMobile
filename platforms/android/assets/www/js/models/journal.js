function journal($q, UuidGenerator){
  this.uuid  = UuidGenerator.generate();
  this.type  = 'journal';
  this.title = '';
  this.tags  = [];
  this.desc  = '';
  this.draft = false;
  this.comments = true;

  this.init = function(item){
    this.uuid  = item.uuid;
    this.type  = item.type;
    this.title = item.title;
    this.tags  = item.tags
    this.desc  = item.desc;
    this.draft = false;
    this.comments = true;
    return this;
  }

  this.send = function(settings) {

    var q = $q.defer();

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
        q.resolve(xhr.responseText);
      }
    }

    var data = [];
    data.push(getFormPart('allowcomments', this.comments));
    data.push(getFormPart('blog', 3)); //please remember to change this...
    data.push(getFormPart('description', this.desc));
    data.push(getFormPart('draft', this.comments));
    data.push(getFormPart('allowcomments', this.draft));
    data.push(getFormPart('foldername', '')); //and this...
    data.push(getFormPart('tags', this.tags.join(", ")));
    data.push(getFormPart('title', this.title));
    data.push(getFormPart('username', settings.connection.username));
    data.push(getFormPart('token', settings.connection.token));
    data.push(getFormPart('tags', this.tags));
    data.push(getFormPart('tags', this.tags));
    var bound = UuidGenerator.generate()
    xhr.open("POST", settings.connection.maharauri + settings.connection.uploaduri, true);
    xhr.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + bound);
    xhr.send(generateForm(data, '--' + bound));

    return q.promise;

  }

  function getFormPart(name, value){
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
