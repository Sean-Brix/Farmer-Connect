<?php

require_once __DIR__.'../../../global.php';

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

$Account = new Account($user['ID']);
$acc_details = $Account->getDetails();

$delete_id = $_GET['id'];

$distribution = new Distribution(null);
$result = $distribution->cancelRequest($delete_id);

if($result){
    sendResponse(
        204,
        "Success",
        ["Message"=>"Request cancelled successfully"]
    );
}
else{
    sendResponse(
        500,
        "Error",
        ["Error"=>"Failed to cancel request"]
    );
}
