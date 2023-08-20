const words = ["Actor", "Gold", "Painting", "Advertisement", "Grass", "Parrot", "Afternoon", "Greece", "Pencil", "Airport", "Guitar", "Piano", "Ambulance", "Hair", "Pillow", "Animal", "Hamburger", "Pizza", "Answer", "Helicopter", "Planet", "Apple", "Helmet", "Plastic", "Army", "Holiday", "Portugal", "Australia", "Honey", "Potato", "Balloon", "Horse", "Queen", "Banana", "Hospital", "Quill", "Battery", "House", "Rain", "Beach", "Hydrogen", "Rainbow", "Beard", "Ice", "Raincoat", "Bed", "Insect", "Refrigerator", "Belgium", "Insurance", "Restaurant", "Boy", "Iron", "River", "Branch", "Island", "Rocket", "Breakfast", "Jackal", "Room", "Brother", "Jelly", "Rose", "Camera", "Jewellery", "Russia", "Candle", "Jordan", "Sandwich", "Car", "Juice", "School", "Caravan", "Kangaroo", "Scooter", "Carpet", "King", "Shampoo", "Cartoon", "Kitchen", "Shoe", "China", "Kite", "Soccer", "Church", "Knife", "Spoon", "Crayon", "Lamp", "Stone", "Crowd", "Lawyer", "Sugar", "Daughter", "Leather", "Sweden", "Death", "Library", "Teacher", "Denmark", "Lighter", "Telephone", "Diamond", "Lion", "Television", "Dinner", "Lizard", "Tent", "Disease", "Lock", "Thailand", "Doctor", "London", "Tomato", "Dog", "Lunch", "Toothbrush", "Dream", "Machine", "Traffic", "Dress", "Magazine", "Train", "Easter", "Magician", "Truck", "Egg", "Manchester", "Uganda", "Eggplant", "Market", "Umbrella", "Egypt", "Match", "Van", "Elephant", "Microphone", "Vase", "Energy", "Monkey", "Vegetable", "Engine", "Morning", "Vulture", "England", "Motorcycle", "Wall", "Evening", "Nail", "Whale", "Eye", "Napkin", "Window", "Family", "Needle", "Wire", "Finland", "Nest", "Xylophone", "Fish", "Nigeria", "Yacht", "Flag", "Night", "Yak", "Flower", "Notebook", "Zebra", "Football", "Ocean", "Zoo", "Forest", "Oil", "Garden", "Fountain", "Orange", "Gas", "France", "Oxygen", "Girl", "Furniture", "Oyster", "Glass", "Garage", "Ghost"];

// model objects
var grid = [];
var player = 'yellow';

// view objects
var editable = false;

// colors
const YELLOW = "rgb(110, 103, 23)";
const RED = "rgb(167, 51, 31)";
const BLUE = "rgb(31, 31, 167)";
const BLACK = "rgb(40, 40, 40)";

const NUM_ROWS = 5;
const NUM_COLS = 5;

