import _ from 'lodash';

export const addSlashes = (str: string): string => {
  if (!str) return str;
  return str.replace(/'|"|\\/g, (match) => `\\${match}`);
};

export const mysqlRealEscapeString = (str: string): string => {
  if (!str) return str;
  return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
    switch (char) {
      case '\0':
        return '\\0';
      case '\x08':
        return '\\b';
      case '\x09':
        return '\\t';
      case '\x1a':
        return '\\z';
      case '\n':
        return '\\n';
      case '\r':
        return '\\r';
      case '"':
      case "'":
      case '\\':
      case '%':
        return '\\' + char; // prepends a backslash to backslash, percent,
      // and double/single quotes
      default:
        return char;
    }
  });
};

export const ckEditorFormat = (str: string) => {
  if (!str) return str;
  return str.replace(/\\+n$/, '');
};

export const cloneDataModel = <T>(
  data: any,
  deleteFields: string[] = [],
): T => {
  const dataClone = data.get({ clone: true });
  deleteFields.forEach((fieldName) => delete dataClone[fieldName]);
  return dataClone;
};

export const hexColorPattern = /^#([0-9a-f]{3}){1,2}$/i;

export const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;

export const cellphoneValidate = (phoneNumber: string): boolean => {
  const pattern = /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/;
  return pattern.test(phoneNumber);
};

export const phoneNumberValidate = (phoneNumber: string): boolean => {
  const pattern = /^\d{2,3}-\d{3,4}-\d{4}$/;
  return pattern.test(phoneNumber);
};

export const randomNumber = (min = 0, max = 0): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const getRandom = <T>(array: T[]): T => {
  if (!array) return null;
  return array[Math.floor(Math.random() * array.length)];
};

export const runAfter = async (
  timeBeforeCall: number,
  cb: any,
  timeout?: number,
  timeoutCb?: any,
): Promise<void> => {
  await delaySynchronously(timeBeforeCall);
  let timeoutExecution: NodeJS.Timeout | null = null;
  if (timeout && timeoutCb) {
    timeoutExecution = setTimeout(() => {
      _.isFunction(timeoutCb) && timeoutCb();
    }, timeout);
  }
  _.isFunction(cb) &&
    cb(() => {
      timeoutExecution && clearTimeout(timeoutExecution);
    });
};

export const delaySynchronously = async (time: number) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};
