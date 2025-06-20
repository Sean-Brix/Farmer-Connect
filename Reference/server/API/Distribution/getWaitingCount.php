
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

$distribution = new Distribution(null);
$total_waiting_count = $distribution->getTotalWaitingCount();

sendResponse(
    200,
    "OK",
    [$total_waiting_count],
    "get total waiting request count success"
);


