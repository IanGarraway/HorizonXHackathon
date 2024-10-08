import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// import User from '../models/User.model.js';

export default class AccountService {
  login = async ({ username, password }) => {
    try {
      let user = { name: username };
      if (username == "demoUser") {
        if (password == "demoPass") {
          const token = jwt.sign(
            {
              id: username,
              username: username,
              admin: false,
            },
            process.env.SECRET,
            {
              expiresIn: 86400,
            }
          );
          user.token = token;
        }
      } else if (username == "demoAdmin") {
        if (password == "demoPass") {
          const token = jwt.sign(
            {
              id: username,
              username: username,
              admin: true,
            },
            process.env.SECRET,
            {
              expiresIn: 86400,
            }
          );
          user.token = token;
          c;
        }
      } else {
        console.log("error");
        throw new Error("Invalid Login details");
      }

      return user;
    } catch (e) {
      console.log(e.message);
    }

    // const user = await User.findOne({ userName: username.toLowerCase() });

    // if (!user) { throw new Error("Invalid Login details"); }

    // const passwordMatches = await bcrypt.compare(password, user.userPassword);

    // if (passwordMatches) {
    //     const token = jwt.sign({
    //         id: user._id,
    //         username: user.userName,
    //         admin: user.admin
    //     }, process.env.SECRET, {
    //         expiresIn: 86400,
    //     });
    //     user.Token = token;

    //     return user;
    // } else {
    //     throw new Error("Invalid login details");
    // }
  };

  changePassword = async (req) => {
    // const { oldpassword, newpassword } = req.body;
    // const user = await User.findOne({ _id: req.userId });
    // if (!user) { throw new Error("Invalid Login details"); }
    // const passwordMatches = await bcrypt.compare(oldpassword, user.userPassword);
    // if (passwordMatches) {
    //     user.userPassword = bcrypt.hashSync(newpassword, 10);
    //     await user.save();
    //     return user;
    // } else {
    //     throw new Error("Error changing password");
    // }
  };

  deleteAccount = async (req) => {
    // const { password } = req.body;
    // const user = await User.findOne({ _id: req.userId });
    // if (!user) { throw new Error("Invalid Login details"); }
    // const passwordMatches = await bcrypt.compare(password, user.userPassword);
    // if (passwordMatches) {
    //     await user.deleteOne();
    //     return user;
    // } else {
    //     throw new Error("Error deleting account");
    // }
  };
}
