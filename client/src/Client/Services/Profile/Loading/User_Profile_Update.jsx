import Navbar from '../../../Components/Navbar.jsx';

export default function User_Profile_Update() {
    return (
        <>
            <Navbar />
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '80vh',
                    flexDirection: 'column',
                    backgroundColor: '#f0f2f5',
                }}
            >
                <div
                    className="spinner"
                    style={{
                        border: '8px solid #f3f3f3' /* Light grey */,
                        borderTop: '8px solid #3498db' /* Blue */,
                        borderRadius: '50%',
                        width: '50px',
                        height: '50px',
                        animation: 'spin 2s linear infinite',
                    }}
                ></div>
                <p
                    style={{
                        marginTop: '20px',
                        fontSize: '1.2em',
                        color: '#555',
                    }}
                >
                    Updating User Profile...
                </p>

                <style>
                    {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
                </style>
            </div>
        </>
    );
}
