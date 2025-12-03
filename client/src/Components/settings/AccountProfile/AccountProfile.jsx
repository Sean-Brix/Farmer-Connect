import { useEffect, useState } from 'react';
import { useCustomTranslation } from '../../../hooks/useCustomTranslation';
import { useTheme } from '../../../contexts/ThemeContext';
import Info_Block from './Info_Block';

export default function AccountProfile({ admin_navigate }) {
    const { t } = useCustomTranslation();
    const { theme } = useTheme();
    // Simplified schema - only 13 fields
    const [user, setUser] = useState({
        id: '0',
        firstName: 'First Name',
        middleName: '',
        surname: 'Last Name',
        extensionName: '',
        sex: 'Male',
        contactNumber: '00000000000',
        dateOfBirth: '2000-01-01',
        username: 'Account Username',
        email: 'user@example.com',
        access: 'Admin',
        client_profile: 'Citizen',
        picturePath: null,
    });

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch('/api/accounts/details', {
                    method: 'GET',
                });
                const data = await response.json();

                if (!response.ok) {
                    console.error('Account profile error:', data.payload?.error || data.error);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                setUser(data.payload || data);
            } catch (error) {
                console.error('Error fetching user details:', error);
                admin_navigate('analytics');
            }
        })();
    }, [admin_navigate]);

    return (
        <>
            <div className="relative mt-20 sm:mt-30  md:mt-30">
                <hr className="border-gray-300 dark:border-gray-600" />
                <span className="absolute left-1/8 -translate-x-1/4 -top-5 bg-white dark:bg-gray-800 rounded-lg px-4 text-2xl font-semibold text-gray-700 dark:text-gray-200">
                    {t('settings.account_settings')}
                </span>
            </div>

            <Info_Block user={user} admin_navigate={admin_navigate} theme={theme} />
        </>
    );
}
