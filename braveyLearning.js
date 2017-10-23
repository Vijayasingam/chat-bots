exports.init = function (Bravey, nlp) {
    nlp.addIntent("gems_request", [{ entity: "gems_case_req_identifier", id: "gems_type" }, { entity: "gems_case_id", id: "gems_sr_req_id" }]);
    var gems = new Bravey.StringEntityRecognizer("gems_case_req_identifier");
    gems.addMatch("gems", "GEMS");
    gems.addMatch("gems", "gems");
    gems.addMatch("gems", "Gems");
    gems.addMatch("gems", "Service Request");
    gems.addMatch("gems", "Compliant");
    gems.addMatch("gems", "GEMS Compliant");
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
    
    console.log(nlp.test("Get me GEMS case details for SR-AE-20170909-TD1231"));
    console.log(nlp.test("What is the Deal stage for DEAL-XY-2022-22-222000"));
}
