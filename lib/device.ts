export function getDeviceIdentity() {
	if (typeof window === 'undefined')
		return null;
	const key = 'skelpass-device-id';
	let deviceId = window.localStorage.getItem(key);
	if (!deviceId) {
		deviceId = crypto.randomUUID();
		window.localStorage.setItem(key, deviceId);
	}
	const ua = navigator.userAgent;
	const browser = /Edg\//.test(ua)
		? 'Microsoft Edge'
		: /Chrome\//.test(ua)
			? 'Google Chrome'
			: /Firefox\//.test(ua)
				? 'Mozilla Firefox'
				: /Safari\//.test(ua) && !/Chrome\//.test(ua)
					? 'Safari'
					: 'Browser';
	const os = /Windows NT/.test(ua)
		? 'Windows'
		: /Mac OS X/.test(ua)
			? 'macOS'
			: /Android/.test(ua)
				? 'Android'
				: /iPhone|iPad/.test(ua)
					? 'iOS'
					: /Linux/.test(ua)
						? 'Linux'
						: 'Unknown OS';
	const deviceName = os === 'Windows' ? `${browser} on Windows` : `${browser} on ${os}`;
	return { deviceId, browser, os, deviceName };
}
