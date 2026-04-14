export const joinKeyboard = {
  inline_keyboard: [
    [
      {
        text: "Join Main Channel",
        url: "https://t.me/zareearn",
      },
    ],
    [{ text: "Joined", callback_data: "joined_check" }],
  ],
};

export function dashboardKeyboard(isAdmin = false) {
  const rows = [
    [{ text: "Start Earning", callback_data: "start_earning" }],
    [{ text: "Balance", callback_data: "balance" }],
    [{ text: "Withdraw", callback_data: "withdraw" }],
    [{ text: "Refer Friends", callback_data: "refer" }],
    [{ text: "Support", callback_data: "support" }],
  ];

  if (isAdmin) {
    rows.push([{ text: "Admin Panel", callback_data: "admin_panel" }]);
  }

  return { inline_keyboard: rows };
}
