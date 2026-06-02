/**
 * keepAlive.js
 * Pings the app's own /api/health endpoint every 14 minutes so the Render
 * free-tier instance never hits the 15-minute inactivity sleep threshold.
 * Only runs in production to avoid noisy dev logs.
 */

const INTERVAL_MS = 14 * 60 * 1000; // 14 minutes

export const startKeepAlive = (serverUrl) => {
	if (process.env.NODE_ENV !== "production") return;
	if (!serverUrl) {
		console.warn("⚠️  keepAlive: RENDER_EXTERNAL_URL not set — skipping keep-alive pings.");
		return;
	}

	const url = `${serverUrl}/api/health`;

	const ping = async () => {
		try {
			const res = await fetch(url);
			console.log(`Keep-alive ping → ${url} [${res.status}]`);
		} catch (err) {
			console.error(`Keep-alive ping failed: ${err.message}`);
		}
	};

	// First ping shortly after startup, then on the regular interval
	setTimeout(ping, 5000);
	setInterval(ping, INTERVAL_MS);

	console.log(`Keep-alive scheduler started (every ${INTERVAL_MS / 60000} min) → ${url}`);
};
