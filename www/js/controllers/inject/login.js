var getLoginStatus = function(){
  console.log(config.loggedin);
  return config.loggedin;
};

document.body.innerHTML = document.getElementById('main').innerHTML;

document.getElementById('content').style.marginTop = '10px';
document.getElementById('content').style.marginLeft = '10px';
document.getElementById('content').style.marginRight = '10px';
document.getElementById('content').style.marginBottom = '10px';
