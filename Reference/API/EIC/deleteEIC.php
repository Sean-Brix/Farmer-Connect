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
        ["Error"=>"Regular User cannot delete an EIC Item"],
        "Unauthorize Get Request"
    );
    exit();
}

// Query Parameter
$delete_id = $_GET['id'];

$EIC = new EIC(null);

$result = $EIC->deleteStatic($delete_id);

if($result){
    sendResponse(
        200,
        "Success",
        ["message"=>"EIC Item Deleted Successfully"],
        "EIC Item Deleted"
    );
}
else{
    sendResponse(
        500,
        "Error",
        ["Error"=>"Failed to delete EIC Item"],
        "EIC Item Deletion Failed"
    );
}
