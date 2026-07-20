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
  const latitude = Number(payload.latitude ?? payload.latitud);
  const longitude = Number(payload.longitude ?? payload.longitud);
  const accuracyValue = payload.accuracy ?? payload.precision;
  const accuracy = accuracyValue == null ? null : Number(accuracyValue);
  const heading = payload.heading == null ? null : Number(payload.heading);
  const speed = payload.speed == null ? null : Number(payload.speed);
  const groupValue = payload.groupId ?? payload.grupoId;
  const groupId = groupValue == null ? null : Number(groupValue);
  const simulated =
    typeof payload.simulated === "boolean" ? payload.simulated : payload.simulado;
  const timestampValue = payload.timestamp ?? payload.updatedAt ?? payload.lastUpdate;
  const timestamp = timestampValue ? new Date(timestampValue) : null;

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
  if (timestampValue && Number.isNaN(timestamp.getTime())) {
    errors.timestamp = "La fecha de actualizacion no es valida.";
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
      address: String(payload.address ?? payload.direccion ?? "").trim(),
      sector: String(payload.sector || "Ubicacion GPS").trim(),
      simulated: typeof simulated === "boolean" ? simulated : false,
      timestamp: timestamp ? timestamp.toISOString() : null
    }
  };
};

export const validateStoredLocationPayload = (payload = {}) => {
  const baseValidation = validateLocationPayload(payload);
  const errors = { ...baseValidation.errors };
  const userId = Number(payload.userId ?? payload.usuarioId);
  const groupId = Number(payload.groupId ?? payload.grupoId);
  const sharing = payload.sharing ?? payload.compartiendo;

  if (!Number.isInteger(userId) || userId < 1) {
    errors.userId = "userId es obligatorio y debe ser un entero positivo.";
  }
  if (!Number.isInteger(groupId) || groupId < 1) {
    errors.groupId = "groupId es obligatorio y debe ser un entero positivo.";
  }
  if (typeof sharing !== "boolean") {
    errors.sharing = "sharing es obligatorio y debe ser booleano.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    data: {
      ...baseValidation.data,
      userId,
      groupId,
      sharing
    }
  };
};

export const validateLocationUpdatePayload = (payload = {}) => {
  const data = {};
  const errors = {};
  const latitudeValue = payload.latitude ?? payload.latitud;
  const longitudeValue = payload.longitude ?? payload.longitud;
  const accuracyValue = payload.accuracy ?? payload.precision;
  const sharingValue = payload.sharing ?? payload.compartiendo;

  if (latitudeValue !== undefined) {
    const latitude = Number(latitudeValue);
    if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
      errors.latitude = "La latitud debe estar entre -90 y 90.";
    } else data.latitude = latitude;
  }
  if (longitudeValue !== undefined) {
    const longitude = Number(longitudeValue);
    if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
      errors.longitude = "La longitud debe estar entre -180 y 180.";
    } else data.longitude = longitude;
  }
  if (accuracyValue !== undefined) {
    const accuracy = Number(accuracyValue);
    if (!Number.isFinite(accuracy) || accuracy < 0) {
      errors.accuracy = "La precision debe ser un numero positivo.";
    } else data.accuracy = accuracy;
  }
  if (sharingValue !== undefined) {
    if (typeof sharingValue !== "boolean") errors.sharing = "sharing debe ser booleano.";
    else data.sharing = sharingValue;
  }
  const addressValue = payload.address ?? payload.direccion;
  if (addressValue !== undefined) data.address = String(addressValue).trim();
  if (payload.sector !== undefined) data.sector = String(payload.sector).trim();

  if (Object.keys(data).length === 0 && Object.keys(errors).length === 0) {
    errors.body = "Envia al menos un campo de ubicacion para actualizar.";
  }

  return { isValid: Object.keys(errors).length === 0, errors, data };
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
  const role = payload.role?.trim().toLowerCase() || "persona";

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

  if (!['admin', 'persona'].includes(role)) {
    errors.role = "El rol debe ser admin o persona.";
  } else if (role !== "persona") {
    errors.role = "El registro publico solo permite crear cuentas tipo persona.";
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
      phone,
      role: "persona"
    }
  };
};

const normalizeUserAliases = (payload = {}) => ({
  fullName: payload.fullName ?? payload.nombre,
  email: payload.email,
  password: payload.password,
  confirmPassword: payload.confirmPassword ?? payload.password,
  language: payload.language ?? payload.idioma ?? "es",
  cedula: payload.cedula,
  phone: payload.phone ?? payload.telefono,
  role: payload.role ?? payload.rol ?? "persona"
});

export const validateUserCreatePayload = (payload, existingUsers = []) => {
  const normalized = normalizeUserAliases(payload);
  const validation = validateRegisterPayload(
    { ...normalized, role: "persona" },
    existingUsers
  );
  const role = String(normalized.role || "persona").trim().toLowerCase();

  if (!["admin", "persona"].includes(role)) {
    validation.errors.role = "El rol debe ser admin o persona.";
  }

  return {
    ...validation,
    isValid: Object.keys(validation.errors).length === 0,
    data: { ...validation.data, role }
  };
};

