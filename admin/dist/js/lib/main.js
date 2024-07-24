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
            status: unpaid,
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
    redirectURL = "commission.html",
    positionUser = regularUser;

    if (getUserPosition == adminUser) {
        positionUser = adminUser;
        redirectURL = "commissions.html";
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
            status: unpaid,
            created_at: serverDateTime
        }).catch(function (e) {
            toast(e.message, error);
            hideProgressModal();
            return;
        });
        emptyInputText(['#commission-name','#commission-age','#commission-country','#commission-payment-method','#commission-payment-number','#commission-email','#commission-discord','#commission-facebook','#commission-twitter','#commission-instagram','#commission-twitch','#commission-type','#commission-upload-files','#commission-add-link','#commission-extra-information']);
        setTimeout(function() {
            hideProgressModal();
            window.location.href = redirectURL
        }, 5000);
    }
});

$('#btn-add-commission-cms').click(async function() {
    showModal('#modal-add-commissions-cms', show);
    $('#btn-submit-commissions-cms').click(async function() {
        showModal('#modal-add-commissions-cms', hide);
        showModal('#modal-loading', show);
        text('#loading-message-data', "Uploading and creating new commission data...");
        var commissionCmsName = e,
        commissionCmsDescription = e,
        commissionCmsPrice = e;

        commissionCmsName = $('#commission-cms-name').val();
        commissionCmsDescription = $('#commission-cms-description').val();
        commissionCmsPrice = $('#commission-cms-price').val();
        var commissionCmsImageFile = $('#commission-cms-image-file')[0].files[0];
        
        if (!commissionCmsName || !commissionCmsDescription || 
            !commissionCmsPrice || commissionCmsImageFile == undefined
        ) {
            hideProgressModal();
            toast(requiredMsg, warning);
        } else {
            let uploadingImage = storageReference.child(commissionsRef + images + commissionCmsImageFile.name).put(commissionCmsImageFile);
            uploadingImage.on('state_changed', function(data) {
                toast(uploading + commissionCmsName + " image...", info);
            }, function(err) {
                toast(err, error);
                return;
            }, function() {
                uploadingImage.snapshot.ref.getDownloadURL().then(function(commissionCmsImageURL) {
                    toast("Added new Commission! " + successMsg, success);
                    db.collection(commissionsRef).doc(commissionsDomain).collection(cmsRef).add({
                        commission_cms_id: uuidv4(),
                        commission_cms_name: commissionCmsName,
                        commission_cms_price: commissionCmsPrice,
                        commission_cms_description: commissionCmsDescription,
                        commission_cms_image_url: commissionCmsImageURL,
                        type: "Created by " + getUserEmailAddress,
                        is_active: true,
                        created_at: serverDateTime
                    }).catch(function (e) {
                        toast(e.message, error);
                        hideProgressModal();
                        return;
                    });
                    emptyInputText(['#commission-cms-name','#commission-cms-price','#commission-cms-description','#commission-cms-image-file']);
                    setTimeout(function() {
                        hideProgressModal();
                        window.location.href = 'commissions-cms.html'
                    }, 6500);
                });
            });
        }
    });
});

