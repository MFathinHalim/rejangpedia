import { Model, Schema, model, models } from "mongoose";

// Main post schema
const mainSchema = new Schema({
    id: String,
    Title: String,
    Image: String,
    Pembuat: String,
    Diedit: String,
    Link: String,
    Waktu: String,
    Edit: String,
    Location: {
        lat: String,
        lng: String
    },
    Content: {
        type: Schema.Types.Mixed, // Allows it to be either an array of objects or a string
        validate: {
            validator: function (value: any) {
                // Allow value to be either a string or an array of objects with the specific structure
                if (typeof value === "string") return true;
                if (Array.isArray(value)) {
                    return value.every(
                        (item) =>
                            typeof item.babTitle === "string" &&
                            typeof item.babContent === "string"
                    );
                }
                return false;
            },
            message: "Content must be either a string or an array of objects with babTitle and babContent fields.",
        },
    },
});

const mainModel: Model<Data> = models.mains || model<Data>("mains", mainSchema);
const goingModel: Model<Data> = models.ongoings || model<Data>("ongoings", mainSchema);

export { mainModel, goingModel };