export function getEmailTemplate(type, data) {
  const timestamp = new Date().toLocaleString();

  switch (type) {
    case "highPressure":
      return {
        subject: "🚨 High Pressure Alert – Machine Exceeded 100 psi",
        html: `
              <h2 style="color: #c0392b;">🚨 High Pressure Alert</h2>
              <p>The machine has exceeded the safe pressure threshold of <strong>100 psi</strong>.</p>
              <ul>
                <li><strong>Current Pressure:</strong> ${data.value} psi</li>
                <li><strong>Timestamp:</strong> ${timestamp}</li>
              </ul>
              <p>Please investigate this issue immediately to ensure safety and prevent equipment damage.</p>
              <p>Regards,<br><strong>Automated Monitoring System <br> TRW SUNS STEERING</strong></p>
            `,
      };

    case "highTemp":
      return {
        subject: "🔥 High Temperature Alert – Machine Overheating Detected",
        html: `
              <h2 style="color: #e67e22;">🔥 High Temperature Alert</h2>
              <p>The machine's temperature has surpassed the safe limit of <strong>150°C</strong>.</p>
              <ul>
                <li><strong>Current Temperature:</strong> ${data.value}°C</li>
                <li><strong>Timestamp:</strong> ${timestamp}</li>
              </ul>
              <p>Immediate action is required to prevent system failure or hazards.</p>
              <p>Regards,<br><strong>Automated Monitoring System <br> TRW SUNS STEERING</strong></p>
            `,
      };

    case "lowUnits":
      return {
        subject: "⚠️ Low Production Warning – Output Below Threshold",
        html: `
              <h2 style="color: #f39c12;">⚠️ Low Production Alert</h2>
              <p>The machine's output has dropped below the expected level.</p>
              <ul>
                <li><strong>Units Produced:</strong> ${data.value}</li>
                <li><strong>Timestamp:</strong> ${timestamp}</li>
              </ul>
              <p>Please check the machine’s efficiency and operating conditions.</p>
              <p>Regards,<br><strong>Automated Monitoring System <br> TRW SUNS STEERING</strong></p>
            `,
      };

    case "inactive":
      return {
        subject: "⏸️ Machine Inactivity Detected – No Units Produced",
        html: `
              <h2 style="color: #3498db;">⏸️ Machine Inactivity Alert</h2>
              <p>The machine has not produced any units for over <strong>30 seconds</strong>.</p>
              <ul>
                <li><strong>Inactivity Duration:</strong> 30+ seconds</li>
                <li><strong>Timestamp:</strong> ${timestamp}</li>
              </ul>
              <p>This may indicate potential downtime or operational issues. Please investigate.</p>
              <p>Regards,<br><strong>Automated Monitoring System <br> TRW SUNS STEERING</strong></p>
            `,
      };

    default:
      return {
        subject: "Machine Alert",
        html: "<p>Unknown event occurred.</p>",
      };
  }
}