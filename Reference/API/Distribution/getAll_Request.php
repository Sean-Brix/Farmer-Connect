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

$all_requests = Distribution::getAllRequests();

$data = [];
if($all_requests) {
foreach($all_requests as $request){
        $distribution_object = new Distribution($request['distribution_item_id']);
        $distribution_item = $distribution_object->getDetails();

        if($distribution_item) {
        $data[] = [
                "id"=>$request['id'],
            "user_id"=>$request['account_id'],
                "distribution_item_id"=>$request['distribution_item_id'],
                "item_name"=>$distribution_item['name'],
                "schedule_date"=>$request['schedule_date'],
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
                "schedule_date"=>$request['schedule_date'],
                "status"=>$request['status'],
                "quantity"=>$request['quantity'],
                "request_note"=>$request['request_note']
        ];
    }

    }

}
sendResponse(
    200,
    "All Distribution Requests",
    $data,
    "all_distribution_requests"
);
