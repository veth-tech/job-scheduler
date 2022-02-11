exports.sendEmail = (job) => {
    console.log("sending Email!!!")
    console.log('job', job)
    return { success: true }
}

exports.callAPI = (job) => {
    console.log("Calling API!!!")
    console.log('job', job)
    return { success: true }
}