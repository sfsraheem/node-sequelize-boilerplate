const generateOTP = () => (Math.floor(Math.random() * 899999) + 100000).toString()

export default generateOTP;