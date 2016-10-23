var beerApp = {};

beerApp.preferredStyle = "";

beerApp.storeResults = "";

beerApp.inventoryResults = "";

//APIs

beerApp.getBeerPage1 = function() {
  return $.ajax({
    url: "https://lcboapi.com/products",
    method: "GET",
    dataType: "json",
    data: {
      per_page: 100,
      page: 1,
      format: "json",
        //remove if is_dead is equal to true
      where_not: "is_dead",
      access_key: "MDo4YjJkYmUwZS05NGQ1LTExZTYtOGExZC05N2M4MDNmYjMxYWQ6UzRKak1GUk1YZzBOZkpuV3RhOGVUTUU4ZU84ZXE4VzRidm5J"
    }
  });
};


beerApp.getBeerPage2 = function() {
  return $.ajax({
    url: "https://lcboapi.com/products",
    method: "GET",
    dataType: "json",
    data: {
      per_page: 100,
      page: 2,
      format: "json",
        //remove if is_dead is equal to true
      where_not: "is_dead",
      access_key: "MDo4YjJkYmUwZS05NGQ1LTExZTYtOGExZC05N2M4MDNmYjMxYWQ6UzRKak1GUk1YZzBOZkpuV3RhOGVUTUU4ZU84ZXE4VzRidm5J"
    }
  });   
};


beerApp.getBeerPage3 = function() {
  return $.ajax({
    url: "https://lcboapi.com/products",
    method: "GET",
    dataType: "json",
    data: {
      per_page: 100,
      page: 3,
      format: "json",
        //remove if is_dead is equal to true
      where_not: "is_dead",
      access_key: "MDo4YjJkYmUwZS05NGQ1LTExZTYtOGExZC05N2M4MDNmYjMxYWQ6UzRKak1GUk1YZzBOZkpuV3RhOGVUTUU4ZU84ZXE4VzRidm5J"
    }
  });   
};

beerApp.getInventory = function(beer_id) {
  $.ajax({
    url: "https://lcboapi.com/inventories",
    method: "GET",
    dataType: "json",
    data: {
      per_page: 100,
      format: "json",
      product_id: beer_id,
      access_key: "MDo4YjJkYmUwZS05NGQ1LTExZTYtOGExZC05N2M4MDNmYjMxYWQ6UzRKak1GUk1YZzBOZkpuV3RhOGVUTUU4ZU84ZXE4VzRidm5J"
    }
  }).then(function(allInventoryResults) {
    beerApp.inventoryResults = allInventoryResults.result;
    beerApp.findingStores(beerApp.inventoryResults);
  });

};

beerApp.getStores = function(postal) {
  $.ajax({
    url: "https://lcboapi.com/stores",
    method: "GET",
    dataType: "json",
    data: {
      per_page: 100,
      format: "json",
      geo: postal,
      access_key: "MDo4YjJkYmUwZS05NGQ1LTExZTYtOGExZC05N2M4MDNmYjMxYWQ6UzRKak1GUk1YZzBOZkpuV3RhOGVUTUU4ZU84ZXE4VzRidm5J"
    }
  }).then(function(allStoreResults) {
    beerApp.storeResults = allStoreResults.result;
    beerApp.storesAndInventories(beerApp.storeResults);
  });
};

// beerApp.googeMap = function(lat,lng){
//   $.ajax({
//     url: "https://maps.googleapis.com/maps/api/js",
//     method: "GET",
//     dataType: "jsonp",
//     data: {
//       key: "AIzaSyDIg8C5JxykmCE9DEYezBs7CH-XTxJIqvA", 
//       lat: lat,
//       lng: lng
//     }
//   }).then(function(googlemap) {
//     googlemapFindings = googlemap;
//     console.log(googlemap);
//   });
// }

//end of APIs

beerApp.theResults = function(LCBOResults) {

  //show only results that are beer
  LCBOResults = LCBOResults.filter(function(eachResult) {
    return eachResult.primary_category === "Beer";
  });

  //show only results that are cans
  LCBOResults = LCBOResults.filter(function(beerCans){
    return beerCans.package_unit_type === "can"
  });

  //remove results that have a style of null
  LCBOResults = LCBOResults.filter(function(beerStyles) {
    return beerStyles.style !== null;
  });

  beerApp.chocolatestyle(LCBOResults);

}; // beerApp.theResults


//user selects what chocolate type they will have and it filter through the preferred style type 

beerApp.chocolatestyle = function(beerCans) {
  
  beerCans = beerCans.filter(function(beerResults){
    //search if style contains a word from the value of the radio button selected in chocolate type

    //break the style object into three objects in an array
    var brokenStyle = beerResults.style.split(" ");

    //compare the value picked in the test to the 1st and 3rd objects in the array and show that result

    for (var i = 0; i < beerApp.preferredStyle.length; i = i + 1){
      if (beerApp.preferredStyle[i] === brokenStyle[2] ||
          beerApp.preferredStyle[i] === brokenStyle[0]){
        return beerResults;
      }
    }

  });

  beerApp.displayBeer(beerCans);

}; // beerApp.chocolatestyle

