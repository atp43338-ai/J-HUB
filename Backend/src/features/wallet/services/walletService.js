import mongoose from "mongoose";
import Wallet from "../models/Wallet.js";

// CREDIT USER WALLET (ATOMIC & RESILIENT)
export const creditUserWallet = async (targetUserId, amount, description) => {
  try {
    const uId = new mongoose.Types.ObjectId(targetUserId);

    // Identify whether schema uses 'user' or 'userId'
    const sampleWallet = await Wallet.findOne({});
    const userKey = (sampleWallet && "userId" in sampleWallet) ? "userId" : "user";

    const query = {
      $or: [
        { [userKey]: uId },
        { user: uId },
        { userId: uId },
      ],
    };

    let wallet = await Wallet.findOne(query);

    if (!wallet) {
      wallet = new Wallet({
        [userKey]: uId,
        user: uId,
        userId: uId,
        balance: 0,
        transactions: [],
      });
    }

    // Perform numerical increment and append transaction
    wallet.balance = Number((Number(wallet.balance || 0) + Number(amount)).toFixed(2));

    wallet.transactions.unshift({
      amount: Number(amount),
      type: "credit",
      reason: description,
      description: description,
      date: new Date(),
      status: "Completed",
    });

    await wallet.save();
    return wallet;
  } catch (err) {
    console.error(`Failed to credit wallet for user ${targetUserId}:`, err);
    throw err;
  }
};

// GET OR CREATE USER WALLET
export const getOrCreateWallet = async (userId) => {
  const uId = new mongoose.Types.ObjectId(userId);
  const sampleWallet = await Wallet.findOne({});
  const userKey = (sampleWallet && "userId" in sampleWallet) ? "userId" : "user";

  let wallet = await Wallet.findOne({
    $or: [{ [userKey]: uId }, { user: uId }, { userId: uId }],
  });

  if (!wallet) {
    wallet = await Wallet.create({
      [userKey]: uId,
      user: uId,
      userId: uId,
      balance: 0,
      transactions: [],
    });
  }

  return wallet;
};

// GET WALLET
export const getWallet = async (userId) => {
  const wallet = await getOrCreateWallet(userId);

  return wallet;
};


// ADD MONEY TO WALLET
export const addMoneyToWallet = async (
  userId,
  amount,
  reason,
  orderId = null,
  returnId = null,
  description = null
) => {
  if (!amount || amount <= 0) {
    throw new Error("Invalid wallet amount");
  }

  const wallet = await getOrCreateWallet(userId);

  // PREVENT DUPLICATE RETURN REFUND
  if (returnId) {
    const existingRefund = wallet.transactions.find(
      (transaction) =>
        transaction.returnRequest &&
        transaction.returnRequest.toString() ===
          returnId.toString() &&
        transaction.type === "credit"
    );

    if (existingRefund) {
      throw new Error(
        "Refund has already been added to wallet"
      );
    }
  }

  // ADD MONEY
  wallet.balance += Number(amount);

  // CREATE TRANSACTION
  wallet.transactions.push({
    type: "credit",
    amount: Number(amount),
    reason,
    description: description || reason,
    date: new Date(),
    order: orderId,
    returnRequest: returnId,
  });

  await wallet.save();

  return wallet;
};


// REMOVE MONEY FROM WALLET
export const deductMoneyFromWallet = async (
  userId,
  amount,
  reason,
  orderId = null
) => {
  if (!amount || amount <= 0) {
    throw new Error("Invalid wallet amount");
  }

  const wallet = await getOrCreateWallet(userId);

  if (wallet.balance < amount) {
    throw new Error("Insufficient wallet balance");
  }

  wallet.balance -= Number(amount);

  wallet.transactions.push({
    type: "debit",
    amount: Number(amount),
    reason,
    order: orderId,
    returnRequest: null,
  });

  await wallet.save();

  return wallet;
};