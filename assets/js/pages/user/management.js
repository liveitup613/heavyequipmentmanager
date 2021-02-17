var selectedID = "";

$(document).ready(function() {
    $('.js-basic-example').DataTable();
   
})

$('#imgProfile').click(function () {
    $('#inputImgProfile').click();
});

$('#inputImgProfile').change(function () {
    readURL(this, $('#imgProfile'));
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

$('#btnAddUser').click(function() {
   

    var photo= $('#inputImgProfile').val();

    var name = $('#name').val();
    var username = $('#username').val();
    var email = $('#email').val();
    var phone = $('#phone').val();
    var lastname = $('#lastname').val();
    var permission = $('#permission').val();

    // if(photo.length ==0){
    //     toastr.error('Please select user photo');
    //     return;
    // }  

    if(username.length ==0){
        toastr.error('Please type in username');
        return;
    }  

    if(email.length == 0){
        toastr.error('Please type in email');
        return;
    }

    if(phone.length == 0){
        toastr.error('Please type in phone number');
        return;
    }
   
    if(name.length ==0){
        toastr.error('Please type in name');
        return;
    }
 

    if(lastname.length == 0){
        toastr.error('Please type in lastname');
        return;
    }


    $.ajax({
		url: base_url + "User/AddUser",
		method: "POST",
		data: new FormData(document.getElementById('upload-form')),
		contentType: false,
		cache: false,
		processData: false,
		dataType: "json",
		success: function (res) {
			if (res.success == true) {
                logSuccessActivity('Add New User', res.id, 'tblUser');
				document.location.reload();
            }
            else {
                logErrorActivity('Add New User', res.id, 'tblUser', res.message);
            }
		}
	});
});

//Update

function editClicked(element) {
    var tr = $(element).parent().parent();
    var ID = $(tr).find('.user-id').html();    
    selectedID = ID;

    $('#inputEditID').val(ID);

    $.ajax({
        url : base_url + 'User/GetUserInfo',
        type : "get",
        data : {
            'ID' : ID
        },
        success : function(res) {
           
            var data = JSON.parse(res);

            if (data['success'] == false) {
                alert(data['message']);
            }
            else {
                var userData = data['user'];

                $('#editImgProfile').attr('src', base_url + "assets/images/avatar/"+ (userData['PROFILEPICTURE'] == "" ? "default.png" : userData['PROFILEPICTURE']));
                $('#inputEmail').val(userData['EMAIL']);
                $('#inputPhone').val(userData['PHONE']);
                $('#inputName').val(userData['NAME']);
                $('#inputLastname').val(userData['LASTNAME']);
                $('#inputPermission').val(userData['PERMISSION']);
                $('#EditUser').modal('show');
            }
        }
    })
}

$('#btnUpdateUser').click(function() {

    $.ajax({
		url: base_url + "User/UpdateUser",
		method: "POST",
		data: new FormData(document.getElementById('upload-edit-form')),
		contentType: false,
		cache: false,
		processData: false,
		dataType: "json",
		success: function (res) {
			if (res.success == true) {
                document.location.reload();
                logSuccessActivity('Edit User', selectedID, 'tblUser');
            }
            else {
                logErrorActivity('Edit User', selectedID, 'tblUser', res.message);
            }
		}
	});
});

$('#passwordSaveBtn').click(function(){
    var oldPassword = $('#oldPassword').val();
    var newPassword = $('#newPassword').val();
    var confirmPassword = $('#confirm-password').val();

    if(oldPassword.length ==0){
        toastr.error('Please fill in empty element!');
        return;
    }

    if(newPassword.length == 0){
        toastr.error('Please fill in empty element!');
        return;
    }

    if(confirmPassword.length == 0){
        toastr.error('Please fill in empty element!');
        return;
    }

    if(newPassword != confirmPassword){
        toastr.error('Please confirm your password again');
        return;
    }

    $.ajax({
        url : base_url + 'User/updatePassword',
        type : 'post',
        data : {            
            'oldPassword' : oldPassword,
            'newPassword' : newPassword
        },
        success : function(res) {
            var data = JSON.parse(res);

            if (data['success'] == 'failed') {
                toastr.error('Edit Password Error');
                logErrorActivity('Edit Password', data['id'], 'tblUser', data['message']);
            }
            else {
                toastr.success('Edit Password');
                logSuccessActivity('Edit Password', data['id'], 'tblUser');
                $('#oldPassword').val('');
                $('#newPassword').val('');
                $('#confirm-password').val('');            
            }
        }
    });
});

//Delete
function deleteClicked(element) {
    var tr = $(element).parent().parent();
    var ID = $(tr).find('.user-id').html();    
    selectedID = ID;

    $('#deleteModal').modal('show');
}

function deleteUser() {
    $.ajax({
        url : base_url + 'User/DeleteUser',
        type : 'post',
        data : {
            'ID' : selectedID
        },
        success : function(res) {
            var data = JSON.parse(res);

            if (data['message'] == 'failed') {
                toastr.error('Delete User Error');
                logErrorActivity('Delete User', selectedID, 'tblUser', 'Invalid User');
            }
            else {
                logSuccessActivity('Delete User', selectedID, 'tblUser');
                document.location.reload();
            }
        }
    })
}

function logSuccessActivity(Activity, ID, Table) {
    $.ajax({
        url : base_url + 'Activity/addActivity',
        type : 'post',
        data : {
            Activity : Activity,
            ObjectiveTable : Table,
            ObjectiveID : ID,
            Webpage : 'Users.Users',
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
            Webpage : 'Users.Users',
            Status : 'Error',
            Error : ErrorMsg
        },
        success : function() {
            websocket.send(JSON.stringify({ 'msg': 'activity', 'poster': $('#usernameInput').val() }));
        }
    });
}