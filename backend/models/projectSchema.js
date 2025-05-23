import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  githublink: String,
  projectlink: String,
  technologies: String,
  stack: String,
  deployed: String,

  image: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
});
export const Project = mongoose.model("Project", projectSchema);
