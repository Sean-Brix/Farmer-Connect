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
if(!isset($req['request_id']) || !isset($req['status'])){
    sendResponse(
        400,
        "Invalid Request Body",
        ["Error"=>"Request ID and Status are required"],
        "Missing Request ID or Status"
    );
    exit();
}

$distribution = new Distribution(null);
$result = Distribution::approveRequest($req['request_id'], $user['ID'], $req['status']);

if($result){
    sendResponse(
        200,
        "Request Updated",
        ["Message"=>"Request Updated Successfully"],
        "Request Updated Successfully"
    );
}
else{
    sendResponse(
        500,
        "Internal Server Error",
        ["Error"=>"Failed to update request"],
        "Failed to update request"
    );
}
