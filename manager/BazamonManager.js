var mysql = require("mysql");

var inquirer = require("inquirer");

const cTable = require('console.table');


var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "BamazonDB"
});

connection.connect(function(err) {
  if (err) throw err;
  //console.log("connected as id " + connection.threadId);
  running();
});

function running() {
    //console.log("Selecting all products...\n");
    // connection.query("SELECT * FROM products", function(err, res) {
    //     if (err) throw err;
    //     console.table(res);
        start();
    
}

function continues(){
    console.log("start again");
    start();
    

}

function readProducts() {
    //console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
    
     
}

function lowInventory() {
    //console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products WHERE stock_quantity<6", function(err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
     
}



// function which prompts the user for select and buy some product
function start() {
    
    inquirer.prompt(
        {
        type: "list",
        name: "selectedOption",
        message: "Choice =?",
        choices: ["seeInventory", "lowInventory", "addToInventory", "addNewProduct"]
        }
    ).then(function(answers){

        // var product = answers.selectedProduct;
        // //connection.end();
        // requestQuantity(product);

        switch (answers.selectedOption){
            
            case "seeInventory":
            
            readProducts();
            break;
    
            case "lowInventory":
            lowInventory();
            break;
    
            case "addToInventory":
            start2();
            break;
    
            case "addNewProduct":
            addNewProduct();
            break;
            
        }



      });
};

function addNewProduct() {
    
    inquirer.prompt([
        {
        type: "input",
        name: "product_name",
        message: "New Product Name\n?"
        },
        {
            type: "input",
            name: "department_name",
            message: "Department of New Product\n?"
        },
        {
            type: "input",
            name: "price",
            message: "Price of New Product\n?"
        },
        {
            type: "input",
            name: "stock_quantity",
            message: "Quantity\n?"
        }
    ]).then(function(answers){

        var newProduct_Name = answers.product_name;
        var newDepartment_Name = answers.department_name;
        var newPrice = parseFloat(answers.price);
        var newStock_Input = parseInt(answers.stock_quantity);


        //connection.end();
        createProduct(newProduct_Name, newDepartment_Name, newPrice, newStock_Input);

      });
};

function createProduct(newProductName, newDepartmentName, newProductPrice, newQuantity) {
    console.log("Inserting a new product...\n");
    var query = connection.query(
      "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (newProductName, newDepartmentName, newProductPrice, newQuantity)", function (err, result){
          if (err) throw err;
          readProducts();

      }
    );
  
    // logs the actual query being run
    //console.log(query.sql);
}

// function createProduct(newProductName, newDepartmentName, newProductPrice, newQuantity) {
//     console.log("Inserting a new product...\n");
//     var query = connection.query(
//       "INSERT INTO products SET ?",
//             {
//         product_name: newProductName,
//         department_name: newDepartmentName,
//         price:newProductPrice,
//         stock_quantity: newQuantity
//       },
//       function(err, res) {
//         //console.log(res.affectedRows + " product inserted!\n");
//         // Call updateProduct AFTER the INSERT completes
//         readProducts();
//       }
//     );
  
//     // logs the actual query being run
//     //console.log(query.sql);
//   }


// function addProduct(newProductName, newDepartmentName, newProductPrice, newQuantity) {
//     console.log("Inserting a new product...\n");
//     var query = connection.query(
//       "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ?",
// [newProductName, newDepartmentName, newProductPrice, newQuantity],

//     //   {
//     //     product_name: newProductName,
//     //     department_name: newDepartmentName,
//     //     price: parseFloat(newProductPrice),
//     //     stock_quantity: parseInt(newQuantity)
//     //   },
//       function(err, res) {
//         //console.log(res.affectedRows + " product inserted!\n");
//         // Call updateProduct AFTER the INSERT completes
        
//         if (err) throw err;
//         start();
//       }
      
//     );
  
//     // logs the actual query being run
//     //console.log(query.sql);
// }

function start2(){
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.table(res);
        start1();
    });
}


function start1() {
    
    inquirer.prompt(
        {
        type: "input",
        name: "selectedProduct",
        message: "What product do you like to take add - type Item_ID\n?"
        }
    ).then(function(answers){

        var product = answers.selectedProduct;
        //connection.end();
        requestQuantity(product);

      });
};




function requestQuantity(product) {


    inquirer
      .prompt({
        name: "requestInput",
        type: "input",
        message: "How many add - type a #?"
      })
      .then(function(answers) {

        var requestedQuantity = answers.requestInput;
        connection.query("SELECT * FROM products", function(err, res) {
            if (err) throw err;

            var indice = product - 1;
            
            if (res[indice].stock_quantity >= 0){
               var updateData = parseFloat(res[indice].stock_quantity) + parseFloat(requestedQuantity);

               updateProduct(product, updateData);
               
               console.log("Succefull purchase for:" + requestedQuantity + " "+ res[indice].product_name);                
               
               readProducts();
               //console.log("product= " + res[indice].stock_quantity + " " + requestedQuantity);
               //continues(); 

               console.log("otra compra?");
               
               //start();

            
               
            }
            else{
                console.log("ingrese de nuevo");
                running();
            };
        
               
        });
        //   
    });
     

}



function updateProduct(product, requestedQuantity) {
    //console.log("Updating all Rocky Road quantities...\n");
    var query = connection.query(
      "UPDATE products SET ? WHERE ?",
      [
        {
          stock_quantity: requestedQuantity
        },
        {
          item_id: product
        }
      ],
      function(err, res) {
        console.log(res.affectedRows + " products updated!\n");
        return
        

      }
    );

    //readProducts(); 
}

