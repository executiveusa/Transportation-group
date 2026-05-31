import type { DriverConfig } from "./types";

export function getDriverConfig(): DriverConfig {
  return {
    slug: process.env.DRIVER_SLUG ?? "bones",
    name: process.env.DRIVER_NAME ?? "Bones",
    phone: process.env.DRIVER_PHONE ?? "+523221175350",
    whatsapp: process.env.DRIVER_WHATSAPP ?? process.env.DRIVER_PHONE ?? "+523221175350",
    area: process.env.DRIVER_AREA ?? "Puerto Vallarta and surrounding",
    tagline: process.env.DRIVER_TAGLINE ?? "Your insider in Puerto Vallarta",
    // Separate number Bones uses to RECEIVE notifications (can be same as public number)
    notifyPhone: process.env.DRIVER_NOTIFY_PHONE ?? process.env.DRIVER_PHONE ?? "+523221175350",
  };
}
