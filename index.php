<!DOCTYPE html>
<!-- <html lang="en" ng-app="myapp"> -->
<html lang="en">

<head>
	<title>Sisters Brewing</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" href="styles/sistersbrewery.css">


</head>

<body data-spy="scroll" data-target="#navscrollspy" data-offset="200">
	<script>
		
	</script>
	<div class="maincontent" ng-controller="appController as ctrlr">
		<nav class="navbar navbar-light navbar-fixed-top bg-faded" id="navscrollspy">
			<a class="navbar-brand" href="#">The Sisters Brewery</a>
			<ul class="nav navbar-nav pull-xs-right">
				<li class="nav-item">
					<a class="nav-link" href="#About">About Us</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="#Beers">Our Beers</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="#Events">Events</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="#wheretofindus">Where To Find Our Beers</a>
				</li>
			</ul>
			<!--<form class="form-inline pull-xs-right">
    <input class="form-control" type="text" placeholder="Search">
    <button class="btn btn-success-outline" type="submit">Search</button>
  </form>-->
		</nav>
		<div class="container">
			<div class="jumbotron">
				<h1>Sisters Brewing</h1>
			</div>
			<h3 id="About">This page </h3>
			<p>Text</p>
			<br/>
			<div class="fb-like" data-href="https://www.facebook.com/thesistersbrewery" data-layout="standard" data-action="like" data-show-faces="false" data-share="false">
			</div>
			<br/>
			<br/>
			<h1 id="Beers">Our Beers</h1>
			<p>derp</p>
			<h1 id="Events">Upcoming Events</h1>
			<p>search <input type="text" placeholder="search events" ng-model="eventsearch"></p>
			<div class="row-fluid" ng-show="events">
				<div class="event col-md-4" ng-repeat="event in events | filter:eventsearch | future | reverse" >
					<h2>{{event.name}}</h2>
					<h3>{{event.start_time | date}}</h3>
					<p><a href="https://www.facebook.com/events/{{event.id}}" target="_blank">fb link</a>
						<br>
						{{event.description}}</p>
				</div>
			</div>
			<div class="clearfix"></div>
			<h1 id="wheretofindus">Where to Find us</h1>
			<!--<div class="embed-responsive">-->
			<div id="findmap">
				<iframe class="" src="https://www.google.com/maps/d/embed?mid=1I_Got5rCkjb3Eem-CYTImXIFGYc&z=12&ll=52.3665982%2C%204.8851904" width="100%" height="480"></iframe>
			</div>
			<!--</div>-->
		</div>
	</div>
	<div class="container-fluid footer">
		<div class="container">
			<div class="row">
				<div class="col-xs-6">Site by Max & Flex</div>
				<div class="col-xs-6 footer-link"><a class="" href="http://madmaxlax.com">madmaxlax.com</a></div>
			</div>
		</div>
	</div>
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
	<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular.min.js"></script>
	<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular-resource.min.js"></script>
	<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular-route.min.js">
	</script>
	<script src="./js/app.js">
	</script>
	<script src="js/bootstrap.min.js"></script>

</body>

</html>