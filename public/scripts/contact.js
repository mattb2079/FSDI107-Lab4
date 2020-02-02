var serverURL = "http://localhost:8080/api";
var messagesDB;

function sendMessage(){
    console.log("message sent!");
}

function messageObject(name, message){
    console.log(name, message);
    this.name = name;
    this.message = message;
}


function saveItem(){
    // get the values

    var name = $("#nameInput").val();
    var message = $("#messageInput").val();

    // create an object
    var theMessage = new messageObject(name, message);
    console.log(theMessage);

    var jsonString = JSON.stringify(theMessage);
    console.log(jsonString);


    // send the object to the server
    $.ajax({
        url: serverURL + "/messages",
        type: "POST",
        data: jsonString,
        contentType: "application/json",
        success: function(response){
            console.log("Message sent!", response);
            clearForm();

            // show notification
            $('#alertSuccess').removeClass("hidden");

            // setTimeout(fn, milliseconds);
            setTimeout( function(){
                $("#alertSuccess").addClass("hidden");
            }, 3000);
        },
        error: function(errorDetails){
            console.log("Error: ", errorDetails);
        }
    });
}

function clearForm(){
    $("#nameInput").val("");
    $("#messageInput").val("");
}

function init(){
    console.log("contacts page!");

    //hooks
    
    $("#btnSend").click(saveItem);

}

window.onload = init;