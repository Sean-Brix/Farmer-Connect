import { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Navbar from './Navbar.jsx';
import logo from '../Assets/Logo.png';

export default function CitizensCharter() {
    const { theme } = useTheme();
    const [showBackToTop, setShowBackToTop] = useState(false);

    // Back to top button visibility detection
    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.pageYOffset > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Scroll to top function
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <>
            <Navbar />
            <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
                <main className="w-full">
                    {/* Hero Section */}
                    <section className={`py-12 ${theme === 'dark' ? 'bg-gray-800' : 'bg-green-700'}`}>
                        <div className="max-w-5xl mx-auto px-4 sm:px-6">
                            <div className="text-center">
                                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-6 mt-15 ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}>
                                    <svg className={`w-7 h-7 ${theme === 'dark' ? 'text-green-400' : 'text-green-800'}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                
                                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                                    Citizen's Charter
                                </h1>
                                <p className="text-lg text-white/90 mb-2">
                                    Department of Agriculture
                                </p>
                                <p className="text-base text-white/70">
                                    Office of the Secretary
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Functions Section */}
                    <section className={`py-12 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
                        <div className="max-w-5xl mx-auto px-4 sm:px-6">
                            <div className="text-center mb-10">
                                <h2 className={`text-2xl md:text-3xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>FUNCTIONS</h2>
                                <div className={`w-16 h-0.5 mx-auto ${theme === 'dark' ? 'bg-green-400' : 'bg-green-700'}`}></div>
                            </div>

                            <div className="space-y-6">
                                <div className={`rounded-lg p-6 border-l-4 ${theme === 'dark' ? 'bg-gray-800 border-green-400' : 'bg-gray-50 border-green-700'}`}>
                                    <p className={`leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        The Department of Agriculture is responsible for the promotion of agricultural development by providing the policy framework, public investments, and support services needed for domestic and export-oriented business enterprises. It is the primary concern of the Department to improve farm income and generate work opportunities for farmers, fishermen and other rural workers.
                                    </p>
                                </div>

                                <div className={`rounded-lg p-6 border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                                    <p className={`leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        The DA Central Office is primarily responsible for the planning formulation, execution, regulation and monitoring of programs and activities relating to agriculture, food production and supply. It promulgates and enforces all laws, rules and regulations governing the conservation and proper utilization of agricultural and fishery resources.
                                    </p>
                                </div>

                                <div className={`rounded-lg p-6 border-l-4 ${theme === 'dark' ? 'bg-gray-800 border-green-400' : 'bg-green-50 border-green-700'}`}>
                                    <p className={`leading-relaxed font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                                        FRONTLINE SERVICES AND/OR REGULATORY FUNCTIONS SUCH AS ISSUANCE OF PERMITS, LICENSES, CERTIFICATIONS AND OTHER RELATED ACTIVITIES ARE BEING PROVIDED AND IMPLEMENTED BY CONCERNED BUREAUS AND REGIONAL FIELD UNITS UNDER THE DEPARTMENT OF AGRICULTURE.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Service Pledge Section */}
                    <section className={`py-12 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                        <div className="max-w-5xl mx-auto px-4 sm:px-6">
                            <div className="text-center mb-10">
                                <h2 className={`text-2xl md:text-3xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>SERVICE PLEDGE</h2>
                                <div className="w-16 h-0.5 bg-green-700 mx-auto"></div>
                            </div>

                            <div className={`rounded-lg p-8 border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                                <div className="text-center mb-8">
                                    <p className={`leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        We, the officials and employees of the Department of Agriculture – Office of the Secretary with the guidance of God Almighty do hereby pledge to:
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        {
                                            letter: 'S',
                                            text: 'erve promptly, efficiently, courteously, justly and with no impartiality from mondays to fridays starting at 8:00 AM to 6:00 PM.',
                                            color: 'bg-red-500'
                                        },
                                        {
                                            letter: 'E',
                                            text: 'nforce strict compliance with service standards, as embodied under RA 9485 and the guiding principles of RA 6713.',
                                            color: 'bg-orange-500'
                                        },
                                        {
                                            letter: 'R',
                                            text: 'esponsive to the needs of the farmers, fisherfolk, stakeholders as well as the transacting public.',
                                            color: 'bg-yellow-500'
                                        },
                                        {
                                            letter: 'V',
                                            text: 'alue every citizen\'s comments, suggestions and needs especially the poor, the underprivileged and those with special needs such as the disabled and the elderly.',
                                            color: 'bg-green-500'
                                        },
                                        {
                                            letter: 'I',
                                            text: 'nitiate immediate action in rendering technical and suppport assistance to clienteles.',
                                            color: 'bg-blue-500'
                                        },
                                        {
                                            letter: 'C',
                                            text: 'ommitted to serve the public with integrity and dedication.',
                                            color: 'bg-indigo-500'
                                        },
                                        {
                                            letter: 'E',
                                            text: 'nsure the public with accurate information though 24/7 access on DA\'s policies, programs, activities through DA Website: www.da.gov.ph',
                                            color: 'bg-purple-500'
                                        }
                                    ].map((item, index) => (
                                        <div key={index} className={`flex items-start gap-4 p-3 rounded-lg transition-colors duration-200 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                                            <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center text-white font-bold shadow-sm`}>
                                                {item.letter}
                                            </div>
                                            <div className="flex-1 pt-2">
                                                <p className={`leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.letter}</span>
                                                    {item.text}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className={`text-center mt-8 p-4 rounded-lg border ${theme === 'dark' ? 'bg-green-900/50 border-green-700' : 'bg-green-100 border-green-200'}`}>
                                    <p className={`font-bold ${theme === 'dark' ? 'text-green-300' : 'text-green-800'}`}>
                                        ALL THESE WE PLEDGE BECAUSE YOU ARE OUR PRIORITY.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Feedback Mechanism Section */}
                    <section className={`py-12 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
                        <div className="max-w-5xl mx-auto px-4 sm:px-6">
                            <div className="text-center mb-10">
                                <h2 className={`text-2xl md:text-3xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>FEEDBACK MECHANISM</h2>
                                <div className={`w-16 h-0.5 mx-auto mb-4 ${theme === 'dark' ? 'bg-green-400' : 'bg-green-700'}`}></div>
                                <p className={`max-w-3xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                    The Department of Agriculture would want to be of better service to YOU. Please let us know how we have served you.
                                </p>
                            </div>

                            <div className="grid gap-6 md:grid-cols-3 mb-8">
                                <div className={`rounded-lg p-6 border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Feedback Form</h3>
                                    </div>
                                    <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Accomplish our Feedback Form available at the DA Lobby and place it in the Drop Box located at the DA Lobby.
                                    </p>
                                </div>

                                <div className={`rounded-lg p-6 border-2 ${theme === 'dark' ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200'}`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-2-2v-2.5" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12V8a2 2 0 012-2h7l-3 3h3a2 2 0 012 2v3a2 2 0 01-2 2H9z" />
                                            </svg>
                                        </div>
                                        <h3 className={`font-bold ${theme === 'dark' ? 'text-green-300' : 'text-green-800'}`}>BILIS AKSYON</h3>
                                    </div>
                                    <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-green-200' : 'text-green-700'}`}>
                                        Talk to our designated BILIS AKSYON officers.
                                    </p>
                                </div>

                                <div className={`rounded-lg p-6 border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-600'}`}>
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Contact Person</h3>
                                    </div>
                                    <div className="space-y-1">
                                        <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>JESSAMIN B. ARANAS</p>
                                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Chief Administrative Officer</p>
                                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Chief, Personnel Division</p>
                                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Ground Floor, Rm. 103, DA-OSEC Bldg.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center">
                                <div className={`inline-flex items-center justify-center px-6 py-3 rounded-lg ${theme === 'dark' ? 'bg-green-700' : 'bg-green-600'}`}>
                                    <p className="text-white font-bold">
                                        THANK YOU for your cooperation!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* PDF Download Section */}
                    <section className={`py-12 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
                            <div className={`rounded-lg p-8 text-white ${theme === 'dark' ? 'bg-green-700' : 'bg-green-600'}`}>
                                <div className="mb-6">
                                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${theme === 'dark' ? 'bg-white/30' : 'bg-white/20'}`}>
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-bold mb-3">Download Complete Charter</h2>
                                    <p className={`mb-6 ${theme === 'dark' ? 'text-white/90' : 'text-white/90'}`}>
                                        Access the full Citizen's Charter document with detailed information about our services, standards, and commitments.
                                    </p>
                                </div>
                                <a
                                    href="https://www.da.gov.ph/wp-content/uploads/2022/03/DA-Citizens-Charter-2021-2nd-Edition.pdf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-colors duration-200 ${theme === 'dark' ? 'bg-white text-green-700 hover:bg-gray-100' : 'bg-white text-green-600 hover:bg-gray-50'}`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Download PDF Charter
                                </a>
                            </div>
                        </div>
                    </section>

                    {/* Organizational Structure Links */}
                    <section className={`py-10 ${theme === 'dark' ? 'bg-gray-900' : 'bg-green-50'}`}>
                        <div className="max-w-7xl mx-auto px-4">
                            <div className="text-center mb-6">
                                <h2 className={`text-2xl md:text-3xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>ORGANIZATIONAL STRUCTURE</h2>
                                <div className={`w-16 h-1 mx-auto rounded-full ${theme === 'dark' ? 'bg-green-400' : 'bg-green-600'}`}></div>
                            </div>

                            {/* Bureaus */}
                            <div className="mb-8">
                                <h3 className={`text-lg font-bold mb-4 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>BUREAUS</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {[
                                        { name: 'Agricultural Training Institute', url: 'https://ati2.da.gov.ph/ati-main/content/' },
                                        { name: 'Bureau of Agricultural and Fisheries Engineering', url: 'https://bafe.gov.ph/' },
                                        { name: 'Bureau of Agriculture and Fisheries Standards', url: 'https://bafs.da.gov.ph/' },
                                        { name: 'Bureau of Animal Industry', url: 'http://www.bai.gov.ph/' },
                                        { name: 'Bureau of Agricultural Research', url: 'http://www.bar.gov.ph/' },
                                        { name: 'Bureau of Fisheries and Aquatic Resources', url: 'https://www.bfar.da.gov.ph/' },
                                        { name: 'Bureau of Plant Industry', url: 'https://buplant.da.gov.ph/' },
                                        { name: 'Bureau of Soils and Water Management', url: 'https://www.bswm.da.gov.ph/' },
                                        { name: 'Philippine Rubber Research Institute', url: 'http://prri.da.gov.ph/' }
                                    ].map((bureau, index) => (
                                        <a
                                            key={index}
                                            href={bureau.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`rounded-lg p-3 shadow-sm hover:shadow-md border transition-all duration-300 text-center group ${theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:border-green-400' : 'bg-white border-green-100 hover:border-green-300'}`}
                                        >
                                            <p className={`font-medium text-sm transition-colors duration-300 ${theme === 'dark' ? 'text-green-300 group-hover:text-green-200' : 'text-green-700 group-hover:text-green-800'}`}>
                                                {bureau.name}
                                            </p>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Attached Agencies */}
                            <div className="mb-8">
                                <h3 className={`text-lg font-bold mb-4 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>ATTACHED AGENCIES</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {[
                                        { name: 'Agricultural Credit Policy Council', url: 'http://acpc.gov.ph/' },
                                        { name: 'Fertilizer and Pesticide Authority', url: 'http://fpa.da.gov.ph/' },
                                        { name: 'National Fisheries Research and Development Institute', url: 'http://www.nfrdi.da.gov.ph/' },
                                        { name: 'National Meat Inspection Service', url: 'http://nmis.gov.ph/' },
                                        { name: 'Philippine Carabao Center', url: 'https://www.pcc.gov.ph/' },
                                        { name: 'Philippine Center for Postharvest Development and Mechanization', url: 'http://www.philmech.gov.ph/' },
                                        { name: 'Philippine Council for Agriculture and Fisheries', url: 'https://pcaf.da.gov.ph/' },
                                        { name: 'Philippine Fiber Industry Development Authority', url: 'https://philfida.da.gov.ph/' }
                                    ].map((agency, index) => (
                                        <a
                                            key={index}
                                            href={agency.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`rounded-lg p-3 shadow-sm hover:shadow-md border transition-all duration-300 text-center group ${theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:border-blue-400' : 'bg-white border-blue-100 hover:border-blue-300'}`}
                                        >
                                            <p className={`font-medium text-sm transition-colors duration-300 ${theme === 'dark' ? 'text-blue-300 group-hover:text-blue-200' : 'text-blue-700 group-hover:text-blue-800'}`}>
                                                {agency.name}
                                            </p>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Attached Corporations */}
                            <div className="mb-8">
                                <h3 className={`text-lg font-bold mb-4 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>ATTACHED CORPORATIONS</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {[
                                        { name: 'National Dairy Authority', url: 'http://nda.da.gov.ph/' },
                                        { name: 'National Food Authority', url: 'http://nfa.gov.ph/' },
                                        { name: 'National Irrigation Administration', url: 'https://www.nia.gov.ph/' },
                                        { name: 'National Tobacco Administration', url: 'http://nta.da.gov.ph/' },
                                        { name: 'Philippine Coconut Authority', url: 'https://pca.gov.ph/' },
                                        { name: 'Philippine Crop Insurance Corporation', url: 'https://pcic.gov.ph/' },
                                        { name: 'Philippine Fisheries Development Authority', url: 'https://pfda.gov.ph/' },
                                        { name: 'Philippine Rice Research Institute', url: 'http://www.philrice.gov.ph/' },
                                        { name: 'Sugar Regulatory Administration', url: 'https://www.sra.gov.ph/' }
                                    ].map((corp, index) => (
                                        <a
                                            key={index}
                                            href={corp.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`rounded-lg p-3 shadow-sm hover:shadow-md border transition-all duration-300 text-center group ${theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:border-purple-400' : 'bg-white border-purple-100 hover:border-purple-300'}`}
                                        >
                                            <p className={`font-medium text-sm transition-colors duration-300 ${theme === 'dark' ? 'text-purple-300 group-hover:text-purple-200' : 'text-purple-700 group-hover:text-purple-800'}`}>
                                                {corp.name}
                                            </p>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Regional Field Offices */}
                            <div>
                                <h3 className={`text-lg font-bold mb-4 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>REGIONAL FIELD OFFICES</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                    {[
                                        { name: 'BARMM', url: 'https://mafar.bangsamoro.gov.ph/' },
                                        { name: 'CAR', url: 'http://car.da.gov.ph/' },
                                        { name: 'Region I', url: 'http://ilocos.da.gov.ph/' },
                                        { name: 'Region II', url: 'http://cagayanvalley.da.gov.ph/' },
                                        { name: 'Region III', url: 'http://rfo3.da.gov.ph/' },
                                        { name: 'Region IV-A', url: 'https://calabarzon.da.gov.ph/' },
                                        { name: 'Region IV-B', url: 'http://mimaropa.da.gov.ph/' },
                                        { name: 'Region V', url: 'http://bicol.da.gov.ph/' },
                                        { name: 'Region VI', url: 'http://westernvisayas.da.gov.ph/' },
                                        { name: 'Region VII', url: 'https://rfo7.da.gov.ph/' },
                                        { name: 'Region VIII', url: 'https://easternvisayas.da.gov.ph/' },
                                        { name: 'Region IX', url: 'https://zampen.da.gov.ph/' },
                                        { name: 'Region X', url: 'http://cagayandeoro.da.gov.ph/' },
                                        { name: 'Region XI', url: 'http://davao.da.gov.ph/' },
                                        { name: 'Region XII', url: 'https://rfo12.da.gov.ph/' },
                                        { name: 'Region XIII', url: 'http://caraga.da.gov.ph/' }
                                    ].map((region, index) => (
                                        <a
                                            key={index}
                                            href={region.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`rounded-lg p-3 shadow-sm hover:shadow-md border transition-all duration-300 text-center group ${theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:border-orange-400' : 'bg-white border-orange-100 hover:border-orange-300'}`}
                                        >
                                            <p className={`font-medium text-sm transition-colors duration-300 ${theme === 'dark' ? 'text-orange-300 group-hover:text-orange-200' : 'text-orange-700 group-hover:text-orange-800'}`}>
                                                {region.name}
                                            </p>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="bg-gray-800 text-white">
                        <div className="max-w-7xl mx-auto px-4 py-6">
                            <div className="text-center">
                                <div className="flex justify-center mb-3">
                                    <img src={logo} alt="Farmer Connect" className="h-10 w-auto" />
                                </div>
                                <p className="text-gray-300 text-sm">
                                    Department of Agriculture - Office of the Secretary
                                </p>
                                <p className="text-gray-400 text-xs mt-2">
                                    © 2024 Farmer Connect. All rights reserved.
                                </p>
                            </div>
                        </div>
                    </footer>
                </main>

                {/* Back to Top Button */}
                {showBackToTop && (
                    <button
                        onClick={scrollToTop}
                        className={`fixed bottom-6 left-6 z-50 text-white p-3 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl ${theme === 'dark' ? 'bg-green-700 hover:bg-green-600' : 'bg-green-600 hover:bg-green-700'}`}
                        aria-label="Back to top"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                    </button>
                )}
            </div>
        </>
    );
}
