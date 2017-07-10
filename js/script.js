
var teams = [{
	"name" : "Hyderabad Tigers", 
	"upvotes" : 30,
	"downvotes" : 3,
	"photo": "images/hyd.png",
	"latitude": "17.428635",
	"longitude": "78.428322",
	"voted": "no"
},

{
	"name" : "Bangalore Foxes", 
	"upvotes" : 25,
	"downvotes" : 7,
	"photo": "images/ban.jpg",
	"latitude": "12.345267",
	"longitude": "77.723454",
	"voted": "no"
},

{
	"name" : "Delhi Falcons", 
	"upvotes" : 46,
	"downvotes" : 10,
	"photo": "images/del.jpg",
	"latitude": "28.65834",
	"longitude": "77.337756",
	"voted": "no"
},

{
	"name" : "Mumbai Coyotes", 
	"upvotes" : 15,
	"downvotes" : 5,
	"photo": "images/mum.jpg",
	"latitude": "19.34536",
	"longitude": "72.45673",
	"voted": "no"
},

{
	"name" : "Bhopal Cheetahs", 
	"upvotes" : 29,
	"downvotes" : 4,
	"photo": "images/deh.jpg",
	"latitude": "23.247935",
	"longitude": "77.403135",
	"voted": "no"
}];

function timeElapsed(previousTime) {
	var currentTime = new Date();
	var timeDiff = currentTime - previousTime;
	timeDiff /= 1000; // remove ms
	timeDiff = Math.floor(timeDiff / 60); // remove seconds
	timeDiff = Math.round(timeDiff % 60); // get minutes
	return timeDiff;
}

function init() {

	var startTime = new Date(); 
	var endTime;

	var overlayClose = document.querySelector('#overlay-close');
	overlayClose.addEventListener('click', function() {

		var teamOverlay = document.querySelector('#team-overlay');
		teamOverlay.classList.remove('open');

		var teamImage = document.querySelector('#team-overlay img');
		teamImage.classList.remove('swipe-left');
		teamImage.classList.remove('swipe-right');				
	});

	var map;
    var zoomLevel = 5;
	var bounds = new google.maps.LatLngBounds();
    bounds.extend(new google.maps.LatLng(teams[0].latitude, teams[0].longitude)); 
    var markerIcon = {
        url: 'images/camera.png',
        origin: new google.maps.Point(0, 0),
  anchor: new google.maps.Point(32,65),
  labelOrigin: new google.maps.Point(40,33)
    }	
	var mapOptions = {
		mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoom: zoomLevel
	};

    // Display a map on the page
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);  
    map.fitBounds(bounds);                   

    var marker, i;
    var timesVoted = 0;
    var votingLimit = 3;
    var votingTimeLimit = 10; // in minutes
    
    // Loop through our array of markers & place each one on the map  
    for( i = 0; i < teams.length; i++ ) {
    	var position = new google.maps.LatLng(teams[i].latitude, teams[i].longitude);    	
    	marker = new google.maps.Marker({
    		icon: markerIcon,
    		position: position,
    		map: map,
    		label: teams[i].name + ', Upvotes: ' + teams[i].upvotes + ', Downvotes: ' + teams[i].downvotes
    	});

        // Allow each marker to have an info window    
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
        	return function() {           		

        		var teamOverlay = document.querySelector('#team-overlay');
        		var teamImage = document.querySelector('#team-overlay img');
        		teamImage.src = teams[i].photo;
        		teamOverlay.classList.add('open');
        		var teamVoted = teams[i].voted;        		
        		var markerLabel = this;        		

        		var hammertime = new Hammer(teamImage);
        		hammertime.on('swipeleft', function(ev) {
        			if(teamVoted == 'yes') {
        				alert('You have already voted for ' + teams[i].name);
        			}
        			else {
        				if(timesVoted <= votingLimit && timeElapsed(startTime) < votingTimeLimit) {
        					teamImage.classList.add('swipe-left');
        					timesVoted++;
        					teams[i].downvotes = teams[i].downvotes + 1;    
        					teams[i].voted = 'yes';
        					markerLabel.setLabel(teams[i].name + ', Upvotes: ' + teams[i].upvotes + ', Downvotes: ' + teams[i].downvotes);    				
        				} 
        			}        			       			
        		});
        		hammertime.on('swiperight', function(ev) {
        			if(teamVoted == 'yes') {
        				alert('You have already voted for ' + teams[i].name);
        			}
        			else {
        				if(timesVoted <= votingLimit && timeElapsed(startTime) < votingTimeLimit) {
        					teamImage.classList.add('swipe-right');
        					timesVoted++;
        					teams[i].upvotes = teams[i].upvotes + 1;
        					teams[i].voted = 'yes';
        					markerLabel.setLabel(teams[i].name + ', Upvotes: ' + teams[i].upvotes + ', Downvotes: ' + teams[i].downvotes);   
        				} 
        			}
        		});

        		if(timesVoted > votingLimit) {
        			if(timeElapsed(startTime) >= votingTimeLimit) {
        				timesVoted = 0;
        				startTime = new Date();
        			}
        			else {        				
        				alert('Voting limit reached. Please try after ' + (votingTimeLimit - timeElapsed(startTime)) + ' minutes');
        			}        			
        		}
        	}
        })(marker, i));        
    }

    var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
    	this.setZoom(zoomLevel);
    	google.maps.event.removeListener(boundsListener);
    });
    
}

init();