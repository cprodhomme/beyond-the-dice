export const getValueOnLocalStorage = (key, initialValue) => {
  try {
    // Get from local storage by key
    const item = window.localStorage.getItem(key);
    // Parse stored json or if none return initialValue
    return item ? JSON.parse(item) : initialValue;
  } catch (error) {
    // If error also return initialValue
    console.log(error);
    return initialValue;
  }
}

export const setValueOnLocalStorage = (key, value) => {
  try {
    // Allow value to be a function so we have same API as useState
    // const valueToStore =
    //   value instanceof Function ? value(storedValue) : value;
    // Save state
    // setStoredValue(valueToStore);
    // Save to local storage
    return window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // A more advanced implementation would handle the error case
    console.log(error);
  }
}