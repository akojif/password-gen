import React, { useState } from "react";
import App from "./App";
import AppV1 from "./AppV1";

const VERSION_KEY = "pwd_gen_version";

export default function VersionWrapper() {
  const [version, setVersion] = useState(
    () => localStorage.getItem(VERSION_KEY) || "v2"
  );

  const handleSwitch = (v) => {
    setVersion(v);
    localStorage.setItem(VERSION_KEY, v);
  };

  return version === "v1" ? (
    <AppV1 version={version} onVersionSwitch={handleSwitch} />
  ) : (
    <App version={version} onVersionSwitch={handleSwitch} />
  );
}
