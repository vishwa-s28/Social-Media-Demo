import webpush from "web-push";
import "dotenv/config";
import { Op } from "sequelize";
import db from "../models/index";
const { Token } = db;

const publicVapidKey = process.env.PUBLIC_VAPID_KEY || "undefined";
const privateVapidKey = process.env.PRIVATE_VAPID_KEY || "undefined";

webpush.setVapidDetails(
  "mailto:test@test.com",
  publicVapidKey,
  privateVapidKey
);

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
}

const sendNotification = async (
  userId: string,
  payload: NotificationPayload
) => {
  try {
    const activeSessions = await Token.findAll({
      where: { user_id: userId, push_subscription: { [Op.ne]: null } },
    });

    activeSessions.forEach((session) => {
      const push_subscription = session.getDataValue("push_subscription");

      webpush
        .sendNotification(push_subscription, JSON.stringify(payload))
        .catch((err) => console.error("Push Error:", err));
    });
  } catch (error) {
    console.error(error);
  }
};
export default sendNotification;
