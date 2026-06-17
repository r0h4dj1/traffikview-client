import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
    throw new Error("FATAL ERROR: JWT_SECRET is not defined in production.");
}
const SECRET_KEY = process.env.JWT_SECRET || "fallback_secret_key_if_env_missing";
let db;

async function initialiseDatabase() {
    try {
        db = await open({
            filename: './database.sqlite',
            driver: sqlite3.Database
        });

        await db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS searches (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                query TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Database initialised");
    } catch (error) {
        console.error("Database initialisation error:", error);
    }
}

// Run database initialisation on server start
initialiseDatabase();


// Signup endpoint
app.post("/api/signup", async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await db.get(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const result = await db.run(
            "INSERT INTO users (email, password) VALUES (?, ?)",
            [email, hashedPassword]
        );

        const token = jwt.sign(
            { userId: result.lastID },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        res.status(201).json({ token });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Login endpoint
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await db.get(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user.id },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        res.json({ token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Middleware to authenticate users
const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ message: "No token, authorisation denied" });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token is not valid" });
    }
};

// Save a search
app.post("/api/search", authMiddleware, async (req, res) => {
    const { query } = req.body;
    const userId = req.userId;

    try {
        await db.run(
            "INSERT INTO searches (user_id, query) VALUES (?, ?)",
            [userId, query]
        );

        res.status(201).json({ message: "Search saved" });
    } catch (error) {
        console.error("Save search error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Get the last 5 searches for the authenticated user
app.get("/api/searches", authMiddleware, async (req, res) => {
    const userId = req.userId;

    try {
        const searches = await db.all(
            "SELECT query FROM searches WHERE user_id = ? ORDER BY timestamp DESC LIMIT 5",
            [userId]
        );

        res.json(searches.map(row => row.query));
    } catch (error) {
        console.error("Get searches error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
