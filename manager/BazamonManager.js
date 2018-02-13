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
    });
     
}

function lowInventory() {
    //console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products WHERE stock_quantity<6", function(err, res) {
        if (err) throw err;
        console.table(res);
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

        var product = answers.selectedProduct;
        //connection.end();
        requestQuantity(product);

        switch (action){
            case "my-tweets":
            
            getTweets();
            break;
    
            case "spotify-this-song":
            getSong();
            break;
    
            case "movie-this":
            getMovie();
            break;
    
            case "do-what-it-says":
            getRandomAction();
            break;
            
        }



      });
};


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
            
            if (res[indice].stock_quantity >= requestedQuantity){
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

function delayed (){
    var myVar;
    myVar = setTimeout(start(), 1000);
}