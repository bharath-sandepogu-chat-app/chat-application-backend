const { default: mongoose } = require("mongoose");
const { Message } = require("../models/message.model");

const createMessage = async (messageToInsert) => {
  const createdMessageData = await Message.create(messageToInsert);
  return createdMessageData;
};

const updateMessageStatus = async (messageId, status) => {
  const updatedMessage = await Message.findByIdAndUpdate(
    messageId,
    { messageStatus: status },
    { new: true }
  );

  return updatedMessage;
};

const updateAllUnReadMessageStatus = async (from, to, status) => {
  const updatedMessages = await Message.updateMany(
    { from, to },
    { messageStatus: status },
    { new: true }
  );
  return updatedMessages;
};

const recentChatsWithMessages = async (userId) => {
  const convertedUserId = new mongoose.Types.ObjectId(userId);

  const pipeline = [
    {
      $match: {
        $or: [
          {
            from: convertedUserId,
          },
          {
            to: convertedUserId,
          },
        ],
      },
    },
    // Sort messages by timestamp in descending order
    {
      $sort: {
        timestamp: -1,
      },
    },
    // Group messages by the other participant in the conversation
    {
      $group: {
        _id: {
          $cond: {
            if: {
              $eq: ["$from", convertedUserId],
            },
            then: "$to",
            else: "$from",
          },
        },
        messages: {
          $push: {
            content: "$content",
            timestamp: "$timestamp",
            messageStatus: "$messageStatus",
            from: "$from",
            to: "$to",
            _id: "$_id",
          },
        },
        lastMessageTimestamp: {
          $first: "$timestamp",
        },
        unreadCount: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $ne: ["$from", convertedUserId],
                  },
                  {
                    $ne: ["$messageStatus", "read"],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
        totalMessages: {
          $sum: 1,
        },
      },
    },
    // lookup to userSchema to get userDetails
    {
      $lookup: {
        from: "users",
        let: { userId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$userId"] },
            },
          },
          {
            $project: {
              friendList: 0,
            },
          },
        ],
        as: "userDetails",
      },
    },
    // get userDetails as object from array
    {
      $unwind: "$userDetails",
    },
    // limit number of messages and add some more fields
    {
      $addFields: {
        messages: {
          $slice: ["$messages", 0, 20],
        },
        totalRemainingMessages: { $subtract: ["$totalMessages", 20] },
        hasMoreMessages: {
          $cond: [{ $gt: ["$totalMessages", 20] }, true, false],
        },
      },
    },
    // limit no of fields
    {
      $project: {
        totalMessages: 0,
        totalRemainingMessages: 0,
      },
    },
  ];

  const recentChats = await Message.aggregate(pipeline);

  return recentChats;
};

const moreMessagesFromUser = async (messageId, from, to) => {
  const convertedFrom = new mongoose.Types.ObjectId(from);
  const convertedTo = new mongoose.Types.ObjectId(to);
  const convertedMessageId = new mongoose.Types.ObjectId(messageId);

  const pipeline = [
    {
      $match: {
        $and: [
          {
            $or: [
              {
                from: convertedFrom,
                to: convertedTo,
              },
              {
                from: convertedTo,
                to: convertedFrom,
              },
            ],
          },
          {
            _id: {
              $lt: convertedMessageId,
            },
          },
        ],
      },
    },
    // Sort messages by timestamp in descending order
    {
      $sort: {
        timestamp: -1,
      },
    },
    // limit to size + 1 in order to check if has more messages
    {
      $limit: 21,
    },
    // group to object with messages and totalMessages fields
    {
      $group: {
        _id: null,
        messages: {
          $push: "$$ROOT",
        },
        totalMessages: {
          $sum: 1,
        },
      },
    },
    // limit no of fields to return in resulted documents
    {
      $project: {
        _id: 0,
        messages: { $slice: ["$messages", 0, 20] },
        hasMoreMessages: {
          $gt: ["$totalMessages", 20],
        },
      },
    },
  ];

  const moreMessagesArr = await Message.aggregate(pipeline);
  return moreMessagesArr[0];
};

module.exports = {
  createMessage,
  updateMessageStatus,
  updateAllUnReadMessageStatus,
  recentChatsWithMessages,
  moreMessagesFromUser,
};
