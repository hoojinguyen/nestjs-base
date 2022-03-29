const moduleName = { module: 'auth' };

const exceptions = {
  incorrectEmailOrPassword: {
    message: 'Incorrect email or password',
    statusName: 'INCORRECT_EMAIL_OR_PASSWORD',
  },
};

for (const key of Object.keys(exceptions)) {
  exceptions[key] = { ...exceptions[key], ...moduleName };
}

export const ExceptionsResponse = exceptions;
