const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const onlyLettersAndSpacesRegex = /^[\p{L}\s]+$/u;
const ecuadorPhoneRegex = /^09\d{8}$/;

export const sanitizeUser = (user) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

export const isValidFullName = (fullName = "") => {
  const value = fullName.trim().replace(/\s+/g, " ");

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

export const isValidLanguage = (language = "") => ["es", "en"].includes(language);

export const isValidEcuadorianCedula = (cedula = "") => {
  if (!/^\d{10}$/.test(cedula)) return false;

  const province = Number(cedula.substring(0, 2));
  const thirdDigit = Number(cedula.substring(2, 3));

  if (province < 1 || province > 24 || thirdDigit >= 6) {
    return false;
  }

  // Algoritmo oficial para persona natural: multiplica los 9 primeros digitos
  // por coeficientes alternados y compara el resultado con el digito verificador.
  const coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  const sum = coefficients.reduce((total, coefficient, index) => {
    let value = Number(cedula[index]) * coefficient;
    if (value >= 10) value -= 9;
    return total + value;
  }, 0);

  const verifier = sum % 10 === 0 ? 0 : 10 - (sum % 10);
  return verifier === Number(cedula[9]);
};

export const isValidEcuadorianPhone = (phone = "") => ecuadorPhoneRegex.test(phone);

export const validateRegisterPayload = (payload, existingUsers = []) => {
  const errors = {};
  const fullName = payload.fullName?.trim().replace(/\s+/g, " ") || "";
  const email = payload.email?.trim().toLowerCase() || "";
  const password = payload.password || "";
  const confirmPassword = payload.confirmPassword || "";
  const language = payload.language || "";
  const cedula = payload.cedula?.trim() || "";
  const phone = payload.phone?.trim() || "";

  if (!isValidFullName(fullName)) {
    errors.fullName = "Ingresa nombres completos: minimo dos palabras y solo letras.";
  }

  if (!isValidEmail(email)) {
    errors.email = "Ingresa un correo electronico valido.";
  } else if (existingUsers.some((user) => user.email.toLowerCase() === email)) {
    errors.email = "Este correo ya esta registrado.";
  }

  if (!isStrongPassword(password)) {
    errors.password =
      "La contrasena debe tener minimo 8 caracteres, una mayuscula, una minuscula y un numero.";
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = "Las contrasenas no coinciden.";
  }

  if (!isValidLanguage(language)) {
    errors.language = "Selecciona un idioma valido.";
  }

  if (!isValidEcuadorianCedula(cedula)) {
    errors.cedula = "Ingresa una cedula ecuatoriana valida de 10 digitos.";
  } else if (existingUsers.some((user) => user.cedula === cedula)) {
    errors.cedula = "Esta cedula ya esta registrada.";
  }

  if (!isValidEcuadorianPhone(phone)) {
    errors.phone = "Ingresa un celular ecuatoriano valido, por ejemplo 0991234567.";
  } else if (existingUsers.some((user) => user.phone === phone)) {
    errors.phone = "Este telefono ya esta registrado.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    data: {
      fullName,
      email,
      password,
      language,
      cedula,
      phone
    }
  };
};
