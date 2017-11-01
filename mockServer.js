exports.callReportData = function (req, res) {
    res.send({
        "callDate": "10 Jul 2017",
        "callSubject": "Sales Discussion",
        "companyName": "XYZ Corp.",
        "callType": "Multi-Purpose",
        "status": "Completed"
    });
}
exports.gemsData = function (req, res) {
    if (req.params.id === "SR-AE-20170909-TD1231") {
        res.send({
            "error": false,
            "name": "XYZ Corp.",
            "productGroup": "Money Management",
            "classification": "Complaint",
            "createdDate": "09 Sep 2017",
            "status": "Overdue",
            "queryType": "Account Opening / Closing Related",
            "lastUpdatedBy": "12345678 - LName, FName"
        });
    } else {
        res.send({
            "error": true,
            "errorMessage": "No Case found. Please search for some other Case ID."
        });
    }
}
exports.COBData = function (req, res) {
    res.send({
        "customerName": "XYZ Corp",
        "status":"In-Progress"
    });
}
exports.dealData = function (req, res) {
    res.send({
        "dealName": "XYZ Deal",
        "stage": "Marketing"
    });
}
