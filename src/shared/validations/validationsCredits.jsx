export const montoSolicitadoCredito = (montoSolicitado = '') => {
    if (!montoSolicitado || Number(montoSolicitado) < 1000) {
        return "El monto solicitado debe ser mayor o igual a 1000";
    }
    return true;
}

export const montoAprobadoCredito = (montoAprobado = '') => {
    if (!montoAprobado || Number(montoAprobado) < 1000) {
        return "El monto aprobado debe ser mayor o igual a 1000";
    }
    return true;
}

export const validarCamposObligatorios = (mensaje) => (valor) => {
    return valor ? true : mensaje;
}