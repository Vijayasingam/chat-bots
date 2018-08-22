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
            "lastUpdatedBy": "1109908 - Joe, John"
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
        "dealName": "XYZ Transit",
        "stage": "Marketing"
    });
}
exports.dealCCRStatus = function (req, res) {
    res.send({
        "dealName": "XYZ Transit",
        "ccrStatus": "Business Input Required"
    });
}
exports.documentDetails = function (req, res) {
    res.send({
        "doc1": "HOS Sheet",
        "doc2": "FATCA Report"
    });
}
