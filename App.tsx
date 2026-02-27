
import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Search, 
  Package, 
  Warehouse, 
  MapPin, 
  Phone, 
  Mail, 
  ChevronRight, 
  Globe, 
  Clock,
  Menu,
  X,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

import Seo from './src/components/Seo';

// --- Types ---
interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface Client {
  name: string;
  logo: string;
}

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Nosotros', href: '#nosotros' },
    { name: 'Servicios', href: '#servicios' },
    { name: 'Rastreo', href: '#rastreo' },
    { name: 'Clientes', href: '#clientes' },
    { name: 'Contacto', href: '#contacto' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center space-x-3 group cursor-pointer">
          <img src="/img/logo_unirex.png" alt="UNIREX" className="h-10 w-auto" />
          <span className={`text-2xl font-bold tracking-tighter ${scrolled ? 'text-blue-900' : 'text-white'}`}>
            UNIREX <span className="text-red-600">S.A.S</span>
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className={`font-medium hover:text-red-600 transition-colors ${scrolled ? 'text-slate-700' : 'text-white'}`}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className={scrolled ? 'text-blue-900' : 'text-white'} /> : <Menu className={scrolled ? 'text-blue-900' : 'text-white'} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white absolute top-full left-0 w-full shadow-xl border-t animate-in slide-in-from-top duration-300">
          <div className="flex flex-col p-6 space-y-4">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsOpen(false)}
                className="text-slate-800 font-semibold text-lg hover:text-blue-600 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

const REMESA_BASE_URL = 'https://unirexsas.com/api_unirex/remesas/upload_remesa.php?img=';

