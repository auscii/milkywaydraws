$('#btn-request-commission').click(function() {
    var commissionUserName = e, commissionCountry = e, commissionEmailAddress = e, commissionName = e;

    commissionUserName = $('#commission-user-name').val();
    commissionCountry = $('#commission-country').val();
    commissionEmailAddress = $('#commission-email-address').val();
    commissionName = $('#commission-name').val();
    
    if (!commissionUserName || !commissionCountry || !commissionEmailAddress || !commissionName) {
        toast(requiredMsg, warning);
    } else {
        toast(successMsg, success);
        db.collection(commissionsRef).doc(commissionsDomain).collection(entryRef).add({
            entry_id: uuidv4(),
            name: commissionUserName,
            email_address: commissionEmailAddress,
            position: adminUser,
            commission_name: commissionName,
            commission_country: commissionCountry,
            type: "Created by " + adminUser,
            status: pending,
            created_at: serverDateTime
        }).catch(function (e) {
            toast(e.message, error);
            return;
        });
        emptyInputText(['#commission-user-name','#commission-country','#commission-email-address','#commission-name']);
    }
});

$('#btn-submit-request-commission-form, #btn-submit-request-commission-form-admin').click(function() {
    showModal('#modal-loading', show);
    
    var commissionUserName = e,
    commissionUserAge = e,
    commissionCountry = e,
    commissionPaymentMethod = e,
    commissionPaymentNumber = e,
    commissionEmail = e,
    commissionDiscord = e,
    commissionFacebook = e,
    commissionTwitter = e,
    commissionInstagram = e,
    commissionTwitch = e,
    commissionType = e,
    commissionUploadFile = e,
    commissionAddLink = e,
    commissionExtraInformation = e,
    positionUser = regularUser;

    if (getUserPosition == adminUser) {
        positionUser = adminUser;
    }

    commissionUserName = $('#commission-name').val();
    commissionUserAge = $('#commission-age').val();
    commissionCountry = $('#commission-country').val();
    commissionPaymentMethod = $('#commission-payment-method').val();
    commissionPaymentNumber = $('#commission-payment-number').val();
    commissionEmail = $('#commission-email').val();
    commissionDiscord = $('#commission-discord').val();
    commissionFacebook = $('#commission-facebook').val();
    commissionTwitter = $('#commission-twitter').val();
    commissionInstagram = $('#commission-instagram').val();
    commissionTwitch = $('#commission-twitch').val();
    commissionType = $('#commission-type').val();
    commissionUploadFile = $('#commission-upload-files').val();
    commissionAddLink = $('#commission-add-link').val();
    commissionExtraInformation = $('#commission-extra-information').val();
    // commissionAAAAAAAA = $('#commission-aaaaa').val();
    
    if (!commissionUserName || !commissionUserAge || !commissionCountry ||
        !commissionPaymentMethod || !commissionPaymentNumber || !commissionEmail ||
        !commissionDiscord || !commissionFacebook || !commissionTwitter ||
        !commissionInstagram || !commissionTwitch || !commissionType || !commissionExtraInformation
    ) {
        hideProgressModal();
        toast(requiredMsg, warning);
    } else {
        toast("Added new commission. " + successMsg, success);
        db.collection(commissionsRef).doc(commissionsDomain).collection(entryRef).add({
            entry_id: uuidv4(),
            name: commissionUserName,
            commission_age: commissionUserAge,
            commission_country: commissionCountry,
            commission_payment_method: commissionPaymentMethod,
            commission_payment_number: commissionPaymentNumber,
            commission_email_address: commissionEmail,
            commission_discord: commissionDiscord,
            commission_facebook: commissionFacebook,
            commission_twitter: commissionTwitter,
            commission_instagram: commissionInstagram,
            commission_twitch: commissionTwitch,
            commission_type: commissionType,
            commission_upload_file: commissionUploadFile,
            commission_add_link: commissionAddLink,
            commission_extra_information: commissionExtraInformation,
            position: positionUser,
            type: "Created by " + commissionUserName,
            status: pending,
            created_at: serverDateTime
        }).catch(function (e) {
            toast(e.message, error);
            hideProgressModal();
            return;
        });
        emptyInputText(['#commission-name','#commission-age','#commission-country','#commission-payment-method','#commission-payment-number','#commission-email','#commission-discord','#commission-facebook','#commission-twitter','#commission-instagram','#commission-twitch','#commission-type','#commission-upload-files','#commission-add-link','#commission-extra-information']);
        setTimeout(function() {
            hideProgressModal();
            var redirectURL = "commission.html";
            if (positionUser == adminUser) {
                redirectURL = "commissions.html";
            }
            window.location.href = redirectURL
        }, 5000);
    }
});

