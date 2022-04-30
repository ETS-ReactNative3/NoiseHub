# NoiseHub Mobile Application and Raspberry Pi Software
## Description
The problem NoiseHub aims to solve is one all college students experience: finding a suitable study space on campus can be challenging and consume precious time, better spent studying. NoiseHub intends to improve efficiency in students' search for study spaces by providing accurate and real-time information on study spaces across campus. This information includes room temperature, noise levels, and an estimate of current occupancy.
This repository contains all the scripts used by our team to pull, analyze, and push  data on the raspberry pi
<!-- NEW SECTION -->
## Raspberry Pi Software Modules
### Lidar Tripwire - /aws-sdk/samples/pubsub_door.py 
To determine door movement, this script utilizes two lidar sensors that are mounted in parallel on a door frame. Every 20ms, the sensors read their distances and if one of them reaches below around 60% of the door frame’s span, a door movement is detected. Then, based on whether the sensor that tripped first is closer to the hallway or room, we label it an entrance or exit respectively. To ensure a high success rate on labeling movement, we add a secondary conditional in the trip to verify that the expected sensor is a smaller value than the other (ex. If there is an entrance the sensor on the outside should be smaller than the inside one). Then every three minutes, the script packages the payload into a JSON struct and sends it to AWS.


### Audio / Temp Sensor Client - /aws-sdk/samples/noise_client.py (Alex)
The audio and temperature sensor client serves two primary functions. The first is to continuously sample room noise at a rate of twice per second, checking RMS values against a threshold and changing states to low, medium, or high accordingly. The second primary function is to sample temperature values every three minutes. Finally, the script acts as an MQTT client and sends a JSON payload containing both the noise and temperature data to a central server pi, described below.


### Audio / Temp Central Server - /aws-sdk/samples/pubsub_noise.py (Alex)
The central server script receives temperature and noise data from N number of clients (Detailed above), averages the data over a three minute interval, packages it into JSON, and sends it to AWS over MQTT. The central server is designed to support as many clients as needed, making it fully scalable and accurate no matter how many sources of temperature and noise data are added. 


### Lambda Analysis - /noiseHub/analyze_data.py 
This script serves as our AWS Lambda function that packages our AWS Timestream data into a human readable format. It takes the last 24 hours of data and first creates the X (timestamp) and Y (sensor value) arrays that are then used to populate the graphs on our front end. Additionally, we parse through the data to find peak and minimum values for temp, audio, and headcount. Once all the parameters have been calculated, we push everything to our dynamo database for easy fetching on the app. 

