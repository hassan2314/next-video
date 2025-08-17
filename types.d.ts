import { Connection } from "mongoose";

declare global {
  var mongoose: {
    promise: Promise<Connection> | null;
    conn: Connection | null;
  };
}

export {};
