module Mutations
  class ChangeProgressState < BaseMutation
    argument :id, ID, required: true
    argument :event, Types::ProgressEventEnum, required: true

    type Types::ProgressType

    def resolve(id:, event:)
      menu = Menu.find id
      if menu.send("may_#{event}?")
        menu.send event
      else
        raise GraphQL::ExecutionError, I18n.t('errors.aasm.invalid_event')
      end
    end
  end
end
