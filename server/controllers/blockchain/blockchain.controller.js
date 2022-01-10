const Web3 = require('web3');
const ABI = require('./abi.json');
const contractAddress = "0xd1CB114121B625e43678a8559bF1CcB9E6BfB39d"; // process.env.CONTRACT_ADDRESS
const admin = "0x5c35a1bD6A11796cFA10A016CFaF63D28211ac66"; // process.env.ADMIN_WALLET_ADDRESS
const web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/5f91047883914bbcb987f2381cf5a8d7")); // process.env.INFURA_ETH_PROVIDER
web3.eth.accounts.wallet.add("8659d37f93c99e563a203ceafa0e7b6b34ccaa9960fb793562aa0580eed76932");// process.env.ADMIN_WALLET_KEY
const contract = new web3.eth.Contract(ABI, contractAddress);


/**
 * @api {post} /blockchain/remove-whitelist-users Remove Users From whitelist
 * @apiName removeAddressesFromWhitelist 
 * @apiGroup blockchain
 * @apiParam {array}   removeaddresses    remove wallet adddresses
 * */
exports.removeAddressesFromWhitelist = async (req, res) => {
    try {
        const required_fields = {
            adddresses: 'array',
        }
        let params = req.body;
        if (vh.validate(res, required_fields, params)) {
            const estimatedGas = await contract.methods.removeAddressesFromWhitelist(params.adddresses).estimateGas({ from: admin });
            contract.methods.removeAddressesFromWhitelist(params.adddresses).send({ from: admin, gas: estimatedGas }).on('transactionHash', function(hash) {
                    cres.send(res, hash, "removeAddressesFromWhitelist transactionHash");
                })
                .on('error', function(error, receipt) {
                    cres.error(res, "Error in removeAddressesFromWhitelist", error);
                });
        }
    } catch (e) {
        cres.error(res, "Error in removeAddressesFromWhitelist", e);
    }
}

/**
 * @api {post} /blockchain/remove-whitelist-user Remove User From whitelist
 * @apiName removeAddressFromWhitelist 
 * @apiGroup blockchain
 * @apiParam {string}   address    wallet address
 * */
exports.removeAddressFromWhitelist = async (req, res) => {
    try {
        const required_fields = {
            address: 'string',
        }
        let params = req.body;
        if (vh.validate(res, required_fields, params)) {
            const estimatedGas = await contract.methods.removeAddressFromWhitelist(params.address).estimateGas({ from: admin });
            contract.methods.removeAddressFromWhitelist(params.address).send({ from: admin, gas: estimatedGas }).on('transactionHash', function(hash) {
                    cres.send(res, hash, "removeAddressFromWhitelist transactionHash");
            })
            .on('error', function(error, receipt) {
                cres.error(res, "Error in removeAddressFromWhitelist", error);
            });
        }
    } catch (e) {
        cres.error(res, "Error in removeAddressFromWhitelist", e);
    }
}

/**
 * @api {post} /blockchain/whitelist-users Add Users to whitelist
 * @apiName addAddressesToWhitelist 
 * @apiGroup blockchain
 * @apiParam {array}   adddresses    wallet adddresses
 * */
exports.addAddressesToWhitelist = async (req, res) => {
    try {
        const required_fields = {
            adddresses: 'array',
        }
        let params = req.body;
        if (vh.validate(res, required_fields, params)) {
            const estimatedGas = await contract.methods.addAddressesToWhitelist(params.adddresses).estimateGas({ from: admin });
            contract.methods.addAddressesToWhitelist(params.adddresses).send({ from: admin, gas: estimatedGas }).on('transactionHash', function(hash) {
                    cres.send(res, hash, "addAddressesToWhitelist transactionHash");
            })
            .on('error', function(error, receipt) {
                cres.error(res, "Error in addAddressesToWhitelist", error);
            });
        }
    } catch (e) {
        cres.error(res, "Error in addAddressesToWhitelist", e);
    }
}

/**
 * @api {post} /blockchain/whitelist-user Add User to whitelist
 * @apiName addAddressToWhitelist 
 * @apiGroup blockchain
 * @apiParam {string}   address    wallet address
 * */
exports.addAddressToWhitelist = async (req, res) => {
    const required_fields = {
        address: 'string',
    }
    let params = req.body;
    if (vh.validate(res, required_fields, params)) {
        const estimatedGas = await contract.methods.addAddressToWhitelist(params.address).estimateGas({ from: admin });
        contract.methods.addAddressToWhitelist(params.address).send({ from: admin, gas: estimatedGas }).on('transactionHash', function(hash) {
                cres.send(res, hash, "addAddressToWhitelist transactionHash");
        })
        .on('error', function(error, receipt) {
            cres.error(res, "Error in addAddressToWhitelist", error);
        });
    }
}

/**
 * @api {get} /blockchain/is-user-whitelist Check User is Whitelisted or not
 * @apiName whitelist
 * @apiGroup blockchain
 * */
exports.whitelist = async (req, res) => {
    try {
        //console.log(contract.methods)
        const result = await contract.methods.whitelist(req.body.address).call();
        cres.send(res, { "status": result }, "whitelist reponse");
    } catch (e) {
        cres.error(res, "Error in quiz list", e);
    }
}