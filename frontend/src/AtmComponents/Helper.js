export const formattedDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-GB', options); // dd-mm-yyyy format
    const formattedTime = date.toLocaleTimeString('en-GB'); // 24-hour format
    return `${formattedDate} ${formattedTime}`;
  };