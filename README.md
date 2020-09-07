# RegionsBank-JIC-101 (Front End & Backend)
This readme is written for a Windows OS

### Step 1: Install latest version of Nodejs from: https://nodejs.org/en/download/
=========================================================================
### Step 2: Download latest version(msi) of MongoDB from: https://www.mongodb.com/try/download/community?tck=docs_server
	Step 2A: Open the Installer
	Step 2B: Click Next on Welcome Screen
	Step 2C: Accept the End User Licencse & Click Next 
	Step 2D: Select "Complete" on the Setup Type & Click Next 
	Step 2E: Uncheck the "Install MongoD as a Service" option & Click Next
	Step 2F: UnCheck the "Install MongoDB Compass" option & Click Next
	Step 2G: Click "Install"
	Step 2H: Click "Finish" after the installation is complete
=========================================================================
### Step 3: Download latest version(msi) of MongoDB Compass from: https://www.mongodb.com/try/download/compass
	MongoDB Compass is a GUI for the Mongo Database. It is not required, but I recommend having it.
	Step 3A: Click Next on Welcome Screen
	Step 3B: Confirm a Destination Folder & Click Next
	Step 3C: Click "Install"
	Step 3D: Click "Finish" after the installation is complete
=========================================================================
### Step 4: Open Command Line
    Step 4A: type `cd\`
	Step 4B: type `mkdir data`
	Step 4C: type `cd data`
	Step 4D: type `mkdir db`
	Step 4C: type `cd db`
	Step 4D: type `mongod`
	Note: If "mongod" is not recognized as a command you need to add the mongo 
	bin folder PATH to your SYSTEM VARIABLES.
	For example: My mongo bin folder was located at: `C:\Program Files\MongoDB\Server\4.4\bin`
### Step 4E: After adding mongod to your path system variables, navigate to C:\data\db and type mongod
	Note: This script must remain running in order to use the local database.
=========================================================================
### Step 5: Open MongoDB Compass
### Step 5A: Type `mongodb://localhost` for the connection url.
	Note: This is because, we will be running this locally.
=========================================================================
### Step 6: Open another command line screen, but do NOT close the screen running the mongo script
	Step 6A: In your 2nd command line screen, type: `git clone https://github.com/wshep17/RegionsBank-JIC-101.git`. This command will create the project folder and initialize git in that folder
	Step 6B: Type `cd RegionsBank-JIC-101` into the command line. This command will change directory to the project folder
	Step 6C: Type `cd api` into the command line. This command will change directory to the backend folder of the application
	Step 6D: Type `npm install` into the command line. This command will install the dependencies in the local node_modules folder.
	Step 6E: Type `cd..` into the command line.
	Step 6F: Type `cd loan-calculator-client` into the command line.
	Step 6G: Type `npm install` into the command line.
=========================================================================
### ALMOST THERE! :)
### Reminder: You should have two command line screens open at this point. 
### Step 7: Open a 3rd command line interface
	Step 7A: Navigate to the `api` directory in one command line screen(either one NOT runnning mongod script)
	Step 7B: Type `npm start`
	Step 7C: Navigate to the `loan-calculator-client` directory in the other free command line screen
	Step 7A: Type `npm start`
=========================================================================
### Conclusion.
	I know that was probably a lot. Important thing to takeaway, is that if you want to run the application, you should have 3 command lines open at the same time: 1 for the mongod script, 1 for the api server, and 1 for the client server. Reach out to me(will) if you have any questions at any stage of this process.
=========================================================================
### Extra.
	I created a script to generate users in our database. To run this script, you MUST have two command line interfaces open at the same time: 1 should be running the mongod script, and in the other one, navigate to the `RegionsBank-JIC-101\api\scripts\db-setup.js` directory, and type `node db-setup.js` in the command line. Once that is complete, look at your MongoDB GUI to see the `Regions` database with the `AdminUser` collection and the new users you just added. Running this script is NOT required to running the application. I just made it, so it would be easier for everyone to get started.  