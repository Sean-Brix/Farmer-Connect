import React, { useState } from 'react'
import { useTheme } from '../../../contexts/ThemeContext.jsx'
import Navbar from '../../Components/Navbar'
import farm from './Assets/farm.webp'
import orgChart from '../Landing/Assets/org.webp'

export default function About() {
const { theme } = useTheme();

return (
    <>
        <Navbar />
        <section className={`min-h-screen pt-24 sm:pt-20 md:pt-16 py-12 mt-15 ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-white'
        }`}>
            <div className={`max-w-4xl mx-auto p-8 rounded-3xl shadow-2xl flex flex-col gap-10 border ${
                theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
            }`}>
                <div className="flex flex-col md:flex-row items-center gap-10">
                    <img
                        src={farm}
                        alt="Farm"
                        className="w-48 h-48 rounded-full object-cover border-4 border-green-600 shadow-lg"
                    />
                    <div>
                        <h1 className={`text-4xl font-extrabold mb-4 ${
                            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                        }`}>About FITS - Tanza</h1>
                        <p className={`text-lg mb-4 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                            At FITS - Tanza, we are a diverse team of technologists, agronomists, and innovators united by a shared vision: to revolutionize agriculture through technology. Our platform bridges the gap between farmers, suppliers, and consumers, making agriculture smarter, more sustainable, and accessible to all.
                        </p>
                        <div className="flex flex-wrap gap-4 mt-2">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                theme === 'dark' 
                                    ? 'bg-green-900/30 text-green-400' 
                                    : 'bg-green-100 text-green-700'
                            }`}>🌱 Agri-Tech Innovation</span>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                theme === 'dark' 
                                    ? 'bg-green-900/30 text-green-400' 
                                    : 'bg-green-100 text-green-700'
                            }`}>🤝 Community Driven</span>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                theme === 'dark' 
                                    ? 'bg-green-900/30 text-green-400' 
                                    : 'bg-green-100 text-green-700'
                            }`}>💡 Sustainable Solutions</span>
                        </div>
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h2 className={`text-2xl font-semibold mb-3 ${
                            theme === 'dark' ? 'text-green-400' : 'text-green-600'
                        }`}>Our Mission</h2>
                        <p className={`mb-2 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                            To empower farmers and agri-businesses with cutting-edge digital tools, fostering growth, transparency, and sustainability in the agricultural sector.
                        </p>
                        <ul className={`list-disc list-inside space-y-1 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                            <li>Connecting rural communities with modern technology</li>
                            <li>Promoting eco-friendly farming practices</li>
                            <li>Facilitating knowledge sharing and collaboration</li>
                        </ul>
                    </div>
                    <div>
                        <h2 className={`text-2xl font-semibold mb-3 ${
                            theme === 'dark' ? 'text-green-400' : 'text-green-600'
                        }`}>Our Values</h2>
                        <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                                <span className={`mt-1 ${
                                    theme === 'dark' ? 'text-green-400' : 'text-green-600'
                                }`}>✔️</span>
                                <span className={`${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                }`}>Integrity & Transparency</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className={`mt-1 ${
                                    theme === 'dark' ? 'text-green-400' : 'text-green-600'
                                }`}>✔️</span>
                                <span className={`${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                }`}>Innovation & Excellence</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className={`mt-1 ${
                                    theme === 'dark' ? 'text-green-400' : 'text-green-600'
                                }`}>✔️</span>
                                <span className={`${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                }`}>Community Empowerment</span>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </section>
        
        <section className={`py-16 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-green-100'
        }`}>
            <div className="max-w-6xl mx-auto px-6">
                <h2 className={`text-3xl font-bold mb-8 text-center ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Organizational Structure</h2>
                <div className={`rounded-xl p-6 shadow-2xl border ${
                    theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600' 
                        : 'bg-white border-green-200'
                }`}>
                    <img
                        src={orgChart}
                        alt="FITS-Tanza Organizational Chart"
                        className="w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(orgChart, '_blank')}
                    />
                    <p className={`text-center mt-4 text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>Click image to view full size</p>
                </div>
            </div>
        </section>

        <section className={`py-16 ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-white'
        }`}>
            <div className="max-w-4xl mx-auto px-6 text-center">
                <h2 className={`text-3xl font-bold mb-4 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Why Choose FITS - Tanza?</h2>
                <p className={`text-lg mb-8 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                    We combine deep agricultural expertise with modern technology to deliver real impact. Our commitment to sustainability, innovation, and community sets us apart.
                </p>
                <div className="flex flex-col md:flex-row justify-center gap-8">
                    <div className={`rounded-xl shadow p-6 flex-1 border ${
                        theme === 'dark' 
                            ? 'bg-gray-800 border-gray-600' 
                            : 'bg-gray-50 border-gray-200'
                    }`}>
                        <h3 className={`text-xl font-semibold mb-2 ${
                            theme === 'dark' ? 'text-green-400' : 'text-green-600'
                        }`}>Trusted by Farmers</h3>
                        <p className={`${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}>Hundreds of local farmers rely on our platform for resources, support, and growth opportunities.</p>
                    </div>
                    <div className={`rounded-xl shadow p-6 flex-1 border ${
                        theme === 'dark' 
                            ? 'bg-gray-800 border-gray-600' 
                            : 'bg-gray-50 border-gray-200'
                    }`}>
                        <h3 className={`text-xl font-semibold mb-2 ${
                            theme === 'dark' ? 'text-green-400' : 'text-green-600'
                        }`}>Award-Winning Solutions</h3>
                        <p className={`${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}>Recognized for excellence in agri-tech and sustainable development by industry leaders.</p>
                    </div>
                </div>
            </div>
        </section>

        <section className={`py-16 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-green-100'
        }`}>
            <div className="max-w-4xl mx-auto px-6">
                <h2 className={`text-3xl font-bold mb-6 text-center ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Our Impact</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-xl font-semibold text-green-600">Empowering Local Farmers</h3>
                        <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                            Through our workshops and digital tools, over 500 farmers have improved their yields and adopted sustainable practices in the past year.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-xl font-semibold text-green-600">Sustainable Agriculture</h3>
                        <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                            Our eco-friendly initiatives have reduced chemical usage and promoted organic farming, contributing to healthier communities and environments.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-xl font-semibold text-green-600">Knowledge Sharing</h3>
                        <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                            We host regular webinars and training sessions, connecting experts and farmers to share the latest trends and research in agriculture.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-xl font-semibold text-green-600">Inclusive Growth</h3>
                        <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}>
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
