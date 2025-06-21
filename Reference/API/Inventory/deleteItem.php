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
        "User cannot delete an item"
    );
    exit();
}


// Query Parameter
$delete_id = $_GET['id'];

$Inventory = new Inventory(null);
$result = $Inventory->deleteItem($delete_id);

if($result){
    sendResponse(
        204,
        "OK",
        [],
        "item deleted"
    );
}
else{
    sendResponse(
        500,
        "Internal Server Error",
        ["Error"=>"Failed to delete item"],
        "item deletion failed"
    );
}
exit();


