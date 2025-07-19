/**
 * Converts a flat object with dot notation keys into a deeply nested object.
 *
 * @param {Object.<string, any>} flatObject - Object with flat keys (e.g. "a.b.c")
 * @returns {Object} - Nested object structure
 */
function buildNestedObject(flatObject) {
    const result = {};
  
    for (let key in flatObject) {
      const value = flatObject[key];
  
      // Split the key by '.' to get each nested level
      const keys = key.split('.');
  
      // Start at the root of the result object
      let current = result;
  
      keys.forEach((part, index) => {
        // If it's the last part, assign the value
        if (index === keys.length - 1) {
          current[part] = value;
        } else {
          // If intermediate key doesn't exist, create an object
          current[part] = current[part] || {};
          current = current[part];
        }
      });
    }
  
    return result;
  }
  
  module.exports = buildNestedObject;