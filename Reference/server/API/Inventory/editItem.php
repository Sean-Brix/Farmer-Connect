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

$Account = new Account($user['ID']);
$details = $Account->getDetails();

if($details['access']=="User"){  
    sendResponse(
        403,
        "Forbidden",
        ["Error"=>"Insufficient privileges"],
        "User cannot edit an item"
    );
    exit();
}


// Get Json Body
$req = getJsonBody();

$Inventory = new Inventory(null);
$result = $Inventory->update($req);

if($result){
    sendResponse(
        200,
        "Created",
        [$result],
        "item updated"
    );
}
else{
    sendResponse(
        500,
        "Internal Server Error",
        ["Error"=>"Failed to update item"],
        "item edit failed"
    );
}
exit();


