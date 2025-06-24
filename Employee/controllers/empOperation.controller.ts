import { title } from "process";
import Itinerary from "../../models/Itenaries";
import Lead from "../../models/Lead";
import Operation from "../../models/Operations";
import Supplier from "../../models/Supplier";
import Hotel from "../../models/Hotel";

export const assignLead = async(req:any,res:any)=>{
    try{
        // console.log(req.body);
        const {assignedEmpId,leadId,assignedEmpName,companyId} = req.body
        const operation1 = await Operation.findOne({leadId:leadId})
        if(operation1){
            if (operation1) {
                return res.status(500).json({ message: `Lead already assigned to ${operation1.assignedEmpName}` });
              }
              
        }
        const operation = await Operation.create({leadId,assignedEmpId,assignedEmpName,companyId});
        return res.status(200).json({ message: "Lead assigned successfully", operation });
    }catch(error:any){
        console.log(error)
        return res.status(500).json({ message: "Error Assigning Leads", error });
    }
}

export const getAssignedLeads = async(req:any,res:any)=>{
    try{
        // console.log(req.query);  
        const {companyId,empId} = req.query;
        // console.log(companyId,empId)
        const leads = await Operation.find({assignedEmpId:empId,companyId:companyId}).populate('leadId');
        // console.log(leads);
        return res.status(200).json(leads);
    }catch(error:any){
        console.log(error)
        return res.status(500).json({ message: "Error Assigning Leads", error });
    }
}

export const getItenaryLead = async(req:any,res:any)=>{
    try{
        // console.log(req.params.id);  
        const leads = await Operation.find({_id:req.params.id}).populate('leadId');
        // console.log(leads);
        return res.status(200).json(leads);
    }catch(error:any){
        console.log(error)
        return res.status(500).json({ message: "Error Assigning Leads", error });
    }
}

export const addSupplier = async(req:any,res:any)=>{
    try{
        console.log(req.body.finalValues);  
        const supplier = await Supplier.create(req.body.finalValues);
        console.log(supplier);
        return res.status(200).json({ message: "Supplier added successfully"});
    }catch(error:any){
        console.log(error)
        return res.status(500).json({ message: "Error Assigning Leads", error });
    }
}

export const getSuppliers = async(req:any,res:any)=>{
    try{
        console.log(req.params.id);
      const supplier = await Supplier.find({companyId:req.params.id});
      return res.status(200).json(supplier);
    }catch(error:any){
      console.log(error)
      return res.status(500).json({ message: "Error fetching all company Emails", error });
    }
  }

export const getSupplier = async(req:any,res:any)=>{
  try{
    console.log(req.params.id);
    const supplier = await Supplier.find({_id:req.params.id});
    return res.status(200).json(supplier);
  }catch(error:any){
    console.log(error)
    return res.status(500).json({ message: "Error fetching all company Emails", error });
  }
}

export const updateSupplier = async(req:any,res:any)=>{
  try{
    // console.log(req.params.id);  
    // console.log(req.body);
    const {finalValues} = req.body
    const supplier = await Supplier.findOneAndUpdate({_id:req.params.id},finalValues);
    // console.log(supplier);
    return res.status(200).json({ message: "Supplier updated successfully"});
  }catch(error:any){
    console.log(error)
    return res.status(500).json({ message: "Error Assigning Leads", error });
  }
}

export const addHotel = async(req:any,res:any)=>{
  try{
    // console.log(req.body);
    const hotel = await Hotel.create(req.body);
    return res.status(200).json({ message: "Hotel added successfully"});
  }catch(error:any){
    console.log(error)
    return res.status(500).json({ message: "Error Adding Hotel", error });
  }
}

export const getHotel = async(req:any,res:any)=>{
  try{
    // console.log(req.params.id);
    const hotel = await Hotel.find({companyId:req.params.id});
    return res.status(200).json(hotel);
  }catch(error:any){
    console.log(error)
    return res.status(500).json({ message: "Error fetching all company Emails", error });
  }
}

export const saveSupplierInfo = async(req:any,res:any)=>{
    try{
        // console.log(req.body);  
        const data = req.body.finalValues;
        const  Ops = await Operation.findOne({_id:data.leadId})
        // console.log(Ops);
        Ops.supplierId = data.supplierId;
        Ops.supplierPrice = data.supplierPrice;
        Ops.supplierName = data.supplierName;
        Ops.operationStatus = data.operationStatus;
        Ops.save();
        // const supplier = await Supplier.create(req.body.finalValues);
        // console.log(supplier);
        return res.status(200).json({ message: "Supplier Information added successfully"});
    }catch(error:any){
        console.log(error)
        return res.status(500).json({ message: "Error Assigning Leads", error });
    }
}
// Get all itineraries
export const getAllItineraries = async (req:any, res:any) => {
  try {
    console.log(req.params.id);
    const itineraries = await Itinerary.find({companyId:req.params.id});
    res.status(200).json(itineraries);
  } catch (error:any) {
    console.error('Error getting itineraries:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
  

export const createItinerary = async (req:any, res:any) => {
  try {
    // console.log(req.body);
    const {operationId,companyId, title,createdBy, description,  days, travelers, hotels, flights, visas } = req.body;
    // console.log(operationId,companyId, title, description,  days, travelers, hotels, flights, visas );
    
    // Check if lead exists
    const lead = await Operation.findById({_id:operationId});
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    
    // Generate shareable link
    // const shareableLink = generateShareableLink();
    
    const newItinerary = new Itinerary({
      title,
      description,
      operationId,
      companyId,    
      createdBy: createdBy, // Assuming user ID is available from auth middleware
      days: days || [],
      travelers: travelers || [],
      hotels: hotels || [],
      flights: flights || [],   
      visas: visas || [],
    //   shareableLink
    });
    
    const savedItinerary = await newItinerary.save();
    
    res.status(201).json(savedItinerary);
  } catch (error:any) {
    console.error('Error creating itinerary:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getItenaryData = async(req:any,res:any)=>{
  try{
      // console.log(req.params.id);  
      const leads = await Itinerary.find({operationId:req.params.id});
      // console.log(leads);
      return res.status(200).json(leads);
  }catch(error:any){
      console.log(error)
      return res.status(500).json({ message: "Error Assigning Leads", error });
  }
}