const getCommissions = async (doc) => {
    showModal('#modal-loading', show);
    var values = await db.collection(commissionsRef + commissionsDomain + sl + entryRef).get(); //.where("status", '==', 1).get();
    var requestsCommissions = await db.collection(commissionsRef + commissionsDomain + sl + entryRef).where("status", '==', "PENDING").get();
    var totalCommissions = values.docs.length;
    var totalRequestsCommissions = requestsCommissions.docs.length;
    text('#display-total-commissions', totalCommissions)
    text('#display-total-requests', totalRequestsCommissions)
    values.docs.forEach(v => {
        let data= v.data();
        let status = data.status;
        let commissionUserName = data.name;
        let commissionEmail = data.commission_email_address;
        let commissionType = data.commission_type;
        let commissionAge = data.commission_age;
        let commissionCountry = data.commission_country;
        let commissionPaymentMethod = data.commission_payment_method;
        let commissionDiscord = data.commission_discord;
        let commissionExtraInfo = data.commission_extra_information;
        let commissionFacebook = data.commission_facebook;
        let commissionInstagram = data.commission_instagram;
        let commissionPaymentNumber = data.commission_payment_number;
        let commissionTwitch = data.commission_twitch;
        let commissionTwitter = data.commission_twitter;
        let commissionUploadFile = data.commission_upload_file;
        let commissionAddLink = data.commission_add_link;
        let commissionPosition = data.position;
        let dateTimeCreated = convertSecondsToDateLocal(data.created_at.seconds);
        $('#commission-lists').append('<tr><td class="text-center">'+dateTimeCreated+'</td><td class="text-center">'+commissionUserName+'</td><td class="text-center">'+commissionCountry+'</td><td class="text-center">'+commissionEmail+'</td><td class="text-center">'+commissionType+'</td><td class="text-center">'+status+'</td><td class="text-center"><button class="btn btn-primary text-white" onclick="viewCommission(\''+commissionType+'\',\''+commissionUserName+'\',\''+commissionAge+'\',\''+commissionCountry+'\',\''+commissionPaymentMethod+'\',\''+commissionEmail+'\',\''+commissionDiscord+'\',\''+commissionFacebook+'\',\''+commissionTwitter+'\',\''+commissionInstagram+'\',\''+commissionTwitch+'\',\''+commissionAddLink+'\',\''+commissionExtraInfo+'\')"><i class="fa fa-eye"></i> VIEW MORE</button></td></tr>');
        hideProgressModal();
    });
    setTimeout(function() {
        hideProgressModal();
    }, 10000);
}

function viewCommission(
    commissionType, commissionUserName, commissionAge, commissionCountry,
    commissionPaymentMethod, commissionEmail, commissionDiscord,
    commissionFacebook, commissionTwitter, commissionInstagram,
    commissionTwitch, commissionAddLink, commissionExtraInfo
) {
    showModal('#modal-view-commission', show);
    text('#selected-commission-name', commissionType);
    text('#display-commission-name', commissionUserName);
    text('#display-commission-age', commissionAge);
    text('#display-commission-country', commissionCountry);
    text('#display-commission-payment-method', commissionPaymentMethod);
    text('#display-commission-email', commissionEmail);
    text('#display-commission-discord', commissionDiscord);
    text('#display-commission-facebook', commissionFacebook);
    text('#display-commission-twitter', commissionTwitter);
    text('#display-commission-instagram', commissionInstagram);
    text('#display-commission-twitch', commissionTwitch);
    text('#display-commission-type', commissionType);
    text('#display-commission-add-link', commissionAddLink);
    text('#display-commission-extra-info', commissionExtraInfo);
    $('#btn-delete-commission').click(function() {
        showModal('#modal-view-commission', hide);
        showModal('#modal-info-delete', show);
        text('#modal-header-title-delete', 'Warning: Delete Commission');
        text('#modal-message-delete', deleteMsg + commissionType);
        $('#btn-submit-commission-delete').click(async function() {
            showModal('#modal-loading', show);
            showModal('#modal-info-delete', hide);
            const doc = await db.collection(commissionsRef + commissionsDomain + sl + entryRef).where('commission_type', '==', commissionType).get();
            doc.forEach(element => {
                element.ref.delete();
                toast("Successfully Deleted " + commissionType + "!", error);
                setTimeout(function() {
                    hideProgressModal();
                    reloadPage(commissionsURL);
                }, 3000);
            });
            setTimeout(function() {
                hideProgressModal();
            }, 10000);
        });
    });
}