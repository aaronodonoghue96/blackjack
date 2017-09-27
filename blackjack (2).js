(function() {
  var request;
  var deck = [];
  var decks = [];
  var yourhand = [];
  var yourhand2 = [];
  var yourhand3 = [];
  var yourhand4 = [];
  var dealershand = [];
  var ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  var suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
  var yourtotal;
  var yourtotal2;
  var yourtotal3;
  var yourtotal4;
  var dealerstotal = score(dealershand);
  var credits = 100;
  var bet = 5;
  var sidebet1 = 0;
  var sidebet2 = 0;
  var sidebet3 = 0; 
  var score = 0;
  var hands = [];
  var totals = [];
  var handover = true;
  var minbet = 5;
  var maxbet = credits - sidebet1 - sidebet2 - sidebet3;
  var minsidebet = 0;
  var maxsidebet1 = credits - bet - sidebet2 - sidebet3;
  var maxsidebet2 = credits - bet - sidebet1 - sidebet3;
  var maxsidebet3 = credits - bet - sidebet1 - sidebet2;
  var bust;
  var doubled;
  var splithands;
  var sevenscount;
  var interval_id;
  var payout = 0;
  var context;
  var started = false;
  
   document.addEventListener('DOMContentLoaded', init, false);
   
   function init() {
	enableDealBets();
	//var background = backgroundColour();
	//document.getElementById("canvas").style.backgroundColor = background;
	var numdecks = deckCount();
	console.log(numdecks);
	var decktype = deckType();
	 if (decks.length < 13) {
	  for(var n = 0; n < numdecks; n += 1) {
	   deck = createCards();
	   shuffle(deck);
	   decks.push(deck)
	   }
	 }
	var canvas = document.querySelector('canvas');
	//canvas.style.backgroundColor = background;
	context = canvas.getContext('2d');
	var width = canvas.width;
	var height = canvas.height;
	var hit = document.querySelector('#hit');
	var stand = document.querySelector('#stand');
	var deal = document.querySelector('#deal');
	var double = document.querySelector('#double');
	var surrender = document.querySelector('#surrender');
	var split = document.querySelector('#split');
	var quit = document.querySelector('#quit');
	var increasebet = document.querySelector('#increasebet');
	var decreasebet = document.querySelector('#decreasebet');
	var increasesidebet1 = document.querySelector('#increasesidebet1');
	var decreasesidebet1 = document.querySelector('#decreasesidebet1');
	var increasesidebet2 = document.querySelector('#increasesidebet2');
	var decreasesidebet2 = document.querySelector('#decreasesidebet2');
	var increasesidebet3 = document.querySelector('#increasesidebet3');
	var decreasesidebet3 = document.querySelector('#decreasesidebet3');
	increasebet.addEventListener('click', function() {bet += 5;});
	decreasebet.addEventListener('click', function() {bet -= 5;});
	increasesidebet1.addEventListener('click', function() {sidebet1 += 5;});
	decreasesidebet1.addEventListener('click', function() {sidebet1 -= 5;});
	increasesidebet2.addEventListener('click', function() {sidebet2 += 5;});
	decreasesidebet2.addEventListener('click', function() {sidebet2 -= 5;});
	increasesidebet3.addEventListener('click', function() {sidebet1 += 5;});
	decreasesidebet3.addEventListener('click', function() {sidebet1 -= 5;});
	deal.addEventListener('click', function() {
	disableDealBets();
	 handover = false;
	 started = true;
	 yourhand = [];
	 yourhand2 = [];
	 yourhand3 = [];
	 yourhand4 = [];
	 dealershand = [];
	 var yourtotal = 0;
	 var yourtotal2 = 0;
	 var yourtotal3 = 0;
	 var yourtotal4 = 0;
	 var dealerstotal = 0;
	 bust = [false, false, false, false];
	 doubled = [false, false, false, false];
	 splithands = [false, false, false, false];
	 sevenscount = [0, 0, 0, 0];
	 payout = 0
	 credits -= bet;
	 credits -= sidebet1;
	 credits -= sidebet2;
	 credits -= sidebet3;
	 while (yourhand.length < 2) {
	 addCard(yourhand);
	yourtotal = score(yourhand);
	 }
	 while (dealershand.length < 2) {
	 addCard(dealershand);
	yourtotal = score(dealershand);
	 }
	console.log(yourhand[0], yourhand[1], yourtotal);
	 hands.push(yourhand);
	totals.push(yourtotal);
	 yourhand = hands[0];
	 yourtotal = totals[0];
	interval_id = window.setInterval(draw, 33);
	 if (dealershand[0].rank === "A") {var amount; if (confirm("Would you like insurance?")) { amount = bet / 2; credits -= amount 
	 if (dealerstotal == 21) {credits += 3 * amount
	 //make dealershand[1] visible
	   handover = true;
	 }
	}
	}
	}, false);
	hit.addEventListener('click', function() {addCard(yourhand); console.log(yourtotal)}, false);
	stand.addEventListener('click', function() {nextHand()}, false);
	double.addEventListener('click', function() {double()}, false);
	surrender.addEventListener('click', function() {credits += bet / 2; handover = true;}, false);
	quit.addEventListener('click', function() {gameOver()}, false);
	split.addEventListener('click', function() {split(yourhand)}, false);
	if (handover === true && yourhand.length > 0) {payOut()}
	}
   
   function createCards(){
      for(var i = 0; i < suits.length; i += 1) {
	for (var j = 0; j < ranks.length; j += 1) {
	var card = {
	    rank : '',
	    suit : ''
	};
	 card.rank = ranks[j]; // gives the card a rank
	 card.suit = suits[i]; // gives the card a suit
 	 deck.push(card); // adds the card to the deck
	 
       }
     }
     return deck;
     }
     
   function shuffle(array){
    // shuffles the deck(s)
    for (var p = array.length - 1; p > 0; p -=1){
      var q = Math.floor(Math.random() * (p + 1));
      var b = array[p];
      array[p] = array[q];
      array[q] = b;
    }
    return array;
  }
  
   function score(hand){
      var total = 0;
      for (c = 0; c < hand.length; c += 1){
	if (hand[c].rank === "J" || hand[c].rank === "Q" || hand[c].rank === "K") {
	total += 10; // picture cards are worth 10
	}
	else if (hand[c].rank === "A") {
	if (total <= 10) {
	  total += 11; // aces are worth 1 or 11, depending on the total
	} else {
	  total += 1;
	}	}
	else {
	total += parseInt(hand[c].rank); // number cards are worth their face value
	} }return total;}
      
      
      console.log(yourtotal);
      console.log(dealerstotal);
	console.log(yourtotal);

    function addCard(hand){
	hand.push(deck[0]); // adds a new card to the hand
      deck.shift(); // removes the card from the deck
      
      if (dealerstotal == 21) {
	// dealer blackjack
	if (yourtotal == 21) {
	  // push
	    payout += bet;
	    score += 1;
	    console.log("Push");
	    handover = true;
	    enableDealBets();
	}
	else {
	   console.log("You lose");
	   handover = true;
	    enableDealBets();
	}
	}
	else if (yourtotal > 21) {
	// bust
	console.log("Bust");
	bust[handnum] = true;
	if (yourhand === yourhand4 || nexthand.length === 0) {
	handover = true;
	    enableDealBets();
	}
	else {nextHand()}
	}
	else if (yourtotal == 21) {
	if ("A" in yourhand && "K" in yourhand || "Q" in yourhand || "J" in yourhand || "10" in yourhand) {
	  // blackjack
	  payout += 3 * bet; // blackjack pays 3 to 2
	  score += 10;
	  console.log("Blackjack!");
	  if (yourhand === yourhand4  || nexthand.length === 0) {
	handover = true;
	    enableDealBets();
	}
	else { {nextHand()}
	}
	}
	else if (yourhand.length == 5) {
	  // 5 card trick
	  payout += 2 * bet;
	  score += 5;
	  console.log("Five card trick!");
	  if (yourhand === yourhand4  || nexthand.length === 0) {
	handover = true;
	    enableDealBets();
	}
	else {nextHand()}
	}
	else {
	  // regular 21
	  if (doubled[handnum]) {payout += 4 * bet;}
	  else {payout += 2 * bet;}
	  score += 3;
	  console.log("You win!");
	  if (yourhand === yourhand4  || nexthand.length === 0) {
	    handover = true;
	    enableDealBets();
	  }
	  else {{nextHand()}
	  }
	}
	}
	console.log(credits, score);
  }
  
  function nextHand() {

    if (yourhand === yourhand && yourhand2 !== []) {
	yourhand = yourhand2
	nexthand = yourhand3}
    else if (yourhand === yourhand2 && yourhand3 !== []) {
	yourhand = yourhand3
	nexthand = yourhand4}
    else if (yourhand === yourhand3 && yourhand4 !== []) {
	yourhand = yourhand4}
    else {
	dealersHand();
    while (yourhand.length < 2) {
	addCard(yourhand)
    }
    }
  }
  
  function dealersHand() {
    while (dealerstotal < 17) {
      addCard(dealershand);
      console.log(dealerstotal)
    }
    if (dealerstotal > 21) {
      // win
      if (doubled[handnum]) {payout += 4 * bet;}
      else {payout += 2 * bet;}
      score += 2;
      console.log("You win!");
      handover = true;
	enableDealBets();
    }
    else if (yourtotal > dealerstotal) {
      // win
      if (doubled[handnum]) {payout += 4 * bet;}
      else {payout += 2 * bet;}
      score += 2;
      console.log("You win!");
      handover = true;
	enableDealBets();
    }
    else if (yourtotal == dealerstotal) {
      // push
      if (doubled[handnum]) {payout += 2 * bet;}
      else {payout += bet;}
      score += 1;
      console.log("Push");
      handover = true;
	enableDealBets();
    }
    else {
      console.log("You lose")
      handover = true;
	enableDealBets();
    }
  }
  
  function double() {
	doubled[handnum] = true;
	credits -= bet;
	addCard(yourhand);
	if (yourtotal < 21) {
	nextHand();}
	else if (nexthand !== [] && nexthand !== dealershand) {
	nextHand();}
  }

  function split(hand) {
	split[handnum] = true;
	if (nexthand === [] && handnum < 3) {
	nexthand.push(yourhand[1]);
	split[handnum + 1] = true;
	}
	else if (hands[handnum + 2] === [] && handnum < 2) {
	hands[handnum + 2].push(yourhand[1]);
	split[handnum + 2] = true;
	}
	else if (hands[handnum + 3] === [] && handnum < 1) {
	hands[handnum + 3].push(yourhand[1]);
	split[handnum + 3] = true;
	}
	credits -= bet
	credits -= sidebet1
	credits -= sidebet2
	credits -= sidebet3
	yourhand.pop();
	addCard(yourhand);
  }

   function draw(){
     for (var h = 0; h < hands.length; h += 1) { // for each hand
       var ycoord = 0;
       if (h === 0 || h === 1) { // yourhand or yourhand2
	ycoord = 300;
       }
       else if (h === 2 || h === 3) { //yourhand3 or yourhand4
	ycoord = 450;
       }
       else { //dealershand
	ycoord = 50;
       }
      for (var x = 0; x < hands[h].length; x += 1) { // for each card in the hand
       // creates images of the cards
	var xcoord = 50 + (x * 100);
	if (h === 1 || h === 3) {
	 xcoord += 600;
	}
	if (h === 4 && x === 1 && yourhand !== dealershand && dealerstotal !== 21) {
	   //display back
	}
	 
       else if (hands[h][x].rank == "A") {
	console.log("a");
	if (hands[h][x].suit == "Hearts") {
	context.fillStyle = "#FF0000";
	context.fillRect(xcoord, ycoord, 100, 100);
	}
	else if (hands[h][x].suit == "Spades") {
	context.fillStyle = "#00FF00";
	context.fillRect(xcoord, ycoord, 100, 100);
	}
	else if (hands[h][x].suit == "Diamonds") {
	context.fillStyle = "#0000FF";
	context.fillRect(xcoord, ycoord, 100, 100);
	}
	else if (hands[h][x].suit == "Clubs") {
	context.fillStyle = "#000000";
	context.fillRect(xcoord, ycoord, 100, 100);
	}
       }
       else if (hands[h][x].rank == "2") {
	if (hands[h][x].suit == "Hearts") {
	}
	else if (hands[h][x].suit == "Spades") {
	}
	else if (hands[h][x].suit == "Diamonds") {
	}
	else if (hands[h][x].suit == "Clubs") {
	}
       }
       else if (hands[h][x].rank == "3") {
	if (hands[h][x].suit == "Hearts") {
	}
	else if (hands[h][x].suit == "Spades") {
	}
	else if (hands[h][x].suit == "Diamonds") {
	}
	else if (hands[h][x].suit == "Clubs") {
	}
       }
       else if (hands[h][x].rank == "4") {
	if (hands[h][x].suit == "Hearts") {
	}
	else if (hands[h][x].suit == "Spades") {
	}
	else if (hands[h][x].suit == "Diamonds") {
	}
	else if (hands[h][x].suit == "Clubs") {
	}
       }
       else if (hands[h][x].rank == "5") {
	if (hands[h][x].suit == "Hearts") {
	}
	else if (hands[h][x].suit == "Spades") {
	}
	else if (hands[h][x].suit == "Diamonds") {
	}
	else if (hands[h][x].suit == "Clubs") {
	}
       }
       else if (hands[h][x].rank == "6") {
	if (hands[h][x].suit == "Hearts") {
	}
	else if (hands[h][x].suit == "Spades") {
	}
	else if (hands[h][x].suit == "Diamonds") {
	}
	else if (hands[h][x].suit == "Clubs") {
	}
       }
       else if (hands[h][x].rank == "7") {
	if (hands[h][x].suit == "Hearts") {
	}
	else if (hands[h][x].suit == "Spades") {
	}
	else if (hands[h][x].suit == "Diamonds") {
	}
	else if (hands[h][x].suit == "Clubs") {
	}
       }
       else if (hands[h][x].rank == "8") {
	if (hands[h][x].suit == "Hearts") {
	}
	else if (hands[h][x].suit == "Spades") {
	}
	else if (hands[h][x].suit == "Diamonds") {
	}
	else if (hands[h][x].suit == "Clubs") {
	}
       }
       else if (hands[h][x].rank == "9") {
	if (hands[h][x].suit == "Hearts") {
	}
	else if (hands[h][x].suit == "Spades") {
	}
	else if (hands[h][x].suit == "Diamonds") {
	}
	else if (hands[h][x].suit == "Clubs") {
	}
       }
       else if (hands[h][x].rank == "10") {
	if (hands[h][x].suit == "Hearts") {
	}
	else if (hands[h][x].suit == "Spades") {
	}
	else if (hands[h][x].suit == "Diamonds") {
	}
	else if (hands[h][x].suit == "Clubs") {
	}
       }
       else if (hands[h][x].rank == "J") {
	if (hands[h][x].suit == "Hearts") {
	}
	else if (hands[h][x].suit == "Spades") {
	}
	else if (hands[h][x].suit == "Diamonds") {
	}
	else if (hands[h][x].suit == "Clubs") {
	}
       }
       else if (hands[h][x].rank == "Q") {
	if (hands[h][x].suit == "Hearts") {
	}
	else if (hands[h][x].suit == "Spades") {
	}
	else if (hands[h][x].suit == "Diamonds") {
	}
	else if (hands[h][x].suit == "Clubs") {
	}
       }
       else if (hands[h][x].rank == "K") {
	if (hands[h][x].suit == "Hearts") {
	}
	else if (hands[h][x].suit == "Spades") {
	}
	else if (hands[h][x].suit == "Diamonds") {
	}
	else if (hands[h][x].suit == "Clubs") {
	}
       }
       }
     }
}
	function disableDealBets() {
	 document.getElementById("deal").disabled = true;
	 document.getElementById("increasebet").disabled = true;
	 document.getElementById("decreasebet").disabled = true;
	 document.getElementById("increasesidebet1").disabled = true;
	 document.getElementById("decreasesidebet1").disabled = true;
	 document.getElementById("increasesidebet2").disabled = true;
	 document.getElementById("decreasesidebet2").disabled = true;
	 document.getElementById("increasesidebet3").disabled = true;
	 document.getElementById("decreasesidebet3").disabled = true;
	}
	function enableDealBets() {
	 document.getElementById("deal").disabled = false;
	 document.getElementById("increasebet").disabled = false;
	 document.getElementById("decreasebet").disabled = false;
	 document.getElementById("increasesidebet1").disabled = false;
	 document.getElementById("decreasesidebet1").disabled = false;
	 document.getElementById("increasesidebet2").disabled = false;
	 document.getElementById("decreasesidebet2").disabled = false;
	 document.getElementById("increasesidebet3").disabled = false;
	 document.getElementById("decreasesidebet3").disabled = false;
	}
	if (yourhand !== dealershand && yourhand !== [] && handover === false) {
	 document.getElementById("hit").disabled = false;
	 document.getElementById("stand").disabled = false;
	}
	else {
	 document.getElementById("hit").disabled = true;
	 document.getElementById("stand").disabled = true;
	}
	
	if (yourhand.length === 2 && yourhand[0].rank === yourhand[1].rank && yourhand4 === [] && handover === false) {
	 document.getElementById("split").disabled = false;
	}
	else {
	 document.getElementById("split").disabled = true;
	}
	if (yourhand.length === 2 && handover === false) {
	 document.getElementById("double").disabled = false;
	}
	else {
	 document.getElementById("double").disabled = true;
	}
	if (yourhand.length === 2 && yourhand2.length === 0 && handover === false) {
	 document.getElementById("surrender").disabled = false;
	}
	else {
	 document.getElementById("surrender").disabled = true;
	}
	 
	if (credits === 0 && handover === true) {
	gameOver()
	}
	
  //function backgroundColour()
{
     var background = document.querySelectorAll("background");
	 for (var bg = 0; bg < background.length; bg++) {
	console.log(background[bg], background[bg].checked);
	     if (background[bg].checked == true) {
	background = background[bg].value;
	return background;
	 }
	}
	return "blue";
  }

  function deckCount() {
      var deckcount = document.querySelectorAll("number");
	for (var dc = 0; dc < deckcount.length; dc++) {
	  console.log(deckcount[dc].value, deckcount[dc].checked);
	   if (deckcount[dc].checked == true) {
	numdecks = deckcount[dc].value;
	return numdecks;
	}
	}
	numdecks = 4;
	return numdecks;
  }
  function deckType() {
      var decktype = document.querySelectorAll("decktype");
	for (var dt = 0; dt < decktype.length; dt++) {
	   if (decktype[dt].checked === true) {
	decktype = decktype[dt].value;
	return decktype;
	}
	}
  }
  
  function payOut() {
    for (var r = 0; r < hands.length - 1; r += 1) {
      if (dealershand.length === 3) {
	payout += sidebet3 * 10}
      if (hands[r].length === 2 && totals[r] === 21) {payout += 21 * sidebet1;}
      if (sevenscount[r] > 0) {
      payout += sidebet2 * 7 * (10 * (sevenscount[r] - 1))
      }
      credits += payout;
  }
  }
  
  function gameOver() {
  clearInterval(interval_id);
  window.removeEventListener('hit');
  window.removeEventListener('quit');
  window.removeEventListener('split');
  window.removeEventListener('stand');
  window.removeEventListener('double');
  window.removeEventListener('surrender');
  window.removeEventListener('increasebet');
  window.removeEventListener('decreasebet');
  window.removeEventListener('deal');
  window.removeEventListener('increasesidebet1');
  window.removeEventListener('decreasesidebet1');
  window.removeEventListener('increasesidebet2');
  window.removeEventListener('decreasesidebet2');
  window.removeEventListener('increasesidebet3');
  window.removeEventListener('decreasesidebet3');
  var url = 'new_highscore.py?score=' + score;
  request.addEventListener('readystatechange', update, false);
  request.open('GET', url, true);
  request.send(null);
  }
  
  function update() {
	if (request.readyState === 4) {
	 if (request.status === 200) {
	   if (request.responseText.trim() === 'success') {
	} else {}
	   }
	 }
	}
  }
());