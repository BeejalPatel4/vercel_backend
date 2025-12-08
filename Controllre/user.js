

const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userSignUp = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" })
        }

        let user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ error: "Email already exists" })
        }

        const hashPwd = await bcrypt.hash(password, 10)
        const newUser = await User.create({ email, password: hashPwd })

        let token = jwt.sign({ email, id: newUser._id }, process.env.SECRET_KEY, { expiresIn: "1h" })

        return res.status(201).json({ token, user: newUser })
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        let user = await User.findOne({ email });

        if (!user) {
            console.log("User not found:", email);
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log("Password does not match for:", email);
            return res.status(401).json({ error: "Invalid credentials" });
        }

        if (!process.env.SECRET_KEY) {
            console.error("Missing SECRET_KEY environment variable");
            return res.status(500).json({ error: "Internal Server Error" });
        }

        let token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "1h" });

        return res.status(200).json({ 
            token, 
            user: { id: user._id, email: user.email } 
        });

    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}


// const userLogin = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         if (!email || !password) {
//             return res.status(400).json({ message: "Email and password are required" });
//         }

//         let user = await User.findOne({ email })
//         if (!user || !(await bcrypt.compare(password, user.password))) {
//             return res.status(400).json({ error: "Invalid credentials" });
//         }

//         let token = jwt.sign({ email, id: user._id }, process.env.SECRET_KEY, { expiresIn: "1h" });

//         return res.status(200).json({ token, user })
//     } catch (error) {
//         return res.status(500).json({ error: "Internal Server Error" })
//     }
// }
// const userLogin = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         if (!email || !password) {
//             return res.status(400).json({ message: "Email and password are required" });
//         }

//         let user = await User.findOne({ email });
//         if (!user || !(await bcrypt.compare(password, user.password))) {
//             return res.status(401).json({ error: "Invalid credentials" });
//         }

//         let token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "1h" });

//         return res.status(200).json({ 
//             token, 
//             user: { id: user._id, email: user.email } 
//         });
//     } catch (error) {
//         return res.status(500).json({ error: "Internal Server Error" });
//     }
// }


const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }
        res.json({ email: user.email })
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

module.exports = { userLogin, userSignUp, getUser }
