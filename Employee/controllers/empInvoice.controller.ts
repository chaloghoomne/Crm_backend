import Invoice from "../../models/Invoice";

export const makeInvoice = async(req:any,res:any)=>{
    try{
        console.log(req.body);
        const invoice = await Invoice.create(req.body);
        console.log(invoice);
        return res.status(200).json({ message: "Invoice added successfully" });
    }catch(error:any){
        console.log(error)
        return res.status(500).json({ message: "Error fetching all company Emails", error });
    }
}