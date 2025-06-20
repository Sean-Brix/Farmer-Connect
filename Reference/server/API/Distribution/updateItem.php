<?php

require_once __DIR__."/../../global.php";

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

// Authorization
$Account = new Account($user['ID']);
$details = $Account->getDetails();

if(strtolower($details['access']) === "user"){
    sendResponse(
        401,
        "Unauthorize",
        ["Error"=>"Regular User cannot update a Distribution Item"],
        "Unauthorize Post Request"
    );
    exit();
}

// Get request Body
$req = getJsonBody();

// Update Distribution Item
$Distribution = new Distribution($req['id']);
$details = $Distribution->getDetails();

if(!$details['id']){
    sendResponse(
        404,
        "Not Found",
        ["Error"=>"Distribution Item Not Found"],
        "Invalid Distribution ID"
    );
    exit();
}

unset($req['id']);

$Distribution->setDetails($req);
$update = $Distribution->save();

if($update){
    sendResponse(
        200,
        "OK",
        ["Message"=>"Distribution Item updated successfully"],
        "Distribution Item Updated"
    );
} 
else {
    sendResponse(
        500,
        "Internal Server Error",
        ["Error"=>"Failed to update Distribution Item"],
        "Update Failed"
    );
}