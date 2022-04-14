const moduleName = { module: 'tasks' };

const exceptions = {
  jobNotFound: { message: 'Job not found', statusName: 'JOB_NOT_FOUND' },
};

for (const key of Object.keys(exceptions)) {
  exceptions[key] = { ...exceptions[key], ...moduleName };
}

export const ExceptionsResponse = exceptions;