$(document).ready(function () {
  for (var i = 0; i < NUM_ROWS*NUM_COLS; i++) {
      const random = Math.floor(Math.random() * words.length);
      console.log(random, words[random]);
      grid.push({
        word: words[random],
        owner: 'yellow', // default to yellow
        revealed: false,
        card: null
      });
    }

  // Create grid elements
  for (var i = 0; i < NUM_ROWS*NUM_COLS; i++) {
    var $row = $("<div/>");
    var $card = $("<div/>");
    var $input = $("<input type='text' value='" + grid[i].word + "'/>");

    // default the input to uneditable
    $input.prop("readonly", true);

    // Update model when input changes
    $input.on("input", (function (i) {
      return function () {
        grid[i].word = $(this).val();
      };
    })(i));

    // change the card background when the card is clicked
    $card.on("tap", (function (i) {
      return function () {
        console.log(grid[i].owner);
        if (!editable && !grid[i].revealed) {
          // cylce through the owners and change the color
          // yelllow --> red --> blue --> black --> yellow
          if (grid[i].owner == 'yellow') {
            grid[i].owner = 'red';
            $(this).css("background-color", RED);
          } else if (grid[i].owner == 'red') {
            grid[i].owner = 'blue';
            $(this).css("background-color", BLUE);
          } else if (grid[i].owner == 'blue') {
            grid[i].owner = 'black';
            $(this).css("background-color", BLACK);
          } else if (grid[i].owner == 'black') {
            grid[i].owner = 'yellow';
            $(this).css("background-color", YELLOW);
          }
        }
      };
    })(i));

    $card.on("press", (function (i) {
      return function () {
        if (!editable && !grid[i].revealed) {
          $transparent = $("<div/>");
          $transparent.addClass("transp");
          // set the div's background color to the card's background color
          $transparent.css("background-color", grid[i].card.css("background-color"));
          // add some transparency to the div
          $transparent.css("opacity", "0.85");
          grid[i].revealed = true;
          // hide the elements on the card
          grid[i].card.append($transparent);
        } else {
          $transparent = grid[i].card.find(".transp");
          // select the div with the class transp and remove it
          grid[i].revealed = false;
          // unhide the elements on the card
          $transparent.remove();
        }
      };
    })(i));


    // make a view with the input and checkbox side by side
    $card.append($input);
    $card.addClass("card");
    $("#grid").append($card);

    // add the card to the grid
    grid[i].card = $card;
  }


  // Handle Generate Clue button
  $("#cluegen-btn-generate").on("click", function () {
    // go through the words in the grid
    // filter out the words that are not revealed and not owned by the player
    var words = grid.filter(function (word) {
      return !word.revealed && word.owner == player;
    });
    words = words.map(function (word) {
      return word.word;
    });
    // if there are no words, then return
    if (words.length == 0) {
      return;
    }

    // clear the clues div
    $("#clues").empty();

    // Convert grid to JSON
    var wordsJson = JSON.stringify(words);

    // dim the button slighlty on click and undim after AJAX request
    $(this).css("opacity", "0.5");
    // disable button until AJAX request is complete
    $(this).prop("disabled", true);
    // change cursor to indicate that button is disabled
    $("#cluegen-btn-generate").css("cursor", "not-allowed");

    // Make AJAX request
    $.ajax({
      url: "/projects/cluegen/generate",
      type: "POST",
      data: wordsJson,
      contentType: "application/json",
      success: function (data) {
        console.log("Success:", data);
        // Handle successful response
        $("#cluegen-btn-generate").css("opacity", "1");
        $("#cluegen-btn-generate").prop("disabled", false);
        $("#cluegen-btn-generate").css("cursor", "pointer");

        // for each clue/word list, create a new div and add it to the page
        // for each clue/word list, create a new div and add it to the page
        // for each clue/word list, create a new div and add it to the page
        for (var i = 0; i < data.length; i++) {
          var clue_str = data[i].clues.join(", ");
          var $clue = $("<div/>");
          var $wordList = $("<div/>");
          var $clueText = $("<div/>");
          $clue.addClass("clue-bubble");
          $wordList.addClass("word-list");
          $clueText.addClass("clue-text");
          $clueText.html(clue_str);
          $clue.append($clueText);
          for (var j = 0; j < data[i].cluster.length; j++) {
            var $word = $("<div/>");
            $word.addClass("word");
            $word.html(data[i].cluster[j]);
            $wordList.append($word);
          }

          $clue.append($wordList);
          $("#clues").append($clue);
          $clue.fadeIn("slow");
        }

      },
      error: function (jqXHR, textStatus, errorThrown) {
        // Handle error
        console.log("Error:", errorThrown);
        $("#cluegen-btn-generate").css("opacity", "1");
        $("#cluegen-btn-generate").prop("disabled", false);
        $("#cluegen-btn-generate").css("cursor", "pointer");
      }
    });
  });


  $("#cluegen-btn-player").on("click", function () {
    console.log("player button clicked");
    // toggle the owner variable
    // red --> blue --> yellow
    if (player == 'red') {
      player = 'blue';
      $("#cluegen-btn-player").css("background-color", BLUE);
    }
    else if (player == 'blue') {
      player = 'yellow';
      $("#cluegen-btn-player").css("background-color", YELLOW);
    }
    else if (player == 'yellow') {
      player = 'red';
      $("#cluegen-btn-player").css("background-color", RED);
    }
  });

  $("#cluegen-btn-edit").on("click", function () {
    // make the input editable
    if (!editable) {
      editable = true;
      $(".card input").prop("readonly", false);
      $("#cluegen-btn-edit").css("background-color", RED);
      $("#cluegen-btn-edit").html("Done");
    }
    else {
      editable = false;
      $(".card input").prop("readonly", true);
      $("#cluegen-btn-edit").css("background-color", BLUE);
      $("#cluegen-btn-edit").html("Edit Text");
    }
  });

});
