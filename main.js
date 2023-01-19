import readLine from "readLine-sync";

var postCodeData;

do {
    console.log("Please enter the postcode, eg NW5+1TL");
    const userInput = readLine.prompt();

    const postCodeResponse = await fetch(`https://api.postcodes.io/postcodes/${userInput}`);
    postCodeData = await postCodeResponse.json();
} while (postCodeData.status != 200);


const longitude = postCodeData.result.longitude;
const latitude = postCodeData.result.latitude;


const httpRequest = `https://api.tfl.gov.uk/StopPoint/?lat=${latitude}&lon=${longitude}&stopTypes=NaptanPublicBusCoachTram&radius=1000`;
const response2 = await fetch(httpRequest);
const busStopData = await response2.json();


for (let i = 0; i < 2; i++) {

    console.log(busStopData.stopPoints[i].commonName);

    const response3 = await fetch(`https://api.tfl.gov.uk/StopPoint/${busStopData.stopPoints[i].id}/Arrivals`);
    const busArrivalData = await response3.json();

    for (let j = 0; j < 5; j++) {
        let bus = busArrivalData[j];
        console.log(`
        bus:${bus.lineName}
        bus destination: ${bus.destinationName}
        time to arrival: ${Math.floor(bus.timeToStation / 60)}minutes and ${bus.timeToStation % 60}seconds`);

    }
}
