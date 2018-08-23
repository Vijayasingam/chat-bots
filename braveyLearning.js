exports.init = function (Bravey, nlp) {
    nlp.addIntent("gems_request", [{ entity: "gems_case_req_identifier", id: "gems_type" }, { entity: "gems_case_id", id: "gems_sr_req_id" }]);
    var gems = new Bravey.StringEntityRecognizer("gems_case_req_identifier");
    gems.addMatch("gems", "GEMS");
    gems.addMatch("gems", "gems");
    gems.addMatch("gems", "Gems");
    gems.addMatch("gems", "Service Request");
    gems.addMatch("gems", "GEMS Case");
    nlp.addEntity(gems);
    var gems_sr_nbr = new Bravey.RegexEntityRecognizer("gems_case_id");
    gems_sr_nbr.addMatch(new RegExp("SR-[A-Z]{2}-[0-9]{8}-[A-Z,0-9]{6}", "gi"), function() {return true});
    nlp.addEntity(gems_sr_nbr);
    nlp.addDocument("I want {gems_case_req_identifier} {gems_case_id}", "gems_request");
    nlp.addDocument("Help me with {gems_case_req_identifier} {gems_case_id}", "gems_request");
    nlp.addDocument("Get me {gems_case_req_identifier} case details for {gems_case_id}", "gems_request");
    nlp.addDocument("What is {gems_case_req_identifier} {gems_case_id}", "gems_request");

    nlp.addIntent("deal_pipeline_request", [{ entity: "deal_pipeline_req_identifier", id: "deal_pipeline_type" }, { entity: "deal_id", id: "deal_pipeline_id" }]);
    var deal = new Bravey.StringEntityRecognizer("deal_pipeline_req_identifier");
    deal.addMatch("deal", "Deal");
    deal.addMatch("deal", "deals");
    nlp.addEntity(deal);
    var deal_id_nbr = new Bravey.RegexEntityRecognizer("deal_id");
    deal_id_nbr.addMatch(new RegExp("DEAL-[A-Z]{2}-[0-9]{4}-[0-9]{2}-[0-9]{6}", "gi"), function() {return true});
    nlp.addEntity(deal_id_nbr);
    nlp.addDocument("I want {deal_pipeline_req_identifier} for {deal_id}", "deal_pipeline_request");
    nlp.addDocument("Help me with stage update on {deal_pipeline_req_identifier} {deal_id}", "deal_pipeline_request");
    nlp.addDocument("Get me {deal_pipeline_req_identifier} details for {deal_id}", "deal_pipeline_request");
    nlp.addDocument("What is {deal_pipeline_req_identifier} stage for {deal_id}", "deal_pipeline_request");

    nlp.addIntent("thankYou", []);
    nlp.addDocument("Thank you", "thankYou");
    nlp.addDocument("thanks", "thankYou");
    nlp.addDocument("bye", "thankYou");
    nlp.addDocument("fine", "thankYou");

    nlp.addIntent("askQuery", []);
    nlp.addDocument("Hi hello hey", "askQuery");
    nlp.addDocument("Hey", "askQuery");
    nlp.addDocument("Hello", "askQuery");
    nlp.addDocument("Hi", "askQuery");

    nlp.addIntent("confirmQuery", []);
    nlp.addDocument("yeah", "confirmQuery");
    nlp.addDocument("yes please yep yeah", "confirmQuery");
    nlp.addDocument("yes please");
    nlp.addDocument("yep", "confirmQuery");
    nlp.addDocument("yes", "confirmQuery");

    nlp.addIntent("ccr_status_request", [{ entity: "ccr_status_req_identifier", id: "ccr_type" }]);
    var ccr = new Bravey.StringEntityRecognizer("ccr_status_req_identifier");
    ccr.addMatch("ccr", "CCR");
    ccr.addMatch("ccr", "ccr");
    ccr.addMatch("ccr", "Conflicts Clearance");
    nlp.addEntity(ccr);
    nlp.addDocument("I want {ccr_status_req_identifier}", "ccr_status_request");
    nlp.addDocument("Help me with {ccr_status_req_identifier} status", "ccr_status_request");
    nlp.addDocument("Get me {ccr_status_req_identifier} details", "ccr_status_request");
    nlp.addDocument("What is {ccr_status_req_identifier} stage", "ccr_status_request");

    nlp.addIntent("doc_details_request", [{ entity: "doc_details_req_identifier", id: "document_type" }]);
    var document = new Bravey.StringEntityRecognizer("doc_details_req_identifier");
    document.addMatch("document", "document");
    document.addMatch("document", "Document");
    document.addMatch("document", "Deal Document");
    document.addMatch("document", "Deal Documents");
    document.addMatch("document", "Deal Docs");
    document.addMatch("document", "Docs");
    document.addMatch("document", "docs");
    nlp.addEntity(document);
    nlp.addDocument("I want pending {doc_details_req_identifier}", "doc_details_request");
    nlp.addDocument("Help me with {doc_details_req_identifier} required list", "doc_details_request");
    nlp.addDocument("Get me {doc_details_req_identifier} pending details", "doc_details_request");
    nlp.addDocument("What are the {doc_details_req_identifier} pending", "doc_details_request");

    nlp.addIntent("recent_complaints", [{ entity: "recent_comp_req_identifier", id: "rec_comp_type" }]);
    var rcnt_comp = new Bravey.StringEntityRecognizer("recent_comp_req_identifier");
    rcnt_comp.addMatch("rcnt_comp", "Recent Complaints");
    rcnt_comp.addMatch("rcnt_comp", "latest complaints");
    rcnt_comp.addMatch("rcnt_comp", "SR");
    rcnt_comp.addMatch("rcnt_comp", "Compliant");
    rcnt_comp.addMatch("rcnt_comp", "Recent Compliant");
    nlp.addEntity(rcnt_comp);
    nlp.addDocument("I want {recent_comp_req_identifier}", "recent_complaints");
    nlp.addDocument("Help me with {recent_comp_req_identifier}", "recent_complaints");
    nlp.addDocument("Get me {recent_comp_req_identifier} from the client", "recent_complaints");
    nlp.addDocument("What is {recent_comp_req_identifier} by this client", "recent_complaints");
    
    console.log(nlp.test("Get me GEMS case details for SR-AE-20170909-TD1231"));
    console.log(nlp.test("What is the Deal stage for DEAL-XY-2022-22-222000"));
    console.log(nlp.test("Help me with Conflicts Clearance"));
    console.log(nlp.test("What are the docs pending to be uploaded for closure"));
    console.log(nlp.test("Hello"));
    console.log("*****************************");
    console.log(nlp.test("Yeah"));
    console.log("*****************************");
    console.log(nlp.test("yep"));
    console.log("*****************************");
    console.log(nlp.test("yes"));
    console.log("*****************************");
    console.log(nlp.test("Yes please"));
    console.log(nlp.test("what is the recent complaint raised by this client"))
}
