import { Composition } from "remotion";
import { GiveawayVideo, TOTAL_FRAMES, FPS, W, H } from "./GiveawayVideo";

export const Root = () => (
  <Composition
    id="GiveawayVideo"
    component={GiveawayVideo}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={W}
    height={H}
  />
);
