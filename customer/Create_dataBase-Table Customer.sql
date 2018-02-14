DROP DATABASE IF EXISTS BamazonDB;
CREATE DATABASE BamazonDB;
USE BamazonDB;
CREATE TABLE Products (
  item_id INT NOT NULL,
  product_name varchar(100) NULL,
  department_name varchar(100) NULL,
  price DECIMAL(10,4) NULL,
  stock_quantity DECIMAL(10,4) NULL,
  PRIMARY KEY(item_id)
  );
  
  
  