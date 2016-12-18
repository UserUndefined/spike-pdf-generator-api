var application = require('./app');
//var application = require('./google');
var context = require('./context');

context._initialize({
    functionName: 'handler',
    awsRequestId: context.createInvokeId,
    timeoutMs: 5000,
    callbackWaitsForEmptyEventLoop: true,
    unmute: null,
    logger: console
});

application.handler(null, context);
