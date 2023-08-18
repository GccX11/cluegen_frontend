const words = ["Actor", "Gold", "Painting", "Advertisement", "Grass", "Parrot", "Afternoon", "Greece", "Pencil", "Airport", "Guitar", "Piano", "Ambulance", "Hair", "Pillow", "Animal", "Hamburger", "Pizza", "Answer", "Helicopter", "Planet", "Apple", "Helmet", "Plastic", "Army", "Holiday", "Portugal", "Australia", "Honey", "Potato", "Balloon", "Horse", "Queen", "Banana", "Hospital", "Quill", "Battery", "House", "Rain", "Beach", "Hydrogen", "Rainbow", "Beard", "Ice", "Raincoat", "Bed", "Insect", "Refrigerator", "Belgium", "Insurance", "Restaurant", "Boy", "Iron", "River", "Branch", "Island", "Rocket", "Breakfast", "Jackal", "Room", "Brother", "Jelly", "Rose", "Camera", "Jewellery", "Russia", "Candle", "Jordan", "Sandwich", "Car", "Juice", "School", "Caravan", "Kangaroo", "Scooter", "Carpet", "King", "Shampoo", "Cartoon", "Kitchen", "Shoe", "China", "Kite", "Soccer", "Church", "Knife", "Spoon", "Crayon", "Lamp", "Stone", "Crowd", "Lawyer", "Sugar", "Daughter", "Leather", "Sweden", "Death", "Library", "Teacher", "Denmark", "Lighter", "Telephone", "Diamond", "Lion", "Television", "Dinner", "Lizard", "Tent", "Disease", "Lock", "Thailand", "Doctor", "London", "Tomato", "Dog", "Lunch", "Toothbrush", "Dream", "Machine", "Traffic", "Dress", "Magazine", "Train", "Easter", "Magician", "Truck", "Egg", "Manchester", "Uganda", "Eggplant", "Market", "Umbrella", "Egypt", "Match", "Van", "Elephant", "Microphone", "Vase", "Energy", "Monkey", "Vegetable", "Engine", "Morning", "Vulture", "England", "Motorcycle", "Wall", "Evening", "Nail", "Whale", "Eye", "Napkin", "Window", "Family", "Needle", "Wire", "Finland", "Nest", "Xylophone", "Fish", "Nigeria", "Yacht", "Flag", "Night", "Yak", "Flower", "Notebook", "Zebra", "Football", "Ocean", "Zoo", "Forest", "Oil", "Garden", "Fountain", "Orange", "Gas", "France", "Oxygen", "Girl", "Furniture", "Oyster", "Glass", "Garage", "Ghost"];

// Initialize grid
var grid = [];

$( document ).ready(function() {
  for (var i = 0; i < 5; i++) {
    var row = [];
    for (var j = 0; j < 5; j++) {
      const random = Math.floor(Math.random() * words.length);
      console.log(random, words[random]);
      row.push({ word: words[random], revealed: false });
    }
    grid.push(row);
  }
  
  // Create grid elements
  var flipped_texts = [];
  for (var i = 0; i < 5; i++) {
    var $row = $("<div/>");
    var flipped_texts_row = [];
    for (var j = 0; j < 5; j++) {
      var $card = $("<div/>");
      var $flipped_text = $("<span/>");
      var $input = $("<input type='text' value='"+grid[i][j].word+"'/>");
      var $checkbox = $("<input type='checkbox'/>");
      flipped_texts_row.push($flipped_text);
  
      // Update model when input changes
      $input.on("input", (function(i, j) {
        return function() {
          grid[i][j].word = $(this).val();
          flipped_texts[i][j].text(grid[i][j].word);
          console.log(grid[i][j].word);
        };
      })(i, j));
  
      // Update model when checkbox changes
      $checkbox.on("change", (function(i, j) {
        return function() {
          grid[i][j].revealed = $(this).prop("checked");
        };
      })(i, j));
  
      // make a view with the input and checkbox side by side
      $card_top = $("<div/>");
      $card_top.append($flipped_text);
      $card_top.append($checkbox);
      $card_top.addClass("card-top");
      $card.append($card_top, $input);
      $card.addClass("card");
      $flipped_text.text(grid[i][j].word);
      $flipped_text.addClass("flipped-text");
      $row.append($card);
    }
    $("#grid").append($row);
    flipped_texts.push(flipped_texts_row);
  }

  // Handle Generate Clue button
  $("#generateClue").on("click", function() {
    // Convert grid to JSON
    var gridJson = JSON.stringify(grid);

    // dim the button slighlty on click and undim after AJAX request
    $(this).css("opacity", "0.5");
    // disable button until AJAX request is complete
    $(this).prop("disabled", true);
    // change cursor to indicate that button is disabled
    $("#generateClue").css("cursor", "not-allowed");
  
    // Make AJAX request
    $.ajax({
      url: "/projects/cluegen/generate",
      type: "POST",
      data: gridJson,
      contentType: "application/json",
      success: function(data) {
        // Handle successful response
        console.log("Response:", data);
        $("#generateClue").css("opacity", "1");
        $("#generateClue").prop("disabled", false);
        $("#generateClue").css("cursor", "pointer");
      },
      error: function(jqXHR, textStatus, errorThrown) {
        // Handle error
        console.log("Error:", errorThrown);
        $("#generateClue").css("opacity", "1");
        $("#generateClue").prop("disabled", false);
        $("#generateClue").css("cursor", "pointer");
      }
    });
  });
  
});

