import Wallet from "../models/Wallet.js";

// GET OR CREATE USER WALLET
export const getOrCreateWallet = async (userId) => {
  let wallet = await Wallet.findOne({
    user: userId,
  });

  if (!wallet) {
    wallet = await Wallet.create({
      user: userId,
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
  returnId = null
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