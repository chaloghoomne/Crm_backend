import Lead from "../../models/Lead";
import mongoose from "mongoose";
import Operation from "../../models/Operations";

interface Result {
	string: number;
}

export const countLeads = async (req: any, res: any) => {
	const { id } = req.params;
	// console.log(id)
	try {
		const count = await Lead.aggregate([
			{
				$match: {
					leadBy: new mongoose.Types.ObjectId(id),
				},
			},
			{
				$count: "string",
			},
		]);
		// console.log(count);
		return res.status(200).json({ count: count[0]?.string || 0 });
	} catch (error: any) {
		console.log(error);
		return res.status(500).json({ message: "Error counting leads", error });
	}
};

export const assignedLeadsCount = async (req: any, res: any) => {
	const { id } = req.params;
	try {
		const count = await Lead.aggregate([
			{
				$match: {
					assignedEmpId: new mongoose.Types.ObjectId(id),
				},
			},
			{
				$count: "string",
			},
		]);
		return res.status(200).json({ count: count[0]?.string || 0 });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "Error Fetching Leads", err });
	}
};

export const leadStatusCount = async (req: any, res: any) => {
	const { id } = req.params;
	try {
		const count = await Lead.aggregate([
			{
				$match: {
					leadBy: new mongoose.Types.ObjectId(id),
				},
			},
			{
				$group: {
					_id: "$status",
          totalAmount: { $sum: "$price" },
					count: { $sum: 1 },
				},
			},
		]);
		return res.status(200).json({ count });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "Error Fetching Leads", err });
	}
};

export const assignedOperationsCount = async (req: any, res: any) => {
	const { id } = req.params;
	try {
		const count = await Operation.aggregate([
			{
				$match: {
					assignedEmpId: new mongoose.Types.ObjectId(id),
				},
			},
			{
				$count: "string",
			},
		]);
		return res.status(200).json({ count: count[0]?.string || 0 });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "Error Fetching Leads", err });
	}
};

export const OperationStatusCount = async (req: any, res: any) => {
	const { id } = req.params;
	try {
		const count = await Operation.aggregate([
			{
				$match: {
					assignedEmpId: new mongoose.Types.ObjectId(id),
				},
			},
			{
				$group: {
					_id: "$operationStatus",
          totalAmount: { $sum: "$price" },
					count: { $sum: 1 },
				},
			},
		]);
		return res.status(200).json({ count });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "Error Fetching Leads", err });
	}
};

export const agentLeadsCount = async(req:any,res:any) =>{
	try{
		const {id} = req.params;
		const count = await Lead.aggregate([
			{
				$match: {
					agent: new mongoose.Types.ObjectId(id),
				},
			},
			{
				$count: "string",
			},
		])
		return res.status(200).json({count:count[0]?.string || 0});
	}
	catch(err){
		console.log(err);
		return res.status(500).json({message:"Error fetching agent Leads",err});
	}
}

export const agentReportStatus = async(req:any,res:any)=>{
	const {id} = req.params;
	try{
		const status = await Lead.aggregate([
			{
				$match:{
					agent:new mongoose.Types.ObjectId(id)
				}
			},
			{
				$group:{
					_id:"$status",
					count:{$sum:1},
					totalAmount:{$sum:"$price"}
				}
			}
		])
		// console.log(status);
		return res.status(200).json({status});
	}catch(err){
		console.log(err);
		return res.status(500).json({message:"Error fetching agent report status",err});
	}
}

export const companyLeadsCount = async(req:any,res:any) =>{
	try{
		const {id} = req.params;
		const count = await Lead.aggregate([
			{
				$match: {
					companyId: new mongoose.Types.ObjectId(id),
				},
			},
			{
				$count: "string",
			},
		])
		return res.status(200).json({count:count[0]?.string || 0});
	}
	catch(err){
		console.log(err);
		return res.status(500).json({message:"Error fetching agent Leads",err});
	}
}

export const companyLeadsStatus = async(req:any,res:any)=>{
	const {id} = req.params;
	try{
		const status = await Lead.aggregate([
			{
				$match:{
					companyId:new mongoose.Types.ObjectId(id)
				}
			},
			{
				$group:{
					_id:"$status",
					count:{$sum:1},
					totalAmount:{$sum:"$price"}
				}
			}
		])
		// console.log(status);
		return res.status(200).json({status});
	}catch(err){
		console.log(err);
		return res.status(500).json({message:"Error fetching agent report status",err});
	}
}


