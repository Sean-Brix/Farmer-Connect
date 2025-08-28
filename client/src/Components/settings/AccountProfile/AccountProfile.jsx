import { Link } from 'react-router-dom';
import default_picture from '../../../Assets/default_picture.png';
import { useEffect, useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';

import Info_Block from './Info_Block';

export default function AccountProfile({ admin_navigate, details }) {
    const { theme } = useTheme();
    // Default Value
    const [user, setUser] = useState({
        access: 'Admin',
        address: 'Address',
        cellphone_no: '00000000000',
        client_profile: 'Citizen',
        created_at: '0000-00-00 00:00:00',
        email_address: 'userAccount@gmail.com',
        firstname: 'First Name',
        lastname: 'Last Name',
        gender: 'Gender',
        id: '0',
        institution: 'User Institution',
        occupation: 'Occupation',
        position: 'Position',
        telephone_no: '0000-0000',
        username: 'Account Username',
        picture: details.picture,
    });

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch('/api/accounts/details', {
                    method: 'GET',
                });
                const data = await response.json();

                if (!response.ok) {
                    console.error('Account profile error:', data.payload.error);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                setUser({ ...data.payload, picture: details.picture });
            } catch (error) {
                console.error('Error fetching user details:', error);
                admin_navigate('analytics');
            }
        })();
    }, []);

    return (
        <>
            <div className="relative mt-20 sm:mt-30  md:mt-30">
                <hr className="border-gray-300 dark:border-gray-600" />
                <span className="absolute left-1/8 -translate-x-1/4 -top-5 bg-white dark:bg-gray-800 rounded-lg px-4 text-2xl font-semibold text-gray-700 dark:text-gray-200">
                    Account Settings
                </span>
            </div>

            <Info_Block user={user} admin_navigate={admin_navigate} theme={theme} />
        </>
    );
}
