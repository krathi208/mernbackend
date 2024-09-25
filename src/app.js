const express = require('express');
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcrypt");
const { body, validationResult } = require('express-validator');

require("./db/conn");
const User = require("./models/user");

const app = express();
const port = process.env.PORT || 3001;

const static_path = path.join(__dirname, "../public");
const templates_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files
app.use(express.static(static_path));

// Set the view engine
app.set("view engine", "hbs");
app.set("views", templates_path);
hbs.registerPartials(partials_path);

// Routes
app.get("/", (req, res) => {
    res.render("index");
});
app.get("/map", (req, res) => {
    res.render("map");
});

app.get("/registration", (req, res) => {
    res.render("registration");
});

// Create a new user in the db
app.post("/user", 
    // Validation rules
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Invalid email format'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        body('confirmPassword').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
        body('dob').notEmpty().withMessage('Date of birth is required')
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password, dob } = req.body;

        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(401).json({ message: "Email already exists" });
            }

            // Hash the password before saving
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await User.create({
                name,
                email,
                password: hashedPassword,
                dob
            });

            return res.status(201).json({message:"User created"});
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
);

app.listen(port, () => {
    console.log(`Server is running at port no ${port}`);
});