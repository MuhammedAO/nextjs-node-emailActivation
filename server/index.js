require('dotenv').config()
const express = require('express')
const app = express()
const User = require('./db/user')
const PendingUser = require('./db/pending-user')
const bodyParser = require('body-parser')
const { cloudinaryUpload } = require('./services/cloudinary')
const { dataUri } = require('./services/data-uri')
const { upload } = require('./services/multer')

const { sendConfirmationEmail } = require('./mailer')

const cors = require('cors')
const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
}


app.use(bodyParser.json())
app.use(cors(corsOptions))

app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello World!' })
})

app.get('/api/activate/user/:hash', async (req, res) => {
  const { hash } = req.params

  //find pending user
  try {
    const user = await PendingUser.find({ _id: hash })
    if (!user) {
      return res.status(422).send('User cannot be activated')
    }

    //copy info of pending user into a new user
    const newUser = new User({ ...user.data })
    //store new user
    await newUser.save()
    //remove pending user
    await user.remove()
    res.json(`User ${hash} has been activated`)
  } catch {
    return res.status(422).send('User cannot be activated')
  }
})

app.delete('/api/user/delete', async (req, res) => {
  try {
    const user = await PendingUser.find({ email: 'test' })
    await user.remove()
    return res.json({ message: 'User has been removed!' })
  } catch (e) {
    return res.status(422).send('Cannot delete an user!')
  }
})

app.post('/api/register', async (req, res) => {
  const { email, password, username } = req.body
  try {
    const rUser = await User.find({ email })
    const pUser = await PendingUser.find({ email })
    if (pUser || rUser) { return res.status(422).send('User is already registered!') }

    const newUser = new PendingUser({ email, username, password })
    await newUser.hashPassword()
    await newUser.save()
    //send email
    await sendConfirmationEmail({ toUser: newUser.data, hash: newUser.data._id })
    res.json({ message: 'You have been registered, please check your email' })
  } catch (e) {
    res.status(422).send(e.message)
  }
})

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.find({ email })
    if (!user) { return res.status(422).send('Invalid credentials!') }

    const isValid = await user.validatePassword(password)
    if (!isValid) { return res.status(422).send('Invalid password!') }

    res.json({ message: 'You have been succesfuly logged in' })
  } catch (e) {
    res.status(404).send(e.message)
  }
})


const singleUpload = upload.single('image')

const singleUploadCtrl = (req, res, next) => {
  singleUpload(req, res, (error) => {
    if (error) {
      return res.status(422).send({ message: 'Image upload failed' })
    }
    next()
  })
}

app.post('/api/image-upload', singleUploadCtrl, async (req, res) => {
  try {
    if (!req.file) { throw new Error('Choose an image') }
    const file64 = dataUri(req.file)
    const uploadResult = await cloudinaryUpload(file64.content)

    return res.json({ cloudinaryId: uploadResult.public_id, url: uploadResult.secure_url })
  } catch (error) {
    return res.status(422).send({ message: error.message })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`> Connected to ${PORT}`))
