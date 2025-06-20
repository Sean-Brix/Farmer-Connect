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
        ["Error"=>"Regular User cannot update an EIC Item"],
        "Unauthorize Post Request"
    );
    exit();
}

// Get request Body
$req = getJsonBody();

// Update Seminar
$EIC = new EIC($req['id']);
$details = $EIC->getDetails();

if(!$details['id']){
    sendResponse(
        404,
        "Not Found",
        ["Error"=>"EIC Item Not Found"],
        "Invalid EIC ID"
    );
    exit();
}

unset($req['id']);

$EIC->setDetails($req);
$update = $EIC->save();

if($update){
    sendResponse(
        200,
        "OK",
        ["Message"=>"EIC updated successfully"],
        "EIC Updated"
    );
} 
else {
    sendResponse(
        500,
        "Internal Server Error",
        ["Error"=>"Failed to update EIC"],
        "Update Failed"
    );
}