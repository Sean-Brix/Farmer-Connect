<?php

require_once __DIR__."/../../Utils/statement.php";

// Checks if a username exists and optionally returns the ID
function usernameExist(string $username, bool $getID = false) {
    $query = "SELECT id FROM `accounts` WHERE username = ?";
    $result = statement($query, [$username], "s");
    
    $row = mysqli_fetch_assoc($result);
    
    if ($getID) {
        return $row ? $row['id'] : false;
    }
    
    return $row !== null;
}