const getCommissions = async (doc) => {
    showModal('#modal-loading', show);
    var values = await db.collection(commissionsRef + commissionsDomain + sl + entryRef).get(); //.where("status", '==', 1).get();
    var requestsCommissions = await db.collection(commissionsRef + commissionsDomain + sl + entryRef).where("status", '==', "UNPAID").get();
    var cmsCommissions = await db.collection(commissionsRef + commissionsDomain + sl + cmsRef).get();
    var totalCommissions = values.docs.length;
    var totalRequestsCommissions = requestsCommissions.docs.length;
    text('#display-total-commissions', totalCommissions);
    text('#display-total-requests', totalRequestsCommissions);
    var statusColor = "color: red;";
    values.docs.forEach(v => {
        let data= v.data();
        let docId = v.id;
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
        if (status == paid) {
            statusColor = "color: green;";
        } else if (status == invoice) {
            statusColor = "color: blue;";
        }
        $('#commission-lists').append('<tr><td class="text-center">'+dateTimeCreated+'</td><td class="text-center">'+commissionUserName+'</td><td class="text-center">'+commissionCountry+'</td><td class="text-center">'+commissionEmail+'</td><td class="text-center">'+commissionType+'</td><td class="text-center"><span style="'+statusColor+'">'+status+'</span></td><td class="text-center"><button class="btn btn-primary text-white" onclick="viewCommission(\''+commissionType+'\',\''+commissionUserName+'\',\''+commissionAge+'\',\''+commissionCountry+'\',\''+commissionPaymentMethod+'\',\''+commissionEmail+'\',\''+commissionDiscord+'\',\''+commissionFacebook+'\',\''+commissionTwitter+'\',\''+commissionInstagram+'\',\''+commissionTwitch+'\',\''+commissionAddLink+'\',\''+commissionExtraInfo+'\')"><i class="fa fa-eye"></i> VIEW MORE</button></td></tr>');
        $('#financial-commission-lists').append('<tr><td class="text-center">'+dateTimeCreated+'</td><td class="text-center">'+commissionUserName+'</td><td class="text-center">'+commissionUserName+'</td><td class="text-center">'+commissionEmail+'</td><td class="text-center">'+commissionType+'</td><td class="text-center"><span style="'+statusColor+'">'+status+'</span></td><td class="text-center"><select class="form-control" id="financial-payment-status-selection" onchange="updateFinancialCommissionPayment(\''+docId+'\',\''+commissionType+'\')"><option disabled selected>--Select Payment Status--</option><option value="'+paid+'">'+paid+'</option><option value="'+unpaid+'">'+unpaid+'</option><option value="'+invoice+'">'+invoice+'</option></select></td></tr>');
        hideProgressModal();
        if (currentPage == financialPage) {
            $('#dt-financial-lists').DataTable({
                "responsive": true,
                "paging": true,
                "searching": true,
                "lengthChange": false,
                "autoWidth": false,
                "bDestroy": true,
                "buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"]
            }).buttons().container().appendTo('#dt-financial-lists_wrapper .col-md-6:eq(0)');
        }
    });
    cmsCommissions.docs.forEach(v => {
        let data= v.data();
        let docId = v.id;
        let commissionId = data.commission_cms_id;
        let commissionName = data.commission_cms_name;
        let commissionPrice = data.commission_cms_price;
        let commissionDescription = data.commission_cms_description;
        let commissionImageURL = data.commission_cms_image_url;
        let commissionDateTimeCreated = convertSecondsToDateLocal(data.created_at.seconds);
        $('#commissions-cms-list').append('<tr><td class="text-center"><img src="'+commissionImageURL+'" width="100" height="80"></td><td class="text-center">'+commissionName+'</td><td class="text-center">'+commissionDescription+'</td><td class="text-center">'+commissionPrice+'</td><td class="text-center">'+commissionDateTimeCreated+'</td><td class="text-center"><button class="btn btn-primary text-white" onclick="viewCommissionCMS(\''+docId+'\',\''+commissionId+'\',\''+commissionName+'\',\''+commissionPrice+'\',\''+commissionDescription+'\',\''+commissionImageURL+'\',\''+commissionDateTimeCreated+'\')"><i class="fa fa-eye"></i> VIEW MORE</button></td></tr>');
        $('#commissions-container-lists').append('<h2 class="mbr-section-title align-center pb-3 mbr-fonts-style display-2">'+commissionName+'</h2><div class="media-container-row mt-5 pt-3" style="margin-bottom: 250px;"><div class="mbr-figure" style="width: 60%;"><img src="'+commissionImageURL+'" alt="milkywaydraws" media-simple="true"></div><div class="tabs-container"><div class="tab-content"><div id="tab1" class="tab-pane in active" role="tabpanel"><div class="row"><div class="col-md-12"><label class="mbr-section-title align-center display-5">₱ '+commissionPrice+'</label></div><div class="col-md-12"><p class="mbr-text py-5 mbr-fonts-style display-7">'+commissionDescription+'</p></div></div></div></div><ul class="nav nav-tabs" role="tablist"><li class="nav-item"><a class="nav-link mbr-fonts-style active" role="tab" data-toggle="tab" href="#" aria-expanded="true" onclick="redirectCommission(\''+commissionName+'\')">Commission</a></li></ul> <br> <br></div></div><br><br>');
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

function viewCommissionCMS(docId, commissionCmsId, commissionName, commissionPrice, commissionDescription, commissionImageURL, commissionDateTimeCreated) {
    showModal('#modal-view-commission-cms', show);
    inputText('#update-commission-cms-name', commissionName);
    inputText('#update-commission-cms-price', commissionPrice);
    inputText('#update-commission-cms-description', commissionDescription);
    setImage('#display-cms-update-commission-image', commissionImageURL);
    $('#btn-submit-update-commission').click(function() {
        showModal('#modal-loading', show);
        var commissionCmsName = e,
        commissionCmsDescription = e,
        commissionCmsPrice = e;
        commissionCmsName = $('#update-commission-cms-name').val();
        commissionCmsDescription = $('#update-commission-cms-description').val();
        commissionCmsPrice = $('#update-commission-cms-price').val();
        var commissionCmsImageFile = $('#update-commission-cms-image-file')[0].files[0];
        if (!commissionCmsName || !commissionCmsDescription || !commissionCmsPrice) {
            hideProgressModal();
            toast(requiredMsg, warning);
        } else {
            showModal('#modal-view-commission-cms', hide);
            if (commissionCmsImageFile == undefined) {
                return updateCommission(docId, commissionCmsName, commissionCmsPrice, commissionCmsDescription, commissionImageURL);
            }
            let uploadingImage = storageReference.child(commissionsRef + images + commissionCmsImageFile.name).put(commissionCmsImageFile);
            uploadingImage.on('state_changed', function(data) {
                toast(uploading + commissionCmsName + " image...", info);
            }, function(err) {
                toast(err, error);
                return;
            }, function() {
                uploadingImage.snapshot.ref.getDownloadURL().then(function(updatedCommissionURL) {
                    updateCommission(docId, commissionCmsName, commissionCmsPrice, commissionCmsDescription, updatedCommissionURL);
                });
            });
        }
    });
    $('#btn-delete-commission').click(function() {
        showModal('#modal-comission-delete', show);
        showModal('#modal-view-commission-cms', hide);
        text('#modal-header-title-delete', 'Warning: Delete Commission');
        text('#modal-message-delete', deleteMsg + commissionName);
        $('#btn-submit-cms-commission-delete').click(async function() {
            showModal('#modal-comission-delete', hide);
            showModal('#modal-loading', show);
            const doc = await db.collection(commissionsRef + commissionsDomain + sl + cmsRef).where('commission_cms_id', '==', commissionCmsId).get();
            doc.forEach(element => {
                element.ref.delete();
                toast("Successfully Deleted " + commissionName + "!", error);
                setTimeout(function() {
                    hideProgressModal();
                    reloadPage('commissions-cms.html');
                }, 3000);
            });
            setTimeout(function() {
                hideProgressModal();
            }, 10000);
        });
    });
}

function updateCommission(docId, commissionName, commissionPrice, commissionDescription, commissionImage) {
    db.collection(commissionsRef).doc(commissionsDomain).collection(cmsRef).doc(docId).update({
        commission_cms_name: commissionName,
        commission_cms_price: commissionPrice,
        commission_cms_description: commissionDescription,
        commission_cms_image_url: commissionImage,
        is_active: true,
        updated_at: serverDateTime
    }).catch(function (e) {
        toast(e.message, error);
        hideProgressModal();
        return;
    });
    toast("Updated new Commission!", success);
    setTimeout(function() {
        hideProgressModal();
        window.location.href = 'commissions-cms.html'
    }, 3000);
}

function updateFinancialCommissionPayment(docId, commissionType) {
    $(document.body).on('change',"#financial-payment-status-selection",function (v) {
        var paymentSelected = $("#financial-payment-status-selection option:selected").val();
        console.log('paymentSelected ->', paymentSelected);
        showModal('#modal-financial-payment-update', show);
        text('#update-selected-commission-name', commissionType);
        text('#selected-action-payment', paymentSelected);
        $("#btn-submit-update-financial-payment").click(function() {
            showModal('#modal-financial-payment-update', hide);
            showModal('#modal-loading', show);
            db.collection(commissionsRef).doc(commissionsDomain).collection(entryRef).doc(docId).update({
                status: paymentSelected,
                updated_at: serverDateTime
            }).catch(function (e) {
                toast(e.message, error);
                hideProgressModal();
                return;
            });
            toast("Updated payment!", success);
            setTimeout(function() {
                hideProgressModal();
                window.location.href = financialPage;
            }, 3000);
        });
    });
}

function redirectCommission(commissionName) {
    showModal('#modal-read-terms-condition', show);
    $('#btn-agree-terms-condition').click(function() {
        showModal('#modal-info', show);
        if ($("#accept-terms-service").is(':checked')) {
            window.location.href = "commission-form.html";
        } else {
            showModal('#modal-read-terms-condition', hide);
            text('#modal-header-title', warningLabel);
            text('#modal-message', checkRequiredMsg);
        }
    });
    $('#btn-info-ok').click(function() {
        showModal('#modal-info', hide);
        showModal('#modal-read-terms-condition', show);
    });
};