<!-- NEW SECTION -->
## Dependency Flow Chart
![Software Dependency Tree](https://github.com/ibchand/NoiseHub/blob/main/assets/readme/Software_Dependency_Tree.jpg)


## Mobile Application Software Modules
The mobile application was created using React Native and Expo with Amazon Web Services (AWS) resources supplying the backend. 

In this section, the structure of the project is broken down and explained so that any new developers can quickly understand how it works.

The root directory of this project contains several files and directories. Only those with relevance are explained. Several are automatically generated and the React Native, Expo, and/or AWS documentation should be used to answer any questions not answered here.

>**App.js**
>
>The Navigator for the application is defined in this file and each screen is imported and set as a Stack Screen. For more information, see the [React Navigation documentation](https://reactnavigation.org/docs/getting-started/).
>
>This screen also contains the code to configure Amplify, as specified within the AWS Resources instructions section below.

>**amplify**
>
>This directory is automatically generated when the Amplify application is added. For more information, see the [AWS Amplify documentation](https://docs.amplify.aws/)

The `src` directory contains most of the actual application is implemented. It contains the various screens, components, configurations, and functions that make up the application.

>**screens**
>
>The way screens are structured in this project is that each screen has it's own directory within the `screens` directory. That individual screen directory is named after the screen and contains a JavaScript file with the same name and a styling file named `styles.js`. 
>
>For example, the Home screen has a directory named `HomeScreen` with a file named `HomeScreen.js` within it.
>
>Within the `screens` directory is also a file named `index.js`. Each screen is registered and exported in this file so that they may be accessed by other files, App.js in particular.

>**API**
>
>This directory contains several files, each with functions to be used throughout the application. 
>
> `helperFunctions.js`:
> - sleep() - A function that takes a numerical values as an input, representing the number of milliseconds to sleep
> - createOneButtonAlert() - A function displays an alert when a user clicks on a SpaceCard for a space that is still not functional
> - timestamp_calc() - A function to convert the maximum timestamp into AM/PM time format 
> - head_estimation() - A function that headcount data and applies a correction based on user feedback data
>
> `lambdaCalls.js`:
> - invokeLambda() - This function invokes the `noisehub_data_analysis` Lambda function
> 
> `spaceCalls.js`:
> - create_space() - This function uses the graphQL API createSpace() function to create a new item in the DynamoDB spaceTable table
> - update_space() - This functions uses the graphQL API updateSpace() function to update an existing itme in the DynamoDB spaceTable table
> - get_space() - This function uses the graphQL API getSpace() function to retrieve an item in the DynamoDB spaceTable table
> - list_spaces() - This function uses the graphQL API listSpaces() function to retireve all items in the DynamoDB spaceTable table
>
> `userCalls.js`:
> - create_user() - This function uses the graphQL API createUser() function to create a new item in the DynamoDB userTable table
> - get_user() - This function uses the graphQL API getUser() function to retrieve an item in the DynamoDB userTable table
> 
> `timestreamCalls.js`:
> - formatNoiseData() - This function takes data from the Timestream `noise_temp_table` table query and formats it for use in the application
> - formatDoorData() - This function takes data from the Timestream `door_table` table query and formats it for use in the application
> - getTimeStreamData() - This function performs the Timestream table queries to the `noise_temp_table` and `door_table` tables and calls the formatNoiseData() and formatDoorData() functions before returning the formatted data in an object

>**components**
>
> This directory contains various components for use throughout the application such as buttons, logos, and cards.

>**config**
>
> This directory contains a single file named `colors.js` that contains the hex values of the applications color palette. This file can be imported throughout the application to easily set color values and alter them from a central file.
>
> Any other universal configurations can be placed in a file in this directory. 

>**graphql**
>
> This directory is automatically generated when the AppSync graphQL API is added to the project. It contains the AppSync schema along with 3 files containing functions to interact with the DynamoDB databases.
>
> Rather than use these functions directly, we wrote functions in spaceCalls.js and userCalls.js for a cleaner implementation.


<!-- NEW SECTION -->
## Customer Installation
### Prerequisites for all Pis
After git cloning this repo, the user should set up their AWS Amplify with IoT core, Timestream, and DynamoDB. This will allow you to generate secret access keys to publish and retrieve data from the database. The bash scripts detailed below will automatically install all required pip packages unless otherwise specified, but a complete list of all packages used can be found below:
- certifi==2020.6.20
- chardet==4.0.0
- click==8.1.2
- colorzero==1.1
- distro==1.5.0
- gpiozero==1.6.2
- idna==2.10
- jmespath==1.0.0
- numpy==1.22.3
- paho-mqtt==1.6.1
- PyAudio==0.2.11
- python-apt==2.2.1
- python-dateutil==2.8.2
- requests==2.25.1
- RPi.GPIO==0.7.0
- s3transfer==0.5.2
- six==1.16.0
- spidev==3.5
- ssh-import-id==5.10
- urllib3==1.26.5

### Lidar Sensor Pi
One Lidar system will be connected to the default I2C bus on the raspberry pi. The second will need to be connected to GPIO pins that are converted into I2C. To do this, edit the /boot/config.txt file and add "dtoverlay=i2c-gpio,bus=3,i2c_gpio_sda=12,i2c_gpio_scl=13". Then, with the Lidar wired like this:
![Lidar Diagram!](https://github.com/ibchand/NoiseHub/blob/main/assets/readme/Lidar_Diagram.png?raw=true)


pass SMBus(4) as the secondary lidar unit in the lidar distance pulling script.

Install the following pip modules:
- Awscrt
- Awsiotsdk

Next, run the door.sh script in the root of the git directory. The script will install the screen package and start a backgrounded process of pubsub_door.py.

### Central Server Pi
Install the linux screen package with “sudo apt install screen”, and install the following pip modules:
- Awsiotsdk
- Awscrt
- Numpy
- Paho-mqtt

Next, change the ipv4 address inside the pubsub_noise.py script to the pi’s current ipv4 address. Lastly, run the server.sh script at the root of the cloned directory to start a backgrounded process of pubsub_noise.py.

### Audio and Temperature Client Pi
Add “dtoverlay=w1-gpio” to the bottom of the /boot/config.txt file. Exit Nano, and reboot the Pi with sudo reboot. This will enable the one wire interface for the thermistor to pull data. After the pi reboots, run the following two commands:
```
> sudo modprobe w1-gpio
> sudo modprobe w1-therm
```

Run the start.sh script at the root of the cloned directory to install all apt and pip dependencies. After installing all dependencies, the script will start a backgrounded process of noise_client.py.

### Mobile Application
This section describes how to setup your development environment and the project to test or develop the mobile application.

**Prerequisites:**
- Install Node.js LTS release
- Install npm v5.x or later
- Install Watchman if using macOS or Linux

**Instructions:**

Install Expo CLI
```
npm install -g expo-cli
```

Clone NoiseHub Repository
```
git clone https://github.com/ibchand/NoiseHub.git
```

Install required packages
```
npm install
```

> The following steps assume you have already completed setting up the AWS resources as described in the instructions below

Add Amplify Application
```
amplify pull --appId -------------- --envName dev
```
Add AppSync GraphQL API 
```
amplify add codegen --apiId --------------------------
```

### AWS Resources
This section describes how to setup each of the AWS resources used by the mobile application. Each resource was used appropriately to fall under the scope of the AWS Free Tier. 

If your account does not have and is not eligible for the free tier, these resources do have costs under various pricing schemes, and you should be aware these costs will be billed to your account. It is recommended to setup billing alarms to avoid unwanted charges.

The resources described in this section are:
- AWS Amplify
- AWS AppSync
- AWS Cognito
- AWS DynamoDB
- AWS IoT Core
- AWS TimeStream
- AWS Lambda
- AWS IAM


#### **Amplify**
**Prerequisites:**
- [Create an AWS Account](https://portal.aws.amazon.com/billing/signup?redirect_url=https%3A%2F%2Faws.amazon.com%2Fregistration-confirmation#/start) and register for the AWS Free Tier is eligible
- Install Node.js v12.x or later
- Install npm v5.x or later

**Instructions:**

Install and Amplify CLI
```
npm install -g @aws-amplify/cli
```

Configure Amplify CLI
```
amplify configure
```
Enter the desired region

> Our team used `us-east-2` for all resources. 
>
> Using another region may require additional changes throughout the project not covered in these instructions. 

Enter the desired IAM User username.

> The program will open a web browser asking for you to sign into the AWS Console. In the case that you already have an IAM user, enter the matching username and simply close the browser.
>
> For our team, each team member had an IAM User created for them and was given the credentials. This allowed each member access to AWS resources and the ability to use the CLI, while maintaining separation for security purposes. 


Enter the `accessKeyID` and `secretAccessKey` of the newly created (or existing) IAM User provided above. 

Initialize Amplify Application
```
amplify init
```

Add the following code to App.js below the last import:
```
import { Amplify } from 'aws-amplify'
import awsconfig from './src/aws-exports'
Amplify.configure(awsconfig)
```


#### **AppSync**
Create AppSync GraphQL API via AWS Console
- Navigate to AWS AppSync on AWS Console
- Click `Create API` on APIs page
- Select `Build From Scratch` and click `Start` in the `Customize your API or import from Amazon DynamoDB` container
- Name the API `noisehub`. You may opt for another name, but it may require additional changes throughout the project not covered in these instructions.
- Click `Edit Schema` and then `Create Resources`
- Select `Define new type` and paste the following:
```
type space {
    uuid: ID!
    name: String
    location: String
    hours: String
    amenities: String
    noiseLevel: String
    busyLevel: String
    tempLevel: String
    userFeedback: AWSJSON
    graphData: String
    correction: Int
    headRange: Int
}
```
- Enter `spaceTable` for the Table name
> Using another name may require addtional changes throughout the project not covered in these instructions
- Select `uuid` as the Primary Key
> Our team did not select a Sort Key
- Click `Create`
- Click `Create Resources`
- Select `Define new type` and paste the following:
```
type user {
    username: String!
    school: String!
    noisePref: Boolean!
    tempPref: Boolean!
    crowdPref: Boolean!
}
```
- Enter `userTable` for the Table name
> Using another name may require addtional changes throughout the project not covered in these instructions
- Select `username` as the Primary Key
> Our team did not select a Sort Key
- Click `Create`


Add the API to Amplify and generate files in project
```
amplify add codegen --apiId --------------------------
```


#### **Cognito**
Create Cognito Pools via Amplify CLI
```
amplify add auth
```
> Our team went with the default configuration and did not use social providers

Edit Cognito Identity Pool Authenticated Role permissions
- Add the following policy to allow Scan operations on the DynamoDB spaceTable Table
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": "dynamodb:Scan",
            "Resource": "INSERT TABLE ARN"
        }
    ]
}
```
- Add the following policy to allow Invocations of the data analysis Lambda function
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": "lambda:InvokeFunction",
            "Resource": "INSERT LAMBDA FUNCTION ARN"
        }
    ]
}
```
- Add the following policy to allow for interaction with all Timestream tables
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "timestream:CancelQuery",
                "timestream:DescribeDatabase",
                "timestream:DescribeEndpoints",
                "timestream:DescribeTable",
                "timestream:ListDatabases",
                "timestream:ListMeasures",
                "timestream:ListTables",
                "timestream:ListTagsForResource",
                "timestream:Select",
                "timestream:SelectValues",
                "timestream:DescribeScheduledQuery",
                "timestream:ListScheduledQueries"
            ],
            "Resource": "*"
        }
    ]
}
```
> The mobile application allows users to register via Cognito and we give those users certain permissions so that their credentials can be used when interacting with AWS resources. This avoids the need to hardcode credentials and provides fine control over permissions.

#### **DynamoDB**
The DynamoDB tables used in this project are automatically created through AppSync. Refer to those instructions above.

#### **IoT Core**
Create IoT Policy
- Navigate to AWS IoT on AWS Console
- Select `Secure` and then `Policies`
- Click `Create Policy`
- Enter `raspberry-pi-2-policy` for the Policy Name
> Using another name may require addtional changes throughout the project not covered in these instructions
- Paste the following into the Policy Document
```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "iot:Connect",
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": "iot:Publish",
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": "iot:Receive",
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": "iot:Subscribe",
      "Resource": "*"
    }
  ]
}
```
- Click `Create`

Create thing object
> "Devices connected to AWS IoT are represented by `thing objects` in the AWS IoT registry" - [Source](https://docs.aws.amazon.com/iot/latest/developerguide/create-iot-resources.html#create-aws-thing)
>
> You will need to create a thing for each device in your system. For our implementation, we created things for each of the RaspberryPis
- Navigate to AWS IoT on AWS Console
- Select `Manage` and then `Things`
- Click `Create things`
- Select `Create single thing
- Click `Next`
- Enter name for thing
- Click `Next`
- Select `Auto-generate a new certificate`
- Attach `raspberry-pi-2-policy` policy
- Click `Create thing`
- Download the certificate and key files

