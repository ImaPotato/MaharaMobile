function getLoginStatus(){
  //console.log(config.loggedin);
  var data = {'loggedin': config.loggedin, 'token':''};
  if(data.loggedin == 1){
    data.token = document.body.innerHTML;
  }
  return data;
};

//get rid of all that other pesky content.
if(document.getElementById('main') != null){

document.body.innerHTML = document.getElementById('main').innerHTML;

document.getElementById('content').style.marginTop = '10px';
document.getElementById('content').style.marginLeft = '10px';
document.getElementById('content').style.marginRight = '10px';
document.getElementById('content').style.marginBottom = '10px';

}

$(document).append('<button>hey</button>');
