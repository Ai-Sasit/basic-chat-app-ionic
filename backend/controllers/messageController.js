const Messages = require("../models/messageModel");

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ createdAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        id: msg._id.toString(),
        fromSelf: msg.sender.toString() === from,
        isRead: msg.isRead,
        message: msg.message.text,
        date: msg.createdAt,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      isRead: false,
      sender: from,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};

module.exports.markAsRead = async (req, res, next) => {
  try {
    const { messageId } = req.body;
    await Messages.updateOne(
      { _id: messageId, fromSelf: false },
      { $set: { isRead: true } }
    );
    res.json("Message marked as read");
  } catch (ex) {
    next(ex);
  }
};
