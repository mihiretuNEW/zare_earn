import { redis } from "@/lib/redis";
import { sendMessage, checkMembership } from "@/lib/telegram";
import { joinKeyboard, dashboardKeyboard } from "@/lib/keyboard";

const ADMIN_ID = Number(process.env.ADMIN_ID);

export async function POST(req: Request) {
  const update = await req.json();

  if (update.message) {
    const msg = update.message;
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const username = msg.from.username || "NoUsername";
    const text = msg.text || "";

    await redis.hset(`user:${userId}`, {
      username,
      id: userId,
    });

    if (text.startsWith("/start")) {
      await sendMessage(
        chatId,
        `👋 Welcome to <b>ZareEarn</b>\n\nPlease join our main channel before accessing your dashboard.`,
        joinKeyboard
      );
    }
  }

  if (update.callback_query) {
    const q = update.callback_query;
    const userId = q.from.id;
    const chatId = q.message.chat.id;
    const data = q.data;

    const isAdmin = userId === ADMIN_ID;

    if (data === "joined_check") {
      const joined = await checkMembership(userId);

      if (!joined) {
        await sendMessage(
          chatId,
          `❌ You must join the main channel first.`,
          joinKeyboard
        );
        return Response.json({ ok: true });
      }

      await sendMessage(
        chatId,
        `🎉 Welcome to your dashboard.\nChoose an option below.`,
        dashboardKeyboard(isAdmin)
      );
    }

    if (data === "balance") {
      const points = (await redis.get(`balance:${userId}`)) || 0;
      const usd = Number(points) / 1000;

      await sendMessage(
        chatId,
        `💰 Your current balance: <b>${points} pts</b>\nEquivalent: <b>$${usd.toFixed(
          2
        )}</b>\n\n100 pts = $0.10`
      );
    }

    if (data === "refer") {
      const bot = process.env.BOT_USERNAME;
      const link = `https://t.me/${bot}?start=ref_${userId}`;

      await sendMessage(
        chatId,
        `👥 Invite friends and earn rewards.\n\nYour unique referral link:\n${link}\n\nReward per valid referral: 50 pts ($0.05)`
      );
    }

    if (data === "withdraw") {
      const points = Number((await redis.get(`balance:${userId}`)) || 0);

      if (points < 2000) {
        await sendMessage(
          chatId,
          `❌ Minimum withdrawal is <b>$2.00</b> (2000 pts).`
        );
      } else {
        await redis.set(`state:${userId}`, "awaiting_telebirr");
        await sendMessage(
          chatId,
          `💳 Please send your Telebirr phone number.\nMinimum withdrawal: $2`
        );
      }
    }

    if (data === "admin_panel" && isAdmin) {
      await sendMessage(
        chatId,
        `🛠 Admin Panel\n\nUse commands:\n/settasklink\n/setsupportlink`
      );
    }
  }

  return Response.json({ ok: true });
}
