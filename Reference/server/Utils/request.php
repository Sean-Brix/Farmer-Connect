<?php

require_once __DIR__ . '/./response.php';

function getJsonBody($assoc = true) {
    
    // Get HTTP Request
    $input = file_get_contents("php://input");

    // Decode Request Body into PHP array/object
    $decoded = json_decode($input, $assoc);
    
    // Error Handling
    if (json_last_error() !== JSON_ERROR_NONE) {

        sendResponse(400, "Error", [], "Invalid JSON: Failed to parse data request");
        exit;

    }

    // Returns the Parsed Body
    return $decoded;
}

