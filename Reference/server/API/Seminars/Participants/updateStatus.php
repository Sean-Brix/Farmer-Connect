<?php

require_once __DIR__.'/../../../global.php';

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
        ["Error"=>"Regular User cannot updated a participant's status"],
        "Unauthorize Post Request"
    );
    exit();
}

    // Get Data
    $body = getJsonBody();
    $id = $body['participants_id'];
    $status = $body['new_status'];

    // Validate data
    if(!$id || !$status){
        sendResponse(
            400,
            "Bad Request",
            ["Error"=>"Missing required fields"],
            "missing fields"
        );
        exit();
    }

    if(!in_array($status, ['Registered', 'Attended', 'Cancelled', 'No Show'])){
        sendResponse(
            400,
            "Bad Request",
            ["Error"=>"Invalid status value"],
            "invalid status"
        );
        exit();
    }

    // Verify if ID exists and get current status
    $checkQuery = "SELECT id, status FROM seminar_participants WHERE id = ?";
    $checkParams = [$id];
    $checkResult = statement($checkQuery, $checkParams, getTypes($checkParams));

    if ($checkResult === false || $checkResult->num_rows == 0) {
        sendResponse(
            400,
            "Bad Request",
            ["Error"=>"Invalid participant ID"],
            "invalid id"
        );
        exit();
    }

    $participant = $checkResult->fetch_assoc();

    if ($participant['status'] === $status) {
        sendResponse(
            200,
            "OK",
            ["Message"=>"Participant status is already up to date"],
            "status already up to date"
        );
        exit();
    }


    // Update status
    $query = "UPDATE seminar_participants SET status = ? WHERE id = ?";
    $params = [$status, $id];
    $result = statement($query, $params, getTypes($params));

    if($result){
        sendResponse(
            200,
            "OK",
            ["Message"=>"Participant status updated successfully"],
            "status updated"
        );
    }
    else{
        sendResponse(
            500,
            "Internal Server Error",
            ["Error"=>$conn->error],
            "server error"
        );
    }
