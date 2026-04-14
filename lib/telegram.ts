const TOKEN = process.env.BOT_TOKEN!;
const API = `https://api.telegram.org/bot${TOKEN}`;

export async function sendMessage(
  chatId: number,
  text: string,
  reply_markup?: any
) {
  await fetch(`${API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      reply_markup,
    }),
  });
}

export async function editMessage(
  chatId: number,
  messageId: number,
  text: string,
  reply_markup?: any
) {
  await fetch(`${API}/editMessageText`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      message_id: messageId,
      text,
      parse_mode: "HTML",
      reply_markup,
    }),
  });
}

export async function checkMembership(userId: number) {
  const channel = process.env.CHANNEL_USERNAME!;
  const res = await fetch(
    `${API}/getChatMember?chat_id=${channel}&user_id=${userId}`
  );
  const data = await res.json();
  return ["member", "administrator", "creator"].includes(
    data?.result?.status
  );
}
