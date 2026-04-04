import * as fundAllocationService from "../services/fundAllocation.service.js";
import * as ngoService from "../services/ngo.service.js";

// Helper to enforce NGO isolation Hub
const getAuthorizedNgoId = async (req) => {
    if (req.user.role === 'admin') return req.params.id;
    if (req.user.role === 'ngo-admin') {
        const ngo = await ngoService.getNGOProfile(req.user.id);
        if (!ngo) throw new Error('NGO profile not found Hub');
        return ngo._id.toString();
    }
    throw new Error('Unauthorized operational access Hub');
};

// Create fund allocation (ngo-admin)
export const createAllocation = async (req, res) => {
    try {
        const userId = req.user?.id || null;
        const allocation = await fundAllocationService.createAllocation(
            req.body,
            userId
        );
        res.status(201).json(allocation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all fund allocations (admin)
export const getAllAllocations = async (req, res) => {
    try {
        const allocations = await fundAllocationService.getAllAllocations();
        res.json(allocations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single fund allocation
export const getAllocationById = async (req, res) => {
    try {
        const allocation = await fundAllocationService.getAllocationById(
            req.params.id
        );
        res.json(allocation);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Get fund allocations by NGO ID (ngo-admin)
export const getAllocationsByNgoId = async (req, res) => {
    try {
        const ngoId = await getAuthorizedNgoId(req);
        const allocations = await fundAllocationService.getAllocationsByNgoId(ngoId);
        res.json(allocations);
    } catch (error) {
        res.status(error.message === 'NGO profile not found Hub' ? 404 : 403).json({ message: error.message });
    }
};

// Get fund allocations by transaction ID
export const getAllocationsByTransactionId = async (req, res) => {
    try {
        const allocations = await fundAllocationService.getAllocationsByTransactionId(
            req.params.id
        );
        res.json(allocations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update fund allocation (ngo-admin)
export const updateAllocation = async (req, res) => {
    try {
        const userId = req.user?.id || null;
        const allocation = await fundAllocationService.updateAllocation(
            req.params.id,
            req.body,
            userId
        );
        res.json(allocation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete fund allocation (admin)
export const deleteAllocation = async (req, res) => {
    try {
        const userId = req.user?.id || null;
        await fundAllocationService.deleteAllocation(req.params.id, userId);
        res.json({ message: "Fund allocation deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get allocations by category (ngo-admin)
export const getAllocationsByCategory = async (req, res) => {
    try {
        const ngoId = await getAuthorizedNgoId(req);
        const allocations = await fundAllocationService.getAllocationsByCategory(ngoId);
        res.json(allocations);
    } catch (error) {
        res.status(error.message === 'NGO profile not found Hub' ? 404 : 403).json({ message: error.message });
    }
};

// Get total allocated amount by NGO
export const getTotalAllocated = async (req, res) => {
    try {
        const ngoId = await getAuthorizedNgoId(req);
        const total = await fundAllocationService.getTotalAllocated(ngoId);
        res.json({ totalAllocated: total });
    } catch (error) {
        res.status(error.message === 'NGO profile not found Hub' ? 404 : 403).json({ message: error.message });
    }
};
