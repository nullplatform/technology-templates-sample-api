const MAX_DEPTH = 20;

class NestedError extends Error {
    constructor(message, nestedError) {
        super();
        this.message = message;
        this.nestedError = nestedError;
    }

    originalError(i=0){
        if(i >= MAX_DEPTH)
            throw new Error("nestedErrors loop.");

        if(this.nestedError instanceof NestedError)
            return this.nestedError.originalError(i+1);
        else
            return this.nestedError;
    }
}

let tx = async (txName, operation, errMsg) => {
    let start= Date.now();
    let ex;
    let log = {};
    let logFn = (key, value) => {
        log[key] = value;
    };
    try {
        return await operation(logFn);
    } catch (e) {
        ex = e;
        let msg = errMsg?errMsg(): `Error in operation ${JSON.stringify({...log, tx_name: txName})} `;
        throw new NestedError(msg, e);
    } finally {
        let end = Date.now();
        log = {
            ...log,
            start: start,
            tx_name: txName,
            duration: end - start
        };

        if(ex & errMsg)
            log["erro_msg"] = errMsg();
        else if(ex)
            log["error_msg"] = `Error in operation ${txName} ${ex}`;

        console.log(JSON.stringify(log));
    }
};

exports.NestedError = NestedError;
exports.tx = tx;
