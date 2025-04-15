const cloudinary = require("../config/cloudinary");
const stream = require("stream");

const uploadImage = async (req, res) => {
  try {
    const file = req.file;
    const folder = req.body.folder || "general"; // default folder

    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const bufferStream = new stream.PassThrough();
    bufferStream.end(file.buffer);

    bufferStream.pipe(
      cloudinary.uploader.upload_stream(
        { folder }, // categoryImage / productImage
        (error, result) => {
          if (error) {
            return res.status(500).json({ message: "Upload error", error });
          }

          res.status(200).json({ imageUrl: result.secure_url });
        }
      )
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

module.exports = { uploadImage };
