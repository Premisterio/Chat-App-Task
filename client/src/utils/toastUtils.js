let addToastFunction = () => {};

export const setAddToastFunction = (fn) => {
  addToastFunction = fn;
};

export const addToast = (...args) => addToastFunction(...args);