
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

$EIC = new EIC(null);
$total_EIC_count = $EIC->getTotalUserCount();

sendResponse(
    200,
    "OK",
    [$total_EIC_count],
    "get total seminar count success"
);