beerApp.displayBeer = function(beer) {
  $("#results").empty(); 

  beer = beer.filter(function(imagesOfBeer) {
    return imagesOfBeer.image_thumb_url !== null;
  });

  //this limits the list to only show the first 20
  var limitedBeerList = beer.slice(0, 20);

  limitedBeerList.forEach(function(finalBeers) {
    //display matching beers with image, name, package, and price (in object as cents covert to dollars)
    var $beerArticle = $("<article>");
    var $beerBrandName = $("<h3>").text(finalBeers.name);

    //Change the price from cents to dollars, need to have remainders and decimals  
    var beerInCents = (finalBeers.price_in_cents/100).toFixed(2);
    var $beerPrice = $("<p>").html("<strong>Price:</strong> $" + beerInCents);

    var $beerContainerType = $("<p>").html("<strong>For:</strong> " + finalBeers.package);
    
    var type = finalBeers.varietal ? finalBeers.varietal : '~mystery beer~';

    var $beerStyleType = $("<p>").html("<strong>Type:</strong> " + type);
    var $beerImage = $("<img>").attr("src", finalBeers.image_thumb_url);

    var $imageDiv = $("<div>").addClass("imageDiv");
    var $textDiv = $("<div>").addClass("textDiv");

    //Create a find in store button and store the beer id in the value //for no real reason because I don't need to grab it or I can't figure out
    var $storeSearchButton = $("<a>").text("Find in store").addClass("storeSearch").attr({
      value: finalBeers.id, href: "#postalSearch" });

     //stick them all together
    $textDiv.append($beerBrandName, $beerPrice, $beerContainerType, $beerStyleType);
    $imageDiv.append($beerImage);

    $beerArticle.append($textDiv, $imageDiv, $storeSearchButton);
    //give the objects something to hang out in
    $("#results").append($beerArticle);

    //this loops over the beer ids
    var loopedBeerIds = $(finalBeers.id).map(function() {
      return this
    }).get().join(", ");

    //and this takes the id and put it in the inventory search
    beerApp.getInventory(loopedBeerIds);
  
  });

  beerApp.findingStores(beer);

}; // beerApp.displayBeer


beerApp.findingStores = function(beerInStores) {
  //user to pick a beer 

  $("body").on("click", ".storeSearch", function() {
    
    // var pickedBeer = $(".storeSearch").val();
    // console.log(pickedBeer)
    
    $(".findingStores").show();
    $("#storeResults").empty();

    $("form").on(".findstore submit", function(e) {
      e.preventDefault;


      //when user submits postal code - stick that in geo field (postal) // not sure this is doing anything
      var userPostalCode = $("input[type=search]").val();
      beerApp.getStores(userPostalCode);

    }); // postcode click
    
  $(".overlay").show();
  $(".overlay").on("click", function() {
    $(".overlay").hide();
    $(".findingStores").hide();
  });

 }); //body on click

}; //beerApp.findingStores

beerApp.storesAndInventories = function(storesandinv) {
  //take the returned store id number and compare it to the id number in the list returned from the postal code search

  storesandinv = storesandinv.filter(function(beerInStores) {
    if (beerApp.inventoryResults.store_id === beerApp.storeResults.id) {
      return beerInStores
    }
    
  });

  beerApp.displayStores(storesandinv)
}

beerApp.displayStores = function(beerInStores) {

$("#storeResults").empty();

console.log(beerInStores)

//this limits the list to only show the first 12
var limitedBeerinStores = beerInStores.slice(0, 12);

limitedBeerinStores.forEach(function(finalStores) {
  var $storeArticle = $("<article>");
  var $storeName = $("<h3>").text(finalStores.name);
  var $storeAddress = $("<p>").text(finalStores.address_line_1);
  var $storeCity = $("<p>").text(finalStores.city + ", " + finalStores.postal_code);
  var $storeTelephone = $("<p>").text(finalStores.telephone);

  $storeArticle.append($storeName, $storeAddress, $storeCity, $storeTelephone)

  $("#storeResults").append($storeArticle)

  //beerApp.googeMap(limitedBeerinStores.latitude, limitedBeerinStores.longitude);

});


}


beerApp.beerSearching = function() {
  $("form").on(".findbeers submit", function(e) {
    e.preventDefault();

    //maybe some values? 

    if ($("input[name=style]:checked").val() === "one"){
      beerApp.preferredStyle = ["Fruity","Floral"]
    } else if ($("input[name=style]:checked").val() === "two") {
      beerApp.preferredStyle = ["Hoppy","Spicy"]
    } else if ($("input[name=style]:checked").val() === "three") {
      beerApp.preferredStyle = ["Light"]
    } else if ($("input[name=style]:checked").val() === "four") {
      beerApp.preferredStyle = ["Medium"]
    } else {
      beerApp.preferredStyle = ["Full","Dark","Roasted"]
    }

    $.when(beerApp.getBeerPage1(), beerApp.getBeerPage2(), beerApp.getBeerPage3())
    .then(function(LCBOdata1,LCBOdata2,LCBOdata3) {
        //Combine threes arrays into one array
      var LCBOResults = LCBOdata1[0].result.concat(LCBOdata2[0].result).concat(LCBOdata3[0].result);
      
      beerApp.theResults(LCBOResults);

    });
  });
}; // beerApp.beerSearching

//calling my final functions to work
beerApp.init = function() {
  $(".findingStores").hide();

  beerApp.beerSearching();

  beerApp.getInventory();

  beerApp.getStores();

  //beerApp.findingStores();

  //beerApp.displayStores();

};


// When the page loads start the app
$(function(){
  beerApp.init();
});

