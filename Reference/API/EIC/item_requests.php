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
$detail = $Account->getDetails();

if($detail['access'] === "User"){  
    sendResponse(
        401,
        "Unauthorize",
        ["Error"=>"User cannot view an EIC's item requests"],
        "User cannot view an EIC's item requests"
    );
    exit();
}

$eic_id = $_GET['id'];

$EIC = new EIC($eic_id);
$request_list = $EIC->getEICRequest($eic_id);

$eic_details = $EIC->getDetails();

if (is_array($request_list)) {
    
    foreach($request_list as &$request){
        $borrower = new Account($request['account_id']);
        $request['borrower_details'] = $borrower->getDetails();
    }

    $response_data = [
        'item_name' => $eic_details['Name'],
        'requests' => $request_list
    ];

    sendResponse(
        200,
        "EIC Item Requests",
            $response_data,
        "Successfully retrieved all item requests"
    );
    
} 
else {
    sendResponse(
        500,
        "Error",
        ["Error"=>"Failed to retrieve item requests"],
        "Failed to retrieve item requests"
    );
}
