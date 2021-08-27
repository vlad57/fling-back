const JWT_SIGN_SECRET = '1JEkAOcQTmPhwhvkRmFWpt1u4mUt1NYfjcCf8dyRbgY7S3C0NI';
// Constants
const EMAIL_REGEX     = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX  = /^(?=.*\d).{4,8}$/;

module.exports = {
    JWT_SIGN_SECRET: JWT_SIGN_SECRET,
    EMAIL_REGEX: EMAIL_REGEX,
    PASSWORD_REGEX, PASSWORD_REGEX
}