import mongoose from "mongoose";

type CachedConnection = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongooseCache: CachedConnection | undefined;
}

const cache: CachedConnection = global.mongooseCache ?? { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cache;
}

export async function connectDb() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    return null;
  }

  if (cache.conn) {
    return cache.conn;
  }

  cache.promise ??= mongoose.connect(uri, {
    dbName: "adyapan"
  });

  cache.conn = await cache.promise;
  return cache.conn;
}

export function isMongoConfigured() {
  return Boolean(process.env.MONGODB_URI);
}
