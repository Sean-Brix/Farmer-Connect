<?php
require_once __DIR__."/../Utils/statement.php";

class Account {

    private $id = null;
    private $access = "User";
    private $firstname = null;
    private $lastname = null;
    private $gender = null;

    private $profile_picture = null;
    private $client_profile = null;
    private $address = null;
    private $telephone_no = null;
    private $cellphone_no = null;
    private $occupation = null;
    private $position = null;
    private $institution = null;
    private $email_address = null;
    private $username = null;
    private $password = null;
    private $created_at = null;
    private $updated_at = null;

    public function __construct($account_id = null){

        $this->id = $account_id;

        if($account_id) $this->initialize();
    }

    // Get all details of an account
    public function getDetails($unset = true){
        $details = [
            'id' => $this->id,
            'access' => $this->access,
            'firstname' => $this->firstname,
            'lastname' => $this->lastname,
            'gender' => $this->gender,
            'profile_picture' => $this->profile_picture,
            'client_profile' => $this->client_profile,
            'address' => $this->address,
            'telephone_no' => $this->telephone_no,
            'cellphone_no' => $this->cellphone_no,
            'occupation' => $this->occupation,
            'position' => $this->position,
            'institution' => $this->institution,
            'email_address' => $this->email_address,
            'username' => $this->username,
            'password' => $this->password,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];

        if ($unset) {
            unset($details["password"]);
            unset($details["profile_picture"]);
        }

        return $details;
    }

    public static function getTotalUserCount(){
        $query = "SELECT COUNT(*) as total FROM `accounts`";
        $result = statement($query, [], "");
        $row = mysqli_fetch_assoc($result);
        return $row['total'];
    }

    public function initialize(){

        // Initialized all fields
        $query = "SELECT * FROM `accounts` WHERE id= ?";
        $result = statement($query, [$this->id], "s");

        while($row = mysqli_fetch_assoc($result)){
            $this->access = $row["access"];
            $this->firstname = $row["firstname"];
            $this->lastname = $row["lastname"];
            $this->gender = $row["gender"];
            $this->profile_picture = $row["profile_picture"];
            $this->client_profile = $row["client_profile"];
            $this->address = $row["address"];
            $this->telephone_no = $row["telephone_no"];
            $this->cellphone_no = $row["cellphone_no"];
            $this->occupation = $row["occupation"];
            $this->position = $row["position"];
            $this->institution = $row["institution"];
            $this->email_address = $row["email_address"];
            $this->username = $row["username"];
            $this->password = $row["password"];
            $this->created_at = $row["created_at"];
            $this->updated_at = $row["updated_at"];
        }

    }

    public function setProfilePicture($image) {
        if (!$this->id) {
            return false;
        }

        if (isset($image['tmp_name']) && is_uploaded_file($image['tmp_name'])) {
            $imageData = file_get_contents($image['tmp_name']);
            
            $query = "UPDATE accounts SET profile_picture = ? WHERE id = ?";
            $params = [$imageData, $this->id];
            $types = "bs"; // b for blob, s for string (id)
            
            $result = statement($query, $params, $types);
            
            if ($result) {
                $this->profile_picture = $imageData;
                return true;
            }
        }
        
        return false;
    }

    public function getProfile(){
        return $this->profile_picture;
    }

    // Creates a new account
    public function createAccount($params){

        $query = "INSERT INTO `accounts` (
            `firstname`, `lastname`, `gender`, 
            `client_profile`, `address`, 
            `telephone_no`, `cellphone_no`, 
            `occupation`, `position`, 
            `institution`, `email_address`, 
            `username`, `password`) 
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";
        
        $types = getTypes($params);
        
        $result = statement($query, $params, $types);

