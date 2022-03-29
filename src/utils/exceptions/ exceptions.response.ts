const moduleName = { module: 'utils' };

const exceptions = {
  refreshTokenNotFound: {
    message: 'Refresh token not found',
    statusName: 'REFRESH_TOKEN_NOT_FOUND',
  },
  refreshTokenRevoked: {
    message: 'Refresh token revoked',
    statusName: 'REFRESH_TOKEN_REVOKED',
  },
};

for (const key of Object.keys(exceptions)) {
  exceptions[key] = { ...exceptions[key], ...moduleName };
}

export const ExceptionsResponse = exceptions;
