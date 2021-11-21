module Mutations
  class ChangeProgressRecontactedOn < BaseMutation
    argument :id, ID, required: true
    argument :recontacted_on, String, required: true

    type Types::ProgressType

    def resolve(id:, recontacted_on: nil)
      progress = Progress.find id
      progress.assign_recontacted_on! recontacted_on
      progress
    end
  end
end
