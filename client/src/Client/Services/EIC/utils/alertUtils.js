// Utility functions for showing custom alerts
export const showSuccessAlert = (message) => {
    const alertDiv = document.createElement('div');
    alertDiv.innerHTML = `
        <div id="custom-eic-alert" style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.95);
            z-index: 9999;
            background: rgba(34,197,94,0.98);
            background: linear-gradient(100deg, #22c55e 0%, #16a34a 100%);
            color: #fff;
            padding: 1.5rem 2.8rem;
            border-radius: 2rem;
            box-shadow: 0 12px 40px 0 rgba(34,197,94,0.22);
            font-size: 1.18rem;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 1.1rem;
            min-width: 320px;
            max-width: 90vw;
            animation: eicAlertPopIn 0.45s cubic-bezier(.68,-0.55,.27,1.55);
            overflow: hidden;
        ">
            <span style="
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(255,255,255,0.13);
                border-radius: 50%;
                width: 2.8rem;
                height: 2.8rem;
                box-shadow: 0 2px 8px 0 rgba(34,197,94,0.10);
            ">
                <i class="fa-solid fa-circle-check" style="font-size:2rem; color: #fff; filter: drop-shadow(0 2px 8px #22c55e88);"></i>
            </span>
            <span style="letter-spacing:0.01em;">${message}</span>
            <span class="eic-alert-bar" style="
                position: absolute;
                bottom: 0; left: 0;
                height: 4px;
                width: 100%;
                background: linear-gradient(90deg, #dcfce7 0%, #16a34a 100%);
                animation: eicAlertBar 2.1s linear;
            "></span>
        </div>
        <style>
            @keyframes eicAlertPopIn {
                0% { opacity: 0; transform: translate(-50%, -60%) scale(0.85);}
                60% { opacity: 1; transform: translate(-50%, -50%) scale(1.05);}
                100% { opacity: 1; transform: translate(-50%, -50%) scale(1);}
            }
            @keyframes eicAlertBar {
                from { width: 0%; }
                to { width: 100%; }
            }
        </style>
    `;
    document.body.appendChild(alertDiv);

    setTimeout(() => {
        const el = document.getElementById('custom-eic-alert');
        if (el) {
            el.style.transition = 'opacity 0.35s, transform 0.35s';
            el.style.opacity = '0';
            el.style.transform = 'translate(-50%, -50%) scale(0.95)';
            setTimeout(() => {
                if (alertDiv.parentNode) alertDiv.parentNode.removeChild(alertDiv);
            }, 350);
        }
    }, 2100);
};

export const showErrorAlert = (message) => {
    const alertDiv = document.createElement('div');
    alertDiv.innerHTML = `
        <div id="custom-eic-alert" style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.95);
            z-index: 9999;
            background: #dc2626;
            background: linear-gradient(100deg, #dc2626 0%, #f87171 100%);
            color: #fff;
            padding: 1.5rem 2.8rem;
            border-radius: 2rem;
            box-shadow: 0 12px 40px 0 rgba(239,68,68,0.22);
            font-size: 1.18rem;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 1.1rem;
            min-width: 320px;
            max-width: 90vw;
            animation: eicAlertPopIn 0.45s cubic-bezier(.68,-0.55,.27,1.55);
            overflow: hidden;
        ">
            <span style="
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(255,255,255,0.13);
                border-radius: 50%;
                width: 2.8rem;
                height: 2.8rem;
                box-shadow: 0 2px 8px 0 rgba(239,68,68,0.10);
            ">
                <i class="fa-solid fa-circle-xmark" style="font-size:2rem; color: #fff; filter: drop-shadow(0 2px 8px #f8717188);"></i>
            </span>
            <span style="letter-spacing:0.01em;">${message}</span>
            <span class="eic-alert-bar" style="
                position: absolute;
                bottom: 0; left: 0;
                height: 4px;
                width: 100%;
                background: linear-gradient(90deg, #fecaca 0%, #dc2626 100%);
                animation: eicAlertBar 2.1s linear;
            "></span>
        </div>
        <style>
            @keyframes eicAlertPopIn {
                0% { opacity: 0; transform: translate(-50%, -60%) scale(0.85);}
                60% { opacity: 1; transform: translate(-50%, -50%) scale(1.05);}
                100% { opacity: 1; transform: translate(-50%, -50%) scale(1);}
            }
            @keyframes eicAlertBar {
                from { width: 0%; }
                to { width: 100%; }
            }
        </style>
    `;
    document.body.appendChild(alertDiv);

    setTimeout(() => {
        const el = document.getElementById('custom-eic-alert');
        if (el) {
            el.style.transition = 'opacity 0.35s, transform 0.35s';
            el.style.opacity = '0';
            el.style.transform = 'translate(-50%, -50%) scale(0.95)';
            setTimeout(() => {
                if (alertDiv.parentNode) alertDiv.parentNode.removeChild(alertDiv);
            }, 350);
        }
    }, 2100);
};

