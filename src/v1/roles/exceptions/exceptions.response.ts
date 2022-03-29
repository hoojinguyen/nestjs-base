const moduleName = { module: 'v1_roles' };

const exceptions = {
  roleNotFound: { message: 'Role not found', statusName: 'ROLE_NOT_FOUND' },
};

for (const key of Object.keys(exceptions)) {
  exceptions[key] = { ...exceptions[key], ...moduleName };
}

export const ExceptionsResponse = exceptions;
