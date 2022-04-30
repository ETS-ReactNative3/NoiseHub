# NoiseHub Sensor Scripts
## Description
The problem NoiseHub aims to solve is one all college students experience: finding a suitable study space on campus can be challenging and consume precious time, better spent studying. NoiseHub intends to improve efficiency in students' search for study spaces by providing accurate and real-time information on study spaces across campus. This information includes room temperature, noise levels, and an estimate of current occupancy.

This repository will contain all the information necessary to recreate the hardware setup of NoiseHub including all parts and pinouts that were used.

<!-- NEW SECTION -->
## All Required Parts
- (5) Raspberry Pi 4B
- (3) Waterproof 1-Wire DS18B20 Compatible Digital temperature sensor
- (3) 4.7k resistor
- (2) Garmin LIDAR-Lite Optical Distance LED Sensor - V4
- (2) 2kOhm resistor
- (3) Mini USB Microphone 3367
- (5) Raspberry Pi 4B Case (Raspberry Pi 4 Case, iUniker Raspberry Pi 4 Fan ABS Case with Cooling Fan)
- (4) Breadboard Circuit Case (3ple Decker Universal Circuit Case)
- (4) Mini Breadboards
- Jumper Wires

## Justification for Choosing Major Parts
The Raspberry Pi 4B was chosen by our team due to its relatively high computational power. With 4GB of RAM, it would be able to handle the load of reading, processing, and uploading data to our cloud providers, and do it quickly. Additionally, having a GUI and linux was helpful during development.  In the end, although a microcontroller might have been slightly more efficient with processing our sensor data, we decided to choose the Raspberry Pi 4B since it was sufficient for our purposes. 


The Lidar sensors were chosen due to their availability and cost effectiveness. For headcount, several options were explored, such as: thermal imaging, C02 sensors, bluetooth device tracking, etc. However, all other sensors would have their own inaccuracies or relied on very complex algorithms to check for headcount. We decided that for the purposes of our project, we did not need to achieve 100% accuracy on headcount and just needed a general gauge of how full a room was. As a result, the lidar sensors, at $75 a piece, combined with a tripwire algorithm was the best option for us.

The USB audio sensors were chosen since they were a cheap and un-intrusive microphone that we could easily mount to a raspberry pi. The microphones are no bigger than a thumb and can be placed on a wall without weighing the pi down. The small size also makes the device non distracting for users in a room.

Lastly, the digital temperature sensor was chosen due to the Raspberry Pi’s limited analog to digital conversion capabilities. To use a traditional analog thermistor, we would have needed to get a hat for our pi to enable usage of ADC devices. As a result, we switched over to a digital sensor.

