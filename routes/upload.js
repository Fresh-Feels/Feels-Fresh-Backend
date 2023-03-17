const cloudinary = require("cloudinary").v2;
const router = require("express").Router();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_KEY_SECRET,
});

router.route("/image").post(async (req, res) => {
  const { type } = req.body;
  const filetypes = /jpg|jpeg|png/;
  console.log(type);

  if (!type.toLowerCase().toString().match(filetypes)) {
    console.log("Images Only");
    return res
      .status(400)
      .json({ errors: [{ msg: "Images Only", status: false }] });
  }

  try {
    const data = req.body.data;
    const result = await cloudinary.uploader.upload(data, {
      upload_preset: "ml_default",
    });
    return res.status(200).json({
      msg: "Image Uploaded",
      image: result.secure_url,
      status: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: error });
  }
});

module.exports = router;
