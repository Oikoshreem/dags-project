function generateOTP(){
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
};

async function sendOTP(otp, phone)
{
    const url= process.env.FASt_SMS_API ;
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error sending OTP:', error);
    }
}


module.exports = { sendOTP, generateOTP}