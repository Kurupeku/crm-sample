module Mutations
  class DeleteInquiry < BaseMutation
    argument :id, ID, required: true
    type Types::InquiryType

    def resolve(id:)
      inquiry = Inquiry.find(id)
      inquiry.destroy! && inquiry
    end
  end
end
