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
    res.send({
        "name": "XYZ Corp.",
        "productGroup": "Money Management",
        "classification": "Complaint",
        "createdDate": "09 Sep 2017",
        "status": "Overdue"
    });
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
