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
        ["Error"=>"Regular User cannot delete a Distribution Item"],
        "Unauthorize Get Request"
    );
    exit();
}

// Query Parameter
$delete_id = $_GET['id'];

$Distribution = new Distribution(null);
$result = $Distribution->deleteStatic($delete_id);

if($result){
    sendResponse(
        200,
        "Success",
        ["message"=>"Distribution Item Deleted Successfully"],
        "Distribution Item Deleted"
    );
}
else{
    sendResponse(
        500,
        "Error",
        ["Error"=>"Failed to delete Distribution Item"],
        "Distribution Item Deletion Failed"
    );
}
