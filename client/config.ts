let Config = {
  apiHost: "",
};

if (process.env.NEXT_PUBLIC_NODE_ENV == "development") {
  Config.apiHost = process.env.NEXT_PUBLIC_DEV_API_HOST as string;
}

export default Config;
