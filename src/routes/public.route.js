import express from "express";

const router = express.Router();

const getHealth = async (req, res) => {
  try {
    res.json({
      status: true,
      message: "App working fine",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

router.get("/health", getHealth);
export default router;
