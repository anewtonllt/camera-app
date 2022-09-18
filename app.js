// Set constraints for the video stream
var constraints = { video: { facingMode: "environment" }, audio: false }; // user - environment
var track = null;
var sw = false;

// Define constants
const cameraView = document.querySelector("#camera--view"),
    cameraOutput = document.querySelector("#camera--output"),
    cameraSensor = document.querySelector("#camera--sensor"),
    cameraTrigger = document.querySelector("#camera--trigger");
    cameraSwitch = document.querySelector("#camera--switch");

// Access the device camera and stream to cameraView
function cameraStart() {
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(stream) {
            track = stream.getTracks()[0];
            cameraView.srcObject = stream;
        })
        .catch(function(error) {
            console.error("Oops. Something is broken.", error);
        });
}

// Take a picture when cameraTrigger is tapped
cameraTrigger.onclick = function() {
    cameraSensor.width = cameraView.videoWidth;
    cameraSensor.height = cameraView.videoHeight;
    cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
    cameraOutput.src = cameraSensor.toDataURL("image/webp");
    cameraOutput.classList.add("taken");
    // track.stop();
};

cameraSwitch.onclick = function() {
    sw = !sw;
    if (sw) {
      constraints = { video: { facingMode: "environment" }, audio: false };
    } else {
      constraints = { video: { facingMode: "user" }, audio: false };
    }     
    track.stop();
    cameraStart();
};

// Start the video stream when the window loads
//window.addEventListener("load", cameraStart, false);

function getLocation() {
  if (navigator.geolocation) {
    setInterval(() => {navigator.geolocation.getCurrentPosition(showPosition);}, 100);
  } else { 
    document.getElementById("GPS").innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  document.getElementById("GPS").innerHTML = "Latitude: " + position.coords.latitude.toFixed(6) + 
  "<br>Longitude: " + position.coords.longitude.toFixed(6);
}
function getMotion() {
  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    // Handle iOS 13+ devices.
    DeviceMotionEvent.requestPermission()
      .then((state) => {
        if (state === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation); // deviceorientation - devicemotion
        } else {
          console.error('Request to access the orientation was rejected');
        }
      })
      .catch(console.error);
  } else {
    // Handle regular non iOS 13+ devices.
    window.addEventListener('deviceorientation', handleOrientation);
  }
}

function handleOrientation(event) {
  console.log(event);
  const alpha = event.alpha;
  const beta = event.beta;
  const gamma = event.gamma;
  
  var today = new Date();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  document.getElementById("Tm").innerHTML = "Time " + time;
  document.getElementById("IMU").innerHTML = "Alpha: " + alpha.toFixed(2) + "<br>Beta: " + beta.toFixed(2) + "<br>Gamma: " + gamma.toFixed(2);
//  document.getElementById("Bet").innerHTML = "Beta: " + beta.toFixed(2);
//  document.getElementById("Gam").innerHTML = "Gamma: " + gamma.toFixed(2);
}
window.addEventListener("load", myInit, true); function myInit(){cameraStart(); getMotion(); getLocation();}; 
