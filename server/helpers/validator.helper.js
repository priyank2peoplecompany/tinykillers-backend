const { Validator } = require('node-input-validator');
/** 
 * This Function will validate the "fields" against the "validators" in 2 parts
 * 1. it will check for any missing fields
 * 2. if all fields are available then check for the data types
 * 
 * res : to send the response if any error found
 * validators : rules to check the validation
 * fields : fields that we get from the client side
 */
exports.validate = ( res , validators , fields ) => {
    var returnRes = { 'status' : false , message : '' , 'data' : [] };
    var missingFields = [];

   //------------- Start : Missing fields validations ---------------- //
    for(key in validators)
    {
        if(!fields[key] && fields[key] != 0  && validators[key].indexOf('optional') == -1 )
        {
            missingFields.push(key)
        }
    }

    if(missingFields.length > 0) {
        returnRes.status = false;
        returnRes.data = missingFields;
        returnRes.message = "Missing Fields : Please send proper fields";
        cres.vfaild(res , returnRes);
        return false;
    }
    else{
        let v = new Validator(fields,validators);
        v.check().then(function (matched) {
            if(!matched){
                returnRes.status = false;
                returnRes.data = v.errors;
                returnRes.message = "Validation error";
                cres.vfaild(res , returnRes);
                return false;
            }             
        });
    }
    return true;   
}