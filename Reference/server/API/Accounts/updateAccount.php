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

// Authorization
$Account = new Account($user['ID']);
$details = $Account->getDetails();


// Query Parameter
$data = getJsonBody();

// Get Account
$Edit = new Account($data['id']);

// Update Account
unset($data['id']);
unset($data['picture']);
unset($data['created_at']);
unset($data['updated_at']);

$Edit->setFields($data);
$Edit->save();
$updated = $Edit->getDetails();

sendResponse(
    201,
    "success",
    ["updated"=> $updated],
    "Successfully updated the account"
);