#### **Timestream**
Create KMS Key
- Navigate to Key Management Service
- Click `Create a key`
- Select `Symmetric` for Key type
- Select `Encrypt and decrypt` for Key usage
- Click `Next`
- Enter `aws/timestream` for the Alias
> Using another alias may require addtional changes throughout the project not covered in these instructions
- Select desired key administrators
- Click `Next`
- Set desired key usage permissions
- Click `Next`
- Click `Finish`

Create a Timestream Database
- Navigate to Amazon Timestream on AWS Console
- Click `Create database`
- Select `Standard database`
- Enter `noisehub-timestream` for the Name
> Using another name may require addtional changes throughout the project not covered in these instructions
- Select `aws/timestream` for the KMS key
- Click `Create database`

Create a Timestream table
- Navigate to Amazon Timestream on AWS Console
- Click `Tables` in side menu
- Click `Create table`
- Select `noisehub-timestream` for the Database name
- Enter `door_table` for the Table name
> Using another name may require addtional changes throughout the project not covered in these instructions
- Enter `1 day(s)` for Memory store retention
- Enter `7 day(s)` for Magnetic store retention
- Do not enable Magnetic Storage Writes
- Click `Create table`
- Repeat this process to create another table named `noise_temp_table` and keep all other settings the same

#### **Lambda**
Create Lambda Function
- Navigate to AWS Lambda on AWS Console
- Click `Create Function`
- Select `Author from scratch`
- Enter `noisehub_data_analysis` as the function name
> Using another name may require addtional changes throughout the project not covered in these instructions
- Select `Python 3.8` for the Runtime
- Select `x86_64` for the Architecture
- Click `Create Function`
- Paste [lambda_analyze_data.py](https://github.com/allenz1120/NoiseHub_Hardware/blob/main/noiseHub/lambda_analyze_data.py) into the `Code Source`
- Click `Deploy`
