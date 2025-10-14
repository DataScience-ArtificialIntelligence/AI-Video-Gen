import axios from "axios";

export const generateSlides = async ({ topic, slideCount, contentStyle, includeImages }) => {
  const res = await axios.post("http://localhost:5000/api/generate", {
    topic,
    slideCount,
    contentStyle,
    includeImages,
  });
  return res.data.slides;
};
