const isPlainObject = (value) =>
  Object.prototype.toString.call(value) === '[object Object]';

const sanitizeValue = (value) => {
  if (Array.isArray(value)) {
    value.forEach(sanitizeValue);
    return value;
  }

  if (isPlainObject(value)) {
    for (const key of Object.keys(value)) {
      if (key.startsWith('$') || key.includes('.')) {
        delete value[key];
        continue;
      }
      sanitizeValue(value[key]);
    }
  }

  return value;
};

const sanitize = (req, res, next) => {
  sanitizeValue(req.body);
  sanitizeValue(req.params);
  sanitizeValue(req.query);
  next();
};

export default sanitize;