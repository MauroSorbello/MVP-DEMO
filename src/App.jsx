import React, { useState, useMemo } from 'react';
import {
    Users,
    Activity,
    FileText,
    Calendar,
    Settings,
    LogOut,
    Plus,
    Search,
    UserPlus,
    Edit,
    Trash2,
    ChevronRight,
    Clipboard,
    File,
    Download,
    Eye,
    Stethoscope,
    LayoutDashboard,
    CheckCircle,
    AlertCircle,
    TrendingUp,
    BarChart2,
    Thermometer,
    X
} from 'lucide-react';

// --- DATOS MOCKEADOS (Base de datos simulada) ---

const MOCK_KINESIOLOGOS = [
    { id: 1, nombre: 'Lic. Juan Pérez', especialidad: 'Traumatología', email: 'juan@clinica.com', estado: 'Activo' },
    { id: 2, nombre: 'Lic. María González', especialidad: 'Deportiva', email: 'maria@clinica.com', estado: 'Activo' },
    { id: 3, nombre: 'Lic. Carlos Ruiz', especialidad: 'Neurología', email: 'carlos@clinica.com', estado: 'Licencia' },
];

const PROTOCOLOS = [
    {
        id: 1,
        titulo: 'Dolor Lumbar Inespecífico',
        icono: 'activity',
        pasos: [
            'Anamnesis y evaluación de banderas rojas.',
            'Aplicación de calor local (15 min).',
            'Masaje descontracturante zona lumbar y glútea.',
            'Ejercicios de movilidad pélvica (Gato-Camello).',
            'Educación sobre higiene postural.'
        ]
    },
    {
        id: 2,
        titulo: 'Esguince de Tobillo (Fase Aguda)',
        icono: 'alert',
        pasos: [
            'Protocolo PRICE (Protección, Reposo, Hielo, Compresión, Elevación).',
            'Drenaje linfático manual.',
            'Movilizaciones pasivas suaves.',
            'Vendaje funcional si es necesario.'
        ]
    },
    {
        id: 3,
        titulo: 'Cervicalgia Tensional',
        icono: 'user',
        pasos: [
            'Evaluación de movilidad cervical.',
            'Terapia manual suboccipital.',
            'Estiramientos de trapecios y ECOM.',
            'Ejercicios de retracción cervical (Chin tucks).'
        ]
    },
    {
        id: 4,
        titulo: 'Tendinitis de Hombro',
        icono: 'activity',
        pasos: [
            'Ultrasonido o Magnetoterapia.',
            'Masaje transverso profundo (Cyriax).',
            'Ejercicios pendulares de Codman.',
            'Fortalecimiento isométrico del manguito rotador.'
        ]
    }
];

// Nombres actualizados para coincidir con PROTOCOLOS
const MOCK_PACIENTES = [
    { id: 101, nombre: 'Ana López', edad: 34, obraSocial: 'OSDE', kinesiologoId: 1, estado: 'En Tratamiento', telefono: '555-0101', ultimoProtocolo: 'Dolor Lumbar Inespecífico' },
    { id: 102, nombre: 'Roberto Díaz', edad: 58, obraSocial: 'Swiss Medical', kinesiologoId: 2, estado: 'Evaluación', telefono: '555-0102', ultimoProtocolo: 'Esguince de Tobillo (Fase Aguda)' },
    { id: 103, nombre: 'Carla Sanzio', edad: 25, obraSocial: 'Particular', kinesiologoId: 1, estado: 'Alta', telefono: '555-0103', ultimoProtocolo: 'Cervicalgia Tensional' },
    { id: 104, nombre: 'Miguel Torres', edad: 45, obraSocial: 'Galeno', kinesiologoId: null, estado: 'Espera', telefono: '555-0104', ultimoProtocolo: null },
];

