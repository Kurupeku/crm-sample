module Mutations
  class ChangeProgressState < BaseMutation
    argument :id, ID, required: true
    argument :event, Types::ProgressEventEnum, required: true

    type Types::ProgressType

    def resolve(id:, event:)
      progress = Progress.find id
      raise GraphQL::ExecutionError, I18n.t('errors.aasm.invalid_event') unless progress.send("may_#{event}?")

      progress.send event
      progress
    end
  end
end
