const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const MongoClient = require('mongodb').MongoClient;
const dotenv = require('dotenv'); // Load environment variables

dotenv.config(); // Load variables from .env file

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/submit', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const client = await MongoClient.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    const db = client.db(process.env.DB_NAME);
    await db.collection('submissions').insertOne({
      name,
      email,
      subject,
      message,
      timestamp: new Date()
    });

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for your submission',
      html: '<p>Thank you for submitting the form. We have received your message.</p>'
    };

    await transporter.sendMail(mailOptions);

    client.close();
    res.redirect('/');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
