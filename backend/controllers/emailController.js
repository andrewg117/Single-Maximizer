const Email = require("../models/emailModel");
const Track = require("../models/trackModel");
const User = require("../models/userModel");
const Audio = require("../models/audioModel");
const Image = require("../models/imageModel");
const asyncHandler = require("express-async-handler");
const { sendMail } = require("../utils/mailer");
// TODO: Get email list for EMAILTO
const EMAILTO = process.env.EMAILTO;
const EMAILUSER = process.env.EMAILUSER;

// Attach the track's audio, cover, and press files stored in MongoDB
const getAttachments = async (singleDoc) => {
  // Filter by owner too, so only the artist's own files are ever attached
  const query = { trackID: singleDoc._id, user: singleDoc.user };
  const audio = await Audio.findOne(query);
  const images = await Image.find(query).sort({ section: 1 });

  return [audio, ...images]
    .filter((doc) => doc?.file?.buffer)
    .map((doc) => ({
      filename: doc.file.originalname,
      // Mixed fields come back as BSON Binary, not Buffer
      data: Buffer.isBuffer(doc.file.buffer)
        ? doc.file.buffer
        : doc.file.buffer.value(true),
    }));
};

// General email
const generalEmail = async (singleDoc, subjectType) => {
  let emailContent;

  const userDoc = await User.findById(singleDoc.user);
  emailContent = `<p>Artist: ${singleDoc.artist || ""}</p>`;

  emailContent += `<p>Featured Artist(s): ${singleDoc.features || ""}</p>`;
  emailContent += `<p>Song: ${singleDoc.trackTitle || ""}</p>`;
  emailContent += `<p>Producer: ${singleDoc.producer || ""}</p>`;
  emailContent += `<p>Album: ${singleDoc.album || ""}</p>`;
  emailContent += `<p>Album Release Date: ${
    singleDoc.albumDate
      ?.toLocaleString("default", { timeZone: "UTC" })
      .split(",")[0] || ""
  }</p>`;
  emailContent += `<p>Label: ${singleDoc.trackLabel || ""}</p>`;
  emailContent += `<br><br>`;
  emailContent += `<p>Bio: </p><p>${userDoc.bio_text || ""}</p>`;
  emailContent += `<br>`;
  emailContent += `<p>Website: ${userDoc.website || ""}</p>`;
  emailContent += `<p>Twitter: ${userDoc.twitter || ""}</p>`;
  emailContent += `<p>Facebook: ${userDoc.fbook || ""}</p>`;
  emailContent += `<br>`;
  emailContent += `<p>Soundcloud: ${singleDoc.scloud || ""}</p>`;
  emailContent += `<p>YouTube: ${singleDoc.ytube || ""}</p>`;

  let subjectLine;
  switch (subjectType) {
    case "default":
      subjectLine = `${singleDoc.artist} - ${singleDoc.trackTitle}`;
      break;
    case "Mizfitz":
      subjectLine = `Artist Music Submission - ${singleDoc.artist}`;
      break;
    case "Hop Nation":
      subjectLine = `Podcast Music Submission: ${singleDoc.artist} - ${singleDoc.trackTitle}`;
      break;
    case "Brooklyn Radio":
      subjectLine = `Music Submission: ${singleDoc.artist} - ${singleDoc.trackTitle}`;
  }

  // setup email data with unicode symbols
  const mailOptions = {
    from: '"TRACKSTARZ" ' + EMAILUSER, // sender address
    to: userDoc.email, // list of receivers
    // to: EMAILTO, // list of receivers
    // bcc: userDoc.email,
    subject: subjectLine, // Subject line
    html: emailContent, // html body
    attachment: await getAttachments(singleDoc),
  };

  sendMail(mailOptions)
    .then(async (msg) => {
      console.log(msg);

      const updatedTrack = await Track.findByIdAndUpdate(
        singleDoc.id,
        { isDelivered: true },
        {
          new: true,
        }
      );
    })
    .catch((err) => console.log(err));
};

