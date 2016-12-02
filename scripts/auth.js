/**
 * Created by Soldier on 12/2/2016.
 */
const kinveyBaseUrl = "https://baas.kinvey.com/";
const kinveyAppSecret =
    "9aaf3e7a620c4606874886e97c1795a6";
const kinveyAppAuthHeaders = {
    'Authorization': "Basic " +
    btoa(kinveyAppKey + ":" + kinveyAppSecret)
};

Kinvey.init({
    appKey: kinveyAppKey,
    appSecret: kinveyAppSecret
});
//Logging out of kinvey because last user login remains in cache
Kinvey.User.logout();

function saveAuthInSession(userInfo) {
    let userAuth = userInfo._kmd.authtoken;
    sessionStorage.setItem('authToken', userAuth);
    let userId = userInfo._id;
    sessionStorage.setItem('userId', userId);
    let username = userInfo.username;
}

function getKinveyUserAuthHeaders() {
    return {
        'Authorization': "Kinvey " +
        sessionStorage.getItem('authToken')
    };
}
//user/logout
function logout() {
    sessionStorage.clear();
    Kinvey.User.logout();
    showHideMenuLinks();
    showView('viewLogin');
    $('#formLogin').trigger('reset');
    showInfo("Logout successful.");
}
//user/login
function loginUser(event) {
    event.preventDefault();
    let username = $('#formLogin input[name=username]').val();
    let password = $('#formLogin input[name=passwd]').val();
    if(username.length < 5){
        showError("Username must consist of atleast 5 characters.");
        return;
    }

    if(password.length < 5){
        showError("Password must consist of atleast 5 characters.");
        return;
    }


    var promise = Kinvey.User.login(username, password).then(loginSuccess).catch(handleAjaxError);

    function loginSuccess(userInfo) {
        saveAuthInSession(userInfo);
        showHideMenuLinks();
        listBooks();
        showInfo('Login successful.')
    }
}
//user/register
function registerUser(event) {
    event.preventDefault();
    let username = $('#formRegister input[name=username]').val();
    let password = $('#formRegister input[name=passwd]').val();
    if(username.length < 5){
        showError("Username must consist of atleast 5 characters.");
        return;
    }

    if(password.length < 5){
        showError("Password must consist of atleast 5 characters.");
        return;
    }
    let userData = {
        username: username,
        password: password
    };

    $.ajax({
        method: "POST",
        url: kinveyBaseUrl + "user/" + kinveyAppKey + "/",
        headers: kinveyAppAuthHeaders,
        data: JSON.stringify(userData),
        contentType: "application/json",
        success: registerSuccess,
        error: handleAjaxError
    });

    function registerSuccess(userInfo) {
        saveAuthInSession(userInfo);
        showHideMenuLinks();
        listBooks();
        showInfo('User registration successful.')
    }
}