const TrackingTool = () => {
  const [guide, setGuide] = useState('');
  const [status, setStatus] = useState<null | { stage: string; location: string; update: string; remesa: string | null }>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRemesa, setShowRemesa] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guide) return;
    setLoading(true);
    setStatus(null);
    setError(null);
    setShowRemesa(false);

    try {
      const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEiLCJlbWFpbCI6ImVsbWVqb3JiQGdtYWlsLmNvbSIsImlkX3RpcG9zX3VzdWFyaW8iOiIxIiwiQVBJX1RJTUUiOjE3Njg4NjAwMjd9.bLUleQ-lWBBBrwlIUi2em47-tjli0ACqpasSFBAV8hg';
      const response = await fetch(`https://unirexsas.com/api_unirex/index.php/guias/buscarguia/${guide}/${token}`);
      const data = await response.json();

      if (data.error || !data.guia || data.guia.length === 0) {
        setError('No se encontró información para esta guía');
        setLoading(false);
        return;
      }

      const guiaData = data.guia[0];
      const fechaUpdate = guiaData.fecha_update || guiaData.fecha_registro;

      setStatus({
        stage: guiaData.nombre_estado_guia || 'Desconocido',
        location: guiaData.mun_nombre ? guiaData.mun_nombre.toUpperCase() : 'Sin ubicación',
        update: fechaUpdate,
        remesa: guiaData.remesa || null,
      });
      setLoading(false);
    } catch (err) {
      setError('Error al consultar la guía. Intenta de nuevo.');
      setLoading(false);
    }
  };

  return (
    <section id="rastreo" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 skew-x-12 translate-x-20"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Localiza tu Mercancía</h2>
          <p className="text-slate-400 mb-10 text-lg">Ingresa tu número de guía para conocer el estado actual y la ubicación de tu paquete en tiempo real.</p>
          
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-12">
            <div className="flex-grow relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Ej: UNX-2024-9031"
                value={guide}
                onChange={(e) => setGuide(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 px-10 py-4 rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>Rastrear <ChevronRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          {error && (
            <div className="bg-red-900/20 border border-red-500 p-6 rounded-xl text-center">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {status && (
            <div className="bg-slate-800 p-8 rounded-2xl border border-blue-500/30 text-left animate-in fade-in slide-in-from-bottom-4">
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <p className="text-slate-400 text-sm uppercase tracking-wider mb-1 font-semibold">Estado</p>
                  <p className="text-xl font-bold text-blue-400 flex items-center gap-2">
                    <Clock className="w-5 h-5" /> {status.stage}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm uppercase tracking-wider mb-1 font-semibold">Población</p>
                  <p className="text-xl font-bold flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-red-600" /> {status.location}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm uppercase tracking-wider mb-1 font-semibold">Fecha y Hora</p>
                  <p className="text-lg">{status.update}</p>
                </div>
              </div>
              {status.remesa && (
                <div className="mt-6 pt-6 border-t border-slate-700">
                  <button
                    onClick={() => setShowRemesa(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2"
                  >
                    <Package className="w-5 h-5" /> Ver Remesa
                  </button>
                </div>
              )}
              <div className="mt-6 pt-6 border-t border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-slate-300">Monitoreo activo por sistema GPS</span>
                  </div>
                  <button onClick={() => { setStatus(null); setShowRemesa(false); }} className="text-slate-400 hover:text-white underline text-sm">Cerrar consulta</button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Remesa */}
          {showRemesa && status?.remesa && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowRemesa(false)}>
              <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 max-w-2xl w-full mx-4 shadow-2xl" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Remesa - Guía {guide}</h3>
                  <button onClick={() => setShowRemesa(false)} className="text-slate-400 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="flex justify-center bg-slate-800 rounded-xl p-2">
                  <img
                    src={`${REMESA_BASE_URL}${status.remesa}`}
                    alt={`Remesa guía ${guide}`}
                    className="max-h-[70vh] w-auto rounded-lg object-contain"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const ServicesSection = () => {
  const services: Service[] = [
    {
      id: '1',
      title: 'Reexpedición de Mercancía',
      description: 'Entrega oportuna a todos los municipios de Córdoba, Sucre, Sur de Bolívar, Urabá Antioqueño y Bajo Cauca.',
      icon: <Package className="w-8 h-8" />
    },
    {
      id: '2',
      title: 'Recogida de Mercancía',
      description: 'Recogemos mercancía en todos los municipios que cubrimos, gestionando devoluciones de manera eficiente.',
      icon: <Truck className="w-8 h-8" />
    },
    {
      id: '3',
      title: 'Almacenamiento',
      description: 'Contamos con una bodega amplia y segura para el almacenamiento estratégico de su mercancía.',
      icon: <Warehouse className="w-8 h-8" />
    },
    {
      id: '4',
      title: 'Ubicación Estratégica',
      description: 'Ubicados en Planeta Rica, Barrio San Martín, punto clave que comunica la Costa Caribe con el interior del país.',
      icon: <MapPin className="w-8 h-8" />
    }
  ];

  return (
    <section id="servicios" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-red-600 font-bold uppercase tracking-widest text-sm">Nuestro Portafolio</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 mt-2">Soluciones Logísticas</h2>
          <div className="w-24 h-1 bg-red-600 mx-auto mt-6"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((s) => (
            <div key={s.id} className="group p-8 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-600 transition-colors shadow-lg">
                {s.icon}
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-4">{s.title}</h3>
              <p className="text-slate-600 leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AboutSection = () => {
  return (
    <section id="nosotros" className="py-24 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-red-100 rounded-full blur-3xl opacity-50"></div>
            <div className="relative z-10 grid grid-cols-2 gap-4">
              <img src="/img/img_1.png" alt="Logistic hub" className="rounded-3xl shadow-xl hover:scale-105 transition-transform duration-500" />
              <div className="space-y-4 mt-8">
                <img src="/img/camion2.jpg" alt="Delivery trucks" className="rounded-3xl shadow-xl hover:scale-105 transition-transform duration-500" />
                <div className="bg-blue-600 p-8 rounded-3xl text-white shadow-xl">
                  <p className="text-4xl font-bold mb-1">24+</p>
                  <p className="text-sm opacity-80 uppercase tracking-widest font-semibold">Años de Experiencia</p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2">
            <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-6">Expertos en Conectar el Caribe</h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Somos líderes regionales en el servicio de transporte de mercancía, contamos con una gran experiencia
              y con el apoyo de empresas nacionales e internacionales, lo que nos convierte en una empresa ágil,
              responsable y eficiente. Nuestro compromiso y responsabilidad con nuestros clientes es lo primordial.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-red-100 p-3 rounded-xl">
                  <Globe className="text-red-700 w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-blue-900">Misión</h4>
                  <p className="text-slate-600">Brindamos transporte de mercancía satisfaciendo las necesidades logísticas de nuestros clientes, guiados por nuestros valores y un talento humano responsable, eficaz y eficiente.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <ShieldCheck className="text-blue-600 w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-blue-900">Visión 2030</h4>
                  <p className="text-slate-600">Consolidarnos como empresa líder en reexpedición de mercancía de la región Caribe, avanzando con el progreso tecnológico y social, comprometidos con la satisfacción de nuestros clientes.</p>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-200">
              <h4 className="text-lg font-bold text-blue-900 mb-4">Nuestros Valores</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Respeto', 'Compromiso', 'Responsabilidad', 'Solidaridad', 'Honestidad', 'Eficiencia'].map(v => (
                  <div key={v} className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-red-600" />
                    <span>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ClientsSection = () => {
  const clients: Client[] = [
    { name: 'Coordinadora', logo: '/img/clientes/logo-coordinadora.svg' },
    { name: 'Meico', logo: '/img/clientes/Meico-logo-Azul.png' },
    { name: 'Energy Logística', logo: '/img/clientes/Energy.jpg' },
    { name: 'TCC', logo: '/img/clientes/tcc.webp' },
    { name: 'Envia', logo: '/img/clientes/envia.png' },
    { name: 'Logi Cuartas', logo: '/img/clientes/logo-logicuartas.png' },
    { name: 'Servientrega', logo: '/img/clientes/servientrega-logo-png.png' },
    { name: 'Veloenvios', logo: '/img/clientes/logo-test-veloenvios.png' }
  ];

  return (
    <section id="clientes" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-blue-900">Empresas que Confían en Nosotros</h2>
          <p className="text-slate-500 mt-2">Colaboramos con los líderes nacionales de transporte.</p>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-12">
          {clients.map((c) => (
            <div key={c.name} className="w-40 md:w-56 flex justify-center p-4">
              <img src={c.logo} alt={c.name} className="h-12 md:h-16 object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Hero = () => {
  return (
    <section id="inicio" className="relative h-screen min-h-[700px] flex items-center overflow-hidden">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2000" 
          alt="Logistics Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-900/70 to-transparent"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 pt-20">
        <div className="max-w-3xl">
          <div className="inline-block px-4 py-2 bg-red-600 text-white font-bold rounded-full text-sm mb-6 animate-bounce">
            Líderes en el Caribe
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-8">
            Soluciones Logísticas <br />
            <span className="text-red-600">Sin Fronteras</span>
          </h1>
          <p className="text-xl text-slate-200 mb-10 leading-relaxed max-w-2xl">
            Ofrecemos el servicio más completo de reexpedición, transporte y almacenamiento de mercancía en el norte de Colombia. Su negocio en movimiento, siempre a tiempo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="#rastreo" 
              className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-xl font-bold text-lg text-center transition-all shadow-lg hover:shadow-red-600/30 flex items-center justify-center gap-2"
            >
              Rastrear Guía <Search className="w-5 h-5" />
            </a>
            <a 
              href="#servicios" 
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 px-10 py-4 rounded-xl font-bold text-lg text-center transition-all"
            >
              Nuestros Servicios
            </a>
          </div>
        </div>
      </div>

      {/* Stats Float */}
      <div className="absolute bottom-10 right-10 hidden xl:flex gap-6">
        {[
          { label: 'Paquetes entregados', value: '50k+' },
          { label: 'Zonas cubiertas', value: '4 Deptos' },
          { label: 'Clientes felices', value: '1000+' }
        ].map((stat, i) => (
          <div key={i} className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl text-white">
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm opacity-70">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const LIMIT = 6;

const CoverageSection = () => {
  const [modal, setModal] = useState<{ name: string; towns: string[] } | null>(null);

  const regions = [
    { name: 'Córdoba', towns: ['Ayapel', 'Buenavista', 'Canalete', 'Cereté', 'Chima', 'Chinú', 'Ciénaga de Oro', 'Cotorra', 'El Viajano', 'La Apartada', 'Lorica', 'Los Córdobas', 'Momil', 'Montelíbano', 'Montería', 'Moñitos', 'Planeta Rica', 'Pueblo Nuevo', 'Puerto Libertador', 'Purísima', 'Sahagún', 'San Andrés de Sotavento', 'San Antero', 'San Bernardo', 'San Carlos', 'San Pelayo', 'Tierra Alta', 'Tuchín', 'Valencia'] },
    { name: 'Sucre', towns: ['Tolú Viejo', 'Coloso', 'Chochó', 'Corozal', 'Coveñas', 'Galeras', 'Guaranda', 'Majagual', 'Ovejas', 'Sampués', 'San Marcos', 'San Pedro', 'Sincelejo', 'Tolú', 'Los Palmitos', 'Betulia', 'El Roble', 'La Unión'] },
    { name: 'Bolívar', towns: ['Mompós', 'Magangué', 'Achí'] },
    { name: 'Bajo Cauca', towns: ['Nechí', 'Caucasia', 'El Bagre', 'Cáceres', 'Zaragoza', 'Tarazá'] },
    { name: 'Urabá Antioqueño', towns: ['Arboletes', 'San Juan de Urabá'] }
  ];

  return (
    <section className="py-24 bg-blue-900 text-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/3">
            <h2 className="text-4xl font-extrabold mb-6">Amplia Cobertura</h2>
            <p className="text-blue-200 text-lg mb-8">
              Nuestra presencia estratégica nos permite llegar a donde otros no llegan. Cubrimos los principales centros urbanos y rurales de la región.
            </p>
            <div className="bg-blue-800 p-6 rounded-2xl border border-blue-700">
              <h4 className="font-bold flex items-center gap-2 mb-2">
                <MapPin className="text-red-600" /> Sede Principal
              </h4>
              <p className="text-blue-100">Cra. 5 # 22-26 Barrio San Martín<br />Planeta Rica, Córdoba</p>
            </div>
          </div>
          <div className="lg:w-2/3 grid sm:grid-cols-2 gap-6">
            {regions.map((r) => {
              const visible = r.towns.slice(0, LIMIT);
              const remaining = r.towns.length - LIMIT;
              return (
                <div key={r.name} className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                  <h3 className="text-2xl font-bold text-red-500 mb-3">{r.name}</h3>
                  <p className="text-blue-100 text-sm leading-relaxed">
                    {visible.join(', ')}{remaining > 0 && <span className="text-blue-300"> y {remaining} más...</span>}
                  </p>
                  {remaining > 0 && (
                    <button
                      onClick={() => setModal({ name: r.name, towns: r.towns })}
                      className="mt-4 text-xs font-bold uppercase tracking-widest text-blue-300 flex items-center gap-1 hover:text-white"
                    >
                      Ver todas las poblaciones <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setModal(null)}>
          <div className="bg-blue-900 border border-blue-700 rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-red-500">{modal.name}</h3>
              <button onClick={() => setModal(null)} className="text-blue-300 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-2">
              {modal.towns.map((town: string) => (
                <div key={town} className="flex items-center gap-2 text-blue-100 text-sm py-1">
                  <MapPin className="w-3 h-3 text-red-500 shrink-0" /> {town}
                </div>
              ))}
            </div>
            <p className="text-blue-300 text-xs mt-4 text-right">{modal.towns.length} poblaciones en total</p>
          </div>
        </div>
      )}
    </section>
  );
};

const Footer = () => {
  return (
    <footer id="contacto" className="bg-slate-950 text-slate-400 py-20 border-t border-slate-900">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center space-x-3 mb-8">
              <img src="/img/logo_unirex.png" alt="UNIREX" className="h-10 w-auto" />
              <span className="text-2xl font-bold text-white tracking-tighter">
                UNIREX <span className="text-red-600">S.A.S</span>
              </span>
            </div>
            <p className="mb-8 leading-relaxed">
              Líderes regionales en logística y transporte. Conectando negocios y familias con eficiencia desde el año 2000.
            </p>
            <div className="flex space-x-4">
              {/* Fake social placeholders */}
              <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer text-white">f</div>
              <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-400 transition-colors cursor-pointer text-white">t</div>
              <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors cursor-pointer text-white">ig</div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-8 text-lg">Navegación</h4>
            <ul className="space-y-4">
              <li><a href="#inicio" className="hover:text-red-600 transition-colors">Inicio</a></li>
              <li><a href="#nosotros" className="hover:text-red-600 transition-colors">Quiénes Somos</a></li>
              <li><a href="#servicios" className="hover:text-red-600 transition-colors">Servicios</a></li>
              <li><a href="#rastreo" className="hover:text-red-600 transition-colors">Rastreo de Guía</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-8 text-lg">Información</h4>
            <ul className="space-y-4">
              <li><p>Régimen Común</p></li>
              <li><p>Planeta Rica (Córdoba)</p></li>
              <li><p>Cra. 5 # 22-26 Barrio San Martín</p></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-8 text-lg">Contacto</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-red-600 shrink-0" />
                <div>
                  <p className="text-white">Celular:</p>
                  <p>324 682 4054</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-red-600 shrink-0" />
                <div>
                  <p className="text-white">Correo:</p>
                  <p>unirexsas@gmail.com</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-900 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Unirex S.A.S. Todos los derechos reservados. Diseñado para el progreso regional.</p>
        </div>
      </div>
    </footer>
  );
};

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Seo title="Unirex S.A.S. - Soluciones Logísticas" description="Soluciones logísticas integrales para Colombia. Transporte, almacenamiento y distribución eficiente." canonical="https://tudominio.com/" image="https://tudominio.com/og-image.png" />
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <AboutSection />
        <ServicesSection />
        <TrackingTool />
        <CoverageSection />
        <ClientsSection />
      </main>
      <Footer />
    </div>
  );
};

export default App;
