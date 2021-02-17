
$(document).ready(function() {

    $('.loading-box').css('width', $(window).width());
    $('.loading-box').css('height', $(window).height());

    //showSpinner();
    
    $.getJSON('https://api.ipify.org?format=jsonp&callback=?', function(data) {
        console.log(JSON.stringify(data, null, 2));
        $('#ip').val(data.ip);        

        hiddenSpinner();
    });

    $.getJSON('http://gd.geobytes.com/GetCityDetails?callback=?', function(data) {
        //var data = JSON.stringify(data, null, 2);        
        $('#ip').val(data.geobytesipaddress);   

        hiddenSpinner();
    });

    websocket = new WebSocket(WS_URL);

    // data display from websocket
    websocket.onmessage = function (evt) {
        onMessage(evt)
    };

    websocket.onclose = function (evt) {
        console.log('socket-connection-close');
    };

    websocket.onerror = function (evt) {
        console.log('socket-connection-error');
    };
    websocket.onopen = function (evt) {
        console.log('socket-connection-open');
        setInterval(function () {
            websocket.send(JSON.stringify({ 'msg': 'maintain', 'poster': $('#usernameInput').val() }));
        }, 100000);
    };


    function onMessage(evt) {
        var message = JSON.parse(evt.data);
        var msg = message.msg;
        var poster = message.poster;        
    }    
    
    $('#btn-singin').click(function() {
        
        $username = $('#signin-username').val();
        $password = $('#signin-password').val();

        if ($username === "") {
            alert('please input username');
            return;
        }

        if ($password == "") {
            alert('please input password');
            return;
        }

        $.ajax({
            url : base_url + 'Login/login',
            type : 'post',
            data : {
                "username" : $username,
                "password" : $password,
                'IP' : $('#ip').val()
            },
            success : function(res) {
                var data = JSON.parse(res);                

                if (data['status'] == false) {
                    alert(data['message']);
                    logErrorActivity('Login', 0, '', data['message']);
                }
                else {
                    logSuccessActivity('Login', 0, '');
                    document.location.href = base_url + 'Home';
                }
            }
        })
    });
})


function checkEnterkey(e){
    if(e.keyCode == 13){
        $('#btn-singin').trigger('click');
    }
 }

 function showSpinner() {
    $('.loading-box').css('display', 'flex');
}

function hiddenSpinner() {
    $('.loading-box').css('display', 'none');
}

function logSuccessActivity(Activity, ID, Table) {
    $.ajax({
        url : base_url + 'Activity/addActivity',
        type : 'post',
        data : {
            Activity : Activity,
            ObjectiveTable : Table,
            ObjectiveID : ID,
            Webpage : 'Login',
            Status : 'Success',
            Error : ''
        },
        success : function () {
            websocket.send(JSON.stringify({ 'msg': 'activity', 'poster': $('#usernameInput').val() }));
        }
    });
}

function logErrorActivity(Activity, ID, Table, ErrorMsg) {
    $.ajax({
        url : base_url + 'Activity/addActivity',
        type : 'post',
        data : {
            Activity : Activity,
            ObjectiveTable : Table,
            ObjectiveID : ID,
            Webpage : 'Login',
            Status : 'Error',
            Error : ErrorMsg
        },
        success : function() {
            websocket.send(JSON.stringify({ 'msg': 'activity', 'poster': $('#usernameInput').val() }));
        }
    });
}

