const WHITE_LIST = (process.env.ALLOW_ORIGIN || "").split(",");
const ALLOW_ALL_ORIGIN = "*";

export const CORS_OPTIONS: any = {
  origin: function (origin: string, callback: any) {
    if (
      process.env.ALLOW_ORIGIN === ALLOW_ALL_ORIGIN ||
      WHITE_LIST.includes(origin)
    ) {
      callback(null, true);
    } else {
      callback("Not allowed by CORS");
    }
  },
};