export const showLoginPrompt = (navigate) => {
    const alertDiv = document.createElement('div');
    alertDiv.innerHTML = `
        <div id="custom-login-alert" style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.95);
            z-index: 9999;
            background: rgba(37,99,235,0.98);
            background: linear-gradient(100deg, #2563eb 0%, #3b82f6 100%);
            color: #fff;
            padding: 2rem 3rem;
            border-radius: 2rem;
            box-shadow: 0 12px 40px 0 rgba(59,130,246,0.22);
            font-size: 1.18rem;
            font-weight: 700;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1.5rem;
            min-width: 350px;
            max-width: 90vw;
            animation: loginAlertPopIn 0.45s cubic-bezier(.68,-0.55,.27,1.55);
            overflow: hidden;
            text-align: center;
        ">
            <div style="
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(255,255,255,0.13);
                border-radius: 50%;
                width: 3rem;
                height: 3rem;
                box-shadow: 0 2px 8px 0 rgba(59,130,246,0.10);
            ">
                <i class="fa-solid fa-user-lock" style="font-size:1.5rem; color: #fff; filter: drop-shadow(0 2px 8px #3b82f688);"></i>
            </div>
            <div>
                <div style="font-size: 1.3rem; margin-bottom: 0.5rem;">Login Required</div>
                <div style="font-size: 1rem; font-weight: 400; opacity: 0.9; line-height: 1.4;">
                    You need to login first to view your requests
                </div>
            </div>
            <div style="display: flex; gap: 1rem; margin-top: 0.5rem;">
                <button id="login-btn" style="
                    background: rgba(255,255,255,0.2);
                    border: 2px solid rgba(255,255,255,0.3);
                    color: #fff;
                    padding: 0.75rem 1.5rem;
                    border-radius: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: 1rem;
                ">Go to Login</button>
                <button id="cancel-btn" style="
                    background: transparent;
                    border: 2px solid rgba(255,255,255,0.3);
                    color: #fff;
                    padding: 0.75rem 1.5rem;
                    border-radius: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: 1rem;
                ">Cancel</button>
            </div>
            <span class="login-alert-bar" style="
                position: absolute;
                bottom: 0; left: 0;
                height: 4px;
                width: 100%;
                background: linear-gradient(90deg, #dbeafe 0%, #3b82f6 100%);
            "></span>
        </div>
        <style>
            @keyframes loginAlertPopIn {
                0% { opacity: 0; transform: translate(-50%, -60%) scale(0.85);}
                60% { opacity: 1; transform: translate(-50%, -50%) scale(1.05);}
                100% { opacity: 1; transform: translate(-50%, -50%) scale(1);}
            }
            #login-btn:hover { background: rgba(255,255,255,0.3); transform: translateY(-2px); }
            #cancel-btn:hover { background: rgba(255,255,255,0.1); transform: translateY(-2px); }
        </style>
    `;
    document.body.appendChild(alertDiv);

    // Handle button clicks
    document.getElementById('login-btn').onclick = () => {
        document.body.removeChild(alertDiv);
        navigate('/login');
    };

    document.getElementById('cancel-btn').onclick = () => {
        document.body.removeChild(alertDiv);
    };
};
