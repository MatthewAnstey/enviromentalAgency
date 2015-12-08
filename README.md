## Fusion Tables Mobile Bootstrap


A Fusion Mobile Web Application with map and form. User's details are posted to the google fusion table and then displayed on the map.


##Getting started

####Create Google Fusion Table

https://www.google.com/fusiontables/data?dsrcid=implicit

- FirstName (text)
- SecondName (text)
- Description (text)
- Location (location)
- TimeSent (number)
- Photo (text) (four line image)


####Update config template with fusion template details

templates/partials/config.mustache

####Run

`npm install`

`gulp build`

`gulp`

