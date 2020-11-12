const mapPasswordReq = (errors) => {
  const passwordValidationErrors = {
    min: "Password must be at least 8 characters long\n",
    lowercase: "Password must contain at least one uppercase letter\n",
    uppercase: "Password must contain at least one lowercase letter\n",
    digits: "Password must contain at least one digit\n",
    required: "This field is required\n",
  };
  let errorsArr = errors.split(",");
  errorsArr = errorsArr.map((error) =>
    passwordValidationErrors[error] ? passwordValidationErrors[error] : error
  );
  return errorsArr;
};

export default mapPasswordReq;
