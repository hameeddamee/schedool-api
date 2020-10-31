const fs = require("fs");
const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");
const Hogan = require("hogan.js");
const htmlToText = require("html-to-text");
const promisify = require("es6-promisify");
const { emails } = require("../../config");

const generateHTML = (filename, options = {}) => {
  let template = fs.readFileSync(`./src/views/email/${filename}.hjs`, "utf-8");
  let compiledTemplate = Hogan.compile(template);

  return compiledTemplate.render(options);
};

exports.send = async (options) => {
  const transport = nodemailer.createTransport(
    sgTransport({
      auth: {
        api_key: emails.apiKey,
      },
    })
  );

  const html = generateHTML(options.filename, options);
  const text = htmlToText.fromString(html);

  const mailOptions = {
    from:  `sharon@rcodevelopers.com`,
    to: options.user.email,
    subject: options.subject,
    html,
    text,
  };

  const sendMail = promisify(transport.sendMail, transport);

  return sendMail(mailOptions);
};
