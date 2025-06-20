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

if(strtolower($details['access']) === "user"){
    sendResponse(
        401,
        "Unauthorize",
        ["Error"=>"Regular User cannot add a new seminar program"],
        "Unauthorize Post Request"
    );
    exit();
}

// Request Body
$req = getJsonBody();

// Validation
if (
    !isset($req['title']) || empty($req['title']) ||
    !isset($req['description']) || empty($req['description']) ||
    !isset($req['location']) || empty($req['location']) ||
    !isset($req['start_date']) || empty($req['start_date']) ||
    !isset($req['end_date']) || empty($req['end_date']) ||
    !isset($req['start_time']) || empty($req['start_time']) ||
    !isset($req['end_time']) || empty($req['end_time']) ||
    !isset($req['capacity']) || empty($req['capacity']) ||
    !isset($req['speaker']) || empty($req['speaker']) ||
    !isset($req['registration_deadline']) || empty($req['registration_deadline'])
){
    sendResponse(
        400,
        "Bad Request",
        ["Error"=>"Missing or invalid parameters"],
        "Invalid input"
    );
    exit();
}

// Sanitize data
$title = htmlspecialchars(strip_tags($req['title']));
$start_date = htmlspecialchars(strip_tags($req['start_date']));
$end_date = htmlspecialchars(strip_tags($req['end_date']));
$start_time = htmlspecialchars(strip_tags($req['start_time']));
$end_time = htmlspecialchars(strip_tags($req['end_time']));
$location = htmlspecialchars(strip_tags($req['location']));
$description = htmlspecialchars(strip_tags($req['description']));
$capacity = intval($req['capacity']);
$speaker = htmlspecialchars(strip_tags($req['speaker']));
$registration_deadline = htmlspecialchars(strip_tags($req['registration_deadline']));

// Prepare Seminar Data
$Seminar = new Seminars();
$seminarData = [
    'title' => $title,
    'description' => $description,
    'location' => $location,
    'start_date' => $start_date,
    'end_date' => $end_date,
    'start_time' => $start_time,
    'end_time' => $end_time,
    'capacity' => $capacity,
    'status' => 'Upcoming',
    'speaker' => $speaker,
    'registration_deadline' => $registration_deadline
];

// Create New Seminar
$createStatus = $Seminar->createSeminar($seminarData);

$new_id = $Seminar->findSeminarID($seminarData['title']);
$new_seminar = new Seminars($new_id);

// Response
if ($createStatus) {
    $new_details = $new_seminar->getDetails();
    unset($new_details['photo']);

    sendResponse(
        201,
        "Seminar Created",
        $new_details,
        "Seminar created successfully"
    );
} 
else {
    sendResponse(
        500,
        "Internal Server Error",
        ["Error"=>"Failed to create seminar"],
        "Database error"
    );
}
