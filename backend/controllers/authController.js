const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require("dotenv").config();

exports.signup = async (req, res) => {  
    const { firstName, lastName, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: { firstName, lastName, username, password: hashedPassword },
        });
        return res.status(201).json({ message: "User created", user });
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({
        where: { username },
    });

    if (!user) return res.status(400).json({ message: "User not found" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign({ id: user.id, membershipStatus: user.membershipStatus, isAdmin: user.isAdmin },
        process.env.JWT_SECRET, { expiresIn: "1h" }
    );

    return res.json({ token });
};

exports.joinClub = async (req, res) => {
    const { passcode } = req.body;
    if (passcode !== process.env.CLUB_PASSCODE) {
        return res.status(403).json({ message: "Invalid passcode" });
    }

    await prisma.user.update({
        where: { id: req.user.id },
        data: {
            membershipStatus: true
        },
    });

    return res.json({ message: "Membership granted" });
};

exports.becomeAdmin = async (req, res) => {
    const { passcode } = req.body;
    if (passcode !== process.env.ADMIN_PASSCODE) {
        return res.status(403).json({ message: "Invalid admin passcode" });
    }

    await prisma.user.update({
        where: { id: req.user.id },
        data: {isAdmin: true},
    });

    return res.json({ message: "Admin privileges granted" });
};