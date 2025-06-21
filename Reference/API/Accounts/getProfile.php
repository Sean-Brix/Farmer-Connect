<?php

require_once __DIR__.'/../../global.php';

$token = $_SESSION['token'];
$user = verify_token($token, ACCESS_KEY);

if(!$user){  
    sendResponse(
        401,
        "Unauthorized",
        ["Error"=>"Token failed to verify",
        "User does not have an account yet"]
    );
    exit();
}

$user_id = $_GET['user_id'] ?? null;
if ($user_id !== null) {
    $Account = new Account($user_id);
    $details = $Account->getDetails(false);

    if (isset($details['profile_picture']) && $details['profile_picture'] != null) {
        sendImageResponse($details['profile_picture']);
        exit();
    }
    
    sendResponse(
        204,
        "Not Found",
        [
            "error" => "Resource not found or User has no profile picture",
            "value" => "None"
        ],
        "Profile picture defaulting"
    );
    exit();
} else {
    $Account = new Account($user['ID']);
$details = $Account->getDetails(false);

    if (isset($details['profile_picture']) && $details['profile_picture'] != null) {
    sendImageResponse($details['profile_picture']);
    exit();
}

sendResponse(
    404,
    "Not Found",
    [
        "error" => "Resource not found or User has no profile picture",
        "value" => "None"
    ],
    "Profile picture defaulting"
);
}
