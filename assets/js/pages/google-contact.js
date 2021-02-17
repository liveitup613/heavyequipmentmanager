var clientId = '1083289865636-gi6vfsvmm2r33ga4ofi371v8auttbn1j.apps.googleusercontent.com'; // clientId received from API
var apiKey = 'zwX4kxV5mOLJykicyVO7y9WI'; // client secret key from API
var scopes = 'https://www.google.com/m8/feeds'; // enables read/write access to contacts
var customerID = 0;

   
function checkAuth(ID) {
    gapi.client.setApiKey(apiKey); //sets apiKey for application
    window.stop();

    customerID = ID;

    gapi.auth.authorize({ //authorizes the client using api key fields and calls handleAuthResult method
        client_id: clientId,
        scope: scopes,
        immediate: false
    }, handleAuthResult);
}
    
function handleAuthResult(authResult) {
    window.stop();
    if (authResult && !authResult.error) {
        //if no authorization error, then it will show the login popup
        var access_token = authResult.access_token;
        var xmlBody = '';
        console.log(access_token);
        showSpinner();
        $.ajax({
            url : base_url + 'Customers/createContactBody',
            type : 'post',
            data : {
                ID : customerID
            },
            success : function(response) {
                var xhr = new XMLHttpRequest();
                xmlBody = response;
                xmlBody = xmlBody.replace(/\n/g, '');
                xmlBody = xmlBody.replace(/\r/g, '');
                $.ajax({
                    url : 'https://www.google.com/m8/feeds/contacts/default/full?access_token=' + access_token,
                    type : 'post',
                    contentType : 'application/atom+xml',
                    dataType : 'xml',
                    data : xmlBody,
                    success : function(response) {
                        hiddenSpinner();
                        toastr.success('Add Contact');
                        window.stop();
                    },
                    error : function(error) {
                        hiddenSpinner();
                        toastr.error('Add Contact Error');
                    }
                });
            }
        });
    }
}