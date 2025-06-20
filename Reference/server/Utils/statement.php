<?php

require_once __DIR__ . "/connect_db.php";

function statement(string $query, array $parameters = [], string $types = "") {
    global $conn;

    $stmt = mysqli_prepare($conn, $query);

    if (!$stmt) {
        die("Preparation failed: " . mysqli_error($conn));
    }

    // Bind parameters by reference
    if (!empty($parameters)) {
        if (strlen($types) !== count($parameters)) {
            die("Parameter types count does not match parameters count.");
        }

        $refs = [];
        foreach ($parameters as $key => $value) {
            $refs[$key] = &$parameters[$key];
        }

        array_unshift($refs, $types);
        call_user_func_array([$stmt, 'bind_param'], $refs);

        // Send long data manually for blobs
        foreach (str_split($types) as $i => $type) {
            if ($type === 'b') {
                mysqli_stmt_send_long_data($stmt, $i, $parameters[$i]);
            }
        }
    }

    $success = mysqli_stmt_execute($stmt);

    if (!$success) {
        return false;
    }

    $result = mysqli_stmt_get_result($stmt);

    return $result === false ? true : $result;
}


function getTypes(array $params): string {
    $types = '';
    foreach ($params as $param) {
        if (is_int($param)) {
            $types .= 'i';
        } elseif (is_float($param)) {
            $types .= 'd';
        } elseif (is_string($param)) {
            $types .= 's';
        } else {
            $types .= 'b'; // fallback to blob
        }
    }
    return $types;
}
