$(function () {
    $('#btn-login-clear').click(function() {
        $("#email-address").val(e);
        $("#password").val(e);
    });

    $('#btn-login-submit').click(function() {
        var email = $("#email-address").val();
        var password = $("#password").val();
        userRedirectLink = 'index.html';
        showModal('#modal-loading', show);
        if (!email || !password) {
            console.log(requiredMsg);
            hideProgressModal();
            toast(requiredMsg, warning);
            return;
        } else {
            if ($("#input-checker-robot").is(":not(:checked)")) {
                hideProgressModal();
                toast("Please prove you are not a robot.", warning);
                return;
            } else {
                firebase.auth().signInWithEmailAndPassword(email, password).then(function(u) {
                    firebase.auth().onAuthStateChanged((u) => {
                        userEmail = email;
                        toast("Successfully login!", success);
                        if (firebase.auth().currentUser != null) {
                            getUsers();
                        } else {
                            hideProgressModal();
                            toast(userNotFound, error);
                            return;
                        }
                    });
                }).catch(function(e) {
                    hideProgressModal();
                    toast("Invalid Login Credentials!", error);
                });
            }
        }
    });
    // $('#btn-create-account').click(function() {
    //     showModal('#modal-create-user', show);
    //     $('#btn-send-create-account').click(function() {
    //         const lastName = $('#a-last-name').val(),
    //         firstName = $('#a-first-name').val(),
    //         middleName = $('#a-middle-name').val(),
    //         suffix = $('#a-suffix').val(),
    //         address = $('#a-address').val(),
    //         birthday = $('#a-birthday').val(),
    //         age = $('#a-age').val(),
    //         email = $('#a-email').val(),
    //         religion = $('#a-religion').val(),
    //         password = $('#a-password').val(),
    //         confirmPassword = $('#a-confirm-password').val();
    //         var gender = "Male";
    //         if (!lastName || !firstName || !middleName || !suffix || !address || !birthday || !age || !email || !religion || !password || !confirmPassword) {
    //             toast(requiredMsg, warning);
    //         } else {
    //             if ($('#a-gender-f').is(':checked')) {
    //                 gender = "Female";
    //             }
    //             if (password != confirmPassword) {
    //                 toast(invalidPassword, warning);
    //             } else {
    //                 showModal('#modal-data-privacy-consent', show);
    //                 $('#btn-agree-data-consent').click(function() {
    //                     showModal('#modal-data-privacy-consent', hide);
    //                     sha256.update(password);
    //                     insertNewUser(firstName, middleName, lastName, suffix, address, birthday, age, gender, email, password, sha256.getHash("HEX"), regularUser, noImage, religion, 0);
    //                 });
    //             }
    //         }
    //     });
    // });
    // $('#btn-reset-password').click(function() {
    //     showModal('#modal-reset-password', show);
    //     $('#btn-submit-reset-password').click(function() {
    //         const resetPasswordEmail = $('#user-reset-email').val();
    //         firebase.auth().sendPasswordResetEmail(resetPasswordEmail)
    //         .then(function() {
    //             showModal('#modal-reset-password', hide);
    //             toast('Password reset email sent for '+resetPasswordEmail+' Please check your Spam or Inbox folder for the reset password confirmation email link. Thank you!', success);
    //         }).catch(function(error) {
    //             showModal('#modal-reset-password', hide);
    //             toast('Error occurred. Inspect error.code.', error);
    //         });
    //     });
    // });
});

function logoutUser() {
  firebase.auth().signOut();
  clearLocalStorage();
  redirect(loginUrl);
  insertLogs(getUserId, userFullName, getUserEmailAddress, getUserPosition, 
             thumbnail, "User Logout", active, "LOGOUT");
}