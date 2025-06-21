<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function resetSession() {
    // Unset all session variables
    session_unset();

    // Destroy the session cookie
    if (isset($_COOKIE[session_name()])) {
        setcookie(
            session_name(), 
            '', 
            time() - 3600, 
            '/', 
            '', 
            isset($_SERVER["HTTPS"]), 
            true
        );
    }

    // Destroy the session
    session_destroy();
}
