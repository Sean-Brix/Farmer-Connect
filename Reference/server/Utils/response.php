<?php
function sendResponse(int $statusCode = 200, string $status = "success", array $payload = [], string $message = ""): void {
    ob_clean();
    
    // Set HTTP status code
    http_response_code($statusCode);

    // Set JSON headers
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Origin: *"); // Optional, add if you want CORS enabled

    // Prepare response array
    $response = [
        "status" => $status
    ];

    if ($message !== "") {
        $response["message"] = $message;
    }

    if (!empty($payload)) {
        $response["payload"] = $payload;
    }

    // Output JSON and stop script execution
    echo json_encode($response);
    exit;
}


function sendImageResponse(string $imageBlob): void {
    // Output buffering to prevent issues
    ob_start();

    if (empty($imageBlob)) {
        header("HTTP/1.1 404 Not Found");
        sendResponse(
            500,
            "Server Error",
            ["error"=>"Image Response got a parameter of different type ( not image )"],
            "Something went wrong"
        );
        exit();
    }

    // Create finfo object to detect MIME type
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mimeType = $finfo->buffer($imageBlob);

    // Validate MIME type (fallback if detection fails)
    if (!$mimeType) {
        $mimeType = "application/octet-stream"; // Generic binary type
    }
    
    // Set appropriate headers for image response
    header("Content-Type: " . $mimeType);
    header("Content-Length: " . strlen($imageBlob));
    
    // Output the image data
    echo $imageBlob;

    // Flush output buffer & end script
    ob_end_flush();
    exit();
}