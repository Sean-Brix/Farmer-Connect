<?php

require_once __DIR__.'../../../global.php';

// Authentication
$token = $_SESSION['token'];

if (empty($token)) {
    sendResponse(
        400,
        "Bad Request",
        ["Error"=>"Token is missing"],
        "missing token"
    );
    exit();
}

$user = verify_token($token, ACCESS_KEY);

if($user === null){
    sendResponse(
        401,
        "Unauthorized",
        ["Error"=>"Token failed to verify"],
        "invalid token"
    );
    exit();
}

$Account = new Account($user['ID']);
$detail = $Account->getDetails();

sendResponse(
    200,
    'success',
    ["access"=>$detail['access']]
);