        return $result;
    }

    // Save the account to the database
    public function save(){
        $query = "UPDATE `accounts` SET 
            access = ?, firstname = ?, lastname = ?, gender = ?, client_profile = ?, address = ?, 
            telephone_no = ?, cellphone_no = ?, occupation = ?, position = ?, institution = ?, 
            email_address = ?, username = ? 
            WHERE id = ?";

        $params = [
            $this->access, $this->firstname, $this->lastname,
            $this->gender, $this->client_profile, $this->address,
            $this->telephone_no, $this->cellphone_no, $this->occupation,
            $this->position, $this->institution, $this->email_address,
            $this->username,
            $this->id
        ];

        $result = statement($query, $params, getTypes($params));

        return $result !== false;
    }

    public function __toString(){
        return "Account Owner: {$this->username}";
    }
    public static function getAllAccounts($access = null, $clientProfile = null, $order = "created_at", $search = null) {
        $query = "SELECT id, access, firstname, lastname, gender, client_profile, address, telephone_no, cellphone_no, occupation, position, institution, email_address, username, created_at, updated_at FROM `accounts` WHERE 1=1";
        $params = [];
        $types = "";

        if ($access !== null && $access !== "none") {
            $query .= " AND access = ?";
            $params[] = $access;
            $types .= "s";
        }

        if ($clientProfile !== null && $clientProfile !== "none") {
            $query .= " AND client_profile = ?";
            $params[] = $clientProfile;
            $types .= "s";
        }
        
        if ($search !== null) {
            $query .= " AND (firstname LIKE ? OR lastname LIKE ? OR email_address LIKE ? OR username LIKE ?)";
            $searchTerm = "%" . $search . "%";
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $types .= "ssss";
        }

        $allowedOrders = ['created_at', 'updated_at', 'username', 'firstname', 'lastname', 'email_address'];
        if (!in_array($order, $allowedOrders)) {
            $order = 'created_at'; // Default to created_at if invalid order is provided
        }
        $query .= " ORDER BY {$order}";

        if($order === 'created_at' || $order === 'updated_at') $query.=" DESC";

        $result = statement($query, $params, $types);
        if (!$result) {
            return ["Error"=>"Something went wrong in getAllAccounts Function in 'Account Model PHP'"];
        }
        $accounts = [];

        while ($row = mysqli_fetch_assoc($result)) {
            $accounts[] = $row;
        }

        return $accounts;
    }

     public static function searchAccount($searchTerm) {
        $query = "SELECT * FROM `accounts` WHERE firstname LIKE ? OR lastname LIKE ? OR email_address LIKE ? OR username LIKE ?";
        $searchTerm = "%" . $searchTerm . "%";
        $params = [$searchTerm, $searchTerm, $searchTerm, $searchTerm];
        $types = "ssss";

        $result = statement($query, $params, $types);
        $accounts = [];

        while ($row = mysqli_fetch_assoc($result)) {
            $accounts[] = $row;
        }

        return $accounts;
    }

   public function updateAccount(array $params) {
        $queryParts = [];
        $values = [];
        $types = "";

        foreach ($params as $key => $value) {
            // Check if the property exists and is not the id
            if (property_exists($this, $key) && $key !== 'id') {
                $queryParts[] = "`$key` = ?";
                $values[] = $value;

                // Determine type based on value
                if (is_int($value)) {
                    $types .= "i";
                } elseif (is_float($value)) {
                    $types .= "d";
                } else {
                    $types .= "s"; // Default to string for other types
                }

                $this->$key = $value; // Update the object's property
            }
        }

        //If no fields to update, return true, it avoids an unnecessary and potentially problematic query
        if (empty($queryParts)) {
            return true;
        }

        $query = "UPDATE `accounts` SET " . implode(", ", $queryParts) . " WHERE `id` = ?";
        $values[] = $this->id;
        $types .= "s"; //id is a string

        $result = statement($query, $values, $types);
        return $result;
    }

    public function setFields(array $fields){
        foreach ($fields as $key => $value) {
            if (property_exists($this, $key)) {
                $this->$key = $value;
            }
        }
    }
}