export const validateUserUpdatePayload = (payload, existingUsers = [], userId) => {
  const normalized = normalizeUserAliases(payload);
  const data = {};
  const errors = {};

  if (payload.fullName !== undefined || payload.nombre !== undefined) {
    const fullName = String(normalized.fullName || "").trim().replace(/\s+/g, " ");
    if (!isValidFullName(fullName)) errors.fullName = "Ingresa nombres completos validos.";
    else data.fullName = fullName;
  }
  if (payload.email !== undefined) {
    const email = String(normalized.email || "").trim().toLowerCase();
    if (!isValidEmail(email)) errors.email = "Ingresa un correo electronico valido.";
    else if (existingUsers.some((user) => user.id !== Number(userId) && user.email === email)) {
      errors.email = "Este correo ya esta registrado.";
    } else data.email = email;
  }
  if (payload.phone !== undefined || payload.telefono !== undefined) {
    const phone = String(normalized.phone || "").trim();
    if (!isValidEcuadorianPhone(phone)) errors.phone = "Ingresa un celular ecuatoriano valido.";
    else if (existingUsers.some((user) => user.id !== Number(userId) && user.phone === phone)) {
      errors.phone = "Este telefono ya esta registrado.";
    } else data.phone = phone;
  }
  if (payload.role !== undefined || payload.rol !== undefined) {
    const role = String(normalized.role || "").trim().toLowerCase();
    if (!["admin", "persona"].includes(role)) errors.role = "El rol debe ser admin o persona.";
    else data.role = role;
  }
  if (payload.active !== undefined) {
    if (typeof payload.active !== "boolean") errors.active = "active debe ser booleano.";
    else data.active = payload.active;
  }

  if (Object.keys(data).length === 0 && Object.keys(errors).length === 0) {
    errors.body = "Envia fullName, email, phone, role o active para actualizar.";
  }

  return { isValid: Object.keys(errors).length === 0, errors, data };
};

export const validLocationStatuses = ["sharing", "paused", "offline"];

export const validateGroupPayload = (payload = {}) => {
  const name = String(payload.name ?? payload.nombre ?? "").trim().replace(/\s+/g, " ");
  const description = String(payload.description ?? payload.descripcion ?? "").trim().replace(/\s+/g, " ");
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

export const validateGroupUpdatePayload = (payload = {}) => {
  const data = {};
  const errors = {};

  const nameValue = payload.name ?? payload.nombre;
  const descriptionValue = payload.description ?? payload.descripcion;
  if (nameValue !== undefined) {
    const name = String(nameValue).trim().replace(/\s+/g, " ");
    if (name.length < 2) errors.name = "El nombre debe tener al menos 2 caracteres.";
    else data.name = name;
  }
  if (descriptionValue !== undefined) {
    data.description = String(descriptionValue).trim().replace(/\s+/g, " ");
  }
  if (Object.keys(data).length === 0 && Object.keys(errors).length === 0) {
    errors.body = "Envia name o description para actualizar el grupo.";
  }

  return { isValid: Object.keys(errors).length === 0, errors, data };
};

export const validateGroupMemberPayload = (payload = {}) => {
  const fullName = String(payload.fullName ?? payload.nombre ?? "").trim().replace(/\s+/g, " ");
  const email = payload.email?.trim().toLowerCase() || "";
  const phone = String(payload.phone ?? payload.telefono ?? "").trim();
  const cedula = payload.cedula?.trim() || "";
  const relation = String(payload.relation ?? payload.relacion ?? "").trim().replace(/\s+/g, " ");
  const requestedStatus = payload.locationStatus ?? payload.estadoUbicacion;
  const locationStatus = validLocationStatuses.includes(requestedStatus)
    ? requestedStatus
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

export const validateGroupMemberUpdatePayload = (payload = {}) => {
  const data = {};
  const errors = {};

  if (payload.relation !== undefined) {
    const relation = String(payload.relation).trim().replace(/\s+/g, " ");
    if (relation.length < 2) errors.relation = "La relacion es obligatoria.";
    else data.relation = relation;
  }
  if (payload.locationStatus !== undefined) {
    if (!validLocationStatuses.includes(payload.locationStatus)) {
      errors.locationStatus = "El estado debe ser sharing, paused u offline.";
    } else {
      data.locationStatus = payload.locationStatus;
      data.lastUpdate = new Date().toISOString();
    }
  }
  if (Object.keys(data).length === 0 && Object.keys(errors).length === 0) {
    errors.body = "Envia relation o locationStatus para actualizar el integrante.";
  }

  return { isValid: Object.keys(errors).length === 0, errors, data };
};
