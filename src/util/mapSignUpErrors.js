const mapSignUpErrors = (errors) => {
  let errorFields = Object.keys(errors);

  let errorsObj = {};
  errorFields = errorFields.forEach((error) => {
    errorsObj[error] = errors[error].message;
  });

  return errorsObj;
};

export default mapSignUpErrors;
