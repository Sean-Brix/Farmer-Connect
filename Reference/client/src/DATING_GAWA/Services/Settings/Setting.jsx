import React from 'react'
import Navbar from '../../../Components/Navigation/Navbar'
export default function Settings() {
    return (
        <>
            <Navbar>
                <div
                    style={{
                        minHeight: '100vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#f5f6fa'
                    }}
                >
                    <div
                        style={{
                            width: '100%',
                            maxWidth: 380,
                            padding: '2.5rem 2rem',
                            borderRadius: '1.2rem',
                            background: '#fff',
                            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2rem',
                            fontFamily: 'Inter, sans-serif'
                        }}
                    >
                        <h2 style={{
                            fontWeight: 700,
                            fontSize: '1.6rem',
                            margin: 0,
                            color: '#222',
                            letterSpacing: '-0.5px'
                        }}>Settings</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label htmlFor="language-select" style={{ fontSize: '1rem', color: '#444', fontWeight: 500 }}>Language</label>
                            <select
                                id="language-select"
                                defaultValue="en"
                                style={{
                                    padding: '0.6rem 1rem',
                                    borderRadius: '0.6rem',
                                    border: '1px solid #e3e6ee',
                                    background: '#f8fafd',
                                    fontSize: '1rem',
                                    outline: 'none'
                                }}
                            >
                                <option value="en">English</option>
                                <option value="es">Spanish</option>
                                <option value="fr">French</option>
                                <option value="de">German</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label htmlFor="theme-select" style={{ fontSize: '1rem', color: '#444', fontWeight: 500 }}>Theme</label>
                            <select
                                id="theme-select"
                                defaultValue="light"
                                style={{
                                    padding: '0.6rem 1rem',
                                    borderRadius: '0.6rem',
                                    border: '1px solid #e3e6ee',
                                    background: '#f8fafd',
                                    fontSize: '1rem',
                                    outline: 'none'
                                }}
                            >
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <input
                                type="checkbox"
                                id="notifications-toggle"
                                defaultChecked
                                style={{
                                    accentColor: '#0078d4',
                                    width: 18,
                                    height: 18
                                }}
                            />
                            <label htmlFor="notifications-toggle" style={{ fontSize: '1rem', color: '#444', cursor: 'pointer', fontWeight: 500 }}>
                                Enable Notifications
                            </label>
                        </div>
                    </div>
                </div>
            </Navbar>
        </>
    )
}
