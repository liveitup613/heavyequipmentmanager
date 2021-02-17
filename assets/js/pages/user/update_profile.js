
$('#passwordConfirmBtn').click(function() {
    $.ajax({
        url : base_url + 'User/ConfirmPassword',
        type : 'post',
        data : {
            Password: $("#oldPassword").val(),
        },
        success: function(res) {
            var data = JSON.parse(res);

            if (data.success == false) {
                toastr.error(LocalizationMessage('Password is Incorrect'));
                return;
            }

            var  UserData = data.data;

            $('#editImgProfile').attr('src', base_url + "assets/images/avatar/"+ (UserData['PROFILEPICTURE'] == "" ? "default.png" : UserData['PROFILEPICTURE']));
            $('#inputEmail').val(UserData.EMAIL);
            $('#inputPhone').val(UserData.PHONE);
            $('#inputName').val(UserData.NAME);
            $('#inputLastname').val(UserData.LASTNAME);
            $('#newPassword').val('');
            $('#confirm-password').val('');

            $('.old-pass-panel').hide();
            $('.update-profile-panel').show();
        }
    })
});

$('#editImgProfile').click(function() {
    $('#inputEditImgProfile').click();
});

$('#inputEditImgProfile').change(function () {
    readURL(this, $('#editImgProfile'));
});

function readURL(input, avatar) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();

		reader.onload = function (e) {
			$(avatar)
				.attr('src', e.target.result);
		};

		reader.readAsDataURL(input.files[0]);
	}
}

$('#btnUpdate').click(function() {    
    updateProfile();    
});

function updateProfile() {
    var selectedID = $('#inputEditID').val();
    $.ajax({
        url: base_url + "User/UpdateUser",
        method: "POST",
        data: new FormData(document.getElementById('upload-edit-form')),
        contentType: false,
        cache: false,
        processData: false,
        dataType: "json",
        success: function (data) {            
            if (data.success == true) {          
                var UserData = data.data;
                console.log('change image');
                $('.user-photo').attr('src', base_url + "assets/images/avatar/"+ (UserData['PROFILEPICTURE'] == "" ? "default.png" : UserData['PROFILEPICTURE']));
                $('.user-name').html('<strong>' + UserData['NAME'] + ' ' + UserData['LASTNAME'] + '</strong>');
                updatePassword();
            }
            else {
                toastr.success(LocalizationMessage('Edit User') + ' Error');
                logErrorActivity('Edit User', selectedID, 'tblUser', res.message);
                
            }
        }
    });
}

function updatePassword() {
    var newPassword = $('#newPassword').val();
    var confirmPassword = $('#confirm-password').val();
    var selectedID = $('#inputEditID').val();

    if (newPassword != confirmPassword) {
        toastr.warning(LocalizationMessage("Passwords don't match"));
        return;
    }
    
    if (newPassword != '') {
        if (CheckPassword(newPassword) == false) {
            toastr.warning(LocalizationMessage('Password should have at least one Upper Case letter and one number.'));
            return;
        }
    }
    else   
    {
        toastr.success(LocalizationMessage('Edit User'));
        logSuccessActivity('Edit User', selectedID, 'tblUser'); 
        location.reload();     
        return;
    }

    $.ajax({
        url: base_url + 'User/updatePassword',
        type: 'post',
        data: {
            'oldPassword': $('#oldPassword').val(),
            'newPassword': $('#newPassword').val()
        },
        success: function(res) {
            var data = JSON.parse(res);

            if (data.success == false) {
                toastr.error(LocalizationMessage('Password is Incorrect'));                
                logErrorActivity('Edit User', selectedID, 'tblUser', res.message);
            }
            else {
                toastr.success(LocalizationMessage('Edit User'));
                logSuccessActivity('Edit User', selectedID, 'tblUser');      
            }
            
            location.reload();
        }
    })
}

function CheckPassword(inputtxt) 
{ 
    var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
    if(inputtxt.match(passw)) 
    {     
        return true;
    }
    else
    {     
        return false;
    }
}


function logSuccessActivity(Activity, ID, Table) {
    $.ajax({
        url : base_url + 'Activity/addActivity',
        type : 'post',
        data : {
            Activity : Activity,
            ObjectiveTable : Table,
            ObjectiveID : ID,
            Webpage : 'Users.UpdateProfile',
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
            Webpage : 'Users.UpdateProfile',
            Status : 'Error',
            Error : ErrorMsg
        },
        success : function() {
            websocket.send(JSON.stringify({ 'msg': 'activity', 'poster': $('#usernameInput').val() }));
        }
    });
}