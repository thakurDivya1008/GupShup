

import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public"); // save files in /public directory
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // ✅ Correct property access
  },
});

export const upload = multer({ storage });
