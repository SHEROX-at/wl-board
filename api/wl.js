export default async function handler(req, res) {
  const rbl = "602009";

  try {
    const response = await fetch(
      `https://www.wienerlinien.at/ogd_realtime/monitor?rbl=${rbl}`
    );

    const data = await response.json();

    // wenn realtime leer → fallback auf geplante Zeiten
    if (!data.data.monitors || data.data.monitors.length === 0) {

      const fallback = await fetch(
        `https://www.wienerlinien.at/ogd_realtime/monitor?rbl=${rbl}&activateTrafficInfo=0`
      );

      const fallbackData = await fallback.json();

      return res.status(200).json(fallbackData);
    }

    res.status(200).json(data);

  } catch (e) {
    res.status(500).json({ error: "fail" });
  }
}
