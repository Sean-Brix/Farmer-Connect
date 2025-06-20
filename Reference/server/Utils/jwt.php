<?php

function create_token(array $payload, string $secret): string {
    $payload_json = json_encode($payload);
    $payload_b64 = rtrim(strtr(base64_encode($payload_json), '+/', '-_'), '=');
    $signature = hash_hmac('sha256', $payload_b64, $secret, true);
    $signature_b64 = rtrim(strtr(base64_encode($signature), '+/', '-_'), '=');
    return $payload_b64 . '.' . $signature_b64;
}

function verify_token(string $token, string $secret): ?array {
    [$payload_b64, $signature_b64] = explode('.', $token);
    $payload_json = base64_decode(strtr($payload_b64, '-_', '+/'));
    $expected_signature = hash_hmac('sha256', $payload_b64, $secret, true);
    $expected_signature_b64 = rtrim(strtr(base64_encode($expected_signature), '+/', '-_'), '=');
    if (hash_equals($expected_signature_b64, $signature_b64)) {
        return json_decode($payload_json, true);
    }
    return null; // invalid
}
