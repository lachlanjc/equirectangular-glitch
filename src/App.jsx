import React, { useState } from "react";
import useSound from "use-sound";
import { Card, Button, Spinner, TextArea } from "@radix-ui/themes";
import ReactPannellum from "react-pannellum";

const REPLICATE_PROXY = "https://replicate-api-proxy.glitch.me";

export async function getAIImage(prompt, width, height) {
  const data = {
    version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
    input: {
      prompt,
      width,
      height,
      format: "jpg",
    },
  };
  let url = REPLICATE_PROXY + "/create_n_get/";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  };
  return fetch(url, options)
    .then((res) => res.json())
    .then((res) => {
      if (res.output.length == 0) {
        console.error("Something went wrong");
        return null;
      } else {
        let imageURL = res.output[0];
        return imageURL;
      }
    })
    .catch((err) => {
      // activate parent promise's catch block by throwing an error
      throw new Error(err);
    });
}

export default function App() {
  const [playBite] = useSound("/bite.mp3");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [envUrl, setEnvUrl] = useState(
    "https://replicate.delivery/pbxt/wIIZFwhik0p1HxQgw2JwKhL5VrJNSRsRbs7ZkbPPvXg3RU5E/out-0.png",
  );

  return (
    <>
      <style>{`body { margin: 0; } .pnlm-container { width: 100vw !important; height: 100dvh !important; position: absolute; inset: 0; }`}</style>
      <ReactPannellum
        id="1"
        sceneId={envUrl}
        imageSource={envUrl}
        config={{ style: { width: "100vw" } }}
      />
      <Card
        style={{
          position: "absolute",
          top: "2rem",
          right: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <TextArea
          value={prompt}
          onChange={(e) => setPrompt(e.currentTarget.value)}
          placeholder="Forest in Sweden"
          style={{ width: 340 }}
        />

        <Button
          onClick={() => {
            playBite();
            setIsGenerating(true);
            getAIImage(`equirectangular photo of ${prompt}`, 2048, 512).then(
              (url) => {
                setEnvUrl(url);
                setIsGenerating(false);
              },
            );
          }}
          aria-busy={isGenerating}
        >
          {isGenerating ? <Spinner /> : "Generate"}
        </Button>
      </Card>
    </>
  );
}
