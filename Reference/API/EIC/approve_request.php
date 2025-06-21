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

if($acc_details['access'] === "User"){  
    sendResponse(
        401,
        "Unauthorize",
        ["Error"=>"User cannot approved a request"],
        "User cannot approved a request"
    );
    exit();
}

// Get Json Body

$req = getJsonBody();

// Validate Json Body
if(!isset($req['request_id'])){
    sendResponse(
        400,
        "Request ID Missing",
        ["Error"=>"Request ID Missing"],
        "Missing Request ID"
    );
    exit();
}

$EIC = new EIC(null);
$result = $EIC->approveRequest($req['request_id'], $user['ID'], $req['status']);

if($result){
    sendResponse(
        200,
        "Request Approved",
        ["Message"=>"Request Approved Successfully"],
        "Request Approved Successfully"
    );
}
else{
    sendResponse(
        500,
        "Internal Server Error",
        ["Error"=>"Failed to approve request"],
        "Failed to approve request"
    );
}
