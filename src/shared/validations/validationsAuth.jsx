export const ingresosCuenta = (ingresos = '') => {
    if (!ingresos || Number(ingresos) < 100) {
        return "Los ingresos deben ser mayores o iguales a Q100";
    }
    return true;
};
export const validarCamposObligatorios = (mensaje) => (valor) => {
    return valor ? true : mensaje;
};




export const validarCamposUnicos = (campo, existe) => async (valor) => {
    const yaExiste = await existe(valor);
    return yaExiste ? `Este campo ${campo} ya existe` : true;
};

export const validarCamposEditables = (data) => {
    const camposEditables = [
        "name",
        "direccion",
        "NameTrabajo",
        "ingresos",
        "password",
        "newPassword"
    ];

    for (const campo of camposEditables) {
        if (data[campo] && data[campo].length < 3) {
            return `El campo ${campo} debe tener al menos 3 caracteres`;
        }
    }
}






export const validateUsernameOrEmail = (value) => {
    if (!value.trim()) {
        return {
            isValid: false,
            message: 'Username or email is required'
        }
    }

    const isEmail = /\S+@\S+\.\S+/.test(value);
    const isUsername = /^\S{3,20}$/.test(value);

    if (!isEmail && !isUsername) {
        return {
            isValid: false,
            message: 'Ingresa un correo válido o un nombre de usuario 3 a 20 caracteres sin espacios'
        }
    }

    return { isValid: true, message: '' };
}

export const validatePassword = (value) => {
    if (!value.trim()) {
        return {
            isValid: false,
            message: 'Password is required'
        }
    }

    const regex = /^\S{8,8}$/;
    if (!regex.test(value)) {
        return {
            isValid: false,
            message: 'La contraseña debe contener exactamente 8 caracteres y no debe contener espacios'
        }
    }

    return { isValid: true, message: '' };
}

