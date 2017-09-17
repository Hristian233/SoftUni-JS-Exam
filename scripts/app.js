$(() => {

    (() => {
        $('#content').find('a[data-target]').click(navigateTo);
        $('#registerForm').submit(registerUser);
        $('#loginForm').submit(loginUser);
        $('#profile').find('a').click(logoutUser);
    })()

    function navigateTo() {
        let viewName = $(this).attr('data-target');
        showView(viewName);
    }

    function showView(viewName) {
        $('main > section').hide();
        $('#view' + viewName).show();
    }

    if(sessionStorage.getItem('authtoken') === null){
        userLoggedOut();
    } else {
        userLoggedIn();
    }

    function userLoggedOut() {
        $('.anonymous').hide();
    }

    function userLoggedIn() {
        $('#profile').find('span').text(sessionStorage.getItem('username'));
        $('#viewWelcome').hide();
    }


    // REGISTER USER
    function registerUser(ev) {
        ev.preventDefault();
        let registerUsername = $('#registerUsername');
        let password1 = $('#password1');
        let password2 = $('#password2');

        let usernameVal = registerUsername.val();
        let pass1 = password1.val();
        let pass2 = password2.val();

        if(pass1.length < 6){
            alert('Password too short!');
            return;
        }
        else if(pass1 !== pass2){
            alert('Passwords don\'t match!');
            return;
        }
        else if(usernameVal.length < 3){
            alert('Username too short');
            return;
        }
        else if(usernameVal.match(/[0-9]+$/gi)){
            alert('Username can not contain numbers or symbols');
            return;
        }


        auth.register(usernameVal, pass1)
            .then((userInfo) => {
                saveSession(userInfo);
                registerUsername.val("");
                password1.val("");
                showInfo('User registration successful.');
                sessionStorage.clear();
                window.location.reload();
            }).catch(handleError);
    }
    // LOGIN USER
    function loginUser(ev) {
        ev.preventDefault();
        let inputUsername = $('#loginUsername');
        let inputPassword = $('#loginPasswd');

        let usernameVal = inputUsername.val();
        let passwdVal = inputPassword.val();

        console.log(usernameVal);
        console.log(passwdVal);

        auth.login(usernameVal, passwdVal)
            .then((userInfo) => {
                saveSession(userInfo);
                inputUsername.val('');
                inputPassword.val('');
                showInfo('Login successful.');
                window.location.reload();
            }).catch(handleError);
    }

    // LOGOUT USER
    function logoutUser() {
        auth.logout()
            .then(() => {
                sessionStorage.clear();
                showInfo('Logout successful.');
                userLoggedOut();
                window.location.reload();
            }).catch(handleError);
    }

    function saveSession(userInfo) {
        let userAuth = userInfo._kmd.authtoken;
        sessionStorage.setItem('authtoken', userAuth);
        let userId = userInfo._id;
        sessionStorage.setItem('userId', userId);
        let username = userInfo.username;
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('name', userInfo['name']);
        userLoggedIn();
    }

    function handleError(reason) {
        showError(reason.responseJSON.description);
    }

    function showInfo(message) {
        let infoBox = $('#infoBox');
        infoBox.text(message);
        infoBox.show();
        setTimeout(() => infoBox.fadeOut(), 3000);
    }

    function showError(message) {
        let errorBox = $('#errorBox');
        errorBox.text(message);
        errorBox.show();
        setTimeout(() => errorBox.fadeOut(), 3000);
    }

    function formatDate(dateISO8601) {
        let date = new Date(dateISO8601);
        if (Number.isNaN(date.getDate()))
            return '';
        return date.getDate() + '.' + padZeros(date.getMonth() + 1) +
            "." + date.getFullYear() + ' ' + date.getHours() + ':' +
            padZeros(date.getMinutes()) + ':' + padZeros(date.getSeconds());

        function padZeros(num) {
            return ('0' + num).slice(-2);
        }
    }

    function formatSender(name, username) {
        if (!name)
            return username;
        else
            return username + ' (' + name + ')';
    }


    // Handle notifications
    $(document).on({
        ajaxStart: () => $("#loadingBox").show(),
        ajaxStop: () => $('#loadingBox').fadeOut()
    });
})