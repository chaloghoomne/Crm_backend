import Lead from "../../models/Lead";
import mongoose from "mongoose";
import Operation from "../../models/Operations";

interface Result {
	string: number;
}

export const countLeads = async (req: any, res: any) => {
	const { id } = req.params;
	const {start,end} = req.query;
	// console.log("Start Date:", start);
	// console.log("End Date:", end);
	// console.log("Date Range:", dateRange);
	// const [start, end] = dateRange.split(/,|to/).map((date: string) => new Date(date.trim()));
	// console.log(dateRange)
	// console.log(id)
	let dateFilter: any = {};

	if (start && end) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    // Validate the date objects
    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      dateFilter.createdAt = { $gte: startDate, $lte: endDate };
    }
  }
	try {
		const count = await Lead.aggregate([
      {
        $match: {
          leadBy: new mongoose.Types.ObjectId(id),
          ...dateFilter,
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
	const { start, end } = req.query;
	let dateFilter: any = {};

  if (start && end) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    // Validate the date objects
    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      dateFilter.createdAt = { $gte: startDate, $lte: endDate };
    }
  }
	try {
		const count = await Lead.aggregate([
      {
        $match: {
          assignedEmpId: new mongoose.Types.ObjectId(id),
          ...dateFilter,
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
	const { start, end } = req.query;
	let dateFilter: any = {};

  if (start && end) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    // Validate the date objects
    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      dateFilter.createdAt = { $gte: startDate, $lte: endDate };
    }
  }
	try {
		const count = await Lead.aggregate([
      {
        $match: {
          leadBy: new mongoose.Types.ObjectId(id),
          ...dateFilter,
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
	const { start, end } = req.query;
	let dateFilter: any = {};

  if (start && end) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    // Validate the date objects
    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      dateFilter.createdAt = { $gte: startDate, $lte: endDate };
    }
  }
	try {
		const count = await Operation.aggregate([
      {
        $match: {
          assignedEmpId: new mongoose.Types.ObjectId(id),
         ...dateFilter,
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
	const { start, end } = req.query;
	let dateFilter: any = {};

  if (start && end) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    // Validate the date objects
    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      dateFilter.createdAt = { $gte: startDate, $lte: endDate };
    }
  }
	try {
		const count = await Operation.aggregate([
      {
        $match: {
          assignedEmpId: new mongoose.Types.ObjectId(id),
          ...dateFilter,
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
		const { start, end } = req.query;
		let dateFilter: any = {};

    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);

      // Validate the date objects
      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        dateFilter.createdAt = { $gte: startDate, $lte: endDate };
      }
    }
		const count = await Lead.aggregate([
      {
        $match: {
          agent: new mongoose.Types.ObjectId(id),
          ...dateFilter,
        },
      },
      {
        $count: "string",
      },
    ]);
		return res.status(200).json({count:count[0]?.string || 0});
	}
	catch(err){
		console.log(err);
		return res.status(500).json({message:"Error fetching agent Leads",err});
	}
}

export const agentReportStatus = async(req:any,res:any)=>{
	const {id} = req.params;
	const { start, end } = req.query;
	let dateFilter: any = {};

  if (start && end) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    // Validate the date objects
    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      dateFilter.createdAt = { $gte: startDate, $lte: endDate };
    }
  }
	try{
		const status = await Lead.aggregate([
			{
				$match:{
					agent:new mongoose.Types.ObjectId(id),
					...dateFilter,
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
		const { start, end } = req.query;
		let dateFilter: any = {};

    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);

      // Validate the date objects
      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        dateFilter.createdAt = { $gte: startDate, $lte: endDate };
      }
    }
		const count = await Lead.aggregate([
      {
        $match: {
          companyId: new mongoose.Types.ObjectId(id),
          ...dateFilter,
        },
      },
      {
        $count: "string",
      },
    ]);
		return res.status(200).json({count:count[0]?.string || 0});
	}
	catch(err){
		console.log(err);
		return res.status(500).json({message:"Error fetching agent Leads",err});
	}
}

export const companyLeadsStatus = async(req:any,res:any)=>{
	const {id} = req.params;
	const { start, end } = req.query;
	let dateFilter: any = {};

  if (start && end) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    // Validate the date objects
    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      dateFilter.createdAt = { $gte: startDate, $lte: endDate };
    }
  }
	try{
		const status = await Lead.aggregate([
			{
				$match:{
					companyId:new mongoose.Types.ObjectId(id),
				...dateFilter,
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
export const empLeads = async(req:any,res:any)=>{
	// console.log("Fetching employee leads");
	const {id} = req.params;
	const { start, end } = req.query;
	let dateFilter: any = {};

  if (start && end) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    // Validate the date objects
    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      dateFilter.createdAt = { $gte: startDate, $lte: endDate };
    }
  }
  console.log("Date Filter:", dateFilter);
	// console.log("Employee ID:", id);
	try{
		const leads = await Lead.find({
			assignedEmpId:id,
			...dateFilter,})
		console.log(leads);
		const Operations = await Operation.find({
			assignedEmpId:id,...dateFilter}).populate('leadId');
			// console.log(Operations);
		return res.status(201).json({leads,Operations});
	}catch(err){
		console.log(err);
		return res.status(500).json({message:"Error fetching employee leads",err});
	}
}

export const empLeadsByCompany = async(req:any,res:any)=>{
	const {id} = req.params;
	const {start,end,page,limit} = req.query;
	const skip = (page - 1) * limit;
	let dateFilter: any = {};

  if (start && end) {
	 const startDate = new Date(start);
	 const endDate = new Date(end);

	 // Validate the date objects
	 if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
		dateFilter.createdAt = { $gte: startDate, $lte: endDate };
	 }
  }
  try{
		const leads = await Lead.find({
			companyId:id,
			...dateFilter,
		}).skip(skip).limit(limit).populate('assignedEmpId');
		const totalCount = await Lead.countDocuments({
			companyId:id,
			...dateFilter,
		});
		return res.status(200).json({
      page,
      leads,
      totalItems: totalCount,
      totalPages: Math.ceil(totalCount / limit),
    });
  }catch(err){
		console.log(err);
		return res.status(500).json({message:"Error fetching employee leads",err});
	}
}

export const empOperationsByCompany = async (req: any, res: any) => {
  const { id } = req.params;
  const start = req.query.start as string;
  const end = req.query.end as string;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  let dateFilter: any = {};

  console.log("Fetching operations for company ID:", id);
  console.log("Date Range:", start, end);
  console.log("Page:", page, "Limit:", limit);

  // Build date filter if valid range provided
  if (start && end) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      dateFilter.createdAt = { $gte: startDate, $lte: endDate };
    }
  }

  try {
    const leads = await Operation.find({
      companyId: id,
      ...dateFilter,
    })
      .skip(skip)
      .limit(limit)
      .populate("assignedEmpId");


    const totalCount = await Operation.countDocuments({
      companyId: id,
      ...dateFilter,
    });
    console.log("Total Operations Count:", totalCount);
    console.log("Operations Fetched:", leads.length);

    return res.status(200).json({
      page,
      leads,
      totalItems: totalCount,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (err) {
    console.error("Error fetching operations:", err);
    return res
      .status(500)
      .json({ message: "Error fetching employee leads", err });
  }
};



