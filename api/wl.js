export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://www.wienerlinien.at/ogd_realtime/monitor?rbl=602009"
    );

    const data = await response.json();

    res.status(200).json(data);

  } catch (e) {
    res.status(500).json({ error: "fail" });
  }
}
