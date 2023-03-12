const MAX_DEPTH = 20;

class NestedError extends Error {
    constructor({message ="", error}) {
        super();
        this.message = message;
        this.nestedError = error;
    }

    originalError(i=0){
        if(i >= MAX_DEPTH)
            throw new Error("nestedErrors loop.");

        if(this.nestedError && this.nestedError instanceof NestedError) {
            let ret = this.nestedError.originalError(i+1);
            return ret?ret:this.nestedError;
        }
        else if(this.nestedError)
            return this.nestedError;

        return null;
    }

    userError(i= 0) {
        if(i >= MAX_DEPTH)
            throw new Error("nestedErrors loop.");

        if(this.nestedError && this.nestedError instanceof UserError){
            return this.nestedError;
        } else if(this.nestedError && this.nestedError instanceof NestedError) {
            let ret = this.nestedError.userError(i+1);
            return ret?ret:this.nestedError;
        } else if(this.nestedError) {
            return null;
        }
        return null;
    }
}

class UserError extends NestedError {
    constructor({userMessage, userCode, systemMessage, error}) {
        if(!systemMessage)
            systemMessage= userMessage;
        super({message: systemMessage, error});
        this.userMessage = userMessage;
        this.userCode = userCode;
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
        let message = errMsg?errMsg(): `Error in operation ${JSON.stringify({...log, tx_name: txName})} `;
        throw new NestedError({message, error});
    } finally {
        let end = Date.now();
        log = {
            ...log,
            start: start,
            tx_name: txName,
            duration: end - start
        };

        if(ex)
            log["is_error"] = true;

        if(ex & errMsg)
            log["erro_msg"] = errMsg();
        else if(ex)
            log["error_msg"] = `Error in operation ${txName} ${ex}`;

        console.log(JSON.stringify(log));
    }
};

exports.NestedError = NestedError;
exports.tx = tx;
