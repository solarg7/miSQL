var mysql = require("mysql");

var inquirer = require("inquirer");

const cTable = require('console.table');

var myVar;


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
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
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

        console.log("start again!");
               
        start();

    });
     
}


// function which prompts the user for select and buy some product
function start() {
    
    inquirer.prompt(
        {
        type: "input",
        name: "selectedProduct",
        message: "What product do you like to buy - type Item_ID\n?"
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
        message: "How many of them do you like to buy - type a #?"
      })
      .then(function(answers) {

        var requestedQuantity = answers.requestInput;
        connection.query("SELECT * FROM products", function(err, res) {
            if (err) throw err;

            var indice = product - 1;
            
            if (res[indice].stock_quantity >= requestedQuantity){
               var updateData = res[indice].stock_quantity - requestedQuantity;

               updateProduct(product, updateData);

               var sumaTotal = res[indice].price * requestedQuantity;
               
               console.log("Succefull purchase for:" + requestedQuantity + " "+ res[indice].product_name);                
               
               console.log("Your Purchase Total Cost: $" + sumaTotal.toFixed(2));
               //readProducts();
               //console.log("product= " + res[indice].stock_quantity + " " + requestedQuantity);
               //continues(); 

            //    console.log("otra compra?");
               
            //    delayed();

            
               
            }
            else{
                console.log("Insufficient quantity! Try Again");
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
        readProducts();
        return


        
      
      }
      
    );

    //readProducts(); 
}

function delayed (){
    
    myVar = setTimeout(start(), 5000);
    
}