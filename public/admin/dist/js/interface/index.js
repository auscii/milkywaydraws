$(function () {
    createKeys();
    currentDateTime();
    setBackround();
    getCommissions();
    getUsers();
    // insertNewUser("Admin", "admin@admin.com", adminUser, noImage);
    // getTotalAvailable8AM();
    // getTotalAvailable9AM();
    // getTotalAvailable10AM();
    // myAppointments();
    // initChat();
    // fetchUsers();
    fetchLogs();
});

let userReference = db.collection(usersRef + usersDomain + sl + credentialsRef);

function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}

function keyCode(len, charSet) {
    charSet = charSet || 'ABCDFGHIJKLMNOPQRSTUVWXYZ'+'0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
}

function insertNewUser(userFullName, userEmailAddress, password, position, profilePicture) {
    firebase.auth().createUserWithEmailAndPassword(userEmailAddress, password).then(function(d) {
        let userId = d.user.uid;
        db.collection(usersRef).doc(usersDomain).collection(credentialsRef).add({
            user_id: uuidv4(),
            name: userFullName,
            email_address: userEmailAddress,
            password: password,
            position: position,
            profile_picture: profilePicture,
            status: 1,
            created_at: serverDateTime
        }).catch(function (e) {
            toast(e.message, error);
            return;
        });
        toast(successNewUser, success);
        showModal('#modal-create-user', hide);
        emptyInputText(['#a-last-name','#a-first-name','#a-middle-name','#a-suffix','#a-address','#a-birthday','#a-age','#a-gender','#a-email','#a-religion','#a-password','#a-confirm-password']);
      }, function(e) {
        toast(e.message, error);
      });
}

function insertLogs(userId, userFullName, userEmailAddress, position, profilePicture, action, status, type) {
  db.collection(logsRef).doc(publicDomain).collection(activityRef).add({
    user_id: userId,
    name: userFullName,
    email_address: userEmailAddress,
    position: position,
    profile_picture: profilePicture,
    action: action,
    status: status,
    type: type,
    created_at: serverDateTime
  }).catch(function (e) {
      toast(e.message, error);
      return;
  });
}

function currentDateTime() {
    now = new Date(Date.now());
    currentTime = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    fullCurrentDateTime = yyyy + '-' + mm + '-' + dd + ' ' + Date().slice(16,25);
    fullDate = yyyy + '-' + mm + '-' + dd;
    serverDateTime = firebase.firestore.FieldValue.serverTimestamp();
}

function redirect(value) {
    window.location.href = value;
}
	
function arrayResult(d) {
    let v = [];
    for (var i=0; i<d.length; i++) {
        v.push(d[i]);
    }
    return v;
}

function getResult(v) {
    var result = [];
    for (var i=0; i<v.length; i++) {
        result.push({v: v[i].d});
    }
    return result;
}

function stop() {
    clearInterval(t);
    t = null;
}

function stopLoader() {
    stop();
    loader(false);
}

function stopChecker() {
    setTimeout(function() { 
        if (!hasValue) {
            clearLoader();
            sweetAlert(noData, error);
        }
    }, 15000);
}

function clearLoader() {
    stopLoader();
    hasValue = true;
    localStorage.setItem(errorState, 0);
    $('body').css({
        'overflow-y': 'scroll',
        'height': '100%'
    });
}

function cdReload(path) {
    setTimeout(function() { 
        reloadPage(path);
    }, 6000);
}

function cooldownStopLoader() {
    setTimeout(function() { 
        clearLoader();
    }, 3000);
}

function reloadPage(path) {
    location.href = path;
}

function addParameterUrl(param) {
    _url = location.href;
    _url += (_url.split('?')[1] ? '&':'?') + param;
    return _url;
}

function loader(isShowing) {
    if (!isShowing) {
        $("#loader").css("visibility","hidden");
        return;
    }
    $("#loader").css("visibility","visible");
}

function createKeys() {
    logKey = log + keyCode(3) + fullDate + time;
    slotKey = slot + keyCode(3) + fullDate + time;
    appKey = slot + keyCode(3) + fullDate + time;
}

function showModal(id, value) {
    $(id).modal(value);
}

function hideProgressModal() {
    setTimeout(function() {
        showModal('#modal-loading', hide);
    }, 690);
}

function emptyInputText(v) {
    for (i=0; i<v.length; i++) {
        $(v[i]).val(e);
    }
}

function emptyDisplayText(v) {
    for (i=0; i<v.length; i++) {
        $(v[i]).html(e);
    }
}

