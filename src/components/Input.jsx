import { useState } from 'react';

export const Input = ({
    field,
    label,
    value,
    onChangeHandler,
    type,
    showErrorMessage,
    validationMessage,
    onBlurHandler,
    textArea,
    autoComplete,
    icon: Icon,
    placeholder,
    endAdornment
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleValueChange = (event) => {
        onChangeHandler(event.target.value, field);
    }

    const handleInputBlur = (event) => {
        onBlurHandler(event.target.value, field);
    }

    return (
        <div className={`mb-4 ${showErrorMessage ? 'error' : ''}`}>
            <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-gray-400" />
                    </div>
                )}
                
                {textArea ? (
                    <textarea
                        id={field}
                        name={field}
                        value={value}
                        onChange={handleValueChange}
                        onBlur={handleInputBlur}
                        rows={5}
                        className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            showErrorMessage ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                        }`}
                        autoComplete={autoComplete}
                        placeholder={placeholder}
                    />
                ) : (
                    <input
                        id={field}
                        name={field}
                        type={type === 'password' && showPassword ? 'text' : type}
                        value={value}
                        onChange={handleValueChange}
                        onBlur={handleInputBlur}
                        className={`block w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            showErrorMessage ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                        }`}
                        autoComplete={autoComplete}
                        placeholder={placeholder}
                    />
                )}
                
                {endAdornment && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        {endAdornment}
                    </div>
                )}
            </div>
            
            {showErrorMessage && (
                <p className="mt-1 text-sm text-red-500">
                    {validationMessage}
                </p>
            )}
        </div>
    )
}