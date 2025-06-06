const ChatMessage = require('../models/ChatMessage');

exports.getHistory = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const history = await ChatMessage.find({ roomId })
      .sort({ timestamp: 1 });
    res.json(history);
  } catch (err) {
    next(err);
  }
};
