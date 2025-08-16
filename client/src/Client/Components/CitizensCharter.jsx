import { useState, useEffect } from 'react';
import Navbar from './Navbar.jsx';
import logo from '../Assets/Logo.png';

export default function CitizensCharter() {
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
            <div className="min-h-screen overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#22c55e #f0f0f0' }}>
                <main className="bg-gradient-to-br from-green-50 via-white to-emerald-50">
                    {/* Hero Section */}
                    <section className="relative bg-gradient-to-r from-green-700 via-green-800 to-emerald-800 pt-20 pb-10 overflow-hidden">
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
                        
                        <div className="relative max-w-7xl mx-auto px-4 text-center">
                            <div className="flex justify-center mb-4">
                                <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 border border-white/20">
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                            </div>
                            
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
                                Citizen's Charter
                            </h1>
                            <p className="text-lg md:text-xl text-white/90 mb-4 max-w-3xl mx-auto leading-relaxed">
                                Department of Agriculture - Office of the Secretary
                            </p>
                            <div className="w-20 h-1 bg-white/80 mx-auto rounded-full"></div>
                        </div>
                    </section>

                    {/* Functions Section */}
                    <section className="py-10 bg-white">
                        <div className="max-w-7xl mx-auto px-4">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">FUNCTIONS</h2>
                                <div className="w-16 h-1 bg-green-600 mx-auto rounded-full"></div>
                            </div>

                            <div className="grid gap-4 lg:gap-6">
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-5 border border-green-100 shadow-md">
                                    <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                                        The Department of Agriculture is responsible for the promotion of agricultural development by providing the policy framework, public investments, and support services needed for domestic and export-oriented business enterprises. It is the primary concern of the Department to improve farm income and generate work opportunities for farmers, fishermen and other rural workers. It shall encourage people's participation in agricultural development through sectoral representation in agricultural policy-making bodies so that the policies, plans and programs of the Department are formulated and executed to satisfy their needs.
                                    </p>
                                </div>

                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-100 shadow-md">
                                    <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                                        The DA Central Office is primarily responsible for the planning formulation, execution, regulation and monitoring of programs and activities relating to agriculture, food production and supply. It promulgates and enforces all laws, rules and regulations governing the conservation and proper utilization of agricultural and fishery resources.
                                    </p>
                                </div>

                                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-5 border border-yellow-100 shadow-md">
                                    <p className="text-sm md:text-base text-gray-700 leading-relaxed font-semibold">
                                        FRONTLINE SERVICES AND/OR REGULATORY FUNCTIONS SUCH AS ISSUANCE OF PERMITS, LICENSES, CERTIFICATIONS AND OTHER RELATED ACTIVITIES ARE BEING PROVIDED AND IMPLEMENTED BY CONCERNED BUREAUS AND REGIONAL FIELD UNITS UNDER THE DEPARTMENT OF AGRICULTURE.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Service Pledge Section */}
                    <section className="py-10 bg-green-50">
                        <div className="max-w-7xl mx-auto px-4">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">PERFORMANCE / SERVICE PLEDGE</h2>
                                <div className="w-16 h-1 bg-green-600 mx-auto rounded-full"></div>
                            </div>

                            <div className="bg-white rounded-xl p-5 md:p-6 shadow-lg border border-green-100">
                                <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-5 text-center">
                                    We, the officials and employees of the Department of Agriculture – Office of the Secretary with the guidance of God Almighty do hereby pledge to:
                                </p>

                                <div className="grid gap-3 md:gap-4">
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
                                        <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-300">
                                            <div className={`w-8 h-8 ${item.color} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0`}>
                                                {item.letter}
                                            </div>
                                            <p className="text-sm md:text-base text-gray-700 leading-relaxed flex-1">
                                                <span className="font-bold text-gray-800">{item.letter}</span>
                                                {item.text}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="text-center mt-5 p-4 bg-green-100 rounded-lg border border-green-200">
                                    <p className="text-base md:text-lg font-bold text-green-800">
                                        ALL THESE WE PLEDGE BECAUSE YOU ARE OUR PRIORITY.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Feedback Mechanism Section */}
                    <section className="py-10 bg-gray-100">
                        <div className="max-w-7xl mx-auto px-4">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">FEEDBACK MECHANISM</h2>
                                <div className="w-16 h-1 bg-green-600 mx-auto rounded-full"></div>
                            </div>

                            <div className="bg-white rounded-xl p-5 md:p-6 shadow-lg border border-gray-200">
                                <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-5 text-center">
                                    The Department of Agriculture would want to be of better service to YOU. PLEASE LET US KNOW HOW WE HAVE SERVED YOU BY PROVIDING US FEEDBACK THROUGH THE FOLLOWING:
                                </p>

                                <div className="grid gap-4 md:gap-5 lg:grid-cols-3">
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-base font-bold text-gray-800">Feedback Form</h3>
                                        </div>
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                            Accomplish our Feedback Form available at the DA Lobby and place it in the Drop Box located at the DA Lobby.
                                        </p>
                                    </div>

                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-2-2v-2.5" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12V8a2 2 0 012-2h7l-3 3h3a2 2 0 012 2v3a2 2 0 01-2 2H9z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-base font-bold text-gray-800">BILIS AKSYON</h3>
                                        </div>
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                            Talk to our designated BILIS AKSYON officers.
                                        </p>
                                    </div>

                                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-base font-bold text-gray-800">Contact Person</h3>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold text-gray-800">JESSAMIN B. ARANAS</p>
                                            <p className="text-xs text-gray-600">Chief Administrative Officer</p>
                                            <p className="text-xs text-gray-600">Chief, Personnel Division</p>
                                            <p className="text-xs text-gray-600">Ground Floor, Rm. 103, DA-OSEC Bldg.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center mt-5 p-4 bg-green-100 rounded-lg border border-green-200">
                                    <p className="text-base md:text-lg font-bold text-green-800">
                                        THANK YOU for your cooperation!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* PDF Download Section */}
                    <section className="py-10 bg-white">
                        <div className="max-w-7xl mx-auto px-4 text-center">
                            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 md:p-8 text-white shadow-lg">
                                <div className="flex justify-center mb-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                </div>
                                <h2 className="text-xl md:text-2xl font-bold mb-3">Download Complete Charter</h2>
                                <p className="text-base mb-5 max-w-2xl mx-auto">
                                    Access the full Citizen's Charter document with detailed information about our services, standards, and commitments.
                                </p>
                                <a
                                    href="https://www.da.gov.ph/wp-content/uploads/2022/03/DA-Citizens-Charter-2021-2nd-Edition.pdf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-white text-green-600 px-5 py-3 rounded-lg font-bold text-sm hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Citizen's Charter PDF File
                                </a>
                            </div>
                        </div>
                    </section>

                    {/* Organizational Structure Links */}
                    <section className="py-10 bg-green-50">
                        <div className="max-w-7xl mx-auto px-4">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">ORGANIZATIONAL STRUCTURE</h2>
                                <div className="w-16 h-1 bg-green-600 mx-auto rounded-full"></div>
                            </div>

                            {/* Bureaus */}
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">BUREAUS</h3>
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
                                            className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md border border-green-100 hover:border-green-300 transition-all duration-300 text-center group"
                                        >
                                            <p className="text-green-700 font-medium text-sm group-hover:text-green-800 transition-colors duration-300">
                                                {bureau.name}
                                            </p>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Attached Agencies */}
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">ATTACHED AGENCIES</h3>
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
                                            className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md border border-blue-100 hover:border-blue-300 transition-all duration-300 text-center group"
                                        >
                                            <p className="text-blue-700 font-medium text-sm group-hover:text-blue-800 transition-colors duration-300">
                                                {agency.name}
                                            </p>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Attached Corporations */}
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">ATTACHED CORPORATIONS</h3>
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
                                            className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md border border-purple-100 hover:border-purple-300 transition-all duration-300 text-center group"
                                        >
                                            <p className="text-purple-700 font-medium text-sm group-hover:text-purple-800 transition-colors duration-300">
                                                {corp.name}
                                            </p>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Regional Field Offices */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">REGIONAL FIELD OFFICES</h3>
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
                                            className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md border border-orange-100 hover:border-orange-300 transition-all duration-300 text-center group"
                                        >
                                            <p className="text-orange-700 font-medium text-sm group-hover:text-orange-800 transition-colors duration-300">
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
                        className="fixed bottom-6 left-6 z-50 bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
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