function setImage(i, v) {
    $(i).attr("src", v);
}

function icon(b, t) {
    $(b).html(t);
}

function button(b, t) {
    $(b).html(t);
}

function input(id, value, flag) {
    $(id).prop(value, flag);
}

function text(i, v) {
    $(i).html(v);
}

function inputText(i, v) {
    $(i).val(v);
}

function setDefaultToZero(v) {
    for (i=0; i<v.length; i++) {
        $(v[i]).val(0);
    }
}

function displayElement(i, f) {
    $(i).css({'display': f});
}

function disabledElement(i, f) {
    if (f) {
        $(i).prop('disabled', true);
        return;
    }
    $(i).removeAttr('disabled');
}

function toast(message, style) {
    if (style == success) {
      toastr.success(message);
    } else if (style == error) {
      toastr.error(message);
    } else if (style == info) {
      toastr.info(message);
    } else if (style == warning) {
      toastr.warning(message);
    }
}

function convertSecondsToDateLocal(value) {
    var date = new Date(value*1000);
    date = date.toString().slice(0, -31);
    return date;
}

function countdownIn(timerValue) {
    // var timerValue = "5:01";
    var interval = setInterval(function() {
    var timer = timerValue.split(':');
    var minutes = parseInt(timer[0], 10);
    var seconds = parseInt(timer[1], 10);
    --seconds;
    minutes = (seconds < 0) ? --minutes : minutes;
    if (minutes < 0) clearInterval(interval);
    seconds = (seconds < 0) ? 59 : seconds;
    seconds = (seconds < 10) ? '0' + seconds : seconds;
    //minutes = (minutes < 10) ?  minutes : minutes;
    $('.countdown').html(minutes + ':' + seconds);
    timerValue = minutes + ':' + seconds;
    }, 1000);
}

function setBackround() {
    currentPage = pathName.split("/").pop();
    // if (getUserPosition == adminUser) {
    //     populateDashboard();
    // }
    // displayElement('#side-nav-logout', notVisible);
    // displayElement('#top-nav-logout', notVisible);
    // displayElement('#user-info', notVisible);
    // displayElement('#nav-sidebar', notVisible);
    // disabledElement('#app-time-8', false);
    // disabledElement('#app-time-9', false);
    // disabledElement('#app-time-10', false);
    // text('#version-number', versionNumber)
    // text('#s1-appointment-text', 'To schedule an appointment, please login first before');
    // text('#s2-appointment-text', 'proceeding to the Appointment Registration form. Thank you!');
    // if (getUserId) {
    //     userFullName = getUserFirstName + s + getUserMiddleName + s + getUserLastName;
    //     currentPage = pathName.split("/").pop();
    //     displayElement('#side-nav-logout', visible);
    //     displayElement('#top-nav-logout', visible);
    //     displayElement('#user-info', visible);
    //     displayElement('#nav-sidebar', visible);
    //     text('#user-active-login-name', getUserFirstName);
    //     text('#s1-appointment-text', 'Please click the Get Started button in order to proceed');
    //     text('#s2-appointment-text', 'on the Appointment Registration form.');
    //     text('#profile-name', userFullName);
    //     text('#profile-email', getUserEmailAddress);
    //     text('#profile-birthday', getUserBirthdate);
    //     text('#profile-date-time-registered', getUserDateTimeRegistered);
    //     text('#profile-id', getUserId);
    //     setTimeout(function() {
    //         if (total8 <= 0) {
    //             total8 = no;
    //             disabledElement('#app-time-8', true);
    //         }
    //         if (total9 <= 0) {
    //             total9 = no;
    //             disabledElement('#app-time-9', true);
    //         }
    //         if (total10 <= 0) {
    //             total10 = no;
    //             disabledElement('#app-time-10', true);
    //         }
    //         text('#total-slots-for-8am', '('+total8+s+availableSlots+')');
    //         text('#total-slots-for-9am', '('+total9+s+availableSlots+')');
    //         text('#total-slots-for-10am','('+total10+s+availableSlots+')');
    //     }, 5000);
    //     if (!isUserLoggedOut) localStorage.setItem('user_logout', true);
    // }
}

