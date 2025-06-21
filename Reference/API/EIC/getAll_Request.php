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
$acc_details = $Account->getDetails();

if($acc_details['access'] === "User"){  
    sendResponse(
        401,
        "Unauthorize",
        ["Error"=>"User cannot view all request"],
        "User cant view all existing request"
    );
    exit();
}

$EIC = new EIC(null);
$all_requests = $EIC->getAllRequests();

$data = [];
if($all_requests) {
foreach($all_requests as $request){
    $eic_object = new EIC($request['eic_id']);
    $eic_item = $eic_object->getDetails();

    if($eic_item) {
        $data[] = [
            "id"=>$request['id'],
            "user_id"=>$request['account_id'],
            "eic_id"=>$request['eic_id'],
            "item_name"=>$eic_item['Name'],
            "borrow_date"=>$request['borrow_date'],
            "return_date"=>$request['return_date'],
            "status"=>$request['status'],
            "quantity"=>$request['quantity'],
            "request_note"=>$request['request_note']
        ];
    }

    else {
        $data[] = [
            "id"=>$request['id'],
            "user_id"=>$request['account_id'],
            "item_name"=>"Item Not Found",
            "borrow_date"=>$request['borrow_date'],
            "return_date"=>$request['return_date'],
            "status"=>$request['status'],
            "quantity"=>$request['quantity'],
            "request_note"=>$request['request_note']
        ];
    }

}}

sendResponse(
    200,
    "All EIC Requests",
    $data,
    "all_eic_requests"
);