// ESTRUCTURA SOAP MEJORADA
const MOCK_HISTORIAS = [
    {
        id: 1,
        pacienteId: 101,
        fecha: '2023-10-25',
        tipo: 'Evaluación Inicial',
        subjetivo: 'Paciente refiere dolor punzante en zona lumbar baja al agacharse. Intensidad aumenta por la mañana.',
        objetivo: 'Test de Lasègue negativo. Contractura palpable en cuadrado lumbar derecho. Movilidad reducida en flexión de tronco.',
        analisis: 'Lumbalgia mecánica inespecífica.',
        plan: 'Magnetoterapia 20min + Masaje descontracturante + Enseñaza de higiene postural.',
        eva: 8,
        profesional: 'Lic. Juan Pérez'
    },
    {
        id: 2,
        pacienteId: 101,
        fecha: '2023-10-27',
        tipo: 'Evolución',
        subjetivo: 'Refiere leve mejoría, ya no siente puntadas al levantarse de la silla.',
        objetivo: 'Mejor movilidad pélvica. Tono muscular lumbar disminuido respecto a sesión anterior.',
        analisis: 'Evolución favorable.',
        plan: 'Repite fisioterapia. Se agregan ejercicios de movilidad pélvica (Gato-Camello).',
        eva: 5,
        profesional: 'Lic. Juan Pérez'
    },
    {
        id: 3,
        pacienteId: 102,
        fecha: '2023-10-26',
        tipo: 'Evaluación Inicial',
        subjetivo: 'Sensación de inestabilidad en rodilla derecha tras giro brusco jugando al fútbol.',
        objetivo: 'Edema leve suprapatelar. Cajón anterior dudoso. Lachman positivo (+).',
        analisis: 'Probable lesión de LCA. Se requiere confirmación por imagen.',
        plan: 'Protocolo PRICE. Se confecciona orden para RM. Reposo deportivo.',
        eva: 6,
        profesional: 'Lic. María González'
    },
];

const MOCK_ARCHIVOS = [
    { id: 1, pacienteId: 101, nombre: 'Resonancia_Lumbar.pdf', tipo: 'Informe', fecha: '2023-10-20' },
    { id: 2, pacienteId: 101, nombre: 'Placa_Columna.jpg', tipo: 'Imagen', fecha: '2023-10-20' },
    { id: 3, pacienteId: 102, nombre: 'Orden_Medica.pdf', tipo: 'Receta', fecha: '2023-10-26' },
];

// Datos para las gráficas
const MOCK_CHART_PATIENTS = [
    { label: 'May', value: 12 },
    { label: 'Jun', value: 18 },
    { label: 'Jul', value: 15 },
    { label: 'Ago', value: 24 },
    { label: 'Sep', value: 28 },
    { label: 'Oct', value: 35 },
];

const MOCK_CHART_SESSIONS = [
    { label: 'Sem 1', value: 45 },
    { label: 'Sem 2', value: 52 },
    { label: 'Sem 3', value: 48 },
    { label: 'Sem 4', value: 60 },
];

// --- COMPONENTES AUXILIARES ---

