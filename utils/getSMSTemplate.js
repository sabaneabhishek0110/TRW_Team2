// utils/getSMSTemplate.js
export function getSMSTemplate(type, data) {
  const time = new Date().toLocaleTimeString();

  switch (type) {
    case "highPressure":
      return `🚨 ALERT: Machine pressure too high! (${data.value} psi at ${time})`;

    case "highTemp":
      return `🔥 ALERT: Machine overheating! (${data.value}°C at ${time})`;

    case "lowUnits":
      return `⚠️ ALERT: Low production detected! Only ${data.value} unit(s) at ${time}`;

    case "inactive":
      return `⏸️ ALERT: No production for 30+ sec as of ${time}`;

    default:
      return `⚠️ ALERT: Unknown machine event at ${time}`;
  }
}
