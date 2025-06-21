
<?php

require_once __DIR__.'/../../global.php';

// Authentication
$token = $_SESSION['token'];
$user = verify_token($token, ACCESS_KEY);

if(!$user){  
    sendResponse(
        401,
        "Unauthorize",
        ["Error"=>"Token failed to verify"],
        "invalid token"
    );
    exit();
}

$account = new Account(null);
$total_user_count = $account->getTotalUserCount();

sendResponse(
    200,
    "OK",
    [$total_user_count],
    "get total user count success"
);

