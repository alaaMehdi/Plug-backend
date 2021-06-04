function apiMessages() {}

apiMessages.prototype.email_not_found = 0;
apiMessages.prototype.invalid_pwd = 1;
apiMessages.prototype.db_error = 2;
apiMessages.prototype.not_found = 3;
apiMessages.prototype.email_already_exists = 4;
apiMessages.prototype.could_not_create_user = 5;
apiMessages.prototype.password_reset_expired = 6;
apiMessages.prototype.password_reset_hash_mismatch = 7;
apiMessages.prototype.password_reset_email_mismatch = 8;
apiMessages.prototype.could_not_reset_password = 9;

module.exports = apiMessages;