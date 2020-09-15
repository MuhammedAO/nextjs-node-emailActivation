
const DatauriParser = require('datauri/parser')
const path = require('path')
const parser = new DatauriParser()

//convert buffer to base64 image
// dUri.format('.png', buffer)
exports.dataUri = file => parser.format(path.extname(file.originalname).toString(), file.buffer)