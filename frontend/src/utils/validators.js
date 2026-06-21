const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const onlyLettersAndSpacesRegex = /^[\p{L}\s]+$/u;

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

  // Mismo algoritmo usado por el backend para mantener validaciones consistentes.
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

export const validateLoginForm = ({ email, password }) => {
  const errors = {};

  if (!isValidEmail(email)) {
    errors.email = "Ingresa un correo válido.";
  }

  if (!password) {
    errors.password = "Ingresa tu contraseña.";
  }

  return errors;
};

export const validateRegisterForm = (values) => {
  const errors = {};

  if (!isValidFullName(values.fullName)) {
    errors.fullName = "Escribe tus nombres completos, solo con letras.";
  }

  if (!isValidEmail(values.email)) {
    errors.email = "Ingresa un correo válido.";
  }

  if (!isStrongPassword(values.password)) {
    errors.password = "Usa 8 caracteres, mayúscula, minúscula y número.";
  }

  if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Las contraseñas no coinciden.";
  }

  if (!values.language) {
    errors.language = "Selecciona un idioma.";
  }

  if (!isValidEcuadorianCedula(values.cedula)) {
    errors.cedula = "Ingresa una cédula ecuatoriana válida.";
  }

  if (!isValidEcuadorianPhone(values.phone)) {
    errors.phone = "Usa un celular ecuatoriano de 10 dígitos que empiece con 09.";
  }

  return errors;
};
