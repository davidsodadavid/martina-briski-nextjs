const API_KEY = process.env.MAILERLITE_API_KEY;
const GROUP_ID = process.env.MAILERLITE_GROUP_ID;

/** Adds (or updates) a subscriber in MailerLite. Silently does nothing if
 * MAILERLITE_API_KEY isn't configured, so local/dev setups without it don't
 * break the newsletter form — only logs on actual API failure. */
export async function addMailerliteSubscriber(
  email: string,
  name?: { firstName: string; lastName: string }
) {
  if (!API_KEY) return;

  try {
    const res = await fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        email,
        ...(name
          ? { fields: { name: name.firstName, last_name: name.lastName } }
          : {}),
        ...(GROUP_ID ? { groups: [GROUP_ID] } : {}),
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`MailerLite subscribe failed (${res.status}): ${body}`);
    }
  } catch (err) {
    console.error("MailerLite subscribe request failed:", err);
  }
}
