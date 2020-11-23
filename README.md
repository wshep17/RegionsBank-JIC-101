# RegionsBank-JIC-101
This readme is written for a Windows OS

RELEASE 1.0 NOTES
## Features
	(a) Monthly Payment Calculator
	
	(b) Vehicle Affordability Calculator

	(c) Low Rate vs. Cash Back Calculator

	(d) Chatbot and Live messaging

	(e) Live Video Calling

## Bug Fixes
	(a) Y values on the chart overlapped with the Y axis labels

	(b) The chatrooms errored out when deleting a room

## Known Bugs and Defects
	(a) The calulators will error out with negative inputs

	(b) The legend for the multi-bar chart overlaps with the bars

	(c) The tool tips for inputs and chart data are still in progress

	(d) The Monthly Payment Calculator does not include a downloadable csv of the loan payoff schedule

INSTALL GUIDE
## Step 1: Install latest version of Nodejs.
	(a) Navigate to `https://nodejs.org/en/download/`.

## Step 2: Clone the Repository.

	(a) Type `git clone https://github.com/wshep17/RegionsBank-JIC-101.git` into the command line.
	    This command will create the project folder and initialize git in that folder.

## Step 3: Navigate to the Application Folder.

	(a) Type `cd RegionsBank-JIC-101` into the command line.
		This command will change directory to the project folder.

	(b) Type `cd loan-calculator` into the command line.
		This command will change directory to the front-end folder of the application.

## Step 4: Install Dependencies.
	Note: You should be in the `loan-calculator` folder
	(a)	Type `npm install` into the command line.
		This command will install the dependencies in the local `node_modules` folder.

## Step 5: Run the Application.
	Note: You should be in the `loan-calculator` folder
	(a) Type `npm start` into the command line.
		This command will run the start script to start the application in development mode.

## Step 6: Open the Application in the Browser!
	(a) Open [http://localhost:3000] to view it in the browser.
