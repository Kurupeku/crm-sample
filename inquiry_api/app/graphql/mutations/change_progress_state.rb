module Mutations
  class ChangeProgressState < BaseMutation
    argument :id, ID, required: true
    argument :event, Types::ProgressEventEnum, required: true

    type Types::ProgressType

    def resolve(id:, event:)
      progress = Progress.find id
      progress.send event
      progress.save! && progress
    end
  end
end
