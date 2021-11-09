module Mutations
  class CreateInquiry < BaseMutation
    class CreateProgressInput < Types::BaseInputObject
      argument :rank, Integer, required: true
      argument :staff_id, Integer, required: false
    end

    argument :company_name, String, required: false
    argument :name, String, required: true
    argument :email, String, required: true
    argument :tel, String, required: true
    argument :number_of_users, Integer, required: true
    argument :introductory_term, String, required: true
    argument :detail, String, required: false
    argument :user_id, Integer, required: false
    argument :menu_ids, [Integer], required: false
    argument :progress, CreateProgressInput, required: false

    type Types::InquiryType

    def resolve(**args)
      inquiry = Inquiry.new inquiry_params(args)
      inquiry.build_progress progress_params(args[:progress]) if args[:progress].present?
      inquiry.save! && inquiry
    end

    private

    def inquiry_params(args)
      args.reject do |key, _|
        key == :progress
      end
    end

    def progress_params(progress)
      %i[rank staff_id].map do |key|
        [key, progress.send(key)]
      end.to_h
    end
  end
end
