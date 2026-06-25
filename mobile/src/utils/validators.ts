import type { RegisterPayload } from "@/types";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const onlyLettersAndSpacesRegex = /^[\p{L}\s]+$/u;

export type FieldErrors = Partial<Record<keyof RegisterPayload | "email" | "password", string>>;

export const normalizeName = (value = "") => value.trim().replace(/\s+/g, " ");

export function isValidFullName(fullName = "") {
  const value = normalizeName(fullName);
  return value.length >= 5 && value.split(" ").length >= 2 && onlyLettersAndSpacesRegex.test(value);
}

export function isValidEmail(email = "") {
  return emailRegex.test(email.trim());
}

export function isStrongPassword(password = "") {
  return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password);
}

export function passwordScore(password = "") {
  return [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /\d/.test(password)
  ].filter(Boolean).length;
}

export function isValidEcuadorianCedula(cedula = "") {
  if (!/^\d{10}$/.test(cedula)) return false;

  const province = Number(cedula.substring(0, 2));
  const thirdDigit = Number(cedula.substring(2, 3));

  if (province < 1 || province > 24 || thirdDigit >= 6) return false;

  const coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  const sum = coefficients.reduce((total, coefficient, index) => {
    let value = Number(cedula[index]) * coefficient;
    if (value >= 10) value -= 9;
    return total + value;
  }, 0);

  const verifier = sum % 10 === 0 ? 0 : 10 - (sum % 10);
  return verifier === Number(cedula[9]);
}

export function isValidEcuadorianPhone(phone = "") {
  return /^09\d{8}$/.test(phone);
}

export function validateLoginForm(values: { email: string; password: string }) {
  const errors: FieldErrors = {};

  if (!isValidEmail(values.email)) {
    errors.email = "Ingresa un correo valido.";
  }

  if (!values.password) {
    errors.password = "Ingresa tu contrasena.";
  }

  return errors;
}

export function validateRegisterForm(values: RegisterPayload) {
  const errors: FieldErrors = {};

  if (!isValidFullName(values.fullName)) {
    errors.fullName = "Escribe tus nombres completos, solo con letras.";
  }

  if (!isValidEmail(values.email)) {
    errors.email = "Ingresa un correo valido.";
  }

  if (!isStrongPassword(values.password)) {
    errors.password = "Usa 8 caracteres, mayuscula, minuscula y numero.";
  }

  if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Las contrasenas no coinciden.";
  }

  if (!values.language) {
    errors.language = "Selecciona un idioma.";
  }

  if (!isValidEcuadorianCedula(values.cedula)) {
    errors.cedula = "Ingresa una cedula ecuatoriana valida de 10 digitos.";
  }

  if (!isValidEcuadorianPhone(values.phone)) {
    errors.phone = "Usa un celular ecuatoriano de 10 digitos que empiece con 09.";
  }

  return errors;
}
