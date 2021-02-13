node-sass --source-map true --source-map-contents --output-style compressed .\sistersbrewery.scss sistersbrewery.css -o .\ 
rem node-sass --output-style compressed .\sistersbrewery.scss > sistersbrewery.min.css 
node-sass --source-map true --watch=sistersbrewery.scss -r --source-map-contents --output-style compressed .\sistersbrewery.scss sistersbrewery.css -o .\ 