## Cost Breakdown
![Cost Breakdown!](https://github.com/ibchand/NoiseHub/blob/main/assets/readme/BOM.png?raw=true)

> This cost breakdown is for an expanded version of NoiseHub with multiple noise and temperature sensor Pis, for added accuracy. A “lite” version of this system can be achieved by reducing the number of noise and temperature Pis.

## Power Requirements
The Raspberry Pi 4B uses a 5.1 DC output with a USB C cable. All other sensors are plugged into the pi and are powered through it. The Garmin lidar sensor requires 5V, unless specified otherwise by pre soldered breakout boards. The temperature sensor required 3.3V to operate. Lastly, the audio microphone uses the USB A port which is a standard of 5V.

## Lidar Pi
Requires:
- (1) Raspberry Pi 4B
- (2) Garmin LIDAR-Lite Optical Distance LED Sensor - V4
- (2) 2kOhm resistor
- (1) Raspberry Pi 4B Case (Raspberry Pi 4 Case, iUniker Raspberry Pi 4 Fan ABS Case with Cooling Fan)
- (1) Breadboard Circuit Case (3ple Decker Universal Circuit Case)
- (1) Mini Breadboards
- Jumper Wires

The lidar tripwire pi uses two lidar sensors to detect entrances and exits. One of these sensors is connected to the Pi’s on board I2C pins. The second sensor must map the Pi’s GPIO pins as I2C since there is only one set of default I2C pins. To do this, the SDA and SCL mapped GPIO pins must be pulled up using a 2kOhm resistor that is connected to 5v power. Then, inside the /boot/config.txt file you must add "dtoverlay=i2c-gpio,bus=3,i2c_gpio_sda=12,i2c_gpio_scl=13" to make GPIO pins 12 and 13 into SDA and SCL. This allows us to utilize SMBus(4) as our secondary I2C pins. 


After the pins on the pi have been configured, the lidar units are connected to the pi pins through the SDA, SCL, power (5V) and ground pins. The manual can be found at (https://static.garmin.com/pumac/LIDAR-Lite%20LED%20v4%20Instructions_EN-US.pdf) 
The combination of pins we used were:

| Raspberry Pi Pin | Pin Description | Lidar    |
|------------------|-----------------|----------|
| 1                | 3.3V            | Lidar #2 |
| 32               | GPIO i2c        | Lidar #2 |
| 2                | 5V              | Lidar #1 |
| 3                | i2c             | Lidar #1 |
| 5                | i2c             | Lidar #1 |
| 33               | GPIO i2c        | Lidar #2 |
| 39               | Ground          | Both     |

Lidar #1 = Lidar using built in pull up in default i2c pins

Lidar #2 = Lidar with manual pull up using reconfigured GPIO pins

To make the connection stronger for the lidar system, we suggest additionally soldering and heat shrinking the lidar pins.After the lidar system has been wired up, attach the pi and breadboard into their respective cases. To mount onto the doorway, we attach velcro straps on the backs of the lidar units and place them on the door frame, on the side closer to the hinges. We place them around average chest level to prevent inaccurate entrance/exit readings, ie. from arms or legs swinging back and forth. The two sensors are on the same level with the lenses in a vertical position (circle on top of each other). The door frame that we used also allows us to place them at a maximum of 3.5 inches apart. This is a very small gap but with a high sample rate, we are still able to isolate the direction of movement between the doors.

![Cost Breakdown!](https://github.com/ibchand/NoiseHub/blob/main/assets/readme/Lidar_Hardware.png?raw=true)

## Audio and Temperature Pi
Requires:
- (3) Raspberry Pi 4B
- (3) Waterproof 1-Wire DS18B20 Compatible Digital temperature sensor
- (3) 4.7k resistor
- (3) Mini USB Microphone 3367
- (3) Raspberry Pi 4B Case (Raspberry Pi 4 Case, iUniker Raspberry Pi 4 Fan ABS Case with Cooling Fan)
- (3) Breadboard Circuit Case (3ple Decker Universal Circuit Case)
- (3) Mini Breadboards
- Jumper Wires

Each audio and temperature sensor pi pulls data from one digital temperature sensor and one usb microphone. Our system runs with 3 audio and temperature pis that both send data to a central server pi but more can be added easily.

The temperature sensor must be connected to power(3.3V), ground, and a data pin with a 4.7k pull up resistor connected to the 3.3V rail. It’s important to use the 3.3V and not 5V otherwise the readings will be inaccurate. Then, by adding “dtoverlay=w1-gpio” to the bottom of the /boot/config.txt file, after rebooting the Pi  this will enable the one wire interface for the thermistor to pull data.  

For the audio, no hardware additional setup is required besides a USB A port on the raspberry pi, which is included on the 4B model.

After the audio and temperature system has been wired up, attach the pi and breadboard into their respective cases. Then, place them around the room in central areas to average the most accurate values as possible.

![Cost Breakdown!](https://github.com/ibchand/NoiseHub/blob/main/assets/readme/Temp_Hardware.png?raw=true)


## Central Server Pi
Requires:
(1) Raspberry Pi 4B
Since the central server pi’s function is just to aggregate audio/temperature data and push it up to AWS, no additional hardware is required besides the Pi itself. 

<!-- NEW SECTION -->
## Circuit Diagram
![Pi with LIDARs and thermistor](https://github.com/ibchand/NoiseHub/blob/main/assets/readme/Lidar_Thermistor_Circuit_Diagram.jpg?raw=true)

![Pi with thermistor and microphone](https://github.com/ibchand/NoiseHub/blob/main/assets/readme/Thermistor_Mic_Diagram.jpg?raw=true)


<!-- NEW SECTION -->
## Resources
Here you can find links to the datasheets for all the hardware used

[Thermistor](https://cdn-shop.adafruit.com/datasheets/DS18B20.pdf )

[Garmin LIDAR-Lite v4 LED](https://cdn-shop.adafruit.com/product-files/4441/4441_LIDAR-Lite+LED+v4+Instructions_EN-US.pdf )

[Garmin LIDAR-Lite v4 LED with QWIIC soldered breakout board](https://cdn.sparkfun.com/assets/c/e/9/3/1/Qwiic_LIDAR_Lite_v4_dimensions.pdf )

[USB Microphone](https://media.digikey.com/pdf/Data%20Sheets/Adafruit%20PDFs/3367_Web.pdf)


