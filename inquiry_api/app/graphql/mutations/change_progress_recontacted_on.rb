module Mutations
  class ChangeProgressRecontactedOn < BaseMutation
    argument :id, ID, required: true
    argument :recontacted_on, String, required: true

    type Types::ProgressType

    def resolve(id:, recontacted_on: nil)
      progress = Progress.find id
      progress.update!(recontacted_on: Date.parse(recontacted_on)) && progress
    end
  end
end
