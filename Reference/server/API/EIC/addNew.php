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

// Authorization
$Account = new Account($user['ID']);
$details = $Account->getDetails();

if(strtolower($details['access']) === "user"){
    sendResponse(
        401,
        "Unauthorize",
        ["Error"=>"Regular User cannot add new EIC Item"],
        "Unauthorize Post Request"
    );
    exit();
}

// Get Request Body
$req = getJsonBody();

// Create New
$EIC = new EIC(null);

$new = $EIC->create([
    'Name' => $req['Name'],
    'description' => $req['description'],
    'quantity' => $req['quantity'],
    'status' => $req['status'],
    'category' => $req['category'],
    'added_by' => $user['ID']
]);

$EIC = new EIC($new);
$new_detail = $EIC->getDetails();

$admin = new Account($new_detail['added_by']);
$admin_detail = $admin->getDetails();
$admin_fullname = $admin_detail['firstname']." ".$admin_detail['lastname'];

$new_detail['added_by_id'] = $new_detail['added_by'];
$new_detail['added_by'] = $admin_fullname;

sendResponse(
    200,
    'success',
    [$new_detail],
    ''
);