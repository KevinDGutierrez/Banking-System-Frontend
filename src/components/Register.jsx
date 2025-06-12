import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useRegister } from "../shared/hooks/useRegister";
import { Input } from './Input.jsx'
import { validarCamposObligatorios, ingresosCuenta, validarCamposUnicos } from "../shared/validations/validationsAuth";
import {
  Email as EmailIcon,
  Person as PersonIcon,
  Lock as LockIcon, 
  Visibility, 
  VisibilityOff, 
  Phone as PhoneIcon, 
  Badge as NameIcon, 
  LocationOn as LocationOnIcon, 
  Work as WorkIcon, 
  AccountBalance as AccountBalanceIcon
} from '@mui/icons-material';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import video4 from '../assets/video4.mp4'


export const Register = ({ switchAuthHandler }) => {
  const { handleRegister, isLoading } = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  

  const [formState, setFormState] = useState({
    name: {
      value: '',
      isValid: false,
      showError: false,
      validationMessage: ''
    },
    dpi: {
      value: '',
      isValid: false,
      showError: false,
      validationMessage: ''
    },
    direccion: {
      value: '',
      isValid: false,
      showError: false,
      validationMessage: ''
    },
    correo: {
      value: '',
      isValid: false,
      showError: false,
      validationMessage: ''
    },
    username: {
      value: '',
      isValid: false,
      showError: false,
      validationMessage: ''
    },
    celular: {
      value: '',
      isValid: false,
      showError: false,
      validationMessage: ''
    },
    password: {
      value: '',
      isValid: false,
      showError: false,
      validationMessage: ''
    },
    passwordConfir: {
      value: '',
      isValid: false,
      showError: false,
      validationMessage: ''
    },
    NameTrabajo: {
      value: '',
      isValid: false,
      showError: false,
      validationMessage: ''
    },
    ingresos: {
      value: '',
      isValid: false,
      showError: false,
      validationMessage: ''
    }
  });

  const handleInputValueChange = (value, field) => {
    setFormState((prevState) => ({
      ...prevState,
      [field]: {
        ...prevState[field],
        value
      }
    }));
  };

  const buildResult = (validador, value) => {
    const validacion = validador(value);
    return typeof validacion === 'string'
      ? { isValid: false, message: validacion }
      : { isValid: true, message: '' };
  };

  const handleInputValidationOnBlur = (value, field) => {
    let result = { isValid: false, message: '' };
    switch (field) {
      case 'name':
        result = buildResult(validarCamposObligatorios('El nombre es obligatorio'), value);
        break;
      case 'dpi':
        result = buildResult(validarCamposObligatorios('El DPI es obligatorio'), value);
        break;
      case 'direccion':
        result = buildResult(validarCamposObligatorios('La direccion es obligatoria'), value);
        break;
      case 'username':
        result = buildResult(validarCamposObligatorios('El username es obligatorio'), value);
        break;
      case 'correo':
        result = buildResult(validarCamposObligatorios('El correo es obligatorio'), value);
        break;
      case 'celular':
        result = buildResult(validarCamposObligatorios('El celular es obligatorio'), value);
        break;
      case 'password':
        result = buildResult(validarCamposObligatorios('La contraseña es obligatoria'), value);
        break;
      case 'NameTrabajo':
        result = buildResult(validarCamposObligatorios('El nombre del trabajo es obligatorio'), value);
        break;
      case 'ingresos':
        result = buildResult(ingresosCuenta, value);
        break;
      case 'passwordConfir':
        result = {
          isValid: value === formState.password.value,
          message: value !== formState.password.value ? 'Las contraseñas no coinciden' : ''
        }
        break;
      default:
        break;
    }

    setFormState((prevState) => ({
      ...prevState,
      [field]: {
        ...prevState[field],
        isValid: result.isValid,
        showError: !result.isValid,
        validationMessage: result.message
      }
    }));
  };

  const handleRegisterSubmit = (event) => {
    event.preventDefault();
    handleRegister(
      formState.name.value,
      formState.dpi.value,
      formState.direccion.value,
      formState.username.value,
      formState.correo.value,
      formState.celular.value,
      formState.password.value,
      formState.NameTrabajo.value,
      formState.ingresos.value
    );
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const isSubmitButtonDisable = isLoading ||
    !formState.name.isValid ||
    !formState.dpi.isValid ||
    !formState.direccion.isValid ||
    !formState.username.isValid ||
    !formState.correo.isValid ||
    !formState.celular.isValid ||
    !formState.password.isValid ||
    !formState.passwordConfir.isValid ||
    !formState.NameTrabajo.isValid ||
    !formState.ingresos.isValid;

  return (
    <div className="relative min-h-screen w-full overflow-hidden"> 
    <video
    className="absolute top-0 left-0 w-full h-full object-cover brightness-50 z0"
    src={video4}
    autoPlay
    loop
    muted
    playsInline
  />
    <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-1/2 bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-600 py-6 px-8 text-center">
          <div className="flex justify-center mb-4">
            <img
              src="./src/assets/Banking1.png"
              alt="Bank Logo"
              className="w-24 h-24 object-contain"
            />
          </div>
          <h2 className="text-2xl font-bold text-white">Registrarse</h2>
        </div>

        <form onSubmit={handleRegisterSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              field='name'
              label='Nombre'
              value={formState.name.value}
              onChangeHandler={handleInputValueChange}
              type='text'
              onBlurHandler={handleInputValidationOnBlur}
              showErrorMessage={formState.name.showError}
              validationMessage={formState.name.validationMessage}
              icon={NameIcon}
            />

            <Input
              field='dpi'
              label='DPI'
              value={formState.dpi.value}
              onChangeHandler={handleInputValueChange}
              type='text'
              onBlurHandler={handleInputValidationOnBlur}
              showErrorMessage={formState.dpi.showError}
              validationMessage={formState.dpi.validationMessage}
              icon={NameIcon}
            />
          </div>

          <Input
            field='direccion'
            label='Dirección'
            value={formState.direccion.value}
            onChangeHandler={handleInputValueChange}
            type='text'
            onBlurHandler={handleInputValidationOnBlur}
            showErrorMessage={formState.direccion.showError}
            validationMessage={formState.direccion.validationMessage}
            icon={LocationOnIcon}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              field='username'
              label='Usuario'
              value={formState.username.value}
              onChangeHandler={handleInputValueChange}
              type='text'
              onBlurHandler={handleInputValidationOnBlur}
              showErrorMessage={formState.username.showError}
              validationMessage={formState.username.validationMessage}
              icon={PersonIcon}
            />

            <Input
              field='correo'
              label='Correo'
              value={formState.correo.value}
              onChangeHandler={handleInputValueChange}
              type='email'
              onBlurHandler={handleInputValidationOnBlur}
              showErrorMessage={formState.correo.showError}
              validationMessage={formState.correo.validationMessage}
              icon={EmailIcon}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              field='celular'
              label='Celular'
              value={formState.celular.value}
              onChangeHandler={handleInputValueChange}
              type='tel'
              onBlurHandler={handleInputValidationOnBlur}
              showErrorMessage={formState.celular.showError}
              validationMessage={formState.celular.validationMessage}
              icon={PhoneIcon}
            />

            <Input
              field='NameTrabajo'
              label='Trabajo'
              value={formState.NameTrabajo.value}
              onChangeHandler={handleInputValueChange}
              type='text'
              onBlurHandler={handleInputValidationOnBlur}
              showErrorMessage={formState.NameTrabajo.showError}
              validationMessage={formState.NameTrabajo.validationMessage}
              icon={WorkIcon}
            />
          </div>

          <Input
            field='ingresos'
            label='Ingresos'
            value={formState.ingresos.value}
            onChangeHandler={handleInputValueChange}
            type='text'
            onBlurHandler={handleInputValidationOnBlur}
            showErrorMessage={formState.ingresos.showError}
            validationMessage={formState.ingresos.validationMessage}
            icon={AccountBalanceIcon}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              field='password'
              label='Contraseña'
              value={formState.password.value}
              onChangeHandler={handleInputValueChange}
              type={showPassword ? 'text' : 'password'}
              onBlurHandler={handleInputValidationOnBlur}
              showErrorMessage={formState.password.showError}
              validationMessage={formState.password.validationMessage}
              icon={LockIcon}
              endAdornment={
                <button
                  type="button"
                  onClick={handleClickShowPassword}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </button>
              }
            />

            <Input
              field='passwordConfir'
              label='Confirmar'
              value={formState.passwordConfir.value}
              onChangeHandler={handleInputValueChange}
              type={showConfirmPassword ? 'text' : 'password'}
              onBlurHandler={handleInputValidationOnBlur}
              showErrorMessage={formState.passwordConfir.showError}
              validationMessage={formState.passwordConfir.validationMessage}
              icon={LockIcon}
              endAdornment={
                <button
                  type="button"
                  onClick={handleClickShowConfirmPassword}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </button>
              }
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitButtonDisable}
            className={`w-full py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isSubmitButtonDisable 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando...
              </div>
            ) : 'Registrarse'}
          </button>
        </form>

        <div className="px-6 py-4 bg-gray-50 text-center">
          <p className="text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <button
              onClick={switchAuthHandler}
              className="text-blue-600 hover:text-blue-800 font-medium focus:outline-none"
              
            >
              <Link to={"/"} className="ml-2">Inicia sesión</Link>
            </button>
          </p>
        </div>
      </div>
      <div className="w-full md:w-1/2">
        <div id="carouselExampleCaptions" className="carousel slide carousel-fade" data-bs-ride="carousel">
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
            <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="3" aria-label="Slide 4"></button>
          </div>
          <div className="carousel-inner rounded-xl overflow-hidden shadow-lg">
            <div className="carousel-item active">
              <img 
                src="https://img.freepik.com/fotos-premium/disparo-vertical-mujer-sentada-banco-trabajando-su-computadora-portatil-dia-ventoso_182527-9268.jpg" 
                className="d-block w-100 h-100 object-cover" 
                alt="Seguridad bancaria"
              />
              <div className="carousel-caption d-none d-md-block bg-black bg-opacity-50 p-4 rounded">
                <h5 className="text-xl font-bold text-blue-300">Seguridad Avanzada</h5>
                <p className="text-white">Protegemos tus transacciones con tecnología biométrica de última generación.</p>
              </div>
            </div>
            <div className="carousel-item">
              <img 
                src="https://img.freepik.com/fotos-premium/jovenes-profesionales-creativos-trabajando-juntos-computadora-oficina-vertical-cerca_625516-1792.jpg" 
                className="d-block w-100 h-100 object-cover" 
                alt="Atención al cliente"
              />
              <div className="carousel-caption d-none d-md-block bg-black bg-opacity-50 p-4 rounded">
                <h5 className="text-xl font-bold text-green-300">Soporte 24/7</h5>
                <p className="text-white">Nuestro equipo está disponible para ayudarte en cualquier momento.</p>
              </div>
            </div>
            <div className="carousel-item">
              <img 
                src="https://img.freepik.com/fotos-premium/lugar-trabajo-persona-empresarial-oficina_622301-6598.jpg" 
                className="d-block w-100 h-100 object-cover" 
                alt="Tecnología bancaria"
              />
              <div className="carousel-caption d-none d-md-block bg-black bg-opacity-50 p-4 rounded">
                <h5 className="text-xl font-bold text-yellow-300">Tecnología Innovadora</h5>
                <p className="text-white">Accede a tu cuenta desde cualquier lugar con nuestra plataforma digital segura.</p>
              </div>
            </div>
            <div className="carousel-item">
              <img 
                src="https://img.freepik.com/foto-gratis/empresario-hispano-mediana-edad_23-2151099232.jpg?semt=ais_hybrid&w=740" 
                className="d-block w-100 h-100 object-cover" 
                alt="Asesoramiento financiero"
              />
              <div className="carousel-caption d-none d-md-block bg-black bg-opacity-50 p-4 rounded">
                <h5 className="text-xl font-bold text-purple-300">Asesoramiento Personalizado</h5>
                <p className="text-white">Nuestros expertos te ayudarán a tomar las mejores decisiones financieras.</p>
              </div>
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
        <div className="mt-6 bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-blue-600 mb-4">Banco Guatemalteco</h3>
          <p className="mb-4">Reforzará la seguridad al realizar:</p>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="bg-blue-100 text-blue-800 p-1 rounded-full mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
              Pagos de servicios e impuestos
            </li>
            <li className="flex items-center">
              <span className="bg-blue-100 text-blue-800 p-1 rounded-full mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
              Transferencias a terceros, móviles
            </li>
          </ul>
        </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Register;