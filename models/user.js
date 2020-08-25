const mongoose = require('mongoose');

const multer = require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/uploads/users/avatars');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    avatar: {
      type: String
    },
    friendships: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Friendship'
      }
    ]
  },
  {
    // timestamps add 'created at' & 'updated at'
    timestamps: true
  }
);

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // __dirname = models (current directory)
    // .. signifies two levels up
    // AVATAR_PATH = /uploads/users/avatar
    cb(null, path.join(__dirname, '..', AVATAR_PATH));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now()); // Date.now() for unique filename
  }
});

// Static methods (to be made publicly/globally available):
// .single('avatar') means only one file will be uploaded for the fieldname 'avatar'
userSchema.statics.uploadedAvatar = multer({ storage: storage }).single(
  'avatar'
);
userSchema.statics.avatarPath = AVATAR_PATH;

const User = mongoose.model('User', userSchema);

module.exports = User;
