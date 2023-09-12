import nodemailer from 'nodemailer';
import { mongoose } from 'mongoose';
const { Schema } = mongoose;
import jwt from 'jsonwebtoken';


mongoose.connect(
  "mongodb+srv://GupChup:Ad6gvD84vPT8nDpl@cluster0.8wreyim.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true })
  .then(() => {
    console.log("line no 11 ----- Connected to MongoDB");
  })
  .catch(() => {
    console.log("line no 14 ------- Couldn't connect to MongoDB");
  })


// schema Start 


const userSchema = new Schema({
  otp: Number,
  name: String,
  datetime: { type: Date, default: Date.now },
  email: String,
  gender: String,
  age: Number,
  city: String,
  token: String

});

const User = mongoose.model('User', userSchema)



const chatMessageSchema = new Schema({
  sender: String,
  receiver: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);









// Schema end 














const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: 'sid.singh9099@gmail.com',
    pass: 'kxzsqrmtzxlafsop'
  }
});
class UserController {
  static homepage = async function (req, res) {
    res.send("Gup-Chup")
  }

  // send OTP 

  static emailvarification = async function (req, res) {
    console.log(`line no 45 ${req.body}`);
    function otpfunction() {
      return Math.floor(100000 + Math.random() * 900000);
    }

    let otp = otpfunction()

    var databaseresponce
    var isEmailPresent = [];

    const checkuserexist = async function () {
      isEmailPresent = await User.find(req.body).exec();
      console.log(`Line no 57${isEmailPresent.length}`);
      // res.status(200).send(isEmailPresent);
      if (isEmailPresent.length === 0) {
        console.log(`line no 60 ${true}`);
        createnewuser()
        sendEmail()
      } else {
        console.log(`line no 64 ${false}`);
        console.log(isEmailPresent);
        var alluser = async () => {
          const allProduct = await User.findByIdAndUpdate(isEmailPresent[0]._id, { $set: { otp: otp } })
          console.log(`line no 68 ${allProduct}`);
          databaseresponce = allProduct
        }
        sendEmail()
        alluser()
        setTimeout(() => {
          var alluser = async () => {
            const allProduct = await User.findByIdAndUpdate(isEmailPresent[0]._id, { $set: { otp: 111111 } })
            console.log(`line no 76 ${allProduct}`);
          }
          alluser()
        }, 300000);
      }
    }

    checkuserexist()

    let data = req.body;
    data.otp = otp;

    var createnewuser = async () => {
      const user = new User(data);
      databaseresponce = await user.save()
      console.log(`line no 91 ${databaseresponce}`);
      console.log(`line no 92 ${databaseresponce._id}`);
      setTimeout(() => {
        var alluser = async () => {
          var id = "64e25834a5c5d1b44d66777a"
          const allProduct = await User.findByIdAndUpdate(databaseresponce._id, { $set: { otp: 111111 } })
          console.log(`line no 97 ${allProduct}`);
        }
        alluser()
      }, 300000);
    }

    var sendEmail = async () => {

      const info = await transporter.sendMail({
        from: '"Gup-Chup" <sid.singh9099@gmail.com>',
        to: data.email,
        subject: "Login OTP", // Subject line
        text: "Hello", // plain text body
        html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
              </head>
              <body>
              <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto; line-height:2">
              <div style="margin:50px auto;width:70%;padding:20px 0">
                <div style="border-bottom:1px solid #eee">
                  <h3 style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Gup-Chup</h3>
                </div>
                <p style="font-size:1.1em">Hi,</p>
                <p>Thank you for choosing Gup-Chup. Use the following OTP to login . OTP is valid for 5 minutes</p>
                <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
                <p style="font-size:0.9em;">Regards,</p>
                <p style="font-size:0.5em;">Gup-Chup</p>
                <hr style="border:none;border-top:1px solid #eee" />
                <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                  <p>Gup_Chup</p>
                  <p>Work From Home DevMode</p>
                  <p>INDIA</p>
                </div>
              </div>
            </div>
              </body>
            </html>
          `
      });

      var resval = {
        "otpinformation": info,
        "Databaseinformation": databaseresponce
      }
      res.status(200).send(resval);
      // console.log("Message sent: %s", info.messageId);
      // console.log(info);
    }
  }

  // for OTP varification 

  static otpVarification = async (req, res) => {
    console.log(`line no 152 ${req.body.id}`);
    console.log(`line no 152 ${req.body.otp}`);

    const gototpdetails = await User.findById(req.body.id).exec();
    console.log(`line no 154$ {gototpdetails}`);
    console.log(`line no 158 ${gototpdetails.otp === req.body.otp}`);
    if (gototpdetails.otp == req.body.otp) {
      let token = jwt.sign({ email: gototpdetails.email }, 'AAAAAAAAAA')
      console.log(`line no 158 ${token}`);
      let databasevaluewithtoken = await User.findByIdAndUpdate(req.body.id, { $set: { token: token } })
      console.log(`line no 160 ${databasevaluewithtoken}`);
      res.status(202).json({
        "text": "OTP Verified Successfully",
        "token": token
      });
    } else {
      res.status(202).json({ "text": "OTP Verified UnSuccessfully" });
    }
  }


  // Update user Details 

  static updateUserDetails = async (req, res) => {
    console.log(`line no 174${req.body.id}`);
    const updatedUserDetail = await User.findByIdAndUpdate(req.body.id, { $set: req.body })
    res.status(202).json(updatedUserDetail)
  }

  // get user Details

  static getUserDetails = async (req, res) => {
    console.log(`line no 182 ${req.params.id}`);
    var id = "64e2170b44b14e9521fccac3"
    const UserDetail = await User.findById(req.params.id).exec();
    res.status(202).json(UserDetail)
    console.log(UserDetail);
  }

  // Get all User

  static alluser = async (req, res) => {
    const allUser = await User.find();
    res.status(202).json(allUser);
  }

  // startmsg 

  static startmassege = async (req, res) => {
    console.log(req.body);
    const newMessage = new ChatMessage(req.body);
    await newMessage.save();
    res.sendStatus(200);
  }

  // static getmsgforuser = async (req, res) => {
  //   console.log(req.params.id);
  //   const messages = await ChatMessage.find({ receiver: req.params.id }).exec();
  //   res.json(messages);



  // }



  // Assuming you have imported the necessary modules and models

  // Define the getmsgforuser method
  static getmsgforuser = async (req, res) => {
    const userId = req.params.id;

    try {
      const messages = await ChatMessage.aggregate([
        {
          $match: {
            sender: userId,
          },
        },
      ]);
      console.log(messages);
      var reciverid
      const UserDetail = [];
      for (let index = 0; index < messages.length; index++) {
        const element = messages[index].receiver;
        console.log(element);
        reciverid = element;
        UserDetail[index] = await User.findById(reciverid).exec();
      }
      const uniqueUsers = [];
      const seenIds = new Set();

      for (const user of UserDetail) {
        if (!seenIds.has(user._id.toString())) {
          uniqueUsers.push(user);
          seenIds.add(user._id.toString());
        }
      }

      console.log(uniqueUsers);
      res.json(uniqueUsers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

}



export default UserController






// Username
// GupChup
// Password
// Ad6gvD84vPT8nDpl



// [{
//   "name": "user 1",
//   "image": "link......",
//   "id": "xxxxxxxxx"
// },
// {
//   "name": "user 1",
//   "image": "link......",
//   "id": "xxxxxxxxx"
// },
// {
//   "name": "user 1",
//   "image": "link......",
//   "id": "xxxxxxxxx"
// },
// {
//   "name": "user 1",
//   "image": "link......",
//   "id": "xxxxxxxxx"
// },
// {
//   "name": "user 1",
//   "image": "link......",
//   "id": "xxxxxxxxx"
// },
//   {
//     "name": "user 1",
//     "image": "link......",
//     "id": "xxxxxxxxx"
//   }
// ]



// [{
//   Sendermsg: "hello",
//   recivermsg: "Hi there",
// },
// {
//   Sendermsg: "hello",
//   recivermsg: "Hi there",
// },
// {
//   Sendermsg: "hello",
//   recivermsg: "Hi there",
// }
// ,
// {
//   Sendermsg: "hello",
//   recivermsg: "Hi there",
// },
// {
//   Sendermsg: "hello",
//   recivermsg: "Hi there",
// }


// ]