// Alternate email
const altEmail = async (singleDoc, subjectType) => {
  const userDoc = await User.findById(singleDoc.user);

  let emailContent = `<p>Artist: ${singleDoc.artist || ""}</p>`;
  emailContent += `<br>`;
  emailContent += `<p>Song: ${singleDoc.trackTitle || ""}</p>`;
  emailContent += `<br>`;
  emailContent += `<p>Featured: ${singleDoc.features || ""}</p>`;
  emailContent += `<br>`;
  emailContent += `<p>Producer: ${singleDoc.producer || ""}</p>`;
  emailContent += `<br>`;
  emailContent += `<p>Album: ${singleDoc.album || ""}</p>`;
  emailContent += `<br>`;
  emailContent += `<p>Twitter: ${userDoc.twitter || ""}</p>`;
  emailContent += `<br>`;
  emailContent += `<p>Spotify Link: ${userDoc.spotify || ""}</p>`;
  emailContent += `<br>`;
  emailContent += `<br>`;
  emailContent += `<p>Bio: </p><p>${userDoc.bio_text || ""}</p>`;

  let subjectLine;
  switch (subjectType) {
    case "Rapzilla":
      subjectLine = `New Stream: ${singleDoc.artist} - ${singleDoc.trackTitle}`;
      break;
    case "KDHX":
      subjectLine = `Digital Submission - ${singleDoc.artist} - ${singleDoc.trackTitle}`;
  }

  // setup email data with unicode symbols
  const mailOptions = {
    from: '"TRACKSTARZ" ' + EMAILUSER, // sender address
    to: EMAILTO, // list of receivers
    bcc: userDoc.email,
    subject: subjectLine, // Subject line
    html: emailContent, // html body
    attachment: await getAttachments(singleDoc),
  };

  sendMail(mailOptions)
    .then(async (msg) => {
      console.log(msg);

      // const updatedTrack = await Track.findByIdAndUpdate(singleDoc.id, { isDelivered: true }, {
      //   new: true
      // })
    })
    .catch((err) => console.log(err));
};

// @desc    Send Scheduled Email
const sendScheduledEmail = async () => {
  // Updates tracks to be delivered
  // COMPLETE: Fix delivery time
  // Server time changed from UTC to EST

  const curDate = new Date();
  curDate.setUTCHours(23, 59, 59, 999);

  let tracks;
  try {
    tracks = await Track.find({
      deliveryDate: { $lt: curDate },
      isDelivered: false,
    });
  } catch (err) {
    console.error(err);
    return;
  }

  for (const track in tracks) {
    const singleDoc = tracks[track];

    // Catch here so one failed delivery can't crash the server
    generalEmail(singleDoc, "default").catch((err) => console.error(err));
    // generalEmail(singleDoc, 'Mizfitz')
    // generalEmail(singleDoc, 'Hop Nation')
    // generalEmail(singleDoc, 'Brooklyn Radio')
    // altEmail(singleDoc, 'Rapzilla')
    // altEmail(singleDoc, 'KDHX')
  }
};

// @desc    Send Email
// @route   POST /api/send
// @access  Private
const sendEmail = asyncHandler(async (req, res) => {
  if (!req.body.recipient) {
    res.status(400);
    throw new Error("Add recipient");
  } else if (!req.body.subject) {
    res.status(400);
    throw new Error("Add subject");
  } else if (!req.body.emailMessage) {
    res.status(400);
    throw new Error("Add message");
  }

  const email = await Email.create({
    recipient: req.body.recipient,
    subject: req.body.subject,
    emailMessage: req.body.emailMessage,
    user: req.user.id,
    trackID: req.body.trackID,
    deliveryDate: req.body.deliveryDate,
  });

  // setup email data with unicode symbols
  const mailOptions = {
    from: '"TRACKSTARZ" ' + EMAILUSER, // sender address
    to: req.body.recipient, // list of receivers
    subject: req.body.subject, // Subject line
    text: req.body.emailMessage, // plain text body
    html: `<p>${req.body.emailMessage}</p>`, // html body
  };

  sendMail(mailOptions)
    .then((msg) => console.log(msg))
    .catch((err) => console.log(err));

  res.status(200).json(email);
});

module.exports = {
  sendEmail,
  sendScheduledEmail,
};
