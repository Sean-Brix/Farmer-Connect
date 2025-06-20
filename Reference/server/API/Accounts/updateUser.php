<?php

require_once __DIR__.'/../../global.php';


$token = $_SESSION['token'];

$user = verify_token($token, ACCESS_KEY);

if(!$user){  
    sendResponse(
        401,
        "Unauthorize",
        ["Error"=>"Token failed to verify"],
        "User Does not have an account yet"
    );
    exit();
}

$Account = new Account($user['ID']);
$details = $Account->getDetails();

$req = getJsonBody();

$result = $Account->updateAccount($req);

if($result){
    sendResponse(
        200,
        "Account Updated",
        ["Details"=>$Account->getDetails()],
        "Account updated successfully"
    );
}
else{
    sendResponse(
        500,
        "Internal Server Error",
        ["Error"=>"Failed to update account"],
        "Failed to update account"
    );
}