// Componente simple de Gráfico de Barras SVG
const SimpleBarChart = ({ data, colorClass = "bg-blue-500", height = 150 }) => {
    const maxValue = Math.max(...data.map(d => d.value));

    return (
        <div className="flex items-end justify-between gap-2 pt-8" style={{ height: `${height}px` }}>
            {data.map((d, i) => (
                <div key={i} className="flex flex-col items-center flex-1 group relative h-full justify-end">
                    <div
                        className={`w-full max-w-[30px] rounded-t-sm opacity-80 group-hover:opacity-100 transition-all duration-300 ${colorClass}`}
                        style={{ height: `${(d.value / maxValue) * 80}%` }}
                    >
                        {/* Tooltip */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            {d.value}
                        </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium mt-2">{d.label}</span>
                </div>
            ))}
        </div>
    );
};

const StatCard = ({ title, value, subtext, color, icon: Icon = Activity }) => {
    const styles = {
        green: 'bg-green-100 text-green-600',
        blue: 'bg-blue-100 text-blue-600',
        yellow: 'bg-yellow-100 text-yellow-600',
        red: 'bg-red-100 text-red-600',
        purple: 'bg-purple-100 text-purple-600',
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between hover:shadow-md transition-shadow">
            <div>
                <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
                <p className="text-xs mt-2 text-slate-500">{subtext}</p>
            </div>
            <div className={`p-3 rounded-lg ${styles[color] || styles.blue}`}>
                <Icon size={24} />
            </div>
        </div>
    );
};

const Badge = ({ children, type }) => {
    const styles = {
        green: 'bg-green-100 text-green-700',
        blue: 'bg-blue-100 text-blue-700',
        yellow: 'bg-yellow-100 text-yellow-700',
        gray: 'bg-slate-100 text-slate-600',
        red: 'bg-red-100 text-red-700',
        purple: 'bg-purple-100 text-purple-700',
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[type] || styles.gray}`}>
            {children}
        </span>
    );
};

// Componente para visualizar el nivel de dolor EVA
const EvaIndicator = ({ value }) => {
    const getColor = (v) => {
        if (v <= 3) return 'bg-green-500';
        if (v <= 6) return 'bg-yellow-500';
        if (v <= 8) return 'bg-orange-500';
        return 'bg-red-500';
    };

    return (
        <div className="flex items-center gap-2" title={`Escala de Dolor (EVA): ${value}/10`}>
            <Thermometer size={16} className="text-slate-400" />
            <div className="flex-1 h-2 w-24 bg-slate-100 rounded-full overflow-hidden">
                <div
                    className={`h-full ${getColor(value)}`}
                    style={{ width: `${value * 10}%` }}
                ></div>
            </div>
            <span className={`text-xs font-bold ${getColor(value).replace('bg-', 'text-')}`}>{value}/10</span>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL ---

export default function KineSystem() {
    // Estado Global
    const [userRole, setUserRole] = useState(null); // 'admin' | 'kine'
    const [currentView, setCurrentView] = useState('dashboard');

    // Estados de Datos
    const [pacientes, setPacientes] = useState(MOCK_PACIENTES);
    const [kinesiologos, setKinesiologos] = useState(MOCK_KINESIOLOGOS);
    const [historias, setHistorias] = useState(MOCK_HISTORIAS);
    const [archivos, setArchivos] = useState(MOCK_ARCHIVOS);

    // Estados de UI
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedProtocol, setSelectedProtocol] = useState(null); // Para el modal de protocolo
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(''); // 'newPatient', 'newRecord', 'viewProtocol'

    // Estado para el formulario de EVA (slider)
    const [evaValue, setEvaValue] = useState(0);

    // --- LOGICA DE LOGIN ---
    if (!userRole) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
                    <div className="flex justify-center mb-6">
                        <div className="bg-blue-600 p-4 rounded-xl">
                            <Activity className="text-white h-10 w-10" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">KineSystem</h1>
                    <p className="text-slate-500 mb-8">Sistema de Gestión Clínica Kinesiológica</p>

                    <div className="space-y-4">
                        <button
                            onClick={() => { setUserRole('admin'); setCurrentView('dashboard'); }}
                            className="w-full bg-slate-800 hover:bg-slate-900 text-white p-4 rounded-xl flex items-center justify-center transition-all"
                        >
                            <LayoutDashboard className="mr-2" size={20} />
                            Ingresar como Administrador
                        </button>
                        <button
                            onClick={() => { setUserRole('kine'); setCurrentView('mypatients'); }}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl flex items-center justify-center transition-all"
                        >
                            <Stethoscope className="mr-2" size={20} />
                            Ingresar como Kinesiólogo
                        </button>
                    </div>
                    <p className="mt-6 text-xs text-slate-400">Versión MVP 1.3.0 (Protocolos Interactivos)</p>
                </div>
            </div>
        );
    }

    // --- LÓGICA DE FILTRADO ---
    const filteredPacientes = pacientes.filter(p => {
        const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase());
        if (userRole === 'kine') {
            return matchesSearch && p.kinesiologoId === 1;
        }
        return matchesSearch;
    });

    // --- ACCIONES ---
    const handleAddPatient = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newPatient = {
            id: Date.now(),
            nombre: formData.get('nombre'),
            edad: formData.get('edad'),
            obraSocial: formData.get('obraSocial'),
            telefono: formData.get('telefono'),
            kinesiologoId: userRole === 'admin' ? parseInt(formData.get('kinesiologoId')) : 1, // Si es kine se auto asigna
            estado: 'Evaluación'
        };
        setPacientes([...pacientes, newPatient]);
        setIsModalOpen(false);
    };

    const handleAddRecord = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        // Capturamos los datos del formulario SOAP
        const newRecord = {
            id: Date.now(),
            pacienteId: selectedPatient.id,
            fecha: new Date().toISOString().split('T')[0],
            tipo: formData.get('tipo'), // Evolución o Evaluación
            subjetivo: formData.get('subjetivo'), // S
            objetivo: formData.get('objetivo'), // O
            analisis: formData.get('analisis'), // A
            plan: formData.get('plan'), // P
            eva: parseInt(evaValue), // Escala de dolor
            profesional: userRole === 'admin' ? 'Admin' : 'Lic. Juan Pérez'
        };
        setHistorias([newRecord, ...historias]);
        setEvaValue(0); // Reset EVA
        // No cerramos modal porque ahora es inline, o limpiamos el formulario
        e.target.reset();
    };

    const openProtocolModal = (protocolName) => {
        const protocol = PROTOCOLOS.find(p => p.titulo === protocolName);
        if (protocol) {
            setSelectedProtocol(protocol);
            setModalType('viewProtocol');
            setIsModalOpen(true);
        }
    };

    // --- COMPONENTES DE VISTAS ---

    const DashboardView = () => {
        const activePatients = pacientes.filter(p => p.estado === 'En Tratamiento' || p.estado === 'Evaluación').length;
        const waitingPatients = pacientes.filter(p => p.estado === 'Espera').length;
        const dischargedPatients = pacientes.filter(p => p.estado === 'Alta').length;

        return (
            <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold text-slate-800">Panel de Control - Gestión de Pacientes</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Pacientes Activos"
                        value={activePatients}
                        subtext="En tratamiento actualmente"
                        color="blue"
                        icon={Users}
                    />
                    <StatCard
                        title="En Lista de Espera"
                        value={waitingPatients}
                        subtext="Pendientes de asignación"
                        color="yellow"
                        icon={AlertCircle}
                    />
                    <StatCard
                        title="Pacientes de Alta"
                        value={dischargedPatients}
                        subtext="Total histórico acumulado"
                        color="green"
                        icon={CheckCircle}
                    />
                    <StatCard
                        title="Sesiones Realizadas"
                        value="205"
                        subtext="Último mes calendario"
                        color="purple"
                        icon={Activity}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                <TrendingUp size={18} className="text-blue-500" />
                                Pacientes Nuevos (Últimos 6 meses)
                            </h3>
                            <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded">+15% vs semestre anterior</span>
                        </div>
                        <SimpleBarChart data={MOCK_CHART_PATIENTS} colorClass="bg-blue-500" />
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                <BarChart2 size={18} className="text-purple-500" />
                                Sesiones Semanales (Mes Actual)
                            </h3>
                            <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded">Objetivo: 60/sem</span>
                        </div>
                        <SimpleBarChart data={MOCK_CHART_SESSIONS} colorClass="bg-purple-500" />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-semibold text-slate-800">Últimos Pacientes Registrados</h3>
                        <button className="text-sm text-blue-600 font-medium hover:text-blue-700">Ver todos</button>
                    </div>
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
                            <tr>
                                <th className="px-6 py-3">Paciente</th>
                                <th className="px-6 py-3">Obra Social</th>
                                <th className="px-6 py-3">Profesional</th>
                                <th className="px-6 py-3">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {pacientes.slice(-4).reverse().map(p => (
                                <tr key={p.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-800">{p.nombre}</td>
                                    <td className="px-6 py-4">{p.obraSocial}</td>
                                    <td className="px-6 py-4">
                                        {kinesiologos.find(k => k.id === p.kinesiologoId)?.nombre || 'Sin asignar'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge type={p.estado === 'Alta' ? 'green' : p.estado === 'Espera' ? 'yellow' : 'blue'}>
                                            {p.estado}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const PatientsView = () => (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-2xl font-bold text-slate-800">
                    {userRole === 'admin' ? 'Gestión de Pacientes' : 'Mis Pacientes'}
                </h2>
                <button
                    onClick={() => { setModalType('newPatient'); setIsModalOpen(true); }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <UserPlus size={18} />
                    Nuevo Paciente
                </button>
            </div>

            {/* Barra de Búsqueda */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-2">
                <Search className="text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    className="flex-1 outline-none text-slate-700"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Lista */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
                            <tr>
                                <th className="px-6 py-3">Nombre</th>
                                <th className="px-6 py-3">Edad</th>
                                <th className="px-6 py-3">Obra Social</th>
                                {userRole === 'admin' && <th className="px-6 py-3">Kinesiólogo</th>}
                                <th className="px-6 py-3">Último Protocolo</th>
                                <th className="px-6 py-3">Estado</th>
                                <th className="px-6 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredPacientes.map(p => {
                                const protocolData = PROTOCOLOS.find(pro => pro.titulo === p.ultimoProtocolo);

                                return (
                                    <tr key={p.id} className="hover:bg-slate-50 group">
                                        <td className="px-6 py-4 font-medium text-slate-900">{p.nombre}</td>
                                        <td className="px-6 py-4">{p.edad}</td>
                                        <td className="px-6 py-4">{p.obraSocial}</td>
                                        {userRole === 'admin' && (
                                            <td className="px-6 py-4">
                                                {kinesiologos.find(k => k.id === p.kinesiologoId)?.nombre || <span className="text-red-400 italic">Sin Asignar</span>}
                                            </td>
                                        )}
                                        <td className="px-6 py-4">
                                            {p.ultimoProtocolo ? (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (protocolData) openProtocolModal(p.ultimoProtocolo);
                                                    }}
                                                    className={`flex items-center gap-1.5 px-2 py-1 rounded-lg w-fit border transition-colors text-xs text-left ${protocolData ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 cursor-pointer' : 'bg-slate-50 text-slate-500 border-slate-100 cursor-default'}`}
                                                >
                                                    <Clipboard size={14} className={protocolData ? "text-blue-500" : "text-slate-400"} />
                                                    <span className="truncate max-w-[150px]" title={p.ultimoProtocolo}>{p.ultimoProtocolo}</span>
                                                </button>
                                            ) : (
                                                <span className="text-slate-400 italic text-xs pl-2">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge type={p.estado === 'Alta' ? 'green' : 'blue'}>{p.estado}</Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => { setSelectedPatient(p); setCurrentView('history'); }}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg tooltip" title="Historia Clínica"
                                                >
                                                    <Clipboard size={18} />
                                                </button>
                                                <button
                                                    onClick={() => { setSelectedPatient(p); setCurrentView('files'); }}
                                                    className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg" title="Archivos"
                                                >
                                                    <File size={18} />
                                                </button>
                                                {userRole === 'admin' && (
                                                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                {filteredPacientes.length === 0 && (
                    <div className="p-8 text-center text-slate-500">
                        No se encontraron pacientes.
                    </div>
                )}
            </div>
        </div>
    );

    const ClinicalHistoryView = () => {
        if (!selectedPatient) return <div className="text-center p-10">Seleccione un paciente primero.</div>;

        const patientRecords = historias.filter(h => h.pacienteId === selectedPatient.id);

        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => setCurrentView(userRole === 'admin' ? 'patients' : 'mypatients')} className="text-slate-400 hover:text-slate-600">
                        <ChevronRight className="rotate-180" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Historia Clínica Digital</h2>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <span className="font-semibold text-slate-700">{selectedPatient.nombre}</span>
                            <span>•</span>
                            <span>{selectedPatient.edad} años</span>
                            <span>•</span>
                            <span>{selectedPatient.obraSocial}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                    {/* Columna Izquierda: Nueva Evolución (Formato SOAP) */}
                    <div className="xl:col-span-4">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 sticky top-6">
                            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                                <Plus size={18} className="text-blue-600" /> Nueva Evolución
                            </h3>
                            <form onSubmit={handleAddRecord} className="space-y-4">

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">TIPO DE NOTA</label>
                                        <select name="tipo" className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none">
                                            <option value="Evolución">Evolución Diaria</option>
                                            <option value="Evaluación Inicial">Evaluación Inicial</option>
                                            <option value="Reevaluación">Reevaluación</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">ESCALA EVA (0-10)</label>
                                        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                                            <input
                                                type="number"
                                                min="0"
                                                max="10"
                                                value={evaValue}
                                                onChange={(e) => setEvaValue(e.target.value)}
                                                className="w-10 bg-transparent text-center font-bold text-sm outline-none"
                                            />
                                            <div className="h-2 flex-1 bg-slate-200 rounded-full relative">
                                                <div className={`absolute h-full rounded-full ${evaValue > 7 ? 'bg-red-500' : evaValue > 4 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${evaValue * 10}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-blue-600 mb-1">(S) SUBJETIVO</label>
                                    <textarea name="subjetivo" rows="2" className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-300" placeholder="¿Qué refiere el paciente? Sintomatología actual..." required />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-blue-600 mb-1">(O) OBJETIVO</label>
                                    <textarea name="objetivo" rows="2" className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-300" placeholder="Examen físico, movilidad, fuerza, tests..." required />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-blue-600 mb-1">(A) ANÁLISIS / DIAGNÓSTICO</label>
                                    <input name="analisis" className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-300" placeholder="Evaluación profesional..." />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-blue-600 mb-1">(P) PLAN / TRATAMIENTO</label>
                                    <textarea name="plan" rows="3" className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-300" placeholder="Técnicas aplicadas y pasos a seguir..." required />
                                </div>

                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                                    Guardar Registro
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Columna Derecha: Timeline Cronológico */}
                    <div className="xl:col-span-8 space-y-4">
                        {patientRecords.length === 0 ? (
                            <div className="bg-slate-50 p-8 rounded-xl text-center text-slate-500 border-2 border-dashed border-slate-200">
                                Aún no hay registros médicos para este paciente.
                            </div>
                        ) : (
                            patientRecords.map(record => (
                                <div key={record.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                                    {/* Header del Registro */}
                                    <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2 py-1 rounded text-xs font-bold border ${record.tipo === 'Evaluación Inicial' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                                                {record.tipo.toUpperCase()}
                                            </span>
                                            <span className="text-sm font-medium text-slate-600">{record.fecha}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <EvaIndicator value={record.eva} />
                                            <span className="text-xs text-slate-400 italic">Por: {record.profesional}</span>
                                        </div>
                                    </div>

                                    {/* Cuerpo SOAP */}
                                    <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <span className="text-xs font-bold text-slate-400 block mb-1">SUBJETIVO</span>
                                                <p className="text-sm text-slate-700 leading-relaxed">{record.subjetivo}</p>
                                            </div>
                                            <div>
                                                <span className="text-xs font-bold text-slate-400 block mb-1">OBJETIVO</span>
                                                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-2 rounded border border-slate-100">{record.objetivo}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <span className="text-xs font-bold text-slate-400 block mb-1">ANÁLISIS</span>
                                                <p className="text-sm text-slate-800 font-medium">{record.analisis}</p>
                                            </div>
                                            <div>
                                                <span className="text-xs font-bold text-slate-400 block mb-1">PLAN / TRATAMIENTO</span>
                                                <p className="text-sm text-slate-700 leading-relaxed bg-blue-50 p-2 rounded border border-blue-100 text-blue-900">{record.plan}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const ProtocolsView = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Protocolos Clínicos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {PROTOCOLOS.map(proto => (
                    <div key={proto.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <CheckCircle size={18} className="text-green-500" />
                                {proto.titulo}
                            </h3>
                        </div>
                        <div className="p-6">
                            <ul className="space-y-3">
                                {proto.pasos.map((paso, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                                        <span className="bg-blue-100 text-blue-700 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                            {idx + 1}
                                        </span>
                                        {paso}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const FilesView = () => {
        if (!selectedPatient) return <div className="text-center p-10">Seleccione un paciente primero desde la lista.</div>;
        const patientFiles = archivos.filter(a => a.pacienteId === selectedPatient.id);

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setCurrentView(userRole === 'admin' ? 'patients' : 'mypatients')} className="text-slate-400 hover:text-slate-600">
                            <ChevronRight className="rotate-180" />
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">Gestión de Archivos</h2>
                            <p className="text-slate-500">Paciente: {selectedPatient.nombre}</p>
                        </div>
                    </div>
                    <button className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-slate-700">
                        <Plus size={16} /> Subir Archivo
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {patientFiles.length === 0 ? (
                        <div className="col-span-3 text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                            <File className="mx-auto h-12 w-12 text-slate-300 mb-2" />
                            <p className="text-slate-500">No hay archivos adjuntos.</p>
                        </div>
                    ) : (
                        patientFiles.map(file => (
                            <div key={file.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between h-40">
                                <div className="flex items-start justify-between">
                                    <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                                        <FileText size={24} />
                                    </div>
                                    <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">{file.tipo}</span>
                                </div>
                                <div>
                                    <h4 className="font-medium text-slate-800 truncate" title={file.nombre}>{file.nombre}</h4>
                                    <p className="text-xs text-slate-400">{file.fecha}</p>
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <button className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 py-1.5 rounded text-xs font-medium flex items-center justify-center gap-1">
                                        <Eye size={14} /> Ver
                                    </button>
                                    <button className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 py-1.5 rounded text-xs font-medium flex items-center justify-center gap-1">
                                        <Download size={14} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    };

    const KinesiologistListView = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Staff de Kinesiólogos</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                    <UserPlus size={18} /> Nuevo Profesional
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
                        <tr>
                            <th className="px-6 py-3">Profesional</th>
                            <th className="px-6 py-3">Especialidad</th>
                            <th className="px-6 py-3">Pacientes Activos</th>
                            <th className="px-6 py-3">Estado</th>
                            <th className="px-6 py-3 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {kinesiologos.map(k => {
                            const countPatients = pacientes.filter(p => p.kinesiologoId === k.id && p.estado !== 'Alta').length;
                            return (
                                <tr key={k.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                                                {k.nombre.charAt(4)}
                                            </div>
                                            <div>
                                                <div className="font-medium">{k.nombre}</div>
                                                <div className="text-xs text-slate-400">{k.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{k.especialidad}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold text-slate-600">
                                            {countPatients}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge type={k.estado === 'Activo' ? 'green' : 'yellow'}>{k.estado}</Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-400 hover:text-blue-600">
                                            <Edit size={16} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );

    // --- RENDERIZADO PRINCIPAL ---

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">

            {/* SIDEBAR */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-10">
                <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                    <Activity className="text-blue-400" />
                    <h1 className="text-xl font-bold tracking-tight">KineSystem</h1>
                </div>

                <nav className="flex-1 py-6 px-3 space-y-1">
                    {userRole === 'admin' && (
                        <button
                            onClick={() => setCurrentView('dashboard')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                        >
                            <LayoutDashboard size={20} /> Dashboard
                        </button>
                    )}

                    <button
                        onClick={() => setCurrentView(userRole === 'admin' ? 'patients' : 'mypatients')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${['patients', 'mypatients', 'history', 'files'].includes(currentView) ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <Users size={20} /> {userRole === 'admin' ? 'Pacientes' : 'Mis Pacientes'}
                    </button>

                    {userRole === 'admin' && (
                        <button
                            onClick={() => setCurrentView('kinesiologos')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'kinesiologos' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                        >
                            <Stethoscope size={20} /> Kinesiólogos
                        </button>
                    )}

                    <button
                        onClick={() => setCurrentView('protocols')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'protocols' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <CheckCircle size={20} /> Protocolos
                    </button>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
                            {userRole === 'admin' ? 'AD' : 'JP'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate">{userRole === 'admin' ? 'Administrador' : 'Lic. Juan Pérez'}</p>
                            <p className="text-xs text-slate-500 truncate">{userRole === 'admin' ? 'Gerencia' : 'Kinesiología'}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => { setUserRole(null); setSelectedPatient(null); }}
                        className="w-full flex items-center justify-center gap-2 text-sm text-red-400 hover:bg-slate-800 py-2 rounded transition-colors"
                    >
                        <LogOut size={16} /> Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 ml-64 p-8">
                {currentView === 'dashboard' && userRole === 'admin' && <DashboardView />}
                {(currentView === 'patients' || currentView === 'mypatients') && <PatientsView />}
                {currentView === 'kinesiologos' && userRole === 'admin' && <KinesiologistListView />}
                {currentView === 'history' && <ClinicalHistoryView />}
                {currentView === 'protocols' && <ProtocolsView />}
                {currentView === 'files' && <FilesView />}
            </main>

            {/* MODAL GLOBAL SIMPLIFICADO */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-800">
                                {modalType === 'newPatient' ? 'Registrar Nuevo Paciente' :
                                    modalType === 'viewProtocol' ? 'Detalle de Protocolo' : 'Nueva Acción'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6">
                            {modalType === 'newPatient' && (
                                <form onSubmit={handleAddPatient} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
                                        <input name="nombre" required className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Edad</label>
                                            <input name="edad" type="number" className="w-full p-2 border border-slate-300 rounded-lg outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                                            <input name="telefono" className="w-full p-2 border border-slate-300 rounded-lg outline-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Obra Social</label>
                                        <input name="obraSocial" className="w-full p-2 border border-slate-300 rounded-lg outline-none" />
                                    </div>
                                    {userRole === 'admin' && (
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Asignar Profesional</label>
                                            <select name="kinesiologoId" className="w-full p-2 border border-slate-300 rounded-lg outline-none bg-white">
                                                <option value="">Seleccionar...</option>
                                                {kinesiologos.map(k => <option key={k.id} value={k.id}>{k.nombre}</option>)}
                                            </select>
                                        </div>
                                    )}
                                    <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 mt-4">
                                        Crear Paciente
                                    </button>
                                </form>
                            )}

                            {modalType === 'viewProtocol' && selectedProtocol && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                                            <Activity size={24} />
                                        </div>
                                        <h4 className="text-xl font-bold text-slate-800">{selectedProtocol.titulo}</h4>
                                    </div>
                                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                                        <h5 className="text-sm font-bold text-slate-500 mb-3 uppercase tracking-wide">Pasos del Tratamiento</h5>
                                        <ul className="space-y-3">
                                            {selectedProtocol.pasos.map((paso, idx) => (
                                                <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                                                    <span className="bg-white border border-slate-200 text-slate-600 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm">
                                                        {idx + 1}
                                                    </span>
                                                    <span className="pt-0.5">{paso}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="flex justify-end pt-2">
                                        <button
                                            onClick={() => setIsModalOpen(false)}
                                            className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-700 transition-colors"
                                        >
                                            Cerrar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}