import React from 'react'
import Navbar from '../../Components/Navbar'
import farm from './Assets/farm.jpg'
export default function About() {
return (
    <>
        <Navbar />
        <section className="bg-gradient-to-br from-blue-100 to-blue-50 min-h-screen pt-40 py-12">
            <div className="max-w-4xl mx-auto p-8 bg-white rounded-3xl shadow-2xl flex flex-col gap-10 border border-blue-200">
                <div className="flex flex-col md:flex-row items-center gap-10">
                    <img
                        src={farm}
                        alt="Farm"
                        className="w-48 h-48 rounded-full object-cover border-4 border-blue-400 shadow-lg"
                    />
                    <div>
                        <h1 className="text-4xl font-extrabold text-blue-700 mb-4">About FITS - Tanza</h1>
                        <p className="text-lg text-gray-700 mb-4">
                            At FITS - Tanza, we are a diverse team of technologists, agronomists, and innovators united by a shared vision: to revolutionize agriculture through technology. Our platform bridges the gap between farmers, suppliers, and consumers, making agriculture smarter, more sustainable, and accessible to all.
                        </p>
                        <div className="flex flex-wrap gap-4 mt-2">
                            <span className="inline-flex items-center px-3 py-1 bg-blue-200 text-blue-700 rounded-full text-sm font-medium">🌱 Agri-Tech Innovation</span>
                            <span className="inline-flex items-center px-3 py-1 bg-blue-200 text-blue-700 rounded-full text-sm font-medium">🤝 Community Driven</span>
                            <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">💡 Sustainable Solutions</span>
                        </div>
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-2xl font-semibold text-blue-600 mb-3">Our Mission</h2>
                        <p className="text-gray-700 mb-2">
                            To empower farmers and agri-businesses with cutting-edge digital tools, fostering growth, transparency, and sustainability in the agricultural sector.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                            <li>Connecting rural communities with modern technology</li>
                            <li>Promoting eco-friendly farming practices</li>
                            <li>Facilitating knowledge sharing and collaboration</li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold text-blue-600 mb-3">Our Values</h2>
                        <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-1">✔️</span>
                                <span className="text-gray-700">Integrity & Transparency</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-1">✔️</span>
                                <span className="text-gray-700">Innovation & Excellence</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-1">✔️</span>
                                <span className="text-gray-700">Community Empowerment</span>
                            </li>
                        </ul>
                    </div>
                </div>
                {/* More Details Section */}
                <div className="mt-10">
                    <h2 className="text-2xl font-semibold text-blue-600 mb-3">What We Offer</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 rounded-xl p-6 shadow flex flex-col gap-2 border border-blue-100">
                            <h3 className="text-lg font-bold text-blue-700">Smart Farm Management</h3>
                            <p className="text-gray-700 text-sm">
                                Our platform provides real-time analytics, crop monitoring, and resource management tools to help farmers maximize yield and minimize waste.
                            </p>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-6 shadow flex flex-col gap-2 border border-blue-100">
                            <h3 className="text-lg font-bold text-blue-700">Marketplace Integration</h3>
                            <p className="text-gray-700 text-sm">
                                We connect farmers directly with buyers and suppliers, ensuring fair prices and transparent transactions for all parties.
                            </p>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-6 shadow flex flex-col gap-2 border border-blue-100">
                            <h3 className="text-lg font-bold text-blue-700">Educational Resources</h3>
                            <p className="text-gray-700 text-sm">
                                Access a library of guides, tutorials, and expert advice to stay updated with the latest agricultural trends and best practices.
                            </p>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-6 shadow flex flex-col gap-2 border border-blue-100">
                            <h3 className="text-lg font-bold text-blue-700">Community Support</h3>
                            <p className="text-gray-700 text-sm">
                                Join a vibrant community of farmers, experts, and enthusiasts ready to share knowledge, answer questions, and collaborate on projects.
                            </p>
                        </div>
                    </div>
                </div>
                {/* End More Details Section */}
            </div>
        </section>
        
        <section className="bg-blue-100 py-16">
            <div className="max-w-5xl mx-auto px-6">
                <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">Meet Our Team</h2>
                <div className="grid md:grid-cols-3 gap-10">
                    <div className="flex flex-col items-center bg-white rounded-xl p-6 shadow border border-blue-200">
                        <div className="w-24 h-24 rounded-full mb-4 border-2 border-blue-400 bg-blue-50 flex items-center justify-center">
                            <svg className="w-12 h-12 text-blue-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-blue-600">Rhenzy Cruzat</h3>
                        <p className="text-blue-700 mb-2">Front End Developer</p>
                        <p className="text-gray-600 text-center text-sm">Rhenzy crafts intuitive and modern user interfaces, ensuring a seamless experience for all platform users.</p>
                    </div>
                    <div className="flex flex-col items-center bg-white rounded-xl p-6 shadow border border-blue-200">
                        <div className="w-24 h-24 rounded-full mb-4 border-2 border-blue-400 bg-blue-50 flex items-center justify-center">
                            <svg className="w-12 h-12 text-blue-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-blue-600">Kc Sean Brix</h3>
                        <p className="text-blue-700 mb-2">Back End Developer</p>
                        <p className="text-gray-600 text-center text-sm">KC Sean builds and maintains the robust backend systems that power our platform’s features and security.</p>
                    </div>
                    <div className="flex flex-col items-center bg-white rounded-xl p-6 shadow border border-blue-200">
                        <div className="w-24 h-24 rounded-full mb-4 border-2 border-blue-400 bg-blue-50 flex items-center justify-center">
                            <svg className="w-12 h-12 text-blue-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-blue-600">Maphil Grace Alquizola</h3>
                        <p className="text-blue-700 mb-2">Documentation & Papers</p>
                        <p className="text-gray-600 text-center text-sm">Maphil Grace manages all documentation and paperwork, ensuring our processes are organized and compliant.</p>
                    </div>
                </div>
            </div>
        </section>
        <section className="bg-white py-16">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <h2 className="text-3xl font-bold text-blue-700 mb-4">Why Choose FITS - Tanza?</h2>
                <p className="text-lg text-gray-700 mb-8">
                    We combine deep agricultural expertise with modern technology to deliver real impact. Our commitment to sustainability, innovation, and community sets us apart.
                </p>
                <div className="flex flex-col md:flex-row justify-center gap-8">
                    <div className="bg-blue-50 rounded-xl shadow p-6 flex-1 border border-blue-100">
                        <h3 className="text-xl font-semibold text-blue-600 mb-2">Trusted by Farmers</h3>
                        <p className="text-gray-600">Hundreds of local farmers rely on our platform for resources, support, and growth opportunities.</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl shadow p-6 flex-1 border border-blue-100">
                        <h3 className="text-xl font-semibold text-blue-600 mb-2">Award-Winning Solutions</h3>
                        <p className="text-gray-600">Recognized for excellence in agri-tech and sustainable development by industry leaders.</p>
                    </div>
                </div>
            </div>
        </section>
        {/* Even More Detail Section */}
        <section className="bg-blue-100 py-16">
            <div className="max-w-4xl mx-auto px-6">
                <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Our Impact</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-xl font-semibold text-blue-600">Empowering Local Farmers</h3>
                        <p className="text-gray-600 text-sm">
                            Through our workshops and digital tools, over 500 farmers have improved their yields and adopted sustainable practices in the past year.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-xl font-semibold text-blue-600">Sustainable Agriculture</h3>
                        <p className="text-gray-600 text-sm">
                            Our eco-friendly initiatives have reduced chemical usage and promoted organic farming, contributing to healthier communities and environments.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-xl font-semibold text-blue-600">Knowledge Sharing</h3>
                        <p className="text-gray-600 text-sm">
                            We host regular webinars and training sessions, connecting experts and farmers to share the latest trends and research in agriculture.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-xl font-semibold text-blue-600">Inclusive Growth</h3>
                        <p className="text-gray-600 text-sm">
                            Our platform is accessible to all, regardless of background or experience, ensuring everyone can benefit from modern agri-tech.
                        </p>
                    </div>
                </div>
            </div>
        </section>
      <style>{`
        html, body, #root {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        html::-webkit-scrollbar, body::-webkit-scrollbar, #root::-webkit-scrollbar {
          display: none;
        }
        .letter-spacing-wide {
          letter-spacing: 0.15em;
        }
      `}</style>
    </>
)
}
