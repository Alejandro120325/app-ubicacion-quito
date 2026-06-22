const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const onlyLettersAndSpacesRegex = /^[\p{L}\s]+$/u;

const defaultT = (key) =>
  ({
    "validation.email": "Ingresa un correo válido.",
    "validation.password": "Ingresa tu contraseña.",
    "validation.fullName": "Escribe tus nombres completos, solo con letras.",
    "validation.strongPassword": "Usa 8 caracteres, mayúscula, minúscula y número.",
    "validation.confirmPassword": "Las contraseñas no coinciden.",
    "validation.language": "Selecciona un idioma.",
    "validation.cedula": "Ingresa una cédula ecuatoriana válida.",
    "validation.phone": "Usa un celular ecuatoriano de 10 dígitos que empiece con 09."
  })[key] || key;

export const normalizeName = (value = "") => value.trim().replace(/\s+/g, " ");

export const isValidFullName = (fullName = "") => {
  const value = normalizeName(fullName);

  return (
    value.length >= 5 &&
    value.split(" ").length >= 2 &&
    onlyLettersAndSpacesRegex.test(value)
  );
};

export const isValidEmail = (email = "") => emailRegex.test(email.trim());

export const isStrongPassword = (password = "") =>
  password.length >= 8 &&
  /[A-Z]/.test(password) &&
  /[a-z]/.test(password) &&
  /\d/.test(password);

export const isValidEcuadorianCedula = (cedula = "") => {
  if (!/^\d{10}$/.test(cedula)) return false;

  const province = Number(cedula.substring(0, 2));
  const thirdDigit = Number(cedula.substring(2, 3));

  if (province < 1 || province > 24 || thirdDigit >= 6) {
    return false;
  }

  // Keep the same validation algorithm used by the backend.
  const coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  const sum = coefficients.reduce((total, coefficient, index) => {
    let value = Number(cedula[index]) * coefficient;
    if (value >= 10) value -= 9;
    return total + value;
  }, 0);

  const verifier = sum % 10 === 0 ? 0 : 10 - (sum % 10);
  return verifier === Number(cedula[9]);
};

export const isValidEcuadorianPhone = (phone = "") => /^09\d{8}$/.test(phone);

export const validateLoginForm = ({ email, password }, t = defaultT) => {
  const errors = {};

  if (!isValidEmail(email)) {
    errors.email = t("validation.email");
  }

  if (!password) {
    errors.password = t("validation.password");
  }

  return errors;
};

export const validateRegisterForm = (values, t = defaultT) => {
  const errors = {};

  if (!isValidFullName(values.fullName)) {
    errors.fullName = t("validation.fullName");
  }

  if (!isValidEmail(values.email)) {
    errors.email = t("validation.email");
  }

  if (!isStrongPassword(values.password)) {
    errors.password = t("validation.strongPassword");
  }

  if (values.confirmPassword !== values.password) {
    errors.confirmPassword = t("validation.confirmPassword");
  }

  if (!values.language) {
    errors.language = t("validation.language");
  }

  if (!isValidEcuadorianCedula(values.cedula)) {
    errors.cedula = t("validation.cedula");
  }

  if (!isValidEcuadorianPhone(values.phone)) {
    errors.phone = t("validation.phone");
  }

  return errors;
};
