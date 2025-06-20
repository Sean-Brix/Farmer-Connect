<?php

require_once __DIR__."/../../global.php";

try {
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

    // Check if seminar_id is provided
    if (!isset($_GET['seminar_id']) || empty($_GET['seminar_id'])) {
        throw new Exception("Seminar ID is required");
    }

    // query value
    $query = $_GET['seminar_id'];

    // find seminar record
    try {
        $Seminar = new Seminars($query);
    } catch (Exception $e) {
        throw new Exception("Invalid seminar ID or seminar not found");
    }

    // get all participants
    $participants = $Seminar->getParticipants();
    
    // Check if participants exist
    if (empty($participants)) {
        sendResponse(
            200,
            "success",
            ["list" => []],
            "No participants found for this seminar"
        );
        exit;
    }

    // Prepare json body for response
    $result = [];
    foreach ($participants as $user) {
        try {
            $Account = new Account($user['account_id']);
            $details = $Account->getDetails();
            
            // Remove data not needed
            unset($details['telephone_no']);
            unset($details['occupation']);
            unset($details['position']);
            unset($details['institution']);
            unset($details['created_at']);
            unset($details['client_profile']);
            unset($details['address']);
            unset($details['access']);
            
            $details['status'] = $user['status'];
            $details['reg_date'] = $user['registration_date'];
            $details['participant_id'] = $user['participant_id'];

            // Append
            $result[] = $details;

        } 
        catch (Exception $e) {
            // Log the error but continue with other participants
            error_log("Error processing participant ID {$user['account_id']}: " . $e->getMessage());
            continue;
        }
    }

    // Respond
    sendResponse(
        200,
        "success",
        ["list" => $result],
        "Participants successfully fetched"
    );

} 
catch (Exception $e) {
    sendResponse(
        400,
        "error",
        ["error"=>$e->getMessage()],
        $e->getMessage()
    );
}