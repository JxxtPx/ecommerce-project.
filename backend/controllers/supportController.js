import SupportQuery from "../models/SupportQuery.js";

export const getAllSupportQueries = async (req, res) => {
  try {
    const queries = await SupportQuery.find({})
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .populate("order", "totalPrice");

    if (!queries || queries.length === 0) {
      return res.status(404).json({ message: "No support queries found." });
    }

    res.status(200).json(queries);
  } catch (error) {
    console.error("Error fetching support queries:", error);
    res.status(500).json({ message: "Server error while fetching queries." });
  }
};

export const getMySupportQueries = async (req, res) => {
  try {
    const queries = await SupportQuery.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    if (!queries || queries.length === 0) {
      return res.status(404).json({ message: "No support queries found." });
    }

    res.status(200).json(queries);
  } catch (error) {
    console.error("Error fetching support queries:", error);
    res.status(500).json({ message: "Server error while fetching queries." });
  }
};

export const createSupportQuery = async (req, res) => {
  try {
    const { subject, order, message } = req.body;
    if (!subject || !message) {
      return res
        .status(400)
        .json({ message: "Subject and message are required." });
    }
    const newQuery = new SupportQuery({
      user: req.user._id,
      subject,
      order,
      message,
    });
    const savedQuery = await newQuery.save();
    res
      .status(201)
      .json({ message: "Query submitted successfully", query: savedQuery });
  } catch (error) {
    console.error("Error posting support queries:", error);
    res.status(500).json({ message: "Server error while posting queries." });
  }
};

export const replyToSupportQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminReply } = req.body;

    const query = await SupportQuery.findById(id);
    if (!query) {
      return res.status(404).json({ message: "Query not found" });
    }
    query.adminReply = adminReply;
    query.status = "replied";
    await query.save();

    const updatedQuery = await SupportQuery.findById(id)
      .populate("user", "name email")
      .populate("order", "totalPrice");

    res
      .status(200)
      .json({ message: "Reply sent successfully", query: updatedQuery });
  } catch (error) {
    console.error("Error replying to query:", error);
    res.status(500).json({ message: "Server error while replying" });
  }
};

export const updateSupportQueryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const query = await SupportQuery.findById(id);
    if (!query) {
      return res.status(404).json({ message: "Query not found" });
    }

    query.status = status;
    await query.save();

    // Re-fetch the updated query with population
    const updatedQuery = await SupportQuery.findById(id)
      .populate("user", "name email")
      .populate("order", "totalPrice");

      console.log("✅ Populated query:", updatedQuery); // check in terminal


    res.status(200).json({ message: "Status updated", query: updatedQuery });
  } catch (error) {
    console.error("Error replying to query:", error);
    res.status(500).json({ message: "Server error while replying" });
  }
};
