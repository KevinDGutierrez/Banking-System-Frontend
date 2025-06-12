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

export const validarContaseñaActual = (cliente, currentPassword, newPassword) => {
    try {
        const {password} = cliente;
        if (password !== currentPassword) {
            return "La contraseña actual no es correcta";
        }
    } catch (error) {
        return "Error al validar la contraseña actual";
    }
}

export const NoRepetirContraseña = (password, newPassword) => {
    if (password === newPassword) {
        return "La nueva contraseña no puede ser igual a la contraseña actual";
    }
}

export const validarActivacionCuentaStatus = (user) => {
    if (!user.status && user.role === "CLIENTE") {
        return "Cuenta pendiente de Aprobación por parte del administrador";
    }  else if (user.status === "activa") {
        return null; 
    }
}

export const codigoVencido = (codigoGenerado) => {
    const currentDate = new Date();
    const expirationDate = new Date(codigoGenerado);
    
    if (currentDate > expirationDate) {
        return "El código de recuperación ha expirado";
    }
    return null;
}