const getUsers = async (doc) => {
  const usersData = await userReference.get();
  usersData.docs.forEach(v => {
    const u = v.data();
    var emailAddress = u.email_address, position = u.position, fullName = u.name, status = u.status, 
    userId = u.user_id, createdAt = convertSecondsToDateLocal(u.created_at.seconds);
    if (status == 1) {
        status = "ACTIVE";
    } else {
        status = "INACTIVE";
    }
    $('#user-lists').append('<tr><td class="text-center">'+fullName+'</td><td class="text-center">'+userId+'</td><td class="text-center">'+emailAddress+'</td><td class="text-center">'+status+'</td><td class="text-center">'+createdAt+'</td></tr>');
    if (userEmail == emailAddress) {
      if (position == adminUser) {
          userRedirectLink = dashboardUrl;
      }
      localStorage.setItem('name', u.name);
      localStorage.setItem('id', u.user_id);
      localStorage.setItem('email_address', emailAddress);
      localStorage.setItem('position', position);
      localStorage.setItem('profile_picture', u.profile_picture);
      localStorage.setItem('date_time_registered', u.created_at);
      localStorage.setItem('user_status', u.status);
      localStorage.setItem('user_logout', false);
      insertLogs(userId, fullName, emailAddress, position, thumbnail,
                "Admin logged in.", active, "LOGIN");
      setTimeout(function() {
        hideProgressModal();
        toast("Successfully login!", success);
        redirect(userRedirectLink);
      }, 4000)}
  });
  $('#btn-show-add-admin').click(async function() {
    showModal('#modal-add-new-admin', show);
    $('#btn-submit-admin-new-user').click(async function() {
        showModal('#modal-loading', show);
        text('#modal-loading-message', "Creating new admin user...");
        var userFullName = e,
        userEmailAddress = e,
        userAdminPassword = e,
        userAdminConfirmPassword = e;
        userFullName = $('#user-admin-name').val();
        userEmailAddress = $('#user-admin-email-address').val();
        userAdminPassword = $('#user-admin-password').val();
        userAdminConfirmPassword = $('#user-admin-confirm-password').val();
        
        if (!userFullName || !userEmailAddress | !userAdminPassword || !userAdminConfirmPassword) {
            hideProgressModal();
            toast(requiredMsg, warning);
        } else if (userAdminPassword != userAdminConfirmPassword) {
            hideProgressModal();
            toast(invalidPassword, warning);
        } else {
            showModal('#modal-add-new-admin', hide);
            insertNewUser(userFullName, userEmailAddress, userAdminPassword, adminUser, noImage);
            setTimeout(function() {
                hideProgressModal();
                window.location.href = 'user-management.html';
            }, 3500);
        }
    });
  });
};

function clearLocalStorage() {
  localStorage.removeItem("id");
  localStorage.removeItem("first_name");
  localStorage.removeItem("middle_name");
  localStorage.removeItem("last_name");
  localStorage.removeItem("email_address");
  localStorage.removeItem("position");
  localStorage.removeItem("profile_picture");
  localStorage.removeItem("date_time_registered");
  localStorage.removeItem("user_status");
  localStorage.removeItem("default_path");
  localStorage.setItem('user_logout', true);
}

function logout() {
  firebase.auth().signOut();
  clearLocalStorage();
  redirect(defaultUserEndpoint);
  insertLogs(getUserId, userFullName, getUserEmailAddress, getUserPosition, 
             thumbnail, "User Logout", active, "LOGOUT");
}

function createUUID() {
    var s = [], hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    s[8] = s[13] = s[18] = s[23] = "-";
    var uuid = s.join("");
    return uuid;
}

/*
function userTemp() {
    let testEmail = "admin@test.com", testPass = "Qwerty123!", firstName = "Admin", middleName = "A.", lastName = "Test";
    firebase.auth().createUserWithEmailAndPassword(testEmail, testPass).then(function(d) {
      let userId = d.user.uid;
      db.collection(usersRef).doc(usersDomain).collection(credentialsRef).add({
        id: userId,
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        email_address: email,
        suffix: suffix,
        address: address,
        birthday: birthday,
        gender: gender,
        age: age,
        pw: hashPassword,
        profile_picture: profilePic,
        position: position,
        religion: religion,
        status: status,
        created_at: serverDateTime
      }).catch(function (error) {
          toast(errorDocument + error, error);
      });
      toast("user temp created!", success);
    }, function(error) {
      toast(error.message, error);
    });
}
function extras() {
    db.collection(appointmentsRef).doc(timeSlotsDomain).collection(time8AM).add({
        id: slotKey,
        appointment_key: none,
        occupied_by: na,
        created_by: adminUser,
        created_at: serverDateTime,
        status: 1
    }).catch(function (error) {
        toast(errorDocument + error, error);
    });
    toast("extras created!", success);
}
setTimeout(function() {
    // userTemp();
    extras();
}, 1000);
*/