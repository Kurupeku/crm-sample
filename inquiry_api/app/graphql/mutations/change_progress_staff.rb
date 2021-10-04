module Mutations
  class ChangeProgressStaff < BaseMutation
    argument :id, ID, required: true
    argument :staff_id, Integer, required: true

    type Types::ProgressType

    def resolve(id:, staff_id:)
      progress = Progress.find id
      progress.update!(staff_id: staff_id) && progress
    end
  end
end
