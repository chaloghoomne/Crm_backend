import Client from "../../models/Clients";
import Invoice from "../../models/Invoice";
import Product from "../../models/Products";
import Receipt from "../../models/Receipt";

export const makeInvoice = async (req: any, res: any) => {
	try {
		console.log(req.body);
		const invoice = await Invoice.create(req.body);
		console.log(invoice);
		return res.status(200).json({ message: "Invoice added successfully" });
	} catch (error: any) {
		console.log(error);
		return res
			.status(500)
			.json({ message: "Error fetching all company Emails", error });
	}
};

export const getQuotation = async (req: any, res: any) => {
	try {
		// console.log(req.body);
		const invoice = await Invoice.find({ companyId: req.params.id , isInvoice: false });
		// console.log(invoice);
		return res.status(200).json(invoice);
	} catch (err: any) {
		console.log(err);
		return res
			.status(500)
			.json({ message: "Error Fetching Invoices", err });
	}
};

export const getInvoice = async (req: any, res: any) => {
	try {
		// console.log(req.params.invoiceType);
		const invoice = await Invoice.find({ companyId: req.params.id , isInvoice: true,invoiceType:req.params.invoiceType });
		// console.log(invoice);
		return res.status(200).json(invoice);
	} catch (err: any) {
		console.log(err);
		return res
			.status(500)
			.json({ message: "Error Fetching Invoices", err });
	}
};
export const getSingleInvoice = async (req: any, res: any) => {
	try {
		// console.log(req.body);
		const invoice = await Invoice.find({ _id: req.params.id , isInvoice: true });
		// console.log(invoice);
		return res.status(200).json(...invoice);
	} catch (err: any) {
		console.log(err);
		return res
			.status(500)
			.json({ message: "Error Fetching Invoices", err });
	}
};

export const makeReceipt = async (req: any, res: any) => {

  try {
    // console.log("Request body:", req.body);
    const { invoiceId, amountPaid, receiptNumber } = req.body;

    if (!invoiceId || !amountPaid || !receiptNumber) {
    //   console.log("Missing required fields");
      return res.status(400).json({ message: "Missing required fields" });
    }

    const receipt = await Receipt.create(req.body);
    // console.log("Receipt created:", receipt);

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
    //   console.log("Invoice not found");
      return res.status(404).json({ message: "Invoice not found" });
    }

    // console.log("Found invoice:", invoice);
    const prevPaid = invoice.amountPaid || 0;
    const paidNow = typeof amountPaid === "string" ? parseFloat(amountPaid) : amountPaid;
    const newTotalPaid = prevPaid + paidNow;

    // console.log(`Previous paid: ${prevPaid}, Paid now: ${paidNow}, New total paid: ${newTotalPaid}`);

    invoice.amountPaid = newTotalPaid;

    if (newTotalPaid >= invoice.totalAmount) {
      invoice.status = "paid";
    } else if (newTotalPaid > 0) {
      invoice.status = "partially paid";
    } else {
      invoice.status = "unpaid";
    }

    // console.log("Updated invoice status to:", invoice.status);

    invoice.receipts = Array.isArray(invoice.receipts) ? invoice.receipts : [];
    if (!invoice.receipts.includes(receiptNumber)) {
      invoice.receipts.push(receiptNumber);
    //   console.log("Updated receipts list:", invoice.receipts);
    }

    await invoice.save();
    // console.log("Invoice updated and saved");

    return res.status(200).json({
      message: "Receipt created and invoice updated",
      receipt,
    });

  } catch (err: any) {
    console.error("Error in makeReceipt:", err.message || err);
    return res.status(500).json({ message: "Error receipt" });
  }
};

export const getAllReceipts = async(req:any,res:any)=>{
	try{
		const invoice = await Receipt.find({companyId:req.params.id,receiptType:req.params.receiptType});
		if(!invoice)return res.status(500).json({message:"No Receipts Found"});
		return res.status(200).json(invoice);
	}
	catch(err){
		console.log(err);
		return res.status(500).json({message:"Error Finding Receipts"});
	}
}

