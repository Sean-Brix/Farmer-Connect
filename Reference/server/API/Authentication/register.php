<?php

require_once __DIR__."/../../global.php";
require_once __DIR__."/../../Controller/Account/userExist.php";

// Account Model
$Account = new Account(null);

// Request Body
$req = getJsonBody();

$firstName = $req['firstName'];
$lastName = $req["lastName"];
$gender = $req["gender"];
$clientProfile = $req["clientProfile"];
$address = $req["address"];
$telNo = $req["telephoneNum"];
$cellNo = $req["cellphoneNum"];
$occupation = $req["occupation"];
$position = $req["position"];
$institution = $req["institution"];
$email = $req["email"];
$username = $req["username"];
$password = $req["password"];
$confirm = $req["confirmPass"];

if(!$firstName || !$lastName || !$gender || !$clientProfile || !$address || !$occupation || !$position || !$institution || !$email || !$username || !$password || !$confirm){
    sendResponse(
        404, 
        "Bad Request", 
        ["error"=>"Missing data for registration"], 
        "All inputs are required"
    );
    exit();
}

if($password != $confirm){
    sendResponse(
        404, 
        "Bad Request", 
        ["error"=>"Password & Confirm Password did not match"], 
        "Password doesn't match"
    );

    exit();
}

if(usernameExist($username)){
    sendResponse(
        409, 
        "Server Conflict", 
        ["error"=>"Password & Confirm Password did not match"], 
        "Username already exist"
        );
        exit();
    }
    
$password = password_hash($password, PASSWORD_DEFAULT);
$result = $Account->createAccount([
    $firstName,
    $lastName,
    $gender,
    $clientProfile,
    $address,
    $telNo,
    $cellNo,
    $occupation,
    $position,
    $institution,
    $email,
    $username,
    $password
]);

if($result){
    sendResponse(
        201, 
        "Success", 
        [], 
        "Account successfully created"
    );
    exit();
}

sendResponse(
    500, 
    "Server Error", 
    ["error"=>"ERROR: Register.php - createAccount() Function error"], 
    "Something went wrong, try again later"
);

