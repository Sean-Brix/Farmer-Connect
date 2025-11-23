import React from 'react';
import './ThemeSwitch.css';

const ThemeSwitch = ({ isDark, onChange, disabled = false }) => {
  const handleChange = (e) => {
    console.log('🔄 [ThemeSwitch] Toggle clicked, checked:', e.target.checked);
    if (!disabled) {
      onChange(e.target.checked);
    }
  };

  console.log('🔄 [ThemeSwitch] Rendering with isDark:', isDark, 'disabled:', disabled);

  return (
    <label className="theme-switch">
      <input 
        type="checkbox" 
        className="theme-switch__checkbox"
        checked={isDark}
        onChange={handleChange}
        disabled={disabled}
      />
      <div className="theme-switch__container">
        <div className="theme-switch__clouds"></div>
        <div className="theme-switch__stars-container">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 144 55">
            <path fill="currentColor" d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"></path>
            <path fill="currentColor" d="m67,8 4,12h12l-10,7 3,12-9-6-9,6 3-12-10-7h12z"></path>
            <path fill="currentColor" d="m98,4 5,15h15l-12,9 4,15-12-8-12,8 4-15-12-9h15z"></path>
            <path fill="currentColor" d="m132,2 6,18h18l-14,11 5,18-15-11-15,11 5-18-14-11h18z"></path>
          </svg>
        </div>
        <div className="theme-switch__circle-container">
          <div className="theme-switch__sun-moon-container">
            <div className="theme-switch__moon">
              <div className="theme-switch__spot"></div>
              <div className="theme-switch__spot"></div>
              <div className="theme-switch__spot"></div>
            </div>
          </div>
        </div>
      </div>
    </label>
  );
};

export default ThemeSwitch;
