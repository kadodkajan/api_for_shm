function isOrderWithinCutoff(date, cutoffTime) {
    const orderDate = new Date(`${date} 00:00:00`);
    const torontoTimeZone = "America/Toronto";
    const dateInToronto = new Date().toLocaleDateString("en-US", {
      timeZone: torontoTimeZone,
    });
    const timeInToronto = new Date().toLocaleTimeString("en-US", {
      timeZone: torontoTimeZone,
    });
  
    // Parse date and time strings to create a Date object for current date and time
    const currentDateTime = new Date(`${dateInToronto} ${timeInToronto}`);
  
    // Calculate the time difference in milliseconds
    const diff = orderDate.getTime() - currentDateTime.getTime();
  
    // Convert the time difference to hours
    const hoursDifference = Math.floor(diff / 1000 / 60 / 60);
  
    // Check if the order is within the cutoff time
    return cutoffTime < hoursDifference;
  }
  
  module.exports = { isOrderWithinCutoff };
