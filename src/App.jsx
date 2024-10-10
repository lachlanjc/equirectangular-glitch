import React, { useState } from "react";
import useSound from "use-sound";
import { Card, Text, Button, Spinner, TextArea } from "@radix-ui/themes";

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
  const [envUrl, setEnvUrl] = useState(null);

  return (
    <>
      {envUrl ? (
        <img
          src={envUrl}
          style={{
            position: "fixed",
            inset: 0,
            objectFit: "cover",
            height: "100dvh",
          }}
        />
      ) : (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
          }}
        />
      )}
      <Card
        style={{
          position: "absolute",
          top: "2rem",
          left: "2rem",
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
