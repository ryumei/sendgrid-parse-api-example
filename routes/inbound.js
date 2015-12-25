/*eslint-env node */
/*globals sendgrid server*/
var inbound = {
  handler: function (request) {
    var envelope;
    var payload   = request.payload;
    var mail_from = "bluemix@example.com";
    
    var rcpt_to = process.env.RCPT_TO;
	var subject_prefix = process.env.SUBJECT;

    console.log(payload);

    if (payload.envelope) { envelope = JSON.parse(payload.envelope); }
    if (envelope)         {
    	mail_from = envelope.from;
    }

    var Email     = sendgrid.Email;
    var email     = new Email({
      to:       rcpt_to,
      from:     mail_from,
      subject:  subject_prefix,
      text:     "A payload was just delivered via SendGrid's Inbound Parse API. It should be attached."
    });

    email.addFile({
      filename: 'payload.txt',
      content: new Buffer(JSON.stringify(payload))
    });

    sendgrid.send(email, function(err, json) {
      if (err) { 
        console.error(err);
        request.reply({ success: false, error: {message: err.message} });
      } else {
        request.reply({ success: true });
      }
    });
  }
};

server.addRoute({
  method  : 'POST',
  path    : '/inbound',
  config  : inbound
});
