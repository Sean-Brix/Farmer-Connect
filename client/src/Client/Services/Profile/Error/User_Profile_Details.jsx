import Navbar from '../../../Components/Navbar.jsx';
import { useNavigate } from 'react-router-dom';

export default function User_Profile_Error({ statusCode }) {
    const navigate = useNavigate();
    let errorMessage = 'Failed to load user profile details.';
    let errorTitle = 'Oops!';
    let errorColor = '#e74c3c';

    if (statusCode === 500) {
        errorMessage = 'Server error. Please try again later.';
        errorTitle = 'Server Error';
        errorColor = '#c0392b';
    } 
    else if (statusCode === 401) {
        errorMessage = 'Please log in to continue.';
        errorTitle = 'Unauthorize';
        errorColor = '#3498db';
    }

    return (
        <>
            <Navbar />
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    backgroundColor: '#f0f0f0',
                }}
            >
                <div
                    style={{
                        backgroundColor: 'white',
                        padding: '30px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        textAlign: 'center',
                        maxWidth: '600px',
                        width: '90%',
                    }}
                >
                    <h2
                        style={{
                            color: errorColor,
                            fontSize: '2.5rem',
                            marginBottom: '15px',
                        }}
                    >
                        {errorTitle}
                    </h2>
                    <p style={{ fontSize: '1.2rem', lineHeight: '1.6' }}>
                        {errorMessage}
                    </p>
                    {statusCode === 401 && (
                        <button
                            onClick={() => navigate('/login')}
                            style={{
                                backgroundColor: errorColor,
                                color: 'white',
                                padding: '12px 24px',
                                borderRadius: '6px',
                                border: 'none',
                                cursor: 'pointer',
                                marginTop: '20px',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                            }}
                        >
                            Login
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}
