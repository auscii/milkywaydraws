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
            status: "Pending",
            created_at: serverDateTime
        }).catch(function (e) {
            toast(e.message, error);
            return;
        });
        emptyInputText(['#commission-user-name','#commission-country','#commission-email-address','#commission-name']);
    }
});

const getCommissions = async (doc) => {
    showModal('#modal-loading', show);
    var values = await db.collection(commissionsRef + commissionsDomain + sl + entryRef).get(); //.where("status", '==', 1).get();
    // console.log("getCommissions total ->", values.docs.length);
    values.docs.forEach(v => {
        let data= v.data();
        let status = data.status;
        let commissionUserName = data.name;
        let commissionEmail = data.email_address;
        let commissionName = data.commission_name;
        let commissionCountry = data.commission_country;
        let dateTimeCreated = convertSecondsToDateLocal(data.created_at.seconds);
        $('#commission-lists').append('<tr><td class="text-center">'+dateTimeCreated+'</td><td class="text-center">'+commissionUserName+'</td><td class="text-center">'+commissionCountry+'</td><td class="text-center">'+commissionEmail+'</td><td class="text-center">'+commissionName+'</td><td class="text-center">'+status+'</td></tr>');
        hideProgressModal();
    });
}