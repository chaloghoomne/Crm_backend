import mongoose,{Schema,Document,models,model} from "mongoose";

const taskSchema = new Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
    },
    taskName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    clientName: {
        type: String,
        required: true,
    },
    client:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
        required: true,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
    },
    assignedToName:{
        type: String,
        required: true,
    },
    priority: {
        type: String,
        enum: ["Low", "High"],
        default: "Low",
    },
    status: {
        type: String,
        enum: ["Pending", "In Progress", "Completed"],
        default: "Pending",
    },
    dueDate: {
        type: Date,
        required: true,
    },
    }, { timestamps: true });

const Task = models.Task || model<Document>("Task",taskSchema);
export default Task;