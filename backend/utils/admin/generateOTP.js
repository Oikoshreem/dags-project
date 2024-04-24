function generateOTP(){
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
};

async function sendOTP(otp, phone)
{
    const url= `https://www.fast2sms.com/dev/bulkV2?authorization=jWqwnf1D8rcH6e5AWbkarRWJYpjZ2ikgk7I0HItSbFxdIJbALhBM7xSKuqmJ&route=otp&variables_values=${otp}&flash=0&numbers=${phone}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error sending OTP:', error);
    }
}


module.exports = { sendOTP, generateOTP}