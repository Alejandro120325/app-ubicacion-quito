import { HttpError } from "./httpError.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const onlyLettersAndSpacesRegex = /^[\p{L}\s]+$/u;
const ecuadorPhoneRegex = /^09\d{8}$/;

export const requireQueryParam = (value, name) => {
  const normalized = String(value || "").trim();
  if (!normalized) {
    throw new HttpError(400, `El parametro ${name} es obligatorio.`, "INVALID_QUERY");
  }
  return normalized;
};

export const parseNumberParam = (value, name, min, max) => {
  const normalized = requireQueryParam(value, name);
  const number = Number(normalized);

  if (!Number.isFinite(number) || number < min || number > max) {
    throw new HttpError(
      400,
      `El parametro ${name} debe ser un numero entre ${min} y ${max}.`,
      "INVALID_QUERY"
    );
  }

  return number;
};

export const parseCoordinates = (value, name) => {
  const normalized = requireQueryParam(value, name);
  const [latValue, lonValue, ...extra] = normalized.split(",");

  if (extra.length || latValue === undefined || lonValue === undefined) {
    throw new HttpError(400, `${name} debe tener el formato lat,lon.`, "INVALID_QUERY");
  }

  const lat = parseNumberParam(latValue, `${name}.lat`, -90, 90);
  const lon = parseNumberParam(lonValue, `${name}.lon`, -180, 180);
  return `${lat},${lon}`;
};

export const validateLocationPayload = (payload = {}) => {
  const errors = {};
  const latitude = Number(payload.latitude);
  const longitude = Number(payload.longitude);
  const accuracy = payload.accuracy == null ? null : Number(payload.accuracy);
  const heading = payload.heading == null ? null : Number(payload.heading);
  const speed = payload.speed == null ? null : Number(payload.speed);
  const groupId = payload.groupId == null ? null : Number(payload.groupId);

  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    errors.latitude = "La latitud debe estar entre -90 y 90.";
  }
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    errors.longitude = "La longitud debe estar entre -180 y 180.";
  }
  if (accuracy != null && (!Number.isFinite(accuracy) || accuracy < 0)) {
    errors.accuracy = "La precision debe ser un numero positivo.";
  }
  if (groupId != null && (!Number.isInteger(groupId) || groupId < 1)) {
    errors.groupId = "El grupo no es valido.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    data: {
      latitude,
      longitude,
      accuracy,
      heading: Number.isFinite(heading) ? heading : null,
      speed: Number.isFinite(speed) ? speed : null,
      groupId,
      address: String(payload.address || "").trim(),
      sector: String(payload.sector || "Ubicacion GPS").trim()
    }
  };
};

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

export const validLocationStatuses = ["sharing", "paused", "offline"];

export const validateGroupPayload = (payload = {}) => {
  const name = payload.name?.trim().replace(/\s+/g, " ") || "";
  const description = payload.description?.trim().replace(/\s+/g, " ") || "";
  const errors = {};

  if (name.length < 2) {
    errors.name = "El nombre del grupo es obligatorio.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    data: {
      name,
      description
    }
  };
};

export const validateGroupMemberPayload = (payload = {}) => {
  const fullName = payload.fullName?.trim().replace(/\s+/g, " ") || "";
  const email = payload.email?.trim().toLowerCase() || "";
  const phone = payload.phone?.trim() || "";
  const cedula = payload.cedula?.trim() || "";
  const relation = payload.relation?.trim().replace(/\s+/g, " ") || "";
  const locationStatus = validLocationStatuses.includes(payload.locationStatus)
    ? payload.locationStatus
    : "paused";
  const errors = {};

  if (!isValidFullName(fullName)) {
    errors.fullName = "Ingresa nombres completos para el integrante.";
  }

  if (!isValidEmail(email)) {
    errors.email = "Ingresa un correo electronico valido.";
  }

  if (!isValidEcuadorianPhone(phone)) {
    errors.phone = "Ingresa un celular ecuatoriano valido, por ejemplo 0991234567.";
  }

  if (cedula && !isValidEcuadorianCedula(cedula)) {
    errors.cedula = "Ingresa una cedula ecuatoriana valida si la registras.";
  }

  if (relation.length < 2) {
    errors.relation = "La relacion dentro del grupo es obligatoria.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    data: {
      fullName,
      email,
      phone,
      cedula,
      relation,
      locationStatus,
      lastLocation: payload.lastLocation?.trim() || "La Mariscal - Quito",
      lastUpdate: payload.lastUpdate?.trim() || "Actualizado hace unos segundos"
    }
  };
};

export const validateLocationStatusPayload = (payload = {}) => {
  const locationStatus = payload.locationStatus || "";

  if (!validLocationStatuses.includes(locationStatus)) {
    return {
      isValid: false,
      errors: {
        locationStatus: "El estado debe ser sharing, paused u offline."
      }
    };
  }

  return {
    isValid: true,
    errors: {},
    data: { locationStatus }
  };
};
