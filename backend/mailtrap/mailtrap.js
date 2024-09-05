import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

// Load environment variables from a .env file into process.env
dotenv.config();

const TOKEN = process.env.MAILTRAP_TOKEN;

export const mailtrapClient = new MailtrapClient({
  token: TOKEN,
});

export const sender = {
  email: "mailtrap@demomailtrap.com",
  name: "Mailtrap Test",
};
