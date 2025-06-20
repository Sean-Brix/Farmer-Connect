<?php

require_once __DIR__.'/../../global.php';
require_once __DIR__.'/../../Controller/Seminars/searchSeminar.php';

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

// Query Parameters
$find = $_GET['find'];
$filter = strtolower($_GET['filter']);
$status = strtolower($_GET['status']);

$validFilters = ['all', 'speaker', 'title', 'location'];
$validStatus =  ['all', 'upcoming', 'completed', 'ongoing', 'cancelled'];

if (!in_array($filter, $validFilters) || !in_array($status, $validStatus)) {
    sendResponse(
        400,
        "Bad Request",
        ["Error" => "Invalid filter value"],
        "invalid filter/status"
    );
    exit();
}

$result = searchSeminars($find, $filter, $status);

echo json_encode($result);
    