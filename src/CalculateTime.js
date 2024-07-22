
function get_time_diff(startTime, endTime) {
    try {
        // Construct the date string in a format that can be parsed correctly
        const d = new Date();
        const monthDay = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        let month = monthDay[d.getMonth()];
        let currentYear = d.getFullYear();
        let currDate = d.getDate();
        const Dates = `${currentYear + "-" + month + "-" + currDate}`



        const dateString = `${Dates}` + ` ${startTime}`;
        const endDateString = `${Dates}` + ` ${endTime}`;


        console.log("dateString", dateString);
        console.log("endDateString", endDateString);

        // Parse the date strings into Date objects
        const startDate = new Date(dateString);
        const endDate = new Date(endDateString);

        // console.log("startDate", startDate)
        console.log("endDate", endDate.toLocaleTimeString('en-US'))

        // Check if the parsed dates are valid
        if (isNaN(startDate) || isNaN(endDate)) {
            throw new Error("Invalid date or time format");
        }

        // Calculate the difference in milliseconds
        let difference = endDate.getTime() - startDate.getTime();

        // Convert the difference from milliseconds to hours, minutes, and seconds
        const hours = Math.floor(difference / (1000 * 60 * 60));
        difference -= hours * (1000 * 60 * 60);
        const minutes = Math.floor(difference / (1000 * 60));
        difference -= minutes * (1000 * 60);
        const seconds = Math.floor(difference / 1000);

        // Return the difference as an object
        // return { hours, minutes, seconds };
        return hours + ":" + minutes + ":" + seconds;
    } catch (error) {
        console.error("Error calculating time difference:", error.message);
        return null; // or handle the error in your desired way
    }
}


// function get_time_diff(TimeIn, TimeOut) {
//     try {
//         const d = new Date();
//         const monthDay = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
//         let month = monthDay[d.getMonth()];
//         let currentYear = d.getFullYear();
//         let currDate = d.getDate();
//         const Dates = `${currDate + ":" + month + ":" + currentYear}`

//         console.log(TimeIn);
//         console.log(TimeOut);
//         var date1 = new Date().toLocaleTimeString("23:41:20");
//         var date2 = new Date().toLocaleTimeString("02:56:32");


//         var diff = date2.getTime() - date1.getTime();
//         // var diff = date1.getTime() - date2.getTime()
//         console.log("1", date1);
//         console.log("1", date2);
//         console.log("dD", diff);

//         var msec = diff;
//         var hh = Math.floor(msec / 1000 / 60 / 60);
//         msec -= hh * 1000 * 60 * 60;
//         var mm = Math.floor(msec / 1000 / 60);
//         msec -= mm * 1000 * 60;
//         var ss = Math.floor(msec / 1000);
//         msec -= ss * 1000;

//         return (hh + ":" + mm + ":" + ss);
//     } catch (error) {
//         console.log(error);

//     }

// }

export { get_time_diff }