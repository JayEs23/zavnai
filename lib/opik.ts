import { Opik } from "opik";

export const opik = new Opik({
  projectName: "zavn-frontend",
});

export const trackEvent = async (name: string, input: any, output?: any) => {
  try {
    await opik.track({
      name,
      input,
      output,
    });
  } catch (error) {
    console.error("Failed to track Opik event:", error);
  }
};
