export const uploadImageToCloudinary = async (req, res) => {
    try {
      const filePath = req.file.path; // Cloudinary auto-handles the upload
  
      if (!filePath) {
        return res.status(400).json({ message: "Upload failed" });
      }
  
      res.status(200).json({ url: filePath }); // Cloudinary returns the full URL
    } catch (error) {
      console.error("Upload Error:", error);
      res.status(500).json({ message: error.message });
    }
  };
  