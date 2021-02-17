 
var alert_timer = 0;
var logout_timer = 0;

var alert_time = 50 + 60 * 1000 * 25; // 10 min
var logout_time = 60 * 1000 * 30; // 15 min

function set_interval() {
  console.log('set interval');

  alert_timer = setInterval(confirm_logout, alert_time); 

  logout_timer = setInterval(auto_logout, logout_time); 
}

function reset_interval() {
  console.log('reset_interval');

  if (alert_timer != 0) {
    clearInterval(alert_timer);
    clearInterval(logout_timer);

    alert_timer = 0;
    logout_timer = 0;
    // second step: implement the timer again
    alert_timer = setInterval(confirm_logout, alert_time);
    logout_timer = setInterval(auto_logout, logout_time);
    // completed the reset of the timer
  }
}

function confirm_logout() {
  var modal = document.createElement('div');
  modal.innerHTML = '<div class="modal fade " id="sessionExpireModal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">' + 
                      '<div class="modal-dialog" style="width: 850px;">' + 
                        '<div class="modal-content">' + 
                          '<div class="modal-header">' +
                            '<h5 class="modal-title h4" id="myLargeModalLabel">Alert</h5>' +                              
                            '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
                            '<span aria-hidden="true">×</span>' +
                            '</button>' +
                          '</div>' +
                          '<div class="modal-body">' +
                            '<div style="font-size: 15px; color: white; padding-left: 30px;">' +
                              'Remain Logged in?' +
                            '</div>' +
                          '</div>' +
                          '<div class="modal-footer">' +
                            '<button type="button" class="btn btn-round btn-default" data-dismiss="modal" onclick="ExpireOK()">No</button>' +
                            '<button type="button" class="btn btn-round btn-primary" data-dismiss="modal">Yes</button>' +
                          '</div>' +
                        '</div>' +
                      '</div>' +
                    '</div>';

  document.body.appendChild(modal);
  $('#sessionExpireModal').modal('show');  
}


function ExpireOK() {
  console.log('Expire button clicked');
  window.location = base_url + 'Login/log_out';
}

function ExpireCancel() {
  reset_interval();
}

function auto_logout() {
  // this function will redirect the user to the logout script
  window.location = base_url + 'Login/log_out';
}

window.onload = function() {
    set_interval();
}

window.onclick = function() {
  reset_interval();
}

window.onkeypress = function() {
  reset_interval();
}
