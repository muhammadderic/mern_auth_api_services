import express from "express";
const router = express.Router();

router.post("/", (req, res) => {
  res.json("Hello Deric");
});

export default router;