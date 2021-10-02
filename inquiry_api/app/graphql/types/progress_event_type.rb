module Types
  class ProgressEventType < Types::BaseObject
    field :label, String, null: false
    field :event, String, null: false
  end
end
