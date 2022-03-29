const moduleName = { module: 'v1_users' };

const exceptions = {
  userNotFound: { message: 'User not found', statusName: 'USER_NOT_FOUND' },
};

for (const key of Object.keys(exceptions)) {
  exceptions[key] = { ...exceptions[key], ...moduleName };
}

export const ExceptionsResponse = exceptions;
