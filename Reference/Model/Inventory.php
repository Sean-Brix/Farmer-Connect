<?php
require_once __DIR__."/../Utils/statement.php";

class Inventory {
    private $id = null;
    private $name = null;
    private $quantity = null;
    private $description = null;
    private $category = null;
    private $status = null;
    private $created_at = null;
    private $updated_at = null;

    public function __construct($inventory_id = null) {
        $this->id = $inventory_id;
        if ($inventory_id) {
            $this->initialize();
        }
    }

    public function getId() {
        return $this->id;
    }

    public function getName() {
        return $this->name;
    }

    public function setName($name) {
        $this->name = $name;
    }

    public function getQuantity() {
        return $this->quantity;
    }

    public function setQuantity($quantity) {
        $this->quantity = $quantity;
    }

    public function getDescription() {
        return $this->description;
    }

    public function setDescription($description) {
        $this->description = $description;
    }

    public function getCategory() {
        return $this->category;
    }

    public function setCategory($category) {
        $this->category = $category;
    }

    public function getStatus() {
        return $this->status;
    }

    public function setStatus($status) {
        $this->status = $status;
    }

    public function getCreatedAt() {
        return $this->created_at;
    }

    public function getUpdatedAt() {
        return $this->updated_at;
    }

    public function getDetails() {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'quantity' => $this->quantity,
            'description' => $this->description,
            'category' => $this->category,
            'status' => $this->status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }

    public function initialize() {
        $query = "SELECT * FROM `inventory` WHERE id = ?";
        $result = statement($query, [$this->id], "i");

        if ($row = mysqli_fetch_assoc($result)) {
            $this->name = $row['name'];
            $this->quantity = $row['quantity'];
            $this->description = $row['description'];
            $this->category = $row['category'];
            $this->status = $row['status'];
            $this->created_at = $row['created_at'];
            $this->updated_at = $row['updated_at'];
        }
    }

   public static function getAll() {
        $query = "SELECT * FROM `inventory`";
        $result = statement($query);

        $inventories = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $inventories[] = $row;
        }

        return $inventories;
    }

    public function create($data) {
        $this->name = $data['name'] ?? null;
        $this->quantity = $data['quantity'] ?? null;
        $this->description = $data['description'] ?? null;
        $this->category = $data['category'] ?? null;
        $this->status = $data['status'] ?? null;

        $query = "INSERT INTO `inventory` (name, quantity, description, category, status) VALUES (?, ?, ?, ?, ?)";
        $params = [$this->name, $this->quantity, $this->description, $this->category, $this->status];
        $types = getTypes($params);
        $result = statement($query, $params, $types);

        if ($result) {
            $this->id = mysqli_insert_id($GLOBALS['conn']); // Assuming $conn is your database connection
            $this->initialize();
            return $this->getDetails();
        } else {
            return false;
        }
    }

    public function update($data) {
        $this->name = $data['name'] ?? $this->name;
        $this->quantity = $data['quantity'] ?? $this->quantity;
        $this->description = $data['description'] ?? $this->description;
        $this->category = $data['category'] ?? $this->category;
        $this->status = $data['status'] ?? $this->status;
        $this->id = $data['id'] ?? $this->id;

        $query = "UPDATE `inventory` SET name = ?, quantity = ?, description = ?, category = ?, status = ? WHERE id = ?";
        $params = [$this->name, $this->quantity, $this->description, $this->category, $this->status, $this->id];
        $types = getTypes($params);
        $result = statement($query, $params, $types);

        return $result !== false;
    }

    public static function deleteItem($id) {
        $query = "DELETE FROM `inventory` WHERE id = ?";
        $result = statement($query, [$id], "i");

        return $result !== false;
    }

    public function __toString() {
        return "Inventory Item: {$this->name} (ID: {$this->id})";
    }
}