import Partnership from "../model/partner.model.js";

class PartnerRepository {
    async create(data){
        return await Partnership.create({...data,status: 'pending',verificationStatus: 'pending'});
    }

    async findAll(filters = {}){
        return await Partnership.find(filters).sort({createdAt: -1});
    }

    async findById(id){
        return await Partnership.findById(id);
    }

    async update(id, data){
        return await Partnership.findByIdAndUpdate(id, { status: 'inactive'},{new:true});
    }

    async approve(id) {
    return await Partnership.findByIdAndUpdate(
      id,
      { verificationStatus: 'verified', verifiedAt: new Date() },
      { new: true }
    );
  }

  async softDelete(id) {
    return await Partnership.findByIdAndUpdate(id, { status: 'inactive' }, { new: true });
  }

  async findPublic() {
    return await Partnership.find({ verificationStatus: 'verified', status: 'active' });
  }
}

export default new PartnerRepository();