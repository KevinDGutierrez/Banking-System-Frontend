import React, { useEffect, useState } from 'react';
import Layout from '../layout/Layout';
import { useBanking } from '../../shared/hooks/useBanking';
import Swal from 'sweetalert2';
import { Tooltip, IconButton } from '@mui/material';
import bancoInnova from '../../assets/Banking1.png';
import { Copy, Globe, Currency, Calendar, Info, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

const Banking = () => {
    const { banking, handleGetBanking } = useBanking();
    const [isLoading, setIsLoading] = useState(true);
    const [expandedBank, setExpandedBank] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            await handleGetBanking();
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const copiarAlPortapapeles = (name) => {
        navigator.clipboard.writeText(name).then(() => {
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: '¡Copiado!',
                showConfirmButton: false,
                timer: 1500,
                background: '#4CAF50',
                color: 'white',
                customClass: {
                    popup: 'animate__animated animate__fadeInDown',
                }
            });
        });
    };

    const toggleExpand = (bankId) => {
        setExpandedBank(expandedBank === bankId ? null : bankId);
    };

    const getBankLogo = (bankName) => {
        switch (bankName.toLowerCase()) {
            case 'banco industrial':
                return 'https://images.seeklogo.com/logo-png/45/2/banco-industrial-guatemala-logo-png_seeklogo-454326.png';
            case 'bac credomatic':
                return 'https://www.aedcr.com/sites/default/files/2022-05/logo_bacredomatic.png';
            case 'banrural':
                return 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Nuevo_Logo_Banrural.png/1200px-Nuevo_Logo_Banrural.png';
            case 'banco innova':
                return bancoInnova;
            default:
                return 'https://via.placeholder.com/150';
        }
    };

    const getBankInfo = (bankName) => {
        switch (bankName.toLowerCase()) {
            case 'banco industrial':
                return {
                    description: 'En la actualidad ofrecemos servicios a través de una red de más 3,180 puntos de servicio en toda la República de Guatemala, así como acceso la más completa banca electrónica web y móvil desde cualquier lugar del mundo.',
                    extendedInfo: 'Somos una sólida organización financiera conscientes de nuestra responsabilidad para con nuestros clientes, nuestro personal, nuestra comunidad y nuestros accionistas. Nos esforzamos en satisfacer de manera eficiente y cumplida a nuestros clientes; creemos que nuestro personal debe ser estimulado, a fin de propiciar su desarrollo y promoción integral; que en nuestra comunidad deben ser exaltados los méritos de guatemaltecos prominentes y ejemplares, mediante la difusión de sus valores y riqueza humana; que nuestros accionistas deben lograr los mayores beneficios, garantizándoles siempre el mejor rendimiento por su inversión, pero fundamentalmente, creemos en la innovación, esa dinámica característica que nos ha convertido en la corporación líder del sector financiero regional. Lo que empezó como un sueño de varios empresarios del sector industrial guatemalteco, con el tiempo se convirtió en el principal banco del sistema bancario guatemalteco y uno de los principales grupos financiero de Centroamérica.',
                    link: 'https://www.corporacionbi.com/gt/bancoindustrial/sobre-el-banco/'
                };
            case 'bac credomatic':
                return {
                    description: 'Somos una organización con más de 70 años de experiencia en servicios financieros.',
                    extendedInfo: 'Somos una organización con más de 70 años de experiencia, que brinda productos y servicios financieros a más de 5 millones de clientes en toda la región, atendidos por más de 21.000 personas colaboradoras. Iniciamos operaciones en 1952 con la fundación del Banco de América en Nicaragua y en los años 70 nos destacamos como pioneros en la utilización de tarjetas de crédito. En los años 90 nos convertimos en el primer grupo financiero de América Central.',
                    link: 'https://www.baccredomatic.com/es-gt/nuestra-empresa/nosotros'
                };
            case 'banrural':
                return {
                    description: 'Grupo financiero orientado al desarrollo rural integral del país.',
                    extendedInfo: 'Somos un grupo financiero orientado al desarrollo rural integral del país, con capital privado y multisectorial con servicios de banca universal y cobertura nacional y regional, dirigido preferentemente al micro, pequeño y mediano empresario, agricultor y artesano.',
                    link: 'https://www.banrural.com.gt/site/conocenos/bancodedesarrollorural/banrural-mision-vision'
                };
            case 'banco innova':
                return {
                    description: 'Innovación financiera para el futuro digital.',
                    extendedInfo: 'Pioneros en soluciones bancarias digitales, comprometidos con la inclusión financiera y la tecnología de vanguardia. Nuestro enfoque centrado en el cliente redefine la experiencia bancaria tradicional.',
                    link: null
                };
        }
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="bg-white py-8 px-4 shadow-sm sticky top-0 z-10 border-b border-gray-200">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800">
                            Bancos Asociados
                        </h1>
                        <p className="text-center text-gray-600 mt-2">
                            Descubre nuestras instituciones financieras aliadas
                        </p>
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto px-4 py-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {banking.map((bank, index) => {
                                const bankInfo = getBankInfo(bank.name);
                                return (
                                    <div
                                        key={bank._id}
                                        className={`bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl transform hover:scale-[1.02] ${index % 2 === 0 ? 'animate-fade-in-left' : 'animate-fade-in-right'
                                            }`}
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="p-6 h-full flex flex-col">
                                            <div className="flex items-center mb-4">
                                                <img
                                                    src={getBankLogo(bank.name)}
                                                    alt={`Logo ${bank.name}`}
                                                    className="w-16 h-16 object-contain mr-4"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="text-xl font-bold text-gray-800">
                                                            {bank.name}
                                                        </h3>
                                                        <Tooltip title="Copiar nombre">
                                                            <IconButton
                                                                onClick={() => copiarAlPortapapeles(bank.name)}
                                                                className="text-gray-500 hover:text-blue-600 transition-colors"
                                                            >
                                                                <Copy size={18} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </div>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {bankInfo.description}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-3 mt-2">
                                                <div className="flex items-center bg-blue-50 p-3 rounded-lg">
                                                    <Currency size={18} className="text-blue-600 mr-3" />
                                                    <div>
                                                        <span className="text-sm text-gray-600">Moneda: </span>
                                                        <span className="ml-1 font-medium text-blue-800">Q{bank.moneda}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center bg-green-50 p-3 rounded-lg">
                                                    <Globe size={18} className="text-green-600 mr-3" />
                                                    <div>
                                                        <span className="text-sm text-gray-600">País: </span>
                                                        <span className="ml-1 font-medium text-green-800">{bank.pais}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center bg-gray-50 p-3 rounded-lg text-sm">
                                                    <Calendar size={16} className="text-gray-500 mr-3" />
                                                    <span className="text-gray-600">Creado: {new Date(bank.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>

                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <button
                                                    onClick={() => toggleExpand(bank._id)}
                                                    className="flex items-center justify-between w-full text-blue-600 hover:text-blue-800 transition-colors"
                                                >
                                                    <span className="font-medium">Más información</span>
                                                    {expandedBank === bank._id ? (
                                                        <ChevronUp size={20} />
                                                    ) : (
                                                        <ChevronDown size={20} />
                                                    )}
                                                </button>

                                                {expandedBank === bank._id && (
                                                    <div className="mt-3 animate-fade-in">
                                                        <div className="bg-gray-50 p-4 rounded-lg">
                                                            <p className="text-gray-700 text-sm">{bankInfo.extendedInfo}</p>
                                                            {bankInfo.link && (
                                                                <a
                                                                    href={bankInfo.link}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center mt-3 text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium"
                                                                >
                                                                    Conoce más de {bank.name}
                                                                    <ExternalLink size={16} className="ml-1" />
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes fadeInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes fadeInRight {
                    from {
                        opacity: 0;
                        transform: translateX(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                .animate-fade-in-left {
                    animation: fadeInLeft 0.6s ease-out forwards;
                }
                
                .animate-fade-in-right {
                    animation: fadeInRight 0.6s ease-out forwards;
                }
                
                .animate-fade-in {
                    animation: fadeInLeft 0.4s ease-out forwards;
                }
            `}</style>
        </Layout>
    );
};

export default Banking;