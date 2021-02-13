<!DOCTYPE html>
<!-- <html lang="en" ng-app="myapp"> -->
<html lang="en">

<head>
	<title>The Sisters Brewery</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0">
	<link rel="shortcut icon" href="favicon.ico">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css">
	<link rel="stylesheet" href="styles/sistersbrewery.css">


</head>

<body data-spy="scroll" data-target="#navscrollspy" data-offset="200">
	<script>
	</script>
	<div class="maincontent" ng-controller="appController as ctrlr">
		<nav class="navbar navbar-light navbar-fixed-top bg-faded" id="navscrollspy">
			<a class="navbar-brand" href="#">The Sisters Brewery</a>
			<button class="navbar-toggler hidden-sm-up pull-xs-right" type="button" data-toggle="collapse" data-target="#exCollapsingNavbar2">
    		&#9776;
			</button>
			<div class="collapse navbar-toggleable-xs" id="exCollapsingNavbar2">
				<ul class="nav navbar-nav hidden-sm-down" ng-if="eventresults.length > 0 ">
					<li class="nav-item">
						<a class="nav-link" href="https://www.facebook.com/events/{{eventresults[0].id}}">Next Event: <strong>{{eventresults[0].name}}</strong> ({{eventresults[0].start_time | date: 'EEE MMM d'}})</a>
					</li>
				</ul>
				<ul class="nav navbar-nav pull-xs-right">
					<li class="nav-item">
						<a class="nav-link" href="#About">About Us</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="#Beers">Our Beers</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="#News">News</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="#Events">Events</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="#wheretofindus">Where To Find Our Beers</a>
					</li>
				</ul>
			</div>
			<!--<form class="form-inline pull-xs-right">
    <input class="form-control" type="text" placeholder="Search">
    <button class="btn btn-success-outline" type="submit">Search</button>
  </form>-->
		</nav>
		<div class="container content-body">
			<div class="jumbotron hidden-sm-down">
				<h1>Sisters Brewing</h1>
			</div>
			<h3 id="About">About Us</h3>
			<p>Beijeman. Which means bee keeper. Beads? <a href="https://www.youtube.com/watch?v=5J2kc4oZTVU" target="_blank">BEES! <i class="fa fa-youtube"></i></a></p>
			<p>We're super social
				<i class="fa fa-facebook-official"></i> 
				<i class="fa fa-beer"></i> untappd?
				<i class="fa fa-spotify"></i>
			</p>
			<br/>
			<div class="fb-like" data-href="https://www.facebook.com/thesistersbrewery" data-layout="standard" data-action="like" data-show-faces="false" data-share="false">
			</div>
			<br/>
			<br/>
			<h1 id="Beers">Our Beers</h1>
			<p><strong>{{brewery.beer_count}}</strong> Beers. Total Check-ins on <a href="https://untappd.com/TheSistersBrewery" target="_blank">Untapped</a>: {{brewery.stats.total_count}}</p>
			<p>search <input type="text" placeholder="search beers" ng-model="beersearch"></p>
			<div class="alert alert-info" ng-if="brewery === false">Loading Beers ... </div>
			<div class="row-fluid" ng-show="posts">
				<div class="post col-md-4" ng-repeat="beer in brewery.beer_list.items | filter:beersearch as beerresults ">
					<h1> {{beer.beer.beer_name}}</h1>
					<strong><a href="https://untappd.com/b/{{beer.beer.beer_slug}}/{{beer.beer.bid}}" target="_blank"> Rating: {{beer.beer.rating_score}}<i class="fa fa-star"></i>, Total check-ins: {{beer.beer.rating_count}} <i class="fa fa-beer"></i></a></strong>
					<p>
						<strong>Type: </strong> {{beer.beer.beer_style}} <br/>
						<strong>Still in production?</strong> <i class="fa fa-check" ng-show="beer.beer.is_in_production"></i> <i class="fa fa-times" ng-hide="beer.beer.is_in_production"></i><br/>
						
						<strong>ABV: </strong> {{beer.beer.beer_abv}}% <span ng-show="beer.beer.beer_ibu"> <strong>IBU: </strong> {{beer.beer.beer_ibu}}</span> <br/>
						<strong>Brewed Since: </strong>{{ beer.beer.created_at | date:'MMM yyyy'}} <br/>
						<strong>Description: </strong> {{beer.beer.beer_description}} <br/>
						
					</p>
					
				</div>
			</div>
			<div class="alert alert-warning" ng-hide="!brewery || beerresults.length > 0">No Beers found</div>
			<div class="clearfix"></div>

			<br/>
			<br/>
			<h1 id="News">News</h1>
			<p>Latest 10 posts from a little app called The FaceBook <i class="fa fa-facebook-square"></i></p>
			<p>search <input type="text" placeholder="search posts" ng-model="postsearch"></p>
			<div class="alert alert-info" ng-if="posts === false">Loading posts ... </div>
			<div class="row-fluid" ng-show="posts">
				<div class="post col-md-4" ng-repeat="post in posts | filter:postsearch as postresults">
					<h3>{{post.message}}</h2>
					<h4>{{post.created_time | date}}</h3>
					<p><a href="https://www.facebook.com/{{post.id}}" target="_blank"><i class="fa fa-facebook-square"></i> link <i class="fa fa-external-link"></i></a>
						<br> {{post.story}}
					</p>
				</div>
			</div>
			<div class="clearfix"></div>
			<div class="alert alert-warning" ng-hide="!posts || postresults.length > 0">No Posts found</div>
			<div class="clearfix"></div>
			<br/>
			<h1 id="Events">Upcoming Events</h1>
			<p>search <input type="text" placeholder="search events" ng-model="eventsearch"></p>
			<div class="alert alert-info" ng-if="events === false">Loading events ... </div>
			<div class="row-fluid" ng-show="events">
				<div class="event col-md-4" ng-repeat="event in events | filter:eventsearch | future | reverse as eventresults">
					<h2>{{event.name}}</h2>
					<h3>{{event.start_time | date}}</h3>
					<p><a href="https://www.facebook.com/events/{{event.id}}" target="_blank"><i class="fa fa-facebook-square"></i> link <i class="fa fa-external-link"></i></a>
						<br> {{event.description}}
					</p>
				</div>
			</div>
			<div class="clearfix"></div>

			<div class="alert alert-warning" ng-hide="!events || eventresults.length > 0">No Events found</div>
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
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
	<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular.min.js"></script>
	<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular-resource.min.js"></script>
	<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular-route.min.js"></script>
	<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular-animate.min.js"></script>
	<script src="https://www.atlasestateagents.co.uk/javascript/tether.min.js"></script>
	<!-- Tether for Bootstrap -->
	<script src="./js/bootstrap.min.js"></script>
	<script src="./js/app-test.js"></script>

</body>

</html>