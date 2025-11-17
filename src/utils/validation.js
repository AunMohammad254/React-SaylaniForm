export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePhone = (phone) => {
  return /^(\+92|0)?[0-9]{10}$/.test(phone.replace(/\s/g, ''));
};

export const validateCNIC = (cnic) => {
  return /^[0-9]{5}-[0-9]{7}-[0-9]$/.test(cnic) || /^[0-9]{13}$/.test(cnic);
};