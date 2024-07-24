$(function () {
    createKeys();
    currentDateTime();
    setBackround();
    getCommissions();
    // insertTempUser("Admin", "admin@admin.com", adminUser, noImage);
    // getTotalAvailable8AM();
    // getTotalAvailable9AM();
    // getTotalAvailable10AM();
    // myAppointments();
    // initChat();
    // fetchUsers();
    // fetchLogs();
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

function insertTempUser(userFullName, userEmailAddress, position, profilePicture) {
  db.collection(usersRef).doc(usersDomain).collection(credentialsRef).add({
    user_id: uuidv4(),
    name: userFullName,
    email_address: userEmailAddress,
    position: position,
    profile_picture: profilePicture,
    status: 1,
    created_at: serverDateTime
  }).catch(function (e) {
      toast(e.message, error);
      return;
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
    let emailAddress = u.email_address, position = u.position, fullName = u.name,
    userId = u.user_id, createdAt = convertSecondsToDateLocal(u.created_at.seconds);
    if (userEmail == emailAddress) {
      if (position == adminUser) {
          userRedirectLink = dashboardUrl;
      }
      localStorage.setItem('first_name', u.first_name);
      localStorage.setItem('middle_name', u.middle_name);
      localStorage.setItem('last_name', u.last_name);
      localStorage.setItem('id', u.id);
      localStorage.setItem('company', u.company);
      localStorage.setItem('email_address', emailAddress);
      localStorage.setItem('position', position);
      localStorage.setItem('profile_picture', u.profile_picture);
      localStorage.setItem('date_time_registered', createdAt);
      localStorage.setItem('user_status', u.status);
      localStorage.setItem('default_path', main + paths);
      localStorage.setItem('user_logout', false);
      hideProgressModal();
      insertLogs(userId, fullName, emailAddress, position, thumbnail,
                "New user login and redirect to Appointment page.", active, "LOGIN");
      redirect(userRedirectLink);
    }
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

function insertNewUser(firstName, middleName, lastName, suffix, address, birthday, age, gender, email, password, hashPassword, position, profilePic, religion, status, url) {
  firebase.auth().createUserWithEmailAndPassword(email, password).then(function(d) {
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

const searchRecord = async (doc) => {
    var stopSearch = false;
    insertLogs(getUserId, userFullName, getUserEmailAddress, getUserPosition, thumbnail,
              "Search Record - [" + searchFirstName + "] / " + "[" + searchMiddleName + "] / " + 
              "[" + searchLastName + "] / [" + searchYearBorn + "] / [" + searchYearDied + "]", active, "SEARCH");
    const appointmentsData10 = 
        await db.collection(appointmentsRef + timeSlotsDomain + sl + time10AM)
        .where("app_first_name", '==', searchFirstName)
        .get();
    appointmentsData10.docs.forEach(p => {
        const a = p.data();
        let transactionNumber = a.client_transaction_id, firstName = a.app_first_name, middleName = a.app_middle_name, lastName = a.app_last_name, appointmentKey = a.appointment_key, suffix = a.app_suffix, address = a.app_address, dateBorn = a.app_date_born, age = a.app_age, dateDied = a.app_date_died, gender = a.app_gender, relationship = a.app_relationship, selectedDate = a.app_selected_date, selectedTime = a.app_selected_time, burialWholeBody = a.app_burial_whole_body, paymentMethod = a.app_payment_method, deathCertificateURL = a.app_death_certificate, entrancePermitURL = a.app_entrance_permit, transferPermitURL = a.app_transfer_permit, civilRegistryPSAURL = a.app_civil_registry_psa, burialPermitURL = a.app_burial_permit, clientPaidAmount = a.client_paid_amount, transactionStatus = a.client_transaction_status, clientName = a.client_name, clientUserID = a.client_user_id, dateTimeUpdated = convertSecondsToDateLocal(a.updated_at.seconds), status = a.status;
        if (transactionNumber) {
            stopSearch = true;
            displaySearchRecords(appointmentKey,firstName,middleName,lastName,suffix,address,dateBorn,age,dateDied,gender,relationship,selectedDate,selectedTime,burialWholeBody,paymentMethod,deathCertificateURL,entrancePermitURL,transferPermitURL,civilRegistryPSAURL,burialPermitURL,clientPaidAmount,transactionNumber,transactionStatus,clientName,clientUserID,dateTimeUpdated,status);
        }
    });
    const appointmentsData10Ln = 
        await db.collection(appointmentsRef + timeSlotsDomain + sl + time10AM)
        .where("app_last_name", '==', searchLastName)
        .get();
    appointmentsData10Ln.docs.forEach(p => {
        const a = p.data();
        let transactionNumber = a.client_transaction_id, firstName = a.app_first_name, middleName = a.app_middle_name, lastName = a.app_last_name, appointmentKey = a.appointment_key, suffix = a.app_suffix, address = a.app_address, dateBorn = a.app_date_born, age = a.app_age, dateDied = a.app_date_died, gender = a.app_gender, relationship = a.app_relationship, selectedDate = a.app_selected_date, selectedTime = a.app_selected_time, burialWholeBody = a.app_burial_whole_body, paymentMethod = a.app_payment_method, deathCertificateURL = a.app_death_certificate, entrancePermitURL = a.app_entrance_permit, transferPermitURL = a.app_transfer_permit, civilRegistryPSAURL = a.app_civil_registry_psa, burialPermitURL = a.app_burial_permit, clientPaidAmount = a.client_paid_amount, transactionStatus = a.client_transaction_status, clientName = a.client_name, clientUserID = a.client_user_id, dateTimeUpdated = convertSecondsToDateLocal(a.updated_at.seconds), status = a.status;
        if (!stopSearch) {
            displaySearchRecords(appointmentKey,firstName,middleName,lastName,suffix,address,dateBorn,age,dateDied,gender,relationship,selectedDate,selectedTime,burialWholeBody,paymentMethod,deathCertificateURL,entrancePermitURL,transferPermitURL,civilRegistryPSAURL,burialPermitURL,clientPaidAmount,transactionNumber,transactionStatus,clientName,clientUserID,dateTimeUpdated,status);
            stopSearch = true;
            return;
        }
    });
    const appointmentsData10Mn = 
        await db.collection(appointmentsRef + timeSlotsDomain + sl + time10AM)
        .where("app_middle_name", '==', searchMiddleName)
        .get();
    appointmentsData10Mn.docs.forEach(p => {
        const a = p.data();
        let transactionNumber = a.client_transaction_id, firstName = a.app_first_name, middleName = a.app_middle_name, lastName = a.app_last_name, appointmentKey = a.appointment_key, suffix = a.app_suffix, address = a.app_address, dateBorn = a.app_date_born, age = a.app_age, dateDied = a.app_date_died, gender = a.app_gender, relationship = a.app_relationship, selectedDate = a.app_selected_date, selectedTime = a.app_selected_time, burialWholeBody = a.app_burial_whole_body, paymentMethod = a.app_payment_method, deathCertificateURL = a.app_death_certificate, entrancePermitURL = a.app_entrance_permit, transferPermitURL = a.app_transfer_permit, civilRegistryPSAURL = a.app_civil_registry_psa, burialPermitURL = a.app_burial_permit, clientPaidAmount = a.client_paid_amount, transactionStatus = a.client_transaction_status, clientName = a.client_name, clientUserID = a.client_user_id, dateTimeUpdated = convertSecondsToDateLocal(a.updated_at.seconds), status = a.status;
        if (!stopSearch) {
            displaySearchRecords(appointmentKey,firstName,middleName,lastName,suffix,address,dateBorn,age,dateDied,gender,relationship,selectedDate,selectedTime,burialWholeBody,paymentMethod,deathCertificateURL,entrancePermitURL,transferPermitURL,civilRegistryPSAURL,burialPermitURL,clientPaidAmount,transactionNumber,transactionStatus,clientName,clientUserID,dateTimeUpdated,status);
            stopSearch = true;
            return;
        }
    });
    const appointmentsData10Yb = 
        await db.collection(appointmentsRef + timeSlotsDomain + sl + time10AM)
        .where("app_year_born", '==', searchYearBorn)
        .get();
    appointmentsData10Yb.docs.forEach(p => {
        const a = p.data();
        let transactionNumber = a.client_transaction_id, firstName = a.app_first_name, middleName = a.app_middle_name, lastName = a.app_last_name, appointmentKey = a.appointment_key, suffix = a.app_suffix, address = a.app_address, dateBorn = a.app_date_born, age = a.app_age, dateDied = a.app_date_died, gender = a.app_gender, relationship = a.app_relationship, selectedDate = a.app_selected_date, selectedTime = a.app_selected_time, burialWholeBody = a.app_burial_whole_body, paymentMethod = a.app_payment_method, deathCertificateURL = a.app_death_certificate, entrancePermitURL = a.app_entrance_permit, transferPermitURL = a.app_transfer_permit, civilRegistryPSAURL = a.app_civil_registry_psa, burialPermitURL = a.app_burial_permit, clientPaidAmount = a.client_paid_amount, transactionStatus = a.client_transaction_status, clientName = a.client_name, clientUserID = a.client_user_id, dateTimeUpdated = convertSecondsToDateLocal(a.updated_at.seconds), status = a.status;
        if (!stopSearch) {
            displaySearchRecords(appointmentKey,firstName,middleName,lastName,suffix,address,dateBorn,age,dateDied,gender,relationship,selectedDate,selectedTime,burialWholeBody,paymentMethod,deathCertificateURL,entrancePermitURL,transferPermitURL,civilRegistryPSAURL,burialPermitURL,clientPaidAmount,transactionNumber,transactionStatus,clientName,clientUserID,dateTimeUpdated,status);
            stopSearch = true;
            return;
        }
    });
    const appointmentsData10Yd = 
        await db.collection(appointmentsRef + timeSlotsDomain + sl + time10AM)
        .where("app_year_died", '==', searchYearDied)
        .get();
        appointmentsData10Yd.docs.forEach(p => {
        const a = p.data();
        let transactionNumber = a.client_transaction_id, firstName = a.app_first_name, middleName = a.app_middle_name, lastName = a.app_last_name, appointmentKey = a.appointment_key, suffix = a.app_suffix, address = a.app_address, dateBorn = a.app_date_born, age = a.app_age, dateDied = a.app_date_died, gender = a.app_gender, relationship = a.app_relationship, selectedDate = a.app_selected_date, selectedTime = a.app_selected_time, burialWholeBody = a.app_burial_whole_body, paymentMethod = a.app_payment_method, deathCertificateURL = a.app_death_certificate, entrancePermitURL = a.app_entrance_permit, transferPermitURL = a.app_transfer_permit, civilRegistryPSAURL = a.app_civil_registry_psa, burialPermitURL = a.app_burial_permit, clientPaidAmount = a.client_paid_amount, transactionStatus = a.client_transaction_status, clientName = a.client_name, clientUserID = a.client_user_id, dateTimeUpdated = convertSecondsToDateLocal(a.updated_at.seconds), status = a.status;
        if (!stopSearch) {
            displaySearchRecords(appointmentKey,firstName,middleName,lastName,suffix,address,dateBorn,age,dateDied,gender,relationship,selectedDate,selectedTime,burialWholeBody,paymentMethod,deathCertificateURL,entrancePermitURL,transferPermitURL,civilRegistryPSAURL,burialPermitURL,clientPaidAmount,transactionNumber,transactionStatus,clientName,clientUserID,dateTimeUpdated,status);
            stopSearch = true;
            return;
        }
    });
    const appointmentsData9Fn = 
        await db.collection(appointmentsRef + timeSlotsDomain + sl + time9AM)
        .where("app_first_name", '==', searchFirstName)
        .get();
        appointmentsData9Fn.docs.forEach(p => {
        const a = p.data();
        let transactionNumber = a.client_transaction_id, firstName = a.app_first_name, middleName = a.app_middle_name, lastName = a.app_last_name, appointmentKey = a.appointment_key, suffix = a.app_suffix, address = a.app_address, dateBorn = a.app_date_born, age = a.app_age, dateDied = a.app_date_died, gender = a.app_gender, relationship = a.app_relationship, selectedDate = a.app_selected_date, selectedTime = a.app_selected_time, burialWholeBody = a.app_burial_whole_body, paymentMethod = a.app_payment_method, deathCertificateURL = a.app_death_certificate, entrancePermitURL = a.app_entrance_permit, transferPermitURL = a.app_transfer_permit, civilRegistryPSAURL = a.app_civil_registry_psa, burialPermitURL = a.app_burial_permit, clientPaidAmount = a.client_paid_amount, transactionStatus = a.client_transaction_status, clientName = a.client_name, clientUserID = a.client_user_id, dateTimeUpdated = convertSecondsToDateLocal(a.updated_at.seconds), status = a.status;
        if (!stopSearch) {
            displaySearchRecords(appointmentKey,firstName,middleName,lastName,suffix,address,dateBorn,age,dateDied,gender,relationship,selectedDate,selectedTime,burialWholeBody,paymentMethod,deathCertificateURL,entrancePermitURL,transferPermitURL,civilRegistryPSAURL,burialPermitURL,clientPaidAmount,transactionNumber,transactionStatus,clientName,clientUserID,dateTimeUpdated,status);
            stopSearch = true;
            return;
        }
    });
    const appointmentsData9Ln = 
        await db.collection(appointmentsRef + timeSlotsDomain + sl + time9AM)
        .where("app_last_name", '==', searchLastName)
        .get();
    appointmentsData9Ln.docs.forEach(p => {
        const a = p.data();
        let transactionNumber = a.client_transaction_id, firstName = a.app_first_name, middleName = a.app_middle_name, lastName = a.app_last_name, appointmentKey = a.appointment_key, suffix = a.app_suffix, address = a.app_address, dateBorn = a.app_date_born, age = a.app_age, dateDied = a.app_date_died, gender = a.app_gender, relationship = a.app_relationship, selectedDate = a.app_selected_date, selectedTime = a.app_selected_time, burialWholeBody = a.app_burial_whole_body, paymentMethod = a.app_payment_method, deathCertificateURL = a.app_death_certificate, entrancePermitURL = a.app_entrance_permit, transferPermitURL = a.app_transfer_permit, civilRegistryPSAURL = a.app_civil_registry_psa, burialPermitURL = a.app_burial_permit, clientPaidAmount = a.client_paid_amount, transactionStatus = a.client_transaction_status, clientName = a.client_name, clientUserID = a.client_user_id, dateTimeUpdated = convertSecondsToDateLocal(a.updated_at.seconds), status = a.status;
        if (!stopSearch) {
            displaySearchRecords(appointmentKey,firstName,middleName,lastName,suffix,address,dateBorn,age,dateDied,gender,relationship,selectedDate,selectedTime,burialWholeBody,paymentMethod,deathCertificateURL,entrancePermitURL,transferPermitURL,civilRegistryPSAURL,burialPermitURL,clientPaidAmount,transactionNumber,transactionStatus,clientName,clientUserID,dateTimeUpdated,status);
            stopSearch = true;
            return;
        }
    });
    const appointmentsData9Mn = 
        await db.collection(appointmentsRef + timeSlotsDomain + sl + time9AM)
        .where("app_middle_name", '==', searchMiddleName)
        .get();
    appointmentsData9Mn.docs.forEach(p => {
        const a = p.data();
        let transactionNumber = a.client_transaction_id, firstName = a.app_first_name, middleName = a.app_middle_name, lastName = a.app_last_name, appointmentKey = a.appointment_key, suffix = a.app_suffix, address = a.app_address, dateBorn = a.app_date_born, age = a.app_age, dateDied = a.app_date_died, gender = a.app_gender, relationship = a.app_relationship, selectedDate = a.app_selected_date, selectedTime = a.app_selected_time, burialWholeBody = a.app_burial_whole_body, paymentMethod = a.app_payment_method, deathCertificateURL = a.app_death_certificate, entrancePermitURL = a.app_entrance_permit, transferPermitURL = a.app_transfer_permit, civilRegistryPSAURL = a.app_civil_registry_psa, burialPermitURL = a.app_burial_permit, clientPaidAmount = a.client_paid_amount, transactionStatus = a.client_transaction_status, clientName = a.client_name, clientUserID = a.client_user_id, dateTimeUpdated = convertSecondsToDateLocal(a.updated_at.seconds), status = a.status;
        if (!stopSearch) {
            displaySearchRecords(appointmentKey,firstName,middleName,lastName,suffix,address,dateBorn,age,dateDied,gender,relationship,selectedDate,selectedTime,burialWholeBody,paymentMethod,deathCertificateURL,entrancePermitURL,transferPermitURL,civilRegistryPSAURL,burialPermitURL,clientPaidAmount,transactionNumber,transactionStatus,clientName,clientUserID,dateTimeUpdated,status);
            stopSearch = true;
            return;
        }
    });
    const appointmentsData9Yb = 
        await db.collection(appointmentsRef + timeSlotsDomain + sl + time9AM)
        .where("app_year_born", '==', searchYearBorn)
        .get();
    appointmentsData9Yb.docs.forEach(p => {
        const a = p.data();
        let transactionNumber = a.client_transaction_id, firstName = a.app_first_name, middleName = a.app_middle_name, lastName = a.app_last_name, appointmentKey = a.appointment_key, suffix = a.app_suffix, address = a.app_address, dateBorn = a.app_date_born, age = a.app_age, dateDied = a.app_date_died, gender = a.app_gender, relationship = a.app_relationship, selectedDate = a.app_selected_date, selectedTime = a.app_selected_time, burialWholeBody = a.app_burial_whole_body, paymentMethod = a.app_payment_method, deathCertificateURL = a.app_death_certificate, entrancePermitURL = a.app_entrance_permit, transferPermitURL = a.app_transfer_permit, civilRegistryPSAURL = a.app_civil_registry_psa, burialPermitURL = a.app_burial_permit, clientPaidAmount = a.client_paid_amount, transactionStatus = a.client_transaction_status, clientName = a.client_name, clientUserID = a.client_user_id, dateTimeUpdated = convertSecondsToDateLocal(a.updated_at.seconds), status = a.status;
        if (!stopSearch) {
            displaySearchRecords(appointmentKey,firstName,middleName,lastName,suffix,address,dateBorn,age,dateDied,gender,relationship,selectedDate,selectedTime,burialWholeBody,paymentMethod,deathCertificateURL,entrancePermitURL,transferPermitURL,civilRegistryPSAURL,burialPermitURL,clientPaidAmount,transactionNumber,transactionStatus,clientName,clientUserID,dateTimeUpdated,status);
            stopSearch = true;
            return;
        }
    });
    const appointmentsData9Yd = 
        await db.collection(appointmentsRef + timeSlotsDomain + sl + time9AM)
        .where("app_year_died", '==', searchYearDied)
        .get();
        appointmentsData9Yd.docs.forEach(p => {
        const a = p.data();
        let transactionNumber = a.client_transaction_id, firstName = a.app_first_name, middleName = a.app_middle_name, lastName = a.app_last_name, appointmentKey = a.appointment_key, suffix = a.app_suffix, address = a.app_address, dateBorn = a.app_date_born, age = a.app_age, dateDied = a.app_date_died, gender = a.app_gender, relationship = a.app_relationship, selectedDate = a.app_selected_date, selectedTime = a.app_selected_time, burialWholeBody = a.app_burial_whole_body, paymentMethod = a.app_payment_method, deathCertificateURL = a.app_death_certificate, entrancePermitURL = a.app_entrance_permit, transferPermitURL = a.app_transfer_permit, civilRegistryPSAURL = a.app_civil_registry_psa, burialPermitURL = a.app_burial_permit, clientPaidAmount = a.client_paid_amount, transactionStatus = a.client_transaction_status, clientName = a.client_name, clientUserID = a.client_user_id, dateTimeUpdated = convertSecondsToDateLocal(a.updated_at.seconds), status = a.status;
        if (!stopSearch) {
            displaySearchRecords(appointmentKey,firstName,middleName,lastName,suffix,address,dateBorn,age,dateDied,gender,relationship,selectedDate,selectedTime,burialWholeBody,paymentMethod,deathCertificateURL,entrancePermitURL,transferPermitURL,civilRegistryPSAURL,burialPermitURL,clientPaidAmount,transactionNumber,transactionStatus,clientName,clientUserID,dateTimeUpdated,status);
            stopSearch = true;
            return;
        }
    });
    const appointmentsData8Fn = 
        await db.collection(appointmentsRef + timeSlotsDomain + sl + time8AM)
        .where("app_first_name", '==', searchFirstName)
        .get();
        appointmentsData8Fn.docs.forEach(p => {
        const a = p.data();
        let transactionNumber = a.client_transaction_id, firstName = a.app_first_name, middleName = a.app_middle_name, lastName = a.app_last_name, appointmentKey = a.appointment_key, suffix = a.app_suffix, address = a.app_address, dateBorn = a.app_date_born, age = a.app_age, dateDied = a.app_date_died, gender = a.app_gender, relationship = a.app_relationship, selectedDate = a.app_selected_date, selectedTime = a.app_selected_time, burialWholeBody = a.app_burial_whole_body, paymentMethod = a.app_payment_method, deathCertificateURL = a.app_death_certificate, entrancePermitURL = a.app_entrance_permit, transferPermitURL = a.app_transfer_permit, civilRegistryPSAURL = a.app_civil_registry_psa, burialPermitURL = a.app_burial_permit, clientPaidAmount = a.client_paid_amount, transactionStatus = a.client_transaction_status, clientName = a.client_name, clientUserID = a.client_user_id, dateTimeUpdated = convertSecondsToDateLocal(a.updated_at.seconds), status = a.status;
        if (!stopSearch) {
            displaySearchRecords(appointmentKey,firstName,middleName,lastName,suffix,address,dateBorn,age,dateDied,gender,relationship,selectedDate,selectedTime,burialWholeBody,paymentMethod,deathCertificateURL,entrancePermitURL,transferPermitURL,civilRegistryPSAURL,burialPermitURL,clientPaidAmount,transactionNumber,transactionStatus,clientName,clientUserID,dateTimeUpdated,status);
            stopSearch = true;
            return;
        }
    });
    const appointmentsData8Ln = 
        await db.collection(appointmentsRef + timeSlotsDomain + sl + time8AM)
        .where("app_last_name", '==', searchLastName)
        .get();
    appointmentsData8Ln.docs.forEach(p => {
        const a = p.data();
        let transactionNumber = a.client_transaction_id, firstName = a.app_first_name, middleName = a.app_middle_name, lastName = a.app_last_name, appointmentKey = a.appointment_key, suffix = a.app_suffix, address = a.app_address, dateBorn = a.app_date_born, age = a.app_age, dateDied = a.app_date_died, gender = a.app_gender, relationship = a.app_relationship, selectedDate = a.app_selected_date, selectedTime = a.app_selected_time, burialWholeBody = a.app_burial_whole_body, paymentMethod = a.app_payment_method, deathCertificateURL = a.app_death_certificate, entrancePermitURL = a.app_entrance_permit, transferPermitURL = a.app_transfer_permit, civilRegistryPSAURL = a.app_civil_registry_psa, burialPermitURL = a.app_burial_permit, clientPaidAmount = a.client_paid_amount, transactionStatus = a.client_transaction_status, clientName = a.client_name, clientUserID = a.client_user_id, dateTimeUpdated = convertSecondsToDateLocal(a.updated_at.seconds), status = a.status;
        if (!stopSearch) {
            displaySearchRecords(appointmentKey,firstName,middleName,lastName,suffix,address,dateBorn,age,dateDied,gender,relationship,selectedDate,selectedTime,burialWholeBody,paymentMethod,deathCertificateURL,entrancePermitURL,transferPermitURL,civilRegistryPSAURL,burialPermitURL,clientPaidAmount,transactionNumber,transactionStatus,clientName,clientUserID,dateTimeUpdated,status);
            stopSearch = true;
            return;
        }
    });
    const appointmentsData8Mn = 
        await db.collection(appointmentsRef + timeSlotsDomain + sl + time8AM)
        .where("app_middle_name", '==', searchMiddleName)
        .get();
    appointmentsData8Mn.docs.forEach(p => {
        const a = p.data();
        let transactionNumber = a.client_transaction_id, firstName = a.app_first_name, middleName = a.app_middle_name, lastName = a.app_last_name, appointmentKey = a.appointment_key, suffix = a.app_suffix, address = a.app_address, dateBorn = a.app_date_born, age = a.app_age, dateDied = a.app_date_died, gender = a.app_gender, relationship = a.app_relationship, selectedDate = a.app_selected_date, selectedTime = a.app_selected_time, burialWholeBody = a.app_burial_whole_body, paymentMethod = a.app_payment_method, deathCertificateURL = a.app_death_certificate, entrancePermitURL = a.app_entrance_permit, transferPermitURL = a.app_transfer_permit, civilRegistryPSAURL = a.app_civil_registry_psa, burialPermitURL = a.app_burial_permit, clientPaidAmount = a.client_paid_amount, transactionStatus = a.client_transaction_status, clientName = a.client_name, clientUserID = a.client_user_id, dateTimeUpdated = convertSecondsToDateLocal(a.updated_at.seconds), status = a.status;
        if (!stopSearch) {
            displaySearchRecords(appointmentKey,firstName,middleName,lastName,suffix,address,dateBorn,age,dateDied,gender,relationship,selectedDate,selectedTime,burialWholeBody,paymentMethod,deathCertificateURL,entrancePermitURL,transferPermitURL,civilRegistryPSAURL,burialPermitURL,clientPaidAmount,transactionNumber,transactionStatus,clientName,clientUserID,dateTimeUpdated,status);
            stopSearch = true;
            return;
        }
    });
    const appointmentsData8Yb = 
        await db.collection(appointmentsRef + timeSlotsDomain + sl + time8AM)
        .where("app_year_born", '==', searchYearBorn)
        .get();
    appointmentsData8Yb.docs.forEach(p => {
        const a = p.data();
        let transactionNumber = a.client_transaction_id, firstName = a.app_first_name, middleName = a.app_middle_name, lastName = a.app_last_name, appointmentKey = a.appointment_key, suffix = a.app_suffix, address = a.app_address, dateBorn = a.app_date_born, age = a.app_age, dateDied = a.app_date_died, gender = a.app_gender, relationship = a.app_relationship, selectedDate = a.app_selected_date, selectedTime = a.app_selected_time, burialWholeBody = a.app_burial_whole_body, paymentMethod = a.app_payment_method, deathCertificateURL = a.app_death_certificate, entrancePermitURL = a.app_entrance_permit, transferPermitURL = a.app_transfer_permit, civilRegistryPSAURL = a.app_civil_registry_psa, burialPermitURL = a.app_burial_permit, clientPaidAmount = a.client_paid_amount, transactionStatus = a.client_transaction_status, clientName = a.client_name, clientUserID = a.client_user_id, dateTimeUpdated = convertSecondsToDateLocal(a.updated_at.seconds), status = a.status;
        if (!stopSearch) {
            displaySearchRecords(appointmentKey,firstName,middleName,lastName,suffix,address,dateBorn,age,dateDied,gender,relationship,selectedDate,selectedTime,burialWholeBody,paymentMethod,deathCertificateURL,entrancePermitURL,transferPermitURL,civilRegistryPSAURL,burialPermitURL,clientPaidAmount,transactionNumber,transactionStatus,clientName,clientUserID,dateTimeUpdated,status);
            stopSearch = true;
            return;
        }
    });
    const appointmentsData8Yd = 
        await db.collection(appointmentsRef + timeSlotsDomain + sl + time8AM)
        .where("app_year_died", '==', searchYearDied)
        .get();
        appointmentsData8Yd.docs.forEach(p => {
        const a = p.data();
        let transactionNumber = a.client_transaction_id, firstName = a.app_first_name, middleName = a.app_middle_name, lastName = a.app_last_name, appointmentKey = a.appointment_key, suffix = a.app_suffix, address = a.app_address, dateBorn = a.app_date_born, age = a.app_age, dateDied = a.app_date_died, gender = a.app_gender, relationship = a.app_relationship, selectedDate = a.app_selected_date, selectedTime = a.app_selected_time, burialWholeBody = a.app_burial_whole_body, paymentMethod = a.app_payment_method, deathCertificateURL = a.app_death_certificate, entrancePermitURL = a.app_entrance_permit, transferPermitURL = a.app_transfer_permit, civilRegistryPSAURL = a.app_civil_registry_psa, burialPermitURL = a.app_burial_permit, clientPaidAmount = a.client_paid_amount, transactionStatus = a.client_transaction_status, clientName = a.client_name, clientUserID = a.client_user_id, dateTimeUpdated = convertSecondsToDateLocal(a.updated_at.seconds), status = a.status;
        if (!stopSearch) {
            displaySearchRecords(appointmentKey,firstName,middleName,lastName,suffix,address,dateBorn,age,dateDied,gender,relationship,selectedDate,selectedTime,burialWholeBody,paymentMethod,deathCertificateURL,entrancePermitURL,transferPermitURL,civilRegistryPSAURL,burialPermitURL,clientPaidAmount,transactionNumber,transactionStatus,clientName,clientUserID,dateTimeUpdated,status);
            stopSearch = true;
            return;
        }
    });
}

$('#btn-search-record').click(function() {
    searchLastName = $('#sr-last-name').val(),
    searchFirstName = $('#sr-first-name').val(),
    searchMiddleName = $('#sr-middle-name').val(),
    searchYearBorn = $('#sr-year-born').val(),
    searchYearDied = $('#sr-year-died').val();
    showModal('#modal-loading', show);
    searchRecord();
});

function displaySearchRecords(appointmentKey, firstName, middleName, lastName, suffix, address, dateBorn, age, dateDied, gender, relationship,
                              selectedDate, selectedTime, burialWholeBody, paymentMethod,
                              deathCertificateURL, entrancePermitURL, transferPermitURL, civilRegistryPSAURL, burialPermitURL,
                              clientPaidAmount, transactionNumber, transactionStatus, clientName, clientUserID, dateTimeUpdated,
                              status) {
    showModal('#modal-search-appointment', show);
    text('#search-view-app-last-name', lastName);
    text('#search-view-app-first-name', firstName);
    text('#search-view-app-middle-name', middleName);
    text('#search-view-app-suffix', suffix);
    text('#search-view-app-address', address);
    text('#search-view-app-date-born', dateBorn);
    text('#search-view-app-age', age);
    text('#search-view-app-date-died', dateDied);
    text('#search-view-app-gender', gender);
    text('#search-view-app-relationship', relationship);
    text('#search-view-app-selected-date', selectedDate);
    text('#search-view-app-selected-time', selectedTime);
    text('#search-view-app-burial-whole-body', burialWholeBody);
    text('#search-view-app-payment-method', paymentMethod);
    text('#search-view-app-transaction-number', transactionNumber);
    text('#search-view-app-transaction-status', transactionStatus);
    text('#search-view-app-paid-date', dateTimeUpdated);
    text('#search-view-app-payor-name', clientName);
    text('#search-view-app-total-paid-amount', clientPaidAmount);

    if (deathCertificateURL == none) {
        setImage('#search-view-app-death-certificate', noImage);
    } else {
        setImage('#search-view-app-death-certificate', deathCertificateURL);
    }
    
    if (entrancePermitURL == none) {
        setImage('#search-view-app-entrance-permit', noImage);
    } else {
        setImage('#search-view-app-entrance-permit', entrancePermitURL);
    }
    
    if (transferPermitURL == none) {
        setImage('#search-view-app-transfer-permit', noImage);
    } else {
        setImage('#search-view-app-transfer-permit', transferPermitURL);
    }
    
    if (civilRegistryPSAURL == none) {
        setImage('#search-view-app-civil-registry-psa', noImage);
    } else {
        setImage('#search-view-app-civil-registry-psa', civilRegistryPSAURL);
    }
    
    if (burialPermitURL == none) {
        setImage('#search-view-app-burial-permit', noImage);
    } else {
        setImage('#search-view-app-burial-permit', burialPermitURL);
    }
    hideProgressModal();
}

function initChat() {
    element.addClass('enter');
    if (!myStorage.getItem('chatID')) {
        myStorage.setItem('chatID', createUUID());
    }
    element.click(openElement);
    setTimeout(function()  {
        fetchMessagesFromChat();
    }, 3000);
}

const fetchMessagesFromChat = async (doc) => {
    var getTotalChat = 0;
    for (let index = 0; index < users.length; index++) {
        const user = users[index];
        const chats = await db.collection(chatRef + publicDomain + sl + user.id)
                              .where("status", '==', 1)
                              .get();
        chats.docs.forEach(c => {
            const m = c.data();
            let id = m.id, message = m.message, 
                userEmail = m.created_by_email, name = m.created_by_name,
                type = m.type, dateTimeCreated = convertSecondsToDateLocal(m.created_at.seconds);
            if (id) {
                if (userEmail != getUserEmailAddress) {
                    $('#message-lists')
                        .append('<li class="self"><span>['+name+']:</span></br><p>'+ s + message + '</p></li>');
                    getTotalChat += chats.docs.length;
                } else {
                    $('#message-lists')
                        .append('<li class="other"><span>['+name+']:</span></br><p class="">'+ s + message + '</p></li>');
                    getTotalChat = chats.docs.length;
                }
                $('#messages-lists').append('<tr><td class="text-center">'+message+'</td><td class="text-center">'+name+'</td><td class="text-center">'+type+'</td><td class="text-center">'+dateTimeCreated+'</td></tr>');
                hideProgressModal();
            }
        });
        text('#total-chats', getTotalChat);
    }
}

function openElement() {
    var messages = element.find('.messages');
    var textInput = element.find('.text-box');
    element.find('>i').hide();
    element.addClass('expand');
    element.find('.chat').addClass('enter');
    textInput.keydown(onMetaAndEnter).prop("disabled", false).focus();
    element.off('click', openElement);
    element.find('.header button').click(closeElement);
    element.find('#btn-send-message').click(sendNewMessage);
    messages.scrollTop(messages.prop("scrollHeight"));
    displayElement('#total-chats', notVisible);
}

function closeElement() {
    element.find('.chat').removeClass('enter').hide();
    element.find('>i').show();
    element.removeClass('expand');
    element.find('.header button').off('click', closeElement);
    element.find('#btn-send-message').off('click', sendNewMessage);
    element.find('.text-box').off('keydown', onMetaAndEnter).prop("disabled", true).blur();
    setTimeout(function() {
        element.find('.chat').removeClass('enter').show()
        element.click(openElement);
    }, 500);
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

function sendNewMessage() {
    var chatBox = $('.text-box');
    var chatMessage = chatBox.html();
    var messagesContainer = $('.messages');
    var newMessage = chatMessage.replace(/\<div\>|\<br.*?\>/ig, '\n').replace(/\<\/div\>/g, '').trim().replace(/\n/g, '<br>');
    var chatId = createUUID();
    if (!newMessage) return;
    messagesContainer.append(['<li class="other">', newMessage, '</li>' ].join(''));
    db.collection(chatRef).doc(publicDomain).collection(getUserId).add({
        id: chatId,
        message: chatMessage,
        created_by_email: getUserEmailAddress,
        created_by_name: userFullName,
        created_at: serverDateTime,
        type: public,
        status: 1
    }).catch(function (error) {
        toast(errorDocument + error, error);
    });
    insertLogs(getUserId, userFullName, getUserEmailAddress, getUserPosition, 
               thumbnail, "Sent message - " + chatMessage, active, "CHAT");
    toast("Message successfully delivered!", success);
    chatBox.html('');
    chatBox.focus();
    messagesContainer.finish().animate({
        scrollTop: messagesContainer.prop("scrollHeight")
    }, 250);
}

function onMetaAndEnter(event) {
    if ((event.metaKey || event.ctrlKey) && event.keyCode == 13) {
        sendNewMessage();
    }
}

const populateDashboard = async (doc) => {
    showModal('#modal-loading', show);
    var totalAppointments = 0, totalCollections = 0, viewBtn = "enabled";
    var appData8 = await db.collection(appointmentsRef + timeSlotsDomain + sl + time8AM).where("status", '==', 0).get();
    if (appData8.docs) {
        totalAppointments = appData8.docs.length;
        appData8.docs.forEach(d => {
            const a = d.data();
            let docId = d.id, transactionNumber = a.client_transaction_id, firstName = a.app_first_name, middleName = a.app_middle_name, lastName = a.app_last_name, appointmentKey = a.appointment_key, suffix = a.app_suffix, address = a.app_address, dateBorn = a.app_date_born, age = a.app_age, dateDied = a.app_date_died, gender = a.app_gender, relationship = a.app_relationship, selectedDate = a.app_selected_date, selectedTime = a.app_selected_time, burialWholeBody = a.app_burial_whole_body, paymentMethod = a.app_payment_method, deathCertificateURL = a.app_death_certificate, entrancePermitURL = a.app_entrance_permit, transferPermitURL = a.app_transfer_permit, civilRegistryPSAURL = a.app_civil_registry_psa, burialPermitURL = a.app_burial_permit, clientPaidAmount = a.client_paid_amount, transactionStatus = a.client_transaction_status, clientName = a.client_name, clientUserID = a.client_user_id, dateTimeUpdated = convertSecondsToDateLocal(a.updated_at.seconds), status = a.status;
            totalCollections += parseFloat(clientPaidAmount);
            if (transactionNumber == undefined || transactionNumber == null) {
                transactionNumber = "N/A";
                viewBtn = "disabled";
            }
            if (clientPaidAmount == undefined || clientPaidAmount == null) {
                clientPaidAmount = "N/A";
            }
            if (paymentMethod == undefined || paymentMethod == null) {
                paymentMethod = "N/A";
            }
            $('#admin-transaction-lists').append('<tr><td class="text-center">'+transactionNumber+'</td><td class="text-center">'+clientPaidAmount+'</td><td class="text-center">'+paymentMethod+'</td><td class="text-center">'+transactionStatus+'</td><td class="text-center">'+dateTimeUpdated+'</td><td class="text-center"><a class="btn btn-primary view" onclick="adminViewAppointment(\''+appointmentKey+'\',\''+firstName+'\',\''+middleName+'\',\''+lastName+'\',\''+suffix+'\',\''+address+'\',\''+dateBorn+'\',\''+age+'\',\''+dateDied+'\',\''+gender+'\',\''+relationship+'\',\''+selectedDate+'\',\''+selectedTime+'\',\''+burialWholeBody+'\',\''+paymentMethod+'\',\''+deathCertificateURL+'\',\''+entrancePermitURL+'\',\''+transferPermitURL+'\',\''+civilRegistryPSAURL+'\',\''+burialPermitURL+'\',\''+clientPaidAmount+'\',\''+transactionNumber+'\',\''+transactionStatus+'\',\''+clientName+'\',\''+clientUserID+'\',\''+dateTimeUpdated+'\',\''+status+'\')"><i class="fa fa-eye"></i> &nbsp; VIEW MORE</a></td></tr>');
            // $('#admin-transaction-lists').append('<tr><td class="text-center">'+transactionNumber+'</td><td class="text-center">'+clientPaidAmount+'</td><td class="text-center">'+paymentMethod+'</td><td class="text-center">'+transactionStatus+'</td><td class="text-center">'+dateTimeUpdated+'</td><td class="text-center"><a class="btn btn-primary view" onclick="adminViewAppointment(\''+appointmentKey+'\',\''+firstName+'\',\''+middleName+'\',\''+lastName+'\',\''+suffix+'\',\''+address+'\',\''+dateBorn+'\',\''+age+'\',\''+dateDied+'\',\''+gender+'\',\''+relationship+'\',\''+selectedDate+'\',\''+selectedTime+'\',\''+burialWholeBody+'\',\''+wake100PerDay+'\',\''+urn+'\',\''+priestMassInBurial+'\',\''+pagkabuhayChapel+'\',\''+immaculadaPagasaChapelGrndFlr+'\',\''+priestMassBurialImmaculada+'\',\''+paymentMethod+'\',\''+deathCertificateURL+'\',\''+entrancePermitURL+'\',\''+transferPermitURL+'\',\''+civilRegistryPSAURL+'\',\''+burialPermitURL+'\',\''+clientPaidAmount+'\',\''+transactionNumber+'\',\''+transactionStatus+'\',\''+clientName+'\',\''+clientUserID+'\',\''+dateTimeUpdated+'\',\''+status+'\')"><i class="fa fa-eye" '+viewBtn+'></i> &nbsp; VIEW MORE</a> &nbsp; <a class="btn btn-success" onclick="approveTimeSchedule(\''+appointmentKey+'\',\''+selectedTime+'\',\''+docId+'\')"><i class="fa fa-check"></i> &nbsp; APPROVE TIME SCHEDULE</a></td></tr>');
        });
    }
    var appData9 = await db.collection(appointmentsRef + timeSlotsDomain + sl + time9AM).where("status", '==', 0).get();
    if (appData9.docs) {
        totalAppointments += appData9.docs.length;
        appData9.docs.forEach(d => {
            const a = d.data();
            let docId = d.id, transactionNumber = a.client_transaction_id, firstName = a.app_first_name, middleName = a.app_middle_name, lastName = a.app_last_name, appointmentKey = a.appointment_key, suffix = a.app_suffix, address = a.app_address, dateBorn = a.app_date_born, age = a.app_age, dateDied = a.app_date_died, gender = a.app_gender, relationship = a.app_relationship, selectedDate = a.app_selected_date, selectedTime = a.app_selected_time, burialWholeBody = a.app_burial_whole_body, paymentMethod = a.app_payment_method, deathCertificateURL = a.app_death_certificate, entrancePermitURL = a.app_entrance_permit, transferPermitURL = a.app_transfer_permit, civilRegistryPSAURL = a.app_civil_registry_psa, burialPermitURL = a.app_burial_permit, clientPaidAmount = a.client_paid_amount, transactionStatus = a.client_transaction_status, clientName = a.client_name, clientUserID = a.client_user_id, dateTimeUpdated = convertSecondsToDateLocal(a.updated_at.seconds), status = a.status;
            totalCollections += parseFloat(clientPaidAmount);
            if (transactionNumber == undefined || transactionNumber == null) {
                transactionNumber = "N/A";
                viewBtn = "disabled";
            }
            if (clientPaidAmount == undefined || clientPaidAmount == null) {
                clientPaidAmount = "N/A";
            }
            if (paymentMethod == undefined || paymentMethod == null) {
                paymentMethod = "N/A";
            }
            $('#admin-transaction-lists').append('<tr><td class="text-center">'+transactionNumber+'</td><td class="text-center">'+clientPaidAmount+'</td><td class="text-center">'+paymentMethod+'</td><td class="text-center">'+transactionStatus+'</td><td class="text-center">'+dateTimeUpdated+'</td><td class="text-center"><a class="btn btn-primary view" onclick="adminViewAppointment(\''+appointmentKey+'\',\''+firstName+'\',\''+middleName+'\',\''+lastName+'\',\''+suffix+'\',\''+address+'\',\''+dateBorn+'\',\''+age+'\',\''+dateDied+'\',\''+gender+'\',\''+relationship+'\',\''+selectedDate+'\',\''+selectedTime+'\',\''+burialWholeBody+'\',\''+paymentMethod+'\',\''+deathCertificateURL+'\',\''+entrancePermitURL+'\',\''+transferPermitURL+'\',\''+civilRegistryPSAURL+'\',\''+burialPermitURL+'\',\''+clientPaidAmount+'\',\''+transactionNumber+'\',\''+transactionStatus+'\',\''+clientName+'\',\''+clientUserID+'\',\''+dateTimeUpdated+'\',\''+status+'\')"><i class="fa fa-eye"></i> &nbsp; VIEW MORE</a></td></tr>');
        });
    }
    var appData10 = await db.collection(appointmentsRef + timeSlotsDomain + sl + time10AM).where("status", '==', 0).get();
    if (appData10.docs) {
        totalAppointments += appData10.docs.length;
        appData10.docs.forEach(d => {
            const a = d.data();
            let docId = d.id, transactionNumber = a.client_transaction_id, firstName = a.app_first_name, middleName = a.app_middle_name, lastName = a.app_last_name, appointmentKey = a.appointment_key, suffix = a.app_suffix, address = a.app_address, dateBorn = a.app_date_born, age = a.app_age, dateDied = a.app_date_died, gender = a.app_gender, relationship = a.app_relationship, selectedDate = a.app_selected_date, selectedTime = a.app_selected_time, burialWholeBody = a.app_burial_whole_body, paymentMethod = a.app_payment_method, deathCertificateURL = a.app_death_certificate, entrancePermitURL = a.app_entrance_permit, transferPermitURL = a.app_transfer_permit, civilRegistryPSAURL = a.app_civil_registry_psa, burialPermitURL = a.app_burial_permit, clientPaidAmount = a.client_paid_amount, transactionStatus = a.client_transaction_status, clientName = a.client_name, clientUserID = a.client_user_id, dateTimeUpdated = convertSecondsToDateLocal(a.updated_at.seconds), status = a.status;
            totalCollections += parseFloat(clientPaidAmount);
            if (transactionNumber == undefined || transactionNumber == null) {
                transactionNumber = "N/A";
                viewBtn = "disabled";
            }
            if (clientPaidAmount == undefined || clientPaidAmount == null) {
                clientPaidAmount = "N/A";
            }
            if (paymentMethod == undefined || paymentMethod == null) {
                paymentMethod = "N/A";
            }
            $('#admin-transaction-lists').append('<tr><td class="text-center">'+transactionNumber+'</td><td class="text-center">'+clientPaidAmount+'</td><td class="text-center">'+paymentMethod+'</td><td class="text-center">'+transactionStatus+'</td><td class="text-center">'+dateTimeUpdated+'</td><td class="text-center"><a class="btn btn-primary view" onclick="adminViewAppointment(\''+appointmentKey+'\',\''+firstName+'\',\''+middleName+'\',\''+lastName+'\',\''+suffix+'\',\''+address+'\',\''+dateBorn+'\',\''+age+'\',\''+dateDied+'\',\''+gender+'\',\''+relationship+'\',\''+selectedDate+'\',\''+selectedTime+'\',\''+burialWholeBody+'\',\''+paymentMethod+'\',\''+deathCertificateURL+'\',\''+entrancePermitURL+'\',\''+transferPermitURL+'\',\''+civilRegistryPSAURL+'\',\''+burialPermitURL+'\',\''+clientPaidAmount+'\',\''+transactionNumber+'\',\''+transactionStatus+'\',\''+clientName+'\',\''+clientUserID+'\',\''+dateTimeUpdated+'\',\''+status+'\')"><i class="fa fa-eye"></i> &nbsp; VIEW MORE</a></td></tr>');
        });
    }
    text('#total-appointments', totalAppointments);
    text('#total-collections', '₱ ' + totalCollections.toFixed(2));
    text('#total-logs', totalUserLogs);
    text('#total-users', totalUsers);
    hideProgressModal();
}

function adminViewAppointment(appointmentKey, firstName, middleName, lastName, suffix, address, dateBorn, age, dateDied, gender, relationship,
                              selectedDate, selectedTime, burialWholeBody, paymentMethod,
                              deathCertificateURL, entrancePermitURL, transferPermitURL, civilRegistryPSAURL, burialPermitURL,
                              clientPaidAmount, transactionNumber, transactionStatus, clientName, clientUserID, dateTimeUpdated, status) {
    showModal('#modal-admin-view-appointment', show);
    text('#admin-view-app-last-name', lastName);
    text('#admin-view-app-first-name', firstName);
    text('#admin-view-app-middle-name', middleName);
    text('#admin-view-app-suffix', suffix);
    text('#admin-view-app-address', address);
    text('#admin-view-app-date-born', dateBorn);
    text('#admin-view-app-age', age);
    text('#admin-view-app-date-died', dateDied);
    text('#admin-view-app-gender', gender);
    text('#admin-view-app-relationship', relationship);
    text('#admin-view-app-selected-date', selectedDate);
    text('#admin-view-app-selected-time', selectedTime);
    text('#admin-view-app-burial-whole-body', burialWholeBody);
    text('#admin-view-app-payment-method', paymentMethod);
    text('#admin-view-app-transaction-number', transactionNumber);
    text('#admin-view-app-transaction-status', transactionStatus);
    text('#admin-view-app-paid-date', dateTimeUpdated);
    text('#admin-view-app-payor-name', clientName);
    text('#admin-view-app-total-paid-amount', clientPaidAmount);
    if (deathCertificateURL == none) {
        setImage('#admin-view-app-death-certificate', noImage);
    } else {
        setImage('#admin-view-app-death-certificate', deathCertificateURL);
    }
    if (entrancePermitURL == none) {
        setImage('#admin-view-app-entrance-permit', noImage);
    } else {
        setImage('#admin-view-app-entrance-permit', entrancePermitURL);
    }
    if (transferPermitURL == none) {
        setImage('#admin-view-app-transfer-permit', noImage);
    } else {
        setImage('#admin-view-app-transfer-permit', transferPermitURL);
    }
    if (civilRegistryPSAURL == none) {
        setImage('#admin-view-app-civil-registry-psa', noImage);
    } else {
        setImage('#admin-view-app-civil-registry-psa', civilRegistryPSAURL);
    }
    if (burialPermitURL == none) {
        setImage('#admin-view-app-burial-permit', noImage);
    } else {
        setImage('#admin-view-app-burial-permit', burialPermitURL);
    }
    insertLogs(getUserId, userFullName, getUserEmailAddress, getUserPosition, thumbnail, 
    "Admin View Appointment - (Transaction Number: " + transactionNumber + ")", active, appointment);
}

function approveTimeSchedule(appointmentKey, time, docId) {
    showModal('#modal-admin-approve-time-sched', show);
    text('#appr-selected-time', time);
    text('#appr-transaction-number', appointmentKey);
    $('#btn-appr-time-sched-yes').click(function() {
        db.collection(appointmentsRef).doc(timeSlotsDomain).collection(time).doc(docId).update({
            client_transaction_status: approvedSchedule,
            updated_at: serverDateTime
        }).catch(function (error) {
            toast("Error while creating appointment: " + error, error);
            hideProgressModal();
            return;
        });
        adminApproveSelectedTime = true;
        showModal('#modal-admin-approve-time-sched', hide);
        toast("Appointment Time Schedule is now approved!", success);
    });
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