export const getInvoiceNumber = async(req:any,res:any)=>{
	try{


    const latestInvoice = await Invoice.findOne({ companyId:req.params.id })
      .sort({ invoiceNumber: -1 });

    let nextNumber = 1;
    if (latestInvoice?.invoiceNumber) {
      const match = latestInvoice.invoiceNumber.match(/\d+/);
      if (match) nextNumber = parseInt(match[0]) + 1;
    }

    const invoiceNumber = `#${nextNumber.toString().padStart(4, "0")}`;
    return res.json({ invoiceNumber });
	}catch(err){
		console.log(err);
	}
}

export const convertToInvoice = async (req: any, res: any) => {
	try {
		console.log(req.body);
		const invoice = await Invoice.findOne({ _id: req.params.id });
		if (!invoice) {
			return res
				.status(500)
				.json({ message: "Invoice not found"});
		}

		invoice.isInvoice = true;
		await invoice.save();
		return res.status(200).json({ message: "Invoice added successfully" });
	} catch (error: any) {
		console.log(error);
		return res
			.status(500)
			.json({ message: "Error fetching all company Emails", error });
	}
}

export const updateInvoiceStatus = async (req: any, res: any) => {
	try{
		const invoice = await Invoice.findById(req.params.id);
		invoice.status = req.body.status;
		await invoice.save();
		return res.status(200).json({ message: "Invoice Updated Successfully" });
	}catch(err){
		console.log(err);
		return res
		.status(500)
		.json({ message: "Error Fetching Invoices", err });
	}
}

export const deleteInvoice = async (req: any, res: any) => {
	try {
		// console.log(req.params.id);
		const invoice = await Invoice.findByIdAndDelete(req.params.id);
		// console.log(invoice);
		return res
			.status(200)
			.json({ message: "Invoice deleted successfully" });
	} catch (err: any) {
		// console.log(err);
		return res
			.status(500)
			.json({ message: "Error Fetching Invoices", err });
	}
};

export const saveClient = async (req: any, res: any) => {
	try {
		console.log(req.body);
		const email =  req.body.email;
		console.log(email)
		const client = await Client.findOne({email:req.body.email});
		if (client){
			client.name= req.body.name;
			client.email = req.body.email;
			client.address = req.body.address;
			client.phone = req.body.phone;
			await client.save();
			return res.status(200).json({ message: "Client Added Successfully" });
		}
			
			// return res.status(500).json({ message: "Client Already Exists" });
		const invoice = await Client.create(req.body);
		// console.log(invoice);
		return res.status(200).json({ message: "Client Added Successfully" });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: " Error Adding Client" });
	}
};

export const getClients = async (req: any, res: any) => {
	try {
		// console.log(req.body);
		const client = await Client.find({ companyId: req.params.id });
		// console.log(client)
		return res.status(200).json(client);
	} catch (err) {
		console.log(err);
		return res
			.status(500)
			.json({ message: "Clients Could  not be Fetched" });
	}
};

export const deleteClients = async (req:any,res:any) =>{
	try{
		console.log(req.params.id)
		await Client.findByIdAndDelete({_id:req.params.id})
		return res.status(200).json({message:"Client Deleted"});
	}
	catch(err){
		console.log(err);
		return res.status(500).json({message:"Error Deleting Client"});
	}
}
export const getProducts = async (req: any, res: any) => {
	try {
		// console.log("Products ki body", req.params.id);
		const client = await Product.find({ companyId: req.params.id });
		// console.log(client);
		return res.status(200).json(client);
	} catch (err) {
		console.log(err);
		return res
			.status(500)
			.json({ message: "Clients Could  not be Fetched" });
	}
};

export const saveProduct = async (req: any, res: any) => {
	try {
		console.log(req.body);
		const product = await Product.create({
			...req.body,
			companyId: req.params.id,
		});

		// console.log(product);
		return res.status(200).json({ message: "Product Added Successfully" });
	} catch (err) {
		console.log(err);
		return req.status(500).json({ message: "Error Adding Product" });
	}
};
